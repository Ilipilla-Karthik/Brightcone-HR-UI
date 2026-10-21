import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ShieldCheck, Award } from 'lucide-react';
import { MyAssignment } from '../../services/types';
import styles from './LessonPlayerModal.module.css';

interface LessonPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: MyAssignment | null;
  onUpdateProgress: (assignmentId: string, newProgress: number) => Promise<void>;
  onViewCertificate: () => void;
}

export const LessonPlayerModal: React.FC<LessonPlayerModalProps> = ({
  isOpen,
  onClose,
  assignment,
  onUpdateProgress,
  onViewCertificate,
}) => {
  const [currentProgress, setCurrentProgress] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (assignment) {
      setCurrentProgress(assignment.progress);
    }
  }, [assignment]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !assignment) return null;

  const handleStepComplete = async (targetProgress: number) => {
    try {
      setIsUpdating(true);
      await onUpdateProgress(assignment.assignment_id, targetProgress);
      setCurrentProgress(targetProgress);
    } catch {
      // Handled in parent toast
    } finally {
      setIsUpdating(false);
    }
  };

  const isModule1Done = currentProgress >= 50;
  const isModule2Done = currentProgress >= 100;

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lesson-title"
      >
        <div className={styles.header}>
          <div>
            <h2 id="lesson-title" className={styles.title}>
              {assignment.course_title}
            </h2>
            <p className={styles.meta}>
              {assignment.course_type} Course · {assignment.duration}
              {assignment.due_date ? ` · Due ${assignment.due_date}` : ''}
            </p>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close Course Player"
          >
            <X size={16} />
          </button>
        </div>

        <div className={styles.scrollBody}>
          <div className={styles.progressBarWrap}>
            <div className={styles.progressLabelRow}>
              <span>Course Progress</span>
              <span>{currentProgress}%</span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${currentProgress}%` }}
              />
            </div>
          </div>

          <div className={styles.attestNote}>
            <ShieldCheck size={18} style={{ color: '#6366F1', flexShrink: 0 }} />
            <span>
              <strong>Supported Learning Flow:</strong> Modules are verified through employee self-reported completion and compliance attestation.
            </span>
          </div>

          <div className={styles.lessonCard}>
            <div className={styles.lessonHeader}>
              <h3 className={styles.lessonTitle}>Module 1: Framework & Core Principles</h3>
              {isModule1Done ? (
                <span style={{ color: '#15A36B', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600 }}>
                  <CheckCircle2 size={16} /> Completed
                </span>
              ) : (
                <span style={{ color: '#5B6787', fontSize: 12.5, fontWeight: 500 }}>Part 1 of 2</span>
              )}
            </div>
            <p className={styles.lessonDesc}>
              Review the statutory compliance policies, security standards, and code of conduct governing Brightcone operations. Understand data protection protocols and reporting obligations.
            </p>
            {isModule1Done ? (
              <button type="button" className={`${styles.btnAction} ${styles.btnCompleted}`}>
                ✓ Module Completed
              </button>
            ) : (
              <button
                type="button"
                className={`${styles.btnAction} ${styles.btnPrimary}`}
                onClick={() => handleStepComplete(50)}
                disabled={isUpdating}
              >
                {isUpdating ? 'Saving...' : 'Attest & Complete Module 1 (50%)'}
              </button>
            )}
          </div>

          <div className={styles.lessonCard}>
            <div className={styles.lessonHeader}>
              <h3 className={styles.lessonTitle}>Module 2: Scenarios & Compliance Attestation</h3>
              {isModule2Done ? (
                <span style={{ color: '#15A36B', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600 }}>
                  <CheckCircle2 size={16} /> Self-reported complete
                </span>
              ) : (
                <span style={{ color: '#5B6787', fontSize: 12.5, fontWeight: 500 }}>Part 2 of 2</span>
              )}
            </div>
            <p className={styles.lessonDesc}>
              Work through real-world scenarios regarding incident reporting, access management, and integrity guidelines. Complete final self-attestation to generate official certification.
            </p>
            {isModule2Done ? (
              <button type="button" className={`${styles.btnAction} ${styles.btnCompleted}`}>
                ✓ Self-reported complete
              </button>
            ) : (
              <button
                type="button"
                className={`${styles.btnAction} ${styles.btnPrimary}`}
                onClick={() => handleStepComplete(100)}
                disabled={isUpdating || !isModule1Done}
                title={!isModule1Done ? 'Complete Module 1 first' : undefined}
              >
                {isUpdating ? 'Saving...' : 'Attest Completion & Finish (100%)'}
              </button>
            )}
          </div>
        </div>

        <div className={styles.footer}>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            style={{ width: 'auto', padding: '6px 14px' }}
          >
            Close
          </button>
          {isModule2Done && (
            <button
              type="button"
              className={`${styles.btnAction} ${styles.btnPrimary}`}
              onClick={() => {
                onClose();
                onViewCertificate();
              }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <Award size={15} />
              <span>View Verified Certificate</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonPlayerModal;
