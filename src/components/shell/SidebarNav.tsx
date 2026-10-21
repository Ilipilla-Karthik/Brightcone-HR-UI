import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, GraduationCap, LogOut } from 'lucide-react';
import { useAuth } from '../../services/authContext';
import styles from './SidebarNav.module.css';

interface SidebarNavProps {
  currentPersona?: 'admin' | 'employee';
  onPersonaChange?: (persona: 'admin' | 'employee') => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'HR_ADMIN' || user?.role === 'ADMIN';

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true, state: null });
  };

  const displayName = user?.name || (isAdmin ? 'Ananya Rao' : 'Rahul Varma');
  const displayRole = user?.role
    ? (isAdmin ? 'People Ops Lead' : 'Employee')
    : (isAdmin ? 'People Ops Lead' : 'Backend Engineer');
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside className={styles.sidebar} aria-label="Module sidebar" data-testid="sidebarnav">
      <div className={styles.appHead}>
        <div className={styles.appIcon}>
          <BookOpen size={20} />
        </div>
        <div className={styles.appInfo}>
          <h2 className={styles.appTitle}>Learn</h2>
          <p className={styles.appSubtitle}>Compliance & Skills</p>
        </div>
      </div>

      {isAdmin && (
        <>
          <div className={styles.navGroup}>
            <h3 className={styles.groupLabel}>Overview</h3>
            <NavLink
              to="/learn/dashboard"
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              <LayoutDashboard size={16} />
              <span>Learn dashboard</span>
            </NavLink>
          </div>

          <div className={styles.navGroup}>
            <h3 className={styles.groupLabel}>Catalogue</h3>
            <NavLink
              to="/learn/courses"
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              <BookOpen size={16} />
              <span>Courses</span>
            </NavLink>
          </div>
        </>
      )}

      <div className={styles.navGroup}>
        <h3 className={styles.groupLabel}>Learning</h3>
        <NavLink
          to="/learn/my-learning"
          className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
        >
          <GraduationCap size={16} />
          <span>My learning</span>
        </NavLink>
      </div>

      <div className={styles.sideFoot}>
        <div className={styles.userBar}>
          <div className={styles.avatar}>
            {initials}
          </div>
          <div className={styles.userInfo}>
            <p className={styles.userName}>{displayName}</p>
            <p className={styles.userRole}>{displayRole}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            aria-label="Sign out"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted, #64748B)',
              cursor: 'pointer',
              padding: 6,
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default SidebarNav;
