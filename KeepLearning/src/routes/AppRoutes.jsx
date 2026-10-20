
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from '../pages/Landing';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { Onboarding } from '../pages/Onboarding';
import { AppShell } from '../components/layout/AppShell';
import { Dashboard } from '../pages/Dashboard';
import { Learning } from '../pages/Learning';
import { SubjectDetails } from '../pages/SubjectDetails';
import { TopicDetails } from '../pages/TopicDetails';
import { LearningSession } from '../pages/LearningSession';
import { Quiz } from '../pages/Quiz';
import { QuizResult } from '../pages/QuizResult';
import { Predictions } from '../pages/Predictions';
import { RevisionPlan } from '../pages/RevisionPlan';
import { Analytics } from '../pages/Analytics';
import { Profile } from '../pages/Profile';
import { useData } from '../context/DataContext';
import { Sparkles } from 'lucide-react';

const ProtectedLayout = () => {
  const { user, loading } = useData();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1F33] flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 rounded-2xl bg-teal-500 text-[#0B1F33] flex items-center justify-center font-black animate-pulse mb-4">
          <Sparkles className="w-6 h-6 text-[#0B1F33]" />
        </div>
        <p className="text-sm font-semibold text-slate-300">
          Loading your knowledge workspace...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <AppShell />;
};

const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useData();

  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;

  return children;
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Landing />} />

      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        }
      />

      <Route path="/onboarding" element={<Onboarding />} />

      {/* Authenticated Application Shell */}
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Existing topic learning page remains available */}
        <Route path="/learning" element={<Learning />} />

        <Route path="/learning/:subjectId" element={<SubjectDetails />} />
        <Route path="/topic/:topicId" element={<TopicDetails />} />
        <Route path="/learn/:topicId" element={<LearningSession />} />
        <Route path="/quiz/:topicId" element={<Quiz />} />

        {/* Current quiz result */}
        <Route path="/quiz-result" element={<QuizResult />} />

        {/* My Learning opens quiz history using the same component */}
        <Route
          path="/quiz-history"
          element={<QuizResult historyOnly />}
        />

        <Route path="/predictions" element={<Predictions />} />
        <Route path="/revision-plan" element={<RevisionPlan />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Fallback redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
