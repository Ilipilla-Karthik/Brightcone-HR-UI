import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AppRail from './AppRail';
import SidebarNav from './SidebarNav';
import Header from './Header';
import styles from './AppLayout.module.css';

interface AppLayoutProps {
  currentPersona: 'admin' | 'employee';
  onPersonaChange: (persona: 'admin' | 'employee') => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ currentPersona, onPersonaChange }) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();

  const toggleMobileNav = () => {
    setMobileNavOpen((prev) => !prev);
  };

  const closeMobileNav = () => {
    setMobileNavOpen(false);
  };

  const isPerformance = location.pathname.startsWith('/performance');
  const accentColor = isPerformance ? '#12A58E' : '#6366F1';

  return (
    <div
      className={styles.appContainer}
      style={{ '--ac': accentColor } as React.CSSProperties}
    >
      <div className={`${styles.sidebarDrawer} ${mobileNavOpen ? styles.open : ''}`}>
        <AppRail />
        <SidebarNav
          currentPersona={currentPersona}
          onPersonaChange={onPersonaChange}
          onNavigate={closeMobileNav}
        />
      </div>

      {mobileNavOpen && (
        <div
          className={styles.mobileBackdrop}
          onClick={closeMobileNav}
          aria-hidden="true"
        />
      )}

      <div
        className={styles.mainArea}
        style={{ '--ac': accentColor } as React.CSSProperties}
      >
        <Header onToggleMobileNav={toggleMobileNav} currentPersona={currentPersona} />
        <main className={styles.contentScrollArea} id="main-content">
          <div className={styles.contentWrapper}>
            <Outlet context={{ currentPersona }} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
