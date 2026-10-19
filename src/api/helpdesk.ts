import api from './client';
import type { HelpdeskTicket } from '../types';

export interface TicketParams {
  employee_code?: string;
  employee_name?: string;
  category: string;
  subject: string;
  description: string;
  priority?: string;
}

export const helpdeskApi = {
  listMy: async (): Promise<HelpdeskTicket[]> => {
    const res = await api.get<HelpdeskTicket[]>('/helpdesk/my');
    return res.data;
  },
  createTicket: async (data: TicketParams): Promise<HelpdeskTicket> => {
    const res = await api.post<HelpdeskTicket>('/helpdesk/tickets', data);
    return res.data;
  },
};
