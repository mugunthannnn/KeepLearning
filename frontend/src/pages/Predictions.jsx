import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Brain, AlertTriangle, Play, ChevronRight, LineChart } from 'lucide-react';
import { useData } from '../context/DataContext';
import { RiskBadge } from '../components/common/RiskBadge';
import { KnowledgeForecastChart } from '../components/predictions/KnowledgeForecastChart';

export const Predictions = () => {
  const navigate = useNavigate();
  const { topics, addTopicToRevisionPlan } = useData();
  const [selectedTopicId, setSelectedTopicId] = useState(topics?.[0]?.id || 'hashmap');

  const selectedTopic = topics?.find(t => t.id === selectedTopicId) || topics?.[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200/80">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-teal-600 fill-teal-600" />
          <span>Predictive AI Knowledge Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">AI Knowledge Insights & Predictions</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
          Real-time mathematical forecasting of topic decay based on Ebbinghaus spaced repetition, practice gaps, and historical accuracy.
        </p>
      </div>

      {/* Main Selected Topic Forecast Chart */}
      {selectedTopic && selectedTopic.forecastData && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#0F172A]">Knowledge Drift Forecast Curve: {selectedTopic.name}</h2>
            <span className="text-xs text-slate-500">Select any topic below to inspect individual curves</span>
          </div>
          <KnowledgeForecastChart data={selectedTopic.forecastData} topicName={selectedTopic.name} />
        </div>
      )}

      {/* Grid of AI Prediction Cards */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-[#0F172A]">All Topic Predictions & Drift Risk</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(topics || []).map((t) => {
            const isSelected = t.id === selectedTopic?.id;
            return (
              <div
                key={t.id}
                onClick={() => setSelectedTopicId(t.id)}
                className={`bg-white rounded-2xl border-2 p-6 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected ? 'border-teal-500 ring-2 ring-teal-500/20' : 'border-slate-200/80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-500">{t.subjectName}</span>
                    <RiskBadge level={t.riskLevel} />
                  </div>

                  <h3 className="text-lg font-bold text-[#0F172A] mb-1">{t.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4">{t.description}</p>

                  <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs mb-4">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Current Knowledge</span>
                      <span className="font-extrabold text-slate-900">{t.knowledge}%</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Predicted (7 Days)</span>
                      <span className="font-extrabold text-rose-600">
                        {t.forecastData?.[2]?.predictedWithoutRev ?? Math.max(10, t.knowledge - 14)}%
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1.5 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Drift Probability:</span>
                      <span className="font-bold text-rose-600">{t.driftProbability}% {t.riskLevel}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Memory Stability:</span>
                      <span className="font-semibold text-teal-700">{t.stability}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addTopicToRevisionPlan(t.id);
                    }}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 hover:underline"
                  >
                    + Add to Revision
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/learn/${t.id}`);
                    }}
                    className="px-3.5 py-2 bg-teal-500 hover:bg-teal-400 text-[#0B1F33] text-xs font-extrabold rounded-lg transition-colors flex items-center gap-1"
                  >
                    <span>Revise</span>
                    <Play className="w-3 h-3 fill-[#0B1F33]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
