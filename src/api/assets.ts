import api from './client';
import type { EmployeeAsset } from '../types';

export const assetsApi = {
  listMy: async (): Promise<EmployeeAsset[]> => {
    const res = await api.get<EmployeeAsset[]>('/assets/my');
    return res.data;
  },
};
