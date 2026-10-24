import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './services/authContext';
import { Login } from './pages/auth/Login';
import { AppRail } from './components/shell/AppRail';
import { Header } from './components/shell/Header';
import { SidebarNav } from './components/shell/SidebarNav';
import { CommandPalette } from './components/shell/CommandPalette';

import { SignDashboard } from './pages/doc_sign/SignDashboard';
import { SignatureRequests } from './pages/doc_sign/SignatureRequests';
import { SignDocumentFlow } from './pages/doc_sign/SignDocumentFlow';
import { TemplateBuilder } from './pages/doc_sign/TemplateBuilder';
import { EmployeeHandbookPage } from './pages/doc_sign/EmployeeHandbookPage';
import { HRPoliciesPage } from './pages/doc_sign/HRPoliciesPage';
import { PolicyAcknowledgementsPage } from './pages/doc_sign/PolicyAcknowledgementsPage';

import { CompanyFeedPage } from './pages/engagement/CompanyFeedPage';
import { AnnouncementsPage } from './pages/engagement/AnnouncementsPage';
import { DirectoryPage } from './pages/engagement/DirectoryPage';
import { CelebrationsPage } from './pages/engagement/CelebrationsPage';
import { CompanyEventsPage } from './pages/engagement/CompanyEventsPage';
import { FeedbackPage } from './pages/engagement/FeedbackPage';
import { TownhallPage } from './pages/engagement/TownhallPage';

const AppLayout: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // Strict role determination based on logged in user
  const isEmployee =
    user?.role?.toLowerCase()?.includes('employee') ||
    user?.email?.toLowerCase()?.includes('rahul') ||
    localStorage.getItem('persona') === 'employee';

  const [role, setRole] = useState<'hr_admin' | 'employee'>(
    isEmployee ? 'employee' : 'hr_admin'
  );
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  useEffect(() => {
    const isEmp =
      user?.role?.toLowerCase()?.includes('employee') ||
      user?.email?.toLowerCase()?.includes('rahul') ||
      localStorage.getItem('persona') === 'employee';
    setRole(isEmp ? 'employee' : 'hr_admin');
  }, [user]);

  // Accent color strictly for Sign (#D9466F) vs Connect (#0BA6CC)
  const isSign =
    location.pathname.startsWith('/doc-sign') ||
    location.pathname.startsWith('/sign') ||
    location.pathname.startsWith('/doc_sign');
  const accentColor = isSign ? '#D9466F' : '#0BA6CC';

  if (!isAuthenticated) {
    return <Login />;
  }

  const defaultHome = role === 'employee' ? '/doc-sign/flow' : '/doc-sign/dashboard';

  return (
    <>
      <div
        className="app h-screen overflow-hidden bg-[var(--bg)] text-[var(--text)]"
        style={{ '--ac': accentColor } as React.CSSProperties}
      >
        <AppRail role={role} />
        <SidebarNav role={role} />

        <div className="main flex flex-col min-w-0 h-full overflow-hidden">
          <Header
            role={role}
            onOpenCommand={() => setIsCommandOpen(true)}
          />

          <main className="content flex-1 min-h-0 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Navigate to={defaultHome} replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/suite/*" element={<Navigate to={defaultHome} replace />} />
              <Route path="/suite" element={<Navigate to={defaultHome} replace />} />
              <Route path="/portal/*" element={<Navigate to={defaultHome} replace />} />
              <Route path="/portal" element={<Navigate to={defaultHome} replace />} />

              {/* DocSign routes */}
              <Route path="/doc-sign" element={<Navigate to={defaultHome} replace />} />
              <Route path="/doc-sign/dashboard" element={<SignDashboard />} />
              <Route path="/doc-sign/handbook" element={<EmployeeHandbookPage />} />
              <Route path="/doc-sign/policies" element={<HRPoliciesPage />} />
              <Route path="/doc-sign/acks" element={<PolicyAcknowledgementsPage />} />
              <Route path="/doc-sign/requests" element={<SignatureRequests />} />
              <Route path="/doc-sign/templates" element={<TemplateBuilder />} />
              <Route path="/doc-sign/flow" element={<SignDocumentFlow />} />

              {/* Route aliases for Sign */}
              <Route path="/sign" element={<Navigate to={defaultHome} replace />} />
              <Route path="/sign/*" element={<Navigate to={defaultHome} replace />} />
              <Route path="/doc_sign" element={<Navigate to={defaultHome} replace />} />
              <Route path="/doc_sign/*" element={<Navigate to={defaultHome} replace />} />

              {/* Connect Module routes */}
              <Route path="/engagement" element={<CompanyFeedPage />} />
              <Route path="/engagement/feed" element={<CompanyFeedPage />} />
              <Route path="/engagement/announcements" element={<AnnouncementsPage />} />
              <Route path="/engagement/directory" element={<DirectoryPage />} />
              <Route path="/engagement/celebrations" element={<CelebrationsPage />} />
              <Route path="/engagement/events" element={<CompanyEventsPage />} />
              <Route path="/engagement/feedback" element={<FeedbackPage />} />
              <Route path="/engagement/townhall" element={<TownhallPage />} />
              <Route path="/engagement/*" element={<CompanyFeedPage />} />
              <Route path="/connect" element={<Navigate to="/engagement/feed" replace />} />
              <Route path="/connect/*" element={<Navigate to="/engagement/feed" replace />} />

              {/* Default catch-all redirect */}
              <Route path="*" element={<Navigate to={defaultHome} replace />} />
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
