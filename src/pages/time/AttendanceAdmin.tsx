import React, { useState, useEffect } from 'react';
import {
  Play,
  Square,
} from 'lucide-react';
import { api } from '../../services/api';

interface ShiftItem {
  id: number;
  code: string;
  name: string;
  startTime: string;
  endTime: string;
  breakDurationMinutes: number;
  isOvernight: boolean;
  isActive: boolean;
}

const DEFAULT_SHIFTS: ShiftItem[] = [
  { id: 1, code: 'GEN', name: 'General Shift', startTime: '09:00', endTime: '18:00', breakDurationMinutes: 60, isOvernight: false, isActive: true },
  { id: 2, code: 'MORN', name: 'Morning Shift', startTime: '06:00', endTime: '15:00', breakDurationMinutes: 45, isOvernight: false, isActive: true },
  { id: 3, code: 'EVE', name: 'Evening Shift', startTime: '14:00', endTime: '23:00', breakDurationMinutes: 45, isOvernight: false, isActive: true },
  { id: 4, code: 'NIGHT', name: 'Night Shift', startTime: '22:00', endTime: '07:00', breakDurationMinutes: 60, isOvernight: true, isActive: true },
];

export const AttendanceAdmin: React.FC = () => {
  const [shifts, setShifts] = useState<ShiftItem[]>(DEFAULT_SHIFTS);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    api.get('/shifts')
      .then((res) => {
        if (active && res.data && Array.isArray(res.data) && res.data.length > 0) {
          setShifts(res.data);
        }
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  const handleClockToggle = () => {
    if (!isClockedIn) {
      setIsClockedIn(true);
      setClockInTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } else {
      setIsClockedIn(false);
      setClockInTime(null);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner with Live Clock Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--surface)] p-6 rounded-2xl border border-[var(--line)] shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--brand)]">
            <span className="w-2 h-2 rounded-full bg-[var(--brand)] animate-pulse" />
            Time & Shift Operations
          </div>
          <h1 className="text-2xl font-bold text-[var(--text)] mt-1">Time & Attendance Management</h1>
          <p className="text-sm text-[var(--muted)] mt-0.5">
            Configure shift rotas, monitor punch-in times, and review employee attendance logs.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleClockToggle}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl text-white shadow-sm transition ${
              isClockedIn ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {isClockedIn ? <Square size={16} /> : <Play size={16} />}
            {isClockedIn ? `Clock Out (${clockInTime})` : 'Quick Clock In'}
          </button>
        </div>
      </div>

      {/* Real Shifts Section (PostgreSQL-backed) */}
      <div>
        <h2 className="text-base font-bold text-[var(--text)] mb-3">Configured Shift Bands</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {shifts.map((s) => (
            <div key={s.id} className="bg-[var(--surface)] p-4 rounded-2xl border border-[var(--line)] shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[var(--surface-2)] text-[var(--brand)] border border-[var(--line)]">
                  {s.code}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <h3 className="font-bold text-[var(--text)] text-sm">{s.name}</h3>
              <p className="text-lg font-semibold text-[var(--text)] font-mono">
                {s.startTime} — {s.endTime}
              </p>
              <div className="text-xs text-[var(--muted)] flex items-center justify-between pt-1 border-t border-[var(--line)]">
                <span>Break: {s.breakDurationMinutes} mins</span>
                {s.isOvernight && <span className="text-indigo-600 font-semibold">Overnight</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Attendance Log Table */}
      <div className="bg-[var(--surface)] rounded-2xl border border-[var(--line)] overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[var(--line)] flex items-center justify-between">
          <h2 className="text-sm font-bold text-[var(--text)]">Today's Attendance Roster</h2>
          <span className="text-xs text-[var(--muted)]">Oct 23, 2026 • Real-time Log</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-[var(--line)] bg-[var(--surface-2)] text-[var(--muted)] font-semibold text-xs uppercase tracking-wider">
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Shift</th>
                <th className="py-3 px-4">First In</th>
                <th className="py-3 px-4">Last Out</th>
                <th className="py-3 px-4">Total Hours</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {[
                { name: 'Ananya Rao', code: 'BC-1001', shift: 'GEN (09:00 - 18:00)', in: '08:52 AM', out: '—', hours: '4h 37m', status: 'On Time' },
                { name: 'Rahul Varma', code: 'BC-1038', shift: 'GEN (09:00 - 18:00)', in: '09:04 AM', out: '—', hours: '4h 25m', status: 'On Time' },
                { name: 'Aditi Sharma', code: 'BC-1045', shift: 'MORN (06:00 - 15:00)', in: '06:02 AM', out: '03:00 PM', hours: '8h 58m', status: 'Present' },
                { name: 'Kavya Pillai', code: 'BC-1061', shift: 'GEN (09:00 - 18:00)', in: '08:58 AM', out: '—', hours: '4h 31m', status: 'On Time' },
                { name: 'Marcus Lee', code: 'BC-1070', shift: 'GEN (09:00 - 18:00)', in: '09:12 AM', out: '—', hours: '4h 17m', status: 'Grace In' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-[var(--surface-2)]/60">
                  <td className="py-3 px-4">
                    <p className="font-semibold text-[var(--text)]">{row.name}</p>
                    <p className="text-xs text-[var(--muted)] font-mono">{row.code}</p>
                  </td>
                  <td className="py-3 px-4 text-xs font-mono text-[var(--muted)]">{row.shift}</td>
                  <td className="py-3 px-4 text-xs font-mono text-[var(--text)] font-semibold">{row.in}</td>
                  <td className="py-3 px-4 text-xs font-mono text-[var(--muted)]">{row.out}</td>
                  <td className="py-3 px-4 text-xs font-semibold text-[var(--text)]">{row.hours}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceAdmin;
