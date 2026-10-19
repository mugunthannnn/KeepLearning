import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Brain, AlertTriangle, CheckCircle2, Play, Sparkles, Clock, HelpCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import { RiskBadge } from '../components/common/RiskBadge';
import { KnowledgeForecastChart } from '../components/predictions/KnowledgeForecastChart';

export const TopicDetails = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { topics, addTopicToRevisionPlan } = useData();

  const topic = topics?.find(t => t.id === topicId) || topics?.[0];

  if (!topic) {
    return (
      <div className="bg-white p-8 rounded-2xl text-center max-w-md mx-auto space-y-4">
        <h3 className="text-base font-bold text-slate-800">Topic Not Found</h3>
        <p className="text-xs text-slate-500">The requested topic could not be located.</p>
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

      {/* Topic Title Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-slate-500">{topic.subjectName}</span>
            <span className="text-slate-300">•</span>
            <RiskBadge level={topic.riskLevel} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">{topic.name}</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">{topic.description}</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => addTopicToRevisionPlan(topic.id)}
            className="px-4 py-2.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Add to Revision Plan
          </button>
          <button
            onClick={() => navigate(`/learn/${topic.id}`)}
            className="px-6 py-2.5 bg-teal-500 hover:bg-teal-400 text-[#0B1F33] text-xs font-extrabold rounded-xl shadow-sm transition-all flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-[#0B1F33]" />
            <span>Start Revision Session</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Current Knowledge</span>
          <span className="text-2xl font-extrabold text-[#0F172A]">{topic.knowledge}%</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Drift Probability</span>
          <span className="text-2xl font-extrabold text-rose-600">{topic.driftProbability}% {topic.riskLevel}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Memory Stability</span>
          <span className="text-2xl font-extrabold text-amber-600">{topic.stability}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Last Practiced</span>
          <span className="text-2xl font-extrabold text-slate-700">{topic.lastPracticed}</span>
        </div>
      </div>

      {/* Prediction Forecast Chart */}
      {topic.forecastData && topic.forecastData.length > 0 && (
        <KnowledgeForecastChart data={topic.forecastData} topicName={topic.name} />
      )}

      {/* RISK FACTORS & RECOMMENDED ACTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Why is topic at risk */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <span>Why is {topic.name} at risk?</span>
          </h3>

          <div className="space-y-3">
            {(topic.riskFactors || []).map((factor, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-rose-50/50 border border-rose-100 text-xs text-rose-900">
                <span className="w-4 h-4 rounded-full bg-rose-200 text-rose-700 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  ✓
                </span>
                <span className="font-medium">{factor}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Action */}
        <div className="bg-gradient-to-br from-[#0B1F33] to-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Recommended Action</span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">Revise {topic.name} Today</h3>
            <p className="text-xs text-slate-300 mb-6">
              Spend {topic.revisionTimeMinutes || 20} minutes to restore memory stability and prevent predicted 14-day knowledge decay.
            </p>

            <div className="grid grid-cols-2 gap-4 text-xs mb-6 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-400 block">Estimated Time:</span>
                <span className="font-bold text-teal-300">{topic.revisionTimeMinutes || 20} minutes</span>
              </div>
              <div>
                <span className="text-slate-400 block">Practice Questions:</span>
                <span className="font-bold text-teal-300">{topic.recommendedQuestions || 5} questions</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate(`/learn/${topic.id}`)}
            className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-[#0B1F33] text-xs font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-[#0B1F33]" />
            <span>Start Revision Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
