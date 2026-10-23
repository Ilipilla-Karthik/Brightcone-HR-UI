import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Users,
  Briefcase,
  Calendar,
  LayoutGrid,
  ChevronDown,
  ChevronRight,
  LogOut,
  Send,
  LogIn,
  ListFilter,
  User,
  Clock,
  TrendingUp,
  FileText,
  Monitor,
  MessageSquare,
} from 'lucide-react';
import { authApi } from '../api/auth';
import brightconeEmblem from '../assets/brightcone-emblem.png';

interface SidebarProps {
  isOpen?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentUser = authApi.getCurrentUser();

  const isEmployee = currentUser?.role === 'EMPLOYEE' || currentUser?.email === 'rahul.varma@brightcone.ai';
  const isRecruit = location.pathname.startsWith('/recruitment') || location.pathname === '/' || location.pathname === '/dashboard';
  const isPeople = location.pathname.startsWith('/employees');

  // Sub-sidebar accordion state for HR Admin
  const [overviewOpen, setOverviewOpen] = useState(true);
  const [onboardingOpen, setOnboardingOpen] = useState(true);

  // Sub-sidebar accordion state for Employee
  const [careersOpen, setCareersOpen] = useState(true);
  const [meOpen, setMeOpen] = useState(true);
  const [growOpen, setGrowOpen] = useState(true);
  const [workplaceOpen, setWorkplaceOpen] = useState(true);

  const activeRecruitView = searchParams.get('view') || (isEmployee ? 'referrals' : 'dashboard');
  const activePeopleView = searchParams.get('view') || 'profile';

  const handleLogout = async () => {
    await authApi.logout();
    navigate('/signin');
  };

  const initials = isEmployee ? 'RV' : 'AR';
  const displayName = isEmployee ? 'Rahul Varma' : 'Ananya Rao';
  const displayEmail = isEmployee ? 'rahul.varma@brightcone.ai' : 'ananya.rao@brightcone.ai';
  const firstName = isEmployee ? 'Rahul' : 'Ananya';

  // Primary Module Rail Items (Tier 1)
  const railItems = [
    {
      name: 'Recruit',
      path: '/recruitment',
      icon: Briefcase,
      activeColor: 'bg-[#8B5CF6]',
    },
    {
      name: 'People',
      path: '/employees',
      icon: Users,
      badge: isEmployee ? undefined : '4',
      activeColor: isEmployee ? 'bg-[#10B981]' : 'bg-[#8B5CF6]',
    },
  ];

