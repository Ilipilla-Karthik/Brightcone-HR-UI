import React, { useState, useEffect } from 'react';
import { Search, Moon, Sun, Bell, Menu } from 'lucide-react';
import { useAuth } from '../../services/authContext';
import styles from './Header.module.css';

interface HeaderProps {
  onToggleMobileNav?: () => void;
  currentPersona?: 'admin' | 'employee';
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileNav, currentPersona }) => {
  const { user } = useAuth();
  const [isDark, setIsDark] = useState<boolean>(() => {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const isAdmin = user?.role === 'HR_ADMIN' || user?.role === 'ADMIN' || currentPersona === 'admin';
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
    <header className={styles.header} data-testid="header">
      <div className={styles.left}>
        <button
          className={styles.menuButton}
          onClick={onToggleMobileNav}
          aria-label="Toggle Navigation"
        >
          <Menu size={18} />
        </button>
        <div className={styles.breadcrumb}>
          <span>People Plus</span>
          <span>/</span>
          <span className={styles.breadcrumbActive}>Learn</span>
        </div>
      </div>

      <div className={styles.cmdBar} role="button" tabIndex={0} aria-label="Command search">
        <Search size={15} />
        <span>Search courses, people, policies...</span>
        <kbd className={styles.kbd}>⌘K</kbd>
      </div>

      <div className={styles.right}>
        <button
          className={styles.iconBtn}
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Light mode' : 'Dark mode'}
        >
          {isDark ? <Sun size={17} /> : <Moon size={17} />}
        </button>
        <button className={styles.iconBtn} aria-label="Notifications" title="Notifications">
          <Bell size={17} />
          <span className={styles.dot} />
        </button>
        <div className={styles.me}>
          <span
            className={styles.avatar}
            style={{ backgroundColor: isAdmin ? '#7C5CFF' : '#2457F5' }}
          >
            {initials}
          </span>
          <div className={styles.meText}>
            <b>{displayName}</b>
            <span>{displayRole}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
