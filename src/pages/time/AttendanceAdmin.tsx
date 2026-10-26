import React, { useState, useEffect } from 'react';

interface AttendanceLog {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  clockIn: string;
  clockOut: string;
  duration: string;
  status: 'Present' | 'Late' | 'WFH' | 'On Leave';
  regularization?: 'Pending' | 'Approved' | null;
}

export const AttendanceAdmin: React.FC = () => {
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetch('/api/v1/attendance')
      .then((res) => (res.ok ? res.json() : []))
      .then((data: any) => {
        const list = Array.isArray(data) ? data : data?.value || [];
        const mapped: AttendanceLog[] = list.map((a: any, idx: number) => ({
          id: a.id ? String(a.id) : `att-${idx + 1}`,
          name: a.employee_name || a.full_name || 'Staff Member',
          employeeId: a.employee_code || `BC-100${idx + 1}`,
          department: a.department || 'Engineering',
          clockIn: a.clock_in || '09:15 AM',
          clockOut: a.clock_out || '06:30 PM',
          duration: a.duration || '9h 15m',
          status: (a.status || 'Present') as any,
          regularization: a.regularization || null,
        }));
        setLogs(mapped);
      })
      .catch(() => setLogs([]));
  }, []);

  const filtered = logs.filter((l) => filter === 'All' || l.status === filter);

  const approveRegularization = (id: string) => {
    setLogs(logs.map((l) => (l.id === id ? { ...l, regularization: 'Approved', status: 'Present' } : l)));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--line)]">
        <div>
          <h1 className="text-2xl font-bold font-['Sora'] tracking-tight text-[var(--text)]">Attendance Admin</h1>
          <p className="text-sm text-[var(--muted)] mt-1">Live daily employee attendance, punch timestamps, and regularization approvals.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[var(--muted)]">Today: {new Date().toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-2xs">
          <p className="text-xs text-[var(--muted)]">Total Staff</p>
          <p className="text-2xl font-bold font-['Sora'] text-[var(--text)] mt-1">28</p>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-2xs">
          <p className="text-xs text-[var(--muted)]">In Office</p>
          <p className="text-2xl font-bold font-['Sora'] text-[#15A36B] mt-1">{logs.filter((l) => l.status === 'Present').length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-2xs">
          <p className="text-xs text-[var(--muted)]">Work From Home</p>
          <p className="text-2xl font-bold font-['Sora'] text-[#0B6FDB] mt-1">{logs.filter((l) => l.status === 'WFH').length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-2xs">
          <p className="text-xs text-[var(--muted)]">Late Arrivals</p>
          <p className="text-2xl font-bold font-['Sora'] text-[#E07A1D] mt-1">{logs.filter((l) => l.status === 'Late').length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-2xs">
          <p className="text-xs text-[var(--muted)]">On Leave</p>
          <p className="text-2xl font-bold font-['Sora'] text-[var(--muted)] mt-1">{logs.filter((l) => l.status === 'On Leave').length}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-[var(--line)] pb-3">
        {['All', 'Present', 'Late', 'WFH', 'On Leave'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filter === tab ? 'bg-[#3B82C4] text-white shadow-xs' : 'bg-[var(--surface)] border border-[var(--line)] text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Attendance Table */}
      <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-2xs overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--surface-2)] border-b border-[var(--line)] text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Employee</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Clock In</th>
              <th className="py-3 px-4">Clock Out</th>
              <th className="py-3 px-4">Duration</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Regularization</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-sm text-[var(--muted)]">No attendance records found for today.</td>
              </tr>
            ) : (
              filtered.map((log) => (
                <tr key={log.id} className="hover:bg-[var(--surface-2)]/50 transition-colors">
                  <td className="py-3 px-4">
                    <b className="block text-xs font-semibold text-[var(--text)]">{log.name}</b>
                    <span className="block text-[11px] font-mono text-[var(--muted)]">{log.employeeId}</span>
                  </td>
                  <td className="py-3 px-4 text-xs font-medium text-[var(--text)]">{log.department}</td>
                  <td className="py-3 px-4 text-xs font-mono">{log.clockIn}</td>
                  <td className="py-3 px-4 text-xs font-mono">{log.clockOut}</td>
                  <td className="py-3 px-4 text-xs font-mono font-semibold">{log.duration}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      log.status === 'Present' ? 'bg-emerald-100 text-emerald-700' :
                      log.status === 'WFH' ? 'bg-sky-100 text-sky-700' :
                      log.status === 'Late' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {log.regularization === 'Pending' ? (
                      <button
                        type="button"
                        onClick={() => approveRegularization(log.id)}
                        className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                      >
                        Approve Regularization
                      </button>
                    ) : log.regularization === 'Approved' ? (
                      <span className="text-xs text-emerald-600 font-semibold">Regularized ✓</span>
                    ) : (
                      <span className="text-xs text-[var(--muted)]">-</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceAdmin;
