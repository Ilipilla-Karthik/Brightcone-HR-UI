import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ic } from '../../components/icons';

export const RecruitDashboard: React.FC = () => {
  const navigate = useNavigate();

  const pipeline = [
    { stage: 'Applied', count: 48, pct: 100, color: '#7C5CFF' },
    { stage: 'Screening', count: 24, pct: 50, color: '#0B6FDB' },
    { stage: 'Technical Round', count: 14, pct: 29, color: '#12A58E' },
    { stage: 'Leadership Interview', count: 6, pct: 12, color: '#E07A1D' },
    { stage: 'Offer Extended', count: 3, pct: 6, color: '#15A36B' },
  ];

  const recentCandidates = [
    { id: 'c-1', name: 'Shreya Iyer', role: 'Staff Rust Systems Engineer', stage: 'Leadership Interview', exp: '7 yrs', date: 'Oct 24', rating: '4.8/5' },
    { id: 'c-2', name: 'Nikhil Verma', role: 'Full Stack React Engineer', stage: 'Technical Round', exp: '4 yrs', date: 'Oct 23', rating: '4.5/5' },
    { id: 'c-3', name: 'Divya Sen', role: 'Applied AI Scientist', stage: 'Offer Extended', exp: '5 yrs', date: 'Oct 22', rating: '5.0/5' },
    { id: 'c-4', name: 'Aditya Rao', role: 'DevOps / Cloud Architect', stage: 'Screening', exp: '6 yrs', date: 'Oct 25', rating: '4.2/5' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--line)]">
        <div>
          <h1 className="text-2xl font-bold font-['Sora'] tracking-tight text-[var(--text)]">Recruitment Overview</h1>
          <p className="text-sm text-[var(--muted)] mt-1">Hiring pipeline, open requisitions, candidate stages, and interview schedules.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate('/recruit/jobs')}
            className="btn text-xs font-semibold px-3.5 py-2 flex items-center gap-1.5 border border-[var(--line)] rounded-xl hover:bg-[var(--surface-2)]"
          >
            {ic('gift', 14)} Referrals Portal
          </button>
          <button
            type="button"
            onClick={() => navigate('/recruit/admin')}
            className="btn primary text-xs font-semibold px-4 py-2 flex items-center gap-1.5 rounded-xl text-white shadow-sm"
            style={{ background: '#7C5CFF' }}
          >
            {ic('briefcase', 14)} Manage Jobs & Pipeline
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-2xs">
          <span className="text-xs text-[var(--muted)] font-medium">Open Positions</span>
          <p className="text-3xl font-bold font-['Sora'] text-[var(--text)] mt-1">6</p>
          <span className="text-[11px] text-[#7C5CFF] font-medium mt-2 block">12 total requisitions</span>
        </div>
        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-2xs">
          <span className="text-xs text-[var(--muted)] font-medium">Active Candidates</span>
          <p className="text-3xl font-bold font-['Sora'] text-[#0B6FDB] mt-1">48</p>
          <span className="text-[11px] text-[var(--muted)] mt-2 block">14 in technical review</span>
        </div>
        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-2xs">
          <span className="text-xs text-[var(--muted)] font-medium">Interviews This Week</span>
          <p className="text-3xl font-bold font-['Sora'] text-[#E07A1D] mt-1">8</p>
          <span className="text-[11px] text-[var(--muted)] mt-2 block">3 scheduled today</span>
        </div>
        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-2xs">
          <span className="text-xs text-[var(--muted)] font-medium">Offers Pending</span>
          <p className="text-3xl font-bold font-['Sora'] text-[#15A36B] mt-1">3</p>
          <span className="text-[11px] text-emerald-600 font-medium mt-2 block">1 accepted yesterday</span>
        </div>
      </div>

      {/* Pipeline Funnel */}
      <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-2xs space-y-4">
        <h3 className="font-['Sora'] text-base font-bold text-[var(--text)]">Hiring Conversion Funnel</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
          {pipeline.map((p) => (
            <div key={p.stage} className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] space-y-2">
              <span className="text-xs font-semibold text-[var(--muted)] block truncate">{p.stage}</span>
              <p className="text-2xl font-bold font-['Sora']" style={{ color: p.color }}>{p.count}</p>
              <div className="h-1.5 rounded-full bg-[var(--line)] overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${p.pct}%`, background: p.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Candidate Pipeline Table */}
      <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-[var(--line)] flex items-center justify-between">
          <h3 className="font-['Sora'] text-sm font-bold text-[var(--text)]">Active Candidate Applications</h3>
          <button
            type="button"
            onClick={() => navigate('/recruit/admin')}
            className="text-xs font-semibold text-[#7C5CFF] hover:underline"
          >
            View All in Pipeline →
          </button>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--surface-2)] border-b border-[var(--line)] text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Candidate</th>
              <th className="py-3 px-4">Role Applied</th>
              <th className="py-3 px-4">Experience</th>
              <th className="py-3 px-4">Current Stage</th>
              <th className="py-3 px-4">Score</th>
              <th className="py-3 px-4">Applied</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]">
            {recentCandidates.map((c) => (
              <tr key={c.id} className="hover:bg-[var(--surface-2)]/50 transition-colors">
                <td className="py-3 px-4 font-semibold text-xs text-[var(--text)] flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-[#7C5CFF] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                    {c.name.split(' ').map((n) => n[0]).join('')}
                  </span>
                  {c.name}
                </td>
                <td className="py-3 px-4 text-xs font-medium text-[var(--text)]">{c.role}</td>
                <td className="py-3 px-4 text-xs text-[var(--muted)]">{c.exp}</td>
                <td className="py-3 px-4">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#F0EEFF] dark:bg-purple-950 text-[#7C5CFF]">
                    {c.stage}
                  </span>
                </td>
                <td className="py-3 px-4 text-xs font-mono font-semibold text-emerald-600">{c.rating}</td>
                <td className="py-3 px-4 text-xs font-mono text-[var(--muted)]">{c.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecruitDashboard;
