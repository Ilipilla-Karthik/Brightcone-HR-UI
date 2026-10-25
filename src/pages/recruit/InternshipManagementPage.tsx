import React, { useState } from 'react';
import { ic } from '../../components/icons';

interface Intern {
  id: string;
  name: string;
  college: string;
  track: string;
  mentor: string;
  stipend: string;
  duration: string;
  performanceScore: number;
  ppoStatus: 'Eligible for PPO' | 'PPO Extended' | 'Under Review' | 'Completed';
}

const INITIAL_INTERNS: Intern[] = [
  { id: 'INT-01', name: 'Rohan Sharma', college: 'IIT Hyderabad', track: 'AI Research (LLMs)', mentor: 'Karthik Reddy', stipend: '₹45,000 / mo', duration: 'Jul - Dec 2026', performanceScore: 4.8, ppoStatus: 'PPO Extended' },
  { id: 'INT-02', name: 'Sneha Kulkarni', college: 'BITS Pilani', track: 'Distributed Systems', mentor: 'Vikram Malhotra', stipend: '₹40,000 / mo', duration: 'Aug - Jan 2027', performanceScore: 4.6, ppoStatus: 'Eligible for PPO' },
  { id: 'INT-03', name: 'Varun Nair', college: 'NIT Warangal', track: 'Frontend UI/UX', mentor: 'Priya Sharma', stipend: '₹35,000 / mo', duration: 'Jul - Dec 2026', performanceScore: 4.2, ppoStatus: 'Under Review' },
  { id: 'INT-04', name: 'Ananya Deshmukh', college: 'IIIT Hyderabad', track: 'Data Engineering', mentor: 'Rahul Varma', stipend: '₹40,000 / mo', duration: 'Aug - Jan 2027', performanceScore: 4.5, ppoStatus: 'Eligible for PPO' },
];

export const InternshipManagementPage: React.FC = () => {
  const [interns, setInterns] = useState<Intern[]>(INITIAL_INTERNS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const [form, setForm] = useState({
    name: '',
    college: '',
    track: 'AI Research (LLMs)',
    mentor: 'Karthik Reddy',
    stipend: '₹40,000 / mo',
    duration: '6 Months',
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.college) return;
    const intern: Intern = {
      id: `INT-0${interns.length + 1}`,
      name: form.name,
      college: form.college,
      track: form.track,
      mentor: form.mentor,
      stipend: form.stipend,
      duration: form.duration,
      performanceScore: 4.0,
      ppoStatus: 'Under Review',
    };
    setInterns([...interns, intern]);
    setIsModalOpen(false);
    showToast(`Added intern ${form.name} to Winter 2026 cohort`);
  };

  const extendPPO = (id: string) => {
    setInterns(interns.map((i) => (i.id === id ? { ...i, ppoStatus: 'PPO Extended' } : i)));
    showToast('Pre-Placement Offer (PPO) extended to candidate');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-['Sora']">Internship & Campus Cohort</h1>
          <p className="text-sm text-slate-500 mt-1">Campus recruiting, intern performance evaluations, and Pre-Placement Offers (PPOs)</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <span className="w-4 h-4">{ic('plus', 16)}</span> Enroll Intern
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Cohort Size</p>
          <p className="text-2xl font-bold text-slate-900 mt-1 font-['Sora']">{interns.length} Interns</p>
          <p className="text-[11px] text-blue-600 mt-0.5">Top tier campuses</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">PPO Conversion Rate</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1 font-['Sora']">75%</p>
          <p className="text-[11px] text-slate-500 mt-0.5">3 PPO eligible</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Performance Score</p>
          <p className="text-2xl font-bold text-slate-900 mt-1 font-['Sora']">4.5 / 5.0</p>
          <p className="text-[11px] text-emerald-600 mt-0.5">Exceeding expectations</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cohort Duration</p>
          <p className="text-2xl font-bold text-purple-600 mt-1 font-['Sora']">6 Months</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Ending Dec 2026</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Intern Name</th>
                <th className="py-3 px-4">Campus / University</th>
                <th className="py-3 px-4">Specialization Track</th>
                <th className="py-3 px-4">Assigned Mentor</th>
                <th className="py-3 px-4">Monthly Stipend</th>
                <th className="py-3 px-4">PPO Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {interns.map((i) => (
                <tr key={i.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">{i.name}</td>
                  <td className="py-3 px-4 text-slate-600 font-medium">{i.college}</td>
                  <td className="py-3 px-4 text-slate-800">{i.track}</td>
                  <td className="py-3 px-4 text-slate-600 font-medium">{i.mentor}</td>
                  <td className="py-3 px-4 font-mono font-medium text-slate-700">{i.stipend}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      i.ppoStatus === 'PPO Extended' ? 'bg-emerald-100 text-emerald-800' :
                      i.ppoStatus === 'Eligible for PPO' ? 'bg-purple-100 text-purple-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {i.ppoStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    {i.ppoStatus === 'Eligible for PPO' ? (
                      <button
                        onClick={() => extendPPO(i.id)}
                        className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors"
                      >
                        Extend PPO ★
                      </button>
                    ) : (
                      <button
                        onClick={() => showToast(`Evaluated project work for ${i.name}`)}
                        className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                      >
                        Score Project
                      </button>
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
          <form onSubmit={handleAdd} className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm font-['Sora']">Enroll Campus Intern</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Intern Name</label>
                <input required type="text" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800" />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">University / Institute</label>
                <input required type="text" placeholder="e.g. IIT Hyderabad" value={form.college} onChange={(e) => setForm({ ...form, college: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800" />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mentor</label>
                <input type="text" value={form.mentor} onChange={(e) => setForm({ ...form, mentor: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800" />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Monthly Stipend</label>
                <input type="text" value={form.stipend} onChange={(e) => setForm({ ...form, stipend: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800" />
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
              <button type="submit" className="px-4 py-2 text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-lg shadow-sm">Enroll Intern</button>
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

export default InternshipManagementPage;
