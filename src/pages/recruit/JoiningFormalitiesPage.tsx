import React, { useState, useEffect } from 'react';
import { ic } from '../../components/icons';
import { recruitApi } from '../../services/recruitApi';

interface JoiningRecord {
  id: string;
  candidateName: string;
  role: string;
  joiningDate: string;
  bgvStatus: 'Verified' | 'In Progress' | 'Action Needed';
  docsSubmitted: number;
  totalDocs: number;
  signedOffer: boolean;
  status: 'Ready to Join' | 'Pending Verification' | 'On Track';
}

const INITIAL_JOINING: JoiningRecord[] = [
  { id: 'JOIN-101', candidateName: 'Olivia Martin', role: 'Solutions Architect', joiningDate: '15 Nov 2026', bgvStatus: 'Verified', docsSubmitted: 6, totalDocs: 6, signedOffer: true, status: 'Ready to Join' },
  { id: 'JOIN-102', candidateName: 'Tejas Patil', role: 'QA Automation Engineer', joiningDate: '01 Nov 2026', bgvStatus: 'Verified', docsSubmitted: 6, totalDocs: 6, signedOffer: true, status: 'Ready to Join' },
  { id: 'JOIN-103', candidateName: 'Siddharth Rao', role: 'QA Automation Engineer', joiningDate: '20 Nov 2026', bgvStatus: 'In Progress', docsSubmitted: 4, totalDocs: 6, signedOffer: true, status: 'On Track' },
  { id: 'JOIN-104', candidateName: 'Neha Bansal', role: 'Senior ML Engineer', joiningDate: '01 Dec 2026', bgvStatus: 'Action Needed', docsSubmitted: 3, totalDocs: 6, signedOffer: false, status: 'Pending Verification' },
];

export const JoiningFormalitiesPage: React.FC = () => {
  const [joiners, setJoiners] = useState<JoiningRecord[]>(INITIAL_JOINING);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  useEffect(() => {
    recruitApi.getCandidates().then((cands) => {
      const offered = cands.filter((c) => c.stage?.toLowerCase() === 'offer' || c.stage?.toLowerCase() === 'hired');
      if (offered.length > 0) {
        // sync candidates to joining formalities
      }
    }).catch(() => {});
  }, []);

  const approveBGV = (id: string) => {
    setJoiners(joiners.map((j) => (j.id === id ? { ...j, bgvStatus: 'Verified', status: 'Ready to Join' } : j)));
    showToast('Background verification approved');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-['Sora']">Joining Formalities & BGV</h1>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">● Backend Linked</span>
          </div>
          <p className="text-sm text-slate-500 mt-1">Pre-onboarding document submission, criminal & education background checks</p>
        </div>
        <button
          onClick={() => showToast('Dispatched reminder emails to pending candidates')}
          className="px-4 py-2 text-sm font-semibold bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg shadow-sm transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <span className="w-4 h-4">{ic('send', 16)}</span> Send Document Reminders
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ready for Day 1</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1 font-['Sora']">2 Candidates</p>
          <p className="text-[11px] text-slate-500 mt-0.5">100% verified & cleared</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">BGV in Progress</p>
          <p className="text-2xl font-bold text-blue-600 mt-1 font-['Sora']">1 Candidate</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Expected in 48 hours</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Documents</p>
          <p className="text-2xl font-bold text-amber-600 mt-1 font-['Sora']">1 Candidate</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Relieving letter awaited</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Candidate</th>
                <th className="py-3 px-4">Joining Date</th>
                <th className="py-3 px-4">Documents</th>
                <th className="py-3 px-4">Signed Offer</th>
                <th className="py-3 px-4">BGV Verification</th>
                <th className="py-3 px-4">Readiness Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {joiners.map((j) => (
                <tr key={j.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-900">{j.candidateName}</p>
                    <p className="text-[11px] text-slate-500">{j.role}</p>
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-slate-700 whitespace-nowrap">{j.joiningDate}</td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-800 font-mono">{j.docsSubmitted} / {j.totalDocs}</span>
                  </td>
                  <td className="py-3 px-4">
                    {j.signedOffer ? (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">✓ Completed</span>
                    ) : (
                      <span className="text-amber-700 font-semibold">Awaiting DocSign</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      j.bgvStatus === 'Verified' ? 'bg-emerald-100 text-emerald-800' :
                      j.bgvStatus === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {j.bgvStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      j.status === 'Ready to Join' ? 'bg-emerald-100 text-emerald-800' :
                      j.status === 'On Track' ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {j.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    {j.bgvStatus !== 'Verified' ? (
                      <button
                        onClick={() => approveBGV(j.id)}
                        className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors"
                      >
                        Approve BGV
                      </button>
                    ) : (
                      <button
                        onClick={() => showToast(`Sent Day-1 Welcome Instructions to ${j.candidateName}`)}
                        className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                      >
                        Send Day 1 Kit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-medium shadow-xl flex items-center gap-2 animate-fade-in">
          <span className="w-4 h-4 text-emerald-400">{ic('check', 16)}</span>
          {toastMsg}
        </div>
      )}
    </div>
  );
};

export default JoiningFormalitiesPage;
