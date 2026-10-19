import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Briefcase,
  TrendingUp,
  Calendar,
  ArrowRight,
  Clock,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { dashboardApi } from '../api/dashboard';
import { authApi } from '../api/auth';
import type { DashboardSummary } from '../types';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';

export const DashboardPage: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentUser = authApi.getCurrentUser();

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const data = await dashboardApi.getSummary();
      setSummary(data);
    } catch (err: any) {
      setError('Failed to load dashboard metrics from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-sm text-slate-600">
          <div className="w-4 h-4 border-2 border-[#0B6FDB] border-t-transparent rounded-full animate-spin" />
          Loading workspace metrics...
        </div>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="p-8 bg-white rounded-2xl border border-rose-200 text-center max-w-lg mx-auto">
        <p className="text-sm text-rose-600 font-semibold mb-3">{error || 'No data found'}</p>
        <button
          onClick={fetchSummary}
          className="px-4 py-2 text-xs font-semibold bg-[#0B2641] text-white rounded-xl"
        >
          Retry
        </button>
      </div>
    );
  }

  const stages = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired'];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0B2641] via-[#071B2F] to-[#0B6FDB] rounded-2xl p-6 sm:p-8 text-white shadow-sm">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-white text-xs font-medium backdrop-blur-xs mb-3 border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-[#12C2A2]" />
            Brightcone HR Portal v1.0
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome back, {currentUser?.name || 'Teammate'}
          </h1>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Here is your live workforce snapshot backed by PostgreSQL persistence. All records reflect active database states.
          </p>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Employees"
          value={summary.total_employees}
          subtitle={`${summary.active_employees} active, ${summary.employees_on_leave} on leave`}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Open Positions"
          value={summary.open_jobs}
          subtitle="Across AI, Eng, Sales, Design"
          icon={Briefcase}
          color="emerald"
        />
        <StatCard
          title="Active Candidates"
          value={summary.total_candidates}
          subtitle="In recruitment pipeline"
          icon={Users}
          color="purple"
        />
        <StatCard
          title="Goals Completed"
          value={summary.goals_completed}
          subtitle={`${summary.pending_performance_reviews} reviews pending`}
          icon={TrendingUp}
          color="amber"
        />
      </div>

      {/* Pipeline Breakdown & Upcoming Interviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recruitment Pipeline Progress */}
        <div className="lg:col-span-2 bg-white dark:bg-[#070D1E] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Recruitment Pipeline Stages</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Live candidate volume by evaluation round</p>
            </div>
            <Link
              to="/recruitment"
              className="text-xs font-semibold text-[#0B6FDB] hover:text-[#095bc2] inline-flex items-center gap-1"
            >
              Open Pipeline <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {stages.map((stage) => {
              const count = summary.applications_by_stage[stage] || 0;
              const percentage = summary.total_candidates > 0
                ? Math.round((count / summary.total_candidates) * 100)
                : 0;

              return (
                <div key={stage} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <StatusBadge status={stage} />
                    </span>
                    <span className="font-medium text-slate-500 dark:text-slate-400">
                      {count} {count === 1 ? 'candidate' : 'candidates'} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        stage === 'Hired'
                          ? 'bg-emerald-500'
                          : stage === 'Offer'
                          ? 'bg-amber-500'
                          : stage === 'Interview'
                          ? 'bg-indigo-600'
                          : stage === 'Screening'
                          ? 'bg-purple-600'
                          : 'bg-[#0B6FDB]'
                      }`}
                      style={{ width: `${Math.max(percentage, count > 0 ? 8 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Interviews Card */}
        <div className="bg-white dark:bg-[#070D1E] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Upcoming Interviews</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">{summary.upcoming_interviews_count} sessions booked</p>
              </div>
              <Calendar className="w-4 h-4 text-[#0B6FDB]" />
            </div>

            <div className="mt-4 space-y-3">
              {summary.upcoming_interviews.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No upcoming interviews scheduled.
                </div>
              ) : (
                summary.upcoming_interviews.map((intv) => (
                  <div
                    key={intv.interview_id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {intv.candidate_name}
                      </span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300">
                        {intv.round_name}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {intv.scheduled_at}
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      Panel: {intv.panel}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
            <Link
              to="/recruitment"
              className="text-xs font-semibold text-[#0B6FDB] hover:text-[#095bc2] inline-flex items-center gap-1"
            >
              Schedule interview <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/employees"
          className="group p-5 bg-white dark:bg-[#070D1E] rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-[#0B6FDB]/50 shadow-xs hover:shadow-md transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#0B6FDB] group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#0B6FDB] transition-colors">
                Employees Directory
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Search, filter, edit & manage records</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#0B6FDB] group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          to="/recruitment"
          className="group p-5 bg-white dark:bg-[#070D1E] rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-[#12C2A2]/50 shadow-xs hover:shadow-md transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#12C2A2] group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#12C2A2] transition-colors">
                Recruitment Hub
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Jobs, applicants & interview rounds</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#12C2A2] group-hover:translate-x-1 transition-all" />
        </Link>

        <Link
          to="/performance"
          className="group p-5 bg-white dark:bg-[#070D1E] rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-800 shadow-xs hover:shadow-md transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                Goals & Performance
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Milestone goals & review cycles</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>
    </div>
  );
};
