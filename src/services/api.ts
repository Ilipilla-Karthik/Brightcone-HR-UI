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
import {
  MOCK_EMPLOYEES,
  computeMockDashboardMetrics,
  getMockCourses,
  createMockCourse,
  updateMockCourse,
  getMockMyLearning,
  updateMockAssignmentProgress,
  sendMockReminders,
} from './mockFixtures';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
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
      console.warn('API request returned 401 unauthorized:', error.config?.url);
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
  try {
    const res = await api.get('/learn/dashboard');
    return res.data;
  } catch (err) {
    console.warn('Backend learn dashboard unavailable, returning mock dashboard fallback:', err);
    return computeMockDashboardMetrics();
  }
}

export const getLearnDashboard = getDashboardMetrics;

export async function getCourses(): Promise<Course[]> {
  if (IS_MOCK_MODE) {
    return getMockCourses();
  }
  try {
    const res = await api.get('/learn/courses');
    return res.data;
  } catch (err) {
    console.warn('Backend courses unavailable, returning mock courses fallback:', err);
    return getMockCourses();
  }
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

export default api;
