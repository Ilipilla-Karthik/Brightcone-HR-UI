import { apiClient } from './client';
import {
  CreateGoalPayload,
  CreateReviewPayload,
  Goal,
  PerformanceReview,
} from '../types/performance.types';

export const performanceApi = {
  getGoals: async (): Promise<Goal[]> => {
    const res = await apiClient.get<Goal[]>('/api/performance/goals');
    return res.data;
  },

  createGoal: async (payload: CreateGoalPayload): Promise<Goal> => {
    const res = await apiClient.post<Goal>('/api/performance/goals', payload);
    return res.data;
  },

  updateGoalProgress: async (id: number, progress: number): Promise<void> => {
    await apiClient.put(`/api/performance/goals/${id}/progress`, { progress });
  },

  getReviews: async (): Promise<PerformanceReview[]> => {
    const res = await apiClient.get<PerformanceReview[]>('/api/performance/reviews');
    return res.data;
  },

  createReview: async (payload: CreateReviewPayload): Promise<PerformanceReview> => {
    const res = await apiClient.post<PerformanceReview>('/api/performance/reviews', payload);
    return res.data;
  },
};
