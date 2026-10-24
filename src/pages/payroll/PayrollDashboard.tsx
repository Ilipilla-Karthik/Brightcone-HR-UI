import React from 'react';
import { ComingSoon } from '../../components/ComingSoon';
import { ic } from '../../components/icons';

export const PayrollDashboard: React.FC = () => {
  return (
    <ComingSoon
      moduleName="Payroll Operations"
      category="Compensation & Payroll"
      description="Monthly payroll runs, salary registers, tax computation, and statutory compliance."
      icon={ic('pay', 28)}
    />
  );
};

export default PayrollDashboard;
