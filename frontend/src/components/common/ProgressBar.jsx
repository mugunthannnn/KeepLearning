import React from 'react';

export const ProgressBar = ({ value = 0, max = 100, height = 'h-2', showLabel = false, color = 'teal' }) => {
  const percentage = Math.min(max, Math.max(0, value));

  const getColorClass = () => {
    if (color === 'auto') {
      if (percentage < 55) return 'bg-rose-500';
      if (percentage < 70) return 'bg-amber-500';
      if (percentage < 82) return 'bg-sky-500';
      return 'bg-teal-500';
    }
    switch (color) {
      case 'teal': return 'bg-teal-500';
      case 'sky': return 'bg-sky-500';
      case 'amber': return 'bg-amber-500';
      case 'rose': return 'bg-rose-500';
      case 'navy': return 'bg-[#0B1F33]';
      default: return 'bg-teal-500';
    }
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1 text-xs font-medium text-slate-600">
          <span>Progress</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${height}`}>
        <div
          className={`${getColorClass()} ${height} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
