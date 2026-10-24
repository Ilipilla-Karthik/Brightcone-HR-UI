import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './services/authContext';
import { Login } from './pages/auth/Login';
import { AppRail } from './components/shell/AppRail';
import { Header } from './components/shell/Header';
import { SidebarNav } from './components/shell/SidebarNav';
import { CommandPalette } from './components/shell/CommandPalette';

import { SuiteDashboard } from './pages/suite/SuiteDashboard';
import { EmployeePortalPage } from './pages/portal/EmployeePortalPage';
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
import { AnnouncementsPage } from './pages/engagement/AnnouncementsPage';
import { DirectoryPage } from './pages/engagement/DirectoryPage';
import { CelebrationsPage } from './pages/engagement/CelebrationsPage';
import { CompanyEventsPage } from './pages/engagement/CompanyEventsPage';
import { FeedbackPage } from './pages/engagement/FeedbackPage';
import { TownhallPage } from './pages/engagement/TownhallPage';
import { AttendanceAdmin } from './pages/time/AttendanceAdmin';
import { AdminDashboard } from './pages/advanced_hr/AdminDashboard';

import { LearnDashboard } from './pages/learn/LearnDashboard';
import CourseCatalogueAdmin from './pages/learn/CourseCatalogueAdmin';
import EmployeeLearnPage from './pages/learn/EmployeeLearnPage';
import PerformanceAdminPage from './pages/performance/PerformanceAdminPage';

