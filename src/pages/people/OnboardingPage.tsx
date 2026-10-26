import React, { useState, useEffect } from 'react';
import { ic } from '../../components/icons';
import { recruitApi } from '../../services/recruitApi';

interface OnboardingCandidate {
  id: string;
  name: string;
  role: string;
  department: string;
  joiningDate: string;
  progress: number;
  buddy: string;
  tasksCompleted: number;
  totalTasks: number;
  status: 'In Progress' | 'Ready for Day 1' | 'Completed';
}

export const OnboardingPage: React.FC = () => {
  const [candidates, setCandidates] = useState<OnboardingCandidate[]>([]);
  const [filter, setFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newHire, setNewHire] = useState({ name: '', role: '', department: 'Engineering', joiningDate: '', buddy: 'Ananya Rao' });

  useEffect(() => {
    recruitApi.getCandidates()
      .then((cands) => {
        const onboardings: OnboardingCandidate[] = cands
          .filter((c) => c.stage === 'Offer' || c.stage === 'Hired')
          .map((c, idx) => ({
            id: `onb-${idx + 1}`,
            name: c.full_name,
            role: c.job_title || 'Software Engineer',
            department: 'Engineering',
            joiningDate: '2026-11-15',
            progress: c.stage === 'Hired' ? 100 : 70,
            buddy: 'Ananya Rao',
            tasksCompleted: c.stage === 'Hired' ? 5 : 3,
            totalTasks: 5,
            status: c.stage === 'Hired' ? 'Completed' : 'Ready for Day 1',
          }));
        setCandidates(onboardings);
      })
      .catch(() => setCandidates([]));
  }, []);

  const filtered = candidates.filter((c) => filter === 'All' || c.status === filter);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHire.name || !newHire.joiningDate) return;
    const item: OnboardingCandidate = {
      id: `onb-${Date.now()}`,
      name: newHire.name,
      role: newHire.role || 'Associate',
      department: newHire.department,
      joiningDate: newHire.joiningDate,
      progress: 0,
      buddy: newHire.buddy,
      tasksCompleted: 0,
      totalTasks: 5,
      status: 'In Progress',
    };
    setCandidates([item, ...candidates]);
    setIsModalOpen(false);
    setNewHire({ name: '', role: '', department: 'Engineering', joiningDate: '', buddy: 'Ananya Rao' });
  };

  const advanceTask = (id: string) => {
    setCandidates(
      candidates.map((c) => {
        if (c.id === id && c.tasksCompleted < c.totalTasks) {
          const next = c.tasksCompleted + 1;
          const pct = Math.round((next / c.totalTasks) * 100);
          return {
            ...c,
            tasksCompleted: next,
            progress: pct,
            status: pct === 100 ? 'Completed' : pct >= 80 ? 'Ready for Day 1' : 'In Progress',
          };
        }
        return c;
      })
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--line)]">
        <div>
          <h1 className="text-2xl font-bold font-['Sora'] tracking-tight text-[var(--text)]">Employee Onboarding</h1>
          <p className="text-sm text-[var(--muted)] mt-1">Checklists, pre-boarding documentation, and Day 1 readiness tracking.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="btn primary text-xs font-semibold px-4 py-2 flex items-center gap-1.5 rounded-xl text-white shadow-sm"
          style={{ background: '#12A58E' }}
        >
          {ic('plus', 14)} Start New Onboarding
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-2xs">
          <p className="text-xs text-[var(--muted)]">Active In Progress</p>
          <p className="text-2xl font-bold font-['Sora'] text-[#E07A1D] mt-1">{candidates.filter((c) => c.status === 'In Progress').length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-2xs">
          <p className="text-xs text-[var(--muted)]">Ready for Day 1</p>
          <p className="text-2xl font-bold font-['Sora'] text-[#0B6FDB] mt-1">{candidates.filter((c) => c.status === 'Ready for Day 1').length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-2xs">
          <p className="text-xs text-[var(--muted)]">Completed</p>
          <p className="text-2xl font-bold font-['Sora'] text-[#15A36B] mt-1">{candidates.filter((c) => c.status === 'Completed').length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-2xs">
          <p className="text-xs text-[var(--muted)]">Checklist Items</p>
          <p className="text-2xl font-bold font-['Sora'] text-[var(--text)] mt-1">5 Mandatory</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-[var(--line)] pb-3">
        {['All', 'In Progress', 'Ready for Day 1', 'Completed'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filter === tab ? 'bg-[#12A58E] text-white shadow-xs' : 'bg-[var(--surface)] border border-[var(--line)] text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-2xs overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--surface-2)] border-b border-[var(--line)] text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">New Hire</th>
              <th className="py-3 px-4">Department & Role</th>
              <th className="py-3 px-4">Joining Date</th>
              <th className="py-3 px-4">Onboarding Buddy</th>
              <th className="py-3 px-4">Checklist Progress</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-[var(--surface-2)]/50 transition-colors">
                <td className="py-3 px-4 font-semibold text-xs text-[var(--text)]">{c.name}</td>
                <td className="py-3 px-4 text-xs text-[var(--muted)]">{c.role} · <span className="text-[var(--text)]">{c.department}</span></td>
                <td className="py-3 px-4 text-xs font-mono">{c.joiningDate}</td>
                <td className="py-3 px-4 text-xs text-[var(--muted)]">{c.buddy}</td>
                <td className="py-3 px-4 w-44">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full bg-[var(--surface-2)] overflow-hidden">
                      <div className="h-full bg-[#12A58E] transition-all" style={{ width: `${c.progress}%` }} />
                    </div>
                    <span className="text-[11px] font-mono text-[var(--muted)]">{c.tasksCompleted}/{c.totalTasks}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    c.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                    c.status === 'Ready for Day 1' ? 'bg-sky-100 text-sky-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {c.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  {c.tasksCompleted < c.totalTasks ? (
                    <button
                      type="button"
                      onClick={() => advanceTask(c.id)}
                      className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[var(--surface-2)] hover:bg-[#12A58E] hover:text-white transition-colors"
                    >
                      + Step Complete
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-600 font-semibold">Done ✓</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-[var(--muted)]">No active onboarding candidates in pipeline.</div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <form onSubmit={handleAdd} className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-['Sora'] text-lg font-bold text-[var(--text)]">Initiate Onboarding</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-[var(--text)] mb-1">New Hire Name</label>
                <input required type="text" placeholder="e.g. Shalini Roy" value={newHire.name} onChange={(e) => setNewHire({ ...newHire, name: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] text-[var(--text)] focus:outline-none" />
              </div>
              <div>
                <label className="block font-medium text-[var(--text)] mb-1">Role</label>
                <input required type="text" placeholder="e.g. Frontend Engineer" value={newHire.role} onChange={(e) => setNewHire({ ...newHire, role: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] text-[var(--text)] focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[var(--text)] mb-1">Department</label>
                  <select value={newHire.department} onChange={(e) => setNewHire({ ...newHire, department: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] text-[var(--text)] focus:outline-none">
                    <option value="Engineering">Engineering</option>
                    <option value="AI Research">AI Research</option>
                    <option value="People Ops">People Ops</option>
                    <option value="Finance">Finance</option>
                    <option value="Sales">Sales</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-[var(--text)] mb-1">Joining Date</label>
                  <input required type="date" value={newHire.joiningDate} onChange={(e) => setNewHire({ ...newHire, joiningDate: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] text-[var(--text)] focus:outline-none" />
                </div>
              </div>
            </div>
            <div className="pt-2 flex justify-end gap-2 border-t border-[var(--line)]">
              <button type="button" onClick={() => setIsModalOpen(false)} className="btn text-xs font-semibold px-4 py-2 border border-[var(--line)] rounded-xl hover:bg-[var(--surface-2)]">Cancel</button>
              <button type="submit" className="btn primary text-xs font-semibold px-4 py-2 rounded-xl text-white shadow-sm" style={{ background: '#12A58E' }}>Start Onboarding</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default OnboardingPage;
