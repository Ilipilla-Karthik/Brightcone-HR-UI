import React, { useState, useEffect } from 'react';
import {
  Target,
  CheckCircle2,
  TrendingUp,
  Clock,
  Plus,
  Search,
  X,
  Star,
  Award,
  Calendar,
  AlertCircle,
  Edit2,
  Check,
} from 'lucide-react';
import { performanceApi } from '../api/performance';
import { employeesApi } from '../api/employees';
import type { Goal, Review, PerformanceSummary, Employee } from '../types';
import { InitialsAvatar } from '../components/InitialsAvatar';

export const PerformancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'goals' | 'reviews'>('goals');
  const [summary, setSummary] = useState<PerformanceSummary | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals state
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  // Form states
  const [goalForm, setGoalForm] = useState({
    employee_name: '',
    title: '',
    description: '',
    target_date: new Date().toISOString().split('T')[0],
    progress_percentage: 0,
    status: 'In Progress' as 'In Progress' | 'Completed' | 'Behind',
  });

  const [reviewForm, setReviewForm] = useState({
    employee_name: '',
    reviewer_name: '',
    review_period: 'Q1 2026',
    rating: 5,
    strengths: '',
    improvement_areas: '',
    comments: '',
    status: 'Submitted' as 'Draft' | 'Submitted' | 'Approved',
  });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [sum, gList, rList, empList] = await Promise.all([
        performanceApi.getSummary(),
        performanceApi.listGoals(),
        performanceApi.listReviews(),
        employeesApi.list(),
      ]);
      setSummary(sum);
      setGoals(gList);
      setReviews(rList);
      setEmployees(empList);
    } catch (err: any) {
      setError('Failed to fetch performance data from the PostgreSQL backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter goals
  const filteredGoals = goals.filter((g) => {
    const matchesSearch =
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.employee_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'All' || g.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Filter reviews
  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.employee_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reviewer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.review_period.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'All' || r.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleOpenCreateGoal = () => {
    setEditingGoal(null);
    setGoalForm({
      employee_name: employees[0]?.full_name || '',
      title: '',
      description: '',
      target_date: new Date().toISOString().split('T')[0],
      progress_percentage: 0,
      status: 'In Progress',
    });
    setIsGoalModalOpen(true);
  };

  const handleOpenEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setGoalForm({
      employee_name: goal.employee_name,
      title: goal.title,
      description: goal.description || '',
      target_date: goal.target_date,
      progress_percentage: goal.progress_percentage,
      status: goal.status,
    });
    setIsGoalModalOpen(true);
  };

  const handleSaveGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingGoal) {
        await performanceApi.updateGoal(editingGoal.goal_id, {
          title: goalForm.title,
          description: goalForm.description,
          target_date: goalForm.target_date,
          progress_percentage: Number(goalForm.progress_percentage),
          status: goalForm.status,
        });
      } else {
        await performanceApi.createGoal({
          employee_name: goalForm.employee_name,
          title: goalForm.title,
          description: goalForm.description,
          target_date: goalForm.target_date,
          progress_percentage: Number(goalForm.progress_percentage),
          status: goalForm.status,
        });
      }
      setIsGoalModalOpen(false);
      await loadData();
    } catch (err: any) {
      alert('Failed to save performance goal.');
    }
  };

  const handleQuickCompleteGoal = async (goal: Goal) => {
    try {
      await performanceApi.updateGoal(goal.goal_id, {
        progress_percentage: 100,
        status: 'Completed',
      });
      await loadData();
    } catch (err: any) {
      alert('Failed to update goal progress.');
    }
  };

  const handleOpenCreateReview = () => {
    setEditingReview(null);
    setReviewForm({
      employee_name: employees[0]?.full_name || '',
      reviewer_name: 'Naresh Vemparala',
      review_period: 'Q1 2026',
      rating: 5,
      strengths: '',
      improvement_areas: '',
      comments: '',
      status: 'Submitted',
    });
    setIsReviewModalOpen(true);
  };

  const handleOpenEditReview = (rev: Review) => {
    setEditingReview(rev);
    setReviewForm({
      employee_name: rev.employee_name,
      reviewer_name: rev.reviewer_name,
      review_period: rev.review_period,
      rating: rev.rating,
      strengths: rev.strengths || '',
      improvement_areas: rev.improvement_areas || '',
      comments: rev.comments || '',
      status: rev.status,
    });
    setIsReviewModalOpen(true);
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingReview) {
        await performanceApi.updateReview(editingReview.review_id, {
          rating: Number(reviewForm.rating),
          strengths: reviewForm.strengths,
          improvement_areas: reviewForm.improvement_areas,
          comments: reviewForm.comments,
          status: reviewForm.status,
        });
      } else {
        await performanceApi.createReview({
          employee_name: reviewForm.employee_name,
          reviewer_name: reviewForm.reviewer_name,
          review_period: reviewForm.review_period,
          rating: Number(reviewForm.rating),
          strengths: reviewForm.strengths,
          improvement_areas: reviewForm.improvement_areas,
          comments: reviewForm.comments,
          status: reviewForm.status,
        });
      }
      setIsReviewModalOpen(false);
      await loadData();
    } catch (err: any) {
      alert('Failed to save performance review.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-[#0B2641]">Performance Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track company objectives, quarterly reviews, and employee OKR progression.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenCreateGoal}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#0B6FDB] hover:bg-[#095bc2] rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Goal
          </button>
          <button
            onClick={handleOpenCreateReview}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#0B2641] bg-white border border-gray-300 hover:bg-gray-50 rounded-lg shadow-sm transition-colors"
          >
            <Award className="w-4 h-4 text-[#0B6FDB]" />
            New Review
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-[#0B6FDB]">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total Goals
            </div>
            <div className="text-2xl font-bold text-[#0B2641] mt-0.5">
              {summary ? summary.total_goals : '—'}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Completed Goals
            </div>
            <div className="text-2xl font-bold text-emerald-600 mt-0.5">
              {summary ? summary.completed_goals : '—'}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              In Progress
            </div>
            <div className="text-2xl font-bold text-amber-600 mt-0.5">
              {summary ? summary.in_progress_goals : '—'}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Pending Reviews
            </div>
            <div className="text-2xl font-bold text-purple-600 mt-0.5">
              {summary ? summary.pending_reviews : '—'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Card with Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 px-6 pt-4 gap-8">
          <button
            onClick={() => {
              setActiveTab('goals');
              setStatusFilter('All');
            }}
            className={`pb-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'goals'
                ? 'border-[#0B6FDB] text-[#0B6FDB]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Target className="w-4 h-4" />
            Active Goals & OKRs
            <span className="ml-1.5 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-50 text-[#0B6FDB]">
              {goals.length}
            </span>
          </button>
          <button
            onClick={() => {
              setActiveTab('reviews');
              setStatusFilter('All');
            }}
            className={`pb-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'reviews'
                ? 'border-[#0B6FDB] text-[#0B6FDB]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Award className="w-4 h-4" />
            Performance Reviews
            <span className="ml-1.5 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-50 text-[#0B6FDB]">
              {reviews.length}
            </span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="p-4 bg-gray-50/50 border-b border-gray-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={
                activeTab === 'goals'
                  ? 'Search by goal title or employee...'
                  : 'Search by employee or reviewer...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B6FDB]"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label className="text-xs font-medium text-gray-500 whitespace-nowrap">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B6FDB]"
            >
              <option value="All">All Statuses</option>
              {activeTab === 'goals' ? (
                <>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Behind">Behind</option>
                </>
              ) : (
                <>
                  <option value="Submitted">Submitted</option>
                  <option value="Draft">Draft</option>
                  <option value="Approved">Approved</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* Content Body */}
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            <div className="inline-block animate-spin w-8 h-8 border-4 border-[#0B6FDB] border-t-transparent rounded-full mb-3" />
            <p className="text-sm">Loading performance metrics from PostgreSQL...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600 flex flex-col items-center gap-2">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <p className="text-sm">{error}</p>
          </div>
        ) : activeTab === 'goals' ? (
          filteredGoals.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Target className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="font-semibold text-gray-700">No performance goals found</p>
              <p className="text-xs text-gray-400 mt-1">
                Try clearing search filters or create a new goal.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="py-3 px-6">Employee</th>
                    <th className="py-3 px-6">Goal & Description</th>
                    <th className="py-3 px-6">Target Date</th>
                    <th className="py-3 px-6 w-48">Progress</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm">
                  {filteredGoals.map((goal) => (
                    <tr key={goal.goal_id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <InitialsAvatar name={goal.employee_name} size="sm" />
                          <span className="font-semibold text-[#0B2641]">
                            {goal.employee_name}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 max-w-xs">
                        <div className="font-medium text-[#0B2641]">{goal.title}</div>
                        {goal.description && (
                          <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                            {goal.description}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 text-gray-600 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {goal.target_date}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="w-full">
                          <div className="flex items-center justify-between text-xs font-semibold text-gray-700 mb-1">
                            <span>{goal.progress_percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${
                                goal.progress_percentage >= 100
                                  ? 'bg-emerald-500'
                                  : goal.status === 'Behind'
                                  ? 'bg-rose-500'
                                  : 'bg-[#0B6FDB]'
                              }`}
                              style={{ width: `${Math.min(goal.progress_percentage, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            goal.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : goal.status === 'Behind'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {goal.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        {goal.progress_percentage < 100 && (
                          <button
                            onClick={() => handleQuickCompleteGoal(goal)}
                            title="Mark as 100% Complete"
                            className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEditGoal(goal)}
                          title="Edit Goal"
                          className="p-1.5 text-gray-500 hover:text-[#0B6FDB] hover:bg-blue-50 rounded-md transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : filteredReviews.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Award className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="font-semibold text-gray-700">No performance reviews found</p>
            <p className="text-xs text-gray-400 mt-1">
              Start by scheduling or submitting a review for an employee.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-3 px-6">Employee</th>
                  <th className="py-3 px-6">Reviewer</th>
                  <th className="py-3 px-6">Period</th>
                  <th className="py-3 px-6">Rating</th>
                  <th className="py-3 px-6">Feedback Summary</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {filteredReviews.map((rev) => (
                  <tr key={rev.review_id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <InitialsAvatar name={rev.employee_name} size="sm" />
                        <span className="font-semibold text-[#0B2641]">
                          {rev.employee_name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600 text-xs font-medium">
                      {rev.reviewer_name}
                    </td>
                    <td className="py-4 px-6 text-xs text-gray-600">
                      <span className="px-2 py-0.5 rounded bg-gray-100 font-mono text-gray-700">
                        {rev.review_period}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'
                            }`}
                          />
                        ))}
                        <span className="text-xs font-bold text-gray-700 ml-1">
                          {rev.rating}.0
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 max-w-xs text-xs text-gray-600">
                      {rev.strengths && (
                        <div className="line-clamp-1">
                          <strong className="text-emerald-700">Pros:</strong> {rev.strengths}
                        </div>
                      )}
                      {rev.improvement_areas && (
                        <div className="line-clamp-1 mt-0.5">
                          <strong className="text-amber-700">Focus:</strong>{' '}
                          {rev.improvement_areas}
                        </div>
                      )}
                      {!rev.strengths && !rev.improvement_areas && (
                        <span className="text-gray-400 italic">No notes provided</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          rev.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : rev.status === 'Draft'
                            ? 'bg-gray-100 text-gray-600 border border-gray-200'
                            : 'bg-purple-50 text-purple-700 border border-purple-200'
                        }`}
                      >
                        {rev.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleOpenEditReview(rev)}
                        title="Edit Review"
                        className="p-1.5 text-gray-500 hover:text-[#0B6FDB] hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Goal Modal */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-[#0B2641]">
                {editingGoal ? 'Edit Performance Goal' : 'Create Performance Goal'}
              </h2>
              <button
                onClick={() => setIsGoalModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGoal} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Employee *
                </label>
                {editingGoal ? (
                  <input
                    type="text"
                    disabled
                    value={goalForm.employee_name}
                    className="w-full px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded-lg text-gray-600"
                  />
                ) : (
                  <select
                    required
                    value={goalForm.employee_name}
                    onChange={(e) =>
                      setGoalForm({ ...goalForm, employee_name: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B6FDB]"
                  >
                    {employees.map((emp) => (
                      <option key={emp.employee_code} value={emp.full_name}>
                        {emp.full_name} ({emp.employee_code} - {emp.job_title})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Goal Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement distributed tracing"
                  value={goalForm.title}
                  onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B6FDB]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Specific deliverables or OKR scope..."
                  value={goalForm.description}
                  onChange={(e) => setGoalForm({ ...goalForm, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B6FDB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Target Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={goalForm.target_date}
                    onChange={(e) =>
                      setGoalForm({ ...goalForm, target_date: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B6FDB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={goalForm.status}
                    onChange={(e) =>
                      setGoalForm({
                        ...goalForm,
                        status: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B6FDB]"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Behind">Behind</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-gray-700">
                    Progress Percentage: {goalForm.progress_percentage}%
                  </label>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={goalForm.progress_percentage}
                  onChange={(e) =>
                    setGoalForm({
                      ...goalForm,
                      progress_percentage: Number(e.target.value),
                      status:
                        Number(e.target.value) >= 100
                          ? 'Completed'
                          : goalForm.status === 'Completed'
                          ? 'In Progress'
                          : goalForm.status,
                    })
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0B6FDB]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsGoalModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold text-white bg-[#0B6FDB] hover:bg-[#095bc2] rounded-lg shadow-sm transition-colors"
                >
                  {editingGoal ? 'Update Goal' : 'Save Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-[#0B2641]">
                {editingReview ? 'Edit Performance Review' : 'Create Performance Review'}
              </h2>
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReview} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Employee *
                  </label>
                  {editingReview ? (
                    <input
                      type="text"
                      disabled
                      value={reviewForm.employee_name}
                      className="w-full px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded-lg text-gray-600"
                    />
                  ) : (
                    <select
                      required
                      value={reviewForm.employee_name}
                      onChange={(e) =>
                        setReviewForm({ ...reviewForm, employee_name: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B6FDB]"
                    >
                      {employees.map((emp) => (
                        <option key={emp.employee_code} value={emp.full_name}>
                          {emp.full_name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Reviewer *
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewForm.reviewer_name}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, reviewer_name: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B6FDB]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Review Period *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Q1 2026 or Annual 2025"
                    value={reviewForm.review_period}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, review_period: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B6FDB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Rating (1-5 Stars) *
                  </label>
                  <div className="flex items-center gap-1 py-1.5">
                    {[1, 2, 3, 4, 5].map((starVal) => (
                      <button
                        key={starVal}
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, rating: starVal })}
                        className="p-1 focus:outline-none"
                      >
                        <Star
                          className={`w-6 h-6 transition-colors ${
                            starVal <= reviewForm.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-300 hover:text-amber-200'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-gray-700 ml-2">
                      {reviewForm.rating} / 5
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Key Strengths
                </label>
                <input
                  type="text"
                  placeholder="e.g. High technical velocity, great mentorship"
                  value={reviewForm.strengths}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, strengths: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B6FDB]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Areas of Improvement
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cross-functional documentation, delegating tasks"
                  value={reviewForm.improvement_areas}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, improvement_areas: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B6FDB]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Additional Comments
                </label>
                <textarea
                  rows={2}
                  placeholder="Overall evaluation and promotion recommendations..."
                  value={reviewForm.comments}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, comments: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B6FDB]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Review Status
                </label>
                <select
                  value={reviewForm.status}
                  onChange={(e) =>
                    setReviewForm({
                      ...reviewForm,
                      status: e.target.value as any,
                    })
                  }
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B6FDB]"
                >
                  <option value="Draft">Draft</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Approved">Approved</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold text-white bg-[#0B6FDB] hover:bg-[#095bc2] rounded-lg shadow-sm transition-colors"
                >
                  {editingReview ? 'Update Review' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