const AppLayout: React.FC = () => {
  const { user, isAuthenticated, switchUserRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
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

  const handleSwitchRole = (newRole: 'hr_admin' | 'employee') => {
    setRole(newRole);
    switchUserRole(newRole);
    const p = location.pathname;
    if (p.startsWith('/doc-sign') || p.startsWith('/sign') || p.startsWith('/doc_sign')) {
      if (newRole === 'employee') {
        navigate('/doc-sign/flow');
      } else {
        navigate('/doc-sign/dashboard');
      }
    } else if (p.startsWith('/portal') || p.startsWith('/suite')) {
      if (newRole === 'employee') {
        navigate('/portal');
      } else {
        navigate('/suite');
      }
    } else if (p.startsWith('/engagement') || p.startsWith('/connect')) {
      if (newRole === 'employee' && !p.includes('/feed') && !p.includes('/directory')) {
        navigate('/engagement/feed');
      }
    }
  };

  const getAccentColor = (pathname: string) => {
    if (pathname.startsWith('/doc-sign') || pathname.startsWith('/sign') || pathname.startsWith('/doc_sign')) return '#D9466F';
    if (pathname.startsWith('/engagement') || pathname.startsWith('/connect')) return '#0BA6CC';
    if (pathname.startsWith('/people')) return '#12A58E';
    if (pathname.startsWith('/recruit')) return '#7C5CFF';
    if (pathname.startsWith('/payroll')) return '#0F9F6E';
    if (pathname.startsWith('/expense')) return '#E07A1D';
    if (pathname.startsWith('/learn')) return '#6366F1';
    if (pathname.startsWith('/time')) return '#3B82C4';
    return '#0B87FF';
  };

  const accentColor = getAccentColor(location.pathname);

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <>
      <div
        className="app h-screen overflow-hidden bg-[var(--bg)] text-[var(--text)]"
        style={{ '--ac': accentColor } as React.CSSProperties}
      >
        <AppRail role={role} />
        <SidebarNav role={role} onSwitchRole={handleSwitchRole} />

        <div className="main flex flex-col min-w-0 h-full overflow-hidden">
          <Header
            role={role}
            onSwitchRole={handleSwitchRole}
            onOpenCommand={() => setIsCommandOpen(true)}
          />

          <main className="content flex-1 min-h-0 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Navigate to={role === 'employee' ? '/portal' : '/suite'} replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/suite" element={<SuiteDashboard />} />
              <Route path="/suite/*" element={<SuiteDashboard />} />
              <Route path="/portal" element={<EmployeePortalPage />} />
              <Route path="/portal/*" element={<EmployeePortalPage />} />

              {/* DocSign routes */}
              <Route path="/doc-sign" element={<Navigate to={role === 'employee' ? '/doc-sign/flow' : '/doc-sign/dashboard'} replace />} />
              <Route path="/doc-sign/dashboard" element={<SignDashboard />} />
              <Route path="/doc-sign/handbook" element={<EmployeeHandbookPage />} />
              <Route path="/doc-sign/policies" element={<HRPoliciesPage />} />
              <Route path="/doc-sign/acks" element={<PolicyAcknowledgementsPage />} />
              <Route path="/doc-sign/requests" element={<SignatureRequests />} />
              <Route path="/doc-sign/templates" element={<TemplateBuilder />} />
              <Route path="/doc-sign/flow" element={<SignDocumentFlow />} />

              {/* Route aliases */}
              <Route path="/sign" element={<Navigate to={role === 'employee' ? '/doc-sign/flow' : '/doc-sign/dashboard'} replace />} />
              <Route path="/sign/*" element={<Navigate to={role === 'employee' ? '/doc-sign/flow' : '/doc-sign/dashboard'} replace />} />
              <Route path="/doc_sign" element={<Navigate to={role === 'employee' ? '/doc-sign/flow' : '/doc-sign/dashboard'} replace />} />
              <Route path="/doc_sign/*" element={<Navigate to={role === 'employee' ? '/doc-sign/flow' : '/doc-sign/dashboard'} replace />} />

              {/* Learn & Performance routes */}
              <Route path="/learn" element={<Navigate to="/learn/dashboard" replace />} />
              <Route path="/learn/dashboard" element={<LearnDashboard />} />
              <Route path="/learn/courses" element={<CourseCatalogueAdmin />} />
              <Route path="/learn/my-learning" element={<EmployeeLearnPage />} />
              <Route path="/learn/*" element={<Navigate to="/learn/dashboard" replace />} />
              <Route path="/performance" element={<Navigate to="/performance/admin" replace />} />
              <Route path="/performance/admin" element={<PerformanceAdminPage />} />
              <Route path="/performance/*" element={<Navigate to="/performance/admin" replace />} />

              {/* Core module routes & aliases */}
              <Route path="/people/*" element={<PeopleDashboard />} />
              <Route path="/people" element={<PeopleDashboard />} />
              <Route path="/employees/*" element={<Navigate to="/people" replace />} />
              <Route path="/employees" element={<Navigate to="/people" replace />} />

              <Route path="/recruit/*" element={<RecruitDashboard />} />
              <Route path="/recruit" element={<RecruitDashboard />} />
              <Route path="/recruitment/*" element={<Navigate to="/recruit" replace />} />
              <Route path="/recruitment" element={<Navigate to="/recruit" replace />} />

              <Route path="/payroll/*" element={<PayrollDashboard />} />
              <Route path="/payroll" element={<PayrollDashboard />} />

              <Route path="/expense/*" element={<ExpenseEmployeePage />} />
              <Route path="/expense" element={<ExpenseEmployeePage />} />

              {/* Engagement & Connect Module */}
              <Route path="/engagement" element={<CompanyFeedPage />} />
              <Route path="/engagement/feed" element={<CompanyFeedPage />} />
              <Route path="/engagement/announcements" element={<AnnouncementsPage />} />
              <Route path="/engagement/directory" element={<DirectoryPage />} />
              <Route path="/engagement/celebrations" element={<CelebrationsPage />} />
              <Route path="/engagement/events" element={<CompanyEventsPage />} />
              <Route path="/engagement/feedback" element={<FeedbackPage />} />
              <Route path="/engagement/townhall" element={<TownhallPage />} />
              <Route path="/engagement/*" element={<CompanyFeedPage />} />
              <Route path="/connect" element={<Navigate to="/engagement" replace />} />
              <Route path="/connect/*" element={<Navigate to="/engagement" replace />} />

              <Route path="/time/*" element={<AttendanceAdmin />} />
              <Route path="/time" element={<AttendanceAdmin />} />
              <Route path="/shift/*" element={<Navigate to="/time" replace />} />
              <Route path="/shift" element={<Navigate to="/time" replace />} />

              <Route path="/advanced-hr/*" element={<AdminDashboard />} />
              <Route path="/advanced-hr" element={<AdminDashboard />} />

              <Route path="*" element={<Navigate to={role === 'employee' ? '/portal' : '/suite'} replace />} />
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
