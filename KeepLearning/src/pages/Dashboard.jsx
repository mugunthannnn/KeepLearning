import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Brain,
  ShieldAlert,
  Flame,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  AlertTriangle,
  Clock,
  Play
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { StatCard } from '../components/common/StatCard';
import { RiskBadge } from '../components/common/RiskBadge';
import { ProgressBar } from '../components/common/ProgressBar';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user, subjects, topics, activities, analyticsData } = useData();
  const [timeFilter, setTimeFilter] = useState('30d');

  // Find highest risk priority topic for Today's Priority section
  const priorityTopic = (topics && topics.length > 0)
    ? (topics.find(t => t.riskLevel === 'Critical' || t.riskLevel === 'High') || topics[0])
    : null;

  const firstName = (user?.name || "Student").split(' ')[0];

  return (
    <div className="space-y-8">
      {/* Welcome Greeting Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Good morning, {firstName} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Here's what your knowledge retention and predicted drift look like today.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/predictions')}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-400 fill-teal-400" />
            <span>View AI Insights</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Knowledge Score"
          value={`${user?.knowledgeScore ?? 70}%`}
          subtext="Target retention >= 80%"
          icon={Brain}
          trend="up"
          trendValue="+4%"
          accentColor="teal"
        />
        <StatCard
          title="Memory Retention Rate"
          value={`${user?.retentionRate ?? 75}%`}
          subtext="Stability Index: Good"
          icon={CheckCircle2}
          trend="up"
          trendValue="+2%"
          accentColor="sky"
        />
        <StatCard
          title="Topics at Risk"
          value={user?.topicsAtRiskCount ?? 0}
          subtext="Requires revision within 48h"
          icon={ShieldAlert}
          trend={user?.topicsAtRiskCount > 0 ? "down" : "up"}
          trendValue={`${user?.topicsAtRiskCount ?? 0} topics`}
          accentColor="amber"
        />
        <StatCard
          title="Learning Streak"
          value={`${user?.learningStreak ?? 1} days`}
          subtext="Consistent active retention"
          icon={Flame}
          trend="up"
          trendValue="Active"
          accentColor="rose"
        />
      </div>

      {/* TODAY'S PRIORITY AI RECOMMENDATION BANNER */}
      {priorityTopic ? (
        <div className="relative rounded-2xl bg-linear-to-r from-[#0B1F33] via-slate-900 to-[#081726] text-white p-6 sm:p-8 shadow-xl border border-slate-800 overflow-hidden">
          {/* Glow backdrop */}
          <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold uppercase tracking-wider mb-4">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>Today's Priority AI Recommendation</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
                {priorityTopic.name}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                {priorityTopic.riskFactors?.[0] || `Estimated retention is dropping. A practice gap of ${priorityTopic.lastPracticedDaysAgo ?? 3} days has elapsed.`}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-xs text-slate-300">
                <div>
                  <span className="text-slate-400 block text-[11px]">Drift Probability</span>
                  <span className="text-rose-400 font-extrabold text-lg">{priorityTopic.driftProbability}% {priorityTopic.riskLevel}</span>
                </div>
                <div className="w-px h-8 bg-slate-700 hidden sm:block" />
                <div>
                  <span className="text-slate-400 block text-[11px]">Recommended Action</span>
                  <span className="text-teal-300 font-bold">{priorityTopic.revisionTimeMinutes || 20} min revision + {priorityTopic.recommendedQuestions || 5} practice questions</span>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <button
                onClick={() => navigate(`/learn/${priorityTopic.id}`)}
                className="w-full sm:w-auto px-6 py-3.5 bg-teal-500 hover:bg-teal-400 text-[#0B1F33] font-extrabold text-sm rounded-xl shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-[#0B1F33]" />
                <span>Revise Now</span>
              </button>
              <button
                onClick={() => navigate(`/topic/${priorityTopic.id}`)}
                className="w-full sm:w-auto px-6 py-3.5 bg-slate-800/80 hover:bg-slate-700/80 text-white font-semibold text-sm rounded-xl border border-slate-700 transition-all text-center"
              >
                View Forecast Curve
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Welcome to keepLearning!</h3>
            <p className="text-xs text-slate-400 mt-1">Start by exploring our technical curriculum and take your first assessment.</p>
          </div>
          <button
            onClick={() => navigate('/learning')}
            className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-[#0B1F33] text-xs font-bold rounded-xl"
          >
            Explore Subjects
          </button>
        </div>
      )}

      {/* KNOWLEDGE OVERVIEW CHART */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-[#0F172A]">Knowledge Trend Overview</h3>
            <p className="text-xs text-slate-500 mt-0.5">Historical average retention score progression</p>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-semibold text-slate-600">
            {['7d', '30d', '3m'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeFilter(tf)}
                className={`px-3 py-1 rounded-md transition-all ${
                  timeFilter === tf
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                {tf === '7d' ? '7 Days' : tf === '30d' ? '30 Days' : '3 Months'}
              </button>
            ))}
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analyticsData?.knowledgeGrowthHistory || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="label" stroke="#94A3B8" fontSize={12} tickLine={false} />
              <YAxis domain={[30, 100]} stroke="#94A3B8" fontSize={12} tickLine={false} unit="%" />
              <Tooltip />
              <Line type="monotone" dataKey="overall" name="Overall Knowledge" stroke="#14B8A6" strokeWidth={3} dot={{ r: 4, fill: '#14B8A6' }} />
              <Line type="monotone" dataKey="java" name="Java" stroke="#38BDF8" strokeWidth={2} strokeDasharray="3 3" />
              <Line type="monotone" dataKey="sql" name="SQL" stroke="#F59E0B" strokeWidth={2} strokeDasharray="3 3" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SUBJECT CARDS & RECENT ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Subject Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#0F172A]">My Enrolled Subjects</h3>
            <button
              onClick={() => navigate('/learning')}
              className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              <span>View All Subjects</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(subjects || []).map((sub) => (
              <div
                key={sub.id}
                onClick={() => navigate(`/learning/${sub.id}`)}
                className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-500">{sub.category}</span>
                    <RiskBadge level={sub.riskLevel} size="sm" />
                  </div>

                  <h4 className="text-lg font-bold text-[#0F172A] group-hover:text-teal-600 transition-colors mb-1">
                    {sub.name}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                    {sub.description}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                    <span>Knowledge Score</span>
                    <span className="font-extrabold text-slate-900">{sub.knowledge}%</span>
                  </div>
                  <ProgressBar value={sub.knowledge} color="auto" height="h-2" />

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>{sub.completedTopics}/{sub.topicCount} Topics</span>
                    <span className="font-bold text-teal-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      Continue <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Recent Activity */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100">
            <h3 className="text-base font-bold text-[#0F172A]">Recent Activity</h3>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-4 flex-1">
            {(activities && activities.length > 0) ? (
              activities.slice(0, 5).map((act) => (
                <div key={act.id} className="flex gap-3 text-xs border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{act.title}</p>
                    <p className="text-slate-500 mt-0.5">{act.subtitle}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">{act.timestamp}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-slate-400">
                No recent activity recorded yet. Take a quiz or complete a revision task to start tracking.
              </div>
            )}
          </div>

          <button
            onClick={() => navigate('/revision-plan')}
            className="w-full mt-6 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors text-center"
          >
            View Revision Schedule →
          </button>
        </div>
      </div>
    </div>
  );
};
