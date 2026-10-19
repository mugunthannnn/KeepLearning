import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Clock, Check, ArrowRight, Sparkles, HelpCircle, Loader2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import { apiClient } from '../api/apiClient';

export const Quiz = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { submitQuiz } = useData();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      try {
        const data = await apiClient.getQuiz(topicId || 'hashmap');
        setQuiz(data);
      } catch (err) {
        console.error('Failed to load quiz from API:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [topicId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSelectOption = (qId, optionIdx) => {
    setSelectedAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await submitQuiz(topicId || 'hashmap', selectedAnswers);
      navigate('/quiz-result');
    } catch (err) {
      console.error('Quiz submission failed:', err);
      navigate('/quiz-result');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-teal-500 mb-2" />
        <p className="text-xs font-semibold">Loading practice assessment...</p>
      </div>
    );
  }

  const questions = quiz?.questions || [];
  if (questions.length === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl text-center max-w-md mx-auto space-y-4">
        <h3 className="text-base font-bold text-slate-800">No Questions Available</h3>
        <p className="text-xs text-slate-500">Questions for this topic are currently being prepared.</p>
        <button
          onClick={() => navigate('/learning')}
          className="px-4 py-2 bg-teal-500 text-[#0B1F33] text-xs font-bold rounded-lg"
        >
          Back to Catalogue
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIdx];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Quiz Top Header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">{quiz.subjectName}</span>
          <h1 className="text-xl font-extrabold text-[#0F172A] tracking-tight">{quiz.topicName} Assessment</h1>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
        {/* Progress header */}
        <div>
          <div className="flex justify-between items-center text-xs font-bold text-slate-500 mb-2">
            <span>Question {currentIdx + 1} of {questions.length}</span>
            <span>{Math.round(((currentIdx + 1) / questions.length) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-teal-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Text */}
        <h2 className="text-lg font-bold text-[#0F172A] leading-snug">
          {currentQ.question}
        </h2>

        {/* Options List */}
        <div className="space-y-3">
          {currentQ.options.map((opt, optIdx) => {
            const isSelected = selectedAnswers[currentQ.id] === optIdx;
            return (
              <div
                key={optIdx}
                onClick={() => handleSelectOption(currentQ.id, optIdx)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between text-xs font-semibold ${
                  isSelected
                    ? 'border-teal-500 bg-teal-50/40 text-[#0B1F33]'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full font-bold flex items-center justify-center text-xs ${
                    isSelected ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span>{opt}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-teal-600 stroke-[3]" />}
              </div>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          <button
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx(prev => prev - 1)}
            className="px-4 py-2 text-xs font-bold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 transition-colors"
          >
            Previous
          </button>

          {currentIdx < questions.length - 1 ? (
            <button
              onClick={() => setCurrentIdx(prev => prev + 1)}
              className="px-6 py-2.5 bg-[#0B1F33] hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-all flex items-center gap-1.5"
            >
              <span>Next Question</span>
              <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
            </button>
          ) : (
            <button
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="px-8 py-3 bg-teal-500 hover:bg-teal-400 text-[#0B1F33] font-extrabold text-xs rounded-lg shadow-md transition-all flex items-center gap-2 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#0B1F33]" />
                  <span>Evaluating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#0B1F33]" />
                  <span>Submit Assessment</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
