import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { usePortal } from '../../context/PortalContext';
import {
  Sun,
  Moon,
  LogOut,
  Bell,
  Search,
  LayoutGrid,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const Topbar: React.FC = () => {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { currentApp, activeRole, isAppLauncherOpen, setIsAppLauncherOpen } = usePortal();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await logout();
    navigate('/signin');
  };

  // Determine breadcrumbs dynamically for all sections
  const getBreadcrumbs = () => {
    const path = location.pathname;

    // Recruit App Sections
    if (path.includes('jobs-referrals')) return { app: 'Recruit', page: 'Jobs & referrals' };
    if (path.includes('dashboard')) return { app: 'Recruit', page: 'Recruit dashboard' };
    if (path.includes('manpower')) return { app: 'Recruit', page: 'Manpower requirements' };
    if (path.includes('candidate-tracker')) return { app: 'Recruit', page: 'Candidate tracker' };
    if (path.includes('interviews')) return { app: 'Recruit', page: 'Interview scheduling' };
    if (path.includes('offers')) return { app: 'Recruit', page: 'Offer letters' };
    if (path.includes('joining')) return { app: 'Recruit', page: 'Joining formalities' };
    if (path.includes('onboarding')) return { app: 'Recruit', page: 'Onboarding checklist' };
    if (path.includes('internships')) return { app: 'Recruit', page: 'Internship management' };
    if (path.includes('pipeline')) return { app: 'Recruit', page: 'Pipeline & jobs' };

    // People App Sections
    if (path.includes('profile')) return { app: 'People', page: 'My profile' };
    if (path.includes('leaves-admin')) return { app: 'People', page: 'Leave approvals' };
    if (path.includes('leave')) return { app: 'People', page: 'Leave' };
    if (path.includes('attendance-admin')) return { app: 'People', page: 'Attendance logs' };
    if (path.includes('attendance')) return { app: 'People', page: 'Attendance' };
    if (path.includes('goals')) return { app: 'People', page: 'Goals & reviews' };
    if (path.includes('documents')) return { app: 'People', page: 'Documents & letters' };
    if (path.includes('assets-admin')) return { app: 'People', page: 'Asset inventory' };
    if (path.includes('assets')) return { app: 'People', page: 'My assets' };
    if (path.includes('helpdesk-admin')) return { app: 'People', page: 'Helpdesk queue' };
    if (path.includes('helpdesk')) return { app: 'People', page: 'HR helpdesk' };
    if (path.includes('resignation')) return { app: 'People', page: 'Resignation' };
    if (path.includes('directory')) return { app: 'People', page: 'Directory & profiles' };
    if (path.includes('policies')) return { app: 'People', page: 'Company policies' };

    const appName = currentApp === 'recruit' ? 'Recruit' : 'People';
    return { app: appName, page: activeRole === 'admin' ? 'Recruit dashboard' : 'My profile' };
  };

  const breadcrumb = getBreadcrumbs();

  // Display user info based on activeRole
  const isEmployeeRole = activeRole === 'employee';
  const displayName = isEmployeeRole ? 'Rahul Varma' : 'Ananya Rao';
  const displayRole = isEmployeeRole ? 'Backend Engineer' : 'People Ops Lead';
  const displayInitials = isEmployeeRole ? 'RV' : 'AR';
  const avatarClass = isEmployeeRole ? 'avatar-rv' : 'avatar-ar';

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#070E22]/95 backdrop-blur-md px-6 flex items-center justify-between z-20 transition-colors duration-200">
      {/* Left: App Launcher & Breadcrumb */}
      <div className="flex items-center gap-4">
        {/* 4-squares App Launcher */}
        <button
          onClick={() => setIsAppLauncherOpen(!isAppLauncherOpen)}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            isAppLauncherOpen
              ? 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
          }`}
          title="Switch Brightcone Application"
        >
          <LayoutGrid className="w-5 h-5" />
        </button>

        {/* Dynamic Breadcrumb updating on any section change */}
        <div className="breadcrumb-container">
          <span className="hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer">
            {breadcrumb.app}
          </span>
          <span className="text-slate-300 dark:text-slate-600 font-normal">›</span>
          <span className="breadcrumb-active">{breadcrumb.page}</span>
        </div>
      </div>

      {/* Center: Search Box Ctrl K */}
      <div className="hidden md:flex items-center relative w-72 lg:w-96">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
        <input
          type="text"
          placeholder="Search people, pages or actions"
          className="w-full bg-slate-100 dark:bg-[#0E1833] border border-slate-200 dark:border-[#1D2B52] rounded-xl pl-9 pr-14 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <span className="absolute right-2.5 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 dark:text-slate-500 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900">
          Ctrl K
        </span>
      </div>

      {/* Right: Theme Toggle, Notifications Bell, User Pill */}
      <div className="flex items-center gap-3">

        {/* Theme Toggle (Moon / Sun) */}
        <button
          onClick={toggleTheme}
          type="button"
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-slate-600" />
          )}
        </button>

        {/* Notifications Bell */}
        <button
          type="button"
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer relative"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="w-2 h-2 rounded-full bg-indigo-500 absolute top-2 right-2 ring-2 ring-white dark:ring-[#070E22]" />
        </button>

        {/* User Pill matching Screenshots */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className={`avatar-circle ${avatarClass}`}>
            {displayInitials}
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
              {displayName}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
              {displayRole}
            </div>
          </div>
          <button
            onClick={handleSignOut}
            type="button"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
