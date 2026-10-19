import api from './client';
import type { ResignationRequest } from '../types';

export interface ResignationParams {
  employee_code?: string;
  employee_name?: string;
  reason: string;
  proposed_last_day: string;
  notice_period_days?: number;
}

export const resignationApi = {
  listMy: async (): Promise<ResignationRequest[]> => {
    const res = await api.get<ResignationRequest[]>('/resignation/my');
    return res.data;
  },
  initiate: async (data: ResignationParams): Promise<ResignationRequest> => {
    const res = await api.post<ResignationRequest>('/resignation/initiate', data);
    return res.data;
  },
};
