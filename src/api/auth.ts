import api from './client';
import type { AuthResponse, User } from '../types';

export const authApi = {
  login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/login', credentials);
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify({
        pid: res.data.pid,
        name: res.data.name,
        email: res.data.email,
        role: res.data.role,
        is_verified: res.data.is_verified,
      }));
    }
    return res.data;
  },

  signup: async (data: { name: string; email: string; password: string }): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/signup', data);
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify({
        pid: res.data.pid,
        name: res.data.name,
        email: res.data.email,
        role: res.data.role,
        is_verified: res.data.is_verified,
      }));
    }
    return res.data;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  getMe: async (): Promise<User> => {
    const res = await api.get<User>('/auth/me');
    return res.data;
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
};
