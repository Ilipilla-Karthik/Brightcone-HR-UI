import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from './types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  switchUserRole: (role: 'hr_admin' | 'employee') => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_HR_ADMIN: User = {
  id: 'usr-ananya',
  email: 'ananya.rao@brightcone.ai',
  firstName: 'Ananya',
  lastName: 'Rao',
  role: 'hr_admin',
};

const DEFAULT_EMPLOYEE: User = {
  id: 'usr-rahul',
  email: 'rahul.varma@brightcone.ai',
  firstName: 'Rahul',
  lastName: 'Varma',
  role: 'employee',
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    if (localStorage.getItem('bc_logged_out') === 'true') {
      return null;
    }
    return localStorage.getItem('token') || 'bc_session_active';
  });

  const [user, setUser] = useState<User | null>(() => {
    if (localStorage.getItem('bc_logged_out') === 'true') {
      return null;
    }
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // fallback
      }
    }
    return DEFAULT_HR_ADMIN;
  });

  const [isLoading] = useState<boolean>(false);

  const login = (newToken: string, newUser: User) => {
    localStorage.removeItem('bc_logged_out');
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.setItem('bc_logged_out', 'true');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('persona');
    setToken(null);
    setUser(null);
  };

  const switchUserRole = (newRole: 'hr_admin' | 'employee') => {
    const newUser = newRole === 'employee' ? DEFAULT_EMPLOYEE : DEFAULT_HR_ADMIN;
    localStorage.removeItem('bc_logged_out');
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('persona', newRole === 'employee' ? 'employee' : 'admin');
    setUser(newUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        switchUserRole,
        isAuthenticated: !!token,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
