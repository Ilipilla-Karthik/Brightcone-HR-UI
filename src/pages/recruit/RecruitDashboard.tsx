import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Plus,
  ArrowRight,
  Briefcase,
  Users,
  Calendar,
  Send,
  CheckCircle2,
  Download,
} from 'lucide-react';
import { api } from '../../services/api';
import { CandidateItem, PostJobModal, CandidateDetailModal } from './RecruitModals';

const INITIAL_CANDIDATES: CandidateItem[] = [
  { id: 1, candidate_code: 'C-101', full_name: 'Aditi Sharma', email: 'aditi.sharma.cand@example.com', phone: '+91 98765 43210', source: 'LinkedIn', job_title: 'Staff ML Engineer', match_score: 94, stage: 'Applied' },
  { id: 2, candidate_code: 'C-102', full_name: 'Rohan Gupta', email: 'rohan.gupta.cand@example.com', phone: '+91 98765 43211', source: 'Careers page', job_title: 'Senior Rust Systems Architect', match_score: 88, stage: 'Applied' },
  { id: 3, candidate_code: 'C-103', full_name: 'Kavya Pillai', email: 'kavya.pillai.cand@example.com', phone: '+91 98765 43212', source: 'Referral', job_title: 'Principal Product Designer', match_score: 92, stage: 'Screening' },
  { id: 4, candidate_code: 'C-104', full_name: 'Marcus Lee', email: 'marcus.lee.cand@example.com', phone: '+91 98765 43213', source: 'Indeed', job_title: 'Solutions Architect', match_score: 85, stage: 'Screening' },
  { id: 5, candidate_code: 'C-105', full_name: 'Neha Bansal', email: 'neha.bansal.cand@example.com', phone: '+91 98765 43214', source: 'LinkedIn', job_title: 'Staff ML Engineer', match_score: 96, stage: 'Interview' },
  { id: 6, candidate_code: 'C-106', full_name: 'Siddharth Rao', email: 'siddharth.rao.cand@example.com', phone: '+91 98765 43215', source: 'Referral', job_title: 'Senior Full-Stack Engineer', match_score: 89, stage: 'Interview' },
  { id: 7, candidate_code: 'C-107', full_name: 'Olivia Martin', email: 'olivia.martin.cand@example.com', phone: '+91 98765 43216', source: 'LinkedIn', job_title: 'Solutions Architect', match_score: 93, stage: 'Offer' },
  { id: 8, candidate_code: 'C-108', full_name: 'Tejas Patil', email: 'tejas.patil.cand@example.com', phone: '+91 98765 43217', source: 'Careers page', job_title: 'QA Automation Lead', match_score: 90, stage: 'Hired' },
];

const INITIAL_JOBS = [
  { id: 'J-1', title: 'Senior Rust Systems Architect', dept: 'Engineering', location: 'Hyderabad (Hybrid)', type: 'Full-time', openings: 2, applicants: 18, status: 'Active' },
  { id: 'J-2', title: 'Staff ML Engineer', dept: 'AI Research', location: 'Bangalore (Hybrid)', type: 'Full-time', openings: 1, applicants: 24, status: 'Active' },
  { id: 'J-3', title: 'Principal Product Designer', dept: 'Design', location: 'Remote', type: 'Full-time', openings: 1, applicants: 14, status: 'Active' },
  { id: 'J-4', title: 'Solutions Architect', dept: 'Solutions', location: 'Hyderabad (On-site)', type: 'Full-time', openings: 3, applicants: 9, status: 'Active' },
];

const INITIAL_INTERVIEWS = [
  { id: 'INT-1', candidate: 'Neha Bansal', role: 'Staff ML Engineer', interviewer: 'Ananya Rao & Naresh V.', round: 'System Architecture (Round 2)', date: 'Today, 3:30 PM', mode: 'Google Meet', status: 'Scheduled' },
  { id: 'INT-2', candidate: 'Siddharth Rao', role: 'Senior Full-Stack Engineer', interviewer: 'Rahul Varma', round: 'Live Coding Assessment', date: 'Tomorrow, 11:00 AM', mode: 'Google Meet', status: 'Scheduled' },
  { id: 'INT-3', candidate: 'Marcus Lee', role: 'Solutions Architect', interviewer: 'Vikram Mehta', round: 'Technical Leadership', date: 'Yesterday', mode: 'In-person Room 3B', status: 'Recommended Hire' },
];

const INITIAL_OFFERS = [
  { id: 'OFF-101', candidate: 'Olivia Martin', role: 'Solutions Architect', ctc: '₹34,00,000', joining: '15 Nov 2026', validTill: '28 Oct 2026', status: 'Sent' },
  { id: 'OFF-100', candidate: 'Tejas Patil', role: 'QA Automation Lead', ctc: '₹26,00,000', joining: '01 Nov 2026', validTill: '20 Oct 2026', status: 'Accepted' },
];

