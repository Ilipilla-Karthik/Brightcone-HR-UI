import React, { useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import {
  LogOut,
  Bell,
  Search,
  LayoutGrid,
  ChevronRight,
  Moon,
  Sun,
  Shield,
  User,
  Sparkles,
} from 'lucide-react';
import { authApi } from '../api/auth';
import { useTheme } from '../context/ThemeContext';

interface TopbarProps {
  onToggleSidebar?: () => void;
}

export const Topbar: React.FC<TopbarProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const currentUser = authApi.getCurrentUser();
  const { isDark, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isEmployee = currentUser?.role === 'EMPLOYEE' || currentUser?.email === 'rahul.varma@brightcone.ai';

  const handleLogout = async () => {
    await authApi.logout();
    navigate('/signin');
  };

  // Compute breadcrumb based on route & query view
  const getBreadcrumb = () => {
    const path = location.pathname;
    const view = searchParams.get('view') || 'dashboard';

    if (path.includes('employees')) {
      if (isEmployee) {
        switch (view) {
          case 'leave':
            return { parent: 'People', current: 'Leave' };
          case 'attendance':
            return { parent: 'People', current: 'Attendance' };
          case 'goals':
            return { parent: 'People', current: 'Goals & reviews' };
          case 'documents':
            return { parent: 'People', current: 'Documents & letters' };
          case 'assets':
            return { parent: 'People', current: 'My assets' };
          case 'helpdesk':
            return { parent: 'People', current: 'HR helpdesk' };
          case 'resignation':
            return { parent: 'People', current: 'Resignation' };
          default:
            return { parent: 'People', current: 'My profile' };
        }
      }
      return { parent: 'People', current: view === 'departments' ? 'Departments' : 'All employees' };
    }

    if (isEmployee) {
      return { parent: 'Recruit', current: 'Jobs & referrals' };
    }

    switch (view) {
      case 'jobs':
        return { parent: 'Recruit', current: 'Manpower requirements' };
      case 'candidates':
        return { parent: 'Recruit', current: 'Candidate tracker' };
      case 'interviews':
        return { parent: 'Recruit', current: 'Interview scheduling' };
      case 'offers':
        return { parent: 'Recruit', current: 'Offer letters' };
      case 'onboarding':
        return { parent: 'Recruit', current: 'Joining formalities' };
      case 'checklist':
        return { parent: 'Recruit', current: 'Onboarding checklist' };
      case 'internships':
        return { parent: 'Recruit', current: 'Internship management' };
      default:
        return { parent: 'Recruit', current: 'Recruit dashboard' };
    }
  };

  const breadcrumb = getBreadcrumb();
  const initials = isEmployee ? 'RV' : 'AR';
  const displayName = isEmployee ? 'Rahul Varma' : (currentUser?.name || 'Ananya Rao');
  const displayTitle = isEmployee ? 'Backend Engineer' : 'People Ops Lead';

  return (
    <header className="h-16 bg-white dark:bg-[#070D1E] border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs transition-colors">
      {/* Left: App Launcher & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/recruitment')}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
          title="App Modules"
        >
          <LayoutGrid className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <span className="text-slate-500 dark:text-slate-400 font-medium">{breadcrumb.parent}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
          <span className="font-semibold text-slate-900 dark:text-white">{breadcrumb.current}</span>
        </div>
      </div>

      {/* Center: Search Box */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search people, pages or actions"
            className="w-full pl-9 pr-14 py-1.5 text-xs bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-all"
          />
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
            <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-2xs">
              Ctrl K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right Controls: Theme Toggle, Bell, User Pill, Logout */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Light / Dark Mode Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
          title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Notifications */}
        <button
          type="button"
          className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 rounded-xl transition-colors relative"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
        </button>

        {/* User Profile Pill */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
          >
            <div className={`w-8 h-8 rounded-full text-white font-bold text-xs flex items-center justify-center shadow-xs ${
              isEmployee ? 'bg-[#10B981]' : 'bg-[#8B5CF6]'
            }`}>
              {initials}
            </div>
            <div className="text-left hidden lg:block">
              <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                {displayName}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {displayTitle}
              </p>
            </div>
          </button>

          <button
            onClick={handleLogout}
            className="p-1.5 ml-1 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors rounded-lg cursor-pointer"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">{currentUser?.name}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{currentUser?.email}</p>
                  <div className="mt-1.5">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800">
                      <Shield className="w-2.5 h-2.5" />
                      {currentUser?.role}
                    </span>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate('/recruitment');
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    Overview
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate('/');
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-slate-400" />
                    Landing Page
                  </button>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Quick Direct Logout Icon */}
        <button
          type="button"
          onClick={handleLogout}
          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
          title="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
