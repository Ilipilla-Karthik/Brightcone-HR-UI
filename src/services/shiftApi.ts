import type {
  Shift,
  Holiday,
  LeaveType,
  LeaveQuota,
  Employee,
  LeaveCalculationResult,
  LeaveRequest,
  CreateLeaveRequestPayload,
  LeaveBalanceResponse,
  WorkFromHomeRequest,
  CreateWfhPayload,
  CompOffBalance,
  CompOffEntitlement,
  CompOffRequest,
  GrantCompOffPayload,
  CreateCompOffRequestPayload,
  SwapRequestDetail,
  CreateSwapPayload,
  CountLeaveDaysRequest,
} from '../types';
import {
  INITIAL_LEAVE_TYPES,
  INITIAL_LEAVE_QUOTAS,
  INITIAL_SHIFTS,
  INITIAL_SWAP_REQUESTS,
  DEFAULT_EMPLOYEES_LIST,
} from './shiftMockData';

export { INITIAL_LEAVE_TYPES, INITIAL_LEAVE_QUOTAS };

export const API_BASE_URL = '/api';

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  isLiveApi?: boolean;
}

export async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    let errorMsg = `API Error (${res.status}): ${res.statusText}`;
    try {
      const errJson = await res.json();
      if (errJson && errJson.error) errorMsg = errJson.error;
    } catch {}
    throw new Error(errorMsg);
  }
  return res.json();
}

const SWAP_STORAGE_KEY = 'brightcone_swap_requests';

