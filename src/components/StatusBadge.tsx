import React from 'react';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const getBadgeStyle = (st: string) => {
    switch (st.toLowerCase()) {
      case 'active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'on leave':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'inactive':
      case 'cancelled':
      case 'rejected':
      case 'closed':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'applied':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'screening':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'interview':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'offer':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'hired':
      case 'completed':
      case 'approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'in progress':
      case 'open':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'draft':
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getBadgeStyle(
        status
      )} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 mr-1.5 rounded-full ${
          status.toLowerCase() === 'active' || status.toLowerCase() === 'hired'
            ? 'bg-emerald-500'
            : status.toLowerCase() === 'on leave'
            ? 'bg-slate-400'
            : 'bg-current opacity-70'
        }`}
      />
      {status}
    </span>
  );
};
