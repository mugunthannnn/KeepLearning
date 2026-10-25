import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';

export const RiskBadge = ({ level = 'Low', size = 'md', showIcon = true }) => {
  const getStyles = () => {
    switch (level.toLowerCase()) {
      case 'low':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
          icon: CheckCircle,
          label: 'Low Risk (Stable)'
        };
      case 'medium':
        return {
          bg: 'bg-sky-50 text-sky-700 border-sky-200',
          dot: 'bg-sky-500',
          icon: AlertCircle,
          label: 'Medium Risk'
        };
      case 'high':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500',
          icon: AlertTriangle,
          label: 'High Risk'
        };
      case 'critical':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          dot: 'bg-rose-500',
          icon: ShieldAlert,
          label: 'Critical Risk'
        };
      default:
        return {
          bg: 'bg-slate-50 text-slate-700 border-slate-200',
          dot: 'bg-slate-400',
          icon: AlertCircle,
          label: level
        };
    }
  };

  const style = getStyles();
  const IconComponent = style.icon;

  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-xs' 
    : size === 'lg' 
    ? 'px-3.5 py-1 text-sm font-semibold' 
    : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${style.bg} ${sizeClasses}`}>
      {showIcon && <IconComponent className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />}
      <span>{style.label}</span>
    </span>
  );
};
