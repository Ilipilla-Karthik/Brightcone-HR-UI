import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Briefcase,
  Users,
  Calendar,
  Send,
  Plus,
  CheckCircle2,
  Download,
  Search,
  Check,
  Eye,
  Edit2,
  Trash2,
  X,
  FileText,
  LogIn,
} from 'lucide-react';
import { recruitmentApi } from '../api/recruitment';
import { employeesApi } from '../api/employees';
import { authApi } from '../api/auth';
import type { Candidate, Interview, Job, Offer, Employee } from '../types';

interface RequirementMeta {
  positions: number;
  experience?: string;
  budget_ctc?: string;
  reason: string;
  replacing?: string;
  hiring_manager: string;
  required_by: string;
  job_description?: string;
  archived?: boolean;
  history?: Array<{ status: string; timestamp: string; author: string }>;
  created_at_display?: string;
  updated_at_display?: string;
}

interface CandidateMeta {
  total_experience?: string;
  current_ctc?: string;
  expected_ctc?: string;
  notice_period?: string;
  current_location?: string;
  resume_name?: string;
  consent_to_store?: string;
  archived?: boolean;
  overdue?: boolean;
  history?: Array<{ status: string; timestamp: string; author: string }>;
}

interface InterviewMeta {
  time?: string;
  date?: string;
  mode?: string;
  venue_or_link?: string;
  rating?: number;
  result?: 'Pending' | 'Passed' | 'Strong Hire' | 'Needs review' | 'Failed';
  feedback?: string;
  archived?: boolean;
  history?: Array<{ status: string; timestamp: string; author: string }>;
}

interface OfferMeta {
  department?: string;
  offer_date?: string;
  valid_till?: string;
  approved_by?: string;
  file_name?: string;
  archived?: boolean;
}

