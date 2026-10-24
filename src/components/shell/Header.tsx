import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/authContext';

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
  currentPersona,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Strictly determined by login user state
  const isEmployee =
    user?.role?.toLowerCase()?.includes('employee') ||
    user?.email?.toLowerCase()?.includes('rahul') ||
    role === 'employee' ||
    currentPersona === 'employee';

  const activeRole: 'hr_admin' | 'employee' = isEmployee ? 'employee' : 'hr_admin';

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

  const displayName = activeRole === 'employee' ? 'Rahul Varma' : 'Ananya Rao';
  const displayEmail = activeRole === 'employee' ? 'rahul.varma@brightcone.ai' : 'ananya.rao@brightcone.ai';
  const roleTitle = activeRole === 'employee' ? 'Backend Engineer' : 'People Ops Lead';
  const userInitials = activeRole === 'employee' ? 'RV' : 'AR';
  const avatarBg = activeRole === 'employee' ? 'bg-[#00966D]' : 'bg-[#0B6FDB]';

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
    if (p.startsWith('/doc-sign') || p.startsWith('/sign') || p.startsWith('/doc_sign')) {
      if (p.includes('/requests')) return { app: 'Sign', page: 'Signature requests' };
      if (p.includes('/templates')) return { app: 'Sign', page: 'Templates' };
      if (p.includes('/handbook')) return { app: 'Sign', page: 'Employee handbook' };
      if (p.includes('/policies')) return { app: 'Sign', page: 'HR policies' };
      if (p.includes('/acks')) return { app: 'Sign', page: 'Policy acknowledgements' };
      if (p.includes('/flow')) return { app: 'Sign', page: 'Documents to sign' };
      return { app: 'Sign', page: activeRole === 'employee' ? 'Documents to sign' : 'Sign dashboard' };
    }
    if (p.includes('/announcements')) return { app: 'Connect', page: 'Announcements' };
    if (p.includes('/directory')) return { app: 'Connect', page: 'People directory' };
    if (p.includes('/events')) return { app: 'Connect', page: 'Company events' };
    if (p.includes('/celebrations')) return { app: 'Connect', page: 'Celebrations' };
    if (p.includes('/feedback')) return { app: 'Connect', page: 'Employee feedback' };
    if (p.includes('/townhall')) return { app: 'Connect', page: 'Town hall meetings' };
    return { app: 'Connect', page: 'Company feed' };
  };

  const crumb = getBreadcrumb();
  const homePath = activeRole === 'employee' ? '/doc-sign/flow' : '/doc-sign/dashboard';

  return (
    <header className="top flex items-center h-16 px-6 border-b border-[var(--line)] bg-[var(--surface,#fff)] relative z-50">
      {/* 1. All Apps Launcher Icon Button */}
      <button
        type="button"
        className="w-10 h-10 rounded-xl border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--surface-2)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--text)] transition-colors shadow-2xs shrink-0 cursor-pointer"
        aria-label="All apps"
        title="All apps"
        onClick={() => navigate(homePath)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      </button>

      {/* 2. Breadcrumb Navigation */}
      <div className="flex items-center gap-2 ml-4 text-sm whitespace-nowrap">
        <span
          className="text-[var(--muted)] hover:text-[var(--text)] cursor-pointer transition-colors"
          onClick={() => navigate(homePath)}
        >
          {crumb.app}
        </span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-[var(--muted)] opacity-60">
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <b className="font-semibold text-[var(--text)]">{crumb.page}</b>
      </div>

      {/* 3. Search Capsule with Ctrl K badge */}
      <div
        className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--surface-2)] text-xs text-[var(--muted)] w-80 max-w-sm ml-5 cursor-pointer hover:border-[var(--muted)] transition-colors shadow-2xs"
        onClick={onOpenCommand}
        title="Search people, pages or actions (Ctrl K)"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-[var(--muted)] shrink-0">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <span className="truncate">Search people, pages or actions</span>
        <kbd className="ml-auto px-1.5 py-0.5 rounded bg-[var(--surface)] border border-[var(--line)] text-[10px] font-medium text-[var(--muted)] shadow-2xs shrink-0">
          Ctrl K
        </kbd>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* 4. Right Controls */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle Button */}
        <button
          type="button"
          className="w-10 h-10 rounded-xl border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--surface-2)] flex items-center justify-center text-[var(--text)] transition-colors shadow-2xs shrink-0 cursor-pointer"
          id="themeBtn"
          aria-label="Toggle theme"
          title="Toggle light / dark"
          onClick={toggleTheme}
        >
          {theme === 'light' ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          )}
        </button>

        {/* Notification Bell Button */}
        <button
          type="button"
          className="w-10 h-10 rounded-xl border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--surface-2)] flex items-center justify-center text-[var(--text)] transition-colors shadow-2xs shrink-0 relative cursor-pointer"
          aria-label="Notifications"
          title="Notifications"
          onClick={() => navigate(homePath)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {activeRole === 'hr_admin' && (
            <span className="dot absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[var(--bad,#E53E3E)] ring-2 ring-[var(--surface)]" />
          )}
        </button>

        {/* User Profile Pill */}
        <div className="relative" ref={menuRef}>
          <div
            className="flex items-center gap-2.5 cursor-pointer py-1 px-1.5 rounded-xl hover:bg-[var(--surface-2)] transition-colors"
            onClick={() => setIsProfileOpen((prev) => !prev)}
            title="Profile details"
          >
            <span
              className={`w-9 h-9 rounded-full text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs ${avatarBg}`}
            >
              {userInitials}
            </span>
            <div className="flex flex-col text-left leading-tight">
              <span className="text-xs font-semibold text-[var(--text)]">{displayName}</span>
              <span className="text-[11px] text-[var(--muted)] mt-0.5">{roleTitle}</span>
            </div>
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
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2 font-medium cursor-pointer"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>

        {/* 5. Logout Icon Button */}
        <button
          type="button"
          onClick={handleLogout}
          className="w-10 h-10 rounded-xl border border-[var(--line)] bg-[var(--surface)] hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 flex items-center justify-center text-[var(--text)] transition-colors shadow-2xs shrink-0 cursor-pointer"
          title="Sign out of Brightcone"
          aria-label="Sign out"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
