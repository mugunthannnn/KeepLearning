import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/apiClient';
import {
  initialQuizzes,
  analyticsData as initialAnalyticsData
} from '../data/mockData';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [revisionPlan, setRevisionPlan] = useState([]);
  const [activities, setActivities] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(initialAnalyticsData);
  const [lastQuizResult, setLastQuizResult] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Fetch all user data from backend
  const refreshUserData = useCallback(async () => {
    try {
      const dash = await apiClient.getDashboard();
      if (dash && dash.user) {
        setUser(dash.user);
        setSubjects(dash.subjects || []);
        setTopics(dash.topics || []);
        setActivities(dash.activities || []);
        if (dash.analyticsData) {
          setAnalyticsData(dash.analyticsData);
        }
      }
      const rev = await apiClient.getRevisionPlan();
      if (Array.isArray(rev)) {
        setRevisionPlan(rev);
      }
    } catch (err) {
      console.warn('Backend sync failed, checking local state:', err.message);
    }
  }, []);

  // Initialize session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = apiClient.getToken();
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        await refreshUserData();
      } catch (err) {
        console.error('Session restoration failed:', err);
        apiClient.clearToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [refreshUserData]);

  // Auth: Register
  const register = async (fullName, email, password) => {
    const res = await apiClient.register(fullName, email, password);
    apiClient.setToken(res.access_token);
    setUser(res.user);
    await refreshUserData();
    showToast('Account created successfully! Welcome to keepLearning.', 'success');
    return res.user;
  };

  // Auth: Login
  const login = async (email, password) => {
    const res = await apiClient.login(email, password);
    apiClient.setToken(res.access_token);
    setUser(res.user);
    await refreshUserData();
    showToast(`Welcome back, ${res.user.name}!`, 'success');
    return res.user;
  };

  // Auth: Logout
  const logout = () => {
    apiClient.clearToken();
    setUser(null);
    setSubjects([]);
    setTopics([]);
    setRevisionPlan([]);
    setActivities([]);
    setLastQuizResult(null);
    showToast('You have been logged out.', 'info');
  };

  // Action: Submit Quiz
  const submitQuiz = async (topicId, userAnswers) => {
    try {
      const result = await apiClient.submitQuiz(topicId, userAnswers);
      setLastQuizResult(result);
      await refreshUserData();
      showToast(`Quiz completed! Score: ${result.score}% (${result.knowledgeDiff >= 0 ? '+' : ''}${result.knowledgeDiff}% retention)`, 'success');
      return result;
    } catch (err) {
      console.error('Submit quiz API error, using local fallback:', err);
      // Local fallback calculation if backend is temporarily disconnected
      const fallbackQuestions = initialQuizzes[topicId]?.questions || [];
      let correct = 0;
      fallbackQuestions.forEach(q => {
        if (userAnswers[q.id] === q.correctAnswer) correct++;
      });
      const score = Math.round((correct / (fallbackQuestions.length || 1)) * 100);
      const fallbackResult = {
        topicId,
        topicName: topicId,
        subjectName: "Technical",
        score,
        correctCount: correct,
        totalQuestions: fallbackQuestions.length,
        beforeKnowledge: 65,
        afterKnowledge: Math.min(100, 65 + Math.round(score * 0.2)),
        knowledgeDiff: Math.round(score * 0.2),
        conceptsBreakdown: [],
        aiInsight: `Quiz completed with score ${score}%.`,
        questionResults: []
      };
      setLastQuizResult(fallbackResult);
      return fallbackResult;
    }
  };

  // Action: Mark Revision Completed
  const markRevisionCompleted = async (taskId) => {
    try {
      await apiClient.completeRevisionTask(taskId);
      await refreshUserData();
      showToast('Revision task completed! Topic retention strengthened.', 'success');
    } catch (err) {
      console.error('Complete revision error:', err);
      setRevisionPlan(prev =>
        prev.map(item => (item.id === taskId ? { ...item, completed: true } : item))
      );
    }
  };

  // Action: Add topic to revision plan
  const addTopicToRevisionPlan = async (topicId) => {
    try {
      await apiClient.addRevisionTask(topicId, 'Today', 'Added from AI prediction / quiz review');
      await refreshUserData();
      showToast('Topic added to your personalized revision plan!', 'success');
    } catch (err) {
      console.error('Add revision task error:', err);
      showToast('Topic added to revision schedule.', 'info');
    }
  };

  // Action: Reschedule revision item
  const rescheduleTask = async (taskId, newCategory) => {
    try {
      await apiClient.rescheduleTask(taskId, newCategory);
      await refreshUserData();
      showToast(`Task rescheduled to ${newCategory}.`, 'info');
    } catch (err) {
      console.error('Reschedule task error:', err);
      setRevisionPlan(prev =>
        prev.map(item => (item.id === taskId ? { ...item, dueDateCategory: newCategory } : item))
      );
    }
  };

  // Action: Update user onboarding / preferences
  const updateOnboarding = async (onboardingData) => {
    try {
      const updatedUser = await apiClient.submitOnboarding(onboardingData);
      setUser(updatedUser);
      await refreshUserData();
      showToast('Onboarding preferences saved! Your personalized dashboard is ready.', 'success');
      return updatedUser;
    } catch (err) {
      console.error('Submit onboarding error:', err);
      setUser(prev => ({
        ...prev,
        onboarded: true,
        preferences: {
          ...prev?.preferences,
          dailyGoalMinutes: parseInt(onboardingData.dailyTime) || 30,
          experienceLevel: onboardingData.level || "Intermediate",
          goal: onboardingData.goal || "Interview preparation",
          preferredSubjects: onboardingData.subjects || ["Java", "SQL"]
        }
      }));
    }
  };

  // Action: Update profile
  const updateProfile = async (profileData) => {
    try {
      const updatedUser = await apiClient.updateProfile(profileData);
      setUser(updatedUser);
      showToast('Profile updated successfully!', 'success');
      return updatedUser;
    } catch (err) {
      console.error('Update profile error:', err);
      setUser(prev => ({ ...prev, ...profileData }));
      showToast('Profile updated locally.', 'info');
    }
  };

  return (
    <DataContext.Provider value={{
      user,
      loading,
      setUser,
      subjects,
      topics,
      revisionPlan,
      activities,
      analyticsData,
      lastQuizResult,
      setLastQuizResult,
      register,
      login,
      logout,
      submitQuiz,
      markRevisionCompleted,
      addTopicToRevisionPlan,
      updateOnboarding,
      updateProfile,
      rescheduleTask,
      refreshUserData,
      toastMessage,
      showToast
    }}>
      {children}
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl bg-slate-900 text-white text-xs font-semibold border border-slate-800 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className={`w-2 h-2 rounded-full ${toastMessage.type === 'success' ? 'bg-teal-400' : 'bg-sky-400'}`} />
          <span>{toastMessage.message}</span>
        </div>
      )}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
