import React, { useState } from 'react';
import { ic } from '../../components/icons';

interface SwapRequest {
  id: string;
  requester: string;
  peer: string;
  myDate: string;
  myShift: string;
  peerDate: string;
  peerShift: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Declined';
}

export const ShiftSwapPage: React.FC = () => {
  const [swaps, setSwaps] = useState<SwapRequest[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ peer: 'Deepak S', myDate: '', peerDate: '', reason: '' });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.myDate || !form.peerDate) return;
    const item: SwapRequest = {
      id: `sw-${Date.now()}`,
      requester: 'Rahul Varma',
      peer: form.peer,
      myDate: form.myDate,
      myShift: 'General (09:30-18:30)',
      peerDate: form.peerDate,
      peerShift: 'Morning (06:00-14:00)',
      reason: form.reason || 'Shift adjustment',
      status: 'Pending',
    };
    setSwaps([item, ...swaps]);
    setIsModalOpen(false);
    setForm({ peer: 'Deepak S', myDate: '', peerDate: '', reason: '' });
  };

  const handleAction = (id: string, newStatus: 'Approved' | 'Declined') => {
    setSwaps(swaps.map((s) => (s.id === id ? { ...s, status: newStatus } : s)));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--line)]">
        <div>
          <h1 className="text-2xl font-bold font-['Sora'] tracking-tight text-[var(--text)]">Shift Swap Requests</h1>
          <p className="text-sm text-[var(--muted)] mt-1">Peer-to-peer roster shift exchange requests and management approvals.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="btn primary text-xs font-semibold px-4 py-2 flex items-center gap-1.5 rounded-xl text-white shadow-sm"
          style={{ background: '#3B82C4' }}
        >
          {ic('swap', 14)} Request Shift Swap
        </button>
      </div>

      {/* Swaps Table */}
      <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-2xs overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--surface-2)] border-b border-[var(--line)] text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Requester</th>
              <th className="py-3 px-4">Offered Shift</th>
              <th className="py-3 px-4">Colleague</th>
              <th className="py-3 px-4">Requested Shift</th>
              <th className="py-3 px-4">Reason</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]">
            {swaps.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-sm text-[var(--muted)]">No shift swap requests found. Click "Request Shift Swap" to submit one.</td>
              </tr>
            ) : (
              swaps.map((s) => (
                <tr key={s.id} className="hover:bg-[var(--surface-2)]/50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-xs text-[var(--text)]">{s.requester}</td>
                  <td className="py-3 px-4 text-xs font-mono">{s.myDate}<br /><span className="text-[11px] text-[var(--muted)]">{s.myShift}</span></td>
                  <td className="py-3 px-4 font-semibold text-xs text-[var(--text)]">{s.peer}</td>
                  <td className="py-3 px-4 text-xs font-mono">{s.peerDate}<br /><span className="text-[11px] text-[var(--muted)]">{s.peerShift}</span></td>
                  <td className="py-3 px-4 text-xs text-[var(--muted)]">{s.reason}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      s.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                      s.status === 'Declined' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {s.status === 'Pending' ? (
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleAction(s.id, 'Approved')}
                          className="text-xs px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 font-semibold"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAction(s.id, 'Declined')}
                          className="text-xs px-2.5 py-1 rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 font-semibold"
                        >
                          Decline
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-[var(--muted)] font-medium">Completed</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <form onSubmit={handleCreate} className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-['Sora'] text-lg font-bold text-[var(--text)]">Request Shift Swap</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-[var(--text)] mb-1">Swap With Colleague</label>
                <select value={form.peer} onChange={(e) => setForm({ ...form, peer: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] text-[var(--text)] focus:outline-none">
                  <option value="Deepak S">Deepak S (Engineering)</option>
                  <option value="Priya Sharma">Priya Sharma (Engineering)</option>
                  <option value="Rohan Verma">Rohan Verma (Engineering)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[var(--text)] mb-1">My Shift Date</label>
                  <input required type="date" value={form.myDate} onChange={(e) => setForm({ ...form, myDate: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] text-[var(--text)] focus:outline-none" />
                </div>
                <div>
                  <label className="block font-medium text-[var(--text)] mb-1">Target Shift Date</label>
                  <input required type="date" value={form.peerDate} onChange={(e) => setForm({ ...form, peerDate: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] text-[var(--text)] focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block font-medium text-[var(--text)] mb-1">Reason for Swap</label>
                <textarea required rows={3} placeholder="Please detail why you wish to exchange shifts..." value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] text-[var(--text)] focus:outline-none" />
              </div>
            </div>
            <div className="pt-2 flex justify-end gap-2 border-t border-[var(--line)]">
              <button type="button" onClick={() => setIsModalOpen(false)} className="btn text-xs font-semibold px-4 py-2 border border-[var(--line)] rounded-xl hover:bg-[var(--surface-2)]">Cancel</button>
              <button type="submit" className="btn primary text-xs font-semibold px-4 py-2 rounded-xl text-white shadow-sm" style={{ background: '#3B82C4' }}>Send Swap Request</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ShiftSwapPage;
