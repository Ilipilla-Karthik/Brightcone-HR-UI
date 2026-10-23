import React, { useState, useEffect, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import {
  BarChart3,
  Users,
  CheckSquare,
  Plus,
  ArrowRight,
  AlertCircle,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import {
  ReviewCycle,
  CycleDashboardData,
  CycleReviewItem,
} from '../../services/types';
import {
  getReviewCycles,
  getCycleDashboard,
  advanceReviewCycle,
  remindReview,
  downloadExportRatings,
} from '../../services/api';
import axios from 'axios';
import NewCycleModal from '../../components/performance/NewCycleModal';
import RateEmployeeModal from '../../components/performance/RateEmployeeModal';
import PerformanceReviewTable from './PerformanceReviewTable';
import styles from './PerformanceAdminPage.module.css';

const STAGE_NAMES = [
  'Goal setting',
  'Self-review',
  'Manager review',
  'Calibration',
  'Results shared',
];

export const PerformanceAdminPage: React.FC = () => {
  const [cycles, setCycles] = useState<ReviewCycle[]>([]);
  const [selectedCycleId, setSelectedCycleId] = useState<string>('');
  const [dashboardData, setDashboardData] = useState<CycleDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [isAdvancing, setIsAdvancing] = useState(false);
  const [remindingId, setRemindingId] = useState<string | null>(null);

  // Modals
  const [isNewCycleOpen, setIsNewCycleOpen] = useState(false);
  const [rateModalReview, setRateModalReview] = useState<CycleReviewItem | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadCycles = useCallback(async () => {
    try {
      const cycleList = await getReviewCycles();
      setCycles(cycleList);
      if (cycleList.length > 0) {
        const active = cycleList.find((c) => c.status === 'Active') || cycleList[0];
        setSelectedCycleId((prev) => (prev && cycleList.some((c) => c.id === prev) ? prev : active.id));
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        setError('Access denied: Administrator privileges required.');
      } else {
        setError('Unable to load review cycles.');
      }
    }
  }, []);

  const loadDashboard = useCallback(async (cycleId: string) => {
    if (!cycleId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getCycleDashboard(cycleId);
      setDashboardData(data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        setError('Access denied: Administrator privileges required.');
      } else {
        setError('Failed to load performance review cycle data. Please retry.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCycles();
  }, [loadCycles]);

  useEffect(() => {
    if (selectedCycleId) {
      loadDashboard(selectedCycleId);
    }
  }, [selectedCycleId, loadDashboard]);

  const handleAdvanceStage = async () => {
    if (!dashboardData) return;
    const current = dashboardData.cycle.stage;
    if (current >= 4) return;

    const nextStageName = STAGE_NAMES[current + 1];
    const ok = window.confirm(
      `Advance cycle to Stage ${current + 2}: "${nextStageName}"? This notifies all managers and eligible participants.`
    );
    if (!ok) return;

    try {
      setIsAdvancing(true);
      await advanceReviewCycle(dashboardData.cycle.id);
      showToast(`Review cycle advanced to ${nextStageName}`);
      await loadDashboard(dashboardData.cycle.id);
      await loadCycles();
    } catch {
      showToast('Failed to advance cycle stage. Please retry.');
    } finally {
      setIsAdvancing(false);
    }
  };

  const handleRemind = async (employeeId: string, employeeName: string) => {
    if (!dashboardData) return;
    try {
      setRemindingId(employeeId);
      await remindReview(dashboardData.cycle.id, employeeId);
      showToast(`Reminder sent to ${employeeName}`);
    } catch {
      showToast(`Failed to send reminder to ${employeeName}`);
    } finally {
      setRemindingId(null);
    }
  };

  const handleExport = async () => {
    if (!dashboardData) return;
    try {
      await downloadExportRatings(dashboardData.cycle.id);
      showToast('Ratings CSV downloaded');
    } catch {
      showToast('Export failed. Please check network and retry.');
    }
  };

  const handleCycleCreated = async (newCycle: ReviewCycle) => {
    await loadCycles();
    setSelectedCycleId(newCycle.id);
    showToast('New review cycle activated');
  };

  const handleRated = async () => {
    if (selectedCycleId) {
      await loadDashboard(selectedCycleId);
    }
    showToast('Employee rating and increment finalized');
  };

  const formatDate = (isoStr?: string) => {
    if (!isoStr) return '—';
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className={styles.container} data-testid="performance-admin-page">
      {toastMessage && <div className={styles.toast}>{toastMessage}</div>}

      <div className={styles.subnav}>
        <NavLink
          to="/learn/dashboard"
          className={({ isActive }) =>
            `${styles.subnavLink} ${isActive ? styles.subnavLinkActive : ''}`
          }
        >
          <GraduationCap size={16} />
          <span>Learning & Courses</span>
        </NavLink>
        <NavLink
          to="/performance/admin"
          className={({ isActive }) =>
            `${styles.subnavLink} ${isActive ? styles.subnavLinkActive : ''}`
          }
        >
          <Sparkles size={16} />
          <span>Performance review</span>
        </NavLink>
      </div>

      {error && (
        <div className={styles.alert}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className={styles.head}>
        <div>
          <h1 className={styles.headTitle}>Performance</h1>
          <p className={styles.headSubtitle}>
            {dashboardData?.cycle.name || 'Performance Cycle'}. Run the cycle, track
            completion and finalise ratings.
          </p>
        </div>

        <div className={styles.actions}>
          {cycles.length > 1 && (
            <select
              className={styles.cycleSelect}
              value={selectedCycleId}
              onChange={(e) => setSelectedCycleId(e.target.value)}
              aria-label="Select Review Cycle"
            >
              {cycles.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.status})
                </option>
              ))}
            </select>
          )}

          <button
            type="button"
            className={styles.btn}
            onClick={() => setIsNewCycleOpen(true)}
          >
            <Plus size={15} />
            <span>New cycle</span>
          </button>

          {dashboardData && dashboardData.cycle.stage < 4 && (
            <button
              type="button"
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={handleAdvanceStage}
              disabled={isAdvancing}
            >
              <span>
                {isAdvancing
                  ? 'Moving...'
                  : `Move to ${STAGE_NAMES[dashboardData.cycle.stage + 1]}`}
              </span>
              <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className={styles.loadingState}>
          <p>Loading performance review cycle data...</p>
        </div>
      ) : !dashboardData ? (
        <div className={styles.emptyState}>
          <p>No active review cycle found.</p>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnPrimary}`}
            style={{ marginTop: 12 }}
            onClick={() => setIsNewCycleOpen(true)}
          >
            Start your first review cycle
          </button>
        </div>
      ) : (
        <>
          {/* Stepper Card */}
          <div className={styles.card}>
            <div className={styles.cardHead}>
              <h2 className={styles.cardTitle}>
                <span>Cycle stage</span>
                <span className={styles.dueText}>
                  Self-reviews due {formatDate(dashboardData.cycle.self_review_due)}
                </span>
              </h2>
            </div>

            <div className={styles.stepper}>
              {STAGE_NAMES.map((stageName, idx) => {
                const isDone = idx < dashboardData.cycle.stage;
                const isCur = idx === dashboardData.cycle.stage;
                return (
                  <div
                    key={stageName}
                    className={`${styles.step} ${
                      isDone ? styles.stepDone : isCur ? styles.stepCur : ''
                    }`}
                  >
                    <span className={styles.n}>{isDone ? '✓' : idx + 1}</span>
                    <b>{stageName}</b>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Performance Summary Cards */}
          <div className={styles.grid3}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <BarChart3 size={20} />
              </div>
              <div>
                <p className={styles.statLabel}>Self-reviews submitted</p>
                <p className={styles.statValue}>
                  {dashboardData.summary.self_reviews_submitted} /{' '}
                  {dashboardData.summary.total_eligible}
                </p>
                <p className={styles.statSub}>
                  {dashboardData.summary.total_eligible > 0
                    ? `${Math.round(
                        (dashboardData.summary.self_reviews_submitted /
                          dashboardData.summary.total_eligible) *
                          100
                      )}% submitted`
                    : ''}
                </p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <Users size={20} />
              </div>
              <div>
                <p className={styles.statLabel}>Manager reviews done</p>
                <p className={styles.statValue}>
                  {dashboardData.summary.manager_reviews_done} /{' '}
                  {dashboardData.summary.total_eligible}
                </p>
                <p className={styles.statSub}>
                  {dashboardData.summary.total_eligible > 0
                    ? `${Math.round(
                        (dashboardData.summary.manager_reviews_done /
                          dashboardData.summary.total_eligible) *
                          100
                      )}% finalized`
                    : ''}
                </p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <CheckSquare size={20} />
              </div>
              <div>
                <p className={styles.statLabel}>Goals set</p>
                <p className={styles.statValue}>{dashboardData.summary.goals_count}</p>
                <p className={styles.statSub}>Across all employees</p>
              </div>
            </div>
          </div>

          {/* Review Status / Ratings Table */}
          <PerformanceReviewTable
            reviews={dashboardData.reviews}
            onExport={handleExport}
            onRemind={handleRemind}
            onRate={(r) => setRateModalReview(r)}
            remindingId={remindingId}
          />
        </>
      )}

      {/* Modals */}
      <NewCycleModal
        isOpen={isNewCycleOpen}
        onClose={() => setIsNewCycleOpen(false)}
        onCycleCreated={handleCycleCreated}
      />

      <RateEmployeeModal
        isOpen={!!rateModalReview}
        onClose={() => setRateModalReview(null)}
        cycleId={dashboardData?.cycle.id || ''}
        review={rateModalReview}
        onRated={handleRated}
      />
    </div>
  );
};

export default PerformanceAdminPage;
