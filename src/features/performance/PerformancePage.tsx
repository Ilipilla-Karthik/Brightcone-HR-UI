import React, { useEffect, useState } from 'react';
import { performanceApi } from '../../api/performance.api';
import { CreateGoalPayload, CreateReviewPayload, Goal, PerformanceReview } from '../../types/performance.types';
import { GoalModal } from './GoalModal';
import { ReviewModal } from './ReviewModal';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Toast } from '../../components/common/Toast';
import {
  Award,
  Target,
  Star,
  CheckCircle2,
  Plus,
  TrendingUp,
  UserCheck,
  Calendar,
} from 'lucide-react';

const DEMO_GOALS: Goal[] = [
  {
    id: 1,
    employee_id: 'BC-1012',
    employee_name: 'Karthik Reddy',
    title: 'Deploy Distributed Vector LLM Serving Engine in Rust',
    category: 'Innovation',
    target_date: '2026-11-15',
    progress: 85,
    status: 'In Progress',
  },
  {
    id: 2,
    employee_id: 'BC-1038',
    employee_name: 'Rahul Varma',
    title: 'Migrate Core Database Schema to PostgreSQL 18 & Optimize Connection Pool',
    category: 'Engineering',
    target_date: '2026-10-31',
    progress: 90,
    status: 'In Progress',
  },
  {
    id: 3,
    employee_id: 'BC-1019',
    employee_name: 'Priya Menon',
    title: 'Establish Engineering Mentorship Framework for L4-L6 Engineers',
    category: 'Leadership',
    target_date: '2026-12-15',
    progress: 60,
    status: 'In Progress',
  },
  {
    id: 4,
    employee_id: 'BC-1031',
    employee_name: 'Sneha Iyer',
    title: 'Design System Unification for Brightcone People Web & Mobile UI',
    category: 'Product',
    target_date: '2026-11-30',
    progress: 75,
    status: 'In Progress',
  },
];

const DEMO_REVIEWS: PerformanceReview[] = [
  {
    id: 1,
    employee_id: 'BC-1038',
    employee_name: 'Rahul Varma',
    reviewer_name: 'Priya Menon (Engineering Manager)',
    cycle: 'Q3 2026 Mid-Year',
    rating: 4.8,
    feedback:
      'Rahul has demonstrated extraordinary ownership of the backend Rust services, reducing latency by 45% and reliably delivering the candidate pipeline synchronization layer.',
    status: 'Completed',
    updated_at: 'Oct 10, 2026',
  },
  {
    id: 2,
    employee_id: 'BC-1012',
    employee_name: 'Karthik Reddy',
    reviewer_name: 'Naresh Vemparala (Founder & CEO)',
    cycle: 'Q3 2026 Mid-Year',
    rating: 4.9,
    feedback:
      'Pioneering technical visionary. Karthik led the architecture of the AI vector matching engine while upholding top-tier code maintainability across the organization.',
    status: 'Completed',
    updated_at: 'Oct 08, 2026',
  },
  {
    id: 3,
    employee_id: 'BC-1031',
    employee_name: 'Sneha Iyer',
    reviewer_name: 'Priya Menon (Engineering Manager)',
    cycle: 'Q2 2026 Review',
    rating: 4.6,
    feedback:
      'Sneha crafted the iconic Brightcone lamp cord visual identity and unified our dark/light blue theme engine with flawless execution.',
    status: 'Completed',
    updated_at: 'Sep 15, 2026',
  },
];

