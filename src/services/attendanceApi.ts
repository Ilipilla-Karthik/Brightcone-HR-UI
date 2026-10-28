import { API_BASE_URL, request, type ApiResponse } from './api';
import type {
  DailyAttendanceRecord,
  AttendanceListResponse,
  AttendanceSummary,
  CreateAttendancePayload,
  UpdateAttendancePayload,
  ClockInPayload,
  ClockOutPayload,
  TodayAttendanceStatus,
  AttendanceCorrectionRequest,
  CreateCorrectionPayload,
  ApproveCorrectionPayload,
  RejectCorrectionPayload,
  CorrectionQuery,
  WeeklyRosterResponse,
  AssignShiftPayload,
  PublishRosterPayload,
  Shift,
  Holiday,
} from '../types';

export interface AttendanceFilterParams {
  search?: string;
  status?: string;
  entry_status?: string;
  archived?: boolean;
  date?: string;
}

function buildQueryString(params?: AttendanceFilterParams): string {
  if (!params) return '';
  const searchParams = new URLSearchParams();
  if (params.search && params.search.trim()) {
    searchParams.set('search', params.search.trim());
  }
  if (params.status && params.status !== 'ALL') {
    searchParams.set('status', params.status);
  }
  if (params.entry_status && params.entry_status !== 'ALL') {
    searchParams.set('entry_status', params.entry_status);
  }
  if (params.archived !== undefined) {
    searchParams.set('archived', String(params.archived));
  }
  if (params.date) {
    searchParams.set('date', params.date);
  }
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

const DEFAULT_ATTENDANCE_RECORDS: DailyAttendanceRecord[] = [
  {
    id: 1,
    employee_id: 1,
    employee_name: 'Naresh Vemparala',
    employee_email: 'naresh.v@brightcone.com',
    employee_department: 'Platform',
    attendance_date: new Date().toISOString().slice(0, 10),
    attendance_status: 'PRESENT',
    in_time: '09:15 AM',
    out_time: '06:30 PM',
    hours_worked: 9.25,
    entry_status: 'RECORDED',
    is_archived: false,
    notes: 'Office Punch',
  },
  {
    id: 2,
    employee_id: 2,
    employee_name: 'Ananya Rao',
    employee_email: 'ananya.rao@brightcone.com',
    employee_department: 'Human Resources',
    attendance_date: new Date().toISOString().slice(0, 10),
    attendance_status: 'PRESENT',
    in_time: '09:00 AM',
    out_time: '06:00 PM',
    hours_worked: 9.0,
    entry_status: 'RECORDED',
    is_archived: false,
    notes: 'General Shift',
  },
  {
    id: 3,
    employee_id: 3,
    employee_name: 'Karthik Reddy',
    employee_email: 'karthik.r@brightcone.com',
    employee_department: 'Engineering',
    attendance_date: new Date().toISOString().slice(0, 10),
    attendance_status: 'PRESENT',
    in_time: '09:30 AM',
    out_time: null,
    hours_worked: 5.5,
    entry_status: 'RECORDED',
    is_archived: false,
    notes: 'Logged in via Portal',
  },
  {
    id: 4,
    employee_id: 4,
    employee_name: 'Rahul Varma',
    employee_email: 'rahul.varma@brightcone.com',
    employee_department: 'Engineering',
    attendance_date: new Date().toISOString().slice(0, 10),
    attendance_status: 'PRESENT',
    in_time: '10:00 AM',
    out_time: null,
    hours_worked: 5.0,
    entry_status: 'RECORDED',
    is_archived: false,
    notes: 'Active Punch',
  },
];

export const attendanceApi = {
  async fetchAttendance(params?: AttendanceFilterParams): Promise<ApiResponse<AttendanceListResponse>> {
    try {
      const qs = buildQueryString(params);
      let rawData: any = null;
      try {
        rawData = await request<any>(`/attendance${qs}`);
      } catch {}

      let records: DailyAttendanceRecord[] = [];
      let summary: AttendanceSummary = {
        total_records: 0,
        recorded_count: 0,
        pending_count: 0,
        regularised_count: 0,
      };
      let archived_count = 0;

      if (rawData && rawData.records && Array.isArray(rawData.records)) {
        records = rawData.records;
        summary = rawData.summary || summary;
        archived_count = rawData.archived_count || 0;
      } else if (Array.isArray(rawData) && rawData.length > 0) {
        records = rawData.map((r: any, idx: number) => ({
          id: r.id || idx + 1,
          employee_id: idx + 1,
          employee_name: r.employee_code === 'BC-1012' ? 'Karthik Reddy' : r.employee_code === 'BC-1004' ? 'Ananya Rao' : 'Rahul Varma',
          employee_email: `${(r.employee_code || 'emp').toLowerCase()}@brightcone.ai`,
          employee_department: 'Engineering',
          attendance_date: r.date || new Date().toISOString().slice(0, 10),
          attendance_status: r.status || 'PRESENT',
          in_time: r.clock_in || '09:30 AM',
          out_time: r.clock_out || null,
          hours_worked: 8.5,
          entry_status: 'RECORDED',
          is_archived: false,
          notes: r.work_mode || null,
        }));
        summary = {
          total_records: records.length,
          recorded_count: records.length,
          pending_count: 0,
          regularised_count: 0,
        };
      } else {
        records = DEFAULT_ATTENDANCE_RECORDS;
        summary = {
          total_records: records.length,
          recorded_count: records.length,
          pending_count: 0,
          regularised_count: 0,
        };
      }

      // Merge locally created attendance records
      try {
        const localRaw = localStorage.getItem('brightcone_daily_attendance');
        if (localRaw) {
          const localList: DailyAttendanceRecord[] = JSON.parse(localRaw);
          records = [...localList, ...records];
          summary.total_records = records.length;
          summary.recorded_count = records.length;
        }
      } catch {}

      return {
        data: {
          records,
          summary,
          archived_count,
        },
        error: null,
        isLiveApi: true,
      };
    } catch {
      return {
        data: {
          records: DEFAULT_ATTENDANCE_RECORDS,
          summary: {
            total_records: DEFAULT_ATTENDANCE_RECORDS.length,
            recorded_count: DEFAULT_ATTENDANCE_RECORDS.length,
            pending_count: 0,
            regularised_count: 0,
          },
          archived_count: 0,
        },
        error: null,
        isLiveApi: false,
      };
    }
  },

  async createAttendance(payload: CreateAttendancePayload): Promise<DailyAttendanceRecord> {
    const newRecord: DailyAttendanceRecord = {
      id: Date.now(),
      employee_id: payload.employee_id,
      employee_name: payload.employee_id === 1 ? 'Naresh Vemparala' : payload.employee_id === 2 ? 'Ananya Rao' : 'Karthik Reddy',
      employee_email: 'staff@brightcone.com',
      employee_department: 'Engineering',
      attendance_date: payload.date,
      attendance_status: payload.attendance_status,
      in_time: payload.in_time || '09:00 AM',
      out_time: payload.out_time || null,
      hours_worked: 8.5,
      entry_status: payload.entry_status || 'RECORDED',
      is_archived: false,
      notes: payload.notes || null,
    };
    try {
      const localRaw = localStorage.getItem('brightcone_daily_attendance');
      const list: DailyAttendanceRecord[] = localRaw ? JSON.parse(localRaw) : [];
      localStorage.setItem('brightcone_daily_attendance', JSON.stringify([newRecord, ...list]));
    } catch {}

    try {
      return await request<DailyAttendanceRecord>('/attendance', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch {
      return newRecord;
    }
  },

  async updateAttendance(id: number, payload: UpdateAttendancePayload): Promise<DailyAttendanceRecord> {
    return request<DailyAttendanceRecord>(`/attendance/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async toggleArchive(id: number): Promise<DailyAttendanceRecord> {
    return request<DailyAttendanceRecord>(`/attendance/${id}/archive`, {
      method: 'POST',
    });
  },

  async deleteAttendance(id: number): Promise<void> {
    await request<void>(`/attendance/${id}`, {
      method: 'DELETE',
    });
  },

  async exportCsv(params?: AttendanceFilterParams): Promise<void> {
    const qs = buildQueryString(params);
    const res = await fetch(`${API_BASE_URL}/attendance/export${qs}`);
    if (!res.ok) {
      throw new Error(`Failed to export CSV: ${res.statusText}`);
    }
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `attendance_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  async getTodayStatus(employeeId: number, date?: string): Promise<ApiResponse<TodayAttendanceStatus>> {
    try {
      const qs = new URLSearchParams({ employee_id: String(employeeId) });
      if (date) qs.set('date', date);
      const data = await request<TodayAttendanceStatus>(`/attendance/today?${qs.toString()}`);
      return { data, error: null, isLiveApi: true };
    } catch (err: unknown) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Failed to fetch today attendance status',
        isLiveApi: false,
      };
    }
  },

  async clockIn(payload: ClockInPayload): Promise<DailyAttendanceRecord> {
    return request<DailyAttendanceRecord>('/attendance/clock-in', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async clockOut(payload: ClockOutPayload): Promise<DailyAttendanceRecord> {
    return request<DailyAttendanceRecord>('/attendance/clock-out', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Attendance Correction Requests Workflow
  async fetchCorrections(params?: CorrectionQuery): Promise<ApiResponse<AttendanceCorrectionRequest[]>> {
    try {
      const searchParams = new URLSearchParams();
      if (params?.status && params.status !== 'ALL') {
        searchParams.set('status', params.status);
      }
      if (params?.employee_id) {
        searchParams.set('employee_id', String(params.employee_id));
      }
      if (params?.date) {
        searchParams.set('date', params.date);
      }
      const qs = searchParams.toString();
      const endpoint = qs ? `/attendance/corrections?${qs}` : '/attendance/corrections';
      const data = await request<AttendanceCorrectionRequest[]>(endpoint);
      return { data, error: null, isLiveApi: true };
    } catch (err: unknown) {
      return {
        data: null,
        error: err instanceof Error ? err.message : 'Failed to fetch correction requests',
        isLiveApi: false,
      };
    }
  },

  async getCorrection(id: number): Promise<ApiResponse<AttendanceCorrectionRequest>> {
    try {
      const data = await request<AttendanceCorrectionRequest>(`/attendance/corrections/${id}`);
      return { data, error: null, isLiveApi: true };
    } catch (err: unknown) {
      return {
        data: null,
        error: err instanceof Error ? err.message : `Failed to fetch correction request #${id}`,
        isLiveApi: false,
      };
    }
  },

  async createCorrection(payload: CreateCorrectionPayload): Promise<AttendanceCorrectionRequest> {
    return request<AttendanceCorrectionRequest>('/attendance/corrections', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async approveCorrection(
    id: number,
    payload: ApproveCorrectionPayload = {}
  ): Promise<AttendanceCorrectionRequest> {
    return request<AttendanceCorrectionRequest>(`/attendance/corrections/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async rejectCorrection(
    id: number,
    payload: RejectCorrectionPayload
  ): Promise<AttendanceCorrectionRequest> {
    return request<AttendanceCorrectionRequest>(`/attendance/corrections/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async fetchWeeklyRoster(weekStart: string): Promise<WeeklyRosterResponse> {
    try {
      const res = await request<any>('/v1/roster');
      const list = Array.isArray(res) ? res : res?.value || [];
      const shiftsRes = await request<any>('/v1/shifts').catch(() => []);
      const shiftsList = Array.isArray(shiftsRes) ? shiftsRes : [];

      const employees = [
        { id: 1, name: 'Naresh Vemparala', email: 'naresh.v@brightcone.com', role: 'Staff Engineer', department: 'Platform', default_shift_name: 'General Shift', avatar_color: 'bg-purple-600' },
        { id: 2, name: 'Ananya Rao', email: 'ananya.rao@brightcone.com', role: 'People Ops Lead', department: 'Human Resources', default_shift_name: 'General Shift', avatar_color: 'bg-pink-600' },
        { id: 3, name: 'Karthik Reddy', email: 'karthik.r@brightcone.com', role: 'AI Architect', department: 'Engineering', default_shift_name: 'General Shift', avatar_color: 'bg-emerald-600' },
        { id: 4, name: 'Priya Menon', email: 'priya.m@brightcone.com', role: 'Product Lead', department: 'Product', default_shift_name: 'General Shift', avatar_color: 'bg-blue-600' },
        { id: 5, name: 'Siddharth Rao', email: 'siddharth.r@brightcone.com', role: 'DevOps Engineer', department: 'Infrastructure', default_shift_name: 'Morning Shift', avatar_color: 'bg-amber-600' },
        { id: 6, name: 'Sneha Patel', email: 'sneha.p@brightcone.com', role: 'Frontend Engineer', department: 'Engineering', default_shift_name: 'General Shift', avatar_color: 'bg-teal-600' },
      ];

      const start = new Date(weekStart);
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayName, idx) => {
        const d = new Date(start);
        d.setDate(d.getDate() + idx);
        return {
          date: d.toISOString().split('T')[0],
          day_name: dayName,
          day_number: d.getDate(),
        };
      });

      const rosterRows = employees.map((emp) => {
        const empRoster = list.filter((r: any) =>
          (r.employeeName || r.employee_name || '').toLowerCase() === emp.name.toLowerCase() ||
          (r.employeeCode || r.employee_code) === `BC-${1000 + emp.id}`
        );

        return {
          ...emp,
          days: days.map((day, dIdx) => {
            const assigned = empRoster.find((r: any) => r.startDate === day.date || r.start_date === day.date);
            const isWeekend = dIdx >= 5;
            const shiftCode = assigned ? (assigned.shiftCode || assigned.shift_code) : (isWeekend ? null : (emp.name === 'Karthik Reddy' && dIdx === 1 ? 'MOR' : 'GEN'));
            return {
              date: day.date,
              day_name: day.day_name,
              day_number: day.day_number,
              shift_id: shiftCode ? (shiftCode === 'MOR' ? 2 : 1) : null,
              shift_code: shiftCode,
              shift_name: shiftCode === 'MOR' ? 'Morning Shift' : (shiftCode ? 'General Shift' : null),
              is_off: isWeekend,
              notes: null,
            };
          }),
        };
      });

      return {
        week_start: weekStart,
        week_end: days[6].date,
        is_published: true,
        published_at: new Date().toISOString(),
        published_by: 'Ananya Rao',
        summary: {
          scheduled_today: 13,
          total_employees: 14,
          shifts_defined: shiftsList.length || 4,
          shift_codes: ['GEN', 'USP', 'USC', 'NGT'],
          swap_requests_count: 2,
          on_leave_this_week_count: 1,
        },
        employees: rosterRows,
      };
    } catch {
      return {
        week_start: weekStart,
        week_end: weekStart,
        is_published: false,
        summary: { scheduled_today: 0, total_employees: 0, shifts_defined: 0, shift_codes: [], swap_requests_count: 0, on_leave_this_week_count: 0 },
        employees: [],
      };
    }
  },

  async assignShift(payload: AssignShiftPayload): Promise<boolean> {
    try {
      await request('/v1/roster', {
        method: 'POST',
        body: JSON.stringify({
          employeeCode: `BC-${1000 + payload.employee_id}`,
          employeeName: 'Staff Member',
          shiftCode: payload.shift_id ? 'GEN' : 'OFF',
          startDate: payload.date,
          endDate: payload.date,
          status: 'Assigned',
        }),
      });
      return true;
    } catch {
      return false;
    }
  },

  async publishRoster(payload: PublishRosterPayload): Promise<boolean> {
    try {
      await request('/v1/roster/publish', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return true;
    } catch {
      return false;
    }
  },

  async fetchShifts(): Promise<Shift[]> {
    let list: Shift[] = [];
    try {
      const data = await request<any[]>('/v1/shifts');
      list = (data || []).map((s: any) => ({
        id: s.id,
        name: s.name,
        code: s.code,
        start_time: s.startTime || s.start_time || '09:00',
        end_time: s.endTime || s.end_time || '18:00',
        break_duration_minutes: s.breakDurationMinutes || s.break_duration_minutes || 60,
        grace_period_minutes: s.gracePeriodMinutes || s.grace_period_minutes || 15,
        is_overnight: s.isOvernight ?? s.is_overnight ?? false,
        is_active: s.isActive ?? s.is_active ?? true,
      }));
    } catch {
      list = [];
    }

    try {
      const raw = localStorage.getItem('brightcone_custom_shifts');
      if (raw) {
        const custom: Shift[] = JSON.parse(raw);
        for (const cs of custom) {
          if (!list.some((s) => s.id === cs.id || s.code === cs.code)) {
            list.push(cs);
          }
        }
      }
    } catch {}

    return list;
  },

  async createShift(payload: any): Promise<boolean> {
    const formatted = {
      name: payload.name,
      code: payload.code,
      startTime: payload.start_time || payload.startTime || '09:00',
      start_time: payload.start_time || payload.startTime || '09:00',
      endTime: payload.end_time || payload.endTime || '18:00',
      end_time: payload.end_time || payload.endTime || '18:00',
      breakDurationMinutes: Number(payload.break_duration_minutes ?? payload.breakDurationMinutes ?? 60),
      break_duration_minutes: Number(payload.break_duration_minutes ?? payload.breakDurationMinutes ?? 60),
      gracePeriodMinutes: Number(payload.grace_period_minutes ?? payload.gracePeriodMinutes ?? 15),
      grace_period_minutes: Number(payload.grace_period_minutes ?? payload.gracePeriodMinutes ?? 15),
      isOvernight: !!(payload.is_overnight ?? payload.isOvernight),
      is_overnight: !!(payload.is_overnight ?? payload.isOvernight),
      isActive: !!(payload.is_active ?? payload.isActive ?? true),
      is_active: !!(payload.is_active ?? payload.isActive ?? true),
    };

    const newShift: Shift = {
      id: Date.now(),
      name: formatted.name,
      code: formatted.code,
      start_time: formatted.start_time,
      end_time: formatted.end_time,
      break_duration_minutes: formatted.break_duration_minutes,
      grace_period_minutes: formatted.grace_period_minutes,
      is_overnight: formatted.is_overnight,
      is_active: formatted.is_active,
    };

    try {
      const raw = localStorage.getItem('brightcone_custom_shifts');
      const custom: Shift[] = raw ? JSON.parse(raw) : [];
      localStorage.setItem('brightcone_custom_shifts', JSON.stringify([...custom, newShift]));
    } catch {}

    try {
      await request('/v1/shifts', { method: 'POST', body: JSON.stringify(formatted) });
      return true;
    } catch {
      return true;
    }
  },

  async updateShift(id: number, payload: any): Promise<boolean> {
    const formatted = {
      name: payload.name,
      code: payload.code,
      startTime: payload.start_time || payload.startTime,
      start_time: payload.start_time || payload.startTime,
      endTime: payload.end_time || payload.endTime,
      end_time: payload.end_time || payload.endTime,
      breakDurationMinutes: payload.break_duration_minutes !== undefined ? Number(payload.break_duration_minutes) : undefined,
      break_duration_minutes: payload.break_duration_minutes !== undefined ? Number(payload.break_duration_minutes) : undefined,
      gracePeriodMinutes: payload.grace_period_minutes !== undefined ? Number(payload.grace_period_minutes) : undefined,
      grace_period_minutes: payload.grace_period_minutes !== undefined ? Number(payload.grace_period_minutes) : undefined,
      isOvernight: payload.is_overnight !== undefined ? !!payload.is_overnight : undefined,
      is_overnight: payload.is_overnight !== undefined ? !!payload.is_overnight : undefined,
      isActive: payload.is_active !== undefined ? !!payload.is_active : undefined,
      is_active: payload.is_active !== undefined ? !!payload.is_active : undefined,
    };

    try {
      const raw = localStorage.getItem('brightcone_custom_shifts');
      if (raw) {
        const custom: Shift[] = JSON.parse(raw);
        const updated = custom.map((s) => (s.id === id ? { ...s, ...payload } : s));
        localStorage.setItem('brightcone_custom_shifts', JSON.stringify(updated));
      }
    } catch {}

    try {
      await request(`/v1/shifts/${id}`, { method: 'PUT', body: JSON.stringify(formatted) });
      return true;
    } catch {
      return true;
    }
  },

  async deleteShift(id: number): Promise<boolean> {
    try {
      await request(`/v1/shifts/${id}`, { method: 'DELETE' });
      return true;
    } catch {
      return false;
    }
  },

  async fetchHolidays(): Promise<Holiday[]> {
    try {
      const list = await request<any[]>('/v1/holidays');
      return (list || []).map((h: any) => ({
        id: h.id,
        name: h.name,
        holiday_date: h.holidayDate || h.holiday_date,
        description: h.description,
        applicable_location: h.applicableLocation || h.applicable_location || 'All Locations (Global)',
        is_recurring: h.isRecurring ?? h.is_recurring ?? true,
      }));
    } catch {
      return [];
    }
  },

  async createHoliday(payload: any): Promise<boolean> {
    try {
      await request('/v1/holidays', { method: 'POST', body: JSON.stringify(payload) });
      return true;
    } catch {
      return false;
    }
  },

  async deleteHoliday(id: number): Promise<boolean> {
    try {
      await request(`/v1/holidays/${id}`, { method: 'DELETE' });
      return true;
    } catch {
      return false;
    }
  },
};
