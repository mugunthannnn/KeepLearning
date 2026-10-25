import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';

export const KnowledgeForecastChart = ({ data, topicName = "Topic" }) => {
  if (!data || data.length === 0) return null;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-xl text-xs space-y-1.5">
          <p className="font-bold text-slate-900 border-b border-slate-100 pb-1">{label}</p>
          <div className="flex items-center justify-between gap-4 text-rose-600">
            <span>Without Revision:</span>
            <span className="font-bold">{payload[0]?.value}%</span>
          </div>
          {payload[1] && (
            <div className="flex items-center justify-between gap-4 text-teal-600">
              <span>With Recommended Revision:</span>
              <span className="font-bold">{payload[1]?.value}%</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <div>
          <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
            <span>Knowledge Drift Forecast Curve</span>
            <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
              AI Forecast Model
            </span>
          </h3>
          <p className="text-xs text-slate-500">
            14-day predicted retention decay vs. recommended revision recovery for {topicName}
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium">
          <span className="flex items-center gap-1.5 text-rose-600">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Without Revision
          </span>
          <span className="flex items-center gap-1.5 text-teal-600">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 inline-block" /> With Revision
          </span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorNoRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0}/>
              </linearGradient>
              <linearGradient id="colorWithRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="day" tickLine={false} stroke="#94A3B8" fontSize={12} />
            <YAxis domain={[0, 100]} tickLine={false} stroke="#94A3B8" fontSize={12} unit="%" />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Risk Threshold Line (60%) */}
            <ReferenceLine y={60} stroke="#F59E0B" strokeDasharray="4 4" label={{ value: "Risk Threshold (60%)", fill: "#D97706", fontSize: 10, position: 'insideBottomRight' }} />

            <Area
              type="monotone"
              dataKey="predictedWithoutRev"
              name="Without Revision"
              stroke="#EF4444"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorNoRev)"
            />
            <Area
              type="monotone"
              dataKey="predictedWithRev"
              name="With Recommended Revision"
              stroke="#14B8A6"
              strokeWidth={2.5}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#colorWithRev)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
        <span>
          💡 <strong className="text-slate-800">Insight:</strong> Without revision, memory stability drops below 60% within 5 days.
        </span>
        <span className="font-semibold text-teal-700">Predictive Retention Active</span>
      </div>
    </div>
  );
};
