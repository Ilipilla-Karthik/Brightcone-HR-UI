import {
  Course,
  CreateCoursePayload,
  Employee,
  LearnDashboardMetrics,
  MyAssignment,
  RemindResponse,
} from './types';

export const MOCK_EMPLOYEES: Employee[] = [
  { id: 'BC-1001', name: 'Naresh Vemparala', role: 'Founder & CEO', dept: 'Leadership', loc: 'Hyderabad', mgr: null, status: 'Active' },
  { id: 'BC-1004', name: 'Ananya Rao', role: 'People Ops Lead', dept: 'People Ops', loc: 'Hyderabad', mgr: 'Naresh Vemparala', status: 'Active' },
  { id: 'BC-1012', name: 'Karthik Reddy', role: 'Principal AI Engineer', dept: 'AI Research', loc: 'Hyderabad', mgr: 'Naresh Vemparala', status: 'Active' },
  { id: 'BC-1019', name: 'Priya Menon', role: 'Engineering Manager', dept: 'Engineering', loc: 'Bengaluru', mgr: 'Karthik Reddy', status: 'Active' },
  { id: 'BC-1023', name: 'Daniel Brooks', role: 'Account Executive', dept: 'Sales', loc: 'San Francisco', mgr: 'Naresh Vemparala', status: 'Active' },
  { id: 'BC-1031', name: 'Sneha Iyer', role: 'Product Designer', dept: 'Design', loc: 'Hyderabad', mgr: 'Priya Menon', status: 'On leave' },
  { id: 'BC-1038', name: 'Rahul Varma', role: 'Backend Engineer', dept: 'Engineering', loc: 'Hyderabad', mgr: 'Priya Menon', status: 'Active' },
  { id: 'BC-1042', name: 'Meera Joshi', role: 'Finance Manager', dept: 'Finance', loc: 'Hyderabad', mgr: 'Naresh Vemparala', status: 'Active' },
  { id: 'BC-1047', name: 'Arjun Nair', role: 'ML Engineer', dept: 'AI Research', loc: 'Remote', mgr: 'Karthik Reddy', status: 'Active' },
  { id: 'BC-1053', name: 'Emily Carter', role: 'Customer Success Manager', dept: 'Customer Success', loc: 'Austin', mgr: 'Daniel Brooks', status: 'Active' },
  { id: 'BC-1058', name: 'Vikram Singh', role: 'DevOps Engineer', dept: 'Engineering', loc: 'Pune', mgr: 'Priya Menon', status: 'Probation' },
  { id: 'BC-1061', name: 'Lakshmi Prasad', role: 'Recruiter', dept: 'People Ops', loc: 'Hyderabad', mgr: 'Ananya Rao', status: 'Active' },
  { id: 'BC-1066', name: 'Farhan Ali', role: 'Frontend Engineer', dept: 'Engineering', loc: 'Hyderabad', mgr: 'Priya Menon', status: 'Notice period' },
  { id: 'BC-1070', name: 'Divya Kulkarni', role: 'Security Engineer', dept: 'Engineering', loc: 'Hyderabad', mgr: 'Priya Menon', status: 'Probation' },
];

export interface StoredCourse {
  id: string;
  title: string;
  course_type: 'Mandatory' | 'Elective';
  duration: string;
  audience: string;
  due_date: string | null;
}

export let mockCoursesStore: StoredCourse[] = [
  { id: 'CO1', title: 'Information security awareness', course_type: 'Mandatory', duration: '45 min', audience: 'Everyone', due_date: '2026-10-31' },
  { id: 'CO2', title: 'POSH: Prevention of sexual harassment', course_type: 'Mandatory', duration: '30 min', audience: 'Everyone', due_date: '2026-10-20' },
  { id: 'CO3', title: 'Data privacy & HIPAA basics', course_type: 'Mandatory', duration: '40 min', audience: 'Engineering', due_date: '2026-11-15' },
  { id: 'CO4', title: 'Building agentic workflows', course_type: 'Elective', duration: '3 h', audience: 'Everyone', due_date: '' },
  { id: 'CO5', title: 'Leading high-trust teams', course_type: 'Elective', duration: '2 h', audience: 'Managers', due_date: '' },
];

export function computeMockDashboardMetrics(): LearnDashboardMetrics {
  const mandatoryCourses = mockCoursesStore.filter((c) => c.course_type === 'Mandatory');
  const electiveCount = mockCoursesStore.length - mandatoryCourses.length;

  return {
    mandatory_compliance: 84,
    total_courses: mockCoursesStore.length,
    mandatory_courses_count: mandatoryCourses.length,
    elective_courses_count: electiveCount,
    in_progress_count: 5,
    people_behind_count: 3,
    completion_by_course: [],
    compliance_breakdown: [],
    open_mandatory: [],
    total_open_mandatory: 0,
  };
}

export function getMockCourses(): Course[] {
  return mockCoursesStore.map((c) => ({
    id: c.id,
    title: c.title,
    course_type: c.course_type,
    duration: c.duration,
    audience: c.audience,
    due_date: c.due_date,
    total_assigned: 10,
    completed_count: 8,
    completion_percentage: 80,
  }));
}

export function createMockCourse(payload: CreateCoursePayload): Course {
  const newId = `CO${Math.floor(100 + Math.random() * 900)}`;
  const stored: StoredCourse = {
    id: newId,
    title: payload.title,
    course_type: payload.course_type,
    duration: payload.duration || '1 h',
    audience: payload.audience || 'Everyone',
    due_date: payload.due_date,
  };
  mockCoursesStore.push(stored);
  return {
    ...stored,
    total_assigned: 14,
    completed_count: 0,
    completion_percentage: 0,
  };
}

export function updateMockCourse(id: string, payload: CreateCoursePayload): Course {
  const existing = mockCoursesStore.find((c) => c.id === id);
  if (!existing) throw new Error('Course not found');
  existing.title = payload.title;
  existing.course_type = payload.course_type;
  existing.duration = payload.duration;
  existing.audience = payload.audience;
  existing.due_date = payload.due_date;
  return {
    ...existing,
    total_assigned: 14,
    completed_count: 5,
    completion_percentage: 36,
  };
}

export function getMockMyLearning(): MyAssignment[] {
  return [
    {
      assignment_id: 'AS-1',
      course_id: 'CO1',
      course_title: 'Information security awareness',
      course_type: 'Mandatory',
      duration: '45 min',
      due_date: '2026-10-31',
      progress: 100,
      status: 'Completed',
      completed_at: '2026-10-15T10:00:00Z',
    },
  ];
}

export function updateMockAssignmentProgress(assignmentId: string, progress: number): MyAssignment {
  return {
    assignment_id: assignmentId,
    course_id: 'CO1',
    course_title: 'Information security awareness',
    course_type: 'Mandatory',
    duration: '45 min',
    due_date: '2026-10-31',
    progress,
    status: progress >= 100 ? 'Completed' : 'In progress',
    completed_at: progress >= 100 ? new Date().toISOString() : null,
  };
}

export function sendMockReminders(_params: {
  course_id?: string;
  assignment_id?: string;
  employee_id?: string;
  bulk?: boolean;
}): RemindResponse {
  return {
    queued: 1,
    delivered: 0,
    skipped: 0,
    failed: 0,
    message: 'Mock: Reminders queued',
    details: [],
  };
}
