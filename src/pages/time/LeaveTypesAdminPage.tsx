import React, { useState } from 'react';
import type { LeaveType } from '../../types';
import { INITIAL_LEAVE_TYPES } from '../../services/shiftApi';
import { LeaveTypesPage } from '../LeaveTypesPage';

const STORAGE_KEY = 'brightcone_leave_types';

export const LeaveTypesAdminPage: React.FC = () => {
  const [types, setTypes] = useState<LeaveType[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_LEAVE_TYPES;
    } catch {
      return INITIAL_LEAVE_TYPES;
    }
  });

  const handleAdd = async (t: any) => {
    const newTypes = [...types, { id: Date.now(), ...t }];
    setTypes(newTypes);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(newTypes)); } catch {}
    return true;
  };

  const handleUpdate = async (id: number, t: any) => {
    const updated = types.map((item) => (item.id === id ? { ...item, ...t } : item));
    setTypes(updated);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
    return true;
  };

  const handleDelete = async (id: number) => {
    const remaining = types.filter((item) => item.id !== id);
    setTypes(remaining);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining)); } catch {}
    return true;
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <LeaveTypesPage
        leaveTypes={types}
        onAddLeaveType={handleAdd}
        onUpdateLeaveType={handleUpdate}
        onDeleteLeaveType={handleDelete}
        searchQuery=""
      />
    </div>
  );
};

export default LeaveTypesAdminPage;
