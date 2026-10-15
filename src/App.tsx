import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './services/authContext';
import Login from './pages/auth/Login';
import SuiteDashboard from './pages/suite/SuiteDashboard';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/suite" element={<SuiteDashboard />} />
          <Route path="*" element={<Navigate to="/suite" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
