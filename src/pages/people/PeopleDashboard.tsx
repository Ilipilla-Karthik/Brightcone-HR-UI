import React from 'react';
import { ComingSoon } from '../../components/ComingSoon';
import { ic } from '../../components/icons';

export const PeopleDashboard: React.FC = () => {
  return (
    <ComingSoon
      moduleName="People Management"
      category="Workforce"
      description="Employee master data, org structure, and employee lifecycle management."
      icon={ic('users', 28)}
    />
  );
};

export default PeopleDashboard;
