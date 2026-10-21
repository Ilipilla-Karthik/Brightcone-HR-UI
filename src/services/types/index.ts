export interface User {
  id?: string;
  pid?: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role: string;
  departmentId?: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  dept: string;
  loc: string;
  mgr: string | null;
  status: 'Active' | 'Inactive' | 'On leave' | 'Probation' | 'Notice period';
}

export interface Course {
  id: string;
  title: string;
  course_type: 'Mandatory' | 'Elective';
  duration: string;
  audience: string;
  due_date: string | null;
  total_assigned: number;
  completed_count: number;
  completion_percentage: number;
  created_at?: string;
}

export interface CourseAssignment {
  id: string;
  course_id: string;
  employee_id: string;
  employee_name: string;
  progress: number;
  status: 'Not started' | 'In progress' | 'Completed';
  completed_at?: string | null;
}

export interface MyAssignment {
  assignment_id: string;
  course_id: string;
  course_title: string;
  course_type: 'Mandatory' | 'Elective';
  duration: string;
  due_date: string | null;
  progress: number;
  status: 'Not started' | 'In progress' | 'Completed';
  completed_at?: string | null;
}

export interface OpenMandatoryItem {
  assignment_id: string;
  employee_id: string;
  employee_name: string;
  department: string;
  course_id: string;
  course_title: string;
  due_date: string | null;
  progress: number;
}

export interface CourseCompletionStat {
  course_id: string;
  title: string;
  course_type: string;
  total_assigned: number;
  completed_count: number;
  percentage: number;
}

export interface MandatoryCourseStat {
  course_id: string;
  title: string;
  due_date: string | null;
  completed_count: number;
  total_assigned: number;
}

export interface LearnDashboardMetrics {
  mandatory_compliance: number;
  total_courses: number;
  mandatory_courses_count: number;
  elective_courses_count: number;
  in_progress_count: number;
  people_behind_count: number;
  completion_by_course: CourseCompletionStat[];
  compliance_breakdown: MandatoryCourseStat[];
  open_mandatory: OpenMandatoryItem[];
  total_open_mandatory: number;
}

export interface ReminderDetail {
  assignment_id: string;
  employee_name: string;
  course_title: string;
  status: 'Queued' | 'Delivered' | 'Skipped' | 'Failed';
  reason?: string | null;
}

export interface RemindResponse {
  queued: number;
  delivered: number;
  skipped: number;
  failed: number;
  message: string;
  details: ReminderDetail[];
}

export interface CreateCoursePayload {
  title: string;
  course_type: 'Mandatory' | 'Elective';
  duration: string;
  audience: string;
  due_date: string | null;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
