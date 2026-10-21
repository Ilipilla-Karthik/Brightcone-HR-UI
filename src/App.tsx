import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './services/authContext';
import AppLayout from './components/shell/AppLayout';
import LearnDashboard from './pages/learn/LearnDashboard';
import CourseCatalogueAdmin from './pages/learn/CourseCatalogueAdmin';
import EmployeeLearnPage from './pages/learn/EmployeeLearnPage';
import Login from './pages/auth/Login';

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

const RoleBasedDefault: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'HR_ADMIN' || user?.role === 'ADMIN';
  return <Navigate to={isAdmin ? '/learn/dashboard' : '/learn/my-learning'} replace />;
};

export const AppContent: React.FC = () => {
  const { user } = useAuth();
  const currentPersona = user?.role === 'HR_ADMIN' || user?.role === 'ADMIN' ? 'admin' : 'employee';

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <ProtectedRoute>
              <AppLayout currentPersona={currentPersona} onPersonaChange={() => {}} />
            </ProtectedRoute>
          }
        >
          <Route path="/learn" element={<RoleBasedDefault />} />
          <Route path="/learn/dashboard" element={<LearnDashboard />} />
          <Route path="/learn/courses" element={<CourseCatalogueAdmin />} />
          <Route path="/learn/my-learning" element={<EmployeeLearnPage />} />
          <Route path="/suite" element={<RoleBasedDefault />} />
          <Route path="/" element={<RoleBasedDefault />} />
        </Route>
        <Route path="*" element={<RoleBasedDefault />} />
      </Routes>
    </Router>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
