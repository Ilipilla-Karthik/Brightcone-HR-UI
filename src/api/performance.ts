import api from './client';
import type { Goal, PerformanceSummary, Review } from '../types';

export const performanceApi = {
  getSummary: async (): Promise<PerformanceSummary> => {
    const res = await api.get<PerformanceSummary>('/performance/summary');
    return res.data;
  },

  listGoals: async (): Promise<Goal[]> => {
    const res = await api.get<Goal[]>('/performance/goals');
    return res.data;
  },

  createGoal: async (data: Partial<Goal>): Promise<Goal> => {
    const res = await api.post<Goal>('/performance/goals', data);
    return res.data;
  },

  updateGoal: async (id: string, data: Partial<Goal>): Promise<Goal> => {
    const res = await api.patch<Goal>(`/performance/goals/${id}`, data);
    return res.data;
  },

  listReviews: async (): Promise<Review[]> => {
    const res = await api.get<Review[]>('/performance/reviews');
    return res.data;
  },

  createReview: async (data: Partial<Review>): Promise<Review> => {
    const res = await api.post<Review>('/performance/reviews', data);
    return res.data;
  },

  updateReview: async (id: string, data: Partial<Review>): Promise<Review> => {
    const res = await api.patch<Review>(`/performance/reviews/${id}`, data);
    return res.data;
  },
};
