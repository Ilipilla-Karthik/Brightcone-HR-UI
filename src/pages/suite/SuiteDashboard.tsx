import React from 'react';
import { useOutletContext } from 'react-router-dom';
import AdminSuiteDashboard from './AdminSuiteDashboard';
import EmployeeSuiteDashboard from './EmployeeSuiteDashboard';

interface LayoutContext {
  currentPersona?: 'admin' | 'employee';
}

export const SuiteDashboard: React.FC = () => {
  const context = useOutletContext<LayoutContext>();
  const persona = context?.currentPersona || (localStorage.getItem('persona') as 'admin' | 'employee') || 'admin';

  if (persona === 'employee') {
    return <EmployeeSuiteDashboard />;
  }

  return <AdminSuiteDashboard />;
};

export default SuiteDashboard;
