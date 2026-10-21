import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
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

  const toggleMobileNav = () => {
    setMobileNavOpen((prev) => !prev);
  };

  const closeMobileNav = () => {
    setMobileNavOpen(false);
  };

  return (
    <div className={styles.appContainer}>
      <div className={`${styles.sidebarDrawer} ${mobileNavOpen ? styles.open : ''}`}>
        <AppRail />
        <SidebarNav currentPersona={currentPersona} onPersonaChange={onPersonaChange} />
      </div>

      {mobileNavOpen && (
        <div
          className={styles.mobileBackdrop}
          onClick={closeMobileNav}
          aria-hidden="true"
        />
      )}

      <div className={styles.mainArea}>
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
