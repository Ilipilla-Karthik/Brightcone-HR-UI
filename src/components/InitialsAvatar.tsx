import React from 'react';

interface InitialsAvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const COLORS = [
  'bg-blue-600 text-white',
  'bg-indigo-600 text-white',
  'bg-sky-600 text-white',
  'bg-teal-600 text-white',
  'bg-cyan-600 text-white',
  'bg-emerald-600 text-white',
  'bg-purple-600 text-white',
  'bg-violet-600 text-white',
  'bg-amber-600 text-white',
  'bg-rose-600 text-white',
];

export const InitialsAvatar: React.FC<InitialsAvatarProps> = ({
  name,
  size = 'md',
  className = '',
}) => {
  const getInitials = (n: string) => {
    if (!n) return '—';
    const parts = n.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getColor = (n: string) => {
    let hash = 0;
    for (let i = 0; i < n.length; i++) {
      hash = n.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % COLORS.length;
    return COLORS[index];
  };

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs font-semibold',
    md: 'w-9 h-9 text-sm font-semibold',
    lg: 'w-12 h-12 text-base font-bold',
    xl: 'w-16 h-16 text-xl font-bold',
  };

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full shrink-0 select-none shadow-xs ${sizeClasses[size]} ${getColor(
        name
      )} ${className}`}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
};
