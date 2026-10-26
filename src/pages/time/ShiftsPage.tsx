import React, { useState, useEffect } from 'react';
import { ic } from '../../components/icons';

interface ShiftItem {
  id: string;
  name: string;
  code: string;
  startTime: string;
  endTime: string;
  breakMins: number;
  graceMins: number;
  isOvernight: boolean;
  isActive: boolean;
}

export const ShiftsPage: React.FC = () => {
  const [shifts, setShifts] = useState<ShiftItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', code: '', startTime: '09:00', endTime: '18:00', breakMins: 60 });
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  useEffect(() => {
    fetch('/api/v1/shifts')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.value || [];
        const mapped = list.map((d: any) => ({
          id: d.shiftId || d.shift_id || String(d.id),
          name: d.name,
          code: d.code,
          startTime: d.startTime || d.start_time || '09:00',
          endTime: d.endTime || d.end_time || '18:00',
          breakMins: d.breakDurationMinutes || d.break_duration_minutes || 60,
          graceMins: d.gracePeriodMinutes || d.grace_period_minutes || 15,
          isOvernight: d.isOvernight || d.is_overnight || false,
          isActive: d.isActive ?? d.is_active ?? true,
        }));
        setShifts(mapped);
      })
      .catch(() => setShifts([]));
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.code) return;
    const item: ShiftItem = {
      id: `S${shifts.length + 1}`,
      name: form.name,
      code: form.code.toUpperCase(),
      startTime: form.startTime,
      endTime: form.endTime,
      breakMins: Number(form.breakMins),
      graceMins: 15,
      isOvernight: false,
      isActive: true,
    };
    setShifts([...shifts, item]);
    setIsModalOpen(false);
    showToast(`Shift ${item.code} created and active`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-['Sora']">Attendance & Shift Timings</h1>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">● Backend Linked</span>
          </div>
          <p className="text-sm text-slate-500 mt-1">Configure organizational shifts, working hours, break intervals, and grace periods</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <span className="w-4 h-4">{ic('plus', 16)}</span> Add Shift Timing
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {shifts.map((s) => (
          <div key={s.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3 hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 font-mono">
                {s.code}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${s.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                {s.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-sm font-['Sora']">{s.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5 font-mono">
                {s.startTime} – {s.endTime} {s.isOvernight && '(Next Day)'}
              </p>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-lg text-xs grid grid-cols-2 gap-2 text-slate-600">
              <div>Break Duration: <span className="font-semibold text-slate-800">{s.breakMins} mins</span></div>
              <div>Grace Period: <span className="font-semibold text-slate-800">{s.graceMins} mins</span></div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400">Total: 9 Hours</span>
              <button onClick={() => showToast(`Opening roster assignments for ${s.code}`)} className="text-blue-600 font-medium hover:underline">
                View Roster →
              </button>
            </div>
          </div>
        ))}
        {shifts.length === 0 && (
          <div className="md:col-span-2 p-12 text-center text-sm text-[var(--muted)] rounded-2xl bg-[var(--surface)] border border-[var(--line)]">
            No shift timings configured in database. Click "Add Shift Timing" to create one.
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <form onSubmit={handleAdd} className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm font-['Sora']">Create Shift Timing</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Shift Name</label>
                <input required type="text" placeholder="e.g. Afternoon Shift" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800" />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Shift Code</label>
                <input required type="text" placeholder="e.g. AFT" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono text-slate-800" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Time</label>
                  <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800" />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">End Time</label>
                  <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800" />
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
              <button type="submit" className="px-4 py-2 text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-lg shadow-sm">Save Shift</button>
            </div>
          </form>
        </div>
      )}

      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-medium shadow-xl flex items-center gap-2 animate-fade-in">
          <span className="w-4 h-4 text-emerald-400">{ic('check', 16)}</span>
          {toastMsg}
        </div>
      )}
    </div>
  );
};

export default ShiftsPage;
