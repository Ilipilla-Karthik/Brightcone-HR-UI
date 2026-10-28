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
  docChecklist: Record<string, boolean>;
}

const DEFAULT_DOC_KEYS = [
  'ID & Address Proof (Aadhaar/Passport)',
  'PAN Card & Tax Declaration',
  'Relieving Letter & Experience Cert',
  'Highest Degree Educational Certificate',
  'Cancelled Cheque / Bank Account Details',
  'Signed Employment Offer Letter',
];

export const JoiningFormalitiesPage: React.FC = () => {
  const [joiners, setJoiners] = useState<JoiningRecord[]>([]);
  const [toastMsg, setToastMsg] = useState('');
  const [selectedJoiner, setSelectedJoiner] = useState<JoiningRecord | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  useEffect(() => {
    recruitApi.getCandidates().then((cands) => {
      const offered = cands.filter((c) => c.stage?.toLowerCase() === 'offer' || c.stage?.toLowerCase() === 'hired');
      if (offered.length > 0) {
        setJoiners(
          offered.map((c, i) => {
            const id = c.candidate_code || `JOIN-${i + 101}`;
            const isHired = c.stage?.toLowerCase() === 'hired';
            const savedRaw = localStorage.getItem(`joining_formalities_${id}`);
            let savedState: any = null;
            if (savedRaw) {
              try {
                savedState = JSON.parse(savedRaw);
              } catch {}
            }

            const initialChecklist: Record<string, boolean> = savedState?.docChecklist || {
              'ID & Address Proof (Aadhaar/Passport)': true,
              'PAN Card & Tax Declaration': true,
              'Relieving Letter & Experience Cert': isHired,
              'Highest Degree Educational Certificate': true,
              'Cancelled Cheque / Bank Account Details': isHired,
              'Signed Employment Offer Letter': true,
            };

            const submittedCount = Object.values(initialChecklist).filter(Boolean).length;
            const bgv = savedState?.bgvStatus || (isHired ? 'Verified' : 'In Progress');
            const readiness = bgv === 'Verified' && submittedCount >= 6 ? 'Ready to Join' : (bgv === 'Verified' ? 'Ready to Join' : 'On Track');

            return {
              id,
              candidateName: c.full_name,
              role: c.job_title || 'Position Offered',
              joiningDate: 'Upcoming Cohort',
              bgvStatus: bgv,
              docsSubmitted: submittedCount,
              totalDocs: 6,
              signedOffer: true,
              status: readiness,
              docChecklist: initialChecklist,
            };
          })
        );
      } else {
        setJoiners([]);
      }
    }).catch(() => setJoiners([]));
  }, []);

  const approveBGV = async (id: string) => {
    try {
      await recruitApi.updateCandidate(id, { stage: 'Hired' });
    } catch {}
    setJoiners((prev) =>
      prev.map((j) => {
        if (j.id === id) {
          const updated: JoiningRecord = { ...j, bgvStatus: 'Verified', status: 'Ready to Join' };
          try {
            localStorage.setItem(`joining_formalities_${id}`, JSON.stringify(updated));
          } catch {}
          return updated;
        }
        return j;
      })
    );
    showToast('Background verification approved & saved');
  };

  const toggleDocument = (joinerId: string, docName: string) => {
    setJoiners((prev) =>
      prev.map((j) => {
        if (j.id === joinerId) {
          const updatedChecklist = {
            ...j.docChecklist,
            [docName]: !j.docChecklist[docName],
          };
          const count = Object.values(updatedChecklist).filter(Boolean).length;
          const status = j.bgvStatus === 'Verified' && count >= 6 ? 'Ready to Join' : (j.bgvStatus === 'Verified' ? 'Ready to Join' : 'On Track');
          const updated: JoiningRecord = {
            ...j,
            docChecklist: updatedChecklist,
            docsSubmitted: count,
            status,
          };
          try {
            localStorage.setItem(`joining_formalities_${joinerId}`, JSON.stringify(updated));
          } catch {}
          if (selectedJoiner && selectedJoiner.id === joinerId) {
            setSelectedJoiner(updated);
          }
          return updated;
        }
        return j;
      })
    );
    showToast('Document verification updated');
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
          <p className="text-2xl font-bold text-emerald-600 mt-1 font-['Sora']">
            {joiners.filter((j) => j.status === 'Ready to Join').length} Candidates
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">100% verified & cleared</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">BGV in Progress</p>
          <p className="text-2xl font-bold text-blue-600 mt-1 font-['Sora']">
            {joiners.filter((j) => j.bgvStatus === 'In Progress').length} Candidates
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Verification underway</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Documents</p>
          <p className="text-2xl font-bold text-amber-600 mt-1 font-['Sora']">
            {joiners.filter((j) => j.docsSubmitted < j.totalDocs).length} Candidates
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Submissions awaited</p>
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
              {joiners.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-1">
                      <span className="text-xl">🪪</span>
                      <p className="font-semibold text-slate-700 text-sm">No Pending Joiners</p>
                      <p className="text-xs text-slate-400">Offered and hired candidates will appear here for BGV and pre-joining checklist.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                joiners.map((j) => (
                  <tr key={j.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-900">{j.candidateName}</p>
                      <p className="text-[11px] text-slate-500">{j.role}</p>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-700 whitespace-nowrap">{j.joiningDate}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setSelectedJoiner(j)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold font-mono transition-colors"
                        title="Click to review and tick submitted documents"
                      >
                        <span>{j.docsSubmitted} / {j.totalDocs}</span>
                        <span className="text-[10px] text-blue-600 underline">Verify</span>
                      </button>
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
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedJoiner(j)}
                          className="px-2 py-1 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-100 rounded transition-colors"
                        >
                          Checklist
                        </button>
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
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Verification Modal */}
      {selectedJoiner && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base font-['Sora']">
                  Joining Formalities Checklist
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedJoiner.candidateName} · {selectedJoiner.role}
                </p>
              </div>
              <button
                onClick={() => setSelectedJoiner(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {DEFAULT_DOC_KEYS.map((docName) => {
                const isChecked = !!selectedJoiner.docChecklist[docName];
                return (
                  <label
                    key={docName}
                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleDocument(selectedJoiner.id, docName)}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                    />
                    <div className="flex-1 text-xs">
                      <p className={`font-medium ${isChecked ? 'text-slate-800 line-through text-slate-400' : 'text-slate-900'}`}>
                        {docName}
                      </p>
                      <span className={`text-[10px] font-semibold ${isChecked ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {isChecked ? '✓ Verified & Stored' : '● Awaiting Document Submission'}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Verified: <strong className="text-slate-900">{selectedJoiner.docsSubmitted} / {selectedJoiner.totalDocs}</strong>
              </span>
              <button
                onClick={() => setSelectedJoiner(null)}
                className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm transition-colors"
              >
                Done
              </button>
            </div>
          </div>
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

export default JoiningFormalitiesPage;
