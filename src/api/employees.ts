import api from './client';
import type { Employee } from '../types';

export interface EmployeeFilterParams {
  q?: string;
  department?: string;
  status?: string;
}

export interface ImportSummary {
  success_count: number;
  error_count: number;
  errors: string[];
}

export const employeesApi = {
  list: async (params?: EmployeeFilterParams): Promise<Employee[]> => {
    const res = await api.get<Employee[]>('/employees', { params });
    return res.data;
  },

  getOne: async (id: string | number): Promise<Employee> => {
    const res = await api.get<Employee>(`/employees/${id}`);
    return res.data;
  },

  getMeProfile: async (): Promise<Employee> => {
    const res = await api.get<Employee>('/employees/me/profile');
    return res.data;
  },

  create: async (data: Partial<Employee>): Promise<Employee> => {
    const res = await api.post<Employee>('/employees', data);
    return res.data;
  },

  update: async (id: string | number, data: Partial<Employee>): Promise<Employee> => {
    const res = await api.patch<Employee>(`/employees/${id}`, data);
    return res.data;
  },

  importCsv: async (csv_content: string): Promise<ImportSummary> => {
    const res = await api.post<ImportSummary>('/employees/import', { csv_content });
    return res.data;
  },

  exportCsvUrl: (params?: EmployeeFilterParams): string => {
    const query = new URLSearchParams();
    if (params?.q) query.append('q', params.q);
    if (params?.department && params.department !== 'All') query.append('department', params.department);
    if (params?.status && params.status !== 'All') query.append('status', params.status);
    return `/api/v1/employees/export?${query.toString()}`;
  },
};
