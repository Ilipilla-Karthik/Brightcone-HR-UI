import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from '../features/auth/LandingPage';
import { SignInPage } from '../features/auth/SignInPage';
import { SignUpPage } from '../features/auth/SignUpPage';
import { EmployeeRecruitPage } from '../features/recruitment/EmployeeRecruitPage';
import { HRRecruitDashboard } from '../features/recruitment/HRRecruitDashboard';
import { ManpowerRequirementsPage } from '../features/recruitment/ManpowerRequirementsPage';
import { CandidateTrackerPage } from '../features/recruitment/CandidateTrackerPage';
import { InterviewSchedulingPage } from '../features/recruitment/InterviewSchedulingPage';
import { OfferLettersPage } from '../features/recruitment/OfferLettersPage';
import { JoiningFormalitiesPage } from '../features/recruitment/JoiningFormalitiesPage';
import { OnboardingChecklistPage } from '../features/recruitment/OnboardingChecklistPage';
import { InternshipManagementPage } from '../features/recruitment/InternshipManagementPage';
import { EmployeeProfilePage } from '../features/employees/EmployeeProfilePage';
import { EmployeeLeavePage } from '../features/employees/EmployeeLeavePage';
import { EmployeeAttendancePage } from '../features/employees/EmployeeAttendancePage';
import { EmployeesPage } from '../features/employees/EmployeesPage';
import { AdminLeavesPage } from '../features/employees/AdminLeavesPage';
import { AdminAttendancePage } from '../features/employees/AdminAttendancePage';
import { PerformancePage } from '../features/performance/PerformancePage';
import { WorkplacePage } from '../features/common/WorkplacePage';
import { ComingSoonPage } from '../features/common/ComingSoonPage';
import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { usePortal } from '../context/PortalContext';

// Helper component for role-aware home landing
const SmartHomeRedirect: React.FC = () => {
  const { currentApp, activeRole } = usePortal();
  if (currentApp === 'recruit') {
    return activeRole === 'employee' ? (
      <Navigate to="/recruit/jobs-referrals" replace />
    ) : (
      <Navigate to="/recruit/dashboard" replace />
    );
  }
  return activeRole === 'employee' ? (
    <Navigate to="/people/profile" replace />
  ) : (
    <Navigate to="/people/directory" replace />
  );
};

// Strict Role Guard for HR Admin
const AdminOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeRole, currentApp } = usePortal();
  if (activeRole !== 'admin') {
    return currentApp === 'recruit' ? (
      <Navigate to="/recruit/jobs-referrals" replace />
    ) : (
      <Navigate to="/people/profile" replace />
    );
  }
  return <>{children}</>;
};

