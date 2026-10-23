import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ic } from '../icons';
import { useAuth } from '../../services/authContext';

interface SidebarNavProps {
  role?: 'hr_admin' | 'employee';
  onToggleRole?: () => void;
  currentPersona?: 'admin' | 'employee';
  onPersonaChange?: (persona: 'admin' | 'employee') => void;
  onNavigate?: () => void;
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

export const SidebarNav: React.FC<SidebarNavProps> = ({ role = 'hr_admin' }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const p = location.pathname;

  const getSections = (): NavSection[] => {
    // 1. Doc Sign Module
    if (p.startsWith('/doc-sign') || p.startsWith('/sign') || p.startsWith('/doc_sign')) {
      if (role === 'employee') {
        return [
          {
            title: 'DOCUMENTS',
            items: [
              { label: 'Documents to sign', to: '/doc-sign/flow', badge: 'Action', icon: ic('pen', 15) },
              { label: 'Employee handbook', to: '/doc-sign/handbook', icon: ic('book', 15) },
              { label: 'HR policies', to: '/doc-sign/policies', icon: ic('shield', 15) },
              { label: 'My acknowledgements', to: '/doc-sign/acks', icon: ic('check', 15) },
            ],
          },
        ];
      }
      return [
        {
          title: 'DOC-SIGN OPS',
          items: [
            { label: 'Sign dashboard', to: '/doc-sign/dashboard', icon: ic('dashboard', 15) },
            { label: 'Signature requests', to: '/doc-sign/requests', badge: 7, icon: ic('send', 15) },
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

    // 2. Learn Module
    if (p.startsWith('/learn')) {
      return [
        {
          title: 'LEARNING & SKILLS',
          items: [
            { label: 'Learn dashboard', to: '/learn/dashboard', icon: ic('dashboard', 15) },
            { label: 'Course catalogue', to: '/learn/courses', icon: ic('learn', 15) },
            { label: 'My learning', to: '/learn/my-learning', icon: ic('book', 15) },
          ],
        },
      ];
    }

    // 3. Performance Module
    if (p.startsWith('/performance')) {
      return [
        {
          title: 'PERFORMANCE',
          items: [
            { label: 'Review cycles', to: '/performance/admin', icon: ic('chart', 15) },
            { label: 'Goals & appraisals', to: '/recruit?tab=referrals', icon: ic('check', 15) },
          ],
        },
      ];
    }

    // 4. People Module
    if (p.startsWith('/people')) {
      return [
        {
          title: 'DIRECTORY & PROFILE',
          items: [
            { label: 'All Employees', to: '/people?tab=directory', icon: ic('users', 15) },
            { label: 'Employee Profile', to: '/people?tab=profile', icon: ic('user', 15) },
          ],
        },
        {
          title: 'TIME & WORKPLACE',
          items: [
            { label: 'Leaves & Balances', to: '/people?tab=leaves', icon: ic('shield', 15) },
            { label: 'Attendance Records', to: '/people?tab=attendance', icon: ic('clock', 15) },
            { label: 'Hardware Assets', to: '/people?tab=assets', icon: ic('grid', 15) },
            { label: 'Employee Documents', to: '/people?tab=documents', icon: ic('book', 15) },
          ],
        },
      ];
    }

    // 5. Recruit Module
    if (p.startsWith('/recruit')) {
      return [
        {
          title: 'TALENT PIPELINE',
          items: [
            { label: 'Pipeline Funnel', to: '/recruit?tab=pipeline', icon: ic('briefcase', 15) },
            { label: 'Candidate Tracker', to: '/recruit?tab=candidates', badge: 8, icon: ic('users', 15) },
            { label: 'Active Job Openings', to: '/recruit?tab=jobs', badge: 4, icon: ic('briefcase', 15) },
          ],
        },
        {
          title: 'EVALUATION & OFFERS',
          items: [
            { label: 'Interview Schedule', to: '/recruit?tab=interviews', badge: 3, icon: ic('clock', 15) },
            { label: 'Offer Letters', to: '/recruit?tab=offers', icon: ic('send', 15) },
            { label: 'Employee Referrals', to: '/recruit?tab=referrals', icon: ic('check', 15) },
          ],
        },
      ];
    }

    // 6. Time & Shift Module
    if (p.startsWith('/time')) {
      return [
        {
          title: 'SHIFTS & ATTENDANCE',
          items: [
            { label: 'Attendance Roster', to: '/time?tab=attendance', icon: ic('clock', 15) },
            { label: 'Shift Scheduling', to: '/time?tab=roster', icon: ic('grid', 15) },
            { label: 'Shift Swapping', to: '/time?tab=swap', icon: ic('chat', 15) },
          ],
        },
        {
          title: 'CALENDAR & LEAVES',
          items: [
            { label: 'Holiday Calendar', to: '/time?tab=holidays', icon: ic('calendar', 15) },
            { label: 'Leave Applications', to: '/time?tab=leaves', icon: ic('shield', 15) },
          ],
        },
      ];
    }

    // 7. Payroll Module
    if (p.startsWith('/payroll')) {
      return [
        {
          title: 'PAYROLL OPERATIONS',
          items: [
            { label: 'Monthly Runs', to: '/payroll?tab=runs', icon: ic('pay', 15) },
            { label: 'Salary Structure', to: '/payroll?tab=structure', icon: ic('template', 15) },
            { label: 'Employee Payslips', to: '/payroll?tab=slips', icon: ic('book', 15) },
          ],
        },
        {
          title: 'COMPLIANCE & PERKS',
          items: [
            { label: 'Statutory Filings (PF/ESI)', to: '/payroll?tab=compliance', icon: ic('shield', 15) },
            { label: 'Benefits & Allowances', to: '/payroll?tab=benefits', icon: ic('check', 15) },
          ],
        },
      ];
    }

    // 8. Expense Module
    if (p.startsWith('/expense')) {
      return [
        {
          title: 'EXPENSE CLAIMS',
          items: [
            { label: 'My Expense Claims', to: '/expense?tab=claims', icon: ic('receipt', 15) },
            { label: 'Approvals Queue', to: '/expense?tab=approvals', badge: 2, icon: ic('check', 15) },
            { label: 'Office Expenses', to: '/expense?tab=office', icon: ic('grid', 15) },
          ],
        },
      ];
    }

    // 9. Engagement / Connect Module
    if (p.startsWith('/engagement')) {
      return [
        {
          title: 'WORKPLACE CONNECT',
          items: [
            { label: 'Company Feed', to: '/engagement?tab=feed', icon: ic('chat', 15) },
            { label: 'Company Events', to: '/engagement?tab=events', icon: ic('calendar', 15) },
            { label: 'Celebrations', to: '/engagement?tab=celebrations', icon: ic('check', 15) },
            { label: 'HR Helpdesk', to: '/engagement?tab=helpdesk', badge: 3, icon: ic('send', 15) },
          ],
        },
      ];
    }

    // 10. Default Suite Navigation
    return [
      {
        title: 'OVERVIEW',
        items: [
          { label: 'Suite dashboard', to: '/suite', icon: ic('grid', 15) },
          { label: 'Company feed', to: '/engagement', icon: ic('chat', 15) },
        ],
      },
      {
        title: 'CORE MODULES',
        items: [
          { label: 'Sign & Documents', to: '/doc-sign/dashboard', icon: ic('pen', 15) },
          { label: 'People Directory', to: '/people', icon: ic('users', 15) },
          { label: 'Recruit & Jobs', to: '/recruit', icon: ic('briefcase', 15) },
          { label: 'Learn & Upskilling', to: '/learn/dashboard', icon: ic('learn', 15) },
          { label: 'Time & Attendance', to: '/time', icon: ic('clock', 15) },
          { label: 'Payroll & Salary', to: '/payroll', icon: ic('pay', 15) },
        ],
      },
    ];
  };

  const sections = getSections();
  const displayName = user
    ? (user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User')
    : (role === 'employee' ? 'Rahul Varma' : 'Ananya Rao');
  const userInitials = displayName.split(' ').filter(Boolean).map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'AR';

  return (
    <aside className="side" aria-label="Sidebar Navigation">
      <div className="side-head">
        <div className="slogo flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#3B82F6] to-[#06B6D4] flex items-center justify-center text-white font-bold text-sm shadow-sm">
            B
          </div>
          <div>
            <b>Brightcone</b>
            <span className="block text-[11px] text-[var(--muted)]">People Plus Portal</span>
          </div>
        </div>
      </div>

      <div className="side-nav custom-scroll">
        {sections.map((section) => (
          <div key={section.title} className="sec">
            <span className="sec-label">{section.title}</span>
            <div className="nav-items space-y-0.5">
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => {
                    const isItemActive =
                      isActive ||
                      (location.pathname + location.search === item.to) ||
                      (location.search === '' && item.to.includes('?tab=') && item.to.endsWith(item.to.split('?tab=')[1]));
                    return `nav ${isItemActive ? 'active' : ''}`;
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && <span className="count">{item.badge}</span>}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="side-foot">
        <div className="agent-card side-user flex items-center justify-between p-2 rounded-xl bg-[var(--surface-2)]">
          <div className="flex items-center gap-2 min-w-0">
            <span className="av w-8 h-8 rounded-full bg-[#7C5CFF] text-white flex items-center justify-center font-bold text-xs">
              {userInitials}
            </span>
            <div className="min-w-0 flex-1 text-left">
              <b className="truncate block text-xs">{displayName}</b>
              <span className="truncate block text-[11px] text-[var(--muted)]">{user?.email || 'ananya.rao@brightcone.ai'}</span>
            </div>
          </div>
          <button
            type="button"
            className="p-1 hover:text-red-500 transition-colors cursor-pointer"
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