export const PerformancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'goals' | 'reviews'>('goals');
  const [goals, setGoals] = useState<Goal[]>([]);
  const [reviews, setReviews] = useState<PerformanceReview[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modals
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const fetchPerformanceData = async () => {
    setIsLoading(true);
    try {
      const [goalsData, reviewsData] = await Promise.all([
        performanceApi.getGoals(),
        performanceApi.getReviews(),
      ]);
      setGoals(goalsData.length > 0 ? goalsData : DEMO_GOALS);
      setReviews(reviewsData.length > 0 ? reviewsData : DEMO_REVIEWS);
    } catch {
      // Fallback to demonstration records
      setGoals(DEMO_GOALS);
      setReviews(DEMO_REVIEWS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const handleSaveGoal = async (payload: CreateGoalPayload) => {
    try {
      const newGoal = await performanceApi.createGoal(payload);
      setGoals((prev) => [newGoal, ...prev]);
      setToastType('success');
      setToastMessage(`Goal '${newGoal.title}' created and assigned to ${newGoal.employee_name}!`);
    } catch (err: unknown) {
      setToastType('error');
      setToastMessage(err instanceof Error ? err.message : 'Failed to save goal');
    }
  };

  const handleProgressChange = async (goalId: number, newProgress: number) => {
    try {
      await performanceApi.updateGoalProgress(goalId, newProgress);
      setGoals((prev) =>
        prev.map((g) => (g.id === goalId ? { ...g, progress: newProgress } : g))
      );
      setToastType('success');
      setToastMessage(`Goal progress updated to ${newProgress}%!`);
    } catch {
      // Update locally
      setGoals((prev) =>
        prev.map((g) => (g.id === goalId ? { ...g, progress: newProgress } : g))
      );
    }
  };

  const handleSaveReview = async (payload: CreateReviewPayload) => {
    try {
      const newReview = await performanceApi.createReview(payload);
      setReviews((prev) => [newReview, ...prev]);
      setToastType('success');
      setToastMessage(`Review for '${newReview.employee_name}' logged successfully!`);
    } catch (err: unknown) {
      setToastType('error');
      setToastMessage(err instanceof Error ? err.message : 'Failed to submit review');
    }
  };

  if (isLoading) {
    return <LoadingSpinner label="Loading performance analytics..." size="lg" />;
  }

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : '4.8';

  const avgProgress =
    goals.length > 0
      ? Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length)
      : 78;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />

      {/* Header and Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-sky-500/15">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Award className="w-6 h-6 text-sky-500 dark:text-sky-400" />
            <span>Performance &amp; Talent Reviews</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track organizational goals, deliverables completion, competency ratings, and 360 feedback
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsGoalModalOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-slate-800 dark:text-sky-300 border border-slate-200 dark:border-slate-700 hover:border-sky-400 dark:hover:border-sky-500/30 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Set Goal</span>
          </button>

          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white shadow-lg shadow-sky-500/20 transition flex items-center gap-1.5 border border-sky-400/30 cursor-pointer"
          >
            <Star className="w-3.5 h-3.5" />
            <span>New Review</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Average Rating"
          value={`${avgRating} / 5.0`}
          subtext="Across all review cycles"
          icon={<Star className="w-5 h-5" />}
          colorScheme="amber"
        />
        <StatCard
          label="Goal Completion"
          value={`${avgProgress}%`}
          subtext="Overall organizational progress"
          icon={<TrendingUp className="w-5 h-5" />}
          colorScheme="blue"
        />
        <StatCard
          label="Active Goals"
          value={goals.length}
          subtext="Monitored deliverables"
          icon={<Target className="w-5 h-5" />}
          colorScheme="purple"
        />
        <StatCard
          label="Logged Reviews"
          value={reviews.length}
          subtext="Performance assessments"
          icon={<UserCheck className="w-5 h-5" />}
          colorScheme="emerald"
        />
      </div>

      {/* View Switcher: Goals vs Reviews */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('goals')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'goals'
              ? 'bg-sky-50 text-sky-700 dark:bg-blue-600/30 dark:text-sky-300 border border-sky-300 dark:border-sky-500/40 shadow-sm'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/40 border border-transparent'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Goals &amp; OKRs ({goals.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'reviews'
              ? 'bg-sky-50 text-sky-700 dark:bg-blue-600/30 dark:text-sky-300 border border-sky-300 dark:border-sky-500/40 shadow-sm'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/40 border border-transparent'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>Review History ({reviews.length})</span>
        </button>
      </div>

      {/* ============================================================
          TAB 1: GOALS & OKRS
          ============================================================ */}
      {activeTab === 'goals' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {goals.map((goal) => (
              <div
                key={goal.id}
                className="p-5 rounded-2xl bg-white dark:bg-[#0c1527] border border-slate-200 dark:border-sky-500/20 shadow-sm dark:shadow-xl flex flex-col justify-between text-left transition-colors duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/40 px-2 py-0.5 rounded border border-sky-200 dark:border-sky-500/20">
                      {goal.category}
                    </span>
                    <Badge variant={goal.progress >= 100 ? 'selected' : 'interview'}>
                      {goal.status}
                    </Badge>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{goal.title}</h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                    Assigned to: <strong className="text-slate-800 dark:text-slate-200">{goal.employee_name}</strong> ({goal.employee_id})
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Completion Progress</span>
                      <span className="text-sky-600 dark:text-sky-300 font-bold">{goal.progress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-sky-400 transition-all duration-300 rounded-full"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                    <span>Target: {goal.target_date}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleProgressChange(goal.id, Math.min(100, goal.progress + 10))}
                      className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-sky-700 dark:text-sky-300 font-semibold text-[11px] transition cursor-pointer"
                    >
                      +10%
                    </button>
                    {goal.progress < 100 && (
                      <button
                        onClick={() => handleProgressChange(goal.id, 100)}
                        className="px-2 py-1 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 font-semibold text-[11px] transition cursor-pointer"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================
          TAB 2: REVIEW HISTORY
          ============================================================ */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-6 rounded-2xl bg-white dark:bg-[#0c1527] border border-slate-200 dark:border-sky-500/20 shadow-sm dark:shadow-xl text-left flex flex-col justify-between transition-colors duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">{rev.employee_name}</h4>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Reviewer: {rev.reviewer_name}</div>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/30 px-2.5 py-1 rounded-xl text-amber-700 dark:text-amber-300 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500 dark:text-amber-400" />
                      <span>{rev.rating.toFixed(1)} / 5.0</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-[#060b18]/60 p-3.5 rounded-xl border border-slate-200 dark:border-sky-500/10 mb-4">
                    <div className="text-[11px] font-bold text-sky-700 dark:text-sky-400 mb-1 flex items-center gap-1">
                      <span>Cycle: {rev.cycle}</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                      "{rev.feedback}"
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{rev.status}</span>
                  </span>
                  <span>Evaluated: {rev.updated_at}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onSave={handleSaveGoal}
      />

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSave={handleSaveReview}
      />
    </div>
  );
};
