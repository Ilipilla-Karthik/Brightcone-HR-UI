import React, { useState } from 'react';
import type { LeaveQuota, LeaveType } from '../../types';
import { INITIAL_LEAVE_QUOTAS, INITIAL_LEAVE_TYPES } from '../../services/shiftApi';
import { LeaveQuotasPage } from '../LeaveQuotasPage';

export const LeaveQuotasAdminPage: React.FC = () => {
  const [quotas, setQuotas] = useState<LeaveQuota[]>(INITIAL_LEAVE_QUOTAS);
  const [leaveTypes] = useState<LeaveType[]>(INITIAL_LEAVE_TYPES);

  const handleAdd = async (q: any) => {
    setQuotas([...quotas, { id: Date.now(), ...q }]);
    return true;
  };

  const handleUpdate = async (id: number, q: any) => {
    setQuotas(quotas.map((item) => (item.id === id ? { ...item, ...q } : item)));
    return true;
  };

  const handleDelete = async (id: number) => {
    setQuotas(quotas.filter((item) => item.id !== id));
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
