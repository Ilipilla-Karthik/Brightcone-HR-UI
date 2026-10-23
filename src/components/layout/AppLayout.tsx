import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { AppLauncherModal } from './AppLauncherModal';
import { usePortal } from '../../context/PortalContext';

export const AppLayout: React.FC = () => {
  const { currentApp } = usePortal();
  const accentClass = currentApp === 'recruit' ? 'top-accent-recruit' : 'top-accent-people';

  return (
    <div className={`flex min-h-screen bg-[#F8FAFD] dark:bg-[#040A1A] text-slate-800 dark:text-slate-100 transition-colors duration-200 ${accentClass}`}>
      {/* App Switcher Modal */}
      <AppLauncherModal />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />

        {/* Dynamic Route Content */}
        <main className="flex-1 p-6 lg:p-8 w-full max-w-7xl mx-auto overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