// Strict Role Guard for Employee Self-Service
const EmployeeOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeRole, currentApp } = usePortal();
  if (activeRole !== 'employee') {
    return currentApp === 'recruit' ? (
      <Navigate to="/recruit/dashboard" replace />
    ) : (
      <Navigate to="/people/directory" replace />
    );
  }
  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/welcome" element={<LandingPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      {/* Protected App Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          {/* Smart Root within App */}
          <Route path="/home" element={<SmartHomeRedirect />} />
          <Route path="/dashboard" element={<SmartHomeRedirect />} />

          {/* ============================================================= */}
          {/* RECRUIT APP ROUTES */}
          {/* ============================================================= */}
          {/* Employee Self-Service (Screenshot 1 & 2) */}
          <Route
            path="/recruit/jobs-referrals"
            element={
              <EmployeeOnlyRoute>
                <EmployeeRecruitPage />
              </EmployeeOnlyRoute>
            }
          />

          {/* HR Admin Recruitment & Onboarding */}
          <Route
            path="/recruit/dashboard"
            element={
              <AdminOnlyRoute>
                <HRRecruitDashboard />
              </AdminOnlyRoute>
            }
          />
          <Route
            path="/recruit/manpower"
            element={
              <AdminOnlyRoute>
                <ManpowerRequirementsPage />
              </AdminOnlyRoute>
            }
          />
          <Route
            path="/recruit/candidate-tracker"
            element={
              <AdminOnlyRoute>
                <CandidateTrackerPage />
              </AdminOnlyRoute>
            }
          />
          <Route
            path="/recruit/interviews"
            element={
              <AdminOnlyRoute>
                <InterviewSchedulingPage />
              </AdminOnlyRoute>
            }
          />
          <Route
            path="/recruit/offers"
            element={
              <AdminOnlyRoute>
                <OfferLettersPage />
              </AdminOnlyRoute>
            }
          />
          <Route
            path="/recruit/joining"
            element={
              <AdminOnlyRoute>
                <JoiningFormalitiesPage />
              </AdminOnlyRoute>
            }
          />
          <Route
            path="/recruit/onboarding"
            element={
              <AdminOnlyRoute>
                <OnboardingChecklistPage />
              </AdminOnlyRoute>
            }
          />
          <Route
            path="/recruit/internships"
            element={
              <AdminOnlyRoute>
                <InternshipManagementPage />
              </AdminOnlyRoute>
            }
          />
          <Route
            path="/recruit/pipeline"
            element={
              <AdminOnlyRoute>
                <ComingSoonPage module="pipeline" />
              </AdminOnlyRoute>
            }
          />
          <Route
            path="/recruit/jobs"
            element={
              <AdminOnlyRoute>
                <ComingSoonPage module="jobs" />
              </AdminOnlyRoute>
            }
          />

          {/* ============================================================= */}
          {/* PEOPLE APP ROUTES */}
          {/* ============================================================= */}
          {/* Employee Self-Service (Screenshots 3, 4, 5) */}
          <Route
            path="/people/profile"
            element={
              <EmployeeOnlyRoute>
                <EmployeeProfilePage />
              </EmployeeOnlyRoute>
            }
          />
          <Route
            path="/people/leave"
            element={
              <EmployeeOnlyRoute>
                <EmployeeLeavePage />
              </EmployeeOnlyRoute>
            }
          />
          <Route
            path="/people/attendance"
            element={
              <EmployeeOnlyRoute>
                <EmployeeAttendancePage />
              </EmployeeOnlyRoute>
            }
          />
          <Route
            path="/people/goals"
            element={
              <EmployeeOnlyRoute>
                <PerformancePage />
              </EmployeeOnlyRoute>
            }
          />
          <Route
            path="/people/documents"
            element={
              <EmployeeOnlyRoute>
                <WorkplacePage type="documents" />
              </EmployeeOnlyRoute>
            }
          />
          <Route
            path="/people/assets"
            element={
              <EmployeeOnlyRoute>
                <WorkplacePage type="assets" />
              </EmployeeOnlyRoute>
            }
          />
          <Route
            path="/people/helpdesk"
            element={
              <EmployeeOnlyRoute>
                <WorkplacePage type="helpdesk" />
              </EmployeeOnlyRoute>
            }
          />
          <Route
            path="/people/resignation"
            element={
              <EmployeeOnlyRoute>
                <WorkplacePage type="resignation" />
              </EmployeeOnlyRoute>
            }
          />

          {/* HR Admin People Management (Respective Tables) */}
          <Route
            path="/people/directory"
            element={
              <AdminOnlyRoute>
                <EmployeesPage />
              </AdminOnlyRoute>
            }
          />
          <Route
            path="/people/leaves-admin"
            element={
              <AdminOnlyRoute>
                <AdminLeavesPage />
              </AdminOnlyRoute>
            }
          />
          <Route
            path="/people/attendance-admin"
            element={
              <AdminOnlyRoute>
                <AdminAttendancePage />
              </AdminOnlyRoute>
            }
          />
          <Route
            path="/people/policies"
            element={
              <AdminOnlyRoute>
                <WorkplacePage type="policies" />
              </AdminOnlyRoute>
            }
          />
          <Route
            path="/people/assets-admin"
            element={
              <AdminOnlyRoute>
                <WorkplacePage type="assets" />
              </AdminOnlyRoute>
            }
          />
          <Route
            path="/people/helpdesk-admin"
            element={
              <AdminOnlyRoute>
                <WorkplacePage type="helpdesk" />
              </AdminOnlyRoute>
            }
          />

          {/* Backwards compatibility redirects */}
          <Route path="/recruitment" element={<SmartHomeRedirect />} />
          <Route path="/employees" element={<Navigate to="/people/directory" replace />} />
          <Route path="/performance" element={<Navigate to="/people/goals" replace />} />
        </Route>
      </Route>

      {/* Catch-all 404 Redirect */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};

export default AppRoutes;
