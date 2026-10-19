import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Play } from 'lucide-react';
import { useData } from '../context/DataContext';
import { RiskBadge } from '../components/common/RiskBadge';

export const SubjectDetails = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { subjects, topics } = useData();

  const subject = subjects?.find(s => s.id === subjectId) || subjects?.[0];
  const subjectTopics = (topics || []).filter(t => 
    subject && (t.subjectId === subject.id || t.subjectName?.toLowerCase().includes(subject.id.toLowerCase()))
  );

  if (!subject) {
    return (
      <div className="bg-white p-8 rounded-2xl text-center max-w-md mx-auto space-y-4">
        <h3 className="text-base font-bold text-slate-800">Subject Not Found</h3>
        <p className="text-xs text-slate-500">The requested subject could not be located.</p>
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
      {/* Back button */}
      <button
        onClick={() => navigate('/learning')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to My Learning</span>
      </button>

      {/* Subject Banner Card */}
      <div className="bg-[#0B1F33] text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold uppercase tracking-wider mb-3">
              {subject.category}
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">{subject.name}</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              {subject.description}
            </p>
          </div>

          <div className="flex items-center gap-6 bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Subject Knowledge</span>
              <span className="text-2xl font-extrabold text-teal-400">{subject.knowledge}%</span>
            </div>
            <div className="w-px h-8 bg-slate-700" />
            <div>
              <span className="text-slate-400 block text-[11px]">Topic Risk Level</span>
              <div className="mt-1">
                <RiskBadge level={subject.riskLevel} size="sm" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Topics Breakdown List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100">
          <h2 className="text-lg font-bold text-[#0F172A]">Subject Topics & Retention Status</h2>
          <span className="text-xs text-slate-500 font-semibold">{subjectTopics.length} Topics</span>
        </div>

        <div className="space-y-4">
          {subjectTopics.map((topic) => (
            <div
              key={topic.id}
              className="p-4 sm:p-5 rounded-xl border border-slate-200/80 hover:border-slate-300 hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1.5">
                  <h3 className="text-base font-bold text-[#0F172A]">{topic.name}</h3>
                  <RiskBadge level={topic.riskLevel} size="sm" />
                </div>
                <p className="text-xs text-slate-500 line-clamp-1 mb-3">{topic.description}</p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                  <span>Knowledge: <strong className="text-slate-900">{topic.knowledge}%</strong></span>
                  <span>•</span>
                  <span>Drift Risk: <strong className="text-rose-600">{topic.driftProbability}%</strong></span>
                  <span>•</span>
                  <span>Last Practiced: <strong className="text-slate-900">{topic.lastPracticed}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:self-center">
                <button
                  onClick={() => navigate(`/topic/${topic.id}`)}
                  className="px-3.5 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                >
                  View Forecast
                </button>
                <button
                  onClick={() => navigate(`/learn/${topic.id}`)}
                  className="px-4 py-2 text-xs font-bold bg-teal-500 hover:bg-teal-400 text-[#0B1F33] rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-[#0B1F33]" />
                  <span>Start Session</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
