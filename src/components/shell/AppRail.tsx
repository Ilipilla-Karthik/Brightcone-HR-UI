import { NavLink, useLocation } from 'react-router-dom';
import {
  Users,
  Clock,
  CreditCard,
  UserPlus,
  BookOpen,
  Receipt,
  FileSignature,
  HeartHandshake,
  LayoutGrid,
} from 'lucide-react';
import { useAuth } from '../../services/authContext';
import styles from './AppRail.module.css';

interface RailApp {
  id: string;
  name: string;
  path: string;
  icon: React.ReactNode;
}

const RAIL_APPS: RailApp[] = [
  { id: 'suite', name: 'Suite', path: '/suite', icon: <LayoutGrid size={18} /> },
  { id: 'people', name: 'People', path: '/performance/admin', icon: <Users size={18} /> },
  { id: 'time', name: 'Time', path: '/time', icon: <Clock size={18} /> },
  { id: 'payroll', name: 'Payroll', path: '/payroll', icon: <CreditCard size={18} /> },
  { id: 'recruit', name: 'Recruit', path: '/recruit', icon: <UserPlus size={18} /> },
  { id: 'learn', name: 'Learn', path: '/learn/dashboard', icon: <BookOpen size={18} /> },
  { id: 'expense', name: 'Expense', path: '/expense', icon: <Receipt size={18} /> },
  { id: 'sign', name: 'Sign', path: '/doc-sign', icon: <FileSignature size={18} /> },
  { id: 'engage', name: 'Connect', path: '/engagement', icon: <HeartHandshake size={18} /> },
];

export const AppRail: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === 'HR_ADMIN' || user?.role === 'ADMIN';

  return (
    <nav className={styles.rail} aria-label="Global application rail" data-testid="apprail">
      <NavLink to="/suite" className={styles.logo} title="Brightcone People Plus">
        <span>B</span>
      </NavLink>
      {RAIL_APPS.map((app) => {
        let appPath = app.path;
        if (app.id === 'people') {
          appPath = isAdmin ? '/performance/admin' : '/suite';
        } else if (app.id === 'learn') {
          appPath = isAdmin ? '/learn/dashboard' : '/learn/my-learning';
        }

        const isCurrentActive =
          (app.id === 'learn' && location.pathname.startsWith('/learn')) ||
          (app.id === 'people' && location.pathname.startsWith('/performance')) ||
          location.pathname === appPath;

        return (
          <NavLink
            key={app.id}
            to={appPath}
            className={`${styles.appItem} ${isCurrentActive ? styles.active : ''}`}
            title={app.name}
          >
            <div className={styles.appIconWrap}>{app.icon}</div>
            <span className={styles.appLabel}>{app.name}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default AppRail;
