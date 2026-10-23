import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './services/authContext';
import { Login } from './pages/auth/Login';
import { AppRail } from './components/shell/AppRail';
import { Header } from './components/shell/Header';
import { SidebarNav } from './components/shell/SidebarNav';
import { CommandPalette } from './components/shell/CommandPalette';

import { SuiteDashboard } from './pages/suite/SuiteDashboard';
import { SignDashboard } from './pages/doc_sign/SignDashboard';
import { SignatureRequests } from './pages/doc_sign/SignatureRequests';
import { SignDocumentFlow } from './pages/doc_sign/SignDocumentFlow';
import { TemplateBuilder } from './pages/doc_sign/TemplateBuilder';
import { EmployeeHandbookPage } from './pages/doc_sign/EmployeeHandbookPage';
import { HRPoliciesPage } from './pages/doc_sign/HRPoliciesPage';
import { PolicyAcknowledgementsPage } from './pages/doc_sign/PolicyAcknowledgementsPage';

import { PeopleDashboard } from './pages/people/PeopleDashboard';
import { RecruitDashboard } from './pages/recruit/RecruitDashboard';
import { PayrollDashboard } from './pages/payroll/PayrollDashboard';
import { ExpenseEmployeePage } from './pages/payroll/ExpenseEmployeePage';
import { CompanyFeedPage } from './pages/engagement/CompanyFeedPage';
import { AttendanceAdmin } from './pages/time/AttendanceAdmin';
import { AdminDashboard } from './pages/advanced_hr/AdminDashboard';

import { LearnDashboard } from './pages/learn/LearnDashboard';
import CourseCatalogueAdmin from './pages/learn/CourseCatalogueAdmin';
import EmployeeLearnPage from './pages/learn/EmployeeLearnPage';
import PerformanceAdminPage from './pages/performance/PerformanceAdminPage';

const AppLayout: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [role, setRole] = useState<'hr_admin' | 'employee'>(
    user?.role === 'employee' ? 'employee' : 'hr_admin'
  );
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  useEffect(() => {
    if (user?.role === 'employee') {
      setRole('employee');
    } else if (user?.role === 'hr_admin' || user?.role === 'HR_ADMIN' || user?.role === 'ADMIN') {
      setRole('hr_admin');
    }
  }, [user]);

  const toggleRole = () => {
    setRole((prev) => (prev === 'hr_admin' ? 'employee' : 'hr_admin'));
  };

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <>
      <div className="app h-screen overflow-hidden bg-[var(--bg)] text-[var(--text)]">
        <AppRail />
        <SidebarNav role={role} onToggleRole={toggleRole} />

        <div className="main flex flex-col min-w-0 h-full overflow-hidden">
          <Header
            role={role}
            onToggleRole={toggleRole}
            onOpenCommand={() => setIsCommandOpen(true)}
          />

          <main className="content flex-1 min-h-0 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/suite" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/suite" element={<SuiteDashboard />} />

              {/* DocSign routes */}
              <Route path="/doc-sign" element={<Navigate to="/doc-sign/dashboard" replace />} />
              <Route path="/doc-sign/dashboard" element={<SignDashboard />} />
              <Route path="/doc-sign/handbook" element={<EmployeeHandbookPage />} />
              <Route path="/doc-sign/policies" element={<HRPoliciesPage />} />
              <Route path="/doc-sign/acks" element={<PolicyAcknowledgementsPage />} />
              <Route path="/doc-sign/requests" element={<SignatureRequests />} />
              <Route path="/doc-sign/templates" element={<TemplateBuilder />} />
              <Route path="/doc-sign/flow" element={<SignDocumentFlow />} />

              {/* Route aliases */}
              <Route path="/sign" element={<Navigate to="/doc-sign/dashboard" replace />} />
              <Route path="/sign/*" element={<Navigate to="/doc-sign/dashboard" replace />} />
              <Route path="/doc_sign" element={<Navigate to="/doc-sign/dashboard" replace />} />
              <Route path="/doc_sign/*" element={<Navigate to="/doc-sign/dashboard" replace />} />

              {/* Learn & Performance routes */}
              <Route path="/learn" element={<Navigate to="/learn/dashboard" replace />} />
              <Route path="/learn/dashboard" element={<LearnDashboard />} />
              <Route path="/learn/courses" element={<CourseCatalogueAdmin />} />
              <Route path="/learn/my-learning" element={<EmployeeLearnPage />} />
              <Route path="/performance" element={<Navigate to="/performance/admin" replace />} />
              <Route path="/performance/admin" element={<PerformanceAdminPage />} />

              {/* Core module routes */}
              <Route path="/people" element={<PeopleDashboard />} />
              <Route path="/recruit" element={<RecruitDashboard />} />
              <Route path="/payroll" element={<PayrollDashboard />} />
              <Route path="/expense" element={<ExpenseEmployeePage />} />
              <Route path="/engagement" element={<CompanyFeedPage />} />
              <Route path="/time" element={<AttendanceAdmin />} />
              <Route path="/advanced-hr" element={<AdminDashboard />} />

              <Route path="*" element={<Navigate to="/suite" replace />} />
            </Routes>
          </main>
        </div>
      </div>

      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
      />
    </>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppLayout />
      </Router>
    </AuthProvider>
  );
};

export default App;
