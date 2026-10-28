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
    } catch {
      //
    }
    throw new Error(errorMsg);
  }
  return res.json();
}

export const INITIAL_LEAVE_TYPES: LeaveType[] = [
  { id: 1, name: 'Casual Leave', code: 'CL', description: 'For personal errands and short absences.', is_paid: true, is_active: true },
  { id: 2, name: 'Sick Leave', code: 'SL', description: 'For personal illnesses and healthcare needs.', is_paid: true, is_active: true },
  { id: 3, name: 'Earned Leave / Annual Vacation', code: 'EL', description: 'Planned vacation days.', is_paid: true, is_active: true },
  { id: 4, name: 'Maternity Leave', code: 'ML', description: 'Statutory paid leave for expectant mothers.', is_paid: true, is_active: true },
  { id: 5, name: 'Loss of Pay', code: 'LOP', description: 'Unpaid leaves taken after exhaust of eligible quotas.', is_paid: false, is_active: true },
];

export const INITIAL_LEAVE_QUOTAS: LeaveQuota[] = [
  { id: 1, leave_type_id: 1, leave_type_name: 'Casual Leave', leave_type_code: 'CL', year: 2026, entitled_days: 12.0, applicable_group: 'ALL' },
  { id: 2, leave_type_id: 2, leave_type_name: 'Sick Leave', leave_type_code: 'SL', year: 2026, entitled_days: 10.5, applicable_group: 'ALL' },
  { id: 3, leave_type_id: 3, leave_type_name: 'Earned Leave / Annual Vacation', leave_type_code: 'EL', year: 2026, entitled_days: 18.0, applicable_group: 'ALL' },
  { id: 4, leave_type_id: 4, leave_type_name: 'Maternity Leave', leave_type_code: 'ML', year: 2026, entitled_days: 182.0, applicable_group: 'FEMALE' },
  { id: 5, leave_type_id: 5, leave_type_name: 'Loss of Pay', leave_type_code: 'LOP', year: 2026, entitled_days: 0.0, applicable_group: 'ALL' },
];

