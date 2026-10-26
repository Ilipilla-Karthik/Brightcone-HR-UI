import React, { useState, useEffect } from 'react';

interface EmployeeShift {
  name: string;
  dept: string;
  mon: string;
  tue: string;
  wed: string;
  thu: string;
  fri: string;
  sat: string;
}

export const ShiftRosterPage: React.FC = () => {
  const [roster, setRoster] = useState<EmployeeShift[]>([]);
  const [week] = useState('Oct 26 - Nov 01, 2026');

  useEffect(() => {
    fetch('/api/v1/roster')
      .then((res) => (res.ok ? res.json() : []))
      .then((data: any) => {
        const list = Array.isArray(data) ? data : data?.value || [];
        const shiftMap = (code: string) => {
          if (code === 'MORN') return 'Morning';
          if (code === 'EVE') return 'Evening';
          return 'General';
        };
        const mapped: EmployeeShift[] = list.map((r: any) => ({
          name: r.employeeName || r.employee_name || 'Staff Member',
          dept: 'Engineering',
          mon: shiftMap(r.shiftCode || r.shift_code),
          tue: shiftMap(r.shiftCode || r.shift_code),
          wed: shiftMap(r.shiftCode || r.shift_code),
          thu: shiftMap(r.shiftCode || r.shift_code),
          fri: shiftMap(r.shiftCode || r.shift_code),
          sat: 'Off',
        }));
        setRoster(mapped);
      })
      .catch(() => setRoster([]));
  }, []);

  const shiftBadge = (shift: string) => {
    if (shift === 'Off') return <span className="text-[10px] text-[var(--muted)]">Off</span>;
    if (shift === 'Morning') return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 dark:bg-amber-950 text-amber-700">06:00 - 14:00</span>;
    if (shift === 'Evening') return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-50 dark:bg-purple-950 text-[#7C5CFF]">14:00 - 22:00</span>;
    return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 dark:bg-blue-950 text-[#0B6FDB]">09:30 - 18:30</span>;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--line)]">
        <div>
          <h1 className="text-2xl font-bold font-['Sora'] tracking-tight text-[var(--text)]">Weekly Shift Roster</h1>
          <p className="text-sm text-[var(--muted)] mt-1">Shift rotations, weekly rosters, and off-day scheduling.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[var(--surface-2)] border border-[var(--line)]">
            {week}
          </span>
        </div>
      </div>

      {/* Shift Legend */}
      <div className="flex flex-wrap gap-4 p-4 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-2xs text-xs">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#0B6FDB]" />
          <span><b>General Shift:</b> 09:30 AM - 06:30 PM</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#E07A1D]" />
          <span><b>Morning Shift:</b> 06:00 AM - 02:00 PM</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#7C5CFF]" />
          <span><b>Evening Shift:</b> 02:00 PM - 10:00 PM</span>
        </div>
      </div>

      {/* Roster Table */}
      <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-2xs overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--surface-2)] border-b border-[var(--line)] text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Staff Member</th>
              <th className="py-3 px-3">Mon</th>
              <th className="py-3 px-3">Tue</th>
              <th className="py-3 px-3">Wed</th>
              <th className="py-3 px-3">Thu</th>
              <th className="py-3 px-3">Fri</th>
              <th className="py-3 px-3">Sat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]">
            {roster.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-sm text-[var(--muted)]">No weekly shift roster published for this cycle.</td>
              </tr>
            ) : (
              roster.map((r) => (
                <tr key={r.name} className="hover:bg-[var(--surface-2)]/50 transition-colors">
                  <td className="py-3 px-4">
                    <b className="block text-xs font-semibold text-[var(--text)]">{r.name}</b>
                    <span className="block text-[11px] text-[var(--muted)]">{r.dept}</span>
                  </td>
                  <td className="py-3 px-3">{shiftBadge(r.mon)}</td>
                  <td className="py-3 px-3">{shiftBadge(r.tue)}</td>
                  <td className="py-3 px-3">{shiftBadge(r.wed)}</td>
                  <td className="py-3 px-3">{shiftBadge(r.thu)}</td>
                  <td className="py-3 px-3">{shiftBadge(r.fri)}</td>
                  <td className="py-3 px-3">{shiftBadge(r.sat)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShiftRosterPage;
