import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ic } from '../icons';

interface SidebarNavProps {
  role: 'hr_admin' | 'employee';
  onToggleRole?: () => void;
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

export const SidebarNav: React.FC<SidebarNavProps> = ({ role, onToggleRole }) => {
  const location = useLocation();

  const isDocSign =
    location.pathname.startsWith('/doc-sign') ||
    location.pathname.startsWith('/sign') ||
    location.pathname.startsWith('/doc_sign');

  const getDocSignSections = (): NavSection[] => {
    if (role === 'employee') {
      return [
        {
          title: 'DOCUMENTS',
          items: [
            {
              label: 'Documents to sign',
              to: '/doc-sign/flow',
              badge: 'Action',
              icon: ic('pen', 15),
            },
          ],
        },
      ];
    }

    return [
      {
        title: 'OVERVIEW',
        items: [
          {
            label: 'Sign dashboard',
            to: '/doc-sign/dashboard',
            icon: ic('dashboard', 18),
          },
        ],
      },
      {
        title: 'HR POLICIES & COMPLIANCE',
        items: [
          {
            label: 'Employee handbook',
            to: '/doc-sign/handbook',
            icon: ic('doc', 15),
          },
          {
            label: 'HR policies',
            to: '/doc-sign/policies',
            icon: ic('doc', 15),
          },
          {
            label: 'Policy acknowledgements',
            to: '/doc-sign/acks',
            icon: ic('check', 15),
          },
        ],
      },
      {
        title: 'DOCUMENTS',
        items: [
          {
            label: 'Signature requests',
            to: '/doc-sign/requests',
            icon: ic('pen', 15),
          },
          {
            label: 'Templates',
            to: '/doc-sign/templates',
            icon: ic('doc', 15),
          },
        ],
      },
    ];
  };

  const getSuiteSections = (): NavSection[] => [
    {
      title: 'OVERVIEW',
      items: [
        {
          label: 'Suite Dashboard',
          to: '/suite',
          icon: ic('grid', 15),
        },
        {
          label: 'Sign & DocSign (Live)',
          to: '/doc-sign/dashboard',
          badge: 'Live',
          icon: ic('pen', 15),
        },
      ],
    },
    {
      title: 'HR MODULES',
      items: [
        {
          label: 'People Directory',
          to: '/people',
          icon: ic('users', 15),
        },
        {
          label: 'Recruitment & ATS',
          to: '/recruit',
          icon: ic('briefcase', 15),
        },
        {
          label: 'Payroll & Salary',
          to: '/payroll',
          icon: ic('pay', 15),
        },
        {
          label: 'Expense Claims',
          to: '/expense',
          icon: ic('receipt', 15),
        },
        {
          label: 'Company Feed',
          to: '/engagement',
          icon: ic('chat', 15),
        },
        {
          label: 'Learning & LMS',
          to: '/learn',
          icon: ic('learn', 15),
        },
        {
          label: 'Shifts & Roster',
          to: '/time',
          icon: ic('clock', 15),
        },
        {
          label: 'Workforce Analytics',
          to: '/advanced-hr',
          icon: ic('chart', 15),
        },
      ],
    },
  ];

  const sections = isDocSign ? getDocSignSections() : getSuiteSections();

  return (
    <aside className="side border-r border-[var(--line)] bg-[var(--surface)] flex flex-col p-3 select-none">
      {/* App Header */}
      <div className="apphead flex items-center gap-3 pb-3 mb-2 border-b border-[var(--line)] px-2">
        <i
          className="w-10 h-10 rounded-xl text-white flex items-center justify-center font-bold shadow-sm flex-none overflow-hidden"
          style={{
            background: isDocSign
              ? 'linear-gradient(140deg, #F43F5E, #D9466F)'
              : 'transparent',
            boxShadow: isDocSign
              ? '0 6px 16px -6px rgba(217, 70, 111, 0.5)'
              : 'none',
          }}
        >
          {isDocSign ? ic('pen', 18) : (
            <img src="/logo.png" alt="Brightcone" className="w-8 h-8 object-contain" />
          )}
        </i>
        <div className="min-w-0">
          <b className="block font-heading font-bold text-base text-[var(--text)] truncate no-underline">
            {isDocSign ? 'Sign' : 'People Plus'}
          </b>
          <span className="text-xs text-[var(--muted)] block truncate font-medium no-underline">
            {role === 'hr_admin' ? 'HR Admin' : 'Employee self-service'}
          </span>
        </div>
      </div>

      {/* Nav groups */}
      <div className="flex-1 overflow-y-auto space-y-3 px-1 py-1">
        {sections.map((sec, idx) => (
          <div key={idx} className="space-y-1">
            <div className="navgroup flex items-center justify-between text-[11px] font-bold tracking-wider text-[var(--faint)] px-2 py-1 select-none no-underline">
              <span className="no-underline">{sec.title}</span>
              {ic('chev', 12, 'opacity-60')}
            </div>

            <div className="space-y-0.5">
              {sec.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `nav ${isActive ? 'active' : ''}`
                  }
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="count">{item.badge}</span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Profile Card Footer */}
      <div className="side-foot">
        <div className="agent-card side-user">
          <span className="av" style={{ background: '#7C5CFF' }}>AR</span>
          <div>
            <b>Ananya Rao</b>
            <span>ananya.rao@brightcone.ai</span>
          </div>
          <button
            type="button"
            aria-label="Sign out"
            title="Sign out"
            onClick={onToggleRole}
          >
            {ic('logout', 16)}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default SidebarNav;
