import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ic } from '../../components/icons';

export const PeopleDashboard: React.FC = () => {
  const navigate = useNavigate();

  const depts = [
    { name: 'Engineering', count: 12, pct: 43, color: '#0B6FDB' },
    { name: 'AI Research', count: 6, pct: 21, color: '#7C5CFF' },
    { name: 'People Ops', count: 4, pct: 14, color: '#12A58E' },
    { name: 'Finance', count: 3, pct: 11, color: '#15A36B' },
    { name: 'Sales', count: 3, pct: 11, color: '#E07A1D' },
  ];

  const recentHires = [
    { name: 'Meera Nambiar', role: 'Product Designer', date: 'Joined Sep 01', dept: 'Product' },
    { name: 'Rohan Verma', role: 'Associate QA Engineer', date: 'Joined Aug 15', dept: 'Engineering' },
    { name: 'Deepak S', role: 'DevOps Engineer', date: 'Joined Jan 10', dept: 'Engineering' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--line)]">
        <div>
          <h1 className="text-2xl font-bold font-['Sora'] tracking-tight text-[var(--text)]">People Management</h1>
          <p className="text-sm text-[var(--muted)] mt-1">Master workforce data, organizational structure, and employee lifecycle.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/people')}
          className="btn primary text-xs font-semibold px-4 py-2 flex items-center gap-1.5 rounded-xl text-white shadow-sm"
          style={{ background: '#12A58E' }}
        >
          {ic('users', 14)} Open Directory
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-2xs">
          <span className="text-xs text-[var(--muted)] font-medium">Total Headcount</span>
          <p className="text-3xl font-bold font-['Sora'] text-[var(--text)] mt-1">28</p>
          <span className="text-[11px] text-emerald-600 font-medium mt-2 block">+3 joined this quarter</span>
        </div>
        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-2xs">
          <span className="text-xs text-[var(--muted)] font-medium">Active Onboarding</span>
          <p className="text-3xl font-bold font-['Sora'] text-[#12A58E] mt-1">4</p>
          <span className="text-[11px] text-[var(--muted)] mt-2 block">1 ready for Day 1</span>
        </div>
        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-2xs">
          <span className="text-xs text-[var(--muted)] font-medium">On Probation</span>
          <p className="text-3xl font-bold font-['Sora'] text-[#E07A1D] mt-1">2</p>
          <span className="text-[11px] text-[var(--muted)] mt-2 block">Reviews due in Nov</span>
        </div>
        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-2xs">
          <span className="text-xs text-[var(--muted)] font-medium">Asset Allocation</span>
          <p className="text-3xl font-bold font-['Sora'] text-[#0B6FDB] mt-1">92%</p>
          <span className="text-[11px] text-[var(--muted)] mt-2 block">38 of 45 devices assigned</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Breakdown */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-2xs space-y-4">
          <h3 className="font-['Sora'] text-base font-bold text-[var(--text)]">Workforce by Department</h3>
          <div className="space-y-3.5 pt-2">
            {depts.map((d) => (
              <div key={d.name} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-[var(--text)]">{d.name}</span>
                  <span className="text-[var(--muted)]">{d.count} employees ({d.pct}%)</span>
                </div>
                <div className="h-2 rounded-full bg-[var(--surface-2)] overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${d.pct}%`, background: d.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links / Recent Hires */}
        <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-2xs space-y-4">
          <h3 className="font-['Sora'] text-base font-bold text-[var(--text)]">Recent Joiners</h3>
          <div className="divide-y divide-[var(--line)]">
            {recentHires.map((hire) => (
              <div key={hire.name} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#12A58E] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {hire.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </span>
                  <div>
                    <b className="block text-xs font-semibold text-[var(--text)]">{hire.name}</b>
                    <span className="block text-[11px] text-[var(--muted)]">{hire.role} · {hire.dept}</span>
                  </div>
                </div>
                <span className="text-[11px] text-[var(--muted)]">{hire.date}</span>
              </div>
            ))}
          </div>
          <div className="pt-2 border-t border-[var(--line)]">
            <button
              type="button"
              onClick={() => navigate('/people/onboarding')}
              className="w-full text-center text-xs font-semibold text-[#12A58E] hover:underline"
            >
              View Onboarding Pipeline →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeopleDashboard;
