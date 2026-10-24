import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/authContext';
import { ic } from '../icons';

interface HeaderProps {
  onOpenCommand?: () => void;
  role?: 'hr_admin' | 'employee';
  onToggleRole?: () => void;
  onSwitchRole?: (role: 'hr_admin' | 'employee') => void;
  onToggleMobileNav?: () => void;
  currentPersona?: 'admin' | 'employee';
  onPersonaChange?: (persona: 'admin' | 'employee') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCommand,
  role = 'hr_admin',
  onSwitchRole,
  currentPersona,
  onPersonaChange,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const activeRole: 'hr_admin' | 'employee' =
    currentPersona ? (currentPersona === 'admin' ? 'hr_admin' : 'employee') : role;

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

  const displayName =
    activeRole === 'employee'
      ? (user?.role === 'employee' && (user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim())) || 'Rahul Varma'
      : (user?.role === 'hr_admin' && (user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim())) || 'Ananya Rao';

  const displayEmail =
    activeRole === 'employee' ? 'rahul.varma@brightcone.ai' : 'ananya.rao@brightcone.ai';
  const roleTitle = activeRole === 'employee' ? 'Senior Engineer' : 'People Ops Lead';
  const userInitials = activeRole === 'employee' ? 'RV' : 'AR';

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

  const handleRoleSelect = (targetRole: 'hr_admin' | 'employee') => {
    if (targetRole === activeRole) return;
    if (onSwitchRole) onSwitchRole(targetRole);
    if (onPersonaChange) onPersonaChange(targetRole === 'hr_admin' ? 'admin' : 'employee');
  };

  const getBreadcrumb = () => {
    const p = location.pathname;
    if (p.startsWith('/doc-sign') || p.startsWith('/sign') || p.startsWith('/doc_sign')) {
      if (p.includes('/requests')) return { app: 'Sign', page: 'Signature requests' };
      if (p.includes('/templates')) return { app: 'Sign', page: 'Templates' };
      if (p.includes('/handbook')) return { app: 'Sign', page: 'Employee handbook' };
      if (p.includes('/policies')) return { app: 'Sign', page: 'HR policies' };
      if (p.includes('/acks')) return { app: 'Sign', page: 'Policy acknowledgements' };
      if (p.includes('/flow')) return { app: 'Sign', page: 'Documents to sign' };
      return { app: 'Sign', page: activeRole === 'employee' ? 'Documents to sign' : 'Sign dashboard' };
    }
    if (p.startsWith('/performance')) return { app: 'Performance', page: 'Review cycles' };
    if (p.startsWith('/learn')) {
      if (p.includes('/courses')) return { app: 'Learn', page: 'Course catalogue' };
      if (p.includes('/my-learning')) return { app: 'Learn', page: 'My learning' };
      return { app: 'Learn', page: 'Learn dashboard' };
    }
    if (p.startsWith('/people')) {
      if (p.includes('/profile')) return { app: 'People', page: 'Employee profile' };
      if (p.includes('/org-chart')) return { app: 'People', page: 'Org structure' };
      return { app: 'People', page: 'Directory' };
    }
    if (p.startsWith('/recruit')) return { app: 'Recruit', page: 'Pipeline & jobs' };
    if (p.startsWith('/time')) return { app: 'Shift', page: 'Attendance roster' };
    if (p.startsWith('/payroll')) return { app: 'Payroll', page: 'Payroll runs' };
    if (p.startsWith('/expense')) return { app: 'Expense', page: 'Expense claims' };
    if (p.startsWith('/engagement') || p.startsWith('/connect')) {
      if (p.includes('/announcements')) return { app: 'Connect', page: 'Announcements' };
      if (p.includes('/directory')) return { app: 'Connect', page: 'People directory' };
      if (p.includes('/events')) return { app: 'Connect', page: 'Company events' };
      if (p.includes('/celebrations')) return { app: 'Connect', page: 'Celebrations' };
      if (p.includes('/feedback')) return { app: 'Connect', page: 'Employee feedback' };
      if (p.includes('/townhall')) return { app: 'Connect', page: 'Town hall meetings' };
      return { app: 'Connect', page: 'Company feed' };
    }
    return { app: 'People Plus', page: activeRole === 'employee' ? 'My dashboard' : 'Suite dashboard' };
  };

  const crumb = getBreadcrumb();
  const homePath = activeRole === 'employee' ? '/portal' : '/suite';

  return (
    <header className="top flex-none relative z-50">
      <button
        type="button"
        className="icon-btn"
        aria-label="All apps"
        title="All apps"
        onClick={() => navigate(homePath)}
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
          onClick={() => navigate(homePath)}
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

      <div style={{ flex: 1 }} />

      {/* Prominent Portal Switcher Pill in Top Nav */}
      <div className="flex items-center bg-[var(--surface-2)] border border-[var(--line)] rounded-full p-0.5 text-xs font-semibold shadow-inner mr-1">
        <button
          type="button"
          onClick={() => handleRoleSelect('hr_admin')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all cursor-pointer ${
            activeRole === 'hr_admin'
              ? 'bg-[var(--ac,#D9466F)] text-white shadow-xs font-bold'
              : 'text-[var(--muted)] hover:text-[var(--text)]'
          }`}
          title="Switch to HR Admin Portal"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span>HR Admin</span>
        </button>
        <button
          type="button"
          onClick={() => handleRoleSelect('employee')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all cursor-pointer ${
            activeRole === 'employee'
              ? 'bg-[var(--ac,#D9466F)] text-white shadow-xs font-bold'
              : 'text-[var(--muted)] hover:text-[var(--text)]'
          }`}
          title="Switch to Employee Portal"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="7" r="4" />
            <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
          </svg>
          <span>Employee</span>
        </button>
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
          className="icon-btn relative"
          aria-label="Notifications"
          title="Notifications"
          onClick={() => navigate(homePath)}
        >
          {ic('bell', 18)}
          {activeRole === 'hr_admin' && (
            <span className="dot absolute top-2 right-2 w-2 h-2 rounded-full bg-[var(--bad,#E53E3E)]" />
          )}
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
            <div className="absolute right-0 mt-2 w-64 bg-[var(--surface)] border border-[var(--line)] rounded-2xl shadow-2xl py-2 z-[9999]">
              <div className="px-4 py-3 border-b border-[var(--line)]">
                <p className="text-xs font-bold text-[var(--text)]">{displayName}</p>
                <p className="text-[11px] text-[var(--muted)] truncate">{displayEmail}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#E3F0FF] text-[#0B6FDB]">
                  {activeRole === 'hr_admin' ? 'HR Admin' : 'Employee self-service'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  handleRoleSelect(activeRole === 'hr_admin' ? 'employee' : 'hr_admin');
                  setIsProfileOpen(false);
                }}
                className="w-full text-left px-4 py-2.5 text-xs text-[var(--text)] hover:bg-[var(--surface-2)] flex items-center gap-2 cursor-pointer"
              >
                {ic('users', 14)}
                <span>Switch to {activeRole === 'hr_admin' ? 'Employee View' : 'HR Admin View'}</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2 font-medium cursor-pointer"
              >
                {ic('door', 14)}
                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 rounded-xl transition-all border border-rose-200 dark:border-rose-900/60 shadow-xs cursor-pointer ml-1"
          title="Sign out of Brightcone"
        >
          {ic('door', 14)}
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
