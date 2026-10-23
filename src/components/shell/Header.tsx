import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/authContext';
import { ic } from '../icons';

interface HeaderProps {
  onOpenCommand?: () => void;
  role?: 'hr_admin' | 'employee';
  onToggleRole?: () => void;
  onToggleMobileNav?: () => void;
  currentPersona?: 'admin' | 'employee';
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

  const displayName = user
    ? (user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User')
    : (role === 'employee' ? 'Rahul Varma' : 'Ananya Rao');
  const displayEmail = user?.email || (role === 'employee' ? 'rahul.varma@brightcone.ai' : 'ananya.rao@brightcone.ai');
  const roleTitle = role === 'employee' ? 'Senior Engineer' : 'People Ops Lead';
  const userInitials = displayName.split(' ').filter(Boolean).map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    if (next === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/login', { replace: true });
  };

  const getBreadcrumb = () => {
    const p = location.pathname;
    if (p === '/doc-sign/dashboard' || p === '/doc-sign' || p === '/sign' || p === '/doc_sign')
      return { app: 'Sign', page: 'Sign dashboard' };
    if (p.startsWith('/doc-sign/requests')) return { app: 'Sign', page: 'Signature requests' };
    if (p.startsWith('/doc-sign/templates')) return { app: 'Sign', page: 'Templates' };
    if (p.startsWith('/doc-sign/handbook')) return { app: 'Sign', page: 'Employee handbook' };
    if (p.startsWith('/doc-sign/policies')) return { app: 'Sign', page: 'HR policies' };
    if (p.startsWith('/doc-sign/acks')) return { app: 'Sign', page: 'Policy acknowledgements' };
    if (p.startsWith('/doc-sign/flow')) return { app: 'Sign', page: 'Documents to sign' };
    if (p.startsWith('/performance')) return { app: 'Performance', page: 'Review cycles' };
    if (p === '/learn/courses') return { app: 'Learn', page: 'Courses' };
    if (p === '/learn/my-learning') return { app: 'Learn', page: 'My learning' };
    if (p.startsWith('/learn')) return { app: 'Learn', page: 'Learn dashboard' };
    if (p.startsWith('/people')) return { app: 'People', page: 'Directory' };
    if (p.startsWith('/recruit')) return { app: 'Recruit', page: 'Pipelines' };
    if (p.startsWith('/payroll')) return { app: 'Payroll', page: 'Runs' };
    if (p.startsWith('/expense')) return { app: 'Expense', page: 'Claims' };
    if (p.startsWith('/engagement')) return { app: 'Connect', page: 'Company feed' };
    if (p.startsWith('/time')) return { app: 'Shift', page: 'Roster' };
    if (p.startsWith('/advanced-hr')) return { app: 'Advanced HR', page: 'Analytics' };
    return { app: 'People Plus', page: 'Suite dashboard' };
  };

  const crumb = getBreadcrumb();

  return (
    <header className="top flex-none">
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

      <div className="crumb" id="crumb">
        <span
          className="cursor-pointer hover:text-[var(--text)] transition-colors"
          onClick={() => navigate('/suite')}
        >
          {crumb.app}
        </span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-[var(--muted)]">
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <b>{crumb.page}</b>
      </div>

      <div
        className="cmd cursor-pointer"
        onClick={onOpenCommand}
        title="Search people, pages or actions (Ctrl K)"
      >
        {ic('search', 16)}
        <span>Search people, pages, actions…</span>
        <kbd>Ctrl K</kbd>
      </div>

      <div className="r flex items-center gap-2">
        <button
          type="button"
          className="icon-btn"
          id="themeBtn"
          aria-label="Toggle theme"
          title="Toggle light / dark"
          onClick={toggleTheme}
        >
          {theme === 'light' ? ic('moon', 18) : ic('sun', 18)}
        </button>

        <button
          type="button"
          className="icon-btn"
          aria-label="Notifications"
          title="Notifications"
          onClick={() => navigate('/suite')}
        >
          {ic('bell', 18)}
        </button>

        <div className="relative" ref={menuRef}>
          <div
            className="me flex items-center gap-2.5 cursor-pointer py-1 px-2 rounded-xl hover:bg-[var(--surface-2)] transition-colors"
            id="me"
            title="Account & Session"
            onClick={() => setIsProfileOpen((prev) => !prev)}
          >
            <span className="av w-8 h-8 rounded-full bg-gradient-to-tr from-[#3B82F6] to-[#06B6D4] text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {userInitials}
            </span>
            <div className="hidden sm:flex flex-col text-left">
              <b className="text-xs font-semibold leading-tight text-[var(--text)]">{displayName}</b>
              <span className="text-[11px] text-[var(--muted)]">{roleTitle}</span>
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-[var(--muted)]">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-[var(--surface)] border border-[var(--line)] rounded-2xl shadow-2xl py-2 z-50">
              <div className="px-4 py-3 border-b border-[var(--line)]">
                <p className="text-xs font-bold text-[var(--text)]">{displayName}</p>
                <p className="text-[11px] text-[var(--muted)] truncate">{displayEmail}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#E3F0FF] text-[#0B6FDB]">
                  {role === 'hr_admin' ? 'HR Admin' : 'Employee'}
                </span>
              </div>

              {onToggleRole && (
                <button
                  type="button"
                  onClick={() => {
                    onToggleRole();
                    setIsProfileOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs text-[var(--text)] hover:bg-[var(--surface-2)] flex items-center gap-2"
                >
                  {ic('users', 14)}
                  <span>Switch to {role === 'hr_admin' ? 'Employee View' : 'HR Admin View'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
              >
                {ic('door', 14)}
                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
