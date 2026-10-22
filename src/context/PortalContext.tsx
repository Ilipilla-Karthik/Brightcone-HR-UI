import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export type PortalApp = 'recruit' | 'people';
export type UserRoleType = 'admin' | 'employee';

interface PortalContextType {
  currentApp: PortalApp;
  setCurrentApp: (app: PortalApp) => void;
  activeRole: UserRoleType;
  setActiveRole: (role: UserRoleType) => void;
  switchRole: (role: UserRoleType) => void;
  isAppLauncherOpen: boolean;
  setIsAppLauncherOpen: (open: boolean) => void;
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  // Default app from localStorage or 'recruit'
  const [currentApp, setCurrentApp] = useState<PortalApp>(() => {
    return (localStorage.getItem('brightcone_app') as PortalApp) || 'recruit';
  });

  // Role detection: if user role contains 'Admin' or 'HR' -> admin, otherwise employee
  const [activeRole, setActiveRole] = useState<UserRoleType>(() => {
    const saved = localStorage.getItem('brightcone_role_mode') as UserRoleType;
    if (saved) return saved;
    if (user?.role && (user.role.toLowerCase().includes('admin') || user.role.toLowerCase().includes('hr'))) {
      return 'admin';
    }
    return 'employee';
  });

  const [isAppLauncherOpen, setIsAppLauncherOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('brightcone_app', currentApp);
  }, [currentApp]);

  useEffect(() => {
    localStorage.setItem('brightcone_role_mode', activeRole);
  }, [activeRole]);

  useEffect(() => {
    if (user) {
      const email = user.email?.toLowerCase() || '';
      const roleStr = user.role?.toLowerCase() || '';
      if (email === 'admin@brightcone.ai' || roleStr.includes('admin') || roleStr.includes('hr')) {
        setActiveRole('admin');
        localStorage.setItem('brightcone_role_mode', 'admin');
      } else {
        setActiveRole('employee');
        localStorage.setItem('brightcone_role_mode', 'employee');
      }
    }
  }, [user]);

  const switchRole = (role: UserRoleType) => {
    setActiveRole(role);
    localStorage.setItem('brightcone_role_mode', role);
  };

  return (
    <PortalContext.Provider
      value={{
        currentApp,
        setCurrentApp,
        activeRole,
        setActiveRole,
        switchRole,
        isAppLauncherOpen,
        setIsAppLauncherOpen,
      }}
    >
      {children}
    </PortalContext.Provider>
  );
};

export const usePortal = (): PortalContextType => {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
};
