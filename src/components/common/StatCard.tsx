import React from 'react';

interface StatCardProps {
  label: string;
  value: number | string;
  subtext: string;
  icon: React.ReactNode;
  colorScheme?: 'blue' | 'purple' | 'amber' | 'emerald' | 'cyan';
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  icon,
  colorScheme = 'blue',
}) => {
  const iconColors = {
    blue: 'bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/30',
    purple: 'bg-purple-100 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/30',
    amber: 'bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/30',
    emerald: 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30',
    cyan: 'bg-sky-100 dark:bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-500/30',
  };

  return (
    <div className="rounded-xl bg-white dark:bg-[#0c1527] border border-slate-200 dark:border-sky-500/20 p-5 shadow-sm dark:shadow-lg dark:shadow-black/20 hover:border-sky-400 dark:hover:border-sky-500/40 transition duration-200 font-['Sora',sans-serif]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</span>
        <div className={`p-2.5 rounded-xl border ${iconColors[colorScheme]}`}>
          {icon}
        </div>
      </div>
      <div className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{value}</div>
      <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subtext}</div>
    </div>
  );
};

export default StatCard;
