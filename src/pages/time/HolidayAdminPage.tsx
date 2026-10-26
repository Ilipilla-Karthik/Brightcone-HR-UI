import React, { useState, useEffect } from 'react';

interface HolidayItem {
  id: string;
  name: string;
  date: string;
  day: string;
  type: 'National Holiday' | 'Gazetted' | 'Restricted';
  notes?: string;
}

export const HolidayAdminPage: React.FC = () => {
  const [holidays, setHolidays] = useState<HolidayItem[]>([]);

  useEffect(() => {
    fetch('/api/v1/holidays')
      .then((res) => (res.ok ? res.json() : []))
      .then((data: any) => {
        const list = Array.isArray(data) ? data : data?.value || [];
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const mapped: HolidayItem[] = list.map((h: any, idx: number) => {
          const dt = h.holidayDate || h.holiday_date || '2026-01-01';
          const dayName = days[new Date(dt).getDay()] || 'Weekday';
          return {
            id: h.holidayId || h.holiday_id || `hol-${idx + 1}`,
            name: h.name,
            date: dt,
            day: dayName,
            type: h.isRecurring ? 'Gazetted' : 'National Holiday',
            notes: h.description || h.applicableLocation,
          };
        });
        setHolidays(mapped);
      })
      .catch(() => setHolidays([]));
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--line)]">
        <div>
          <h1 className="text-2xl font-bold font-['Sora'] tracking-tight text-[var(--text)]">Official Holiday Calendar 2026</h1>
          <p className="text-sm text-[var(--muted)] mt-1">Declared national, gazetted, and optional holidays for Brightcone Technologies.</p>
        </div>
        <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[var(--surface-2)] border border-[var(--line)]">
          {holidays.length} Company Holidays
        </span>
      </div>

      {/* Holidays Table */}
      <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-2xs overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--surface-2)] border-b border-[var(--line)] text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Holiday Occasion</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Day</th>
              <th className="py-3 px-4">Classification</th>
              <th className="py-3 px-4 text-right">Office Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]">
            {holidays.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-sm text-[var(--muted)]">No company holidays found in holiday calendar.</td>
              </tr>
            ) : (
              holidays.map((h) => (
                <tr key={h.id} className="hover:bg-[var(--surface-2)]/50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-xs text-[var(--text)]">{h.name}</td>
                  <td className="py-3 px-4 text-xs font-mono text-[var(--muted)]">{h.date}</td>
                  <td className="py-3 px-4 text-xs font-medium text-[var(--text)]">{h.day}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      h.type === 'National Holiday' ? 'bg-amber-100 text-amber-700' :
                      h.type === 'Gazetted' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-sky-100 text-sky-700'
                    }`}>
                      {h.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-xs font-semibold text-rose-600">Office Closed</span>
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

export default HolidayAdminPage;