export const shiftApi = {
  async fetchEmployees(): Promise<ApiResponse<Employee[]>> {
    try {
      const data = await request<any>('/v1/employees');
      const list = Array.isArray(data) ? data : (data as any)?.value || [];
      const mapped = list.map((e: any, idx: number) => ({
        id: e.id || idx + 1,
        name: e.full_name || e.fullName || e.name || `${e.first_name || ''} ${e.last_name || ''}`.trim() || 'Team Member',
        email: e.work_email || e.email || `employee${idx + 1}@brightcone.ai`,
        role: e.job_title || e.designation || e.role || 'Software Engineer',
        department: e.department || 'Engineering',
        avatar_color: idx % 2 === 0 ? 'bg-purple-600' : 'bg-blue-600',
        is_active: true,
      }));
      return { data: mapped.length > 0 ? mapped : DEFAULT_EMPLOYEES_LIST, error: null };
    } catch {
      return { data: DEFAULT_EMPLOYEES_LIST, error: null };
    }
  },

  async fetchShifts(): Promise<ApiResponse<Shift[]>> {
    try {
      const data = await request<any[]>('/v1/shifts');
      const list = Array.isArray(data) ? data : [];
      return { data: list.map((s: any) => ({
        id: s.id,
        name: s.name,
        code: s.code,
        start_time: s.startTime || s.start_time || '09:00',
        end_time: s.endTime || s.end_time || '18:00',
        break_duration_minutes: s.breakDurationMinutes || s.break_duration_minutes || 60,
        grace_period_minutes: s.gracePeriodMinutes || s.grace_period_minutes || 15,
        is_overnight: s.isOvernight ?? s.is_overnight ?? false,
        is_active: s.isActive ?? s.is_active ?? true,
      })), error: null };
    } catch {
      return { data: INITIAL_SHIFTS, error: null };
    }
  },

  async createShift(payload: any): Promise<boolean> {
    await request('/v1/shifts', { method: 'POST', body: JSON.stringify(payload) }).catch(() => {});
    return true;
  },

  async updateShift(id: number, payload: any): Promise<boolean> {
    await request(`/v1/shifts/${id}`, { method: 'PUT', body: JSON.stringify(payload) }).catch(() => {});
    return true;
  },

  async deleteShift(id: number): Promise<boolean> {
    await request(`/v1/shifts/${id}`, { method: 'DELETE' }).catch(() => {});
    return true;
  },

  async fetchHolidays(): Promise<ApiResponse<Holiday[]>> {
    try {
      const data = await request<any[]>('/v1/holidays');
      const list = Array.isArray(data) ? data : [];
      return { data: list.map((h: any) => ({
        id: h.id,
        name: h.name,
        holiday_date: h.holidayDate || h.holiday_date,
        description: h.description,
        applicable_location: h.applicableLocation || h.applicable_location || null,
        is_recurring: h.isRecurring ?? h.is_recurring ?? true,
      })), error: null };
    } catch {
      return { data: [], error: null };
    }
  },

  async fetchLeaveTypes(): Promise<ApiResponse<LeaveType[]>> {
    return { data: INITIAL_LEAVE_TYPES, error: null };
  },

  async fetchLeaveQuotas(): Promise<ApiResponse<LeaveQuota[]>> {
    return { data: INITIAL_LEAVE_QUOTAS, error: null };
  },

  async fetchLeaveBalances(employeeId: number, year = 2026): Promise<ApiResponse<LeaveBalanceResponse>> {
    return {
      data: {
        employee_id: employeeId,
        year,
        balances: [
          { leave_type_id: 1, leave_type_name: 'Casual Leave', leave_type_code: 'CL', is_paid: true, entitled_days: 12, consumed_days: 0, pending_days: 0, remaining_days: 12 },
          { leave_type_id: 2, leave_type_name: 'Sick Leave', leave_type_code: 'SL', is_paid: true, entitled_days: 12, consumed_days: 0, pending_days: 0, remaining_days: 12 },
          { leave_type_id: 4, leave_type_name: 'Maternity Leave', leave_type_code: 'ML', is_paid: true, entitled_days: 182, consumed_days: 0, pending_days: 0, remaining_days: 182 },
          { leave_type_id: 5, leave_type_name: 'Leave Without Pay', leave_type_code: 'LWP', is_paid: false, entitled_days: 12, consumed_days: 0, pending_days: 0, remaining_days: 0 },
          { leave_type_id: 6, leave_type_name: 'Bereavement Leave', leave_type_code: 'BL', is_paid: true, entitled_days: 12, consumed_days: 0, pending_days: 0, remaining_days: 12 },
        ],
      },
      error: null,
    };
  },

  async fetchLeaveRequests(_params?: any): Promise<ApiResponse<LeaveRequest[]>> {
    return { data: [], error: null };
  },

  async createLeaveRequest(payload: CreateLeaveRequestPayload): Promise<any> {
    return { id: 1, ...payload, status: 'PENDING' };
  },

  async approveLeaveRequest(id: number, payload?: any): Promise<any> {
    return { id, ...payload, status: 'APPROVED' };
  },

  async rejectLeaveRequest(id: number, payload?: any): Promise<any> {
    return { id, ...payload, status: 'REJECTED' };
  },

  async cancelLeaveRequest(_id: number): Promise<boolean> {
    return true;
  },

  async calculateLeaveDays(payload: any): Promise<ApiResponse<LeaveCalculationResult>> {
    const s = new Date(payload.start_date);
    const e = new Date(payload.end_date);
    const diff = Math.max(1, Math.round((e.getTime() - s.getTime()) / (1000 * 3600 * 24)) + 1);
    const chargeable = payload.is_half_day ? 0.5 : diff;
    return {
      data: {
        start_date: payload.start_date,
        end_date: payload.end_date,
        total_calendar_days: diff,
        chargeable_days: chargeable,
        weekend_days_count: 0,
        weekend_days: 0,
        holidays_count: 0,
        holiday_days: 0,
        working_days: diff,
        policy_applied: 'Standard Policy',
        leave_type_code: payload.leave_type_code,
        breakdown: [],
      },
      error: null,
    };
  },

  async countLeaveDays(payload: CountLeaveDaysRequest): Promise<any> {
    const res = await this.calculateLeaveDays(payload);
    return res.data;
  },

  async fetchWfhRequests(_params?: any): Promise<ApiResponse<WorkFromHomeRequest[]>> {
    return { data: [], error: null };
  },

  async createWfhRequest(payload: CreateWfhPayload): Promise<any> {
    return { id: 1, ...payload, status: 'PENDING' };
  },

  async approveWfhRequest(id: number, payload?: any): Promise<any> {
    return { id, ...payload, status: 'APPROVED' };
  },

  async rejectWfhRequest(id: number, payload?: any): Promise<any> {
    return { id, ...payload, status: 'REJECTED' };
  },

  async fetchCompOffBalance(employeeId: number): Promise<ApiResponse<CompOffBalance>> {
    return {
      data: {
        employee_id: employeeId,
        available_days: 0.0,
        total_earned_days: 0.0,
        used_days: 0.0,
        pending_days: 0.0,
      },
      error: null,
    };
  },

  async getCompOffBalance(employeeId: number): Promise<ApiResponse<CompOffBalance>> {
    return this.fetchCompOffBalance(employeeId);
  },

  async fetchCompOffRequests(_params?: any): Promise<ApiResponse<CompOffRequest[]>> {
    return { data: [], error: null };
  },

  async fetchCompOffEntitlements(_employeeId?: number): Promise<ApiResponse<CompOffEntitlement[]>> {
    return { data: [], error: null };
  },

  async grantCompOffEntitlement(payload: GrantCompOffPayload): Promise<any> {
    return { id: 1, ...payload, status: 'ACTIVE' };
  },

  async createCompOffRequest(payload: CreateCompOffRequestPayload): Promise<any> {
    return { id: 1, ...payload, status: 'PENDING' };
  },

  async approveCompOffRequest(id: number, payload?: any): Promise<any> {
    return { id, ...payload, status: 'APPROVED' };
  },

  async rejectCompOffRequest(id: number, payload?: any): Promise<any> {
    return { id, ...payload, status: 'REJECTED' };
  },

  async fetchSwapRequests(params?: any): Promise<ApiResponse<SwapRequestDetail[]>> {
    let list: SwapRequestDetail[] = INITIAL_SWAP_REQUESTS;
    try {
      const raw = localStorage.getItem(SWAP_STORAGE_KEY);
      if (raw) {
        list = JSON.parse(raw);
      } else {
        localStorage.setItem(SWAP_STORAGE_KEY, JSON.stringify(INITIAL_SWAP_REQUESTS));
      }
    } catch {}

    if (params?.status && params.status !== 'ALL') {
      list = list.filter((r) => r.status === params.status);
    }
    if (params?.employee_id) {
      list = list.filter((r) => r.requester_id === params.employee_id || r.target_employee_id === params.employee_id);
    }

    return { data: list, error: null };
  },

  async createSwapRequest(payload: CreateSwapPayload): Promise<any> {
    const raw = localStorage.getItem(SWAP_STORAGE_KEY);
    const list: SwapRequestDetail[] = raw ? JSON.parse(raw) : INITIAL_SWAP_REQUESTS;
    const emps = DEFAULT_EMPLOYEES_LIST;
    const reqEmp = emps.find(e => e.id === payload.requester_id);
    const tgtEmp = emps.find(e => e.id === payload.target_employee_id);

    const newReq: SwapRequestDetail = {
      id: Date.now(),
      requester_id: payload.requester_id,
      requester_name: reqEmp ? reqEmp.name : 'Rahul Varma',
      requester_email: reqEmp ? reqEmp.email : 'rahul.varma@brightcone.ai',
      source_shift_code: 'GEN',
      request_date: payload.request_date,
      target_employee_id: payload.target_employee_id,
      target_employee_name: tgtEmp ? tgtEmp.name : 'Ananya Rao',
      target_shift_code: 'MORN',
      target_date: payload.target_date,
      reason: payload.reason,
      status: 'PENDING',
      created_at: new Date().toISOString(),
    };
    const updated = [newReq, ...list];
    try {
      localStorage.setItem(SWAP_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
    return newReq;
  },

  async approveSwapRequest(id: number, payload?: any): Promise<any> {
    const raw = localStorage.getItem(SWAP_STORAGE_KEY);
    const list: SwapRequestDetail[] = raw ? JSON.parse(raw) : INITIAL_SWAP_REQUESTS;
    const updated = list.map((r) => (r.id === id ? { ...r, status: 'APPROVED' as const, ...payload } : r));
    try {
      localStorage.setItem(SWAP_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
    return { id, status: 'APPROVED' };
  },

  async rejectSwapRequest(id: number, payload?: any): Promise<any> {
    const raw = localStorage.getItem(SWAP_STORAGE_KEY);
    const list: SwapRequestDetail[] = raw ? JSON.parse(raw) : INITIAL_SWAP_REQUESTS;
    const updated = list.map((r) => (r.id === id ? { ...r, status: 'REJECTED' as const, ...payload } : r));
    try {
      localStorage.setItem(SWAP_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
    return { id, status: 'REJECTED' };
  },

  async cancelSwapRequest(id: number): Promise<boolean> {
    const raw = localStorage.getItem(SWAP_STORAGE_KEY);
    const list: SwapRequestDetail[] = raw ? JSON.parse(raw) : INITIAL_SWAP_REQUESTS;
    const updated = list.filter((r) => r.id !== id);
    try {
      localStorage.setItem(SWAP_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
    return true;
  },

  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch('/api/v1/health');
      return res.ok;
    } catch {
      return false;
    }
  },
};
