import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Play, Award } from 'lucide-react';
import { getMyLearning, updateAssignmentProgress } from '../../services/api';
import { MyAssignment } from '../../services/types';
import CertificateModal from '../../components/kit/CertificateModal';
import LessonPlayerModal from '../../components/kit/LessonPlayerModal';
import Toast, { ToastMessage } from '../../components/kit/Toast';
import styles from './EmployeeLearnPage.module.css';

interface OutletContextType {
  currentPersona: 'admin' | 'employee';
}

export const EmployeeLearnPage: React.FC = () => {
  const { currentPersona } = useOutletContext<OutletContextType>();
  const [assignments, setAssignments] = useState<MyAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [activeLessonAssignment, setActiveLessonAssignment] = useState<MyAssignment | null>(null);
  const [certificateAssignment, setCertificateAssignment] = useState<MyAssignment | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', text: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, text }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const learnerName = currentPersona === 'admin' ? 'Ananya Rao' : 'Rahul Varma';
  const learnerId = currentPersona === 'admin' ? 'BC-1004' : 'BC-1038';

  const loadAssignments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getMyLearning(learnerId);
      setAssignments(data);
    } catch {
      setError('Unable to load assignments from server. Please retry.');
    } finally {
      setIsLoading(false);
    }
  }, [learnerId]);

  useEffect(() => {
    loadAssignments();
  }, [loadAssignments]);

  const handleUpdateProgress = async (assignmentId: string, newProgress: number) => {
    try {
      const updated = await updateAssignmentProgress(assignmentId, newProgress);
      addToast(
        'success',
        newProgress >= 100
          ? `Attestation verified! Course "${updated.course_title}" completed. Certificate unlocked.`
          : `Progress updated: ${newProgress}%`
      );
      await loadAssignments();
      if (activeLessonAssignment && activeLessonAssignment.assignment_id === assignmentId) {
        setActiveLessonAssignment(updated);
      }
    } catch {
      addToast('error', 'Failed to update course progress.');
      throw new Error('Update failed');
    }
  };

  return (
    <div data-testid="employeelearnpage">
      <header className={styles.head}>
        <div className={styles.eyebrow}>Assigned Training</div>
        <h1 className={styles.title}>Learning</h1>
        <p className={styles.desc}>
          Required compliance courses and skills programs assigned to you.
        </p>
      </header>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)' }}>
          Loading your learning assignments...
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#D93D4A' }}>
          <p>{error}</p>
          <button
            type="button"
            className={styles.btnAction}
            style={{ marginTop: 12, display: 'inline-block', width: 'auto', padding: '8px 18px' }}
            onClick={loadAssignments}
          >
            Retry
          </button>
        </div>
      ) : (
        <div className={styles.cardsGrid}>
          {assignments.length > 0 ? (
            assignments.map((assignment) => {
              const isCompleted = assignment.progress >= 100;
              const isInProgress = assignment.progress > 0 && assignment.progress < 100;

              return (
                <div key={assignment.assignment_id} className={styles.courseCard}>
                  <div>
                    <div className={styles.cardTop}>
                      <h3 className={styles.cardTitle}>{assignment.course_title}</h3>
                      <span
                        className={`${styles.pill} ${
                          isCompleted
                            ? styles.pOk
                            : isInProgress
                            ? styles.pInfo
                            : styles.pMute
                        }`}
                      >
                        {isCompleted ? 'Self-reported complete' : isInProgress ? 'In progress' : 'Not started'}
                      </span>
                    </div>

                    <p className={styles.cardMeta}>
                      {assignment.course_type}, {assignment.duration || '1 h'}
                      {assignment.due_date ? `, due ${assignment.due_date}` : ''}
                    </p>
                  </div>

                  <div>
                    <div
                      className={styles.bar}
                      role="progressbar"
                      aria-valuenow={assignment.progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <span style={{ width: `${assignment.progress}%` }} />
                    </div>

                    <div className={styles.cardFoot}>
                      <span className={styles.progressLabel}>
                        {assignment.progress === 100 ? '100% (Self-reported)' : `${assignment.progress}% complete`}
                      </span>

                      {isCompleted ? (
                        <button
                          type="button"
                          className={`${styles.btnAction} ${styles.btnCertificate}`}
                          onClick={() => setCertificateAssignment(assignment)}
                          aria-label={`View Certificate for ${assignment.course_title}`}
                        >
                          <Award size={15} />
                          <span>Certificate</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          className={`${styles.btnAction} ${styles.btnPrimary}`}
                          onClick={() => setActiveLessonAssignment(assignment)}
                          aria-label={`${isInProgress ? 'Continue' : 'Start'} ${assignment.course_title}`}
                        >
                          <Play size={14} />
                          <span>{isInProgress ? 'Continue' : 'Start'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className={styles.emptyCard}>
              No courses assigned to your profile currently. Check back later or contact your HR administrator.
            </div>
          )}
        </div>
      )}

      {/* Interactive Lesson Player */}
      <LessonPlayerModal
        isOpen={!!activeLessonAssignment}
        onClose={() => setActiveLessonAssignment(null)}
        assignment={activeLessonAssignment}
        onUpdateProgress={handleUpdateProgress}
        onViewCertificate={() => {
          if (activeLessonAssignment) {
            setCertificateAssignment(activeLessonAssignment);
          }
        }}
      />

      {/* Verifiable Certificate Modal */}
      <CertificateModal
        isOpen={!!certificateAssignment}
        onClose={() => setCertificateAssignment(null)}
        learnerName={learnerName}
        courseTitle={certificateAssignment?.course_title || ''}
        completedAt={certificateAssignment?.completed_at}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};

export default EmployeeLearnPage;
