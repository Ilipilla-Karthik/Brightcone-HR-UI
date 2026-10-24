import React from 'react';
import { ComingSoon } from '../../components/ComingSoon';
import { ic } from '../../components/icons';

export const CourseCatalogueAdmin: React.FC = () => {
  return (
    <ComingSoon
      moduleName="Course Catalogue"
      category="L&D Administration"
      description="Manage courses, enrollment criteria, and learning resources."
      icon={ic('learn', 28)}
    />
  );
};

export default CourseCatalogueAdmin;
