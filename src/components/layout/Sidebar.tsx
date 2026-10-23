import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePortal, PortalApp } from '../../context/PortalContext';
import { BrightconeIcon } from '../common/BrightconeLogo';
import {
  Briefcase,
  Users,
  LayoutDashboard,
  Calendar,
  Send,
  UserCheck,
  CheckSquare,
  GraduationCap,
  Clock,
  TrendingUp,
  FileText,
  Laptop,
  HelpCircle,
  DoorOpen,
  LogOut,
  ChevronDown,
  User as UserIcon,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  const { currentApp, setCurrentApp, activeRole } = usePortal();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await logout();
    navigate('/signin');
  };

  const handleSwitchApp = (app: PortalApp) => {
    setCurrentApp(app);
    if (app === 'recruit') {
      if (activeRole === 'employee') {
        navigate('/recruit/jobs-referrals');
      } else {
        navigate('/recruit/dashboard');
      }
    } else {
      if (activeRole === 'employee') {
        navigate('/people/profile');
      } else {
        navigate('/people/directory');
      }
    }
  };

  const isEmployee = activeRole === 'employee';
  const isRecruit = currentApp === 'recruit';

  // Branding configuration
  const appTitle = isRecruit ? 'Recruit' : 'People';
  const appSubtitle = isEmployee ? 'Employee self-service' : 'HR Admin';
  const brandIcon = isRecruit ? <Briefcase className="w-5 h-5 text-white" /> : <Users className="w-5 h-5 text-white" />;
  const brandBoxClass = isRecruit ? 'sidebar-icon-recruit' : 'sidebar-icon-people';

  // User card at bottom
  const userInitials = isEmployee ? 'RV' : 'AR';
  const userName = isEmployee ? 'Rahul Varma' : 'Ananya Rao';
  const userEmail = isEmployee ? 'rahul.varma@brightcone.ai' : 'ananya.rao@brightcone.ai';
  const avatarClass = isEmployee ? 'avatar-rv' : 'avatar-ar';

  return (
    <div className="flex shrink-0 min-h-screen select-none z-30">
      {/* ================================================================= */}
      {/* LEFT DARK APP DOCK RAIL matching Screenshot 5 */}
      {/* ================================================================= */}
      <nav className="app-dock-rail" aria-label="Application Dock">
        {/* Top: Brightcone 3D Crystal Prism Logo Mark */}
        <div 
          onClick={() => handleSwitchApp('recruit')}
          className="cursor-pointer hover:scale-105 transition-transform p-1 mb-2"
          title="Brightcone AI"
        >
          <BrightconeIcon size={36} />
        </div>

        {/* Dock Item 1: Recruit */}
        <button
          onClick={() => handleSwitchApp('recruit')}
          type="button"
          className={`dock-item-btn ${isRecruit ? 'dock-item-active-recruit' : ''}`}
          title="Recruit Application"
        >
          <Briefcase className="w-5 h-5" />
          <span className="dock-label">Recruit</span>
        </button>

        {/* Dock Item 2: People (with red notification badge 4 matching Screenshot 5) */}
        <button
          onClick={() => handleSwitchApp('people')}
          type="button"
          className={`dock-item-btn ${!isRecruit ? 'dock-item-active-people' : ''}`}
          title="People Application"
        >
          <Users className="w-5 h-5" />
          <span className="dock-label">People</span>
          <span className="dock-badge-pill">4</span>
        </button>
      </nav>

      {/* ================================================================= */}
      {/* SUBMENU SIDEBAR (White/Light in Light Theme, Dark in Dark Theme) */}
      {/* ================================================================= */}
      <aside className="w-56 sm:w-60 bg-white dark:bg-[#070E22] border-r border-slate-200 dark:border-slate-800/80 flex flex-col justify-between text-slate-800 dark:text-slate-200 transition-colors duration-200 shadow-sm">
        <div>
          {/* Top Header Card matching Screenshot 5 */}
          <div className="sidebar-brand-card border-b border-slate-100 dark:border-slate-800/60">
            <div className={`sidebar-icon-box ${brandBoxClass}`}>
              {brandIcon}
            </div>
            <div>
              <div className="text-base font-bold text-slate-900 dark:text-white leading-tight font-['Sora']">
                {appTitle}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {appSubtitle}
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="py-3 px-2 space-y-4 overflow-y-auto max-h-[calc(100vh-170px)]">
            {/* ------------------------------------------------------------- */}
            {/* EMPLOYEE SELF-SERVICE NAVIGATION */}
            {/* ------------------------------------------------------------- */}
            {isEmployee && (
              <>
                {isRecruit ? (
                  <div>
                    <div className="nav-category-header">
                      <span>Careers</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </div>
                    <div className="space-y-1">
                      <NavLink
                        to="/recruit/jobs-referrals"
                        className={({ isActive }) =>
                          `nav-item-link ${isActive ? 'nav-item-active-recruit' : ''}`
                        }
                      >
                        <Briefcase className="w-4 h-4 shrink-0" />
                        <span>Jobs & referrals</span>
                      </NavLink>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <div className="nav-category-header">
                        <span>Me</span>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </div>
                      <div className="space-y-1">
                        <NavLink
                          to="/people/profile"
                          className={({ isActive }) =>
                            `nav-item-link ${isActive ? 'nav-item-active-people' : ''}`
                          }
                        >
                          <UserIcon className="w-4 h-4 shrink-0" />
                          <span>My profile</span>
                        </NavLink>
                        <NavLink
                          to="/people/leave"
                          className={({ isActive }) =>
                            `nav-item-link ${isActive ? 'nav-item-active-people' : ''}`
                          }
                        >
                          <Calendar className="w-4 h-4 shrink-0" />
                          <span>Leave</span>
                        </NavLink>
                        <NavLink
                          to="/people/attendance"
                          className={({ isActive }) =>
                            `nav-item-link ${isActive ? 'nav-item-active-people' : ''}`
                          }
                        >
                          <Clock className="w-4 h-4 shrink-0" />
                          <span>Attendance</span>
                        </NavLink>
                      </div>
                    </div>

                    <div>
                      <div className="nav-category-header">
                        <span>Grow</span>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </div>
                      <div className="space-y-1">
                        <NavLink
                          to="/people/goals"
                          className={({ isActive }) =>
                            `nav-item-link ${isActive ? 'nav-item-active-people' : ''}`
                          }
                        >
                          <TrendingUp className="w-4 h-4 shrink-0" />
                          <span>Goals & reviews</span>
                        </NavLink>
                      </div>
                    </div>

                    <div>
                      <div className="nav-category-header">
                        <span>Workplace</span>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </div>
                      <div className="space-y-1">
                        <NavLink
                          to="/people/documents"
                          className={({ isActive }) =>
                            `nav-item-link ${isActive ? 'nav-item-active-people' : ''}`
                          }
                        >
                          <FileText className="w-4 h-4 shrink-0" />
                          <span>Documents & letters</span>
                        </NavLink>
                        <NavLink
                          to="/people/assets"
                          className={({ isActive }) =>
                            `nav-item-link ${isActive ? 'nav-item-active-people' : ''}`
                          }
                        >
                          <Laptop className="w-4 h-4 shrink-0" />
                          <span>My assets</span>
                        </NavLink>
                        <NavLink
                          to="/people/helpdesk"
                          className={({ isActive }) =>
                            `nav-item-link ${isActive ? 'nav-item-active-people' : ''}`
                          }
                        >
                          <HelpCircle className="w-4 h-4 shrink-0" />
                          <span>HR helpdesk</span>
                        </NavLink>
                        <NavLink
                          to="/people/resignation"
                          className={({ isActive }) =>
                            `nav-item-link ${isActive ? 'nav-item-active-people' : ''}`
                          }
                        >
                          <DoorOpen className="w-4 h-4 shrink-0" />
                          <span>Resignation</span>
                        </NavLink>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {/* ------------------------------------------------------------- */}
            {/* HR ADMIN COMPANY-WIDE NAVIGATION matching Screenshots 3, 4, 5 */}
            {/* ------------------------------------------------------------- */}
            {!isEmployee && (
              <>
                {isRecruit ? (
                  <>
                    <div>
                      <div className="nav-category-header">
                        <span>Overview</span>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </div>
                      <div className="space-y-1">
                        <NavLink
                          to="/recruit/dashboard"
                          className={({ isActive }) =>
                            `nav-item-link ${isActive ? 'nav-item-active-recruit' : ''}`
                          }
                        >
                          <LayoutDashboard className="w-4 h-4 shrink-0" />
                          <span>Recruit dashboard</span>
                        </NavLink>
                      </div>
                    </div>

                    <div>
                      <div className="nav-category-header">
                        <span>Recruitment & Onboarding</span>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </div>
                      <div className="space-y-1">
                        <NavLink
                          to="/recruit/manpower"
                          className={({ isActive }) =>
                            `nav-item-link ${isActive ? 'nav-item-active-recruit' : ''}`
                          }
                        >
                          <Briefcase className="w-4 h-4 shrink-0" />
                          <span>Manpower requirements</span>
                        </NavLink>
                        <NavLink
                          to="/recruit/candidate-tracker"
                          className={({ isActive }) =>
                            `nav-item-link ${isActive ? 'nav-item-active-recruit' : ''}`
                          }
                        >
                          <Users className="w-4 h-4 shrink-0" />
                          <span>Candidate tracker</span>
                        </NavLink>
                        <NavLink
                          to="/recruit/interviews"
                          className={({ isActive }) =>
                            `nav-item-link ${isActive ? 'nav-item-active-recruit' : ''}`
                          }
                        >
                          <Calendar className="w-4 h-4 shrink-0" />
                          <span>Interview scheduling</span>
                        </NavLink>
                        <NavLink
                          to="/recruit/offers"
                          className={({ isActive }) =>
                            `nav-item-link ${isActive ? 'nav-item-active-recruit' : ''}`
                          }
                        >
                          <Send className="w-4 h-4 shrink-0" />
                          <span>Offer letters</span>
                        </NavLink>
                        <NavLink
                          to="/recruit/joining"
                          className={({ isActive }) =>
                            `nav-item-link ${isActive ? 'nav-item-active-recruit' : ''}`
                          }
                        >
                          <UserCheck className="w-4 h-4 shrink-0" />
                          <span>Joining formalities</span>
                        </NavLink>
                        <NavLink
                          to="/recruit/onboarding"
                          className={({ isActive }) =>
                            `nav-item-link ${isActive ? 'nav-item-active-recruit' : ''}`
                          }
                        >
                          <CheckSquare className="w-4 h-4 shrink-0" />
                          <span>Onboarding checklist</span>
                        </NavLink>
                        <NavLink
                          to="/recruit/internships"
                          className={({ isActive }) =>
                            `nav-item-link ${isActive ? 'nav-item-active-recruit' : ''}`
                          }
                        >
                          <GraduationCap className="w-4 h-4 shrink-0" />
                          <span>Internship management</span>
                        </NavLink>
                      </div>
                    </div>

                    <div>
                      <div className="nav-category-header">
                        <span>Hiring</span>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </div>
                      <div className="space-y-1">
                        <NavLink
                          to="/recruit/pipeline"
                          className={({ isActive }) =>
                            `nav-item-link ${isActive ? 'nav-item-active-recruit' : ''}`
                          }
                        >
                          <Briefcase className="w-4 h-4 shrink-0" />
                          <span>Pipeline & jobs</span>
                        </NavLink>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <div className="nav-category-header">
                        <span>Workforce Management</span>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </div>
                      <div className="space-y-1">
                        <NavLink
                          to="/people/directory"
                          className={({ isActive }) =>
                            `nav-item-link ${isActive ? 'nav-item-active-people' : ''}`
                          }
                        >
                          <Users className="w-4 h-4 shrink-0" />
                          <span>Directory & profiles</span>
                        </NavLink>
                        <NavLink
                          to="/people/leaves-admin"
                          className={({ isActive }) =>
                            `nav-item-link ${isActive ? 'nav-item-active-people' : ''}`
                          }
                        >
                          <Calendar className="w-4 h-4 shrink-0" />
                          <span>Leave approvals</span>
                        </NavLink>
                        <NavLink
                          to="/people/attendance-admin"
                          className={({ isActive }) =>
                            `nav-item-link ${isActive ? 'nav-item-active-people' : ''}`
                          }
                        >
                          <Clock className="w-4 h-4 shrink-0" />
                          <span>Attendance logs</span>
                        </NavLink>
                      </div>
                    </div>

                    <div>
                      <div className="nav-category-header">
                        <span>Company Operations</span>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </div>
                      <div className="space-y-1">
                        <NavLink
                          to="/people/policies"
                          className={({ isActive }) =>
                            `nav-item-link ${isActive ? 'nav-item-active-people' : ''}`
                          }
                        >
                          <FileText className="w-4 h-4 shrink-0" />
                          <span>Company policies</span>
                        </NavLink>
                        <NavLink
                          to="/people/assets-admin"
                          className={({ isActive }) =>
                            `nav-item-link ${isActive ? 'nav-item-active-people' : ''}`
                          }
                        >
                          <Laptop className="w-4 h-4 shrink-0" />
                          <span>Asset inventory</span>
                        </NavLink>
                        <NavLink
                          to="/people/helpdesk-admin"
                          className={({ isActive }) =>
                            `nav-item-link ${isActive ? 'nav-item-active-people' : ''}`
                          }
                        >
                          <HelpCircle className="w-4 h-4 shrink-0" />
                          <span>Helpdesk queue</span>
                        </NavLink>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Bottom User Card */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 bg-white dark:bg-[#070E22]">
          <div className="sidebar-user-card bg-slate-50 dark:bg-[#0E1833]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`avatar-circle ${avatarClass}`}>
                {userInitials}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {userName}
                </div>
                <div className="text-[10.5px] text-slate-500 dark:text-slate-400 truncate">
                  {userEmail}
                </div>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
