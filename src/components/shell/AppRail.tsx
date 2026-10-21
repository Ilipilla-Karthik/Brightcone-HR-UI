import React from 'react';
import { NavLink } from 'react-router-dom';
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
import styles from './AppRail.module.css';

interface RailApp {
  id: string;
  name: string;
  path: string;
  icon: React.ReactNode;
}

const RAIL_APPS: RailApp[] = [
  { id: 'suite', name: 'Suite', path: '/suite', icon: <LayoutGrid size={18} /> },
  { id: 'people', name: 'People', path: '/people', icon: <Users size={18} /> },
  { id: 'time', name: 'Time', path: '/time', icon: <Clock size={18} /> },
  { id: 'payroll', name: 'Payroll', path: '/payroll', icon: <CreditCard size={18} /> },
  { id: 'recruit', name: 'Recruit', path: '/recruit', icon: <UserPlus size={18} /> },
  { id: 'learn', name: 'Learn', path: '/learn/dashboard', icon: <BookOpen size={18} /> },
  { id: 'expense', name: 'Expense', path: '/expense', icon: <Receipt size={18} /> },
  { id: 'sign', name: 'Sign', path: '/doc-sign', icon: <FileSignature size={18} /> },
  { id: 'engage', name: 'Connect', path: '/engagement', icon: <HeartHandshake size={18} /> },
];

export const AppRail: React.FC = () => {
  return (
    <nav className={styles.rail} aria-label="Global application rail" data-testid="apprail">
      <NavLink to="/suite" className={styles.logo} title="Brightcone People Plus">
        <span>B</span>
      </NavLink>
      {RAIL_APPS.map((app) => {
        const isLearn = app.id === 'learn';
        return (
          <NavLink
            key={app.id}
            to={app.path}
            className={({ isActive }) =>
              `${styles.appItem} ${isActive || isLearn ? styles.active : ''}`
            }
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
