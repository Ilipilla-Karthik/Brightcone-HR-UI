import api from './client';
import type { LeaveRequest } from '../types';

export interface LeaveApplyParams {
  employee_code?: string;
  employee_name?: string;
  leave_type: string;
  from_date: string;
  to_date: string;
  days?: string;
  reason: string;
}

export const leaveApi = {
  listMy: async (): Promise<LeaveRequest[]> => {
    const res = await api.get<LeaveRequest[]>('/leave/my');
    return res.data;
  },
  apply: async (data: LeaveApplyParams): Promise<LeaveRequest> => {
    const res = await api.post<LeaveRequest>('/leave/apply', data);
    return res.data;
  },
};
