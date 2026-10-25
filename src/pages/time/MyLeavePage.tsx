import React, { useState } from 'react';
import { ic } from '../../components/icons';

interface LeaveRequestItem {
  id: string;
  type: 'Casual Leave' | 'Sick Leave' | 'Privilege Leave' | 'Comp-Off';
  from: string;
  to: string;
  days: number;
  reason: string;
  status: 'Approved' | 'Pending Review' | 'Rejected';
}

const DEFAULT_LEAVES: LeaveRequestItem[] = [
  { id: 'lv-1', type: 'Casual Leave', from: '2026-11-02', to: '2026-11-03', days: 2, reason: 'Personal family occasion', status: 'Pending Review' },
  { id: 'lv-2', type: 'Sick Leave', from: '2026-09-14', to: '2026-09-14', days: 1, reason: 'Viral fever / doctor consultation', status: 'Approved' },
  { id: 'lv-3', type: 'Privilege Leave', from: '2026-07-20', to: '2026-07-24', days: 5, reason: 'Annual vacation', status: 'Approved' },
];

export const MyLeavePage: React.FC = () => {
  const [requests, setRequests] = useState<LeaveRequestItem[]>(DEFAULT_LEAVES);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [form, setForm] = useState({ type: 'Casual Leave' as const, from: '', to: '', reason: '' });

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.from || !form.to) return;
    const req: LeaveRequestItem = {
      id: `lv-${Date.now()}`,
      type: form.type,
      from: form.from,
      to: form.to,
      days: 1,
      reason: form.reason || 'Leave request',
      status: 'Pending Review',
    };
    setRequests([req, ...requests]);
    setIsApplyOpen(false);
    setForm({ type: 'Casual Leave', from: '', to: '', reason: '' });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--line)]">
        <div>
          <h1 className="text-2xl font-bold font-['Sora'] tracking-tight text-[var(--text)]">Leave & Time Off</h1>
          <p className="text-sm text-[var(--muted)] mt-1">Available leave balances, paid time-off applications, and approval records.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsApplyOpen(true)}
          className="btn primary text-xs font-semibold px-4 py-2 flex items-center gap-1.5 rounded-xl text-white shadow-sm"
          style={{ background: '#3B82C4' }}
        >
          {ic('plus', 14)} Apply for Leave
        </button>
      </div>

      {/* Balances Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-2xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-[var(--muted)]">Casual Leave (CL)</span>
            <span className="text-xs font-bold text-[#0B6FDB]">4 Left</span>
          </div>
          <p className="font-['Sora'] text-3xl font-bold text-[var(--text)] mt-2">4 <span className="text-sm font-normal text-[var(--muted)]">/ 12 days</span></p>
          <div className="h-2 rounded-full bg-[var(--surface-2)] overflow-hidden mt-3">
            <div className="h-full bg-[#0B6FDB]" style={{ width: '33%' }} />
          </div>
          <span className="text-[11px] text-[var(--muted)] block mt-2">Valid till 31 Dec 2026</span>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-2xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-[var(--muted)]">Sick Leave (SL)</span>
            <span className="text-xs font-bold text-[#15A36B]">7 Left</span>
          </div>
          <p className="font-['Sora'] text-3xl font-bold text-[var(--text)] mt-2">7 <span className="text-sm font-normal text-[var(--muted)]">/ 10 days</span></p>
          <div className="h-2 rounded-full bg-[var(--surface-2)] overflow-hidden mt-3">
            <div className="h-full bg-[#15A36B]" style={{ width: '70%' }} />
          </div>
          <span className="text-[11px] text-[var(--muted)] block mt-2">Requires medical certificate for &gt;2 days</span>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-2xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-[var(--muted)]">Privilege Leave (PL)</span>
            <span className="text-xs font-bold text-[#7C5CFF]">15 Left</span>
          </div>
          <p className="font-['Sora'] text-3xl font-bold text-[var(--text)] mt-2">15 <span className="text-sm font-normal text-[var(--muted)]">/ 18 days</span></p>
          <div className="h-2 rounded-full bg-[var(--surface-2)] overflow-hidden mt-3">
            <div className="h-full bg-[#7C5CFF]" style={{ width: '83%' }} />
          </div>
          <span className="text-[11px] text-[var(--muted)] block mt-2">Carryover permitted up to 30 days</span>
        </div>
      </div>

      {/* Leave History Table */}
      <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-[var(--line)]">
          <h3 className="font-['Sora'] text-sm font-bold text-[var(--text)]">Leave Requests History</h3>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--surface-2)] border-b border-[var(--line)] text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Leave Category</th>
              <th className="py-3 px-4">Duration Period</th>
              <th className="py-3 px-4">Days</th>
              <th className="py-3 px-4">Reason</th>
              <th className="py-3 px-4 text-right">Approval Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]">
            {requests.map((r) => (
              <tr key={r.id} className="hover:bg-[var(--surface-2)]/50 transition-colors">
                <td className="py-3 px-4 font-semibold text-xs text-[var(--text)]">{r.type}</td>
                <td className="py-3 px-4 text-xs font-mono text-[var(--muted)]">{r.from} → {r.to}</td>
                <td className="py-3 px-4 text-xs font-mono font-semibold">{r.days} Days</td>
                <td className="py-3 px-4 text-xs text-[var(--text)]">{r.reason}</td>
                <td className="py-3 px-4 text-right">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                    r.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Apply Modal */}
      {isApplyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <form onSubmit={handleApply} className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-['Sora'] text-lg font-bold text-[var(--text)]">Apply for Leave</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-[var(--text)] mb-1">Leave Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })} className="w-full px-3 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] text-[var(--text)] focus:outline-none">
                  <option value="Casual Leave">Casual Leave (4 balance)</option>
                  <option value="Sick Leave">Sick Leave (7 balance)</option>
                  <option value="Privilege Leave">Privilege Leave (15 balance)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[var(--text)] mb-1">From Date</label>
                  <input required type="date" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] text-[var(--text)] focus:outline-none" />
                </div>
                <div>
                  <label className="block font-medium text-[var(--text)] mb-1">To Date</label>
                  <input required type="date" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] text-[var(--text)] focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block font-medium text-[var(--text)] mb-1">Reason for Leave</label>
                <textarea required rows={3} placeholder="Please detail the reason for your time off..." value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] text-[var(--text)] focus:outline-none" />
              </div>
            </div>
            <div className="pt-2 flex justify-end gap-2 border-t border-[var(--line)]">
              <button type="button" onClick={() => setIsApplyOpen(false)} className="btn text-xs font-semibold px-4 py-2 border border-[var(--line)] rounded-xl hover:bg-[var(--surface-2)]">Cancel</button>
              <button type="submit" className="btn primary text-xs font-semibold px-4 py-2 rounded-xl text-white shadow-sm" style={{ background: '#3B82C4' }}>Submit Application</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MyLeavePage;
