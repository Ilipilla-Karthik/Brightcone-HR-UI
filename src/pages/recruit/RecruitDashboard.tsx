import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Mail,
  X,
} from 'lucide-react';
import { api } from '../../services/api';

interface CandidateItem {
  id: string | number;
  candidate_code: string;
  full_name: string;
  email: string;
  phone: string;
  source: string;
  job_title: string;
  match_score: number;
  stage: 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Hired' | 'Rejected';
}

const DEFAULT_CANDIDATES: CandidateItem[] = [
  { id: 1, candidate_code: 'C1', full_name: 'Aditi Sharma', email: 'aditi.sharma.cand@example.com', phone: '+91 98765 43210', source: 'LinkedIn', job_title: 'Senior ML Engineer', match_score: 82, stage: 'Applied' },
  { id: 2, candidate_code: 'C2', full_name: 'Rohan Gupta', email: 'rohan.gupta.cand@example.com', phone: '+91 98765 43210', source: 'Careers page', job_title: 'Senior ML Engineer', match_score: 74, stage: 'Applied' },
  { id: 3, candidate_code: 'C3', full_name: 'Kavya Pillai', email: 'kavya.pillai.cand@example.com', phone: '+91 98765 43210', source: 'Referral', job_title: 'Product Designer', match_score: 88, stage: 'Screening' },
  { id: 4, candidate_code: 'C4', full_name: 'Marcus Lee', email: 'marcus.lee.cand@example.com', phone: '+91 98765 43210', source: 'Indeed', job_title: 'Solutions Architect', match_score: 79, stage: 'Screening' },
  { id: 5, candidate_code: 'C5', full_name: 'Neha Bansal', email: 'neha.bansal.cand@example.com', phone: '+91 98765 43210', source: 'LinkedIn', job_title: 'Senior ML Engineer', match_score: 91, stage: 'Interview' },
  { id: 6, candidate_code: 'C6', full_name: 'Siddharth Rao', email: 'siddharth.rao.cand@example.com', phone: '+91 98765 43210', source: 'Referral', job_title: 'QA Automation Engineer', match_score: 84, stage: 'Interview' },
  { id: 7, candidate_code: 'C7', full_name: 'Olivia Martin', email: 'olivia.martin.cand@example.com', phone: '+91 98765 43210', source: 'LinkedIn', job_title: 'Solutions Architect', match_score: 93, stage: 'Offer' },
  { id: 8, candidate_code: 'C8', full_name: 'Tejas Patil', email: 'tejas.patil.cand@example.com', phone: '+91 98765 43210', source: 'Careers page', job_title: 'QA Automation Engineer', match_score: 87, stage: 'Hired' },
];

