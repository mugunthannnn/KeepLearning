
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react';

import { apiClient } from '../api/apiClient';
import { analyticsData as initialAnalyticsData } from '../data/mockData';

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
  const [quizHistory, setQuizHistory] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Clear all account-specific frontend state.
  const resetUserData = useCallback(() => {
    setUser(null);
    setSubjects([]);
    setTopics([]);
    setRevisionPlan([]);
    setActivities([]);
    setAnalyticsData(initialAnalyticsData);
    setLastQuizResult(null);
    setQuizHistory([]);
  }, []);

  // Fetch saved quiz attempts for the authenticated user.
  const refreshQuizHistory = useCallback(async () => {
    try {
      const response = await apiClient.getQuizHistory();

      // Support both a direct array and an API response containing data.
      const history = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.history)
            ? response.history
            : [];

      setQuizHistory(history);
      return history;
    } catch (err) {
      console.error('Failed to load quiz history:', err);
      throw err;
    }
  }, []);

  // Fetch fresh data for the currently authenticated user.
  const refreshUserData = useCallback(async () => {
    const dash = await apiClient.getDashboard();

    if (!dash || !dash.user) {
      throw new Error('Unable to load your account dashboard.');
    }

    setUser(dash.user);
    setSubjects(dash.subjects || []);
    setTopics(dash.topics || []);
    setActivities(dash.activities || []);
    setAnalyticsData(dash.analyticsData || initialAnalyticsData);

    // Load revision plan separately.
    try {
      const revisionData = await apiClient.getRevisionPlan();

      if (Array.isArray(revisionData)) {
        setRevisionPlan(
          revisionData.filter(
            (task) => task && task.id && task.userId
          )
        );
      } else {
        setRevisionPlan([]);
      }
    } catch (err) {
      console.error('Failed to load revision plan:', err);
      setRevisionPlan([]);
    }

    // Quiz history is fetched from the backend, not generated from topics.
    try {
      await refreshQuizHistory();
    } catch (err) {
      // Keep the dashboard usable if history cannot be loaded.
      setQuizHistory([]);
    }

    return dash;
  }, [refreshQuizHistory]);

  // Restore an existing session.
  useEffect(() => {
    let active = true;

    const initializeAuth = async () => {
      const token = apiClient.getToken();

      if (!token) {
        if (active) {
          resetUserData();
          setLoading(false);
        }
        return;
      }

      try {
        await refreshUserData();
      } catch (err) {
        console.error('Failed to restore session:', err);
        apiClient.clearToken();

        if (active) {
          resetUserData();
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      active = false;
    };
  }, [refreshUserData, resetUserData]);

  // Auth: Register.
  const register = async (fullName, email, password) => {
    const res = await apiClient.register(fullName, email, password);

    // Never carry previous account data into a new session.
    resetUserData();
    apiClient.setToken(res.access_token);
    setUser(res.user);

    try {
      await refreshUserData();
    } catch (err) {
      apiClient.clearToken();
      resetUserData();
      throw err;
    }

    showToast(
      'Account created successfully! Welcome to keepLearning.',
      'success'
    );

    return res.user;
  };

  // Auth: Login.
  const login = async (email, password) => {
    const res = await apiClient.login(email, password);

    // Clear the previous account before loading the new one.
    resetUserData();
    apiClient.setToken(res.access_token);
    setUser(res.user);

    try {
      await refreshUserData();
    } catch (err) {
      apiClient.clearToken();
      resetUserData();
      throw err;
    }

    showToast(`Welcome back, ${res.user.name}!`, 'success');

    return res.user;
  };

  // Auth: Logout.
  const logout = () => {
    apiClient.clearToken();
    resetUserData();

    showToast('You have been logged out.', 'info');
  };

  // Action: Submit Quiz.
  const submitQuiz = async (topicId, userAnswers) => {
    let result;

    // Only a successful backend response counts as a saved quiz result.
    try {
      result = await apiClient.submitQuiz(topicId, userAnswers);
    } catch (err) {
      console.error('Quiz submission failed:', err);

      showToast(
        'Unable to submit quiz. Please check your connection and try again.',
        'error'
      );

      throw err;
    }

    setLastQuizResult(result);

    // Refresh dashboard data after the quiz.
    try {
      await refreshUserData();
    } catch (err) {
      console.warn(
        'Quiz submitted, but dashboard refresh failed:',
        err
      );

      // Try refreshing the history independently.
      try {
        await refreshQuizHistory();
      } catch (historyError) {
        console.warn(
          'Quiz submitted, but history refresh failed:',
          historyError
        );
      }
    }

    showToast(
      `Quiz completed! Score: ${result.score}%`,
      'success'
    );

    return result;
  };

  // Action: Mark Revision Completed.
  const markRevisionCompleted = async (taskId) => {
    try {
      await apiClient.completeRevisionTask(taskId);
      await refreshUserData();

      showToast(
        'Revision task completed! Topic retention strengthened.',
        'success'
      );
    } catch (err) {
      console.error('Complete revision error:', err);

      setRevisionPlan((prev) =>
        prev.map((item) =>
          item.id === taskId
            ? { ...item, completed: true }
            : item
        )
      );
    }
  };

  // Action: Add topic to revision plan.
  const addTopicToRevisionPlan = async (topicId) => {
    try {
      await apiClient.addRevisionTask(
        topicId,
        'Today',
        'Added from AI prediction / quiz review'
      );

      await refreshUserData();

      showToast(
        'Topic added to your personalized revision plan!',
        'success'
      );
    } catch (err) {
      console.error('Add revision task error:', err);

      showToast(
        'Unable to add the revision task. Please try again.',
        'error'
      );
    }
  };

  // Action: Reschedule revision item.
  const rescheduleTask = async (taskId, newCategory) => {
    try {
      await apiClient.rescheduleTask(taskId, newCategory);
      await refreshUserData();

      showToast(`Task rescheduled to ${newCategory}.`, 'info');
    } catch (err) {
      console.error('Reschedule task error:', err);

      setRevisionPlan((prev) =>
        prev.map((item) =>
          item.id === taskId
            ? { ...item, dueDateCategory: newCategory }
            : item
        )
      );
    }
  };

  // Action: Update user onboarding / preferences.
  const updateOnboarding = async (onboardingData) => {
    try {
      const updatedUser =
        await apiClient.submitOnboarding(onboardingData);

      setUser(updatedUser);
      await refreshUserData();

      showToast(
        'Onboarding preferences saved! Your personalized dashboard is ready.',
        'success'
      );

      return updatedUser;
    } catch (err) {
      console.error('Submit onboarding error:', err);

      setUser((prev) => ({
        ...prev,
        onboarded: true,
        preferences: {
          ...prev?.preferences,
          dailyGoalMinutes:
            parseInt(onboardingData.dailyTime, 10) || 30,
          experienceLevel:
            onboardingData.level || 'Intermediate',
          goal:
            onboardingData.goal || 'Interview preparation',
          preferredSubjects:
            onboardingData.subjects || ['Java', 'SQL']
        }
      }));
    }
  };

  // Action: Update profile.
  const updateProfile = async (profileData) => {
    try {
      const updatedUser =
        await apiClient.updateProfile(profileData);

      setUser(updatedUser);

      showToast('Profile updated successfully!', 'success');

      return updatedUser;
    } catch (err) {
      console.error('Update profile error:', err);

      setUser((prev) => ({ ...prev, ...profileData }));

      showToast('Profile updated locally.', 'info');
    }
  };

  return (
    <DataContext.Provider
      value={{
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

        // Quiz history for Header recommendations and history page.
        quizHistory,
        refreshQuizHistory,

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
      }}
    >
      {children}

      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl bg-slate-900 text-white text-xs font-semibold border border-slate-800 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span
            className={`w-2 h-2 rounded-full ${
              toastMessage.type === 'success'
                ? 'bg-teal-400'
                : toastMessage.type === 'error'
                  ? 'bg-rose-400'
                  : 'bg-sky-400'
            }`}
          />
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
