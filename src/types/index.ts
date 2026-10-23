export interface User {
  pid: string;
  name: string;
  email: string;
  role: 'HR_ADMIN' | 'EMPLOYEE' | string;
  is_verified?: boolean;
}

export interface AuthResponse {
  token: string;
  pid: string;
  name: string;
  email: string;
  role: 'HR_ADMIN' | 'EMPLOYEE' | string;
  is_verified: boolean;
}

export interface Employee {
  id?: number;
  emp_id: string;
  employee_code: string;
  full_name: string;
  job_title: string;
  designation?: string;
  department: string;
  grade: string;
  location: string;
  manager_name?: string | null;
  status: 'Active' | 'On leave' | 'Inactive';
  work_email?: string | null;
  email?: string | null;
  phone?: string | null;
  shift?: string | null;
  joined?: string | null;
  joining_date?: string | null;
  employee_id?: string;
  address?: string | null;
  dob?: string | null;
  blood_group?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_relation?: string | null;
  emergency_contact_phone?: string | null;
  ctc?: number | null;
}

export interface Job {
  id?: number;
  job_id: string;
  job_code: string;
  title: string;
  department: string;
  location: string;
  employment_type: string;
  status: 'Open' | 'Closed' | 'Approved' | 'Pending' | 'On hold' | 'Archived' | string;
  referral_bonus: number;
  description?: string | null;
}

export interface Candidate {
  id?: number;
  cand_id: string;
  candidate_code: string;
  full_name: string;
  email?: string | null;
  phone?: string | null;
  source: string;
  job_id?: string | null;
  job_title?: string | null;
  match_score?: number | null;
  stage: 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Offered' | 'Hired' | 'Rejected' | 'Archived' | string;
  created_at?: string;
  updated_at?: string;
}

export interface Interview {
  id?: number;
  interview_id: string;
  interview_code?: string;
  candidate_id?: string | null;
  candidate_name: string;
  job_title: string;
  round_name: string;
  mode?: string | null;
  scheduled_at: string;
  panel: string;
  venue_or_link?: string | null;
  rating?: number | null;
  result?: string | null;
  feedback?: string | null;
  status: 'Scheduled' | 'Completed' | 'Rescheduled' | 'Cancelled' | string;
  notes?: string | null;
}

export interface Offer {
  id?: number;
  offer_id: string;
  candidate_name: string;
  job_title: string;
  department?: string | null;
  offered_ctc?: number | null;
  joining_date?: string | null;
  offer_date?: string | null;
  valid_till?: string | null;
  approved_by?: string | null;
  file_name?: string | null;
  status: 'Draft' | 'Extended' | 'Accepted' | 'Declined' | 'Pending approval' | 'Sent' | 'Overdue' | string;
}

export interface Referral {
  id?: number;
  referral_id?: string;
  referred_by?: string;
  referrer_name?: string;
  candidate_name: string;
  candidate_email?: string;
  candidate_phone?: string;
  job_id?: string;
  job_title?: string;
  notes?: string;
  status?: string;
  bonus_amount?: number;
}

export interface Goal {
  id?: number;
  goal_id: string;
  employee_name: string;
  title: string;
  description?: string | null;
  target_date: string;
  progress_percentage: number;
  status: 'In Progress' | 'Completed' | 'Behind';
}

export interface Review {
  id?: number;
  review_id: string;
  employee_name: string;
  reviewer_name: string;
  review_period: string;
  rating: number;
  strengths?: string | null;
  improvement_areas?: string | null;
  comments?: string | null;
  status: 'Draft' | 'Submitted' | 'Approved';
}

export interface DashboardSummary {
  total_employees: number;
  active_employees: number;
  employees_on_leave: number;
  open_jobs: number;
  total_candidates: number;
  applications_by_stage: Record<string, number>;
  upcoming_interviews_count: number;
  upcoming_interviews: Interview[];
  goals_completed: number;
  pending_performance_reviews: number;
}

export interface PerformanceSummary {
  total_goals: number;
  completed_goals: number;
  in_progress_goals: number;
  pending_reviews: number;
}

export interface LeaveRequest {
  id?: number;
  request_id?: string;
  employee_code?: string;
  employee_name?: string;
  leave_type: string;
  from_date: string;
  to_date: string;
  days: string;
  reason: string;
  status: string;
  created_at?: string;
}

export interface AttendanceRecord {
  id?: number;
  record_id?: string;
  employee_code?: string;
  date: string;
  clock_in: string;
  clock_out?: string | null;
  work_mode: string;
  hours_worked?: string | null;
  status: string;
  created_at?: string;
}

export interface HelpdeskTicket {
  id?: number;
  ticket_code: string;
  employee_code?: string;
  employee_name?: string;
  category: string;
  subject: string;
  description: string;
  priority: string;
  status: string;
  created_at?: string;
}

export interface ResignationRequest {
  id?: number;
  request_id?: string;
  employee_code?: string;
  employee_name?: string;
  reason: string;
  proposed_last_day: string;
  notice_period_days?: number;
  status: string;
  created_at?: string;
}

export interface EmployeeAsset {
  id?: number;
  asset_id?: string;
  employee_code?: string;
  asset_type: string;
  model_name: string;
  serial_number: string;
  status: string;
  assigned_date: string;
  created_at?: string;
}

export interface EmployeeDocument {
  id?: number;
  doc_id?: string;
  employee_code?: string;
  title: string;
  document_type: string;
  file_size: string;
  issued_date: string;
  download_url?: string | null;
  created_at?: string;
}
