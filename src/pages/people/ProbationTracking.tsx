import React, { useState } from 'react';

interface ProbationItem {
  id: string;
  code: string;
  name: string;
  department: string;
  role: string;
  startDate: string;
  endDate: string;
  manager: string;
  status: 'Under Review' | 'Eligible for Confirmation' | 'Confirmed' | 'Extended';
}

const DEFAULT_PROBATIONS: ProbationItem[] = [
  { id: 'pb-1', code: 'BC-1060', name: 'Rohan Verma', department: 'Engineering', role: 'Associate QA Engineer', startDate: '2026-08-15', endDate: '2026-11-15', manager: 'Vikram Malhotra', status: 'Eligible for Confirmation' },
  { id: 'pb-2', code: 'BC-1065', name: 'Meera Nambiar', department: 'Product', role: 'Product Designer', startDate: '2026-09-01', endDate: '2026-12-01', manager: 'Karthik Reddy', status: 'Under Review' },
  { id: 'pb-3', code: 'BC-1052', name: 'Amit Joshi', department: 'Sales', role: 'Enterprise Account Executive', startDate: '2026-05-10', endDate: '2026-08-10', manager: 'Naresh Vemparala', status: 'Confirmed' },
];

export const ProbationTracking: React.FC = () => {
  const [probations, setProbations] = useState<ProbationItem[]>(DEFAULT_PROBATIONS);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const handleStatusChange = (id: string, nextStatus: ProbationItem['status']) => {
    setProbations(probations.map((p) => (p.id === id ? { ...p, status: nextStatus } : p)));
  };

  const filtered = probations.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = !search || p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q) || p.department.toLowerCase().includes(q);
    const matchFilter = filter === 'All' || p.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--line)]">
        <div>
          <h1 className="text-2xl font-bold font-['Sora'] tracking-tight text-[var(--text)]">Probation Confirmation Tracker</h1>
          <p className="text-sm text-[var(--muted)] mt-1">Monitor new employee probationary periods, review manager evaluations, and issue formal confirmation letters.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] space-y-1">
          <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Active on Probation</span>
          <p className="text-2xl font-bold text-[var(--text)]">{probations.filter((p) => p.status !== 'Confirmed').length}</p>
          <span className="text-xs text-blue-500 font-medium">Evaluation in progress</span>
        </div>
        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] space-y-1">
          <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Eligible for Confirmation</span>
          <p className="text-2xl font-bold text-[var(--text)]">{probations.filter((p) => p.status === 'Eligible for Confirmation').length}</p>
          <span className="text-xs text-amber-500 font-medium">Manager review complete</span>
        </div>
        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] space-y-1">
          <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Confirmed (YTD)</span>
          <p className="text-2xl font-bold text-[var(--text)]">{probations.filter((p) => p.status === 'Confirmed').length}</p>
          <span className="text-xs text-emerald-500 font-medium">Transitioned to regular tenure</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {['All', 'Eligible for Confirmation', 'Under Review', 'Confirmed'].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${filter === f ? 'bg-[#12A58E] text-white' : 'text-[var(--muted)] hover:bg-[var(--surface-2)]'}`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search probationers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] text-xs text-[var(--text)] focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[var(--line)] bg-[var(--surface-2)]/50 text-[var(--muted)] uppercase font-semibold">
              <th className="p-3.5">Employee</th>
              <th className="p-3.5">Department & Role</th>
              <th className="p-3.5">Joining Date</th>
              <th className="p-3.5">Probation End Date</th>
              <th className="p-3.5">Reviewer Manager</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Confirmation Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)] text-[var(--text)]">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-[var(--surface-2)]/30 transition-colors">
                <td className="p-3.5">
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-[10px] text-[var(--muted)] font-mono">{item.code}</div>
                </td>
                <td className="p-3.5">
                  <div>{item.role}</div>
                  <div className="text-[10px] text-[var(--muted)]">{item.department}</div>
                </td>
                <td className="p-3.5 font-medium">{item.startDate}</td>
                <td className="p-3.5 font-medium">{item.endDate}</td>
                <td className="p-3.5 text-[var(--muted)]">{item.manager}</td>
                <td className="p-3.5">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    item.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-500' :
                    item.status === 'Eligible for Confirmation' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="p-3.5 text-right space-x-2">
                  {item.status !== 'Confirmed' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(item.id, 'Confirmed')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold text-[10px] cursor-pointer"
                      >
                        Confirm Tenure
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(item.id, 'Extended')}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-semibold text-[10px] cursor-pointer"
                      >
                        Extend 3 Mo
                      </button>
                    </>
                  ) : (
                    <span className="text-[10px] text-emerald-500 font-medium">Confirmed Employee</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProbationTracking;
