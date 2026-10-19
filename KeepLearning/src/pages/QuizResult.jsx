import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Trophy, CheckCircle2, AlertTriangle, ArrowRight, RotateCcw, CalendarCheck, Check, X } from 'lucide-react';
import { useData } from '../context/DataContext';

export const QuizResult = () => {
  const navigate = useNavigate();
  const { lastQuizResult, addTopicToRevisionPlan } = useData();

  // Fallback payload if user directly navigates
  const result = lastQuizResult || {
    topicId: 'hashmap',
    topicName: 'HashMap Internal Mechanics',
    subjectName: 'Data Structures',
    score: 80,
    correctCount: 4,
    totalQuestions: 5,
    beforeKnowledge: 64,
    afterKnowledge: 72,
    knowledgeDiff: 8,
    conceptsBreakdown: [
      { name: "Hashing & Bucket Indexing", score: 90, status: "Strong" },
      { name: "Collision Handling (Chaining)", score: 60, status: "Needs Review" },
      { name: "HashMap Methods (put/get)", score: 55, status: "At Risk" },
      { name: "Treeify Threshold & Rehashing", score: 75, status: "Stable" }
    ],
    aiInsight: "You understand the core hashing mechanism well, but collision handling and rehashing thresholds need additional practice.",
    questionResults: []
  };

  const handleAddToRevision = () => {
    addTopicToRevisionPlan(result.topicId);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Overall Score Header */}
      <div className="bg-[#0B1F33] text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl text-center relative overflow-hidden">
        <div className="w-12 h-12 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center mx-auto mb-3">
          <Trophy className="w-6 h-6 text-teal-400" />
        </div>

        <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">{result.subjectName} Assessment</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">{result.topicName} Results</h1>

        <div className="flex items-center justify-center gap-8 mt-6 pt-6 border-t border-slate-800">
          <div>
            <span className="text-xs text-slate-400 block">Assessment Score</span>
            <span className="text-3xl font-black text-white">{result.score}%</span>
          </div>
          <div className="w-px h-10 bg-slate-800" />
          <div>
            <span className="text-xs text-slate-400 block">Knowledge Recovery</span>
            <span className="text-2xl font-black text-teal-400">
              {result.knowledgeDiff >= 0 ? `+${result.knowledgeDiff}%` : `${result.knowledgeDiff}%`}
            </span>
          </div>
          <div className="w-px h-10 bg-slate-800" />
          <div>
            <span className="text-xs text-slate-400 block">Before → After</span>
            <span className="text-base font-bold text-slate-200">{result.beforeKnowledge}% → {result.afterKnowledge}%</span>
          </div>
        </div>
      </div>

      {/* AI Insight Box */}
      <div className="bg-gradient-to-r from-teal-50 to-sky-50 border border-teal-200 p-5 rounded-xl text-xs text-slate-800 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-teal-900 mb-1">AI Retention Intelligence Insight</h4>
          <p className="leading-relaxed text-slate-700">{result.aiInsight}</p>
        </div>
      </div>

      {/* Detailed Question Review if available */}
      {result.questionResults && result.questionResults.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#0F172A]">Question-Level Performance</h3>
          <div className="space-y-3">
            {result.questionResults.map((qr, idx) => (
              <div
                key={qr.questionId || idx}
                className={`p-4 rounded-xl border text-xs ${
                  qr.isCorrect ? 'bg-emerald-50/40 border-emerald-200' : 'bg-rose-50/40 border-rose-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="font-bold text-slate-900">
                    <span className="mr-1.5 text-slate-500">Q{idx + 1}.</span>
                    {qr.question}
                  </p>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] shrink-0 ${
                    qr.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {qr.isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>
                {qr.explanation && (
                  <p className="text-[11px] text-slate-600 mt-1 pl-4 border-l-2 border-slate-300">
                    <strong className="text-slate-700">Explanation:</strong> {qr.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Concept Breakdown Table */}
      {result.conceptsBreakdown && result.conceptsBreakdown.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
          <h3 className="text-sm font-bold text-[#0F172A] mb-4">Concept Breakdown Performance</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Sub-Concept</th>
                  <th className="py-3 px-4 text-right">Score</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {result.conceptsBreakdown.map((c, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-semibold text-slate-900">{c.name}</td>
                    <td className="py-3 px-4 text-right font-bold">{c.score}%</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        c.status === 'Strong'
                          ? 'bg-emerald-100 text-emerald-800'
                          : c.status === 'Stable'
                          ? 'bg-sky-100 text-sky-800'
                          : c.status === 'Needs Review'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          onClick={() => navigate(`/quiz/${result.topicId}`)}
          className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors flex items-center justify-center gap-1.5"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Retake Quiz</span>
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleAddToRevision}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-[#0B1F33] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <CalendarCheck className="w-4 h-4 text-teal-400" />
            <span>Add to Revision Plan</span>
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto px-6 py-2.5 bg-teal-500 hover:bg-teal-400 text-[#0B1F33] text-xs font-extrabold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
          >
            <span>Return to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
