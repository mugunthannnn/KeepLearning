import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
  trendValue,
  accentColor = 'teal'
}) => {
  const getIconColor = () => {
    switch (accentColor) {
      case 'teal': return 'bg-teal-50 text-teal-600 border-teal-100';
      case 'sky': return 'bg-sky-50 text-sky-600 border-sky-100';
      case 'amber': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'rose': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</span>
        {Icon && (
          <div className={`p-2 rounded-lg border ${getIconColor()}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between">
        <div className="text-3xl font-extrabold text-[#0F172A] tracking-tight">{value}</div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
            trend === 'up' 
              ? 'text-emerald-700 bg-emerald-50' 
              : trend === 'down' 
              ? 'text-rose-700 bg-rose-50' 
              : 'text-slate-600 bg-slate-100'
          }`}>
            {trend === 'up' && <TrendingUp className="w-3.5 h-3.5" />}
            {trend === 'down' && <TrendingDown className="w-3.5 h-3.5" />}
            {trend === 'neutral' && <Minus className="w-3.5 h-3.5" />}
            <span>{trendValue}</span>
          </div>
        )}
      </div>

      {subtext && (
        <p className="mt-2 text-xs text-slate-500 font-medium">
          {subtext}
        </p>
      )}
    </div>
  );
};
