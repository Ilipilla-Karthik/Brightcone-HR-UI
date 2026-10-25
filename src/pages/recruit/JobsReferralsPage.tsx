import React, { useState } from 'react';

interface ReferralOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  bonus: string;
  experience: string;
}

interface SubmittedReferral {
  id: string;
  candidateName: string;
  role: string;
  date: string;
  status: 'In Screening' | 'Technical Round' | 'Offer Accepted' | 'Bonus Disbursed';
  bonus: string;
}

const REFERRAL_OPENINGS: ReferralOpening[] = [
  { id: 'JOB-201', title: 'Staff Rust Systems Engineer', department: 'Engineering', location: 'Hyderabad (Hybrid)', bonus: '₹50,000', experience: '5-8 yrs' },
  { id: 'JOB-202', title: 'Senior Frontend Engineer (React/TypeScript)', department: 'Engineering', location: 'Hyderabad / Bengaluru', bonus: '₹40,000', experience: '4-7 yrs' },
  { id: 'JOB-203', title: 'Applied AI Research Scientist', department: 'AI Research', location: 'Hyderabad', bonus: '₹60,000', experience: '3-6 yrs' },
  { id: 'JOB-205', title: 'Technical Product Manager', department: 'Product', location: 'Bengaluru', bonus: '₹45,000', experience: '5-8 yrs' },
];

const DEFAULT_MY_REFERRALS: SubmittedReferral[] = [
  { id: 'ref-1', candidateName: 'Nikhil Verma', role: 'Senior Frontend Engineer', date: '2026-10-12', status: 'Technical Round', bonus: '₹40,000' },
  { id: 'ref-2', candidateName: 'Divya Sen', role: 'Applied AI Research Scientist', date: '2026-09-20', status: 'Offer Accepted', bonus: '₹60,000' },
];

export const JobsReferralsPage: React.FC = () => {
  const [openings] = useState<ReferralOpening[]>(REFERRAL_OPENINGS);
  const [myReferrals, setMyReferrals] = useState<SubmittedReferral[]>(DEFAULT_MY_REFERRALS);
  const [selectedJob, setSelectedJob] = useState<ReferralOpening | null>(null);
  const [form, setForm] = useState({ candidateName: '', email: '', phone: '', linkedin: '', notes: '' });

  const handleReferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.candidateName || !form.email || !selectedJob) return;
    const newRef: SubmittedReferral = {
      id: `ref-${Date.now()}`,
      candidateName: form.candidateName,
      role: selectedJob.title,
      date: new Date().toISOString().split('T')[0],
      status: 'In Screening',
      bonus: selectedJob.bonus,
    };
    setMyReferrals([newRef, ...myReferrals]);
    setSelectedJob(null);
    setForm({ candidateName: '', email: '', phone: '', linkedin: '', notes: '' });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--line)]">
        <div>
          <h1 className="text-2xl font-bold font-['Sora'] tracking-tight text-[var(--text)]">Employee Referral Program</h1>
          <p className="text-sm text-[var(--muted)] mt-1">Refer top talent to Brightcone and earn competitive referral bonuses upon hiring.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950 text-[#7C5CFF] border border-purple-200 dark:border-purple-800">
            Total Bonus Earned: ₹60,000
          </span>
        </div>
      </div>

      {/* Referral Openings Grid */}
      <div className="space-y-4">
        <h3 className="font-['Sora'] text-base font-bold text-[var(--text)]">Hot Positions with Referral Bonus</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {openings.map((job) => (
            <div key={job.id} className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-2xs space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <b className="block text-sm font-bold text-[var(--text)]">{job.title}</b>
                  <p className="text-xs text-[var(--muted)] mt-0.5">{job.department} · {job.location}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-200 dark:border-emerald-800 shrink-0">
                  {job.bonus} Bonus
                </span>
              </div>
              <div className="pt-2 border-t border-[var(--line)] flex items-center justify-between">
                <span className="text-xs text-[var(--muted)]">Experience: {job.experience}</span>
                <button
                  type="button"
                  onClick={() => setSelectedJob(job)}
                  className="btn primary text-xs font-semibold px-3.5 py-1.5 rounded-xl text-white shadow-xs"
                  style={{ background: '#7C5CFF' }}
                >
                  Refer Candidate
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My Submitted Referrals Table */}
      <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-[var(--line)]">
          <h3 className="font-['Sora'] text-sm font-bold text-[var(--text)]">My Submitted Referrals</h3>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--surface-2)] border-b border-[var(--line)] text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Candidate Name</th>
              <th className="py-3 px-4">Role Referred</th>
              <th className="py-3 px-4">Date Submitted</th>
              <th className="py-3 px-4">Potential Bonus</th>
              <th className="py-3 px-4 text-right">Hiring Stage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]">
            {myReferrals.map((r) => (
              <tr key={r.id} className="hover:bg-[var(--surface-2)]/50 transition-colors">
                <td className="py-3 px-4 font-semibold text-xs text-[var(--text)]">{r.candidateName}</td>
                <td className="py-3 px-4 text-xs text-[var(--muted)]">{r.role}</td>
                <td className="py-3 px-4 text-xs font-mono text-[var(--muted)]">{r.date}</td>
                <td className="py-3 px-4 text-xs font-mono font-bold text-emerald-600">{r.bonus}</td>
                <td className="py-3 px-4 text-right">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                    r.status === 'Offer Accepted' ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-100 text-[#7C5CFF]'
                  }`}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Refer Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <form onSubmit={handleReferSubmit} className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-['Sora'] text-lg font-bold text-[var(--text)]">Refer Candidate for {selectedJob.title}</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-[var(--text)] mb-1">Candidate Full Name</label>
                <input required type="text" placeholder="e.g. Shalini Roy" value={form.candidateName} onChange={(e) => setForm({ ...form, candidateName: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] text-[var(--text)] focus:outline-none" />
              </div>
              <div>
                <label className="block font-medium text-[var(--text)] mb-1">Candidate Email</label>
                <input required type="email" placeholder="shalini.roy@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] text-[var(--text)] focus:outline-none" />
              </div>
              <div>
                <label className="block font-medium text-[var(--text)] mb-1">LinkedIn Profile or Portfolio URL</label>
                <input type="url" placeholder="https://linkedin.com/in/..." value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] text-[var(--text)] focus:outline-none" />
              </div>
            </div>
            <div className="pt-2 flex justify-end gap-2 border-t border-[var(--line)]">
              <button type="button" onClick={() => setSelectedJob(null)} className="btn text-xs font-semibold px-4 py-2 border border-[var(--line)] rounded-xl hover:bg-[var(--surface-2)]">Cancel</button>
              <button type="submit" className="btn primary text-xs font-semibold px-4 py-2 rounded-xl text-white shadow-sm" style={{ background: '#7C5CFF' }}>Submit Referral</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default JobsReferralsPage;
