import React, { useState, useRef, useEffect } from 'react';
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
  role = 'hr_admin',
  onToggleRole,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  const displayName = user ? `${user.firstName} ${user.lastName}` : (role === 'employee' ? 'Rahul Varma' : 'Ananya Rao');
  const displayEmail = user?.email || (role === 'employee' ? 'rahul.varma@brightcone.ai' : 'ananya.rao@brightcone.ai');
  const roleTitle = role === 'employee' ? 'Senior Engineer' : 'People Ops Lead';
  const userInitials = displayName.split(' ').map((n) => n[0]).join('').toUpperCase();

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

      {/* User Info with Profile Dropdown */}
      <div className="relative">
        <div
          className="me cursor-pointer select-none"
          id="me"
          onClick={() => setIsProfileOpen((prev) => !prev)}
          role="button"
          tabIndex={0}
          aria-haspopup="true"
          aria-expanded={isProfileOpen}
          title="Account menu"
        >
          <span className="av" style={{ background: '#7C5CFF' }}>{userInitials}</span>
          <div>
            {displayName}<br />
            <span>{roleTitle}</span>
          </div>
        </div>

        {isProfileOpen && (
          <div
            ref={menuRef}
            className="absolute right-0 mt-2 w-64 bg-[var(--surface)] border border-[var(--line)] rounded-xl shadow-xl z-50 py-2 text-sm text-[var(--text)]"
          >
            <div className="px-4 py-3 border-b border-[var(--line)]">
              <div className="font-semibold text-sm">{displayName}</div>
              <div className="text-xs text-[var(--muted)] truncate">{displayEmail}</div>
              <span className="inline-block mt-2 text-[11px] font-medium px-2 py-0.5 rounded-full bg-[var(--brand-2)]/20 text-[var(--brand-2)]">
                {role === 'employee' ? 'Employee' : 'HR Admin'}
              </span>
            </div>

            <div className="py-1">
              {onToggleRole && (
                <button
                  type="button"
                  className="w-full text-left px-4 py-2 hover:bg-[var(--surface-2)] flex items-center gap-2 text-xs"
                  onClick={() => {
                    setIsProfileOpen(false);
                    onToggleRole();
                  }}
                >
                  {ic('swap', 14)}
                  <span>{role === 'employee' ? 'Switch to HR Admin view' : 'Switch to Employee view'}</span>
                </button>
              )}
            </div>

            <div className="border-t border-[var(--line)] pt-1">
              <button
                type="button"
                className="w-full text-left px-4 py-2 hover:bg-[var(--bad-bg)] text-[#EF4444] flex items-center gap-2 text-xs font-semibold cursor-pointer"
                onClick={() => {
                  setIsProfileOpen(false);
                  logout();
                }}
              >
                {ic('logout', 16)}
                <span>Sign out</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Logout Button */}
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