  return (
    <aside className="flex h-screen shrink-0 select-none z-20">
      {/* TIER 1: Slim Dark Icon Rail (72px) */}
      <div className="w-[72px] bg-[#06101F] flex flex-col justify-between items-center py-4 border-r border-slate-800/80 z-20">
        {/* Top: Brightcone Prism Emblem */}
        <div className="flex flex-col items-center">
          <NavLink
            to={isEmployee ? '/employees' : '/recruitment'}
            className="p-1 mb-4 hover:scale-105 transition-transform"
            title="Brightcone HR"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden">
              <img
                src={brightconeEmblem}
                alt="Brightcone Logo"
                className="w-9 h-9 object-contain"
              />
            </div>
          </NavLink>

          {/* Module Icon List */}
          <nav className="flex flex-col items-center gap-2 w-full px-2">
            {railItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.name === 'Recruit'
                  ? isRecruit
                  : location.pathname === item.path;

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={`relative flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-150 group ${
                    isActive
                      ? `${item.activeColor} text-white shadow-md font-semibold`
                      : 'text-slate-400 hover:text-white hover:bg-white/8'
                  }`}
                  title={item.name}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="text-[9px] font-medium mt-0.5 tracking-tight scale-90">{item.name}</span>

                  {item.badge && !isActive && (
                    <span className="absolute top-1 right-1 px-1 py-0.2 rounded-full text-[9px] font-bold bg-rose-500 text-white leading-none">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom: User Avatar Card in Rail */}
        <div className="w-full px-1.5 pt-2 flex flex-col items-center">
          <div className="w-full p-1.5 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center text-center">
            <div
              className={`w-8 h-8 rounded-full text-white font-bold text-xs flex items-center justify-center shadow-xs ${
                isEmployee ? 'bg-[#10B981]' : 'bg-[#8B5CF6]'
              }`}
            >
              {initials}
            </div>
            <div className="text-[10px] font-semibold text-white mt-1 max-w-[60px] truncate">
              {firstName}
            </div>
            <button
              onClick={handleLogout}
              className="mt-1 text-slate-400 hover:text-rose-400 transition-colors p-1 cursor-pointer"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* TIER 2: Sub-Sidebar (240px) */}
      <div className="w-60 bg-white dark:bg-[#070D1E] text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between py-4 transition-colors">
        <div className="space-y-4 px-3 overflow-y-auto">
          {/* ============================================================= */}
          {/* A. RECRUIT SUB-SIDEBAR                                       */}
          {/* ============================================================= */}
          {isRecruit && (
            <>
              {/* Header: Purple Icon + Recruit + Role Subtitle */}
              <div className="flex items-center gap-3 px-2 py-2">
                <div className="w-10 h-10 rounded-2xl bg-[#8B5CF6] text-white flex items-center justify-center shadow-sm shrink-0">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white font-heading leading-tight">
                    Recruit
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {isEmployee ? 'Employee self-service' : 'HR Admin'}
                  </p>
                </div>
              </div>

              <div className="h-px bg-slate-100 dark:bg-slate-800" />

              {/* 1. EMPLOYEE RECRUIT MENU (Screenshot 1) */}
              {isEmployee ? (
                <div>
                  <button
                    type="button"
                    onClick={() => setCareersOpen(!careersOpen)}
                    className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                  >
                    <span>CAREERS</span>
                    {careersOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  </button>

                  {careersOpen && (
                    <div className="mt-1.5 space-y-1">
                      <NavLink
                        to="/recruitment?view=referrals"
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          activeRecruitView === 'referrals' || activeRecruitView === 'jobs' || activeRecruitView === 'dashboard'
                            ? 'bg-[#F3E8FF] dark:bg-[#8B5CF6]/20 text-[#7C3AED] dark:text-[#C4B5FD]'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <Briefcase className="w-4 h-4 text-[#8B5CF6]" />
                        <span>Jobs & referrals</span>
                      </NavLink>
                    </div>
                  )}
                </div>
              ) : (
                /* 2. HR ADMIN RECRUIT MENU */
                <div className="space-y-4">
                  <div>
                    <button
                      type="button"
                      onClick={() => setOverviewOpen(!overviewOpen)}
                      className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                    >
                      <span>OVERVIEW</span>
                      {overviewOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </button>

                    {overviewOpen && (
                      <div className="mt-1.5 space-y-1">
                        <NavLink
                          to="/recruitment?view=dashboard"
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                            activeRecruitView === 'dashboard'
                              ? 'bg-[#F3E8FF] dark:bg-[#8B5CF6]/20 text-[#7C3AED] dark:text-[#C4B5FD]'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <LayoutGrid className="w-4 h-4 text-[#8B5CF6]" />
                          <span>Recruit dashboard</span>
                        </NavLink>
                      </div>
                    )}
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => setOnboardingOpen(!onboardingOpen)}
                      className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                    >
                      <span>RECRUITMENT & ONBOARDING</span>
                      {onboardingOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </button>

                    {onboardingOpen && (
                      <div className="mt-1.5 space-y-1">
                        <NavLink
                          to="/recruitment?view=jobs"
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                            activeRecruitView === 'jobs'
                              ? 'bg-[#F3E8FF] dark:bg-[#8B5CF6]/20 text-[#7C3AED] dark:text-[#C4B5FD] font-semibold'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <Briefcase className="w-4 h-4 text-slate-500" />
                          <span>Manpower requirements</span>
                        </NavLink>

                        <NavLink
                          to="/recruitment?view=candidates"
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                            activeRecruitView === 'candidates'
                              ? 'bg-[#F3E8FF] dark:bg-[#8B5CF6]/20 text-[#7C3AED] dark:text-[#C4B5FD] font-semibold'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <Users className="w-4 h-4 text-slate-500" />
                          <span>Candidate tracker</span>
                        </NavLink>

                        <NavLink
                          to="/recruitment?view=interviews"
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                            activeRecruitView === 'interviews'
                              ? 'bg-[#F3E8FF] dark:bg-[#8B5CF6]/20 text-[#7C3AED] dark:text-[#C4B5FD] font-semibold'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <Calendar className="w-4 h-4 text-slate-500" />
                          <span>Interview scheduling</span>
                        </NavLink>

                        <NavLink
                          to="/recruitment?view=offers"
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                            activeRecruitView === 'offers'
                              ? 'bg-[#F3E8FF] dark:bg-[#8B5CF6]/20 text-[#7C3AED] dark:text-[#C4B5FD] font-semibold'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <Send className="w-4 h-4 text-slate-500" />
                          <span>Offer letters</span>
                        </NavLink>

                        <NavLink
                          to="/recruitment?view=onboarding"
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                            activeRecruitView === 'onboarding'
                              ? 'bg-[#F3E8FF] dark:bg-[#8B5CF6]/20 text-[#7C3AED] dark:text-[#C4B5FD] font-semibold'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <LogIn className="w-4 h-4 text-slate-500" />
                          <span>Joining formalities</span>
                        </NavLink>

                        <NavLink
                          to="/recruitment?view=checklist"
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                            activeRecruitView === 'checklist'
                              ? 'bg-[#F3E8FF] dark:bg-[#8B5CF6]/20 text-[#7C3AED] dark:text-[#C4B5FD] font-semibold'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <ListFilter className="w-4 h-4 text-slate-500" />
                          <span>Onboarding checklist</span>
                        </NavLink>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ============================================================= */}
          {/* B. PEOPLE SUB-SIDEBAR                                         */}
          {/* ============================================================= */}
          {isPeople && (
            <>
              {/* Header: Green Icon + People + Role Subtitle (Screenshot 4) */}
              <div className="flex items-center gap-3 px-2 py-2">
                <div className="w-10 h-10 rounded-2xl bg-[#10B981] text-white flex items-center justify-center shadow-sm shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white font-heading leading-tight">
                    People
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {isEmployee ? 'Employee self-service' : 'HR Admin'}
                  </p>
                </div>
              </div>

              <div className="h-px bg-slate-100 dark:bg-slate-800" />

              {/* 1. EMPLOYEE PEOPLE MENU (Screenshot 4) */}
              {isEmployee ? (
                <div className="space-y-4">
                  {/* Accordion 1: ME */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setMeOpen(!meOpen)}
                      className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                    >
                      <span>ME</span>
                      {meOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </button>

                    {meOpen && (
                      <div className="mt-1.5 space-y-1">
                        <NavLink
                          to="/employees?view=profile"
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                            activePeopleView === 'profile'
                              ? 'bg-[#E6F7F0] dark:bg-[#10B981]/20 text-[#059669] dark:text-[#34D399]'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <User className="w-4 h-4 text-[#10B981]" />
                          <span>My profile</span>
                        </NavLink>

                        <NavLink
                          to="/employees?view=leave"
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                            activePeopleView === 'leave'
                              ? 'bg-[#E6F7F0] dark:bg-[#10B981]/20 text-[#059669] dark:text-[#34D399] font-semibold'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <Calendar className="w-4 h-4 text-slate-500" />
                          <span>Leave</span>
                        </NavLink>

                        <NavLink
                          to="/employees?view=attendance"
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                            activePeopleView === 'attendance'
                              ? 'bg-[#E6F7F0] dark:bg-[#10B981]/20 text-[#059669] dark:text-[#34D399] font-semibold'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <Clock className="w-4 h-4 text-slate-500" />
                          <span>Attendance</span>
                        </NavLink>
                      </div>
                    )}
                  </div>

                  {/* Accordion 2: GROW */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setGrowOpen(!growOpen)}
                      className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                    >
                      <span>GROW</span>
                      {growOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </button>

                    {growOpen && (
                      <div className="mt-1.5 space-y-1">
                        <NavLink
                          to="/employees?view=goals"
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                            activePeopleView === 'goals'
                              ? 'bg-[#E6F7F0] dark:bg-[#10B981]/20 text-[#059669] dark:text-[#34D399] font-semibold'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <TrendingUp className="w-4 h-4 text-slate-500" />
                          <span>Goals & reviews</span>
                        </NavLink>
                      </div>
                    )}
                  </div>

                  {/* Accordion 3: WORKPLACE */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setWorkplaceOpen(!workplaceOpen)}
                      className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                    >
                      <span>WORKPLACE</span>
                      {workplaceOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </button>

                    {workplaceOpen && (
                      <div className="mt-1.5 space-y-1">
                        <NavLink
                          to="/employees?view=documents"
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                            activePeopleView === 'documents'
                              ? 'bg-[#E6F7F0] dark:bg-[#10B981]/20 text-[#059669] dark:text-[#34D399] font-semibold'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <FileText className="w-4 h-4 text-slate-500" />
                          <span>Documents & letters</span>
                        </NavLink>

                        <NavLink
                          to="/employees?view=assets"
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                            activePeopleView === 'assets'
                              ? 'bg-[#E6F7F0] dark:bg-[#10B981]/20 text-[#059669] dark:text-[#34D399] font-semibold'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <Monitor className="w-4 h-4 text-slate-500" />
                          <span>My assets</span>
                        </NavLink>

                        <NavLink
                          to="/employees?view=helpdesk"
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                            activePeopleView === 'helpdesk'
                              ? 'bg-[#E6F7F0] dark:bg-[#10B981]/20 text-[#059669] dark:text-[#34D399] font-semibold'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <MessageSquare className="w-4 h-4 text-slate-500" />
                          <span>HR helpdesk</span>
                        </NavLink>

                        <NavLink
                          to="/employees?view=resignation"
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                            activePeopleView === 'resignation'
                              ? 'bg-[#E6F7F0] dark:bg-[#10B981]/20 text-[#059669] dark:text-[#34D399] font-semibold'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <LogOut className="w-4 h-4 text-slate-500" />
                          <span>Resignation</span>
                        </NavLink>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* 2. HR ADMIN PEOPLE MENU */
                <div className="space-y-4">
                  <div>
                    <div className="px-2 py-1 text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                      DIRECTORY
                    </div>
                    <div className="mt-1.5 space-y-1">
                      <NavLink
                        to="/employees"
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          !searchParams.get('view') || searchParams.get('view') === 'directory'
                            ? 'bg-[#E6F7F0] dark:bg-[#10B981]/20 text-[#059669] dark:text-[#34D399]'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <Users className="w-4 h-4 text-[#10B981]" />
                        <span>All employees</span>
                      </NavLink>

                      <NavLink
                        to="/employees?view=departments"
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                          searchParams.get('view') === 'departments'
                            ? 'bg-[#E6F7F0] dark:bg-[#10B981]/20 text-[#059669] dark:text-[#34D399] font-semibold'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <LayoutGrid className="w-4 h-4 text-slate-500" />
                        <span>Departments</span>
                      </NavLink>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Bottom of Sub-Sidebar: User Profile Pill (Screenshots 1 & 4) */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 hover:border-slate-200 transition-colors">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-8 h-8 rounded-full text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs ${
                  isEmployee ? 'bg-[#10B981]' : 'bg-[#8B5CF6]'
                }`}
              >
                {initials}
              </div>
              <div className="min-w-0 text-left">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {displayName}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {displayEmail}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
