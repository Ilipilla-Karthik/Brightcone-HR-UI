import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from './types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_HR_ADMIN: User = {
  id: 'usr-ananya',
  email: 'ananya.rao@brightcone.ai',
  firstName: 'Ananya',
  lastName: 'Rao',
  role: 'hr_admin',
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
        // fallback to default
      }
    }
    return DEFAULT_HR_ADMIN;
  });

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
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
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
