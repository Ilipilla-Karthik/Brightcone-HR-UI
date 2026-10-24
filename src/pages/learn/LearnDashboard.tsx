import React from 'react';
import { ComingSoon } from '../../components/ComingSoon';
import { ic } from '../../components/icons';

export const LearnDashboard: React.FC = () => {
  return (
    <ComingSoon
      moduleName="Learn & Training"
      category="L&D"
      description="Mandatory compliance training, course catalogues, certifications, and skills programs."
      icon={ic('learn', 28)}
    />
  );
};

export default LearnDashboard;
