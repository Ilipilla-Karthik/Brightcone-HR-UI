import React, { useState } from 'react';

interface AttendanceDay {
  date: string;
  inTime: string;
  outTime: string;
  duration: string;
  status: 'Present' | 'Late' | 'WFH' | 'Holiday' | 'Weekend';
}

const DEFAULT_DAYS: AttendanceDay[] = [
  { date: '2026-10-23 (Fri)', inTime: '09:28 AM', outTime: '06:35 PM', duration: '9h 07m', status: 'Present' },
  { date: '2026-10-22 (Thu)', inTime: '09:30 AM', outTime: '06:30 PM', duration: '9h 00m', status: 'Present' },
  { date: '2026-10-21 (Wed)', inTime: '10:05 AM', outTime: '07:15 PM', duration: '9h 10m', status: 'Late' },
  { date: '2026-10-20 (Tue)', inTime: '09:35 AM', outTime: '06:40 PM', duration: '9h 05m', status: 'WFH' },
  { date: '2026-10-19 (Mon)', inTime: '09:20 AM', outTime: '06:30 PM', duration: '9h 10m', status: 'Present' },
];

export const MyAttendancePage: React.FC = () => {
  const [clockedIn, setClockedIn] = useState(true);
  const [punchTime, setPunchTime] = useState('09:30 AM');
  const [days] = useState<AttendanceDay[]>(DEFAULT_DAYS);
  const [toast, setToast] = useState('');

  const togglePunch = () => {
    if (clockedIn) {
      setClockedIn(false);
      setToast('Clocked out successfully at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } else {
      setClockedIn(true);
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setPunchTime(now);
      setToast('Clocked in successfully at ' + now);
    }
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--line)]">
        <div>
          <h1 className="text-2xl font-bold font-['Sora'] tracking-tight text-[var(--text)]">My Attendance</h1>
          <p className="text-sm text-[var(--muted)] mt-1">Daily clock-in, working hours calculation, and monthly punch history.</p>
        </div>
      </div>

      {/* Clock-in Hero Card & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Live Punch Card */}
        <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--muted)]">Shift: General (09:30 - 18:30)</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${clockedIn ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
              {clockedIn ? 'CLOCKED IN' : 'CLOCKED OUT'}
            </span>
          </div>
          <div>
            <span className="text-xs text-[var(--muted)] block">Today's Clock In</span>
            <b className="font-['Sora'] text-2xl font-bold text-[var(--text)]">{clockedIn ? punchTime : '--:--'}</b>
          </div>
          <button
            type="button"
            onClick={togglePunch}
            className={`w-full py-3 rounded-xl font-bold text-xs text-white shadow-sm transition-all ${
              clockedIn ? 'bg-[#E53E3E] hover:bg-red-700' : 'bg-[#15A36B] hover:bg-emerald-700'
            }`}
          >
            {clockedIn ? 'Punch Out for the Day' : 'Punch In Now'}
          </button>
        </div>

        {/* Working Hours */}
        <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-2xs space-y-2">
          <span className="text-xs text-[var(--muted)] font-medium">Logged Hours This Week</span>
          <p className="font-['Sora'] text-3xl font-bold text-[var(--text)] mt-1">37.5 <span className="text-sm font-normal text-[var(--muted)]">/ 40 hrs</span></p>
          <div className="h-2 rounded-full bg-[var(--surface-2)] overflow-hidden mt-3">
            <div className="h-full bg-[#3B82C4]" style={{ width: '93%' }} />
          </div>
          <span className="text-[11px] text-emerald-600 font-medium block pt-1">93% weekly target completed</span>
        </div>

        {/* Monthly Attendance */}
        <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-2xs space-y-2">
          <span className="text-xs text-[var(--muted)] font-medium">Monthly Presence</span>
          <p className="font-['Sora'] text-3xl font-bold text-[#15A36B] mt-1">100%</p>
          <span className="text-[11px] text-[var(--muted)] block mt-1">22 of 22 working days attended</span>
          <span className="text-[11px] text-sky-600 font-medium block">0 unexcused absences</span>
        </div>
      </div>

      {/* History Table */}
      <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-[var(--line)]">
          <h3 className="font-['Sora'] text-sm font-bold text-[var(--text)]">Recent Daily Attendance Logs</h3>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--surface-2)] border-b border-[var(--line)] text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Clock In</th>
              <th className="py-3 px-4">Clock Out</th>
              <th className="py-3 px-4">Effective Duration</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]">
            {days.map((d) => (
              <tr key={d.date} className="hover:bg-[var(--surface-2)]/50 transition-colors">
                <td className="py-3 px-4 font-mono text-xs font-semibold text-[var(--text)]">{d.date}</td>
                <td className="py-3 px-4 font-mono text-xs text-[var(--text)]">{d.inTime}</td>
                <td className="py-3 px-4 font-mono text-xs text-[var(--text)]">{d.outTime}</td>
                <td className="py-3 px-4 font-mono text-xs font-semibold text-[var(--text)]">{d.duration}</td>
                <td className="py-3 px-4">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                    d.status === 'Present' ? 'bg-emerald-100 text-emerald-700' :
                    d.status === 'WFH' ? 'bg-sky-100 text-sky-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {d.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-[#0E1730] text-white text-xs font-semibold rounded-xl shadow-2xl z-50 animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
};

export default MyAttendancePage;
