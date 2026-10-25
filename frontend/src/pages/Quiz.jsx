
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  LoaderCircle,
  Send
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { apiClient } from '../api/apiClient';

const QUIZ_DURATION = 300;

const getStorageKey = (topicId) => `keeplearning_quiz_progress_${topicId}`;

const getSavedProgress = (topicId) => {
  try {
    const saved = localStorage.getItem(getStorageKey(topicId));
    if (!saved) return null;

    const parsed = JSON.parse(saved);

    // Expired or invalid progress should not be restored.
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      typeof parsed.expiresAt !== 'number' ||
      parsed.expiresAt <= Date.now()
    ) {
      localStorage.removeItem(getStorageKey(topicId));
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

export const Quiz = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { submitQuiz } = useData();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const storageKey = getStorageKey(topicId);

  // Restore saved progress before starting the timer.
  useEffect(() => {
    const saved = getSavedProgress(topicId);

    if (saved) {
      setCurrentIdx(
        Number.isInteger(saved.currentIdx) && saved.currentIdx >= 0
          ? saved.currentIdx
          : 0
      );
      setSelectedAnswers(
        saved.selectedAnswers &&
        typeof saved.selectedAnswers === 'object'
          ? saved.selectedAnswers
          : {}
      );
      setTimeLeft(
        Math.max(
          0,
          Math.min(QUIZ_DURATION, Math.ceil((saved.expiresAt - Date.now()) / 1000))
        )
      );
    } else {
      setCurrentIdx(0);
      setSelectedAnswers({});
      setTimeLeft(QUIZ_DURATION);
    }
  }, [topicId]);

  // Load questions for the selected topic.
  useEffect(() => {
    let active = true;

    const fetchQuiz = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await apiClient.getQuiz(topicId);

        if (active) {
          setQuiz(data);
        }
      } catch (err) {
        console.error('Failed to load quiz:', err);

        if (active) {
          setError('Unable to load this quiz. Please try again.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchQuiz();

    return () => {
      active = false;
    };
  }, [topicId]);

  // Save progress whenever the learner changes answers or questions.
  useEffect(() => {
    if (loading || !quiz?.questions?.length || isSubmitting) return;

    const existing = getSavedProgress(topicId);

    // Keep the original expiry time so refreshing does not reset the timer.
    const expiresAt = existing?.expiresAt ?? (Date.now() + QUIZ_DURATION * 1000);

    const progress = {
      currentIdx,
      selectedAnswers,
      expiresAt
    };

    try {
      localStorage.setItem(storageKey, JSON.stringify(progress));
    } catch (err) {
      console.error('Unable to save quiz progress:', err);
    }
  }, [
    topicId,
    storageKey,
    quiz,
    loading,
    currentIdx,
    selectedAnswers,
    isSubmitting
  ]);

  // Countdown timer. Time continues to pass while the page is refreshed.
  useEffect(() => {
    if (loading || !quiz?.questions?.length || timeLeft <= 0 || isSubmitting) {
      return;
    }

    const timer = setInterval(() => {
      const saved = getSavedProgress(topicId);

      if (saved) {
        const remaining = Math.max(
          0,
          Math.ceil((saved.expiresAt - Date.now()) / 1000)
        );
        setTimeLeft(remaining);
      } else {
        setTimeLeft((previous) => Math.max(0, previous - 1));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, quiz, timeLeft, isSubmitting, topicId]);

  const questions = quiz?.questions || [];
  const safeCurrentIdx = Math.min(
    Math.max(0, currentIdx),
    Math.max(0, questions.length - 1)
  );
  const currentQuestion = questions[safeCurrentIdx];

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    if (isSubmitting || questions.length === 0) return;

    if (timeLeft <= 0) {
      setError('Your quiz time has expired. Please submit your answers.');
    }

    setIsSubmitting(true);
    setError('');

    try {
      await submitQuiz(topicId, selectedAnswers);
      localStorage.removeItem(storageKey);
      navigate('/quiz-result');
    } catch (err) {
      console.error('Quiz submission failed:', err);
      setError(err?.message || 'Could not submit your quiz. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[300px] flex flex-col items-center justify-center gap-3 text-slate-500">
        <LoaderCircle className="w-7 h-7 animate-spin text-teal-600" />
        <p className="text-sm">Loading quiz...</p>
      </div>
    );
  }

  if (error && !quiz) {
    return (
      <div className="max-w-lg mx-auto bg-white border border-slate-200 rounded-2xl p-6 text-center">
        <p className="font-semibold text-slate-900">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-semibold"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="max-w-lg mx-auto bg-white border border-slate-200 rounded-2xl p-6 text-center">
        <h2 className="font-semibold text-slate-900">No questions available</h2>
        <p className="text-sm text-slate-500 mt-2">
          This topic does not have a quiz available yet.
        </p>
        <button
          onClick={() => navigate('/learning')}
          className="mt-4 px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-semibold"
        >
          Back to learning
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5 pb-8">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-teal-700 uppercase tracking-wide">
              {quiz?.subjectName || 'Assessment'}
            </p>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
              {quiz?.topicName || 'Practice Quiz'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Answer each question and submit when you're ready.
            </p>
          </div>

          <div
            className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold ${
              timeLeft < 60
                ? 'bg-rose-50 text-rose-700'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            <Clock className="w-4 h-4" />
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Question {safeCurrentIdx + 1} of {questions.length}</span>
            <span>
              {Math.round(((safeCurrentIdx + 1) / questions.length) * 100)}%
            </span>
          </div>

          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-600 rounded-full transition-all"
              style={{
                width: `${((safeCurrentIdx + 1) / questions.length) * 100}%`
              }}
            />
          </div>
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7">
        <h2 className="text-lg font-semibold text-slate-900 leading-relaxed">
          {currentQuestion.question}
        </h2>

        <div className="mt-5 space-y-3">
          {(currentQuestion.options || []).map((option, index) => {
            const selected = selectedAnswers[currentQuestion.id] === index;

            return (
              <button
                key={index}
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                  setSelectedAnswers((previous) => ({
                    ...previous,
                    [currentQuestion.id]: index
                  }));
                }}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left text-sm transition-colors disabled:opacity-60 ${
                  selected
                    ? 'border-teal-600 bg-teal-50 text-slate-900'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    selected
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </span>

                <span className="flex-1">{option}</span>

                {selected && (
                  <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {error && (
          <p role="alert" className="mt-4 text-sm text-rose-600">
            {error}
          </p>
        )}

        <div className="flex items-center justify-between gap-3 mt-7 pt-5 border-t border-slate-100">
          <button
            type="button"
            disabled={safeCurrentIdx === 0 || isSubmitting}
            onClick={() => setCurrentIdx((index) => Math.max(0, index - 1))}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 disabled:opacity-40"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          {safeCurrentIdx < questions.length - 1 ? (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() =>
                setCurrentIdx((index) =>
                  Math.min(questions.length - 1, index + 1)
                )
              }
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 disabled:opacity-50"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 disabled:opacity-50"
            >
              {isSubmitting ? (
                <LoaderCircle className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {isSubmitting ? 'Submitting...' : 'Submit quiz'}
            </button>
          )}
        </div>

        <p className="text-xs text-slate-400 mt-4 text-center">
          {Object.keys(selectedAnswers).length} of {questions.length} questions answered
        </p>
      </section>
    </div>
  );
};
