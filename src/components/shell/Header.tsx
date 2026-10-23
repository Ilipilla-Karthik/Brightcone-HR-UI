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
    if (p.startsWith('/doc-sign') || p.startsWith('/sign') || p.startsWith('/doc_sign')) {
      if (p.includes('/requests')) return { app: 'Sign', page: 'Signature requests' };
      if (p.includes('/templates')) return { app: 'Sign', page: 'Templates' };
      if (p.includes('/handbook')) return { app: 'Sign', page: 'Employee handbook' };
      if (p.includes('/policies')) return { app: 'Sign', page: 'HR policies' };
      if (p.includes('/acks')) return { app: 'Sign', page: 'Policy acknowledgements' };
      if (p.includes('/flow')) return { app: 'Sign', page: 'Documents to sign' };
      return { app: 'Sign', page: 'Sign dashboard' };
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
      if (p.includes('/leaves')) return { app: 'People', page: 'Leaves & time-off' };
      if (p.includes('/attendance')) return { app: 'People', page: 'Attendance' };
      if (p.includes('/assets')) return { app: 'People', page: 'Assets & equipment' };
      if (p.includes('/documents')) return { app: 'People', page: 'Documents' };
      return { app: 'People', page: 'Directory' };
    }
    if (p.startsWith('/recruit')) {
      if (p.includes('/candidates')) return { app: 'Recruit', page: 'Candidate tracker' };
      if (p.includes('/jobs')) return { app: 'Recruit', page: 'Job openings' };
      if (p.includes('/interviews')) return { app: 'Recruit', page: 'Interview schedule' };
      if (p.includes('/offers')) return { app: 'Recruit', page: 'Offer letters' };
      if (p.includes('/referrals')) return { app: 'Recruit', page: 'Referrals' };
      return { app: 'Recruit', page: 'Talent pipeline' };
    }
    if (p.startsWith('/time')) {
      if (p.includes('/roster')) return { app: 'Shift', page: 'Shift roster' };
      if (p.includes('/swap')) return { app: 'Shift', page: 'Shift swap' };
      if (p.includes('/holidays')) return { app: 'Shift', page: 'Holidays' };
      if (p.includes('/leaves')) return { app: 'Shift', page: 'Leave balance' };
      return { app: 'Shift', page: 'Attendance roster' };
    }
    if (p.startsWith('/payroll')) {
      if (p.includes('/salary-structure')) return { app: 'Payroll', page: 'Salary structure' };
      if (p.includes('/payslips')) return { app: 'Payroll', page: 'My payslips' };
      if (p.includes('/compliance')) return { app: 'Payroll', page: 'Tax & PF compliance' };
      if (p.includes('/benefits')) return { app: 'Payroll', page: 'Benefits' };
      return { app: 'Payroll', page: 'Payroll runs' };
    }
    if (p.startsWith('/expense')) return { app: 'Expense', page: 'Expense claims' };
    if (p.startsWith('/engagement')) {
      if (p.includes('/events')) return { app: 'Connect', page: 'Company events' };
      if (p.includes('/celebrations')) return { app: 'Connect', page: 'Celebrations' };
      if (p.includes('/helpdesk')) return { app: 'Connect', page: 'Helpdesk queue' };
      return { app: 'Connect', page: 'Company feed' };
    }
    return { app: 'People Plus', page: 'Suite dashboard' };
  };

  const crumb = getBreadcrumb();

  return (
    <header className="top flex-none relative z-50">
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
            <div className="absolute right-0 mt-2 w-64 bg-[var(--surface)] border border-[var(--line)] rounded-2xl shadow-2xl py-2 z-[9999]">
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
                  className="w-full text-left px-4 py-2.5 text-xs text-[var(--text)] hover:bg-[var(--surface-2)] flex items-center gap-2 cursor-pointer"
                >
                  {ic('users', 14)}
                  <span>Switch to {role === 'hr_admin' ? 'Employee View' : 'HR Admin View'}</span>
                </button>
              )}

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

        {/* Direct, prominent top-right Sign Out button */}
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