export const RecruitDashboard: React.FC = () => {
  const [candidates, setCandidates] = useState<CandidateItem[]>(DEFAULT_CANDIDATES);
  const [search, setSearch] = useState('');
  const [selectedStage, setSelectedStage] = useState('All');
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateItem | null>(null);
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobDept, setNewJobDept] = useState('Engineering');

  useEffect(() => {
    let active = true;
    api.get('/candidates')
      .then((res) => {
        if (active && res.data && Array.isArray(res.data) && res.data.length > 0) {
          setCandidates(res.data);
        }
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  const stages = ['All', 'Applied', 'Screening', 'Interview', 'Offer', 'Hired'];

  const filtered = candidates.filter((c) => {
    const matchesSearch =
      c.full_name.toLowerCase().includes(search.toLowerCase()) ||
      c.job_title.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchesStage = selectedStage === 'All' || c.stage === selectedStage;
    return matchesSearch && matchesStage;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--surface)] p-6 rounded-2xl border border-[var(--line)] shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--brand)]">
            <span className="w-2 h-2 rounded-full bg-[var(--brand)] animate-pulse" />
            Talent Acquisition Engine
          </div>
          <h1 className="text-2xl font-bold text-[var(--text)] mt-1">Recruit & ATS Pipeline</h1>
          <p className="text-sm text-[var(--muted)] mt-0.5">
            Monitor applicant stages, candidate scoring, interviews, and offer tracking.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPostJobOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[var(--brand)] text-white text-sm font-semibold rounded-xl hover:opacity-90 transition shadow-sm"
          >
            <Plus size={16} /> Post Opening
          </button>
        </div>
      </div>

      {/* Pipeline Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--line)]">
          <span className="text-xs text-[var(--muted)] font-medium">Total Candidates</span>
          <p className="text-2xl font-bold text-[var(--text)] mt-1">{candidates.length}</p>
        </div>
        <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--line)]">
          <span className="text-xs text-[var(--muted)] font-medium">In Interview</span>
          <p className="text-2xl font-bold text-[var(--info)] mt-1">
            {candidates.filter((c) => c.stage === 'Interview').length}
          </p>
        </div>
        <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--line)]">
          <span className="text-xs text-[var(--muted)] font-medium">Offers Out</span>
          <p className="text-2xl font-bold text-[var(--warn)] mt-1">
            {candidates.filter((c) => c.stage === 'Offer').length}
          </p>
        </div>
        <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--line)]">
          <span className="text-xs text-[var(--muted)] font-medium">Hired This Quarter</span>
          <p className="text-2xl font-bold text-[var(--ok)] mt-1">
            {candidates.filter((c) => c.stage === 'Hired').length}
          </p>
        </div>
      </div>

      {/* Stage Filters and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-[var(--surface)] p-1 rounded-xl border border-[var(--line)] overflow-x-auto w-full sm:w-auto">
          {stages.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStage(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedStage === st
                  ? 'bg-[var(--brand)] text-white shadow-sm'
                  : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]'
              }`}
            >
              {st} ({st === 'All' ? candidates.length : candidates.filter((c) => c.stage === st).length})
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--faint)]" size={16} />
          <input
            type="text"
            placeholder="Search candidates or roles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[var(--surface)] border border-[var(--line)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
          />
        </div>
      </div>

      {/* Candidates Table */}
      <div className="bg-[var(--surface)] rounded-2xl border border-[var(--line)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-[var(--line)] bg-[var(--surface-2)] text-[var(--muted)] font-semibold text-xs uppercase tracking-wider">
                <th className="py-3 px-4">Candidate</th>
                <th className="py-3 px-4">Target Job</th>
                <th className="py-3 px-4">Match Score</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Stage</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => setSelectedCandidate(c)}
                  className="hover:bg-[var(--surface-2)]/60 cursor-pointer transition"
                >
                  <td className="py-3.5 px-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                      {c.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--text)]">{c.full_name}</p>
                      <p className="text-xs text-[var(--muted)] flex items-center gap-1">
                        <Mail size={12} /> {c.email}
                      </p>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-[var(--text)] font-medium">{c.job_title}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-[var(--surface-2)] h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            c.match_score >= 85
                              ? 'bg-emerald-500'
                              : c.match_score >= 75
                              ? 'bg-blue-500'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${c.match_score}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-[var(--text)]">{c.match_score}%</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-[var(--muted)]">{c.source}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        c.stage === 'Hired'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : c.stage === 'Offer'
                          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                          : c.stage === 'Interview'
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                      }`}
                    >
                      {c.stage}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCandidate(c);
                      }}
                      className="text-xs text-[var(--brand)] font-semibold hover:underline"
                    >
                      Scorecard
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Candidate Scorecard Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] w-full max-w-lg rounded-2xl border border-[var(--line)] shadow-xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <h2 className="text-lg font-bold text-[var(--text)]">Candidate Scorecard</h2>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="text-[var(--muted)] hover:text-[var(--text)] p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white font-bold text-lg flex items-center justify-center shadow-md">
                {selectedCandidate.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--text)]">{selectedCandidate.full_name}</h3>
                <p className="text-xs text-[var(--muted)] font-mono">
                  {selectedCandidate.candidate_code} • {selectedCandidate.job_title}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm bg-[var(--surface-2)] p-4 rounded-xl">
              <div>
                <span className="text-xs text-[var(--muted)]">ATS Match Rating</span>
                <p className="font-semibold text-emerald-600 mt-0.5">{selectedCandidate.match_score}% Strong Match</p>
              </div>
              <div>
                <span className="text-xs text-[var(--muted)]">Current Stage</span>
                <p className="font-medium text-[var(--text)] mt-0.5">{selectedCandidate.stage}</p>
              </div>
              <div>
                <span className="text-xs text-[var(--muted)]">Source Channel</span>
                <p className="font-medium text-[var(--text)] mt-0.5">{selectedCandidate.source}</p>
              </div>
              <div>
                <span className="text-xs text-[var(--muted)]">Candidate Email</span>
                <p className="font-medium text-[var(--text)] mt-0.5 truncate">{selectedCandidate.email}</p>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedCandidate(null)}
                className="px-4 py-2 bg-[var(--surface-2)] text-[var(--text)] text-sm font-semibold rounded-xl hover:bg-[var(--line)]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post Opening Modal */}
      {isPostJobOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsPostJobOpen(false);
              setNewJobTitle('');
            }}
            className="bg-[var(--surface)] w-full max-w-md rounded-2xl border border-[var(--line)] shadow-xl overflow-hidden p-6 space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[var(--line)]">
              <h2 className="text-lg font-bold text-[var(--text)]">Create Vacancy Opening</h2>
              <button
                type="button"
                onClick={() => setIsPostJobOpen(false)}
                className="text-[var(--muted)] hover:text-[var(--text)]"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-[var(--muted)] mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Rust Systems Architect"
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[var(--surface-2)] border border-[var(--line)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--muted)] mb-1">Department</label>
                <select
                  value={newJobDept}
                  onChange={(e) => setNewJobDept(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--surface-2)] border border-[var(--line)] rounded-xl text-sm"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Product">Product</option>
                  <option value="Design">Design</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-[var(--line)]">
              <button
                type="button"
                onClick={() => setIsPostJobOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-[var(--muted)] hover:bg-[var(--surface-2)] rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-semibold bg-[var(--brand)] text-white rounded-xl hover:opacity-95"
              >
                Publish Job
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default RecruitDashboard;
