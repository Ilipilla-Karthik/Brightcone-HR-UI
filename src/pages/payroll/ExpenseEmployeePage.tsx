import React from 'react';
import { ComingSoon } from '../../components/ComingSoon';
import { ic } from '../../components/icons';

export const ExpenseEmployeePage: React.FC = () => {
  return (
    <ComingSoon
      moduleName="Expense Claims"
      category="Reimbursements"
      description="Employee reimbursement claims, mileage logs, and travel receipts."
      icon={ic('receipt', 28)}
    />
  );
};

export default ExpenseEmployeePage;