const INITIAL_REFERRALS = [
  { id: 'REF-1', candidate: 'Kavya Pillai', role: 'Principal Product Designer', referrer: 'Rahul Varma', bonus: '₹50,000', status: 'Screening Passed' },
  { id: 'REF-2', candidate: 'Siddharth Rao', role: 'Senior Full-Stack Engineer', referrer: 'Aditi Sharma', bonus: '₹50,000', status: 'Interviewing' },
];

const STAGES = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired'] as const;

export const RecruitDashboard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'pipeline';

  const [candidates, setCandidates] = useState<CandidateItem[]>(INITIAL_CANDIDATES);
  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [interviews] = useState(INITIAL_INTERVIEWS);
  const [offers] = useState(INITIAL_OFFERS);
  const [referrals] = useState(INITIAL_REFERRALS);

  const [search, setSearch] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateItem | null>(null);
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);

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

  const setTab = (tab: string) => {
    setSearchParams({ tab });
  };

  const handleAdvanceStage = (c: CandidateItem) => {
    const idx = STAGES.indexOf(c.stage as any);
    if (idx >= 0 && idx < STAGES.length - 1) {
      const nextStage = STAGES[idx + 1];
      setCandidates((prev) =>
        prev.map((item) => (item.id === c.id ? { ...item, stage: nextStage } : item))
      );
    }
  };

  const filteredCandidates = candidates.filter(
    (c) =>
      c.full_name.toLowerCase().includes(search.toLowerCase()) ||
      c.job_title.toLowerCase().includes(search.toLowerCase()) ||
      c.candidate_code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--surface)] p-6 rounded-2xl border border-[var(--line)] shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--brand)]">
            <span className="w-2 h-2 rounded-full bg-[var(--brand)] animate-pulse" />
            Recruitment & ATS Module
          </div>
          <h1 className="text-2xl font-bold text-[var(--text)] mt-1">Talent Acquisition Hub</h1>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            Full applicant pipeline, candidate scoring, interviews, and offer tracking.
          </p>
        </div>
        <button
          onClick={() => setIsPostJobOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--brand)] text-white text-xs font-semibold rounded-xl hover:opacity-90 shadow-sm"
        >
          <Plus size={15} /> Post Job Opening
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--line)] pb-3 overflow-x-auto text-xs font-semibold">
        {[
          { key: 'pipeline', label: 'Pipeline Funnel', icon: <Briefcase size={14} />, count: candidates.length },
          { key: 'candidates', label: 'Candidate Tracker', icon: <Users size={14} />, count: candidates.length },
          { key: 'jobs', label: 'Active Jobs', icon: <Briefcase size={14} />, count: jobs.length },
          { key: 'interviews', label: 'Interviews', icon: <Calendar size={14} />, count: interviews.length },
          { key: 'offers', label: 'Offer Letters', icon: <Send size={14} />, count: offers.length },
          { key: 'referrals', label: 'Referrals', icon: <CheckCircle2 size={14} />, count: referrals.length },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
              currentTab === t.key
                ? 'bg-[var(--surface-2)] text-[var(--brand)] shadow-xs'
                : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]/50'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-[var(--line)] text-[var(--text)]">
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Tab 1: Pipeline Funnel */}
      {currentTab === 'pipeline' && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
          {STAGES.map((stg) => {
            const list = candidates.filter((c) => c.stage === stg);
            return (
              <div key={stg} className="bg-[var(--surface)] p-3.5 rounded-2xl border border-[var(--line)] flex flex-col space-y-3">
                <div className="flex items-center justify-between border-b border-[var(--line)] pb-2">
                  <span className="text-xs font-bold text-[var(--text)]">{stg}</span>
                  <span className="w-5 h-5 rounded-full bg-[var(--surface-2)] text-[var(--text)] text-[10px] font-bold flex items-center justify-center">
                    {list.length}
                  </span>
                </div>
                <div className="space-y-2.5 flex-1">
                  {list.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => setSelectedCandidate(c)}
                      className="p-3 bg-[var(--surface-2)] rounded-xl border border-[var(--line)] hover:border-[var(--brand)] cursor-pointer transition shadow-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[var(--muted)]">{c.candidate_code}</span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
                          {c.match_score}%
                        </span>
                      </div>
                      <p className="text-xs font-bold text-[var(--text)] leading-tight">{c.full_name}</p>
                      <p className="text-[11px] text-[var(--muted)] truncate">{c.job_title}</p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAdvanceStage(c);
                        }}
                        className="w-full mt-1 py-1 text-[10px] font-semibold text-[var(--brand)] bg-[var(--surface)] border border-[var(--line)] rounded-lg hover:bg-[var(--brand)] hover:text-white transition flex items-center justify-center gap-1"
                      >
                        Advance <ArrowRight size={10} />
                      </button>
                    </div>
                  ))}
                  {list.length === 0 && (
                    <p className="text-[11px] text-[var(--muted)] text-center py-6">No candidates in {stg}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Candidate Tracker */}
      {currentTab === 'candidates' && (
        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--line)] overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[var(--line)] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--faint)]" size={14} />
              <input
                type="text"
                placeholder="Search candidates by name, role or code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-[var(--surface-2)] border border-[var(--line)] rounded-xl text-xs focus:outline-none"
              />
            </div>
            <span className="text-xs text-[var(--muted)]">Showing {filteredCandidates.length} candidate profiles</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--surface-2)] border-b border-[var(--line)] text-[var(--muted)] uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Target Role</th>
                  <th className="py-3 px-4">ATS Match</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {filteredCandidates.map((c) => (
                  <tr key={c.id} className="hover:bg-[var(--surface-2)]/50">
                    <td className="py-3 px-4">
                      <p className="font-bold text-[var(--text)]">{c.full_name}</p>
                      <p className="text-[11px] text-[var(--muted)]">{c.candidate_code} • {c.email}</p>
                    </td>
                    <td className="py-3 px-4 text-[var(--text)]">{c.job_title}</td>
                    <td className="py-3 px-4 font-bold text-emerald-600">{c.match_score}%</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                        {c.stage}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[var(--muted)]">{c.source}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedCandidate(c)}
                        className="px-2.5 py-1 text-xs font-semibold bg-[var(--surface-2)] hover:bg-[var(--line)] rounded-lg text-[var(--text)] transition"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Active Jobs */}
      {currentTab === 'jobs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((j) => (
            <div key={j.id} className="bg-[var(--surface)] p-5 rounded-2xl border border-[var(--line)] shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    {j.status}
                  </span>
                  <h3 className="text-sm font-bold text-[var(--text)] mt-1.5">{j.title}</h3>
                  <p className="text-xs text-[var(--muted)]">{j.dept} • {j.location}</p>
                </div>
                <span className="text-xs font-mono font-semibold text-[var(--muted)]">{j.id}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[var(--line)] text-xs">
                <span className="text-[var(--muted)]">{j.applicants} Applicants</span>
                <span className="font-semibold text-[var(--brand)]">{j.openings} Openings</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Interview Schedule */}
      {currentTab === 'interviews' && (
        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--line)] divide-y divide-[var(--line)]">
          {interviews.map((intv) => (
            <div key={intv.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[var(--text)]">{intv.candidate}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300">
                    {intv.status}
                  </span>
                </div>
                <p className="text-[var(--muted)]">{intv.role} • {intv.round}</p>
                <p className="text-[11px] font-mono text-[var(--brand)]">{intv.date} ({intv.mode})</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-[var(--muted)]">Interviewers</p>
                <p className="font-semibold text-[var(--text)]">{intv.interviewer}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 5: Offer Letters */}
      {currentTab === 'offers' && (
        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--line)] divide-y divide-[var(--line)]">
          {offers.map((off) => (
            <div key={off.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <p className="font-bold text-sm text-[var(--text)]">{off.candidate}</p>
                <p className="text-[var(--muted)]">{off.role} • Approved CTC: <b className="text-[var(--text)]">{off.ctc}</b></p>
                <p className="text-[11px] text-[var(--muted)] mt-0.5">Joining Date: {off.joining} • Valid Till: {off.validTill}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  {off.status}
                </span>
                <button
                  type="button"
                  onClick={() => alert(`Downloading signed offer letter for ${off.candidate}`)}
                  className="p-1.5 bg-[var(--surface-2)] text-[var(--text)] rounded-lg hover:bg-[var(--line)]"
                  title="Download Offer"
                >
                  <Download size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 6: Referrals */}
      {currentTab === 'referrals' && (
        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--line)] divide-y divide-[var(--line)]">
          {referrals.map((ref) => (
            <div key={ref.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <p className="font-bold text-sm text-[var(--text)]">{ref.candidate}</p>
                <p className="text-[var(--muted)]">{ref.role} • Referred by: <b>{ref.referrer}</b></p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-emerald-600 font-mono text-sm">{ref.bonus} Bonus</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  {ref.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <PostJobModal
        isOpen={isPostJobOpen}
        onClose={() => setIsPostJobOpen(false)}
        onSave={(newJ) => {
          setJobs([{ id: `J-${jobs.length + 1}`, applicants: 0, status: 'Active', type: 'Full-time', ...newJ }, ...jobs]);
        }}
      />

      <CandidateDetailModal
        candidate={selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        onAdvanceStage={handleAdvanceStage}
      />
    </div>
  );
};

export default RecruitDashboard;
