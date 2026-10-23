import api from './client';
import type { EmployeeDocument } from '../types';

export const documentsApi = {
  listMy: async (): Promise<EmployeeDocument[]> => {
    const res = await api.get<EmployeeDocument[]>('/documents/my');
    return res.data;
  },
};
