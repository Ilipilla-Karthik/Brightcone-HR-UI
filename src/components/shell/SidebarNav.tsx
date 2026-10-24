import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ic } from '../icons';
import { useAuth } from '../../services/authContext';

interface SidebarNavProps {
  role?: 'hr_admin' | 'employee';
  onToggleRole?: () => void;
  onNavigate?: () => void;
  currentPersona?: 'admin' | 'employee';
  onPersonaChange?: (persona: 'admin' | 'employee') => void;
  onSwitchRole?: (role: 'hr_admin' | 'employee') => void;
}

interface NavItem {
  label: string;
  to: string;
  badge?: string | number;
  icon: React.ReactNode;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  role = 'hr_admin',
  currentPersona,
  onNavigate,
}) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const p = location.pathname;

  // Bulletproof role determination based strictly on logged-in user and portal state
  const isEmployee =
    user?.role?.toLowerCase()?.includes('employee') ||
    user?.email?.toLowerCase()?.includes('rahul') ||
    role === 'employee' ||
    currentPersona === 'employee';

  const activeRole: 'hr_admin' | 'employee' = isEmployee ? 'employee' : 'hr_admin';

  // Only two apps in scope: Sign and Connect
  const isSign = p.startsWith('/doc-sign') || p.startsWith('/sign') || p.startsWith('/doc_sign');
  const appInfo = isSign
    ? { name: 'Sign', color: '#D9466F', icon: ic('pen', 20) }
    : { name: 'Connect', color: '#0BA6CC', icon: ic('chat', 20) };

  const getSections = (): NavSection[] => {
    // 1. Sign Module
    if (isSign) {
      if (activeRole === 'employee') {
        return [
          {
            title: 'DOCUMENTS',
            items: [{ label: 'My documents', to: '/doc-sign/flow', badge: 'Action', icon: ic('pen', 15) }],
          },
        ];
      }
      return [
        {
          title: 'OVERVIEW',
          items: [{ label: 'Dashboard', to: '/doc-sign/dashboard', icon: ic('dashboard', 15) }],
        },
        {
          title: 'DOCUMENTS',
          items: [
            { label: 'Documents', to: '/doc-sign/requests', badge: 4, icon: ic('pen', 15) },
            { label: 'Templates', to: '/doc-sign/templates', icon: ic('template', 15) },
          ],
        },
        {
          title: 'ORGANIZATION POLICIES',
          items: [
            { label: 'Employee handbook', to: '/doc-sign/handbook', icon: ic('book', 15) },
            { label: 'HR policies', to: '/doc-sign/policies', icon: ic('shield', 15) },
            { label: 'Policy acknowledgements', to: '/doc-sign/acks', icon: ic('check', 15) },
          ],
        },
      ];
    }

    // 2. Connect Module
    if (activeRole === 'employee') {
      return [
        {
          title: 'COMMUNITY',
          items: [
            { label: 'Feed', to: '/engagement/feed', icon: ic('chat', 15) },
            { label: 'Directory', to: '/engagement/directory', icon: ic('users', 15) },
          ],
        },
      ];
    }

    return [
      {
        title: 'OVERVIEW',
        items: [{ label: 'Feed', to: '/engagement/feed', icon: ic('chat', 15) }],
      },
      {
        title: 'COMMUNICATE',
        items: [
          { label: 'Announcements', to: '/engagement/announcements', icon: ic('mega', 15) },
          { label: 'Directory', to: '/engagement/directory', icon: ic('users', 15) },
        ],
      },
      {
        title: 'EMPLOYEE ENGAGEMENT',
        items: [
          { label: 'Events', to: '/engagement/events', icon: ic('calendar', 15) },
          { label: 'Feedback', to: '/engagement/feedback', icon: ic('chat', 15) },
          { label: 'Town halls', to: '/engagement/townhall', icon: ic('mega', 15) },
          { label: 'Celebrations', to: '/engagement/celebrations', icon: ic('gift', 15) },
        ],
      },
    ];
  };

  const sections = getSections();
  const displayName = activeRole === 'employee' ? 'Rahul Varma' : 'Ananya Rao';
  const displayEmail = activeRole === 'employee' ? 'rahul.varma@brightcone.ai' : 'ananya.rao@brightcone.ai';
  const userInitials = activeRole === 'employee' ? 'RV' : 'AR';

  return (
    <aside className="side" aria-label="Sidebar Navigation" style={{ '--ac': appInfo.color } as React.CSSProperties}>
      {/* App Header with App Icon and Portal Subtitle */}
      <div className="apphead flex items-center gap-3 pb-4 mb-2 border-b border-[var(--line)]">
        <i
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md transition-all"
          style={{ background: appInfo.color }}
        >
          {appInfo.icon}
        </i>
        <div className="min-w-0 flex-1 text-left">
          <b className="font-['Sora'] text-[16px] font-semibold tracking-tight text-[var(--text)] block truncate">
            {appInfo.name}
          </b>
          <span className="text-xs text-[var(--muted)] block">
            {activeRole === 'hr_admin' ? 'HR Admin' : 'Employee self-service'}
          </span>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav id="nav" className="side-nav flex-1 overflow-y-auto custom-scroll space-y-4">
        {sections.map((section) => (
          <div key={section.title} className="sec">
            <span className="navgroup text-[11px] font-bold uppercase tracking-wider text-[var(--faint)] px-2.5 py-1 block">
              {section.title}
            </span>
            <div className="nav-items space-y-0.5 mt-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onNavigate}
                  className={({ isActive }) => {
                    const isItemActive =
                      isActive ||
                      location.pathname + location.search === item.to ||
                      (location.search === '' && item.to.includes('?tab=') && item.to.endsWith(item.to.split('?tab=')[1]));
                    return `nav flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      isItemActive
                        ? 'active font-semibold text-[var(--text)]'
                        : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]'
                    }`;
                  }}
                  style={({ isActive }) =>
                    isActive
                      ? ({
                          background: `color-mix(in srgb, ${appInfo.color} 14%, transparent)`,
                          color: appInfo.color,
                        } as React.CSSProperties)
                      : {}
                  }
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[var(--bad)] text-white">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Side User Footer */}
      <div className="side-foot pt-3 border-t border-[var(--line)] mt-auto">
        <div className="side-user flex items-center justify-between p-2 rounded-xl bg-[var(--surface-2)]">
          <div className="flex items-center gap-2.5 min-w-0">
            <span
              className="av w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-xs shrink-0"
              style={{ background: appInfo.color }}
            >
              {userInitials}
            </span>
            <div className="min-w-0 flex-1 text-left">
              <b className="truncate block text-xs text-[var(--text)] font-semibold">{displayName}</b>
              <span className="truncate block text-[11px] text-[var(--muted)]">{displayEmail}</span>
            </div>
          </div>
          <button
            type="button"
            className="p-1.5 text-[var(--muted)] hover:text-red-500 rounded-lg hover:bg-[var(--surface)] transition-colors cursor-pointer"
            aria-label="Sign out"
            title="Sign out"
            onClick={logout}
          >
            {ic('logout', 16)}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default SidebarNav;
