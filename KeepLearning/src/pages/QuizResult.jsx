
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  CalendarDays,
  Trophy,
  History,
  Clock3,
  BookOpen,
  RefreshCw,
  GraduationCap
} from 'lucide-react';
import { useData } from '../context/DataContext';

const formatDate = (value) => {
  if (!value) return 'Date unavailable';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return 'Date unavailable';

  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getAttemptId = (attempt, index) =>
  attempt.id || attempt._id || `${attempt.topicId || 'quiz'}-${index}`;

export const QuizResult = ({ historyOnly = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    lastQuizResult,
    addTopicToRevisionPlan,
    quizHistory = [],
    refreshQuizHistory
  } = useData();

  const isHistoryPage =
    historyOnly || location.pathname === '/quiz-history';

  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');

  const loadHistory = async () => {
    if (typeof refreshQuizHistory !== 'function') return;

    setHistoryLoading(true);
    setHistoryError('');

    try {
      await refreshQuizHistory();
    } catch (error) {
      console.error('Failed to load quiz history:', error);
      setHistoryError('Unable to load quiz history. Please try again.');
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (isHistoryPage) {
      loadHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHistoryPage]);

  const attempts = useMemo(() => {
    const items = Array.isArray(quizHistory) ? quizHistory : [];

    return [...items].sort((a, b) => {
      const dateA = new Date(a.timestamp || a.createdAt || 0).getTime();
      const dateB = new Date(b.timestamp || b.createdAt || 0).getTime();
      return dateB - dateA;
    });
  }, [quizHistory]);

  const averageScore = attempts.length
    ? Math.round(
        attempts.reduce(
          (sum, item) => sum + (Number(item.score) || 0),
          0
        ) / attempts.length
      )
    : 0;

  const bestScore = attempts.length
    ? Math.max(...attempts.map(item => Number(item.score) || 0))
    : 0;

  const result = lastQuizResult;

  const handleAddToRevision = async () => {
    if (!result?.topicId) return;

    try {
      await addTopicToRevisionPlan(result.topicId);
    } catch (error) {
      console.error('Could not add topic to revision plan:', error);
    }
  };

  // Shared My Learning header and tabs.
  const LearningNavigation = () => (
    <>
      <div className="pb-4 border-b border-slate-200/80">
        <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
          My Learning
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Explore your subjects and track your quiz performance.
        </p>
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => navigate('/learning')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
            !isHistoryPage
              ? 'border-teal-500 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          Explore Topics
        </button>

        <button
          onClick={() => navigate('/quiz-history')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
            isHistoryPage
              ? 'border-teal-500 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <History className="w-4 h-4" />
          Quiz History
        </button>
      </div>
    </>
  );

  // Quiz History page.
  if (isHistoryPage) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 pb-8">
        <LearningNavigation />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Quiz History
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Track your previous tests, scores and learning progress.
            </p>
          </div>

          <button
            onClick={loadHistory}
            disabled={historyLoading}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCw
              className={`w-4 h-4 ${
                historyLoading ? 'animate-spin' : ''
              }`}
            />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <History className="w-4 h-4" />
              Tests completed
            </div>
            <p className="text-3xl font-bold text-slate-900 mt-3">
              {attempts.length}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <BookOpen className="w-4 h-4" />
              Average score
            </div>
            <p className="text-3xl font-bold text-teal-700 mt-3">
              {averageScore}%
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Trophy className="w-4 h-4" />
              Best score
            </div>
            <p className="text-3xl font-bold text-slate-900 mt-3">
              {bestScore}%
            </p>
          </div>
        </div>

        {historyError && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {historyError}
          </div>
        )}

        <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-900">Previous tests</h2>
            <p className="text-sm text-slate-500 mt-1">
              Your latest quiz attempts appear first.
            </p>
          </div>

          {historyLoading && attempts.length === 0 ? (
            <div className="p-10 text-center">
              <RefreshCw className="w-7 h-7 text-teal-600 animate-spin mx-auto mb-3" />
              <p className="text-sm text-slate-500">
                Loading your quiz history...
              </p>
            </div>
          ) : attempts.length === 0 ? (
            <div className="p-10 text-center">
              <History className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-800">
                No quiz attempts yet
              </h3>
              <p className="text-sm text-slate-500 mt-2">
                Complete your first quiz and it will appear here.
              </p>
              <button
                onClick={() => navigate('/learning')}
                className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold"
              >
                Explore topics
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {attempts.map((attempt, index) => {
                const score = Number(attempt.score) || 0;
                const correct = Number(attempt.correctCount) || 0;
                const total = Number(attempt.totalQuestions) || 0;

                return (
                  <div
                    key={getAttemptId(attempt, index)}
                    className="p-5 flex flex-col md:flex-row md:items-center gap-4"
                  >
                    <div className="w-11 h-11 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                      <Trophy className="w-5 h-5 text-teal-700" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 truncate">
                        {attempt.topicName || 'Quiz'}
                      </h3>

                      <p className="text-sm text-slate-500 mt-1">
                        {attempt.subjectName || 'General'}
                      </p>

                      <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
                        <Clock3 className="w-3.5 h-3.5" />
                        {formatDate(
                          attempt.timestamp || attempt.createdAt
                        )}
                      </p>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-5">
                      <div>
                        <p className="text-xs text-slate-500">
                          Correct answers
                        </p>
                        <p className="text-sm font-semibold text-slate-800 mt-1">
                          {correct}
                          {total > 0 ? ` / ${total}` : ''}
                        </p>
                      </div>

                      <div className="min-w-20 text-right">
                        <p className="text-xs text-slate-500">Score</p>
                        <p
                          className={`text-xl font-bold mt-1 ${
                            score >= 80
                              ? 'text-emerald-600'
                              : score >= 50
                                ? 'text-amber-600'
                                : 'text-rose-600'
                          }`}
                        >
                          {score}%
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    );
  }

  // Current quiz result page.
  if (!result) {
    return (
      <div className="max-w-lg mx-auto mt-8 bg-white border border-slate-200 rounded-2xl p-7 text-center">
        <Trophy className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <h1 className="text-xl font-bold text-slate-900">
          No quiz result available
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Complete a quiz to view your score and feedback.
        </p>
        <button
          onClick={() => navigate('/learning')}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-teal-600 text-white text-sm font-semibold"
        >
          Explore topics <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const score = Number(result.score) || 0;
  const correctCount = Number(result.correctCount) || 0;
  const totalQuestions = Number(result.totalQuestions) || 0;
  const questionResults = result.questionResults || [];
  const concepts = result.conceptsBreakdown || [];

  return (
    <div className="max-w-3xl mx-auto space-y-5 pb-8">
      <button
        onClick={() => navigate('/dashboard')}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4" />
        Dashboard
      </button>

      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8">
        <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center mb-4">
          <Trophy className="w-6 h-6 text-teal-700" />
        </div>

        <p className="text-xs font-semibold text-teal-700 uppercase tracking-wide">
          Quiz completed
        </p>

        <h1 className="text-2xl font-bold text-slate-900 mt-1">
          {result.topicName || 'Quiz results'}
        </h1>

        {result.subjectName && (
          <p className="text-sm text-slate-500 mt-1">
            {result.subjectName}
          </p>
        )}

        <div className="grid grid-cols-2 gap-4 mt-7">
          <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
            <p className="text-sm text-slate-500">Your score</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">
              {score}%
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
            <p className="text-sm text-slate-500">Correct answers</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">
              {correctCount}
              <span className="text-base text-slate-400">
                {totalQuestions > 0 ? ` / ${totalQuestions}` : ''}
              </span>
            </p>
          </div>
        </div>

        {result.knowledgeDiff !== undefined && (
          <p className="text-sm text-slate-600 mt-4">
            Knowledge change:{' '}
            <span className="font-semibold text-teal-700">
              {Number(result.knowledgeDiff) > 0 ? '+' : ''}
              {result.knowledgeDiff}%
            </span>
          </p>
        )}

        {result.aiInsight && (
          <div className="mt-5 rounded-xl bg-teal-50 border border-teal-100 p-4">
            <h2 className="text-sm font-semibold text-teal-900">
              Feedback
            </h2>
            <p className="text-sm text-teal-900/80 mt-1 leading-relaxed">
              {result.aiInsight}
            </p>
          </div>
        )}
      </section>

      {questionResults.length > 0 && (
        <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">
          <h2 className="text-lg font-bold text-slate-900">
            Answer review
          </h2>
          <p className="text-sm text-slate-500 mt-1 mb-5">
            Check which answers were correct and review the explanations.
          </p>

          <div className="space-y-4">
            {questionResults.map((question, index) => (
              <div
                key={question.questionId || index}
                className="border-b border-slate-100 last:border-0 pb-4 last:pb-0"
              >
                <div className="flex items-start gap-3">
                  {question.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  )}

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">
                      {index + 1}. {question.question}
                    </p>
                    <p
                      className={`text-xs font-semibold mt-1 ${
                        question.isCorrect
                          ? 'text-emerald-700'
                          : 'text-rose-700'
                      }`}
                    >
                      {question.isCorrect ? 'Correct' : 'Incorrect'}
                    </p>

                    {question.explanation && (
                      <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                        {question.explanation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {concepts.length > 0 && (
        <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6">
          <h2 className="text-lg font-bold text-slate-900">
            Topics to improve
          </h2>

          <div className="mt-4 space-y-4">
            {concepts
              .filter(concept =>
                concept.status === 'Needs Review' ||
                concept.status === 'At Risk' ||
                Number(concept.score) < 70
              )
              .map((concept, index) => (
                <div
                  key={`${concept.name}-${index}`}
                  className="flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {concept.name}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {concept.status || 'Needs practice'}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-rose-700 shrink-0">
                    {concept.score}%
                  </span>
                </div>
              ))}

            {concepts.every(concept =>
              concept.status !== 'Needs Review' &&
              concept.status !== 'At Risk' &&
              Number(concept.score) >= 70
            ) && (
              <p className="text-sm text-slate-500">
                No weak concepts were identified in this result.
              </p>
            )}
          </div>
        </section>
      )}

      <section className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleAddToRevision}
          disabled={!result.topicId}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold disabled:opacity-50"
        >
          <CalendarDays className="w-4 h-4" />
          Add to revision
        </button>

        <button
          onClick={() => navigate('/quiz-history')}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-teal-200 bg-teal-50 hover:bg-teal-100 text-teal-800 text-sm font-semibold"
        >
          <History className="w-4 h-4" />
          My Learning
        </button>

        <button
          onClick={() => navigate('/dashboard')}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold"
        >
          Dashboard <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};
