import React, { useState } from 'react';
import type { LeaveType } from '../../types';
import { INITIAL_LEAVE_TYPES } from '../../services/shiftApi';
import { LeaveTypesPage } from '../LeaveTypesPage';

export const LeaveTypesAdminPage: React.FC = () => {
  const [types, setTypes] = useState<LeaveType[]>(INITIAL_LEAVE_TYPES);

  const handleAdd = async (t: any) => {
    setTypes([...types, { id: Date.now(), ...t }]);
    return true;
  };

  const handleUpdate = async (id: number, t: any) => {
    setTypes(types.map((item) => (item.id === id ? { ...item, ...t } : item)));
    return true;
  };

  const handleDelete = async (id: number) => {
    setTypes(types.filter((item) => item.id !== id));
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
