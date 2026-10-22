import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Users,
  Briefcase,
  CreditCard,
  Receipt,
  FileSignature,
  HeartHandshake,
  BookOpen,
  Calendar,
  LayoutGrid,
} from 'lucide-react';
import { useAuth } from '../../services/authContext';
import styles from './AppRail.module.css';

interface RailAppConfig {
  id: string;
  name: string;
  color: string;
  icon: React.ReactNode;
  path?: string;
  disabled?: boolean;
}

export const AppRail: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === 'HR_ADMIN' || user?.role === 'ADMIN';

  const apps: RailAppConfig[] = [
    {
      id: 'plus',
      name: 'People Plus',
      color: '#0B6FDB',
      icon: <LayoutGrid size={18} />,
      disabled: true,
    },
    {
      id: 'people',
      name: 'People',
      color: '#12A58E',
      icon: <Users size={18} />,
      path: isAdmin ? '/performance/admin' : undefined,
      disabled: !isAdmin,
    },
    {
      id: 'recruit',
      name: 'Recruit',
      color: '#7C5CFF',
      icon: <Briefcase size={18} />,
      disabled: true,
    },
    {
      id: 'payroll',
      name: 'Payroll',
      color: '#0F9F6E',
      icon: <CreditCard size={18} />,
      disabled: true,
    },
    {
      id: 'expense',
      name: 'Expense',
      color: '#E07A1D',
      icon: <Receipt size={18} />,
      disabled: true,
    },
    {
      id: 'sign',
      name: 'Sign',
      color: '#D9466F',
      icon: <FileSignature size={18} />,
      disabled: true,
    },
    {
      id: 'connect',
      name: 'Connect',
      color: '#0BA6CC',
      icon: <HeartHandshake size={18} />,
      disabled: true,
    },
    {
      id: 'learn',
      name: 'Learn',
      color: '#6366F1',
      icon: <BookOpen size={18} />,
      path: isAdmin ? '/learn/dashboard' : '/learn/my-learning',
      disabled: false,
    },
    {
      id: 'shift',
      name: 'Shift',
      color: '#3B82C4',
      icon: <Calendar size={18} />,
      disabled: true,
    },
  ];

  return (
    <nav className={styles.rail} aria-label="Global application rail" data-testid="apprail">
      <NavLink
        to={isAdmin ? '/learn/dashboard' : '/learn/my-learning'}
        className={styles.rlogo}
        title="People Plus home"
        aria-label="People Plus home"
      >
        <img src="/rlogo.png" alt="Brightcone People Plus" />
      </NavLink>

      <div className={styles.rapps} id="rapps">
        {apps.map((app) => {
          const isActive =
            (app.id === 'learn' && location.pathname.startsWith('/learn')) ||
            (app.id === 'people' && location.pathname.startsWith('/performance'));

          if (app.disabled || !app.path) {
            return (
              <button
                key={app.id}
                type="button"
                className={`${styles.rapp} ${styles.disabled}`}
                style={{ '--ac': app.color } as React.CSSProperties}
                title={`${app.name} (Coming soon)`}
                aria-disabled="true"
                disabled
              >
                <i>{app.icon}</i>
                <span>{app.name}</span>
              </button>
            );
          }

          return (
            <NavLink
              key={app.id}
              to={app.path}
              className={`${styles.rapp} ${isActive ? styles.on : ''}`}
              style={{ '--ac': app.color } as React.CSSProperties}
              title={app.name}
              aria-current={isActive ? 'page' : undefined}
            >
              <i>{app.icon}</i>
              <span>{app.name}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default AppRail;
