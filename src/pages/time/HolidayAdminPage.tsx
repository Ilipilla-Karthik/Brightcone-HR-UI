import React, { useState } from 'react';

interface HolidayItem {
  id: string;
  name: string;
  date: string;
  day: string;
  type: 'National Holiday' | 'Gazetted' | 'Restricted';
  notes?: string;
}

const HOLIDAYS_2026: HolidayItem[] = [
  { id: 'hol-1', name: 'New Year’s Day', date: '2026-01-01', day: 'Thursday', type: 'Gazetted' },
  { id: 'hol-2', name: 'Republic Day', date: '2026-01-26', day: 'Monday', type: 'National Holiday', notes: 'National holiday across all offices' },
  { id: 'hol-3', name: 'Maha Shivaratri', date: '2026-02-17', day: 'Tuesday', type: 'Restricted' },
  { id: 'hol-4', name: 'Holi', date: '2026-03-04', day: 'Wednesday', type: 'Gazetted' },
  { id: 'hol-5', name: 'Good Friday', date: '2026-04-03', day: 'Friday', type: 'Gazetted' },
  { id: 'hol-6', name: 'Eid al-Fitr', date: '2026-03-21', day: 'Saturday', type: 'Gazetted' },
  { id: 'hol-7', name: 'Independence Day', date: '2026-08-15', day: 'Saturday', type: 'National Holiday' },
  { id: 'hol-8', name: 'Gandhi Jayanti', date: '2026-10-02', day: 'Friday', type: 'National Holiday' },
  { id: 'hol-9', name: 'Diwali (Deepavali)', date: '2026-11-08', day: 'Sunday', type: 'National Holiday' },
  { id: 'hol-10', name: 'Christmas Day', date: '2026-12-25', day: 'Friday', type: 'Gazetted' },
];

export const HolidayAdminPage: React.FC = () => {
  const [holidays] = useState<HolidayItem[]>(HOLIDAYS_2026);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--line)]">
        <div>
          <h1 className="text-2xl font-bold font-['Sora'] tracking-tight text-[var(--text)]">Official Holiday Calendar 2026</h1>
          <p className="text-sm text-[var(--muted)] mt-1">Declared national, gazetted, and optional holidays for Brightcone Technologies.</p>
        </div>
        <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[var(--surface-2)] border border-[var(--line)]">
          10 Company Holidays
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
            {holidays.map((h) => (
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HolidayAdminPage;
