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

  const activeRole: 'hr_admin' | 'employee' = currentPersona === 'admin' ? 'hr_admin' : 'employee';

  const getAccentColor = () => {
    const p = location.pathname;
    if (p.startsWith('/doc-sign') || p.startsWith('/sign') || p.startsWith('/doc_sign')) return '#D9466F';
    if (p.startsWith('/engagement') || p.startsWith('/connect')) return '#0BA6CC';
    if (p.startsWith('/people')) return '#12A58E';
    if (p.startsWith('/recruit')) return '#7C5CFF';
    if (p.startsWith('/payroll')) return '#0F9F6E';
    if (p.startsWith('/expense')) return '#E07A1D';
    if (p.startsWith('/learn')) return '#6366F1';
    if (p.startsWith('/time')) return '#3B82C4';
    return '#0B87FF';
  };

  const accentColor = getAccentColor();

  return (
    <div
      className={styles.appContainer}
      style={{ '--ac': accentColor } as React.CSSProperties}
    >
      <div className={`${styles.sidebarDrawer} ${mobileNavOpen ? styles.open : ''}`}>
        <AppRail role={activeRole} currentPersona={currentPersona} />
        <SidebarNav
          role={activeRole}
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
        <Header
          role={activeRole}
          currentPersona={currentPersona}
          onPersonaChange={onPersonaChange}
          onToggleMobileNav={toggleMobileNav}
        />
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
