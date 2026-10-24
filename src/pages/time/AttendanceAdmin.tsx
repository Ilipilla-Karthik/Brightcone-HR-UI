import React from 'react';
import { ComingSoon } from '../../components/ComingSoon';
import { ic } from '../../components/icons';

export const AttendanceAdmin: React.FC = () => {
  return (
    <ComingSoon
      moduleName="Shift & Attendance"
      category="Time Operations"
      description="Weekly shift rosters, digital clock-in cards, overtime tracking, and swap approvals."
      icon={ic('clock', 28)}
    />
  );
};

export default AttendanceAdmin;
