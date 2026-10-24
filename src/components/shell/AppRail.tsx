import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ic } from '../icons';

interface AppItem {
  key: string;
  name: string;
  color: string;
  path: string;
  badge?: number;
  icon: React.ReactNode;
}

interface AppRailProps {
  role?: 'hr_admin' | 'employee';
  currentPersona?: 'admin' | 'employee';
}

export const AppRail: React.FC<AppRailProps> = ({ role = 'hr_admin', currentPersona }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const activeRole: 'hr_admin' | 'employee' =
    currentPersona ? (currentPersona === 'admin' ? 'hr_admin' : 'employee') : role;

  const apps: AppItem[] = [
    { key: 'people', name: 'People', color: '#12A58E', path: '/people', badge: 3, icon: ic('users', 18) },
    { key: 'recruit', name: 'Recruit', color: '#7C5CFF', path: '/recruit', icon: ic('briefcase', 18) },
    { key: 'payroll', name: 'Payroll', color: '#0F9F6E', path: '/payroll', icon: ic('pay', 18) },
    { key: 'expense', name: 'Expense', color: '#E07A1D', path: '/expense', badge: 2, icon: ic('receipt', 18) },
    {
      key: 'sign',
      name: 'Sign',
      color: '#D9466F',
      path: activeRole === 'employee' ? '/doc-sign/flow' : '/doc-sign/dashboard',
      icon: ic('pen', 18),
    },
    { key: 'connect', name: 'Connect', color: '#0BA6CC', path: '/engagement/feed', icon: ic('chat', 18) },
    { key: 'learn', name: 'Learn', color: '#6366F1', path: activeRole === 'employee' ? '/learn/my-learning' : '/learn/dashboard', icon: ic('learn', 18) },
    { key: 'shift', name: 'Shift', color: '#3B82C4', path: '/time', badge: 2, icon: ic('clock', 18) },
    {
      key: 'plus',
      name: 'People Plus',
      color: '#0B87FF',
      path: activeRole === 'employee' ? '/portal' : '/suite',
      badge: 7,
      icon: ic('grid', 18),
    },
  ];

  const getIsActive = (app: AppItem) => {
    if (app.key === 'sign') {
      return (
        location.pathname.startsWith('/doc-sign') ||
        location.pathname.startsWith('/sign') ||
        location.pathname.startsWith('/doc_sign')
      );
    }
    if (app.key === 'connect') {
      return location.pathname.startsWith('/engagement') || location.pathname.startsWith('/connect');
    }
    if (app.key === 'plus') return location.pathname === '/suite' || location.pathname === '/' || location.pathname === '/portal';
    return location.pathname.startsWith(app.path);
  };

  const homePath = activeRole === 'employee' ? '/portal' : '/suite';

  return (
    <nav className="rail" aria-label="Apps Navigation">
      {/* Brand Icon Button */}
      <button
        type="button"
        className="rlogo flex items-center justify-center p-1"
        onClick={() => navigate(homePath)}
        title="Brightcone Home"
      >
        <img
          src="/logo.png"
          alt="Brightcone Logo"
          className="w-9 h-9 object-contain drop-shadow-md transition-transform hover:scale-105"
        />
      </button>

      {/* App List */}
      <div className="rapps">
        {apps.map((app) => {
          const isActive = getIsActive(app);
          return (
            <button
              type="button"
              key={app.key}
              onClick={() => navigate(app.path)}
              className={`rapp ${isActive ? 'on' : ''}`}
              style={{ '--ac': app.color } as React.CSSProperties}
              title={app.name}
            >
              <i>{app.icon}</i>
              <span>{app.name}</span>
              {app.badge !== undefined && <em className="bdg">{app.badge}</em>}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default AppRail;
