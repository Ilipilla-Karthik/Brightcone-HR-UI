import React, { useState } from 'react';
import { ic } from '../../components/icons';

interface WFHRequest {
  id: string;
  employeeName: string;
  role: string;
  date: string;
  reason: string;
  status: 'Approved' | 'Pending' | 'Rejected';
}

const INITIAL_WFH: WFHRequest[] = [
  { id: 'WFH-101', employeeName: 'Karthik Reddy', role: 'Principal AI Engineer', date: 'Tomorrow, Oct 26', reason: 'Focus day for deep learning architecture benchmarks', status: 'Approved' },
  { id: 'WFH-102', employeeName: 'Priya Sharma', role: 'Senior Frontend Engineer', date: 'Oct 28, 2026', reason: 'Home broadband fiber maintenance', status: 'Approved' },
  { id: 'WFH-103', employeeName: 'Deepak S', role: 'DevOps Engineer', date: 'Oct 29, 2026', reason: 'On-call nocturnal release deployment shift', status: 'Pending' },
  { id: 'WFH-104', employeeName: 'Rohan Verma', role: 'Associate QA Engineer', date: 'Oct 30, 2026', reason: 'Personal errands', status: 'Pending' },
];

export const WorkFromHomePage: React.FC = () => {
  const [requests, setRequests] = useState<WFHRequest[]>(INITIAL_WFH);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ date: '', reason: '' });
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.date) return;
    const req: WFHRequest = {
      id: `WFH-${Math.floor(100 + Math.random() * 900)}`,
      employeeName: 'Karthik Reddy',
      role: 'Principal AI Engineer',
      date: form.date,
      reason: form.reason || 'Remote working from home',
      status: 'Approved',
    };
    setRequests([req, ...requests]);
    setIsModalOpen(false);
    setForm({ date: '', reason: '' });
    showToast('Work from Home request submitted & auto-approved');
  };

  const handleAction = (id: string, newStatus: 'Approved' | 'Rejected') => {
    setRequests(requests.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
    showToast(`Request marked as ${newStatus}`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-['Sora']">Work From Home (WFH)</h1>
          <p className="text-sm text-slate-500 mt-1">Manage remote working requests, approvals, and monthly allowances</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <span className="w-4 h-4">{ic('plus', 16)}</span> Apply for WFH
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">WFH Allowed / Month</p>
          <p className="text-2xl font-bold text-slate-900 mt-1 font-['Sora']">8 Days</p>
          <p className="text-[11px] text-blue-600 mt-0.5">Flexible hybrid policy</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Days Utilized This Month</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1 font-['Sora']">3 Days</p>
          <p className="text-[11px] text-slate-500 mt-0.5">5 days remaining</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Team Requests</p>
          <p className="text-2xl font-bold text-amber-600 mt-1 font-['Sora']">2 Requests</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Awaiting team lead approval</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">WFH Date</th>
                <th className="py-3 px-4">Reason / Notes</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {requests.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-900">{r.employeeName}</p>
                    <p className="text-[11px] text-slate-500">{r.role}</p>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-700">{r.date}</td>
                  <td className="py-3 px-4 text-slate-600 max-w-sm truncate">{r.reason}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      r.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                      r.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap space-x-1.5">
                    {r.status === 'Pending' ? (
                      <>
                        <button onClick={() => handleAction(r.id, 'Approved')} className="px-2 py-1 bg-emerald-600 text-white hover:bg-emerald-700 rounded text-[11px] font-semibold">
                          Approve
                        </button>
                        <button onClick={() => handleAction(r.id, 'Rejected')} className="px-2 py-1 text-rose-600 hover:bg-rose-50 rounded text-[11px]">
                          Decline
                        </button>
                      </>
                    ) : (
                      <span className="text-[11px] text-slate-400">Processed</span>
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
          <form onSubmit={handleApply} className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm font-['Sora']">Apply for Work From Home</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Date</label>
                <input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800" />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason / Task Plan</label>
                <textarea rows={3} placeholder="Describe tasks you will work on remotely" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800" />
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
              <button type="submit" className="px-4 py-2 text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-lg shadow-sm">Submit Request</button>
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

export default WorkFromHomePage;
