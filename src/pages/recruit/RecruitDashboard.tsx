import React from 'react';
import { ComingSoon } from '../../components/ComingSoon';
import { ic } from '../../components/icons';

export const RecruitDashboard: React.FC = () => {
  return (
    <ComingSoon
      moduleName="Recruit & Talent Acquisition"
      category="Hiring"
      description="Candidate pipelines, job postings, interview scheduling, and offer letters."
      icon={ic('briefcase', 28)}
    />
  );
};

export default RecruitDashboard;