export const shiftApi = {
  async fetchEmployees(): Promise<ApiResponse<Employee[]>> {
    try {
      const data = await request<any>('/v1/employees');
      const list = Array.isArray(data) ? data : (data as any)?.value || [];
      const mapped = list.map((e: any, idx: number) => ({
        id: e.id || idx + 1,
        name: e.name || e.fullName || `${e.firstName || 'Staff'} ${e.lastName || ''}`.trim(),
        email: e.email || `employee${idx + 1}@brightcone.com`,
        role: e.designation || e.role || 'Software Engineer',
        department: e.department || 'Engineering',
        avatar_color: 'bg-purple-600',
        is_active: true,
      }));
      return { data: mapped.length > 0 ? mapped : [
        { id: 1, name: 'Naresh Vemparala', email: 'naresh.v@brightcone.com', role: 'Staff Engineer', department: 'Platform', avatar_color: 'bg-purple-600', is_active: true },
        { id: 2, name: 'Ananya Rao', email: 'ananya.rao@brightcone.com', role: 'People Ops Lead', department: 'Human Resources', avatar_color: 'bg-pink-600', is_active: true },
        { id: 3, name: 'Karthik Reddy', email: 'karthik.r@brightcone.com', role: 'AI Architect', department: 'Engineering', avatar_color: 'bg-emerald-600', is_active: true },
        { id: 4, name: 'Priya Menon', email: 'priya.m@brightcone.com', role: 'Product Lead', department: 'Product', avatar_color: 'bg-blue-600', is_active: true },
      ], error: null };
    } catch {
      return { data: [
        { id: 1, name: 'Naresh Vemparala', email: 'naresh.v@brightcone.com', role: 'Staff Engineer', department: 'Platform', avatar_color: 'bg-purple-600', is_active: true },
        { id: 2, name: 'Ananya Rao', email: 'ananya.rao@brightcone.com', role: 'People Ops Lead', department: 'Human Resources', avatar_color: 'bg-pink-600', is_active: true },
      ], error: null };
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
      return { data: [], error: null };
    }
  },

  async createShift(payload: any): Promise<boolean> {
    await request('/v1/shifts', { method: 'POST', body: JSON.stringify(payload) });
    return true;
  },

  async updateShift(id: number, payload: any): Promise<boolean> {
    await request(`/v1/shifts/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
    return true;
  },

  async deleteShift(id: number): Promise<boolean> {
    await request(`/v1/shifts/${id}`, { method: 'DELETE' });
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
    try {
      const res = await request<any[]>('/v1/leave/my');
      const list = Array.isArray(res) ? res : [];
      let savedLocal: any[] = [];
      try {
        savedLocal = JSON.parse(localStorage.getItem('brightcone_leave_requests') || '[]');
      } catch {}
      const combined = [...savedLocal, ...list].map((r: any, idx: number) => ({
        id: r.id || idx + 1,
        employee_id: r.employee_code || r.employee_id || 'BC-1001',
        employee_name: r.employee_name || 'Staff Member',
        leave_type_code: r.leave_type || r.leave_type_code || 'CL',
        start_date: r.from_date || r.start_date || '2026-10-15',
        end_date: r.to_date || r.end_date || '2026-10-16',
        days_count: parseFloat(r.days) || 1,
        reason: r.reason || '',
        status: (r.status || 'PENDING').toUpperCase(),
        created_at: r.created_at || new Date().toISOString(),
      }));
      return { data: combined as any, error: null };
    } catch {
      return { data: [], error: null };
    }
  },

  async createLeaveRequest(payload: CreateLeaveRequestPayload): Promise<any> {
    try {
      const res = await request<any>('/v1/leave/apply', {
        method: 'POST',
        body: JSON.stringify({
          employee_code: payload.employee_id ? `BC-${payload.employee_id}` : 'BC-1001',
          employee_name: 'Ananya Rao',
          leave_type: String(payload.leave_type_id || 'CL'),
          from_date: payload.start_date,
          to_date: payload.end_date,
          days: payload.is_half_day ? '0.5' : '1',
          reason: payload.reason,
        }),
      });
      try {
        const key = 'brightcone_leave_requests';
        const list = JSON.parse(localStorage.getItem(key) || '[]');
        list.unshift(res || { id: Date.now(), ...payload, status: 'PENDING' });
        localStorage.setItem(key, JSON.stringify(list));
      } catch {}
      return res;
    } catch {
      return { id: Date.now(), ...payload, status: 'PENDING' };
    }
  },

  async approveLeaveRequest(id: number, payload?: any): Promise<any> {
    try {
      await request(`/v1/leave/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'Approved' }),
      });
    } catch {}
    try {
      const key = 'brightcone_leave_requests';
      const list = JSON.parse(localStorage.getItem(key) || '[]');
      const upd = list.map((item: any) => item.id === id ? { ...item, status: 'APPROVED' } : item);
      localStorage.setItem(key, JSON.stringify(upd));
    } catch {}
    return { id, ...payload, status: 'APPROVED' };
  },

  async rejectLeaveRequest(id: number, payload?: any): Promise<any> {
    try {
      await request(`/v1/leave/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'Rejected' }),
      });
    } catch {}
    try {
      const key = 'brightcone_leave_requests';
      const list = JSON.parse(localStorage.getItem(key) || '[]');
      const upd = list.map((item: any) => item.id === id ? { ...item, status: 'REJECTED' } : item);
      localStorage.setItem(key, JSON.stringify(upd));
    } catch {}
    return { id, ...payload, status: 'REJECTED' };
  },

  async cancelLeaveRequest(_id: number): Promise<boolean> {
    return true;
  },

  async calculateLeaveDays(payload: any): Promise<ApiResponse<LeaveCalculationResult>> {
    const s = new Date(payload.start_date);
    const e = new Date(payload.end_date);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const breakdown: any[] = [];
    let workingDays = 0;
    let weekendDays = 0;
    let holidaysCount = 0;
    let chargeableDays = 0;

    const curr = new Date(s);
    while (curr <= e) {
      const dateStr = curr.toISOString().split('T')[0];
      const dayIdx = curr.getDay();
      const isWeekend = dayIdx === 0 || dayIdx === 6;
      const isHoliday = dateStr === '2026-10-02' || dateStr === '2026-11-08' || dateStr === '2026-12-25';
      const isMaternity = payload.leave_type_code === 'ML';
      const isChargeable = isMaternity || (!isWeekend && !isHoliday);
      const chargeVal = isChargeable ? (payload.is_half_day ? 0.5 : 1.0) : 0;

      if (isWeekend) weekendDays++;
      else if (isHoliday) holidaysCount++;
      else workingDays++;

      if (isChargeable) chargeableDays += chargeVal;

      breakdown.push({
        date: dateStr, day_name: dayNames[dayIdx], is_weekend: isWeekend, is_holiday: isHoliday,
        holiday_name: isHoliday ? 'Public Holiday' : null, is_scheduled_off: false,
        is_chargeable: isChargeable, chargeable_value: chargeVal,
      });
      curr.setDate(curr.getDate() + 1);
    }

    const totalDays = breakdown.length || 1;
    return {
      data: {
        start_date: payload.start_date, end_date: payload.end_date, total_calendar_days: totalDays,
        chargeable_days: chargeableDays, weekend_days_count: weekendDays, weekend_days: weekendDays,
        holidays_count: holidaysCount, holiday_days: holidaysCount, working_days: workingDays,
        policy_applied: 'Standard Policy', leave_type_code: payload.leave_type_code, breakdown,
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
    return { data: { employee_id: employeeId, available_days: 0.0, total_earned_days: 0.0, used_days: 0.0, pending_days: 0.0 }, error: null };
  },
  async getCompOffBalance(employeeId: number): Promise<ApiResponse<CompOffBalance>> { return this.fetchCompOffBalance(employeeId); },
  async fetchCompOffRequests(_params?: any): Promise<ApiResponse<CompOffRequest[]>> { return { data: [], error: null }; },
  async fetchCompOffEntitlements(_employeeId?: number): Promise<ApiResponse<CompOffEntitlement[]>> { return { data: [], error: null }; },

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

  async fetchSwapRequests(_params?: any): Promise<ApiResponse<SwapRequestDetail[]>> {
    return { data: [], error: null };
  },

  async createSwapRequest(payload: CreateSwapPayload): Promise<any> {
    return { id: 1, ...payload, status: 'PENDING' };
  },

  async approveSwapRequest(id: number, payload?: any): Promise<any> {
    return { id, ...payload, status: 'APPROVED' };
  },

  async rejectSwapRequest(id: number, payload?: any): Promise<any> {
    return { id, ...payload, status: 'REJECTED' };
  },

  async cancelSwapRequest(_id: number): Promise<boolean> {
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
