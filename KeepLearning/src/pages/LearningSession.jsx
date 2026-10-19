import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, BookOpen, CheckCircle, Code, HelpCircle, ArrowRight, Play, Sparkles } from 'lucide-react';
import { useData } from '../context/DataContext';

export const LearningSession = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { topics } = useData();

  const [isUnderstood, setIsUnderstood] = useState(false);
  const topic = topics?.find(t => t.id === topicId) || topics?.[0];

  if (!topic) {
    return (
      <div className="bg-white p-8 rounded-2xl text-center max-w-md mx-auto space-y-4">
        <h3 className="text-base font-bold text-slate-800">Topic Not Found</h3>
        <p className="text-xs text-slate-500">The requested learning topic could not be loaded.</p>
        <button
          onClick={() => navigate('/learning')}
          className="px-4 py-2 bg-teal-500 text-[#0B1F33] text-xs font-bold rounded-lg"
        >
          Back to Catalogue
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
        <button
          onClick={() => navigate(`/topic/${topic.id}`)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Exit Revision Session</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span>Subject: <strong className="text-slate-800">{topic.subjectName}</strong></span>
        </div>
      </div>

      {/* Reader Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar: Syllabus Nav */}
        <div className="lg:col-span-1 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2">Key Concepts Outline</h3>
          <div className="space-y-1">
            {topic.concepts && topic.concepts.length > 0 ? (
              topic.concepts.map((c, idx) => (
                <div key={idx} className="p-2.5 rounded-lg text-xs font-semibold bg-slate-50 text-slate-700 flex items-center justify-between">
                  <span className="truncate pr-2">{c.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded shrink-0 ${
                    c.status === 'Strong' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {c.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-2.5 text-xs text-slate-500">Topic Overview</div>
            )}
          </div>
        </div>

        {/* Main Content View */}
        <div className="lg:col-span-3 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">Revision Lesson Module</span>
            <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight mt-1">{topic.name}</h1>
          </div>

          <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed space-y-4">
            <p className="whitespace-pre-line font-normal">
              {topic.lesson?.content || topic.description}
            </p>
          </div>

          {topic.lesson?.codeSnippet && (
            <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 text-slate-100 font-mono text-xs overflow-x-auto">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800 text-[11px] text-slate-400">
                <span>Code Example / Implementation</span>
                <Code className="w-3.5 h-3.5 text-teal-400" />
              </div>
              <pre className="text-teal-300 whitespace-pre">
                {topic.lesson.codeSnippet}
              </pre>
            </div>
          )}

          {/* Understood and Take Quiz Actions */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => setIsUnderstood(!isUnderstood)}
              className={`w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
                isUnderstood
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
            >
              <CheckCircle className={`w-4 h-4 ${isUnderstood ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>{isUnderstood ? 'Marked as Understood' : 'Mark Concept as Understood'}</span>
            </button>

            <button
              onClick={() => navigate(`/quiz/${topic.id}`)}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#0B1F33] hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>Take Practice Quiz Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
