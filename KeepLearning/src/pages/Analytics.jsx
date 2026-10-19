import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useData } from '../context/DataContext';

export const Analytics = () => {
  const { analyticsData } = useData();

  const data = analyticsData || {};
  const growthData = data.knowledgeGrowthHistory || [];
  const subjectPerf = data.subjectPerformance || [];
  const riskDist = data.driftRiskDistribution || [];
  const revEffect = data.revisionEffectiveness || [];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-[10px] font-bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200/80">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">Analytics & Intelligence</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Deep telemetry on knowledge retention rates, quiz accuracy trends, and spaced revision efficacy.
        </p>
      </div>

      {/* Grid 1: Knowledge Growth & Subject Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Knowledge Growth Line Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A]">Knowledge Score Progression</h3>
              <p className="text-xs text-slate-500">Weekly progression across subjects</p>
            </div>
            <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md">
              +14% Month Gain
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="label" stroke="#94A3B8" fontSize={12} />
                <YAxis domain={[30, 100]} stroke="#94A3B8" fontSize={12} unit="%" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="overall" name="Overall" stroke="#0B1F33" strokeWidth={3} />
                <Line type="monotone" dataKey="java" name="Java" stroke="#14B8A6" strokeWidth={2} />
                <Line type="monotone" dataKey="sql" name="SQL" stroke="#38BDF8" strokeWidth={2} />
                <Line type="monotone" dataKey="ds" name="Data Struct" stroke="#F59E0B" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Performance Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A]">Subject Mastery vs. Target</h3>
              <p className="text-xs text-slate-500">Current score vs 80% mastery target</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectPerf}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
                <YAxis domain={[0, 100]} stroke="#94A3B8" fontSize={12} unit="%" />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" name="Current Score" fill="#14B8A6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="target" name="Mastery Target" fill="#E2E8F0" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grid 2: Risk Distribution & Revision Effectiveness */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Distribution Pie */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#0F172A] mb-1">Topic Risk Distribution</h3>
            <p className="text-xs text-slate-500 mb-4">Proportion of topics by drift status</p>
            
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDist}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={70}
                    dataKey="count"
                  >
                    {riskDist.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || "#14B8A6"} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-100">
            {riskDist.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900">{item.count} topics ({item.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revision Effectiveness Gain Cards */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#0F172A]">Revision Effectiveness & Knowledge Recovery</h3>
                <p className="text-xs text-slate-500">Knowledge gained immediately following spaced revision</p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                +15.5% Avg Boost
              </span>
            </div>

            <div className="space-y-4">
              {revEffect.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900">{item.subject}</p>
                    <p className="text-[11px] text-slate-500">Before: {item.before}% → After: {item.after}%</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs">
                      +{item.gain}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Model Telemetry: Continuous Adaptive Calibration</span>
            <span className="font-bold text-teal-600">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
