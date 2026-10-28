import React, { useState } from 'react';
import type { LeaveQuota, LeaveType } from '../../types';
import { INITIAL_LEAVE_QUOTAS, INITIAL_LEAVE_TYPES } from '../../services/shiftApi';
import { LeaveQuotasPage } from '../LeaveQuotasPage';

const STORAGE_KEY = 'brightcone_leave_quotas';

export const LeaveQuotasAdminPage: React.FC = () => {
  const [quotas, setQuotas] = useState<LeaveQuota[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_LEAVE_QUOTAS;
    } catch {
      return INITIAL_LEAVE_QUOTAS;
    }
  });
  const [leaveTypes] = useState<LeaveType[]>(INITIAL_LEAVE_TYPES);

  const handleAdd = async (q: any) => {
    const newQuotas = [...quotas, { id: Date.now(), ...q }];
    setQuotas(newQuotas);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(newQuotas)); } catch {}
    return true;
  };

  const handleUpdate = async (id: number, q: any) => {
    const updated = quotas.map((item) => (item.id === id ? { ...item, ...q } : item));
    setQuotas(updated);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
    return true;
  };

  const handleDelete = async (id: number) => {
    const remaining = quotas.filter((item) => item.id !== id);
    setQuotas(remaining);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining)); } catch {}
    return true;
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <LeaveQuotasPage
        leaveQuotas={quotas}
        leaveTypes={leaveTypes}
        onAddQuota={handleAdd}
        onUpdateQuota={handleUpdate}
        onDeleteQuota={handleDelete}
        searchQuery=""
      />
    </div>
  );
};

export default LeaveQuotasAdminPage;
