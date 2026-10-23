import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { authApi } from '../api/auth';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const isAuth = authApi.isAuthenticated();
  const user = authApi.getCurrentUser();

  if (!isAuth) {
    return <Navigate to="/signin" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
