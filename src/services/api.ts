import axios from 'axios';
import {
  Course,
  CreateCoursePayload,
  Employee,
  LearnDashboardMetrics,
  MyAssignment,
  RemindResponse,
  ReviewCycle,
  CycleReviewItem,
  CycleDashboardData,
  CreateCyclePayload,
  RateEmployeePayload,
  RemindReviewResult,
} from './types';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 3000,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('persona');
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Explicitly isolated mock mode toggle (disabled by default in normal operation)
const IS_MOCK_MODE = import.meta.env.VITE_USE_MOCK === 'true';

// =========================================================
// Authoritative Record Fetchers
// =========================================================

export interface DepartmentItem {
  id?: string;
  name: string;
}

export async function getDepartments(): Promise<DepartmentItem[]> {
  if (IS_MOCK_MODE) {
    return [
      { name: 'Leadership' },
      { name: 'People Ops' },
      { name: 'AI Research' },
      { name: 'Engineering' },
      { name: 'Sales' },
      { name: 'Design' },
      { name: 'Finance' },
      { name: 'Customer Success' },
    ];
  }
  const res = await api.get('/departments');
  return res.data;
}

export async function getEmployees(): Promise<Employee[]> {
  if (IS_MOCK_MODE) {
    return MOCK_EMPLOYEES;
  }
  const res = await api.get('/employees');
  return res.data;
}

// Standard Authentication API
export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponseData {
  token: string;
  pid: string;
  name: string;
  email: string;
  role: string;
  is_verified?: boolean;
}

export async function loginApi(payload: LoginPayload): Promise<LoginResponseData> {
  const res = await api.post('/auth/login', payload);
  return res.data;
}

export async function logoutApi(): Promise<void> {
  try {
    await api.post('/auth/logout');
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('persona');
  }
}

// =========================================================
// Real API Endpoints (Normal Operation: No silent mock fallback)
// If API fails, throws error so calling view displays honest retry banner.
// =========================================================

export async function getDashboardMetrics(): Promise<LearnDashboardMetrics> {
  if (IS_MOCK_MODE) {
    return computeMockDashboardMetrics();
  }
  const res = await api.get('/learn/dashboard');
  return res.data;
}

export const getLearnDashboard = getDashboardMetrics;

export async function getCourses(): Promise<Course[]> {
  if (IS_MOCK_MODE) {
    return getMockCourses();
  }
  const res = await api.get('/learn/courses');
  return res.data;
}

export async function createCourse(payload: CreateCoursePayload): Promise<Course> {
  if (IS_MOCK_MODE) {
    return createMockCourse(payload);
  }
  const res = await api.post('/learn/courses', payload);
  return res.data;
}

export async function updateCourse(id: string, payload: CreateCoursePayload): Promise<Course> {
  if (IS_MOCK_MODE) {
    return updateMockCourse(id, payload);
  }
  const res = await api.put(`/learn/courses/${id}`, payload);
  return res.data;
}

export async function getMyLearning(employeeId?: string): Promise<MyAssignment[]> {
  if (IS_MOCK_MODE) {
    return getMockMyLearning();
  }
  const url = employeeId ? `/learn/my-learning?employee_id=${encodeURIComponent(employeeId)}` : '/learn/my-learning';
  const res = await api.get(url);
  return res.data;
}

export async function updateAssignmentProgress(
  assignmentId: string,
  progress: number
): Promise<MyAssignment> {
  if (IS_MOCK_MODE) {
    return updateMockAssignmentProgress(assignmentId, progress);
  }
  const res = await api.post(`/learn/assignments/${assignmentId}/progress`, { progress });
  return res.data;
}

export async function sendReminders(params: {
  course_id?: string;
  assignment_id?: string;
  employee_id?: string;
  bulk?: boolean;
}): Promise<RemindResponse> {
  if (IS_MOCK_MODE) {
    return sendMockReminders(params);
  }
  const res = await api.post('/learn/remind', params);
  return res.data;
}

// ---------------------------------------------------------------------------
// REC-12: Performance Admin API
// ---------------------------------------------------------------------------

export async function getReviewCycles(): Promise<ReviewCycle[]> {
  const res = await api.get('/performance/cycles');
  return res.data;
}

export async function createReviewCycle(payload: CreateCyclePayload): Promise<ReviewCycle> {
  const res = await api.post('/performance/cycles', payload);
  return res.data;
}

export async function advanceReviewCycle(cycleId: string): Promise<ReviewCycle> {
  const res = await api.post(`/performance/cycles/${cycleId}/advance`);
  return res.data;
}

export async function getCycleDashboard(cycleId: string): Promise<CycleDashboardData> {
  const res = await api.get(`/performance/cycles/${cycleId}/dashboard`);
  return res.data;
}

export async function rateEmployee(
  cycleId: string,
  employeeId: string,
  payload: RateEmployeePayload
): Promise<CycleReviewItem> {
  const res = await api.post(`/performance/cycles/${cycleId}/rate/${employeeId}`, payload);
  return res.data;
}

export async function remindReview(
  cycleId: string,
  employeeId: string
): Promise<RemindReviewResult> {
  const res = await api.post(`/performance/cycles/${cycleId}/remind/${employeeId}`);
  return res.data;
}

export async function downloadExportRatings(cycleId: string): Promise<void> {
  const token = localStorage.getItem('token');
  const response = await fetch(`/api/v1/performance/cycles/${cycleId}/export`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!response.ok) {
    throw new Error('Failed to export ratings');
  }
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ratings_${cycleId}.csv`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

// =========================================================
// Isolated In-Memory Fixtures (Active ONLY when VITE_USE_MOCK=true)
// =========================================================

const MOCK_EMPLOYEES: Employee[] = [
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

interface StoredCourse {
  id: string;
  title: string;
  course_type: 'Mandatory' | 'Elective';
  duration: string;
  audience: string;
  due_date: string | null;
}

let mockCoursesStore: StoredCourse[] = [
  { id: 'CO1', title: 'Information security awareness', course_type: 'Mandatory', duration: '45 min', audience: 'Everyone', due_date: '2026-10-31' },
  { id: 'CO2', title: 'POSH: Prevention of sexual harassment', course_type: 'Mandatory', duration: '30 min', audience: 'Everyone', due_date: '2026-10-20' },
  { id: 'CO3', title: 'Data privacy & HIPAA basics', course_type: 'Mandatory', duration: '40 min', audience: 'Engineering', due_date: '2026-11-15' },
  { id: 'CO4', title: 'Building agentic workflows', course_type: 'Elective', duration: '3 h', audience: 'Everyone', due_date: '' },
  { id: 'CO5', title: 'Leading high-trust teams', course_type: 'Elective', duration: '2 h', audience: 'Managers', due_date: '' },
];

function computeMockDashboardMetrics(): LearnDashboardMetrics {
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

function getMockCourses(): Course[] {
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

function createMockCourse(payload: CreateCoursePayload): Course {
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

function updateMockCourse(id: string, payload: CreateCoursePayload): Course {
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

function getMockMyLearning(): MyAssignment[] {
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

function updateMockAssignmentProgress(assignmentId: string, progress: number): MyAssignment {
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

function sendMockReminders(_params: {
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

export default api;
