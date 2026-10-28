import { shiftApi } from './shiftApi';
import type { WeeklyRosterResponse, AssignShiftPayload, PublishRosterPayload, Holiday, Shift } from '../types';

export const attendanceWeeklyApi = {
  async fetchWeeklyRoster(weekStart: string): Promise<WeeklyRosterResponse> {
    const empRes = await shiftApi.fetchEmployees();
    const employees = empRes.data || [];

    const start = new Date(weekStart);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayName, idx) => {
      const d = new Date(start);
      d.setDate(d.getDate() + idx);
      return {
        date: d.toISOString().split('T')[0],
        day_name: dayName,
        day_number: d.getDate(),
      };
    });

    const rosterRows: any[] = employees.map((emp: any) => {
      const assignments = days.map((day) => ({
        date: day.date,
        shift_id: 2,
        shift_name: 'General Shift',
        shift_code: 'GEN',
        status: (day.day_name === 'Sat' || day.day_name === 'Sun') ? 'OFF' : 'CONFIRMED' as const,
      }));
      return {
        employee_id: emp.id,
        employee_name: emp.name,
        employee_role: emp.role,
        employee_department: emp.department,
        avatar_color: emp.avatar_color,
        default_shift_name: 'General Shift',
        assignments,
      };
    });

    return {
      week_start: weekStart,
      week_end: end.toISOString().split('T')[0],
      is_published: true,
      summary: {
        scheduled_today: employees.length,
        total_employees: employees.length,
        shifts_defined: 4,
        shift_codes: ['GEN', 'MORN', 'EVE', 'NIGHT'],
        swap_requests_count: 0,
        on_leave_this_week_count: 0,
      },
      employees: rosterRows,
    };
  },

  async assignShift(payload: AssignShiftPayload): Promise<any> {
    return { success: true, ...payload };
  },

  async publishRoster(payload: PublishRosterPayload): Promise<any> {
    return { success: true, ...payload };
  },

  async bulkAssignShift(payload: any): Promise<any> {
    return { success: true, ...payload };
  },

  async fetchShifts(): Promise<Shift[]> {
    const res = await shiftApi.fetchShifts();
    return res.data || [];
  },

  async createShift(payload: any): Promise<boolean> {
    return shiftApi.createShift(payload);
  },

  async updateShift(id: number, payload: any): Promise<boolean> {
    return shiftApi.updateShift(id, payload);
  },

  async deleteShift(id: number): Promise<boolean> {
    return shiftApi.deleteShift(id);
  },

  async fetchHolidays(): Promise<Holiday[]> {
    return [
      { id: 1, name: 'Republic Day', holiday_date: '2026-01-26', is_recurring: true },
      { id: 2, name: 'Holi', holiday_date: '2026-03-25', is_recurring: true },
      { id: 3, name: 'Independence Day', holiday_date: '2026-08-15', is_recurring: true },
      { id: 4, name: 'Gandhi Jayanti', holiday_date: '2026-10-02', is_recurring: true },
      { id: 5, name: 'Diwali', holiday_date: '2026-11-08', is_recurring: true },
    ];
  },

  async createHoliday(payload: any): Promise<any> {
    return { id: Date.now(), ...payload };
  },

  async deleteHoliday(_id: number): Promise<boolean> {
    return true;
  },

  async fetchLeaveQuotas(): Promise<any[]> { return []; },
};
