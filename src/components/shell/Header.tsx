import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/authContext';
import { ic } from '../icons';

interface HeaderProps {
  onOpenCommand?: () => void;
  role?: 'hr_admin' | 'employee';
  onToggleRole?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCommand,
  role: _role,
  onToggleRole: _onToggleRole,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    if (next === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  const getBreadcrumb = () => {
    if (
      location.pathname === '/doc-sign/dashboard' ||
      location.pathname === '/doc-sign' ||
      location.pathname === '/sign' ||
      location.pathname === '/doc_sign'
    )
      return { app: 'Sign', page: 'Sign dashboard' };

    if (location.pathname.startsWith('/doc-sign/requests'))
      return { app: 'Sign', page: 'Signature requests' };

    if (location.pathname.startsWith('/doc-sign/templates'))
      return { app: 'Sign', page: 'Templates' };

    if (location.pathname.startsWith('/doc-sign/handbook'))
      return { app: 'Sign', page: 'Employee handbook' };

    if (location.pathname.startsWith('/doc-sign/policies'))
      return { app: 'Sign', page: 'HR policies' };

    if (location.pathname.startsWith('/doc-sign/acks'))
      return { app: 'Sign', page: 'Policy acknowledgements' };

    if (location.pathname.startsWith('/doc-sign/flow'))
      return { app: 'Sign', page: 'Documents to sign' };

    if (location.pathname.startsWith('/people')) return { app: 'People', page: 'Directory' };
    if (location.pathname.startsWith('/recruit')) return { app: 'Recruit', page: 'Pipelines' };
    if (location.pathname.startsWith('/payroll')) return { app: 'Payroll', page: 'Runs' };
    if (location.pathname.startsWith('/expense')) return { app: 'Expense', page: 'Claims' };
    if (location.pathname.startsWith('/engagement')) return { app: 'Connect', page: 'Company feed' };
    if (location.pathname.startsWith('/learn')) return { app: 'Learn', page: 'Courses' };
    if (location.pathname.startsWith('/time')) return { app: 'Shift', page: 'Roster' };
    if (location.pathname.startsWith('/advanced-hr')) return { app: 'Advanced HR', page: 'Analytics' };
    return { app: 'People Plus', page: 'Suite dashboard' };
  };

  const crumb = getBreadcrumb();

  return (
    <header className="top flex-none">
      {/* App Grid Launcher */}
      <button
        type="button"
        className="icon-btn"
        aria-label="All apps"
        title="All apps"
        onClick={() => navigate('/suite')}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      </button>

      {/* Breadcrumb */}
      <div className="crumb" id="crumb">
        <span
          className="cursor-pointer hover:text-[var(--text)] transition-colors"
          onClick={() => navigate('/doc-sign/dashboard')}
        >
          {crumb.app}
        </span>
        {ic('chev', 14)}
        <b>{crumb.page}</b>
      </div>

      {/* Center: Search / Command Palette */}
      <button
        type="button"
        className="cmd"
        style={{ minWidth: '280px', maxWidth: '380px' }}
        onClick={onOpenCommand}
        aria-label="Search people and actions"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flex: 'none', color: 'var(--faint)' }}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <span style={{ flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          Search people, pages or actions
        </span>
        <kbd style={{ flexShrink: 0 }}>Ctrl K</kbd>
      </button>

      <div style={{ flex: 1 }} />

      {/* Theme Toggle */}
      <button
        type="button"
        className="icon-btn"
        id="themeBtn"
        aria-label="Switch theme"
        title="Switch theme"
        onClick={toggleTheme}
      >
        {theme === 'dark' ? ic('sun', 18) : ic('moon', 18)}
      </button>

      {/* Notifications */}
      <button
        type="button"
        className="icon-btn"
        id="bell"
        aria-label="Notifications"
        title="Notifications"
      >
        {ic('bell', 18)}
        <span className="dot" />
      </button>

      {/* User Info */}
      <div className="me" id="me">
        <span className="av" style={{ background: '#7C5CFF' }}>AR</span>
        <div>
          Ananya Rao<br />
          <span>People Ops Lead</span>
        </div>
      </div>

      {/* Logout */}
      <button
        type="button"
        className="icon-btn"
        aria-label="Sign out"
        title="Sign out"
        onClick={logout}
      >
        {ic('logout', 18)}
      </button>
    </header>
  );
};

export default Header;
