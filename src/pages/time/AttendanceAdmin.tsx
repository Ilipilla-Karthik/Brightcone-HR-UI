import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Clock,
  Play,
  Square,
  Calendar,
  Users,
  Repeat,
  Shield,
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
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'attendance';

  const [shifts, setShifts] = useState<ShiftItem[]>(DEFAULT_SHIFTS);
  const [isClockedIn, setIsClockedIn] = useState(true);
  const [clockInTime, setClockInTime] = useState<string | null>('09:30 AM');

  const [swapRequests, setSwapRequests] = useState([
    { id: 'SW-1', requester: 'Rohan Gupta', shift: 'Night Shift', date: '25 Oct 2026', target: 'Tejas Patil', status: 'Pending Review' },
    { id: 'SW-2', requester: 'Aditi Sharma', shift: 'Evening Shift', date: '28 Oct 2026', target: 'Rahul Varma', status: 'Approved' },
  ]);

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

  const setTab = (tab: string) => setSearchParams({ tab });

  const handleClockToggle = () => {
    if (!isClockedIn) {
      setIsClockedIn(true);
      setClockInTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } else {
      setIsClockedIn(false);
      setClockInTime(null);
    }
  };

  const handleApproveSwap = (id: string) => {
    setSwapRequests((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'Approved' } : s))
    );
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
          <h1 className="text-2xl font-bold text-[var(--text)] mt-1">Shift Roster & Clock Hub</h1>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            Real-time biometric attendance roster, shift allocations, swapping, and company holidays.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-[var(--surface-2)] p-3 rounded-xl border border-[var(--line)]">
          <div className="text-right">
            <span className="text-[10px] text-[var(--muted)] block">Current Session</span>
            <span className="text-xs font-bold text-[var(--text)]">
              {isClockedIn ? `Clocked in at ${clockInTime}` : 'Not clocked in'}
            </span>
          </div>
          <button
            onClick={handleClockToggle}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl text-white transition ${
              isClockedIn ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {isClockedIn ? <Square size={14} /> : <Play size={14} />}
            <span>{isClockedIn ? 'Clock Out' : 'Clock In'}</span>
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-[var(--line)] pb-3 overflow-x-auto text-xs font-semibold">
        {[
          { key: 'attendance', label: 'Attendance Roster', icon: <Clock size={14} />, count: '94% Present' },
          { key: 'roster', label: 'Shift Scheduling', icon: <Users size={14} />, count: shifts.length },
          { key: 'swap', label: 'Shift Swapping', icon: <Repeat size={14} />, count: swapRequests.length },
          { key: 'holidays', label: 'Holiday Calendar', icon: <Calendar size={14} />, count: '2026' },
          { key: 'leaves', label: 'Leave Applications', icon: <Shield size={14} /> },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
              currentTab === t.key
                ? 'bg-[var(--surface-2)] text-[var(--brand)] shadow-xs'
                : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]/50'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
            {t.count && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-[var(--line)] text-[var(--text)]">
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab 1: Attendance Roster */}
      {currentTab === 'attendance' && (
        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--line)] overflow-hidden shadow-sm text-xs">
          <div className="p-4 border-b border-[var(--line)] flex items-center justify-between">
            <h2 className="text-xs font-bold text-[var(--text)]">Today's Attendance Roll (23 October 2026)</h2>
            <span className="text-[11px] text-[var(--muted)]">Biometric & Web Check-ins</span>
          </div>
          <table className="w-full text-left">
            <thead className="bg-[var(--surface-2)] border-b border-[var(--line)] text-[var(--muted)] uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Shift</th>
                <th className="py-3 px-4">Clock-In</th>
                <th className="py-3 px-4">Clock-Out</th>
                <th className="py-3 px-4">Logged Hours</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {[
                { name: 'Rahul Varma', code: 'BC-1038', shift: 'General (09:00 - 18:00)', in: '09:30 AM', out: '--', hrs: '5h 45m', status: 'On Time' },
                { name: 'Aditi Sharma', code: 'BC-1045', shift: 'General (09:00 - 18:00)', in: '09:12 AM', out: '--', hrs: '6h 03m', status: 'On Time' },
                { name: 'Rohan Gupta', code: 'BC-1052', shift: 'Morning (06:00 - 15:00)', in: '06:02 AM', out: '03:05 PM', hrs: '9h 03m', status: 'Completed' },
                { name: 'Kavya Pillai', code: 'BC-1061', shift: 'General (09:00 - 18:00)', in: '09:45 AM', out: '--', hrs: '5h 30m', status: 'On Time' },
                { name: 'Marcus Lee', code: 'BC-1070', shift: 'General (09:00 - 18:00)', in: '10:15 AM', out: '--', hrs: '5h 00m', status: 'Late Mark' },
              ].map((rec, i) => (
                <tr key={i} className="hover:bg-[var(--surface-2)]/60">
                  <td className="py-3 px-4">
                    <p className="font-semibold text-[var(--text)]">{rec.name}</p>
                    <p className="text-[11px] text-[var(--muted)] font-mono">{rec.code}</p>
                  </td>
                  <td className="py-3 px-4 text-[var(--text)]">{rec.shift}</td>
                  <td className="py-3 px-4 font-mono text-[var(--text)]">{rec.in}</td>
                  <td className="py-3 px-4 font-mono text-[var(--muted)]">{rec.out}</td>
                  <td className="py-3 px-4 font-bold text-[var(--brand)]">{rec.hrs}</td>
                  <td className="py-3 px-4 text-right">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      rec.status === 'Late Mark'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {rec.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Shift Scheduling */}
      {currentTab === 'roster' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {shifts.map((s) => (
            <div key={s.id} className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--line)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-[var(--brand)] bg-[var(--surface-2)] px-2 py-0.5 rounded">
                  {s.code}
                </span>
                <span className="text-emerald-600 font-semibold text-[10px]">Active Shift</span>
              </div>
              <h3 className="text-sm font-bold text-[var(--text)]">{s.name}</h3>
              <p className="font-mono text-xs text-[var(--text)]">{s.startTime} - {s.endTime}</p>
              <p className="text-[var(--muted)]">Break Duration: {s.breakDurationMinutes} mins {s.isOvernight && '• Overnight'}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Shift Swapping */}
      {currentTab === 'swap' && (
        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--line)] divide-y divide-[var(--line)] text-xs">
          {swapRequests.map((sw) => (
            <div key={sw.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="font-bold text-sm text-[var(--text)]">{sw.requester} ➔ {sw.target}</p>
                <p className="text-[var(--muted)]">Requested Shift: {sw.shift} on {sw.date}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700">
                  {sw.status}
                </span>
                {sw.status === 'Pending Review' && (
                  <button
                    onClick={() => handleApproveSwap(sw.id)}
                    className="px-3 py-1 bg-[var(--brand)] text-white text-xs font-semibold rounded-lg hover:opacity-90"
                  >
                    Approve Swap
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Holiday Calendar */}
      {currentTab === 'holidays' && (
        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--line)] divide-y divide-[var(--line)] text-xs">
          {[
            { name: 'Diwali / Deepavali', date: '01 Nov 2026', day: 'Sunday', type: 'Mandatory Gazetted' },
            { name: 'Guru Nanak Jayanti', date: '15 Nov 2026', day: 'Sunday', type: 'Gazetted' },
            { name: 'Christmas Day', date: '25 Dec 2026', day: 'Friday', type: 'Mandatory Gazetted' },
            { name: 'Republic Day', date: '26 Jan 2027', day: 'Tuesday', type: 'National Holiday' },
          ].map((h, i) => (
            <div key={i} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-[var(--text)]">{h.name}</p>
                <p className="text-[var(--muted)]">{h.date} ({h.day})</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[var(--surface-2)] text-[var(--text)] border border-[var(--line)]">
                {h.type}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Tab 5: Leaves */}
      {currentTab === 'leaves' && (
        <div className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--line)] space-y-4 text-xs">
          <h3 className="font-bold text-sm text-[var(--text)]">Team Leave Approvals Queue</h3>
          <div className="divide-y divide-[var(--line)]">
            {[
              { emp: 'Marcus Lee', type: 'Casual Leave', dates: '28 Oct 2026', reason: 'Personal errands', status: 'Pending Approval' },
              { emp: 'Neha Bansal', type: 'Sick Leave', dates: '29 Oct - 30 Oct 2026', reason: 'Medical appointment', status: 'Approved' },
            ].map((lv, i) => (
              <div key={i} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-bold text-[var(--text)]">{lv.emp} — {lv.type}</p>
                  <p className="text-[var(--muted)]">{lv.dates} • Reason: {lv.reason}</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700">
                  {lv.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceAdmin;
