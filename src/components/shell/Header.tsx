import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Moon, Sun, Bell, Menu, LayoutGrid, ChevronRight, LogOut } from 'lucide-react';
import { useAuth } from '../../services/authContext';
import styles from './Header.module.css';

interface HeaderProps {
  onToggleMobileNav?: () => void;
  currentPersona?: 'admin' | 'employee';
}

const AVC = ['#2457F5', '#14B8E6', '#7C5CFF', '#0FA37F', '#E0811D', '#D9466F', '#3B82C4', '#6366F1'];
const getAvatarColor = (name: string): string => {
  const sum = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVC[sum % AVC.length];
};

export const Header: React.FC<HeaderProps> = ({ onToggleMobileNav }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('bc-theme');
      if (saved) return saved === 'dark';
    } catch {}
    return document.documentElement.getAttribute('data-theme') === 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.setAttribute('data-theme', 'dark');
      try {
        localStorage.setItem('bc-theme', 'dark');
      } catch {}
    } else {
      root.setAttribute('data-theme', 'light');
      try {
        localStorage.setItem('bc-theme', 'light');
      } catch {}
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true, state: null });
  };

  const isAdmin = user?.role === 'HR_ADMIN' || user?.role === 'ADMIN';
  const displayName = user?.name || (isAdmin ? 'Ananya Rao' : 'Rahul Varma');
  const displayRole = isAdmin ? 'HR Admin' : 'Employee';
  const avatarBg = getAvatarColor(displayName);
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // Dynamic breadcrumb mapping
  let moduleName = 'Learn';
  let pageName = 'Learn dashboard';

  if (location.pathname.startsWith('/performance')) {
    moduleName = 'Performance';
    pageName = 'Review cycles';
  } else if (location.pathname === '/learn/courses') {
    moduleName = 'Learn';
    pageName = 'Courses';
  } else if (location.pathname === '/learn/my-learning') {
    moduleName = 'Learn';
    pageName = 'My learning';
  } else if (location.pathname === '/learn/dashboard') {
    moduleName = 'Learn';
    pageName = 'Learn dashboard';
  }

  return (
    <header className={styles.header} data-testid="header">
      <div className={styles.left}>
        <button
          className={`${styles.iconBtn} ${styles.menuButton}`}
          onClick={onToggleMobileNav}
          aria-label="Open menu"
          title="Open menu"
        >
          <Menu size={18} />
        </button>

        <button
          className={`${styles.iconBtn} ${styles.disabled}`}
          aria-label="All apps (Coming soon)"
          title="All apps (Coming soon)"
          type="button"
          disabled
          aria-disabled="true"
        >
          <LayoutGrid size={18} />
        </button>

        <div className={styles.crumb} id="crumb">
          <span>{moduleName}</span>
          <ChevronRight size={14} className={styles.crumbChev} />
          <b>{pageName}</b>
        </div>
      </div>

      <div
        className={`${styles.cmdBar} ${styles.disabled}`}
        role="search"
        aria-label="Search people, pages or actions (Coming soon)"
        title="Search people, pages or actions (Coming soon)"
        aria-disabled="true"
      >
        <Search size={16} />
        <span>Search people, pages or actions</span>
        <span className={styles.comingSoonBadge}>Coming soon</span>
        <kbd className={styles.kbd}>Ctrl K</kbd>
      </div>

      <div className={styles.right}>
        <button
          className={styles.iconBtn}
          id="themeBtn"
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          type="button"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          className={`${styles.iconBtn} ${styles.disabled}`}
          id="bell"
          aria-label="Notifications (Coming soon)"
          title="Notifications (Coming soon)"
          type="button"
          disabled
          aria-disabled="true"
        >
          <Bell size={18} />
        </button>

        <div className={styles.me} id="me">
          <span className={styles.avatar} style={{ backgroundColor: avatarBg }}>
            {initials}
          </span>
          <div className={styles.meText}>
            <b>{displayName}</b>
            <span>{displayRole}</span>
          </div>
        </div>

        <button
          className={styles.iconBtn}
          onClick={handleLogout}
          aria-label="Sign out"
          title="Sign out"
          type="button"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default Header;
