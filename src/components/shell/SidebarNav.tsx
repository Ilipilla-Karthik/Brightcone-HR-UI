import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  BarChart3,
  LogOut,
  ChevronDown,
  Layers,
  Award,
  FileText,
  HelpCircle,
  Shield,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../services/authContext';
import styles from './SidebarNav.module.css';

interface SidebarNavProps {
  currentPersona?: 'admin' | 'employee';
  onPersonaChange?: (persona: 'admin' | 'employee') => void;
  onNavigate?: () => void;
}

interface NavItemDef {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  disabled?: boolean;
}

interface NavGroupDef {
  key: string;
  title: string;
  items: NavItemDef[];
}

const AVC = ['#2457F5', '#14B8E6', '#7C5CFF', '#0FA37F', '#E0811D', '#D9466F', '#3B82C4', '#6366F1'];
const getAvatarColor = (name: string): string => {
  const sum = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVC[sum % AVC.length];
};

export const SidebarNav: React.FC<SidebarNavProps> = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = user?.role === 'HR_ADMIN' || user?.role === 'ADMIN';

  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('bc-pp-navc');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleGroup = (key: string) => {
    setCollapsedGroups((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem('bc-pp-navc', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true, state: null });
  };

  const displayName = user?.name || (isAdmin ? 'Ananya Rao' : 'Rahul Varma');
  const displayEmail = user?.email || (isAdmin ? 'ananya.rao@brightcone.ai' : 'rahul.varma@brightcone.ai');
  const avatarBg = getAvatarColor(displayName);
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const isPerformanceView = location.pathname.startsWith('/performance');

  // Build navigation groups based on module and role
  const groups: NavGroupDef[] = isAdmin
    ? isPerformanceView
      ? [
          {
            key: 'perf-ops',
            title: 'Operations',
            items: [
              {
                id: 'performance',
                label: 'Performance',
                icon: <BarChart3 size={16} />,
                path: '/performance/admin',
              },
              {
                id: 'assets',
                label: 'Assets',
                icon: <Layers size={16} />,
                disabled: true,
              },
              {
                id: 'docs',
                label: 'Documents & letters',
                icon: <FileText size={16} />,
                disabled: true,
              },
              {
                id: 'help',
                label: 'Helpdesk queue',
                icon: <HelpCircle size={16} />,
                disabled: true,
              },
            ],
          },
          {
            key: 'perf-learn',
            title: 'Learning',
            items: [
              {
                id: 'learn-dash',
                label: 'Learn dashboard',
                icon: <LayoutDashboard size={16} />,
                path: '/learn/dashboard',
              },
              {
                id: 'courses',
                label: 'Courses',
                icon: <BookOpen size={16} />,
                path: '/learn/courses',
              },
            ],
          },
        ]
      : [
          {
            key: 'learn-overview',
            title: 'Overview',
            items: [
              {
                id: 'learn-dash',
                label: 'Learn dashboard',
                icon: <LayoutDashboard size={16} />,
                path: '/learn/dashboard',
              },
            ],
          },
          {
            key: 'learn-training-dev',
            title: 'Training & development',
            items: [
              {
                id: 'training-dev',
                label: 'Training & development',
                icon: <GraduationCap size={16} />,
                disabled: true,
              },
            ],
          },
          {
            key: 'learn-compliance',
            title: 'Compliance training',
            items: [
              {
                id: 'posh',
                label: 'POSH training & committee',
                icon: <Shield size={16} />,
                disabled: true,
              },
              {
                id: 'security-training',
                label: 'Security & compliance training',
                icon: <ShieldCheck size={16} />,
                disabled: true,
              },
              {
                id: 'training-completion',
                label: 'Training completion',
                icon: <CheckCircle2 size={16} />,
                disabled: true,
              },
            ],
          },
          {
            key: 'learn-catalogue',
            title: 'Catalogue',
            items: [
              {
                id: 'courses',
                label: 'Courses',
                icon: <BookOpen size={16} />,
                path: '/learn/courses',
              },
            ],
          },
          {
            key: 'learn-performance',
            title: 'Performance',
            items: [
              {
                id: 'performance',
                label: 'Performance',
                icon: <BarChart3 size={16} />,
                path: '/performance/admin',
              },
            ],
          },
        ]
    : [
        {
          key: 'emp-learning',
          title: 'Learning',
          items: [
            {
              id: 'my-learning',
              label: 'My learning',
              icon: <GraduationCap size={16} />,
              path: '/learn/my-learning',
            },
            {
              id: 'training-completion',
              label: 'Training completion',
              icon: <CheckCircle2 size={16} />,
              disabled: true,
            },
            {
              id: 'cert-records',
              label: 'Certificates & records',
              icon: <Award size={16} />,
              disabled: true,
            },
          ],
        },
      ];

  const appTitle = isPerformanceView ? 'Performance' : 'Learn';
  const roleSubtitle = isAdmin ? 'HR Admin' : 'Employee self-service';
  const appIcon = isPerformanceView ? <BarChart3 size={20} /> : <BookOpen size={20} />;

  return (
    <aside className={styles.sidebar} aria-label="Module sidebar" data-testid="sidebarnav">
      <div className={styles.appHead}>
        <div className={styles.appIcon}>{appIcon}</div>
        <div className={styles.appInfo}>
          <h2 className={styles.appTitle}>{appTitle}</h2>
          <p className={styles.appSubtitle}>{roleSubtitle}</p>
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column' }} aria-label="App navigation">
        {groups.map((group) => {
          const isCollapsed = !!collapsedGroups[group.key];
          return (
            <div key={group.key} className={styles.navGroup}>
              <button
                type="button"
                className={styles.ngbtn}
                aria-expanded={!isCollapsed}
                onClick={() => toggleGroup(group.key)}
              >
                <span className={styles.groupLabel}>{group.title}</span>
                <ChevronDown size={13} className={styles.chevron} />
              </button>

              <div className={styles.ngitems} hidden={isCollapsed}>
                {group.items.map((item) => {
                  if (item.disabled || !item.path) {
                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={`${styles.navLink} ${styles.disabled}`}
                        title={`${item.label} (Coming soon)`}
                        aria-disabled="true"
                        disabled
                      >
                        {item.icon}
                        <span>{item.label}</span>
                        <span className={styles.comingSoon}>Coming soon</span>
                      </button>
                    );
                  }

                  return (
                    <NavLink
                      key={item.id}
                      to={item.path}
                      className={({ isActive }) =>
                        `${styles.navLink} ${isActive ? styles.active : ''}`
                      }
                      onClick={() => onNavigate?.()}
                      aria-current={location.pathname === item.path ? 'page' : undefined}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      <div className={styles.sideFoot}>
        <div className={styles.sideUserCard} id="sideUser">
          <span className={styles.avatar} style={{ backgroundColor: avatarBg }}>
            {initials}
          </span>
          <div className={styles.userInfo}>
            <b title={displayName}>{displayName}</b>
            <span title={displayEmail}>{displayEmail}</span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            title="Sign out"
            aria-label="Sign out"
            className={styles.signOutBtn}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default SidebarNav;
