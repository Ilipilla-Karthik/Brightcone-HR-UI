import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ic } from '../icons';

interface AppItem {
  key: string;
  name: string;
  color: string;
  path: string;
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

  // In scope: strictly Sign and Connect only
  const apps: AppItem[] = [
    {
      key: 'sign',
      name: 'Sign',
      color: '#D9466F',
      path: activeRole === 'employee' ? '/doc-sign/flow' : '/doc-sign/dashboard',
      icon: ic('pen', 18),
    },
    {
      key: 'connect',
      name: 'Connect',
      color: '#0BA6CC',
      path: '/engagement/feed',
      icon: ic('chat', 18),
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
      return (
        location.pathname.startsWith('/engagement') ||
        location.pathname.startsWith('/connect')
      );
    }
    return location.pathname.startsWith(app.path);
  };

  const homePath = activeRole === 'employee' ? '/doc-sign/flow' : '/doc-sign/dashboard';

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

      {/* App List: ONLY Sign and Connect */}
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
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default AppRail;
