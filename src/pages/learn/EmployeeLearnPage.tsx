import React from 'react';
import { ComingSoon } from '../../components/ComingSoon';
import { ic } from '../../components/icons';

export const EmployeeLearnPage: React.FC = () => {
  return (
    <ComingSoon
      moduleName="My Learning"
      category="Skills Development"
      description="Track assigned courses, certifications, and compliance progress."
      icon={ic('learn', 28)}
    />
  );
};

export default EmployeeLearnPage;
