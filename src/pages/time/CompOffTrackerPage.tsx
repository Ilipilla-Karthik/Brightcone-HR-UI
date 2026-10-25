import React, { useState } from 'react';
import { ic } from '../../components/icons';

interface CompOffRecord {
  id: string;
  employeeName: string;
  role: string;
  workedDate: string;
  hoursEarned: string;
  validUntil: string;
  status: 'Credited' | 'Availed' | 'Expired';
}

const INITIAL_COMPOFF: CompOffRecord[] = [
  { id: 'CO-501', employeeName: 'Deepak S', role: 'DevOps Engineer', workedDate: 'Sunday, Oct 18', hoursEarned: '1 Day (8h)', validUntil: '18 Jan 2027', status: 'Credited' },
  { id: 'CO-502', employeeName: 'Rahul Varma', role: 'Backend Engineer', workedDate: 'Saturday, Oct 17', hoursEarned: '1 Day (8h)', validUntil: '17 Jan 2027', status: 'Credited' },
  { id: 'CO-503', employeeName: 'Karthik Reddy', role: 'Principal AI Engineer', workedDate: 'Gandhi Jayanti, Oct 02', hoursEarned: '1 Day (8h)', validUntil: '02 Jan 2027', status: 'Availed' },
  { id: 'CO-504', employeeName: 'Rohan Verma', role: 'Associate QA Engineer', workedDate: 'Sunday, Sep 20', hoursEarned: '0.5 Day (4h)', validUntil: '20 Dec 2026', status: 'Credited' },
];

export const CompOffTrackerPage: React.FC = () => {
  const [records, setRecords] = useState<CompOffRecord[]>(INITIAL_COMPOFF);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ employeeName: '', workedDate: '', hours: '1 Day (8h)' });
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleCredit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.employeeName) return;
    const item: CompOffRecord = {
      id: `CO-${Math.floor(500 + Math.random() * 500)}`,
      employeeName: form.employeeName,
      role: 'Software Engineer',
      workedDate: form.workedDate || 'Weekend shift',
      hoursEarned: form.hours,
      validUntil: '90 Days from work date',
      status: 'Credited',
    };
    setRecords([item, ...records]);
    setIsModalOpen(false);
    showToast(`Compensatory Off credited to ${form.employeeName}`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-['Sora']">Comp-Off Tracker</h1>
          <p className="text-sm text-slate-500 mt-1">Track compensatory leave earned from weekend or holiday deployment work</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <span className="w-4 h-4">{ic('plus', 16)}</span> Credit Comp-Off
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Comp-Offs Credited</p>
          <p className="text-2xl font-bold text-slate-900 mt-1 font-['Sora']">3.5 Days</p>
          <p className="text-[11px] text-emerald-600 mt-0.5">Active valid balance</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Availed This Quarter</p>
          <p className="text-2xl font-bold text-blue-600 mt-1 font-['Sora']">1.0 Day</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Utilized as leave</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Validity Policy</p>
          <p className="text-2xl font-bold text-purple-600 mt-1 font-['Sora']">90 Days</p>
          <p className="text-[11px] text-slate-500 mt-0.5">From date of weekend work</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Weekend / Holiday Worked</th>
                <th className="py-3 px-4">Comp-Off Earned</th>
                <th className="py-3 px-4">Valid Until</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-900">{r.employeeName}</p>
                    <p className="text-[11px] text-slate-500">{r.role}</p>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-slate-700">{r.workedDate}</td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{r.hoursEarned}</td>
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{r.validUntil}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      r.status === 'Credited' ? 'bg-emerald-100 text-emerald-800' :
                      r.status === 'Availed' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {r.status === 'Credited' ? (
                      <button
                        onClick={() => {
                          setRecords(records.map((rec) => (rec.id === r.id ? { ...rec, status: 'Availed' } : rec)));
                          showToast('Comp-Off marked as availed');
                        }}
                        className="px-2.5 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded font-medium"
                      >
                        Avail Comp-Off →
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400">Availed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <form onSubmit={handleCredit} className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm font-['Sora']">Credit Comp-Off</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Employee Name</label>
                <input required type="text" placeholder="e.g. Deepak S" value={form.employeeName} onChange={(e) => setForm({ ...form, employeeName: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800" />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date Worked</label>
                <input required type="text" placeholder="e.g. Sunday, Oct 25" value={form.workedDate} onChange={(e) => setForm({ ...form, workedDate: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800" />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Duration / Hours</label>
                <select value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800">
                  <option value="1 Day (8h)">Full Day (8 Hours)</option>
                  <option value="0.5 Day (4h)">Half Day (4 Hours)</option>
                </select>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
              <button type="submit" className="px-4 py-2 text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg shadow-sm">Credit Leave</button>
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

export default CompOffTrackerPage;
