import api from './client';
import type { Candidate, Interview, Job, Offer, Referral } from '../types';

export const recruitmentApi = {
  // Jobs
  listJobs: async (): Promise<Job[]> => {
    const res = await api.get<Job[]>('/jobs');
    return res.data;
  },

  createJob: async (data: {
    title: string;
    department: string;
    location: string;
    employment_type: string;
    referral_bonus: number;
    description?: string;
  }): Promise<Job> => {
    const res = await api.post<Job>('/jobs', data);
    return res.data;
  },

  updateJob: async (id: string, data: Partial<Job>): Promise<Job> => {
    const res = await api.patch<Job>(`/jobs/${id}`, data);
    return res.data;
  },

  publishJob: async (id: string): Promise<Job> => {
    const res = await api.post<Job>(`/jobs/${id}/publish`);
    return res.data;
  },

  closeJob: async (id: string): Promise<Job> => {
    const res = await api.post<Job>(`/jobs/${id}/close`);
    return res.data;
  },

  deleteJob: async (id: string): Promise<void> => {
    await api.delete(`/jobs/${id}`);
  },

  // Candidates
  listCandidates: async (): Promise<Candidate[]> => {
    const res = await api.get<Candidate[]>('/candidates');
    return res.data;
  },

  createCandidate: async (data: Partial<Candidate>): Promise<Candidate> => {
    const res = await api.post<Candidate>('/candidates', data);
    return res.data;
  },

  updateCandidate: async (id: string, data: Partial<Candidate>): Promise<Candidate> => {
    const res = await api.patch<Candidate>(`/candidates/${id}`, data);
    return res.data;
  },

  deleteCandidate: async (id: string): Promise<void> => {
    await api.delete(`/candidates/${id}`);
  },

  // Applications
  updateApplicationStage: async (
    id: string,
    stage: string,
    reason?: string,
    changed_by?: string
  ) => {
    const res = await api.patch(`/applications/${id}/status`, {
      stage,
      reason,
      changed_by,
    });
    return res.data;
  },

  // Interviews
  listInterviews: async (): Promise<Interview[]> => {
    const res = await api.get<Interview[]>('/interviews');
    return res.data;
  },

  scheduleInterview: async (data: {
    candidate_name: string;
    job_title: string;
    round_name: string;
    scheduled_at: string;
    panel: string;
    notes?: string;
  }): Promise<Interview> => {
    const res = await api.post<Interview>('/interviews', data);
    return res.data;
  },

  cancelInterview: async (id: string): Promise<Interview> => {
    const res = await api.post<Interview>(`/interviews/${id}/cancel`);
    return res.data;
  },

  updateInterview: async (id: string, data: Partial<Interview>): Promise<Interview> => {
    const res = await api.patch<Interview>(`/interviews/${id}`, data);
    return res.data;
  },

  deleteInterview: async (id: string): Promise<void> => {
    await api.delete(`/interviews/${id}`);
  },

  // Offers
  listOffers: async (): Promise<Offer[]> => {
    const res = await api.get<Offer[]>('/offers');
    return res.data;
  },

  createOffer: async (data: Partial<Offer>): Promise<Offer> => {
    const res = await api.post<Offer>('/offers', data);
    return res.data;
  },

  // Referrals
  listReferrals: async (): Promise<Referral[]> => {
    const res = await api.get<Referral[]>('/referrals');
    return res.data;
  },

  createReferral: async (data: Partial<Referral>): Promise<Referral> => {
    const res = await api.post<Referral>('/referrals', data);
    return res.data;
  },
};
