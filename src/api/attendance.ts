import api from './client';
import type { AttendanceRecord } from '../types';

export interface AttendanceStatusResponse {
  is_checked_in: boolean;
  last_clock_in?: string | null;
  last_clock_out?: string | null;
  today_hours?: string | null;
}

export const attendanceApi = {
  listMy: async (): Promise<AttendanceRecord[]> => {
    const res = await api.get<AttendanceRecord[]>('/attendance/my');
    return res.data;
  },
  getStatus: async (): Promise<AttendanceStatusResponse> => {
    const res = await api.get<AttendanceStatusResponse>('/attendance/status');
    return res.data;
  },
  clock: async (work_mode?: string): Promise<{ action: string; message: string; record: AttendanceRecord; is_checked_in: boolean }> => {
    const res = await api.post('/attendance/clock', { work_mode });
    return res.data;
  },
};