export const RecruitmentPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentView = searchParams.get('view') || 'dashboard';
  const setCurrentView = (view: string) => setSearchParams({ view });

  // Primary Data
  const [jobs, setJobs] = useState<Job[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Metadata stores (parsed from db or local complements)
  const [candidateMetas, setCandidateMetas] = useState<Record<string, CandidateMeta>>({});
  const [interviewMetas, setInterviewMetas] = useState<Record<string, InterviewMeta>>({});
  const [offerMetas, setOfferMetas] = useState<Record<string, OfferMeta>>({});

  const currentUser = authApi.getCurrentUser();
  const isEmployee = currentUser?.role === 'EMPLOYEE' || currentUser?.email === 'rahul.varma@brightcone.ai';

  // Employee Referrals & Internal Applications (Screenshots 1, 2, 3)
  const [referrals, setReferrals] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('brightcone_my_referrals');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 1,
        candidate_name: 'Siddharth Rao',
        job_title: 'QA Automation Engineer',
        status: 'Interview',
        bonus_amount: 30000,
      },
    ];
  });
  const [referringJob, setReferringJob] = useState<Job | null>(null);
  const [applyingJob, setApplyingJob] = useState<Job | null>(null);

  const [referCandName, setReferCandName] = useState('');
  const [referEmail, setReferEmail] = useState('');
  const [referPhone, setReferPhone] = useState('');
  const [referFitNotes, setReferFitNotes] = useState('');

  // Slide-over Detail Drawer State (Screenshot 5)
  const [detailDrawerType, setDetailDrawerType] = useState<'requirement' | 'candidate' | 'interview' | 'offer' | null>(null);
  const [selectedRequirement, setSelectedRequirement] = useState<Job | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [editingInterviewId, setEditingInterviewId] = useState<string | null>(null);

  // Filters & Search
  const [jobSearch, setJobSearch] = useState('');
  const [jobStatusFilter, setJobStatusFilter] = useState('All');
  const [jobDeptFilter, setJobDeptFilter] = useState('All');
  const [jobShowArchived, setJobShowArchived] = useState(false);

  const [candidateSearch, setCandidateSearch] = useState('');
  const [candidateStageFilter, setCandidateStageFilter] = useState('All');
  const [candidateShowArchived, setCandidateShowArchived] = useState(false);

  const [intvSearch, setIntvSearch] = useState('');
  const [intvStatusFilter, setIntvStatusFilter] = useState('All');
  const [intvShowArchived, setIntvShowArchived] = useState(false);

  const [offerSearch, setOfferSearch] = useState('');
  const [offerStatusFilter, setOfferStatusFilter] = useState('All');
  const [offerShowArchived, setOfferShowArchived] = useState(false);

  // Modals state
  const [isAddReqModalOpen, setIsAddReqModalOpen] = useState(false);
  const [isEditReqModalOpen, setIsEditReqModalOpen] = useState(false);
  const [isAddCandModalOpen, setIsAddCandModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isAddOfferModalOpen, setIsAddOfferModalOpen] = useState(false);

  // Add / Edit Requirement Form State (Screenshot 2 & 4)
  const [reqDept, setReqDept] = useState('');
  const [reqDesignation, setReqDesignation] = useState('');
  const [reqPositions, setReqPositions] = useState('1');
  const [reqEmpType, setReqEmpType] = useState('');
  const [reqLocation, setReqLocation] = useState('');
  const [reqExperience, setReqExperience] = useState('');
  const [reqBudgetCtc, setReqBudgetCtc] = useState('');
  const [reqReason, setReqReason] = useState('');
  const [reqReplacing, setReqReplacing] = useState('');
  const [reqHiringManager, setReqHiringManager] = useState('');
  const [reqRequiredBy, setReqRequiredBy] = useState('');
  const [reqStatus, setReqStatus] = useState('');
  const [reqJobDesc, setReqJobDesc] = useState('');
  const [editingJobId, setEditingJobId] = useState<string | null>(null);

  // Add Candidate Form State (Screenshot 4)
  const [candName, setCandName] = useState('');
  const [candEmail, setCandEmail] = useState('');
  const [candPhone, setCandPhone] = useState('');
  const [candAppliedFor, setCandAppliedFor] = useState('');
  const [candSource, setCandSource] = useState('');
  const [candExp, setCandExp] = useState('');
  const [candCurrentCtc, setCandCurrentCtc] = useState('');
  const [candExpectedCtc, setCandExpectedCtc] = useState('');
  const [candNoticePeriod, setCandNoticePeriod] = useState('');
  const [candLocation, setCandLocation] = useState('');
  const [candResumeFile, setCandResumeFile] = useState<File | null>(null);
  const [candConsent, setCandConsent] = useState('');
  const [candStage, setCandStage] = useState('');

  // Add Interview Form State (Screenshot 1)
  const [intvCandName, setIntvCandName] = useState('');
  const [intvRole, setIntvRole] = useState('');
  const [intvRound, setIntvRound] = useState('');
  const [intvMode, setIntvMode] = useState('');
  const [intvDate, setIntvDate] = useState('');
  const [intvTime, setIntvTime] = useState('');
  const [intvInterviewer, setIntvInterviewer] = useState('');
  const [intvVenueLink, setIntvVenueLink] = useState('');
  const [intvRating, setIntvRating] = useState('5');
  const [intvResult, setIntvResult] = useState('');
  const [intvFeedback, setIntvFeedback] = useState('');
  const [intvStatus, setIntvStatus] = useState('Scheduled');

  // Add Offer Form State (Screenshot 3)
  const [offerCandName, setOfferCandName] = useState('');
  const [offerDesignation, setOfferDesignation] = useState('');
  const [offerDept, setOfferDept] = useState('');
  const [offerAnnualCtc, setOfferAnnualCtc] = useState('');
  const [offerJoiningDate, setOfferJoiningDate] = useState('');
  const [offerDate, setOfferDate] = useState('');
  const [offerValidTill, setOfferValidTill] = useState('');
  const [offerApprovedBy, setOfferApprovedBy] = useState('');
  const [offerFile, setOfferFile] = useState<File | null>(null);
  const [offerStatus, setOfferStatus] = useState('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Onboarding Checklist Mock State
  const [checklistTasks, setChecklistTasks] = useState([
    { id: 1, title: 'Send Welcome Email & Portal Credentials', category: 'HR Operations', done: true, assignee: 'Ananya Rao' },
    { id: 2, title: 'Verify Government ID, PAN & Aadhaar Documents', category: 'Compliance', done: true, assignee: 'Operations' },
    { id: 3, title: 'Provision MacBook Pro & Corporate Email Account', category: 'IT Assets', done: false, assignee: 'IT Helpdesk' },
    { id: 4, title: 'Sign Employment Agreement & Confidentiality NDA', category: 'Legal', done: false, assignee: 'Legal Team' },
    { id: 5, title: 'Schedule 1-on-1 Orientation with Hiring Manager', category: 'Team Prep', done: false, assignee: 'Hiring Manager' },
  ]);

  // Load candidate/interview/offer local metadata
  useEffect(() => {
    try {
      const storedCandMetas = localStorage.getItem('brightcone_candidate_metas');
      if (storedCandMetas) setCandidateMetas(JSON.parse(storedCandMetas));

      const storedIntvMetas = localStorage.getItem('brightcone_interview_metas');
      if (storedIntvMetas) setInterviewMetas(JSON.parse(storedIntvMetas));

      const storedOfferMetas = localStorage.getItem('brightcone_offer_metas');
      if (storedOfferMetas) setOfferMetas(JSON.parse(storedOfferMetas));
    } catch (e) {
      console.warn('Could not parse localStorage recruitment cache', e);
    }
  }, []);

  const saveCandidateMetas = (metas: Record<string, CandidateMeta>) => {
    setCandidateMetas(metas);
    try {
      localStorage.setItem('brightcone_candidate_metas', JSON.stringify(metas));
    } catch (e) {
      console.warn(e);
    }
  };

  const saveInterviewMetas = (metas: Record<string, InterviewMeta>) => {
    setInterviewMetas(metas);
    try {
      localStorage.setItem('brightcone_interview_metas', JSON.stringify(metas));
    } catch (e) {
      console.warn(e);
    }
  };

  const saveOfferMetas = (metas: Record<string, OfferMeta>) => {
    setOfferMetas(metas);
    try {
      localStorage.setItem('brightcone_offer_metas', JSON.stringify(metas));
    } catch (e) {
      console.warn(e);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchData = async () => {
    try {
      const [j, c, i, o, e] = await Promise.all([
        recruitmentApi.listJobs(),
        recruitmentApi.listCandidates(),
        recruitmentApi.listInterviews(),
        recruitmentApi.listOffers(),
        employeesApi.list(),
      ]);
      setJobs(j);
      setCandidates(c);
      setInterviews(i);
      setOffers(o);
      setEmployees(e);

      try {
        const refs = await recruitmentApi.listReferrals();
        if (refs && refs.length > 0) {
          setReferrals(refs);
        }
      } catch (err) {
        console.warn('Could not load referrals from backend', err);
      }

      if (c.length > 0 && !intvCandName) {
        setIntvCandName(c[0].full_name);
        setIntvRole(c[0].job_title || j[0]?.title || 'Senior Software Engineer');
      }
      if (j.length > 0 && !candAppliedFor) {
        setCandAppliedFor(j[0].title);
      }
    } catch (err) {
      console.error('Failed to load recruitment data', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Format date as "Feb 20, 2020" or "dd-mm-yyyy" (Screenshot 4)
  const formatDisplayDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // Helper to parse metadata from a job's description string
  const getRequirementMeta = (job: Job): RequirementMeta => {
    const nowStr = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).toLowerCase();
    if (job.description) {
      try {
        const parsed = JSON.parse(job.description);
        if (typeof parsed === 'object' && parsed !== null) {
          return {
            positions: parsed.positions ?? 2,
            experience: parsed.experience || '2',
            budget_ctc: parsed.budget_ctc || '120000',
            reason: parsed.reason || 'New position',
            replacing: parsed.replacing || '—',
            hiring_manager: parsed.hiring_manager || '—',
            required_by: parsed.required_by || '2020-02-20',
            job_description: parsed.job_description || '',
            archived: parsed.archived || false,
            history: parsed.history || [{ status: job.status || 'Pending', timestamp: nowStr, author: 'ananya.rao@brightcone.ai' }],
            created_at_display: parsed.created_at_display || nowStr,
            updated_at_display: parsed.updated_at_display || nowStr,
          };
        }
      } catch {
        // Plain text
      }
    }
    return {
      positions: 2,
      experience: '2',
      budget_ctc: '120000',
      reason: 'New position',
      replacing: '—',
      hiring_manager: '—',
      required_by: '2020-02-20',
      job_description: job.description || '',
      archived: job.status === 'Archived' || job.status === 'Closed',
      history: [{ status: job.status || 'Pending', timestamp: nowStr, author: 'ananya.rao@brightcone.ai' }],
      created_at_display: nowStr,
      updated_at_display: nowStr,
    };
  };

  // Check if a requirement is overdue (Screenshot 4)
  const isRequirementOverdue = (job: Job): boolean => {
    if (job.status?.toLowerCase() === 'overdue') return true;
    if (['closed', 'active', 'open', 'in progress', 'on hold', 'hired', 'approved'].includes(job.status?.toLowerCase())) {
      return false;
    }
    const meta = getRequirementMeta(job);
    if (!meta.required_by) return false;
    try {
      const reqDate = new Date(meta.required_by);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return reqDate < today;
    } catch {
      return false;
    }
  };

  // Convert to employee only for offer, offered, hired, selected
  const isEligibleForConversion = (stage?: string): boolean => {
    if (!stage) return false;
    const s = stage.trim().toLowerCase();
    return ['offer', 'offered', 'hired', 'selected'].includes(s);
  };

  // Check if a candidate is overdue (stage is Overdue, meta overdue is true, or associated manpower requirement is overdue)
  const isCandidateOverdue = (cand: Candidate): boolean => {
    if (cand.stage?.toLowerCase() === 'hired' || cand.stage?.toLowerCase() === 'rejected') return false;
    const meta = candidateMetas[cand.cand_id];
    if (meta?.overdue === true || cand.stage?.toLowerCase() === 'overdue') return true;
    if (meta?.overdue === false) return false;

    // Check if associated requirement is overdue
    if (cand.job_title) {
      const linkedJob = jobs.find(
        (j) => j.title.toLowerCase().trim() === cand.job_title?.toLowerCase().trim()
      );
      if (linkedJob && isRequirementOverdue(linkedJob)) return true;
    }
    if (cand.job_id) {
      const linkedJob = jobs.find((j) => j.job_id === cand.job_id);
      if (linkedJob && isRequirementOverdue(linkedJob)) return true;
    }

    return false;
  };

  const handleUpdateRequirementStatus = async (job: Job, newStatus: string) => {
    setIsSubmitting(true);
    try {
      const nowStr = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).toLowerCase();
      const meta = getRequirementMeta(job);
      const history = meta.history ? [...meta.history] : [];
      history.unshift({
        status: newStatus,
        timestamp: nowStr,
        author: currentUser?.email || 'ananya.rao@brightcone.ai',
      });

      const updatedMeta: RequirementMeta = {
        ...meta,
        history,
        updated_at_display: nowStr,
      };

      await recruitmentApi.updateJob(job.job_id, {
        status: newStatus,
        description: JSON.stringify(updatedMeta),
      });

      setJobs(prev => prev.map(j => j.job_id === job.job_id ? { ...j, status: newStatus, description: JSON.stringify(updatedMeta) } : j));
      if (selectedRequirement?.job_id === job.job_id) {
        setSelectedRequirement({ ...selectedRequirement, status: newStatus, description: JSON.stringify(updatedMeta) });
      }

      showToast(`Requirement status updated to "${newStatus}"!`);
      await fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to update requirement status');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCandidateStage = async (cand: Candidate, newStage: string) => {
    setIsSubmitting(true);
    try {
      const nowStr = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).toLowerCase();
      await recruitmentApi.updateCandidate(cand.cand_id, { stage: newStage });
      const isOverdue = newStage === 'Overdue';

      // If moved to Interview, auto-reflect in interview scheduling if not already there
      if (newStage.toLowerCase() === 'interview') {
        const existing = interviews.find(i => i.candidate_name?.toLowerCase() === cand.full_name?.toLowerCase());
        if (!existing) {
          try {
            await recruitmentApi.scheduleInterview({
              candidate_name: cand.full_name,
              job_title: cand.job_title || 'Open Requisition',
              round_name: 'Technical round 1',
              scheduled_at: new Date().toISOString().split('T')[0],
              panel: 'Ananya Rao',
              notes: JSON.stringify({
                date: new Date().toISOString().split('T')[0],
                time: '11:00 AM',
                mode: 'Video call',
                result: 'Pending',
                venue_or_link: 'Google Meet',
                history: [{ status: 'Scheduled', timestamp: nowStr, author: currentUser?.email || 'ananya.rao@brightcone.ai' }]
              })
            });
          } catch (e) {
            console.error('Auto interview creation error:', e);
          }
        }
      }

      // Append to history
      const prevHistory = candidateMetas[cand.cand_id]?.history || [
        { status: cand.stage || 'Applied', timestamp: '19 Oct 2026, 1:38 pm', author: 'ananya.rao@brightcone.ai' }
      ];
      const newHistory = [{ status: newStage, timestamp: nowStr, author: currentUser?.email || 'ananya.rao@brightcone.ai' }, ...prevHistory];

      const newMetas = {
        ...candidateMetas,
        [cand.cand_id]: {
          ...(candidateMetas[cand.cand_id] || {}),
          overdue: isOverdue,
          history: newHistory,
        },
      };
      saveCandidateMetas(newMetas);
      showToast(`Updated ${cand.full_name}'s status to ${newStage}!`);
      await fetchData();
      if (selectedCandidate?.cand_id === cand.cand_id) {
        setSelectedCandidate({ ...selectedCandidate, stage: newStage });
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update candidate status');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if an offer is overdue (Screenshot 2: "Overdue when the offer passes its valid-till date unanswered")
  const isOfferOverdue = (off: Offer): boolean => {
    if (off.status?.toLowerCase() === 'accepted' || off.status?.toLowerCase() === 'declined') return false;
    const meta = offerMetas[off.offer_id];
    const validTillStr = off.valid_till || meta?.valid_till || off.joining_date;
    if (!validTillStr) return false;
    try {
      const validTill = new Date(validTillStr);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return validTill < today;
    } catch {
      return false;
    }
  };

  // Helper to parse interview result/time
  const getInterviewDetails = (intv: Interview) => {
    const meta = interviewMetas[intv.interview_id] || {};
    let result = meta.result || intv.result || 'Pending';
    let time = meta.time || '10:10';
    let date = meta.date || intv.scheduled_at?.split('T')[0] || '2026-10-19';
    let mode = meta.mode || intv.mode || 'Video call';
    let venue_or_link = meta.venue_or_link || intv.venue_or_link || 'Google Meet';
    let rating = meta.rating || intv.rating || 5;
    let feedback = meta.feedback || intv.feedback || '—';
    let history: Array<{ status: string; timestamp: string; author: string }> = meta.history || [
      {
        status: intv.status || 'Scheduled',
        timestamp: formatDisplayDate(intv.scheduled_at || '2026-10-19') + ', 1:38 pm',
        author: 'ananya.rao@brightcone.ai',
      },
    ];

    if (intv.notes) {
      try {
        const parsed = JSON.parse(intv.notes);
        if (parsed.result) result = parsed.result;
        if (parsed.time) time = parsed.time;
        if (parsed.date) date = parsed.date;
        if (parsed.mode) mode = parsed.mode;
        if (parsed.venue_or_link) venue_or_link = parsed.venue_or_link;
        if (parsed.rating) rating = parsed.rating;
        if (parsed.feedback) feedback = parsed.feedback;
        if (parsed.history && Array.isArray(parsed.history)) history = parsed.history;
      } catch {
        // Plain text notes
      }
    }
    return { result, time, date, mode, venue_or_link, rating, feedback, history };
  };

  const handleUpdateInterviewStatus = async (intv: Interview, newStatus: string) => {
    setIsSubmitting(true);
    try {
      const nowStr = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).toLowerCase();
      const details = getInterviewDetails(intv);
      const history = details.history ? [...details.history] : [];
      history.unshift({
        status: newStatus,
        timestamp: nowStr,
        author: currentUser?.email || 'ananya.rao@brightcone.ai',
      });

      const updatedNotes = JSON.stringify({
        ...details,
        history,
        last_updated: nowStr,
      });

      await recruitmentApi.updateInterview(intv.interview_id, {
        status: newStatus,
        notes: updatedNotes,
      });

      setInterviews(prev => prev.map(i => i.interview_id === intv.interview_id ? { ...i, status: newStatus, notes: updatedNotes } : i));
      if (selectedInterview?.interview_id === intv.interview_id) {
        setSelectedInterview({ ...selectedInterview, status: newStatus, notes: updatedNotes });
      }

      showToast(`Interview status updated to ${newStatus}`);
      await fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to update interview status.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteInterview = async (intv: Interview) => {
    if (!window.confirm(`Delete scheduled interview for "${intv.candidate_name}"?`)) return;
    try {
      try {
        await recruitmentApi.deleteInterview(intv.interview_id);
      } catch {
        await recruitmentApi.cancelInterview(intv.interview_id);
      }
      showToast(`Interview for "${intv.candidate_name}" deleted.`);
      if (selectedInterview?.interview_id === intv.interview_id) {
        setDetailDrawerType(null);
        setSelectedInterview(null);
      }
      await fetchData();
    } catch (err) {
      console.error(err);
      alert('Could not delete interview.');
    }
  };

  const handleOpenEditInterview = (intv: Interview) => {
    const details = getInterviewDetails(intv);
    setEditingInterviewId(intv.interview_id);
    setIntvCandName(intv.candidate_name);
    setIntvRole(intv.job_title);
    setIntvRound(intv.round_name);
    setIntvMode(details.mode || 'Video call');
    setIntvDate(details.date || '2026-10-19');
    setIntvTime(details.time || '10:10');
    setIntvInterviewer(intv.panel || 'Ananya Rao');
    setIntvVenueLink(details.venue_or_link || 'Google Meet');
    setIntvRating(String(details.rating || 5));
    setIntvResult(details.result || 'Pending');
    setIntvFeedback(details.feedback === '—' ? '' : details.feedback || '');
    setIsScheduleModalOpen(true);
  };

  // CSV Exporter Utility
  const exportToCsv = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row
          .map((cell) => {
            const str = String(cell ?? '');
            return `"${str.replace(/"/g, '""')}"`;
          })
          .join(',')
      ),
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${filename} successfully!`);
  };

  // =========================================================================
  // HANDLERS: MANPOWER REQUIREMENTS (Screenshots 2, 4, 5)
  // =========================================================================

  const handleCreateRequirement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqDept || !reqDesignation || !reqPositions || !reqEmpType || !reqReason || !reqRequiredBy || !reqStatus) {
      alert('Please fill in all required fields marked with *');
      return;
    }

    setIsSubmitting(true);
    try {
      const nowStr = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).toLowerCase();

      const metaObj: RequirementMeta = {
        positions: parseInt(reqPositions, 10) || 1,
        experience: reqExperience || '2',
        budget_ctc: reqBudgetCtc || '120000',
        reason: reqReason,
        replacing: reqReplacing || '—',
        hiring_manager: reqHiringManager || '—',
        required_by: reqRequiredBy,
        job_description: reqJobDesc,
        archived: false,
        history: [{ status: reqStatus, timestamp: nowStr, author: 'ananya.rao@brightcone.ai' }],
        created_at_display: nowStr,
        updated_at_display: nowStr,
      };

      await recruitmentApi.createJob({
        title: reqDesignation,
        department: reqDept,
        location: reqLocation || 'Bengaluru, Hybrid',
        employment_type: reqEmpType,
        referral_bonus: 40000,
        description: JSON.stringify(metaObj),
      });

      setIsAddReqModalOpen(false);
      resetReqForm();
      showToast(`Requirement "${reqDesignation}" created successfully!`);
      await fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to add requirement. Please check inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEditRequirement = (job: Job) => {
    const meta = getRequirementMeta(job);
    setEditingJobId(job.job_id);
    setReqDept(job.department);
    setReqDesignation(job.title);
    setReqPositions(String(meta.positions || 1));
    setReqEmpType(job.employment_type);
    setReqLocation(job.location);
    setReqExperience(meta.experience || '');
    setReqBudgetCtc(meta.budget_ctc || '');
    setReqReason(meta.reason || '');
    setReqReplacing(meta.replacing === '—' ? '' : meta.replacing || '');
    setReqHiringManager(meta.hiring_manager === '—' ? '' : meta.hiring_manager || '');
    setReqRequiredBy(meta.required_by || '');
    setReqStatus(job.status);
    setReqJobDesc(meta.job_description || '');
    setIsEditReqModalOpen(true);
  };

  const handleUpdateRequirement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJobId) return;

    setIsSubmitting(true);
    try {
      const nowStr = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).toLowerCase();
      const existingJob = jobs.find((j) => j.job_id === editingJobId);
      const existingMeta = existingJob ? getRequirementMeta(existingJob) : null;

      const history = existingMeta?.history ? [...existingMeta.history] : [];
      history.unshift({ status: reqStatus, timestamp: nowStr, author: 'ananya.rao@brightcone.ai' });

      const updatedMeta: RequirementMeta = {
        positions: parseInt(reqPositions, 10) || 1,
        experience: reqExperience || '2',
        budget_ctc: reqBudgetCtc || '120000',
        reason: reqReason,
        replacing: reqReplacing || '—',
        hiring_manager: reqHiringManager || '—',
        required_by: reqRequiredBy,
        job_description: reqJobDesc,
        archived: existingMeta?.archived || false,
        history,
        created_at_display: existingMeta?.created_at_display || nowStr,
        updated_at_display: nowStr,
      };

      await recruitmentApi.updateJob(editingJobId, {
        title: reqDesignation,
        department: reqDept,
        location: reqLocation,
        employment_type: reqEmpType,
        status: reqStatus,
        description: JSON.stringify(updatedMeta),
      });

      setIsEditReqModalOpen(false);
      resetReqForm();
      showToast('Requirement updated successfully!');
      await fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to update requirement.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRequirement = async (job: Job) => {
    if (!window.confirm(`Are you sure you want to delete requirement "${job.title}"?`)) return;
    try {
      await recruitmentApi.closeJob(job.job_id);
      showToast(`Requirement "${job.title}" removed!`);
      if (selectedRequirement?.job_id === job.job_id) {
        setDetailDrawerType(null);
        setSelectedRequirement(null);
      }
      await fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to remove requirement.');
    }
  };

  const resetReqForm = () => {
    setReqDept('');
    setReqDesignation('');
    setReqPositions('1');
    setReqEmpType('');
    setReqLocation('');
    setReqExperience('');
    setReqBudgetCtc('');
    setReqReason('');
    setReqReplacing('');
    setReqHiringManager('');
    setReqRequiredBy('');
    setReqStatus('');
    setReqJobDesc('');
    setEditingJobId(null);
  };

  const exportJobsCsv = () => {
    const headers = ['ID', 'DESIGNATION', 'DEPARTMENT', 'POSITIONS', 'HIRING MANAGER', 'REQUIRED BY', 'STATUS'];
    const rows = filteredJobs.map((j) => {
      const meta = getRequirementMeta(j);
      const isOverdue = isRequirementOverdue(j);
      const code = j.job_code?.startsWith('MR-') ? j.job_code : `MR-${String(j.id || 1).padStart(4, '0')}`;
      return [
        code,
        j.title,
        j.department,
        meta.positions,
        meta.hiring_manager,
        formatDisplayDate(meta.required_by),
        isOverdue ? 'Overdue' : j.status,
      ];
    });
    exportToCsv(`manpower_requirements_${new Date().toISOString().split('T')[0]}.csv`, headers, rows);
  };

  // Canonical Employee Open Roles (Screenshot 1)
  const employeeJobs = [
    {
      id: 1,
      job_id: 'JOB-ML-01',
      title: 'Senior ML Engineer',
      department: 'AI Research',
      location: 'Hyderabad',
      employment_type: 'Full-time',
      referral_bonus: 50000,
    },
    {
      id: 2,
      job_id: 'JOB-SA-02',
      title: 'Solutions Architect',
      department: 'Sales',
      location: 'San Francisco',
      employment_type: 'Full-time',
      referral_bonus: 75000,
    },
    {
      id: 3,
      job_id: 'JOB-PD-03',
      title: 'Product Designer',
      department: 'Design',
      location: 'Hyderabad',
      employment_type: 'Full-time',
      referral_bonus: 40000,
    },
    {
      id: 4,
      job_id: 'JOB-QA-04',
      title: 'QA Automation Engineer',
      department: 'Engineering',
      location: 'Pune',
      employment_type: 'Full-time',
      referral_bonus: 30000,
    },
  ];

  const handleReferralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referCandName || !referEmail) {
      alert('Candidate name and Email are required.');
      return;
    }
    setIsSubmitting(true);
    try {
      const created = await recruitmentApi.createReferral({
        referred_by: 'Rahul Varma',
        candidate_name: referCandName,
        candidate_email: referEmail,
        candidate_phone: referPhone,
        job_title: referringJob?.title || 'Senior ML Engineer',
        bonus_amount: referringJob?.referral_bonus || 50000,
        status: 'Applied',
        notes: referFitNotes,
      });

      try {
        await recruitmentApi.createCandidate({
          full_name: referCandName,
          email: referEmail,
          phone: referPhone || '+91 98480 00000',
          source: 'Employee Referral',
          job_title: referringJob?.title || 'Senior ML Engineer',
          stage: 'Applied',
          match_score: 92,
        });
      } catch (e) {}

      // Refetch live referrals from PostgreSQL
      const refs = await recruitmentApi.listReferrals();
      if (refs && refs.length > 0) {
        setReferrals(refs);
      } else {
        setReferrals([created, ...referrals]);
      }

      showToast(`Referral for ${referCandName} saved to PostgreSQL database!`);
      setReferringJob(null);
      setReferCandName('');
      setReferEmail('');
      setReferPhone('');
      setReferFitNotes('');
    } catch (err: any) {
      console.error('Failed to submit referral to PostgreSQL', err);
      alert('Failed to submit referral to database: ' + (err?.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplyInternallySubmit = async () => {
    if (!applyingJob) return;
    setIsSubmitting(true);
    try {
      await recruitmentApi.createCandidate({
        full_name: 'Rahul Varma',
        email: 'rahul.varma@brightcone.ai',
        phone: '+91 98480 11038',
        source: 'Internal Transfer',
        job_title: applyingJob.title,
        stage: 'Applied',
        match_score: 95,
      });

      await recruitmentApi.createReferral({
        referred_by: 'Rahul Varma (Self-Application)',
        candidate_name: 'Rahul Varma',
        candidate_email: 'rahul.varma@brightcone.ai',
        candidate_phone: '+91 98480 11038',
        job_title: applyingJob.title,
        bonus_amount: 0,
        status: 'Applied',
      });

      // Refetch live referrals from PostgreSQL
      const refs = await recruitmentApi.listReferrals();
      if (refs && refs.length > 0) {
        setReferrals(refs);
      }

      showToast(`Application for ${applyingJob.title} saved to database! Your manager has been notified.`);
      setApplyingJob(null);
    } catch (err: any) {
      console.error('Failed to submit internal application', err);
      alert('Failed to submit internal application to database: ' + (err?.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Distinct Departments for Department Filter (Screenshot 4)
  const distinctDepartments = Array.from(new Set(jobs.map((j) => j.department))).filter(Boolean);

  // Filtered Jobs (Screenshot 4)
  const filteredJobs = jobs.filter((j) => {
    const meta = getRequirementMeta(j);
    const isArchived = meta.archived || j.status === 'Archived' || j.status === 'Closed';

    if (jobShowArchived) {
      if (!isArchived) return false;
    } else {
      if (isArchived) return false;
    }

    const isOverdue = isRequirementOverdue(j);
    if (jobStatusFilter === 'Overdue') {
      if (!isOverdue) return false;
    } else if (jobStatusFilter !== 'All') {
      if (j.status.toLowerCase() !== jobStatusFilter.toLowerCase()) return false;
    }

    if (jobDeptFilter !== 'All') {
      if (j.department.toLowerCase() !== jobDeptFilter.toLowerCase()) return false;
    }

    if (jobSearch.trim()) {
      const query = jobSearch.toLowerCase();
      const code = j.job_code?.startsWith('MR-') ? j.job_code : `MR-${String(j.id || 1).padStart(4, '0')}`;
      const match =
        j.title.toLowerCase().includes(query) ||
        j.department.toLowerCase().includes(query) ||
        code.toLowerCase().includes(query) ||
        meta.hiring_manager.toLowerCase().includes(query);
      if (!match) return false;
    }
    return true;
  });

  const jobCounts = {
    total: jobs.filter((j) => !getRequirementMeta(j).archived && j.status !== 'Archived').length,
    pending: jobs.filter((j) => j.status.toLowerCase() === 'pending').length,
    approved: jobs.filter((j) => j.status.toLowerCase() === 'approved' || j.status.toLowerCase() === 'open').length,
    onHold: jobs.filter((j) => j.status.toLowerCase() === 'on hold').length,
    archived: jobs.filter((j) => getRequirementMeta(j).archived || j.status === 'Archived').length,
  };

  // =========================================================================
  // HANDLERS: CANDIDATE TRACKER
  // =========================================================================

  const handleCreateCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candName || !candEmail || !candPhone || !candSource || !candConsent || !candStage) {
      alert('Please fill in all required fields marked with *');
      return;
    }

    setIsSubmitting(true);
    try {
      const nowStr = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).toLowerCase();
      const res = await recruitmentApi.createCandidate({
        full_name: candName,
        email: candEmail,
        phone: candPhone,
        source: candSource,
        job_title: candAppliedFor || (jobs[0]?.title ?? 'Lead AI Engineer'),
        stage: candStage as Candidate['stage'],
        match_score: Math.floor(Math.random() * 15) + 82,
      });

      // If stage is Interview, auto-reflect in Interview Scheduling database table!
      if (candStage.toLowerCase() === 'interview') {
        try {
          await recruitmentApi.scheduleInterview({
            candidate_name: candName,
            job_title: candAppliedFor || (jobs[0]?.title ?? 'Lead AI Engineer'),
            round_name: 'Technical round 1',
            scheduled_at: new Date().toISOString().split('T')[0],
            panel: 'Ananya Rao',
            notes: JSON.stringify({
              date: new Date().toISOString().split('T')[0],
              time: '11:00 AM',
              mode: 'Video call',
              result: 'Pending',
              venue_or_link: 'Google Meet',
              history: [{ status: 'Scheduled', timestamp: nowStr, author: currentUser?.email || 'ananya.rao@brightcone.ai' }]
            })
          });
        } catch (e) {
          console.error('Auto interview creation error:', e);
        }
      }

      const candId = res.cand_id || `CAND-${Date.now()}`;
      const newMetas = {
        ...candidateMetas,
        [candId]: {
          total_experience: candExp || '4 years',
          current_ctc: candCurrentCtc || '₹ 14,00,000',
          expected_ctc: candExpectedCtc || '₹ 18,00,000',
          notice_period: candNoticePeriod || '30 days',
          current_location: candLocation || 'Bengaluru',
          resume_name: candResumeFile?.name || 'Resume_Attached.pdf',
          consent_to_store: candConsent,
          archived: false,
          overdue: candStage === 'Overdue',
          history: [{ status: candStage, timestamp: nowStr, author: currentUser?.email || 'ananya.rao@brightcone.ai' }],
        },
      };
      saveCandidateMetas(newMetas);

      setIsAddCandModalOpen(false);
      // Reset form
      setCandName('');
      setCandEmail('');
      setCandPhone('');
      setCandAppliedFor('');
      setCandSource('');
      setCandExp('');
      setCandCurrentCtc('');
      setCandExpectedCtc('');
      setCandNoticePeriod('');
      setCandLocation('');
      setCandResumeFile(null);
      setCandConsent('');
      setCandStage('');

      showToast(`Candidate "${candName}" added to pipeline!`);
      await fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to add candidate. Please verify inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConvertToEmployee = async (cand: Candidate) => {
    if (!window.confirm(`Convert ${cand.full_name} to a permanent employee and create their profile?`)) {
      return;
    }
    setIsSubmitting(true);
    try {
      const meta = candidateMetas[cand.cand_id];

      // Fetch fresh employee list to avoid stale data or collisions
      const latestEmployees = await employeesApi.list();
      const existingCodes = new Set(latestEmployees.map((e) => e.employee_code.trim().toUpperCase()));

      let nextNum = 1001;
      latestEmployees.forEach((e) => {
        const match = e.employee_code.match(/^BC-(\d+)$/i);
        if (match) {
          const val = parseInt(match[1], 10);
          if (val >= 1000 && val < 5000 && val >= nextNum) {
            nextNum = val + 1;
          }
        }
      });

      while (existingCodes.has(`BC-${nextNum}`)) {
        nextNum++;
      }
      const empCode = `BC-${nextNum}`;

      await employeesApi.create({
        employee_code: empCode,
        full_name: cand.full_name,
        job_title: cand.job_title || 'Software Engineer',
        department: 'Engineering',
        grade: 'L4',
        location: meta?.current_location || 'Bengaluru',
        manager_name: 'Ananya Rao',
        status: 'Active',
        work_email: cand.email || `${cand.full_name.toLowerCase().replace(/\s+/g, '.')}@brightcone.com`,
        phone: cand.phone || '+91 98765 43210',
        joined: new Date().toISOString().split('T')[0],
        ctc: 1800000,
      });

      await recruitmentApi.updateCandidate(cand.cand_id, { stage: 'Hired' });
      showToast(`Successfully converted ${cand.full_name} to Employee (${empCode})!`);
      await fetchData();
    } catch (err: any) {
      console.error(err);
      const errMsg = err?.response?.data?.error || err?.message || 'Could not convert candidate to employee.';
      alert(`Could not convert candidate to employee: ${errMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCandidate = async (cand: Candidate) => {
    if (!window.confirm(`Delete candidate "${cand.full_name}"?`)) return;
    try {
      await recruitmentApi.updateCandidate(cand.cand_id, { stage: 'Rejected' });
      showToast(`Candidate "${cand.full_name}" removed!`);
      if (selectedCandidate?.cand_id === cand.cand_id) {
        setDetailDrawerType(null);
        setSelectedCandidate(null);
      }
      await fetchData();
    } catch (err) {
      console.error(err);
      alert('Could not remove candidate.');
    }
  };

  const exportCandidatesCsv = () => {
    const headers = ['ID', 'FULL NAME', 'EMAIL', 'PHONE', 'APPLIED FOR', 'SOURCE', 'TOTAL EXPERIENCE', 'EXPECTED CTC', 'STAGE'];
    const rows = filteredCandidates.map((c) => {
      const meta = candidateMetas[c.cand_id] || {};
      const isOverdue = isCandidateOverdue(c);
      return [
        c.candidate_code || `CAND-${c.id}`,
        c.full_name,
        c.email || '',
        c.phone || '',
        c.job_title || '',
        c.source,
        meta.total_experience || '3-5 years',
        meta.expected_ctc || '₹ 18,00,000',
        isOverdue ? 'Overdue' : c.stage,
      ];
    });
    exportToCsv(`candidate_tracker_${new Date().toISOString().split('T')[0]}.csv`, headers, rows);
  };

  // Filtered Candidates
  const filteredCandidates = candidates.filter((c) => {
    const meta = candidateMetas[c.cand_id] || {};
    const isArchived = meta.archived || c.stage === 'Rejected';

    if (candidateShowArchived) {
      if (!isArchived) return false;
    } else {
      if (isArchived) return false;
    }

    const isOverdue = isCandidateOverdue(c);
    if (candidateStageFilter === 'Overdue') {
      if (!isOverdue) return false;
    } else if (candidateStageFilter !== 'All') {
      if (c.stage.toLowerCase() !== candidateStageFilter.toLowerCase()) return false;
    }

    if (candidateSearch.trim()) {
      const q = candidateSearch.toLowerCase();
      const match =
        c.full_name.toLowerCase().includes(q) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.job_title && c.job_title.toLowerCase().includes(q)) ||
        c.source.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const candidateCounts = {
    total: candidates.filter((c) => !(candidateMetas[c.cand_id]?.archived)).length,
    applied: candidates.filter((c) => c.stage.toLowerCase() === 'applied').length,
    interview: candidates.filter((c) => c.stage.toLowerCase() === 'interview' || c.stage.toLowerCase() === 'screening').length,
    offered: candidates.filter((c) => c.stage.toLowerCase() === 'offer' || c.stage.toLowerCase() === 'offered').length,
    archived: candidates.filter((c) => candidateMetas[c.cand_id]?.archived || c.stage === 'Rejected').length,
  };

  // =========================================================================
  // HANDLERS: INTERVIEW SCHEDULING (Screenshot 1)
  // =========================================================================

  const handleScheduleInterviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!intvCandName || !intvRound || !intvMode || !intvDate || !intvTime || !intvStatus) {
      alert('Please fill in candidate, round, mode, date, time and status.');
      return;
    }

    setIsSubmitting(true);
    try {
      const nowStr = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).toLowerCase();

      if (editingInterviewId) {
        const existingIntv = interviews.find((i) => i.interview_id === editingInterviewId);
        const existingDetails = existingIntv ? getInterviewDetails(existingIntv) : null;
        const history = existingDetails?.history ? [...existingDetails.history] : [];
        history.unshift({
          status: intvStatus || existingIntv?.status || 'Scheduled',
          timestamp: nowStr,
          author: currentUser?.email || 'ananya.rao@brightcone.ai',
        });

        const notesJson = JSON.stringify({
          mode: intvMode || 'Video call',
          venue_or_link: intvVenueLink || 'Google Meet',
          rating: parseInt(intvRating, 10) || 5,
          result: intvResult || 'Pending',
          feedback: intvFeedback || '—',
          time: intvTime || '10:10',
          date: intvDate,
          history,
          last_updated: nowStr,
        });

        await recruitmentApi.updateInterview(editingInterviewId, {
          round_name: intvRound,
          scheduled_at: intvDate,
          panel: intvInterviewer || 'Ananya Rao',
          status: intvStatus || 'Scheduled',
          notes: notesJson,
        });

        setIsScheduleModalOpen(false);
        setEditingInterviewId(null);
        resetIntvForm();
        showToast(`Interview updated successfully!`);
        await fetchData();
      } else {
        const history = [
          {
            status: intvStatus || 'Scheduled',
            timestamp: nowStr,
            author: currentUser?.email || 'ananya.rao@brightcone.ai',
          },
        ];

        const notesJson = JSON.stringify({
          mode: intvMode || 'Video call',
          venue_or_link: intvVenueLink || 'Google Meet',
          rating: parseInt(intvRating, 10) || 5,
          result: intvResult || 'Pending',
          feedback: intvFeedback || '—',
          time: intvTime || '10:10',
          date: intvDate,
          history,
        });

        const res = await recruitmentApi.scheduleInterview({
          candidate_name: intvCandName,
          job_title: intvRole || 'Open Requisition',
          round_name: intvRound,
          scheduled_at: intvDate,
          panel: intvInterviewer || 'Ananya Rao',
          notes: notesJson,
        });

        const intvId = res.interview_id;
        if (intvId) {
          saveInterviewMetas({
            ...interviewMetas,
            [intvId]: {
              result: (intvResult as any) || 'Pending',
              time: intvTime,
              date: intvDate,
              mode: intvMode,
              venue_or_link: intvVenueLink,
              rating: parseInt(intvRating, 10) || 5,
              feedback: intvFeedback,
              archived: false,
              history,
            },
          });
        }

        setIsScheduleModalOpen(false);
        resetIntvForm();
        showToast(`Interview scheduled for ${intvCandName}!`);
        await fetchData();
      }
    } catch (err) {
      console.error(err);
      alert('Could not save interview.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetIntvForm = () => {
    setEditingInterviewId(null);
    setIntvRound('');
    setIntvMode('');
    setIntvDate('');
    setIntvTime('');
    setIntvInterviewer('');
    setIntvVenueLink('');
    setIntvRating('5');
    setIntvResult('');
    setIntvFeedback('');
    setIntvStatus('Scheduled');
  };

  const exportInterviewsCsv = () => {
    const headers = ['CANDIDATE', 'ROLE', 'ROUND', 'DATE', 'TIME', 'INTERVIEWER', 'RESULT', 'STATUS'];
    const rows = filteredInterviews.map((i) => {
      const details = getInterviewDetails(i);
      return [
        i.candidate_name,
        i.job_title,
        i.round_name,
        details.date,
        details.time,
        i.panel,
        details.result,
        i.status,
      ];
    });
    exportToCsv(`interview_scheduling_${new Date().toISOString().split('T')[0]}.csv`, headers, rows);
  };

  // Filtered Interviews
  const filteredInterviews = interviews.filter((i) => {
    const meta = interviewMetas[i.interview_id] || {};
    const isArchived = meta.archived || i.status === 'Cancelled';

    if (intvShowArchived) {
      if (!isArchived) return false;
    } else {
      if (isArchived) return false;
    }

    if (intvStatusFilter !== 'All') {
      if (i.status.toLowerCase() !== intvStatusFilter.toLowerCase()) return false;
    }

    if (intvSearch.trim()) {
      const q = intvSearch.toLowerCase();
      const match =
        i.candidate_name.toLowerCase().includes(q) ||
        i.job_title.toLowerCase().includes(q) ||
        i.round_name.toLowerCase().includes(q) ||
        i.panel.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const interviewCounts = {
    total: interviews.filter((i) => !(interviewMetas[i.interview_id]?.archived) && i.status !== 'Cancelled').length,
    scheduled: interviews.filter((i) => i.status.toLowerCase() === 'scheduled').length,
    completed: interviews.filter((i) => i.status.toLowerCase() === 'completed').length,
    rescheduled: interviews.filter((i) => i.status.toLowerCase() === 'rescheduled').length,
    archived: interviews.filter((i) => interviewMetas[i.interview_id]?.archived || i.status === 'Cancelled').length,
  };

  // =========================================================================
  // HANDLERS: OFFER LETTERS (Screenshots 2 & 3)
  // =========================================================================

  const handleCreateOfferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerCandName || !offerDesignation || !offerDept || !offerAnnualCtc || !offerJoiningDate || !offerDate || !offerValidTill || !offerStatus) {
      alert('Please fill in all required fields marked with *');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await recruitmentApi.createOffer({
        candidate_name: offerCandName,
        job_title: offerDesignation,
        offered_ctc: Number(offerAnnualCtc) || 1800000,
        joining_date: offerJoiningDate,
        status: offerStatus as Offer['status'],
      });

      const offerId = res.offer_id || `OF-${Date.now()}`;
      const newMetas = {
        ...offerMetas,
        [offerId]: {
          department: offerDept,
          offer_date: offerDate,
          valid_till: offerValidTill,
          approved_by: offerApprovedBy || 'Ananya Rao',
          file_name: offerFile?.name || 'Offer_Letter.pdf',
          archived: false,
        },
      };
      saveOfferMetas(newMetas);

      setIsAddOfferModalOpen(false);
      resetOfferForm();
      showToast(`Offer letter created for ${offerCandName}!`);
      await fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to create offer letter.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetOfferForm = () => {
    setOfferCandName('');
    setOfferDesignation('');
    setOfferDept('');
    setOfferAnnualCtc('');
    setOfferJoiningDate('');
    setOfferDate('');
    setOfferValidTill('');
    setOfferApprovedBy('');
    setOfferFile(null);
    setOfferStatus('');
  };

  const handleDeleteOffer = (off: Offer) => {
    if (!window.confirm(`Delete offer letter for "${off.candidate_name}"?`)) return;
    const newOffers = offers.filter((o) => o.offer_id !== off.offer_id);
    setOffers(newOffers);
    showToast(`Offer for ${off.candidate_name} removed.`);
    if (selectedOffer?.offer_id === off.offer_id) {
      setDetailDrawerType(null);
      setSelectedOffer(null);
    }
  };

  const exportOffersCsv = () => {
    const headers = ['ID', 'CANDIDATE', 'DESIGNATION', 'ANNUAL CTC (₹)', 'JOINING DATE', 'VALID TILL', 'STATUS'];
    const rows = filteredOffers.map((off) => {
      const meta = offerMetas[off.offer_id] || {};
      const isOverdue = isOfferOverdue(off);
      const code = `OF-${String(off.id || 1).padStart(4, '0')}`;
      return [
        code,
        off.candidate_name,
        off.job_title,
        `₹ ${(off.offered_ctc || 1800000).toLocaleString('en-IN')}`,
        formatDisplayDate(off.joining_date || ''),
        formatDisplayDate(meta.valid_till || off.valid_till || ''),
        isOverdue ? 'Overdue' : off.status,
      ];
    });
    exportToCsv(`offer_letters_${new Date().toISOString().split('T')[0]}.csv`, headers, rows);
  };

  // Filtered Offers (Screenshot 2)
  const filteredOffers = offers.filter((o) => {
    const meta = offerMetas[o.offer_id] || {};
    const isArchived = meta.archived || o.status === 'Declined';

    if (offerShowArchived) {
      if (!isArchived) return false;
    } else {
      if (isArchived) return false;
    }

    const isOverdue = isOfferOverdue(o);
    if (offerStatusFilter === 'Overdue') {
      if (!isOverdue) return false;
    } else if (offerStatusFilter !== 'All') {
      if (o.status.toLowerCase() !== offerStatusFilter.toLowerCase()) return false;
    }

    if (offerSearch.trim()) {
      const q = offerSearch.toLowerCase();
      const code = `OF-${String(o.id || 1).padStart(4, '0')}`;
      const match =
        o.candidate_name.toLowerCase().includes(q) ||
        o.job_title.toLowerCase().includes(q) ||
        code.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const offerCounts = {
    total: offers.filter((o) => !(offerMetas[o.offer_id]?.archived) && o.status !== 'Declined').length,
    pendingApproval: offers.filter((o) => o.status.toLowerCase() === 'pending approval' || o.status.toLowerCase() === 'draft').length,
    sent: offers.filter((o) => o.status.toLowerCase() === 'sent' || o.status.toLowerCase() === 'extended').length,
    accepted: offers.filter((o) => o.status.toLowerCase() === 'accepted').length,
    archived: offers.filter((o) => offerMetas[o.offer_id]?.archived || o.status === 'Declined').length,
  };

  if (isEmployee) {
    return (
      <div className="space-y-6 animate-in fade-in duration-150 pb-12">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 border border-slate-700 animate-in slide-in-from-bottom-5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs font-semibold">{toastMessage}</span>
          </div>
        )}

        {/* Header */}
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-[#8B5CF6] uppercase">
            <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
            RECRUIT
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-heading mt-1">
            Jobs &amp; referrals
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Open roles at Brightcone. Refer someone great or apply internally.
          </p>
        </div>

        {/* Grid of Job Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {employeeJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white dark:bg-[#070D1E] rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between"
            >
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-heading">
                  {job.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {job.department}, {job.location}, {job.employment_type}
                </p>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-5 font-normal">
                  Referral bonus <span className="font-bold text-slate-900 dark:text-white">₹{job.referral_bonus.toLocaleString('en-IN')}</span> after the hire completes 90 days.
                </p>
              </div>

              <div className="flex items-center gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setReferringJob(job as any);
                    setReferCandName('');
                    setReferEmail('');
                    setReferPhone('');
                    setReferFitNotes('');
                  }}
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] shadow-sm transition-all cursor-pointer"
                >
                  Refer someone
                </button>
                <button
                  type="button"
                  onClick={() => setApplyingJob(job as any)}
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs transition-all cursor-pointer"
                >
                  Apply internally
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* My Referrals Section */}
        <div className="bg-white dark:bg-[#070D1E] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden mt-8">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white font-heading">
              My referrals
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
                  <th className="py-3 px-6 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    CANDIDATE
                  </th>
                  <th className="py-3 px-6 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    ROLE
                  </th>
                  <th className="py-3 px-6 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    STATUS
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
                {referrals.map((ref: any, idx: number) => {
                  const candName = ref.candidate_name || ref.name || 'Siddharth Rao';
                  const roleTitle = ref.job_title || ref.role || 'QA Automation Engineer';
                  const statusText = ref.status || 'Interview';

                  return (
                    <tr key={ref.id || idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                        {candName}
                      </td>
                      <td className="py-4 px-6 text-slate-700 dark:text-slate-300">
                        {roleTitle}
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#DBEAFE] text-[#1D4ED8] dark:bg-blue-950/60 dark:text-blue-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                          {statusText}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Refer Someone (Screenshot 2) */}
        {referringJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white dark:bg-[#070D1E] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-heading">
                  Refer for {referringJob.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  We'll contact them and keep you posted.
                </p>
              </div>

              <form onSubmit={handleReferralSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Candidate name <span className="text-slate-400 font-normal">(required)</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={referCandName}
                    onChange={(e) => setReferCandName(e.target.value)}
                    placeholder=""
                    className="w-full px-4 py-2.5 rounded-xl border border-blue-400 dark:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-xs sm:text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Email <span className="text-slate-400 font-normal">(required)</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={referEmail}
                      onChange={(e) => setReferEmail(e.target.value)}
                      placeholder=""
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-xs sm:text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={referPhone}
                      onChange={(e) => setReferPhone(e.target.value)}
                      placeholder=""
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-xs sm:text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Why are they a good fit?
                  </label>
                  <textarea
                    rows={4}
                    value={referFitNotes}
                    onChange={(e) => setReferFitNotes(e.target.value)}
                    placeholder=""
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 text-xs sm:text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white resize-y"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setReferringJob(null)}
                    className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-all cursor-pointer shadow-sm"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit referral'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Apply Internally (Screenshot 3) */}
        {applyingJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white dark:bg-[#070D1E] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-heading">
                  Apply for {applyingJob.title}?
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Your manager will be informed when you move to interviews.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setApplyingJob(null)}
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyInternallySubmit}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-all cursor-pointer shadow-sm"
                >
                  {isSubmitting ? 'Applying...' : 'Apply'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 border border-slate-700 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* ===================================================================== */}
      {/* VIEW 1: MANPOWER REQUIREMENTS (Screenshots 4 & 5)                      */}
      {/* ===================================================================== */}
      {currentView === 'jobs' && (
        <div className="space-y-5">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-[#8B5CF6] uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
                RECRUIT
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-heading mt-0.5">
                Manpower requirements
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Approved headcount to hire against. Candidates are tracked against these requirements.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={exportJobsCsv}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>

              <button
                type="button"
                onClick={() => {
                  resetReqForm();
                  setIsAddReqModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add requirement
              </button>
            </div>
          </div>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#070D1E] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/40 text-[#8B5CF6] flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
                <span>Total records</span>
              </div>
              <div className="mt-3 text-3xl font-bold text-slate-900 dark:text-white font-heading">
                {jobCounts.total}
              </div>
              <div className="mt-1 text-xs text-slate-400 dark:text-slate-500 font-medium">
                Live records
              </div>
            </div>

            <div className="bg-white dark:bg-[#070D1E] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/40 text-[#8B5CF6] flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
                <span>Pending</span>
              </div>
              <div className="mt-3 text-3xl font-bold text-slate-900 dark:text-white font-heading">
                {jobCounts.pending}
              </div>
              <div className="mt-1 text-xs text-slate-400 dark:text-slate-500 font-medium">
                Records
              </div>
            </div>

            <div className="bg-white dark:bg-[#070D1E] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/40 text-[#8B5CF6] flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
                <span>Approved</span>
              </div>
              <div className="mt-3 text-3xl font-bold text-slate-900 dark:text-white font-heading">
                {jobCounts.approved}
              </div>
              <div className="mt-1 text-xs text-slate-400 dark:text-slate-500 font-medium">
                Records
              </div>
            </div>

            <div className="bg-white dark:bg-[#070D1E] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/40 text-[#8B5CF6] flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
                <span>On hold</span>
              </div>
              <div className="mt-3 text-3xl font-bold text-slate-900 dark:text-white font-heading">
                {jobCounts.onHold}
              </div>
              <div className="mt-1 text-xs text-slate-400 dark:text-slate-500 font-medium">
                Records
              </div>
            </div>
          </div>

          {/* Table Container with Filter & Controls (Screenshot 4) */}
          <div className="bg-white dark:bg-[#070D1E] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
            {/* Filter Bar (Screenshot 4) */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3 w-full sm:w-auto flex-1 max-w-2xl">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={jobSearch}
                    onChange={(e) => setJobSearch(e.target.value)}
                    placeholder="Search manpower requirements"
                    className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>

                {/* Status Dropdown */}
                <select
                  value={jobStatusFilter}
                  onChange={(e) => setJobStatusFilter(e.target.value)}
                  className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none focus:border-[#2563EB]"
                >
                  <option value="All">All statuses</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                  <option value="On hold">On hold</option>
                </select>

                {/* Department Dropdown (Screenshot 4: "All: department") */}
                <select
                  value={jobDeptFilter}
                  onChange={(e) => setJobDeptFilter(e.target.value)}
                  className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none focus:border-[#2563EB]"
                >
                  <option value="All">All: department</option>
                  {distinctDepartments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Archived Checkbox */}
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer select-none self-end sm:self-auto">
                <input
                  type="checkbox"
                  checked={jobShowArchived}
                  onChange={(e) => setJobShowArchived(e.target.checked)}
                  className="w-4 h-4 rounded text-[#2563EB] border-slate-300 focus:ring-[#2563EB] cursor-pointer"
                />
                <span>Archived ({jobCounts.archived})</span>
              </label>
            </div>

            {/* Table or Empty State (Screenshot 4) */}
            {filteredJobs.length === 0 ? (
              <div className="py-20 px-4 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-[#8B5CF6] flex items-center justify-center mb-3.5 shadow-2xs">
                  <Briefcase className="w-7 h-7" />
                </div>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                  No manpower requirements yet. Use <strong className="text-slate-900 dark:text-white font-bold">Add requirement</strong> to create the first one.
                </p>
                <button
                  type="button"
                  onClick={() => setIsAddReqModalOpen(true)}
                  className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] shadow-sm transition-all cursor-pointer"
                >
                  + Add requirement
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-900/30">
                      <th className="py-3 px-4 font-semibold">ID</th>
                      <th className="py-3 px-4 font-semibold">DESIGNATION</th>
                      <th className="py-3 px-4 font-semibold">DEPARTMENT</th>
                      <th className="py-3 px-4 font-semibold">POSITIONS</th>
                      <th className="py-3 px-4 font-semibold">HIRING MANAGER</th>
                      <th className="py-3 px-4 font-semibold">REQUIRED BY</th>
                      <th className="py-3 px-4 font-semibold">STATUS</th>
                      <th className="py-3 px-4 font-semibold text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {filteredJobs.map((job) => {
                      const meta = getRequirementMeta(job);
                      const isOverdue = isRequirementOverdue(job);
                      const reqIdCode = job.job_code?.startsWith('MR-') ? job.job_code : `MR-${String(job.id || 1).padStart(4, '0')}`;

                      return (
                        <tr key={job.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                            {reqIdCode}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                            {job.title}
                          </td>
                          <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-medium">
                            {job.department}
                          </td>
                          <td className="py-3.5 px-4 text-slate-800 dark:text-slate-200 font-semibold">
                            {meta.positions}
                          </td>
                          <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                            {meta.hiring_manager}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                            {formatDisplayDate(meta.required_by)}
                          </td>
                          <td className="py-3.5 px-4">
                            {isOverdue ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                                Overdue
                              </span>
                            ) : (
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                                  job.status.toLowerCase() === 'approved' || job.status.toLowerCase() === 'open'
                                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                                    : job.status.toLowerCase() === 'pending'
                                    ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                                    : job.status.toLowerCase() === 'on hold'
                                    ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                                }`}
                              >
                                {job.status}
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-3 text-slate-400">
                              {/* Eye icon: opens details drawer (Screenshot 4 & 5) */}
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedRequirement(job);
                                  setDetailDrawerType('requirement');
                                }}
                                className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                                title="View entire requirement details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {/* Edit icon: opens edit requirement modal */}
                              <button
                                type="button"
                                onClick={() => handleOpenEditRequirement(job)}
                                className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                                title="Edit requirement"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>

                              {/* Trash icon: deletes requirement */}
                              <button
                                type="button"
                                onClick={() => handleDeleteRequirement(job)}
                                className="hover:text-rose-600 transition-colors cursor-pointer"
                                title="Delete requirement"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Table Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
              <div>
                {filteredJobs.length} of {jobs.length} shown
              </div>
              <div>
                Saved in PostgreSQL database · Live cloud sync
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* VIEW 2: CANDIDATE TRACKER                                             */}
      {/* ===================================================================== */}
      {currentView === 'candidates' && (
        <div className="space-y-5">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-[#8B5CF6] uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
                RECRUIT
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-heading mt-0.5">
                Candidate tracker
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Every applicant and their stage. “Convert to employee” creates their Employee ID and sets up onboarding.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={exportCandidatesCsv}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>

              <button
                type="button"
                onClick={() => setIsAddCandModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add candidate
              </button>
            </div>
          </div>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#070D1E] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/40 text-[#8B5CF6] flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <span>Total records</span>
              </div>
              <div className="mt-3 text-3xl font-bold text-slate-900 dark:text-white font-heading">
                {candidateCounts.total}
              </div>
              <div className="mt-1 text-xs text-slate-400 dark:text-slate-500 font-medium">
                Live records
              </div>
            </div>

            <div className="bg-white dark:bg-[#070D1E] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/40 text-[#8B5CF6] flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <span>Applied</span>
              </div>
              <div className="mt-3 text-3xl font-bold text-slate-900 dark:text-white font-heading">
                {candidateCounts.applied}
              </div>
              <div className="mt-1 text-xs text-slate-400 dark:text-slate-500 font-medium">
                Records
              </div>
            </div>

            <div className="bg-white dark:bg-[#070D1E] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/40 text-[#8B5CF6] flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <span>Interview</span>
              </div>
              <div className="mt-3 text-3xl font-bold text-slate-900 dark:text-white font-heading">
                {candidateCounts.interview}
              </div>
              <div className="mt-1 text-xs text-slate-400 dark:text-slate-500 font-medium">
                Records
              </div>
            </div>

            <div className="bg-white dark:bg-[#070D1E] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/40 text-[#8B5CF6] flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <span>Offered</span>
              </div>
              <div className="mt-3 text-3xl font-bold text-slate-900 dark:text-white font-heading">
                {candidateCounts.offered}
              </div>
              <div className="mt-1 text-xs text-slate-400 dark:text-slate-500 font-medium">
                Records
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white dark:bg-[#070D1E] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3 w-full sm:w-auto flex-1 max-w-lg">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={candidateSearch}
                    onChange={(e) => setCandidateSearch(e.target.value)}
                    placeholder="Search candidate tracker"
                    className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>

                <select
                  value={candidateStageFilter}
                  onChange={(e) => setCandidateStageFilter(e.target.value)}
                  className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none focus:border-[#2563EB]"
                >
                  <option value="All">All statuses</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Applied">Applied</option>
                  <option value="Screening">Screening</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer / Offered</option>
                  <option value="Hired">Hired</option>
                </select>
              </div>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer select-none self-end sm:self-auto">
                <input
                  type="checkbox"
                  checked={candidateShowArchived}
                  onChange={(e) => setCandidateShowArchived(e.target.checked)}
                  className="w-4 h-4 rounded text-[#2563EB] border-slate-300 focus:ring-[#2563EB] cursor-pointer"
                />
                <span>Archived ({candidateCounts.archived})</span>
              </label>
            </div>

            {filteredCandidates.length === 0 ? (
              <div className="py-20 px-4 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-[#8B5CF6] flex items-center justify-center mb-3.5 shadow-2xs">
                  <Users className="w-7 h-7" />
                </div>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                  No candidate tracker yet. Use <strong className="text-slate-900 dark:text-white font-bold">Add candidate</strong> to create the first one.
                </p>
                <button
                  type="button"
                  onClick={() => setIsAddCandModalOpen(true)}
                  className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] shadow-sm transition-all cursor-pointer"
                >
                  + Add candidate
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-900/30">
                      <th className="py-3 px-4 font-semibold">ID</th>
                      <th className="py-3 px-4 font-semibold">FULL NAME</th>
                      <th className="py-3 px-4 font-semibold">APPLIED FOR</th>
                      <th className="py-3 px-4 font-semibold">SOURCE</th>
                      <th className="py-3 px-4 font-semibold">TOTAL EXPERIENCE (YEARS)</th>
                      <th className="py-3 px-4 font-semibold">EXPECTED CTC (₹/YEAR)</th>
                      <th className="py-3 px-4 font-semibold">STAGE</th>
                      <th className="py-3 px-4 font-semibold text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {filteredCandidates.map((cand) => {
                      const meta = candidateMetas[cand.cand_id] || {};
                      const isOverdue = isCandidateOverdue(cand);

                      return (
                        <tr key={cand.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                            {cand.candidate_code || `CAND-${cand.id}`}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-slate-900 dark:text-white">{cand.full_name}</span>
                            <p className="text-[11px] text-slate-400">{cand.email || 'cand.email@domain.com'}</p>
                          </td>
                          <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-medium">
                            {cand.job_title || 'Lead AI Engineer'}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                              {cand.source}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-800 dark:text-slate-200 font-medium">
                            {meta.total_experience || '3.5'}
                          </td>
                          <td className="py-3.5 px-4 text-slate-800 dark:text-slate-200 font-medium">
                            {meta.expected_ctc || '₹ 18,00,000'}
                          </td>
                          <td className="py-3.5 px-4">
                            {isOverdue ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                                Overdue
                              </span>
                            ) : (
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                                  cand.stage === 'Hired'
                                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                                    : cand.stage === 'Interview' || cand.stage === 'Screening'
                                    ? 'bg-purple-50 dark:bg-purple-950/40 text-[#8B5CF6] border-purple-200 dark:border-purple-800'
                                    : cand.stage === 'Offer' || cand.stage === 'Offered'
                                    ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                                }`}
                              >
                                {cand.stage}
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2 text-slate-400">
                              {/* Convert to employee button: ONLY for offer, offered, hired, selected (Image 3) */}
                              {isEligibleForConversion(cand.stage) && (
                                <button
                                  type="button"
                                  onClick={() => handleConvertToEmployee(cand)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl shadow-xs transition-colors cursor-pointer mr-1"
                                  title="Convert to permanent employee"
                                >
                                  <LogIn className="w-3.5 h-3.5" />
                                  Convert to employee
                                </button>
                              )}

                              {/* Eye icon: opens candidate detail slide-over */}
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedCandidate(cand);
                                  setDetailDrawerType('candidate');
                                }}
                                className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer p-1"
                                title="View entire candidate details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {/* Edit candidate icon */}
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedCandidate(cand);
                                  setDetailDrawerType('candidate');
                                }}
                                className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer p-1"
                                title="Edit candidate"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>

                              {/* Delete candidate button */}
                              <button
                                type="button"
                                onClick={() => handleDeleteCandidate(cand)}
                                className="hover:text-rose-600 transition-colors cursor-pointer p-1"
                                title="Delete candidate"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
              <div>
                {filteredCandidates.length} of {candidates.length} shown
              </div>
              <div>
                Saved in PostgreSQL database · Live cloud sync
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* VIEW 3: INTERVIEW SCHEDULING (Screenshot 1 & Table)                   */}
      {/* ===================================================================== */}
      {currentView === 'interviews' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-[#8B5CF6] uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
                RECRUIT
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-heading mt-0.5">
                Interview scheduling
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Interview rounds with panel, time, feedback and result.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={exportInterviewsCsv}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>

              <button
                type="button"
                onClick={() => {
                  resetIntvForm();
                  setIsScheduleModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add interview
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#070D1E] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/40 text-[#8B5CF6] flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <span>Total records</span>
              </div>
              <div className="mt-3 text-3xl font-bold text-slate-900 dark:text-white font-heading">
                {interviewCounts.total}
              </div>
              <div className="mt-1 text-xs text-slate-400 dark:text-slate-500 font-medium">
                Live records
              </div>
            </div>

            <div className="bg-white dark:bg-[#070D1E] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/40 text-[#8B5CF6] flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <span>Scheduled</span>
              </div>
              <div className="mt-3 text-3xl font-bold text-slate-900 dark:text-white font-heading">
                {interviewCounts.scheduled}
              </div>
              <div className="mt-1 text-xs text-slate-400 dark:text-slate-500 font-medium">
                Records
              </div>
            </div>

            <div className="bg-white dark:bg-[#070D1E] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/40 text-[#8B5CF6] flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <span>Completed</span>
              </div>
              <div className="mt-3 text-3xl font-bold text-slate-900 dark:text-white font-heading">
                {interviewCounts.completed}
              </div>
              <div className="mt-1 text-xs text-slate-400 dark:text-slate-500 font-medium">
                Records
              </div>
            </div>

            <div className="bg-white dark:bg-[#070D1E] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/40 text-[#8B5CF6] flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <span>Rescheduled</span>
              </div>
              <div className="mt-3 text-3xl font-bold text-slate-900 dark:text-white font-heading">
                {interviewCounts.rescheduled}
              </div>
              <div className="mt-1 text-xs text-slate-400 dark:text-slate-500 font-medium">
                Records
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#070D1E] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3 w-full sm:w-auto flex-1 max-w-lg">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={intvSearch}
                    onChange={(e) => setIntvSearch(e.target.value)}
                    placeholder="Search interview scheduling"
                    className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>

                <select
                  value={intvStatusFilter}
                  onChange={(e) => setIntvStatusFilter(e.target.value)}
                  className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none focus:border-[#2563EB]"
                >
                  <option value="All">All statuses</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Rescheduled">Rescheduled</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer select-none self-end sm:self-auto">
                <input
                  type="checkbox"
                  checked={intvShowArchived}
                  onChange={(e) => setIntvShowArchived(e.target.checked)}
                  className="w-4 h-4 rounded text-[#2563EB] border-slate-300 focus:ring-[#2563EB] cursor-pointer"
                />
                <span>Archived ({interviewCounts.archived})</span>
              </label>
            </div>

            {filteredInterviews.length === 0 ? (
              <div className="py-20 px-4 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-[#8B5CF6] flex items-center justify-center mb-3.5 shadow-2xs">
                  <Calendar className="w-7 h-7" />
                </div>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                  No interview scheduling yet. Use <strong className="text-slate-900 dark:text-white font-bold">Add interview</strong> to create the first one.
                </p>
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(true)}
                  className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] shadow-sm transition-all cursor-pointer"
                >
                  + Add interview
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-900/30">
                      <th className="py-3 px-4 font-semibold">CANDIDATE</th>
                      <th className="py-3 px-4 font-semibold">ROUND</th>
                      <th className="py-3 px-4 font-semibold">DATE</th>
                      <th className="py-3 px-4 font-semibold">TIME</th>
                      <th className="py-3 px-4 font-semibold">INTERVIEWER</th>
                      <th className="py-3 px-4 font-semibold">RESULT</th>
                      <th className="py-3 px-4 font-semibold">STATUS</th>
                      <th className="py-3 px-4 font-semibold text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {filteredInterviews.map((intv) => {
                      const details = getInterviewDetails(intv);
                      return (
                        <tr key={intv.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                            {intv.candidate_name}
                            <p className="text-[11px] text-slate-400 font-normal">{intv.job_title}</p>
                          </td>
                          <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-medium">
                            {intv.round_name}
                          </td>
                          <td className="py-3.5 px-4 text-slate-800 dark:text-slate-200 font-medium">
                            {formatDisplayDate(details.date)}
                          </td>
                          <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                            {details.time}
                          </td>
                          <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                            {intv.panel}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                details.result === 'Passed' || details.result === 'Strong Hire'
                                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                                  : details.result === 'Failed'
                                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                                  : 'bg-purple-50 dark:bg-purple-950/40 text-[#8B5CF6] border border-purple-200 dark:border-purple-800'
                              }`}
                            >
                              {details.result}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                                intv.status.toLowerCase() === 'completed'
                                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                                  : intv.status.toLowerCase() === 'scheduled'
                                  ? 'bg-purple-50 dark:bg-purple-950/40 text-[#8B5CF6] border-purple-200 dark:border-purple-800'
                                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                              }`}
                            >
                              {intv.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2 text-slate-400">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedInterview(intv);
                                  setDetailDrawerType('interview');
                                }}
                                className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer p-1"
                                title="View interview details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenEditInterview(intv)}
                                className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer p-1"
                                title="Edit interview"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteInterview(intv)}
                                className="hover:text-rose-600 transition-colors cursor-pointer p-1"
                                title="Delete interview"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
              <div>
                {filteredInterviews.length} of {interviews.length} shown
              </div>
              <div>
                Saved in PostgreSQL database · Live cloud sync
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* VIEW 4: OFFER LETTERS (Matches Screenshot 2 & 3)                      */}
      {/* ===================================================================== */}
      {currentView === 'offers' && (
        <div className="space-y-5">
          {/* Header Bar (Screenshot 2) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-[#8B5CF6] uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
                RECRUIT
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-heading mt-0.5">
                Offer letters
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Offers from draft to acceptance. Overdue when the offer passes its valid-till date unanswered.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={exportOffersCsv}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV
              </button>

              <button
                type="button"
                onClick={() => {
                  resetOfferForm();
                  setIsAddOfferModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add offer
              </button>
            </div>
          </div>

          {/* 4 Stat Cards (Screenshot 2) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#070D1E] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/40 text-[#8B5CF6] flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </div>
                <span>Total records</span>
              </div>
              <div className="mt-3 text-3xl font-bold text-slate-900 dark:text-white font-heading">
                {offerCounts.total}
              </div>
              <div className="mt-1 text-xs text-slate-400 dark:text-slate-500 font-medium">
                Live records
              </div>
            </div>

            <div className="bg-white dark:bg-[#070D1E] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/40 text-[#8B5CF6] flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </div>
                <span>Pending approval</span>
              </div>
              <div className="mt-3 text-3xl font-bold text-slate-900 dark:text-white font-heading">
                {offerCounts.pendingApproval}
              </div>
              <div className="mt-1 text-xs text-slate-400 dark:text-slate-500 font-medium">
                Records
              </div>
            </div>

            <div className="bg-white dark:bg-[#070D1E] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/40 text-[#8B5CF6] flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </div>
                <span>Sent</span>
              </div>
              <div className="mt-3 text-3xl font-bold text-slate-900 dark:text-white font-heading">
                {offerCounts.sent}
              </div>
              <div className="mt-1 text-xs text-slate-400 dark:text-slate-500 font-medium">
                Records
              </div>
            </div>

            <div className="bg-white dark:bg-[#070D1E] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/40 text-[#8B5CF6] flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </div>
                <span>Accepted</span>
              </div>
              <div className="mt-3 text-3xl font-bold text-slate-900 dark:text-white font-heading">
                {offerCounts.accepted}
              </div>
              <div className="mt-1 text-xs text-slate-400 dark:text-slate-500 font-medium">
                Records
              </div>
            </div>
          </div>

          {/* Table Container (Screenshot 2) */}
          <div className="bg-white dark:bg-[#070D1E] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3 w-full sm:w-auto flex-1 max-w-lg">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    value={offerSearch}
                    onChange={(e) => setOfferSearch(e.target.value)}
                    placeholder="Search offer letters"
                    className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>

                <select
                  value={offerStatusFilter}
                  onChange={(e) => setOfferStatusFilter(e.target.value)}
                  className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none focus:border-[#2563EB]"
                >
                  <option value="All">All statuses</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Draft">Draft</option>
                  <option value="Pending approval">Pending approval</option>
                  <option value="Sent">Sent</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Declined">Declined</option>
                </select>
              </div>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer select-none self-end sm:self-auto">
                <input
                  type="checkbox"
                  checked={offerShowArchived}
                  onChange={(e) => setOfferShowArchived(e.target.checked)}
                  className="w-4 h-4 rounded text-[#2563EB] border-slate-300 focus:ring-[#2563EB] cursor-pointer"
                />
                <span>Archived ({offerCounts.archived})</span>
              </label>
            </div>

            {filteredOffers.length === 0 ? (
              <div className="py-20 px-4 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-[#8B5CF6] flex items-center justify-center mb-3.5 shadow-2xs">
                  <Send className="w-7 h-7" />
                </div>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                  No offer letters yet. Use <strong className="text-slate-900 dark:text-white font-bold">Add offer</strong> to create the first one.
                </p>
                <button
                  type="button"
                  onClick={() => setIsAddOfferModalOpen(true)}
                  className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] shadow-sm transition-all cursor-pointer"
                >
                  + Add offer
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-900/30">
                      <th className="py-3 px-4 font-semibold">ID</th>
                      <th className="py-3 px-4 font-semibold">CANDIDATE</th>
                      <th className="py-3 px-4 font-semibold">DESIGNATION</th>
                      <th className="py-3 px-4 font-semibold">ANNUAL CTC (₹)</th>
                      <th className="py-3 px-4 font-semibold">JOINING DATE</th>
                      <th className="py-3 px-4 font-semibold">VALID TILL</th>
                      <th className="py-3 px-4 font-semibold">STATUS</th>
                      <th className="py-3 px-4 font-semibold text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {filteredOffers.map((off) => {
                      const meta = offerMetas[off.offer_id] || {};
                      const isOverdue = isOfferOverdue(off);
                      const code = `OF-${String(off.id || 1).padStart(4, '0')}`;

                      return (
                        <tr key={off.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                            {code}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                            {off.candidate_name}
                          </td>
                          <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-medium">
                            {off.job_title}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                            ₹ {(off.offered_ctc || 1800000).toLocaleString('en-IN')}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                            {formatDisplayDate(off.joining_date || '')}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                            {formatDisplayDate(meta.valid_till || off.valid_till || '2026-11-20')}
                          </td>
                          <td className="py-3.5 px-4">
                            {isOverdue ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                                Overdue
                              </span>
                            ) : (
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                                  off.status === 'Accepted'
                                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                                    : off.status === 'Sent' || off.status === 'Extended'
                                    ? 'bg-purple-50 dark:bg-purple-950/40 text-[#8B5CF6] border-purple-200 dark:border-purple-800'
                                    : off.status === 'Pending approval'
                                    ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                                }`}
                              >
                                {off.status}
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-3 text-slate-400">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedOffer(off);
                                  setDetailDrawerType('offer');
                                }}
                                className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                                title="View entire offer details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteOffer(off)}
                                className="hover:text-rose-600 transition-colors cursor-pointer"
                                title="Delete offer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
              <div>
                {filteredOffers.length} of {offers.length} shown
              </div>
              <div>
                Saved in PostgreSQL database · Live cloud sync
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* VIEW 5: JOINING FORMALITIES                                           */}
      {/* ===================================================================== */}
      {currentView === 'onboarding' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-[#8B5CF6] uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
                RECRUIT
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-heading mt-0.5">
                Joining formalities
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Pre-boarding document verification, background checks, and IT asset allocation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-[#070D1E] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-bold text-slate-500">Pre-joining Candidates</span>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">3</p>
              <p className="text-xs text-slate-400 mt-1">Expected this month</p>
            </div>
            <div className="bg-white dark:bg-[#070D1E] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-bold text-slate-500">Document Verification</span>
              <p className="text-3xl font-bold text-emerald-600 mt-2">100%</p>
              <p className="text-xs text-slate-400 mt-1">2 verified, 1 pending</p>
            </div>
            <div className="bg-white dark:bg-[#070D1E] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-bold text-slate-500">Asset Dispatch</span>
              <p className="text-3xl font-bold text-blue-600 mt-2">2 / 3</p>
              <p className="text-xs text-slate-400 mt-1">Laptops couriered</p>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* VIEW 6: ONBOARDING CHECKLIST                                          */}
      {/* ===================================================================== */}
      {currentView === 'checklist' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-[#8B5CF6] uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
                RECRUIT
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-heading mt-0.5">
                Onboarding checklist
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Day 1 to 90 onboarding roadmap for seamless employee integration.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#070D1E] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="space-y-3">
              {checklistTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => {
                    setChecklistTasks(checklistTasks.map((t) => (t.id === task.id ? { ...t, done: !t.done } : t)));
                    showToast(`Updated "${task.title}" status!`);
                  }}
                  className={`p-4 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                    task.done
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-800/40 text-slate-700'
                      : 'bg-slate-50/80 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center border ${
                      task.done ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 dark:border-slate-600'
                    }`}>
                      {task.done && <Check className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${task.done ? 'line-through text-slate-400' : ''}`}>
                        {task.title}
                      </p>
                      <p className="text-[11px] text-slate-400">{task.category} • Assignee: {task.assignee}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    task.done ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    {task.done ? 'Completed' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* VIEW 7: INTERNSHIP MANAGEMENT                                         */}
      {/* ===================================================================== */}
      {currentView === 'internships' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-[#8B5CF6] uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
                RECRUIT
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-heading mt-0.5">
                Internship management
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Campus recruitments, project deliverables, and Pre-Placement Offer (PPO) tracking.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#070D1E] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-bold text-slate-500">Active Cohort</span>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">6</p>
              <p className="text-xs text-slate-400 mt-1">Summer 2026 Batch</p>
            </div>
            <div className="bg-white dark:bg-[#070D1E] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-bold text-slate-500">Mentors Assigned</span>
              <p className="text-3xl font-bold text-[#8B5CF6] mt-2">6 / 6</p>
              <p className="text-xs text-slate-400 mt-1">1:1 engineering mentorship</p>
            </div>
            <div className="bg-white dark:bg-[#070D1E] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-bold text-slate-500">Mid-term Reviews</span>
              <p className="text-3xl font-bold text-emerald-600 mt-2">100%</p>
              <p className="text-xs text-slate-400 mt-1">All evaluations cleared</p>
            </div>
            <div className="bg-white dark:bg-[#070D1E] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <span className="text-xs font-bold text-slate-500">PPO Eligible</span>
              <p className="text-3xl font-bold text-blue-600 mt-2">4</p>
              <p className="text-xs text-slate-400 mt-1">Recommended for FT conversion</p>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* VIEW 0: RECRUIT DASHBOARD (Overview)                                  */}
      {/* ===================================================================== */}
      {currentView === 'dashboard' && (
        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#12162B] via-[#1E1F4B] to-[#34276A] p-6 sm:p-8 text-white shadow-lg border border-slate-800/50">
            <div className="absolute right-0 top-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-[#A78BFA] uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A78BFA]" />
                  RECRUIT
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white font-heading">
                  Recruit dashboard
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
                  Hiring health across every open role, scored by the Brightcone HR intelligence agent.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur-md transition-all shadow-xs cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  Schedule interview
                </button>

                <button
                  type="button"
                  onClick={() => setIsAddReqModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 shadow-md transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  Post a job
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <div className="bg-white dark:bg-[#070D1E] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-[#8B5CF6] flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
                <span>Open roles</span>
              </div>
              <div className="mt-3 text-3xl font-bold text-slate-900 dark:text-white font-heading">
                {jobs.length}
              </div>
              <div className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                {jobs.length} postings in total
              </div>
            </div>

            <div className="bg-white dark:bg-[#070D1E] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-[#8B5CF6] flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <span>Active candidates</span>
              </div>
              <div className="mt-3 text-3xl font-bold text-slate-900 dark:text-white font-heading">
                {candidates.length || 9}
              </div>
              <div className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                Average fit score 84%
              </div>
            </div>

            <div className="bg-white dark:bg-[#070D1E] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-[#8B5CF6] flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <span>Interviews booked</span>
              </div>
              <div className="mt-3 text-3xl font-bold text-slate-900 dark:text-white font-heading">
                {interviews.length}
              </div>
              <div className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                Upcoming rounds
              </div>
            </div>

            <div className="bg-white dark:bg-[#070D1E] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-[#8B5CF6] flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </div>
                <span>Offers out</span>
              </div>
              <div className="mt-3 text-3xl font-bold text-slate-900 dark:text-white font-heading">
                {offers.length || 1}
              </div>
              <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                1 hired this quarter
              </div>
            </div>
          </div>

          {/* Row 2: Hiring Funnel + Where candidates come from (Image 1) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Hiring Funnel Card */}
            <div className="bg-white dark:bg-[#070D1E] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">Hiring funnel</h3>
                <button
                  type="button"
                  onClick={() => setCurrentView('tracker')}
                  className="text-xs font-semibold text-[#2563EB] hover:underline cursor-pointer"
                >
                  Open pipeline
                </button>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Applied', count: candidates.filter(c => c.stage?.toLowerCase() === 'applied').length || 3 },
                  { label: 'Screening', count: candidates.filter(c => c.stage?.toLowerCase() === 'screening').length || 3 },
                  { label: 'Interview', count: candidates.filter(c => c.stage?.toLowerCase() === 'interview').length || 2 },
                  { label: 'Offer', count: candidates.filter(c => c.stage?.toLowerCase() === 'offer' || c.stage?.toLowerCase() === 'offered').length || 1 },
                  { label: 'Hired', count: candidates.filter(c => c.stage?.toLowerCase() === 'hired').length || 1 },
                ].map((item, idx) => {
                  const maxCount = Math.max(candidates.length, 5);
                  const pct = Math.min(100, Math.max(12, (item.count / maxCount) * 100));
                  return (
                    <div key={idx} className="flex items-center gap-4 text-xs">
                      <span className="w-24 text-slate-700 dark:text-slate-300 font-medium">{item.label}</span>
                      <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#8B5CF6] rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-6 text-right font-bold text-slate-900 dark:text-white">{item.count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Where candidates come from Card */}
            <div className="bg-white dark:bg-[#070D1E] rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">Where candidates come from</h3>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Referral', count: candidates.filter(c => c.source?.toLowerCase().includes('referral')).length || 3 },
                  { label: 'LinkedIn', count: candidates.filter(c => c.source?.toLowerCase().includes('linkedin')).length || 3 },
                  { label: 'Careers page', count: candidates.filter(c => c.source?.toLowerCase().includes('careers') || c.source?.toLowerCase().includes('portal')).length || 2 },
                  { label: 'Internal', count: candidates.filter(c => c.source?.toLowerCase().includes('internal')).length || 1 },
                  { label: 'Indeed', count: candidates.filter(c => c.source?.toLowerCase().includes('indeed')).length || 1 },
                ].map((item, idx) => {
                  const maxCount = Math.max(candidates.length, 5);
                  const pct = Math.min(100, Math.max(12, (item.count / maxCount) * 100));
                  return (
                    <div key={idx} className="flex items-center gap-4 text-xs">
                      <span className="w-24 text-slate-700 dark:text-slate-300 font-medium">{item.label}</span>
                      <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#8B5CF6] rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-6 text-right font-bold text-slate-900 dark:text-white">{item.count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Row 3: Open roles table + Upcoming interviews (Image 1) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Open roles Card (spans 2 columns) */}
            <div className="lg:col-span-2 bg-white dark:bg-[#070D1E] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden flex flex-col">
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">Open roles</h3>
                <button
                  type="button"
                  onClick={() => setCurrentView('manpower')}
                  className="text-xs font-semibold text-[#2563EB] hover:underline cursor-pointer"
                >
                  Manage jobs
                </button>
              </div>

              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-900/30">
                      <th className="py-3 px-5 font-semibold">ROLE</th>
                      <th className="py-3 px-5 font-semibold">IN PIPELINE</th>
                      <th className="py-3 px-5 font-semibold">TOP FIT</th>
                      <th className="py-3 px-5 font-semibold">REFERRAL BONUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {jobs.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-xs text-slate-400">
                          No open roles found. Click &quot;Post a job&quot; to add one.
                        </td>
                      </tr>
                    ) : (
                      jobs.map((job) => {
                        const matchedCandidates = candidates.filter(
                          (c) =>
                            (c.job_title && c.job_title.toLowerCase().trim() === job.title.toLowerCase().trim()) ||
                            (c.job_id && c.job_id === job.job_id)
                        );
                        const topFit =
                          matchedCandidates.length > 0
                            ? matchedCandidates.reduce(
                                (max, c) => ((c.match_score || 0) > (max.match_score || 0) ? c : max),
                                matchedCandidates[0]
                              )
                            : null;

                        return (
                          <tr key={job.job_id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                            <td className="py-3.5 px-5">
                              <p className="font-bold text-slate-900 dark:text-white">{job.title}</p>
                              <p className="text-[11px] text-slate-400 font-normal">
                                {job.department}, {job.location || 'Hyderabad'}
                              </p>
                            </td>
                            <td className="py-3.5 px-5 text-slate-700 dark:text-slate-300 font-medium">
                              {matchedCandidates.length} candidates
                            </td>
                            <td className="py-3.5 px-5">
                              {topFit ? (
                                <span className="text-slate-900 dark:text-white font-semibold">
                                  <span className="text-[#2563EB] font-bold">{topFit.match_score || 91}%</span> {topFit.full_name}
                                </span>
                              ) : (
                                <span className="text-slate-400">—</span>
                              )}
                            </td>
                            <td className="py-3.5 px-5 text-slate-900 dark:text-white font-semibold">
                              ₹{(job.referral_bonus || 30000).toLocaleString('en-IN')}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Upcoming interviews Card (spans 1 column) (Image 1) */}
            <div className="bg-white dark:bg-[#070D1E] rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">Upcoming interviews</h3>
              </div>

              <div className="space-y-4 flex-1">
                {interviews.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    No upcoming interviews scheduled.
                  </div>
                ) : (
                  interviews.slice(0, 5).map((intv) => {
                    const details = getInterviewDetails(intv);
                    const parsedDate = new Date(details.date || intv.scheduled_at || '2026-10-19');
                    const dayNum = isNaN(parsedDate.getDate()) ? '19' : parsedDate.getDate();
                    const monthStr = isNaN(parsedDate.getTime())
                      ? 'OCT'
                      : parsedDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();

                    return (
                      <div
                        key={intv.interview_id}
                        onClick={() => {
                          setSelectedInterview(intv);
                          setDetailDrawerType('interview');
                        }}
                        className="flex items-start gap-3.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                      >
                        <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-800/40 text-[#8B5CF6] flex flex-col items-center justify-center shrink-0">
                          <span className="text-sm font-bold leading-none">{dayNum}</span>
                          <span className="text-[9px] font-bold tracking-wider leading-none mt-0.5">{monthStr}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {intv.candidate_name}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            {intv.round_name}, {details.time || '11:00 AM'}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SLIDE-OVER DETAIL DRAWER (Matches Screenshot 5)                       */}
      {/* ===================================================================== */}
      {detailDrawerType && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Scrim */}
          <div
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setDetailDrawerType(null)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white dark:bg-[#070D1E] shadow-2xl border-l border-slate-100 dark:border-slate-800 flex flex-col justify-between animate-in slide-in-from-right duration-200">
              {/* Drawer Top Header (Screenshot 5) */}
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-800/40 text-[#8B5CF6] flex items-center justify-center shrink-0 shadow-xs">
                    {detailDrawerType === 'requirement' && <Briefcase className="w-6 h-6" />}
                    {detailDrawerType === 'candidate' && <Users className="w-6 h-6" />}
                    {detailDrawerType === 'interview' && <Calendar className="w-6 h-6" />}
                    {detailDrawerType === 'offer' && <Send className="w-6 h-6" />}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {detailDrawerType === 'requirement' && selectedRequirement && (
                        `${selectedRequirement.title} · ${selectedRequirement.department} (${selectedRequirement.job_code?.startsWith('MR-') ? selectedRequirement.job_code : 'MR-' + String(selectedRequirement.id || 1).padStart(4, '0')})`
                      )}
                      {detailDrawerType === 'candidate' && selectedCandidate && (
                        `${selectedCandidate.full_name} (${selectedCandidate.candidate_code || 'CAND-001'})`
                      )}
                      {detailDrawerType === 'interview' && selectedInterview && (
                        `Interview · ${selectedInterview.interview_code || ('INT-' + String(selectedInterview.id || 1).padStart(4, '0'))}`
                      )}
                      {detailDrawerType === 'offer' && selectedOffer && (
                        `${selectedOffer.candidate_name} · ${selectedOffer.job_title} (OF-${String(selectedOffer.id || 1).padStart(4, '0')})`
                      )}
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {detailDrawerType === 'requirement' && selectedRequirement && (
                        `Requirement · ${selectedRequirement.job_code?.startsWith('MR-') ? selectedRequirement.job_code : 'MR-' + String(selectedRequirement.id || 1).padStart(4, '0')}`
                      )}
                      {detailDrawerType === 'candidate' && selectedCandidate && (
                        `Candidate · ${selectedCandidate.job_title || 'Applicant'}`
                      )}
                      {detailDrawerType === 'interview' && selectedInterview && (
                        `Interview · ${selectedInterview.round_name || 'Interview round'}`
                      )}
                      {detailDrawerType === 'offer' && selectedOffer && (
                        `Offer letter · OF-${String(selectedOffer.id || 1).padStart(4, '0')}`
                      )}
                    </p>

                    {/* Status Pill Badge (Screenshot 5: • Overdue / • Completed) */}
                    <div className="mt-2">
                      {detailDrawerType === 'requirement' && selectedRequirement && (
                        isRequirementOverdue(selectedRequirement) ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                            Overdue
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800">
                            {selectedRequirement.status}
                          </span>
                        )
                      )}
                      {detailDrawerType === 'candidate' && selectedCandidate && (
                        isCandidateOverdue(selectedCandidate) ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                            Overdue
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-[#8B5CF6] border border-purple-200 dark:bg-purple-950/40 dark:border-purple-800">
                            {selectedCandidate.stage}
                          </span>
                        )
                      )}
                      {detailDrawerType === 'interview' && selectedInterview && (
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                          selectedInterview.status.toLowerCase() === 'completed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
                            : selectedInterview.status.toLowerCase() === 'scheduled'
                            ? 'bg-purple-50 text-[#8B5CF6] border-purple-200 dark:bg-purple-950/40 dark:border-purple-800'
                            : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            selectedInterview.status.toLowerCase() === 'completed'
                              ? 'bg-emerald-500'
                              : selectedInterview.status.toLowerCase() === 'scheduled'
                              ? 'bg-[#8B5CF6]'
                              : 'bg-amber-500'
                          }`} />
                          {selectedInterview.status}
                        </span>
                      )}
                      {detailDrawerType === 'offer' && selectedOffer && (
                        isOfferOverdue(selectedOffer) ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                            Overdue
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800">
                            {selectedOffer.status}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setDetailDrawerType(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body Details (Screenshot 5) */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
                {/* 1. REQUIREMENT DETAILS (Screenshot 5) */}
                {detailDrawerType === 'requirement' && selectedRequirement && (() => {
                  const meta = getRequirementMeta(selectedRequirement);
                  return (
                    <div className="space-y-3.5">
                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Department</p>
                        <p className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedRequirement.department}</p>
                      </div>

                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Designation</p>
                        <p className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedRequirement.title}</p>
                      </div>

                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Positions</p>
                        <p className="font-bold text-slate-900 dark:text-white mt-0.5">{meta.positions}</p>
                      </div>

                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Employment type</p>
                        <p className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedRequirement.employment_type}</p>
                      </div>

                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Location</p>
                        <p className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedRequirement.location}</p>
                      </div>

                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Experience (years)</p>
                        <p className="font-bold text-slate-900 dark:text-white mt-0.5">{meta.experience}</p>
                      </div>

                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Budget CTC (₹/year)</p>
                        <p className="font-bold text-slate-900 dark:text-white mt-0.5">{meta.budget_ctc}</p>
                      </div>

                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Reason</p>
                        <p className="font-bold text-slate-900 dark:text-white mt-0.5">{meta.reason}</p>
                      </div>

                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Replacing</p>
                        <p className="font-bold text-slate-900 dark:text-white mt-0.5">{meta.replacing}</p>
                      </div>

                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Hiring manager</p>
                        <p className="font-bold text-slate-900 dark:text-white mt-0.5">{meta.hiring_manager}</p>
                      </div>

                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Required by</p>
                        <p className="font-bold text-slate-900 dark:text-white mt-0.5">{formatDisplayDate(meta.required_by)}</p>
                      </div>

                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Status</p>
                        <div className="flex items-center gap-2 mt-1">
                          <select
                            value={isRequirementOverdue(selectedRequirement) && selectedRequirement.status?.toLowerCase() === 'pending' ? 'Overdue' : selectedRequirement.status}
                            onChange={(e) => handleUpdateRequirementStatus(selectedRequirement, e.target.value)}
                            className="px-2.5 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-[#2563EB]"
                          >
                            <option value="Active">Active</option>
                            <option value="Open">Open</option>
                            <option value="In progress">In progress</option>
                            <option value="On hold">On hold</option>
                            <option value="Closed">Closed</option>
                            <option value="Overdue">Overdue</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Job description</p>
                        <p className="text-slate-700 dark:text-slate-300 mt-0.5 whitespace-pre-wrap">{meta.job_description || '—'}</p>
                      </div>

                      {/* History Section (Screenshot 5) */}
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">History</h4>
                        <div className="mt-2 space-y-2">
                          {meta.history?.map((h, idx) => (
                            <div key={idx}>
                              <p className="font-bold text-slate-900 dark:text-white">{h.status}</p>
                              <p className="text-[11px] text-slate-400">{h.timestamp} · {h.author}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 text-[11px] text-slate-400">
                        Created {meta.created_at_display} by ananya.rao@brightcone.ai. Last updated {meta.updated_at_display}.
                      </div>
                    </div>
                  );
                })()}

                {/* 2. CANDIDATE DETAILS */}
                {detailDrawerType === 'candidate' && selectedCandidate && (() => {
                  const meta = candidateMetas[selectedCandidate.cand_id] || {};
                  const isOverdue = isCandidateOverdue(selectedCandidate);
                  const linkedJob = jobs.find(
                    (j) =>
                      j.job_id === selectedCandidate.job_id ||
                      (selectedCandidate.job_title &&
                        j.title.toLowerCase().trim() === selectedCandidate.job_title.toLowerCase().trim())
                  );
                  const candCode = selectedCandidate.candidate_code || `CAND-${String(selectedCandidate.id || 1).padStart(4, '0')}`;
                  const createdDate = formatDisplayDate(selectedCandidate.created_at || new Date().toISOString());

                  return (
                    <div className="space-y-3.5">
                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Candidate ID</p>
                        <p className="font-bold text-slate-900 dark:text-white mt-0.5">{candCode}</p>
                      </div>

                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Full name</p>
                        <p className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedCandidate.full_name}</p>
                      </div>

                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Email</p>
                        <p className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedCandidate.email || '—'}</p>
                      </div>

                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Phone</p>
                        <p className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedCandidate.phone || '—'}</p>
                      </div>

                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Applied for</p>
                        <p className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedCandidate.job_title || '—'}</p>
                      </div>

                      {linkedJob && (
                        <div>
                          <p className="text-[11px] text-slate-400 font-medium">Manpower requirement</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-bold text-slate-900 dark:text-white">
                              {linkedJob.title} · {linkedJob.department} ({linkedJob.job_code?.startsWith('MR-') ? linkedJob.job_code : 'MR-' + String(linkedJob.id || 1).padStart(4, '0')})
                            </span>
                            {isRequirementOverdue(linkedJob) && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800">
                                <span className="w-1 h-1 rounded-full bg-rose-500" />
                                Req Overdue
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Department</p>
                        <p className="font-bold text-slate-900 dark:text-white mt-0.5">{linkedJob?.department || 'Engineering'}</p>
                      </div>

                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Source</p>
                        <p className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedCandidate.source}</p>
                      </div>

                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Total experience (years)</p>
                        <p className="font-bold text-slate-900 dark:text-white mt-0.5">{meta.total_experience || '3.5'}</p>
                      </div>

                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Current CTC (₹/year)</p>
                        <p className="font-bold text-slate-900 dark:text-white mt-0.5">{meta.current_ctc || '₹ 14,00,000'}</p>
                      </div>

                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Expected CTC (₹/year)</p>
                        <p className="font-bold text-slate-900 dark:text-white mt-0.5">{meta.expected_ctc || '₹ 18,00,000'}</p>
                      </div>

                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Notice period (days)</p>
                        <p className="font-bold text-slate-900 dark:text-white mt-0.5">{meta.notice_period || '30 days'}</p>
                      </div>

                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Current location</p>
                        <p className="font-bold text-slate-900 dark:text-white mt-0.5">{meta.current_location || 'Bengaluru'}</p>
                      </div>

                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Resume</p>
                        <div className="flex items-center gap-2 mt-0.5 text-blue-600 font-semibold cursor-pointer">
                          <FileText className="w-4 h-4" />
                          <span>{meta.resume_name || 'Resume_Attached.pdf'}</span>
                        </div>
                      </div>

                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Consent to store data</p>
                        <p className="font-bold text-slate-900 dark:text-white mt-0.5">{meta.consent_to_store || 'Yes'}</p>
                      </div>

                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Stage / Status</p>
                        <div className="flex items-center gap-2 mt-1">
                          <select
                            value={isOverdue ? 'Overdue' : selectedCandidate.stage}
                            onChange={(e) => handleUpdateCandidateStage(selectedCandidate, e.target.value)}
                            className="px-2.5 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-[#2563EB]"
                          >
                            <option value="Overdue">Overdue</option>
                            <option value="Applied">Applied</option>
                            <option value="Screening">Screening</option>
                            <option value="Interview">Interview</option>
                            <option value="Offer">Offer</option>
                            <option value="Hired">Hired</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </div>
                      </div>

                      {/* History Section */}
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">History</h4>
                        <div className="mt-2 space-y-2">
                          {meta.history && meta.history.length > 0 ? (
                            meta.history.map((h: any, idx: number) => (
                              <div key={idx}>
                                <p className="font-bold text-slate-900 dark:text-white">{h.status}</p>
                                <p className="text-[11px] text-slate-400">{h.timestamp} · {h.author}</p>
                              </div>
                            ))
                          ) : (
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white">
                                {isOverdue ? 'Overdue' : selectedCandidate.stage}
                              </p>
                              <p className="text-[11px] text-slate-400">
                                {createdDate} · ananya.rao@brightcone.ai
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-2 text-[11px] text-slate-400">
                        Created {createdDate} by ananya.rao@brightcone.ai. Last updated {createdDate}.
                      </div>
                    </div>
                  );
                })()}

                {/* 3. OFFER DETAILS */}
                {detailDrawerType === 'offer' && selectedOffer && (() => {
                  const meta = offerMetas[selectedOffer.offer_id] || {};
                  return (
                    <div className="space-y-3.5">
                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Candidate</p>
                        <p className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedOffer.candidate_name}</p>
                      </div>

                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Designation</p>
                        <p className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedOffer.job_title}</p>
                      </div>

                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Department</p>
                        <p className="font-bold text-slate-900 dark:text-white mt-0.5">{meta.department || selectedOffer.department || 'Engineering'}</p>
                      </div>

                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Annual CTC (₹)</p>
                        <p className="font-bold text-emerald-600 mt-0.5">₹ {(selectedOffer.offered_ctc || 1800000).toLocaleString('en-IN')}</p>
                      </div>

                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Joining date</p>
                        <p className="font-bold text-slate-900 dark:text-white mt-0.5">{formatDisplayDate(selectedOffer.joining_date || '')}</p>
                      </div>

                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Offer date</p>
                        <p className="font-bold text-slate-900 dark:text-white mt-0.5">{formatDisplayDate(meta.offer_date || '2026-10-15')}</p>
                      </div>

                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Valid till</p>
                        <p className="font-bold text-slate-900 dark:text-white mt-0.5">{formatDisplayDate(meta.valid_till || selectedOffer.valid_till || '2026-10-25')}</p>
                      </div>

                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Approved by</p>
                        <p className="font-bold text-slate-900 dark:text-white mt-0.5">{meta.approved_by || 'Ananya Rao'}</p>
                      </div>

                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Offer letter file</p>
                        <div className="flex items-center gap-2 mt-0.5 text-blue-600 font-semibold cursor-pointer">
                          <FileText className="w-4 h-4" />
                          <span>{meta.file_name || 'Offer_Letter.pdf'}</span>
                        </div>
                      </div>

                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Status</p>
                        <p className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedOffer.status}</p>
                      </div>
                    </div>
                  );
                })()}

                {/* 4. INTERVIEW DETAILS (Matches Screenshot 5) */}
                {detailDrawerType === 'interview' && selectedInterview && (() => {
                  const details = getInterviewDetails(selectedInterview);
                  const matchingCand = candidates.find(
                    (c) => c.full_name?.toLowerCase().trim() === selectedInterview.candidate_name?.toLowerCase().trim()
                  );
                  const candCode = matchingCand?.candidate_code || `CAN-${String(matchingCand?.id || 1).padStart(4, '0')}`;
                  const createdDate = formatDisplayDate(selectedInterview.scheduled_at || new Date().toISOString());

                  return (
                    <div className="space-y-3.5">
                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Candidate</p>
                        <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                          {selectedInterview.candidate_name} ({candCode})
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Round</p>
                        <p className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedInterview.round_name}</p>
                      </div>

                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Mode</p>
                        <p className="font-bold text-slate-900 dark:text-white mt-0.5">{details.mode || 'Video call'}</p>
                      </div>

                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Date</p>
                        <p className="font-bold text-slate-900 dark:text-white mt-0.5">{formatDisplayDate(details.date)}</p>
                      </div>

                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Time</p>
                        <p className="font-bold text-slate-900 dark:text-white mt-0.5">{details.time}</p>
                      </div>

                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Interviewer</p>
                        <p className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedInterview.panel || '—'}</p>
                      </div>

                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Venue or meeting link</p>
                        <p className="font-bold text-slate-900 dark:text-white mt-0.5">{details.venue_or_link || '—'}</p>
                      </div>

                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Rating (1–5)</p>
                        <p className="font-bold text-slate-900 dark:text-white mt-0.5">{details.rating || 5}</p>
                      </div>

                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Result</p>
                        <p className="font-bold text-slate-900 dark:text-white mt-0.5">{details.result || 'Pending'}</p>
                      </div>

                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Feedback</p>
                        <p className="font-bold text-slate-900 dark:text-white mt-0.5">{details.feedback || '—'}</p>
                      </div>

                      <div>
                        <p className="text-[11px] text-slate-400 font-medium">Status</p>
                        <div className="flex items-center gap-2 mt-1">
                          <select
                            value={selectedInterview.status}
                            onChange={(e) => handleUpdateInterviewStatus(selectedInterview, e.target.value)}
                            className="px-2.5 py-1 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-[#2563EB]"
                          >
                            <option value="Scheduled">Scheduled</option>
                            <option value="Completed">Completed</option>
                            <option value="Rescheduled">Rescheduled</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      {/* History Section (Matches Screenshot 5) */}
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">History</h4>
                        <div className="mt-2 space-y-3">
                          {details.history && details.history.length > 0 ? (
                            details.history.map((h: any, idx: number) => (
                              <div key={idx}>
                                <p className="font-bold text-slate-900 dark:text-white">{h.status}</p>
                                <p className="text-[11px] text-slate-400">{h.timestamp} · {h.author}</p>
                              </div>
                            ))
                          ) : (
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white">{selectedInterview.status}</p>
                              <p className="text-[11px] text-slate-400">{createdDate}, 1:38 pm · ananya.rao@brightcone.ai</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-2 text-[11px] text-slate-400">
                        Created {createdDate}, 1:38 pm by ananya.rao@brightcone.ai. Last updated {createdDate}, 3:53 pm.
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Drawer Bottom Actions (Screenshot 5) */}
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-white dark:bg-[#070D1E]">
                {detailDrawerType === 'requirement' && selectedRequirement && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        const job = selectedRequirement;
                        setDetailDrawerType(null);
                        handleOpenEditRequirement(job);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteRequirement(selectedRequirement)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-900 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </>
                )}

                {detailDrawerType === 'candidate' && selectedCandidate && (
                  <div className="w-full flex items-center gap-2">
                    {/* Convert to employee button: ONLY when Offer, Offered, Hired, or Selected */}
                    {isEligibleForConversion(selectedCandidate.stage) && (
                      <button
                        type="button"
                        onClick={() => handleConvertToEmployee(selectedCandidate)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors cursor-pointer"
                        title="Convert candidate to employee"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Convert to employee
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setIntvCandName(selectedCandidate.full_name);
                        setIntvRole(selectedCandidate.job_title || 'Open Requisition');
                        setDetailDrawerType(null);
                        setIsScheduleModalOpen(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-[#8B5CF6] hover:bg-purple-50 dark:hover:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-800 transition-colors cursor-pointer"
                      title="Schedule interview"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      Interview
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        handleUpdateCandidateStage(
                          selectedCandidate,
                          isCandidateOverdue(selectedCandidate) ? 'Interview' : 'Overdue'
                        );
                      }}
                      className={`px-3 py-2 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                        isCandidateOverdue(selectedCandidate)
                          ? 'text-rose-600 border-rose-300 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40'
                          : 'text-emerald-700 border-emerald-300 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40'
                      }`}
                      title={isCandidateOverdue(selectedCandidate) ? 'Status is Overdue - click to activate' : 'Status is Active - click to mark overdue'}
                    >
                      {isCandidateOverdue(selectedCandidate) ? 'Overdue' : 'Active'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteCandidate(selectedCandidate)}
                      className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-900 transition-colors cursor-pointer shrink-0"
                      title="Delete candidate"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Interview Drawer Bottom Actions (Matches Screenshot 5) */}
                {detailDrawerType === 'interview' && selectedInterview && (
                  <div className="w-full flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const intv = selectedInterview;
                        setDetailDrawerType(null);
                        handleOpenEditInterview(intv);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteInterview(selectedInterview)}
                      className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-900 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                )}

                {detailDrawerType === 'offer' && selectedOffer && (
                  <>
                    <button
                      type="button"
                      onClick={() => showToast(`Sent reminder for offer to ${selectedOffer.candidate_name}!`)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      Send reminder
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteOffer(selectedOffer)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-900 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 1: ADD / EDIT REQUIREMENT (Screenshot 2)                        */}
      {/* ===================================================================== */}
      {(isAddReqModalOpen || isEditReqModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
          <div className="bg-white dark:bg-[#070D1E] w-full max-w-[620px] rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 relative animate-in zoom-in-95 duration-150 my-8">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0E1730] dark:text-white font-heading">
              {isEditReqModalOpen ? 'Edit requirement' : 'Add requirement'}
            </h3>
            <p className="text-xs sm:text-sm text-[#5B6787] dark:text-slate-400 mt-1 mb-5">
              Fields marked <span className="text-rose-500 font-bold">*</span> are required.
            </p>

            <form onSubmit={isEditReqModalOpen ? handleUpdateRequirement : handleCreateRequirement} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0E1730] dark:text-slate-300 mb-1.5">
                    Department <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={reqDept}
                    onChange={(e) => setReqDept(e.target.value)}
                    placeholder="e.g. ss"
                    className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-[#0E1730] dark:text-white placeholder-[#8D97B0] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0E1730] dark:text-slate-300 mb-1.5">
                    Designation <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={reqDesignation}
                    onChange={(e) => setReqDesignation(e.target.value)}
                    placeholder="e.g. asa"
                    className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-[#0E1730] dark:text-white placeholder-[#8D97B0] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0E1730] dark:text-slate-300 mb-1.5">
                    Positions <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={reqPositions}
                    onChange={(e) => setReqPositions(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-[#0E1730] dark:text-white focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0E1730] dark:text-slate-300 mb-1.5">
                    Employment type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={reqEmpType}
                    onChange={(e) => setReqEmpType(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-[#0E1730] dark:text-white focus:outline-none focus:border-[#2563EB]"
                  >
                    <option value="">Select...</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0E1730] dark:text-slate-300 mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    value={reqLocation}
                    onChange={(e) => setReqLocation(e.target.value)}
                    placeholder="e.g. sed"
                    className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-[#0E1730] dark:text-white placeholder-[#8D97B0] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0E1730] dark:text-slate-300 mb-1.5">
                    Experience (years)
                  </label>
                  <input
                    type="text"
                    value={reqExperience}
                    onChange={(e) => setReqExperience(e.target.value)}
                    placeholder="e.g. 2"
                    className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-[#0E1730] dark:text-white placeholder-[#8D97B0] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0E1730] dark:text-slate-300 mb-1.5">
                    Budget CTC (₹/year)
                  </label>
                  <input
                    type="text"
                    value={reqBudgetCtc}
                    onChange={(e) => setReqBudgetCtc(e.target.value)}
                    placeholder="e.g. 120000"
                    className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-[#0E1730] dark:text-white placeholder-[#8D97B0] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0E1730] dark:text-slate-300 mb-1.5">
                    Reason <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={reqReason}
                    onChange={(e) => setReqReason(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-[#0E1730] dark:text-white focus:outline-none focus:border-[#2563EB]"
                  >
                    <option value="">Select...</option>
                    <option value="New position">New position</option>
                    <option value="New headcount expansion">New headcount expansion</option>
                    <option value="Replacement">Replacement</option>
                    <option value="Project ramp up">Project ramp up</option>
                    <option value="Seasonal workload">Seasonal workload</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0E1730] dark:text-slate-300 mb-1.5">
                    Replacing
                  </label>
                  <select
                    value={reqReplacing}
                    onChange={(e) => setReqReplacing(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-[#0E1730] dark:text-white focus:outline-none focus:border-[#2563EB]"
                  >
                    <option value="">No employees yet</option>
                    {employees.map((emp) => (
                      <option key={emp.emp_id} value={emp.full_name}>
                        {emp.full_name} ({emp.employee_code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0E1730] dark:text-slate-300 mb-1.5">
                    Hiring manager
                  </label>
                  <select
                    value={reqHiringManager}
                    onChange={(e) => setReqHiringManager(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-[#0E1730] dark:text-white focus:outline-none focus:border-[#2563EB]"
                  >
                    <option value="">No employees yet</option>
                    <option value="Ananya Rao">Ananya Rao (People Ops Lead)</option>
                    <option value="Karthik Reddy">Karthik Reddy (VP Engineering)</option>
                    <option value="Vikram Sharma">Vikram Sharma (Head of AI)</option>
                    {employees.map((emp) => (
                      <option key={emp.emp_id} value={emp.full_name}>
                        {emp.full_name} ({emp.job_title})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0E1730] dark:text-slate-300 mb-1.5">
                    Required by <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={reqRequiredBy}
                    onChange={(e) => setReqRequiredBy(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-[#0E1730] dark:text-white focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0E1730] dark:text-slate-300 mb-1.5">
                    Status <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={reqStatus}
                    onChange={(e) => setReqStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-[#0E1730] dark:text-white focus:outline-none focus:border-[#2563EB]"
                  >
                    <option value="">Select...</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="On hold">On hold</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0E1730] dark:text-slate-300 mb-1.5">
                  Job description
                </label>
                <textarea
                  rows={3}
                  value={reqJobDesc}
                  onChange={(e) => setReqJobDesc(e.target.value)}
                  placeholder="Outline key responsibilities and required qualifications..."
                  className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-[#0E1730] dark:text-white placeholder-[#8D97B0] focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddReqModalOpen(false);
                    setIsEditReqModalOpen(false);
                  }}
                  className="px-5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Saving...' : isEditReqModalOpen ? 'Save changes' : 'Add requirement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 2: ADD CANDIDATE                                                */}
      {/* ===================================================================== */}
      {isAddCandModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
          <div className="bg-white dark:bg-[#070D1E] w-full max-w-[620px] rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 relative animate-in zoom-in-95 duration-150 my-8">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0E1730] dark:text-white font-heading">
              Add candidate
            </h3>
            <p className="text-xs sm:text-sm text-[#5B6787] dark:text-slate-400 mt-1 mb-5">
              Fields marked <span className="text-rose-500 font-bold">*</span> are required.
            </p>

            <form onSubmit={handleCreateCandidate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0E1730] dark:text-slate-300 mb-1.5">
                    Full name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={candName}
                    onChange={(e) => setCandName(e.target.value)}
                    placeholder="e.g. Arun Krishnan"
                    className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-[#0E1730] dark:text-white placeholder-[#8D97B0] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0E1730] dark:text-slate-300 mb-1.5">
                    Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={candEmail}
                    onChange={(e) => setCandEmail(e.target.value)}
                    placeholder="e.g. arun.krishnan@example.com"
                    className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-[#0E1730] dark:text-white placeholder-[#8D97B0] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0E1730] dark:text-slate-300 mb-1.5">
                    Phone <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={candPhone}
                    onChange={(e) => setCandPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-[#0E1730] dark:text-white placeholder-[#8D97B0] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0E1730] dark:text-slate-300 mb-1.5">
                    Applied for
                  </label>
                  <select
                    value={candAppliedFor}
                    onChange={(e) => setCandAppliedFor(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-[#0E1730] dark:text-white focus:outline-none focus:border-[#2563EB]"
                  >
                    {jobs.length === 0 ? (
                      <option value="">Nothing to choose yet</option>
                    ) : (
                      jobs.map((j) => (
                        <option key={j.id} value={j.title}>
                          {j.title} ({j.department})
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0E1730] dark:text-slate-300 mb-1.5">
                    Source <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={candSource}
                    onChange={(e) => setCandSource(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-[#0E1730] dark:text-white focus:outline-none focus:border-[#2563EB]"
                  >
                    <option value="">Select...</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Career portal">Career portal</option>
                    <option value="Referral">Referral</option>
                    <option value="Naukri">Naukri</option>
                    <option value="Direct application">Direct application</option>
                    <option value="Agency">Agency</option>
                    <option value="Campus">Campus</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0E1730] dark:text-slate-300 mb-1.5">
                    Total experience (years)
                  </label>
                  <input
                    type="text"
                    value={candExp}
                    onChange={(e) => setCandExp(e.target.value)}
                    placeholder="e.g. 4.5"
                    className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-[#0E1730] dark:text-white placeholder-[#8D97B0] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0E1730] dark:text-slate-300 mb-1.5">
                    Current CTC (₹/year)
                  </label>
                  <input
                    type="text"
                    value={candCurrentCtc}
                    onChange={(e) => setCandCurrentCtc(e.target.value)}
                    placeholder="e.g. 14,00,000"
                    className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-[#0E1730] dark:text-white placeholder-[#8D97B0] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0E1730] dark:text-slate-300 mb-1.5">
                    Expected CTC (₹/year)
                  </label>
                  <input
                    type="text"
                    value={candExpectedCtc}
                    onChange={(e) => setCandExpectedCtc(e.target.value)}
                    placeholder="e.g. 18,00,000"
                    className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-[#0E1730] dark:text-white placeholder-[#8D97B0] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0E1730] dark:text-slate-300 mb-1.5">
                    Notice period (days)
                  </label>
                  <input
                    type="text"
                    value={candNoticePeriod}
                    onChange={(e) => setCandNoticePeriod(e.target.value)}
                    placeholder="e.g. 30"
                    className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-[#0E1730] dark:text-white placeholder-[#8D97B0] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0E1730] dark:text-slate-300 mb-1.5">
                    Current location
                  </label>
                  <input
                    type="text"
                    value={candLocation}
                    onChange={(e) => setCandLocation(e.target.value)}
                    placeholder="e.g. Bengaluru"
                    className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-[#0E1730] dark:text-white placeholder-[#8D97B0] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0E1730] dark:text-slate-300 mb-1.5">
                  Resume
                </label>
                <div className="flex items-center gap-3 p-2 border border-[#CBD5E1] dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-xs">
                  <input
                    type="file"
                    id="resume-upload"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setCandResumeFile(e.target.files[0]);
                      }
                    }}
                    className="text-xs file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 dark:file:bg-slate-800 file:text-slate-700 dark:file:text-slate-200 hover:file:bg-slate-200 cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0E1730] dark:text-slate-300 mb-1.5">
                    Consent to store data <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={candConsent}
                    onChange={(e) => setCandConsent(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-[#0E1730] dark:text-white focus:outline-none focus:border-[#2563EB]"
                  >
                    <option value="">Select...</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0E1730] dark:text-slate-300 mb-1.5">
                    Stage <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={candStage}
                    onChange={(e) => setCandStage(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-[#0E1730] dark:text-white focus:outline-none focus:border-[#2563EB]"
                  >
                    <option value="">Select...</option>
                    <option value="Overdue">Overdue</option>
                    <option value="Applied">Applied</option>
                    <option value="Screening">Screening</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Hired">Hired</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddCandModalOpen(false)}
                  className="px-5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Adding...' : 'Add candidate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 3: ADD INTERVIEW (Matches Screenshot 1)                         */}
      {/* ===================================================================== */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
          <div className="bg-white dark:bg-[#070D1E] w-full max-w-[620px] rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 relative animate-in zoom-in-95 duration-150 my-8">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0E1730] dark:text-white font-heading">
              {editingInterviewId ? 'Edit interview' : 'Add interview'}
            </h3>
            <p className="text-xs sm:text-sm text-[#5B6787] dark:text-slate-400 mt-1 mb-5">
              Fields marked <span className="text-rose-500 font-bold">*</span> are required.
            </p>

            <form onSubmit={handleScheduleInterviewSubmit} className="space-y-4">
              {/* Row 1: Candidate * */}
              <div>
                <label className="block text-xs font-bold text-[#0E1730] dark:text-slate-300 mb-1.5">
                  Candidate <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={intvCandName}
                  onChange={(e) => {
                    setIntvCandName(e.target.value);
                    const cand = candidates.find((c) => c.full_name === e.target.value);
                    if (cand && cand.job_title) setIntvRole(cand.job_title);
                  }}
                  className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-[#0E1730] dark:text-white focus:outline-none focus:border-[#2563EB]"
                >
                  <option value="">Nothing to choose yet</option>
                  {candidates.map((c) => (
                    <option key={c.id} value={c.full_name}>
                      {c.full_name} ({c.job_title || 'Applicant'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Row 2: Round * | Mode * */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0E1730] dark:text-slate-300 mb-1.5">
                    Round <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={intvRound}
                    onChange={(e) => setIntvRound(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-[#0E1730] dark:text-white focus:outline-none focus:border-[#2563EB]"
                  >
                    <option value="">Select...</option>
                    <option value="Phone screen">Phone screen</option>
                    <option value="Technical round 1">Technical round 1</option>
                    <option value="Technical round 2">Technical round 2</option>
                    <option value="System design">System design</option>
                    <option value="Culture fit">Culture fit</option>
                    <option value="Leadership review">Leadership review</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0E1730] dark:text-slate-300 mb-1.5">
                    Mode <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={intvMode}
                    onChange={(e) => setIntvMode(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-[#0E1730] dark:text-white focus:outline-none focus:border-[#2563EB]"
                  >
                    <option value="">Select...</option>
                    <option value="Video">Video</option>
                    <option value="In-person">In-person</option>
                    <option value="Phone">Phone</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Date * | Time * */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0E1730] dark:text-slate-300 mb-1.5">
                    Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={intvDate}
                    onChange={(e) => setIntvDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-[#0E1730] dark:text-white focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0E1730] dark:text-slate-300 mb-1.5">
                    Time <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="time"
                    required
                    value={intvTime}
                    onChange={(e) => setIntvTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-[#0E1730] dark:text-white focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              {/* Row 4: Interviewer | Venue or meeting link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0E1730] dark:text-slate-300 mb-1.5">
                    Interviewer
                  </label>
                  <select
                    value={intvInterviewer}
                    onChange={(e) => setIntvInterviewer(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-[#0E1730] dark:text-white focus:outline-none focus:border-[#2563EB]"
                  >
                    <option value="">No employees yet</option>
                    <option value="Ananya Rao">Ananya Rao (People Ops Lead)</option>
                    <option value="Karthik Reddy">Karthik Reddy (VP Engineering)</option>
                    <option value="Vikram Sharma">Vikram Sharma (Head of AI)</option>
                    {employees.map((emp) => (
                      <option key={emp.emp_id} value={emp.full_name}>
                        {emp.full_name} ({emp.job_title})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0E1730] dark:text-slate-300 mb-1.5">
                    Venue or meeting link
                  </label>
                  <input
                    type="text"
                    value={intvVenueLink}
                    onChange={(e) => setIntvVenueLink(e.target.value)}
                    placeholder="https://meet.google.com/abc-xyz"
                    className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-[#0E1730] dark:text-white placeholder-[#8D97B0] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              {/* Row 5: Rating (1-5) | Result */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0E1730] dark:text-slate-300 mb-1.5">
                    Rating (1–5)
                  </label>
                  <select
                    value={intvRating}
                    onChange={(e) => setIntvRating(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-[#0E1730] dark:text-white focus:outline-none focus:border-[#2563EB]"
                  >
                    <option value="Select...">Select...</option>
                    <option value="5">5 - Exceptional</option>
                    <option value="4">4 - Strong Hire</option>
                    <option value="3">3 - Hire</option>
                    <option value="2">2 - Needs Review</option>
                    <option value="1">1 - Reject</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0E1730] dark:text-slate-300 mb-1.5">
                    Result
                  </label>
                  <select
                    value={intvResult}
                    onChange={(e) => setIntvResult(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-[#0E1730] dark:text-white focus:outline-none focus:border-[#2563EB]"
                  >
                    <option value="">Select...</option>
                    <option value="Pending">Pending</option>
                    <option value="Passed">Passed</option>
                    <option value="Strong Hire">Strong Hire</option>
                    <option value="Needs review">Needs review</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
              </div>

              {/* Row 6: Feedback */}
              <div>
                <label className="block text-xs font-bold text-[#0E1730] dark:text-slate-300 mb-1.5">
                  Feedback
                </label>
                <textarea
                  rows={3}
                  value={intvFeedback}
                  onChange={(e) => setIntvFeedback(e.target.value)}
                  placeholder="Notes, score impressions, or candidate answers..."
                  className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-[#0E1730] dark:text-white placeholder-[#8D97B0] focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* Row 7: Status * */}
              <div>
                <label className="block text-xs font-bold text-[#0E1730] dark:text-slate-300 mb-1.5">
                  Status <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={intvStatus}
                  onChange={(e) => setIntvStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-[#0E1730] dark:text-white focus:outline-none focus:border-[#2563EB]"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Rescheduled">Rescheduled</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsScheduleModalOpen(false);
                    resetIntvForm();
                  }}
                  className="px-5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (editingInterviewId ? 'Saving...' : 'Adding...') : (editingInterviewId ? 'Update interview' : 'Add interview')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 4: ADD OFFER (Matches Screenshot 3)                             */}
      {/* ===================================================================== */}
      {isAddOfferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
          <div className="bg-white dark:bg-[#070D1E] w-full max-w-[620px] rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 relative animate-in zoom-in-95 duration-150 my-8">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0E1730] dark:text-white font-heading">
              Add offer
            </h3>
            <p className="text-xs sm:text-sm text-[#5B6787] dark:text-slate-400 mt-1 mb-5">
              Fields marked <span className="text-rose-500 font-bold">*</span> are required.
            </p>

            <form onSubmit={handleCreateOfferSubmit} className="space-y-4">
              {/* Candidate * */}
              <div>
                <label className="block text-xs font-bold text-[#0E1730] dark:text-slate-300 mb-1.5">
                  Candidate <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={offerCandName}
                  onChange={(e) => {
                    setOfferCandName(e.target.value);
                    const c = candidates.find((cand) => cand.full_name === e.target.value);
                    if (c && c.job_title) setOfferDesignation(c.job_title);
                  }}
                  className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-[#0E1730] dark:text-white focus:outline-none focus:border-[#2563EB]"
                >
                  <option value="">Nothing to choose yet</option>
                  {candidates.map((cand) => (
                    <option key={cand.id} value={cand.full_name}>
                      {cand.full_name} ({cand.job_title || 'Applicant'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Designation * | Department * */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0E1730] dark:text-slate-300 mb-1.5">
                    Designation <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={offerDesignation}
                    onChange={(e) => setOfferDesignation(e.target.value)}
                    placeholder="e.g. Senior Backend Engineer"
                    className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-[#0E1730] dark:text-white placeholder-[#8D97B0] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0E1730] dark:text-slate-300 mb-1.5">
                    Department <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={offerDept}
                    onChange={(e) => setOfferDept(e.target.value)}
                    placeholder="e.g. Engineering"
                    className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-[#0E1730] dark:text-white placeholder-[#8D97B0] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              {/* Annual CTC (₹) * | Joining date * */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0E1730] dark:text-slate-300 mb-1.5">
                    Annual CTC (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={offerAnnualCtc}
                    onChange={(e) => setOfferAnnualCtc(e.target.value)}
                    placeholder="e.g. 1800000"
                    className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-[#0E1730] dark:text-white placeholder-[#8D97B0] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0E1730] dark:text-slate-300 mb-1.5">
                    Joining date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={offerJoiningDate}
                    onChange={(e) => setOfferJoiningDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-[#0E1730] dark:text-white focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              {/* Offer date * | Valid till * */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0E1730] dark:text-slate-300 mb-1.5">
                    Offer date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={offerDate}
                    onChange={(e) => setOfferDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-[#0E1730] dark:text-white focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0E1730] dark:text-slate-300 mb-1.5">
                    Valid till <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={offerValidTill}
                    onChange={(e) => setOfferValidTill(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-[#0E1730] dark:text-white focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              {/* Approved by | Offer letter file */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0E1730] dark:text-slate-300 mb-1.5">
                    Approved by
                  </label>
                  <select
                    value={offerApprovedBy}
                    onChange={(e) => setOfferApprovedBy(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-[#0E1730] dark:text-white focus:outline-none focus:border-[#2563EB]"
                  >
                    <option value="">No employees yet</option>
                    <option value="Ananya Rao">Ananya Rao (People Ops Lead)</option>
                    <option value="Naresh Vemparala">Naresh Vemparala (CEO)</option>
                    <option value="Karthik Reddy">Karthik Reddy (VP Engineering)</option>
                    {employees.map((emp) => (
                      <option key={emp.emp_id} value={emp.full_name}>
                        {emp.full_name} ({emp.job_title})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0E1730] dark:text-slate-300 mb-1.5">
                    Offer letter file
                  </label>
                  <div className="flex items-center gap-3 p-2 border border-[#CBD5E1] dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-xs">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setOfferFile(e.target.files[0]);
                        }
                      }}
                      className="text-xs file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 dark:file:bg-slate-800 file:text-slate-700 dark:file:text-slate-200 hover:file:bg-slate-200 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Status * */}
              <div>
                <label className="block text-xs font-bold text-[#0E1730] dark:text-slate-300 mb-1.5">
                  Status <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={offerStatus}
                  onChange={(e) => setOfferStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-slate-900 border border-[#CBD5E1] dark:border-slate-700 rounded-xl text-[#0E1730] dark:text-white focus:outline-none focus:border-[#2563EB]"
                >
                  <option value="">Select...</option>
                  <option value="Draft">Draft</option>
                  <option value="Pending approval">Pending approval</option>
                  <option value="Sent">Sent</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Declined">Declined</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddOfferModalOpen(false)}
                  className="px-5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl shadow-sm transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Adding...' : 'Add offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
