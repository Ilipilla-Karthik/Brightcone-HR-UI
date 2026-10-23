import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Download,
  Upload,
  UserPlus,
  Edit2,
  X,
  Clock,
  FileText,
  Monitor,
  CheckCircle2,
  Plus,
} from 'lucide-react';
import { employeesApi } from '../api/employees';
import { authApi } from '../api/auth';
import { leaveApi } from '../api/leave';
import { attendanceApi } from '../api/attendance';
import { helpdeskApi } from '../api/helpdesk';
import { resignationApi } from '../api/resignation';
import { assetsApi } from '../api/assets';
import { documentsApi } from '../api/documents';
import { performanceApi } from '../api/performance';
import type {
  Employee,
  LeaveRequest,
  AttendanceRecord,
  HelpdeskTicket,
  ResignationRequest,
  EmployeeAsset,
  EmployeeDocument,
  Goal,
} from '../types';
import { InitialsAvatar } from '../components/InitialsAvatar';
import { StatusBadge } from '../components/StatusBadge';
import { AddEmployeeModal } from '../components/AddEmployeeModal';
import { EditEmployeeModal } from '../components/EditEmployeeModal';
import { EmployeeDrawer } from '../components/EmployeeDrawer';
import { ImportCsvModal } from '../components/ImportCsvModal';

export const EmployeesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const currentView = searchParams.get('view') || 'profile';

  const currentUser = authApi.getCurrentUser();
  const isEmployee = currentUser?.role === 'EMPLOYEE' || currentUser?.email === 'rahul.varma@brightcone.ai';

  // =========================================================================
  // EMPLOYEE PROFILE & WORKPLACE STATE (PostgreSQL-backed)
  // =========================================================================
  const [profileTab, setProfileTab] = useState<'Personal' | 'Job' | 'Bank & statutory' | 'Family'>('Personal');
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Profile data matching PostgreSQL employees record
  const [profileData, setProfileData] = useState({
    fullName: 'Rahul Varma',
    workEmail: 'rahul.varma@brightcone.ai',
    phone: '+91 98480 11038',
    dob: 'Oct 7, 1996',
    bloodGroup: 'B+',
    address: 'Flat 402, Aparna Towers, Kondapur, Hyderabad 500084',
    emergencyContact: 'Lakshmi Varma (Mother), +91 98490 22110',
    emergencyName: 'Lakshmi Varma',
    emergencyRelation: 'Mother',
    emergencyPhone: '+91 98490 22110',
    employeeId: 'BC-1038',
    designation: 'Backend Engineer',
    department: 'Engineering',
    joiningDate: 'Aug 15, 2022',
    status: 'Active',
  });

  // Edit details form state
  const [editFullName, setEditFullName] = useState(profileData.fullName);
  const [editPhone, setEditPhone] = useState(profileData.phone);
  const [editDob, setEditDob] = useState(profileData.dob);
  const [editBloodGroup, setEditBloodGroup] = useState(profileData.bloodGroup);
  const [editAddress, setEditAddress] = useState(profileData.address);
  const [editEmergencyName, setEditEmergencyName] = useState(profileData.emergencyName);
  const [editEmergencyRelation, setEditEmergencyRelation] = useState(profileData.emergencyRelation);
  const [editEmergencyPhone, setEditEmergencyPhone] = useState(profileData.emergencyPhone);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load employee profile from PostgreSQL
  const loadProfile = async () => {
    try {
      const emp = await employeesApi.getMeProfile();
      if (emp) {
        setProfileData({
          fullName: emp.full_name || 'Rahul Varma',
          workEmail: emp.email || 'rahul.varma@brightcone.ai',
          phone: emp.phone || '+91 98480 11038',
          dob: emp.dob || 'Oct 7, 1996',
          bloodGroup: emp.blood_group || 'B+',
          address: emp.address || 'Flat 402, Aparna Towers, Kondapur, Hyderabad 500084',
          emergencyContact: emp.emergency_contact_name
            ? `${emp.emergency_contact_name} (${emp.emergency_contact_relation || 'Relation'}), ${emp.emergency_contact_phone || ''}`
            : 'Lakshmi Varma (Mother), +91 98490 22110',
          emergencyName: emp.emergency_contact_name || 'Lakshmi Varma',
          emergencyRelation: emp.emergency_contact_relation || 'Mother',
          emergencyPhone: emp.emergency_contact_phone || '+91 98490 22110',
          employeeId: emp.employee_id || 'BC-1038',
          designation: emp.designation || 'Backend Engineer',
          department: emp.department || 'Engineering',
          joiningDate: emp.joining_date || 'Aug 15, 2022',
          status: emp.status || 'Active',
        });
        setEditFullName(emp.full_name || 'Rahul Varma');
        setEditPhone(emp.phone || '+91 98480 11038');
        setEditDob(emp.dob || 'Oct 7, 1996');
        setEditBloodGroup(emp.blood_group || 'B+');
        setEditAddress(emp.address || 'Flat 402, Aparna Towers, Kondapur, Hyderabad 500084');
        setEditEmergencyName(emp.emergency_contact_name || 'Lakshmi Varma');
        setEditEmergencyRelation(emp.emergency_contact_relation || 'Mother');
        setEditEmergencyPhone(emp.emergency_contact_phone || '+91 98490 22110');
      }
    } catch (err) {
      console.warn('Error loading employee profile from PostgreSQL:', err);
    }
  };

  // Save profile to PostgreSQL
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await employeesApi.update('BC-1038', {
        full_name: editFullName,
        phone: editPhone,
        dob: editDob,
        blood_group: editBloodGroup,
        address: editAddress,
        emergency_contact_name: editEmergencyName,
        emergency_contact_relation: editEmergencyRelation,
        emergency_contact_phone: editEmergencyPhone,
      });

      setProfileData((prev) => ({
        ...prev,
        fullName: updated.full_name,
        phone: updated.phone || editPhone,
        dob: updated.dob || editDob,
        bloodGroup: updated.blood_group || editBloodGroup,
        address: updated.address || editAddress,
        emergencyName: updated.emergency_contact_name || editEmergencyName,
        emergencyRelation: updated.emergency_contact_relation || editEmergencyRelation,
        emergencyPhone: updated.emergency_contact_phone || editEmergencyPhone,
        emergencyContact: updated.emergency_contact_name
          ? `${updated.emergency_contact_name} (${updated.emergency_contact_relation || 'Relation'}), ${updated.emergency_contact_phone || ''}`
          : `${editEmergencyName} (${editEmergencyRelation}), ${editEmergencyPhone}`,
      }));

      setIsEditProfileOpen(false);
      showToast('Personal details updated successfully in PostgreSQL database!');
    } catch (err: any) {
      alert(`Failed to save profile: ${err.message || 'Database error'}`);
    }
  };

  // -------------------------------------------------------------------------
  // Leave Portal State (PostgreSQL)
  // -------------------------------------------------------------------------
  const [isApplyLeaveOpen, setIsApplyLeaveOpen] = useState(false);
  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [leaveFrom, setLeaveFrom] = useState('');
  const [leaveTo, setLeaveTo] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);

  const loadLeave = async () => {
    try {
      const data = await leaveApi.listMy();
      setLeaveRequests(data);
    } catch (err) {
      console.error('Failed to load leave requests:', err);
    }
  };

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveFrom || !leaveTo || !leaveReason) {
      alert('Please fill out all fields.');
      return;
    }
    try {
      await leaveApi.apply({
        leave_type: leaveType,
        from_date: leaveFrom,
        to_date: leaveTo,
        reason: leaveReason,
      });
      await loadLeave();
      setIsApplyLeaveOpen(false);
      setLeaveFrom('');
      setLeaveTo('');
      setLeaveReason('');
      showToast('Leave request submitted to Ananya Rao for approval in PostgreSQL!');
    } catch (err: any) {
      alert(`Failed to submit leave: ${err.message || 'Database error'}`);
    }
  };

  // -------------------------------------------------------------------------
  // Attendance Portal State (PostgreSQL)
  // -------------------------------------------------------------------------
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [attendanceStatusMsg, setAttendanceStatusMsg] = useState('Checking status...');

  const loadAttendance = async () => {
    try {
      const status = await attendanceApi.getStatus();
      setIsCheckedIn(status.is_checked_in);
      if (status.is_checked_in) {
        setAttendanceStatusMsg(
          `Logged In (${status.last_clock_in ? new Date(status.last_clock_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today'})`
        );
      } else {
        setAttendanceStatusMsg(
          status.last_clock_out
            ? `Checked Out at ${new Date(status.last_clock_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
            : 'Not checked in today'
        );
      }
      const records = await attendanceApi.listMy();
      setAttendanceRecords(records);
    } catch (err) {
      console.error('Failed to load attendance:', err);
    }
  };

  const handleToggleAttendance = async () => {
    try {
      const res = await attendanceApi.clock('Office');
      setIsCheckedIn(res.is_checked_in);
      await loadAttendance();
      showToast(res.message);
    } catch (err: any) {
      alert(`Attendance clock failed: ${err.message || 'Database error'}`);
    }
  };

  // -------------------------------------------------------------------------
  // HR Helpdesk State (PostgreSQL)
  // -------------------------------------------------------------------------
  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false);
  const [ticketCategory, setTicketCategory] = useState('IT Hardware');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [tickets, setTickets] = useState<HelpdeskTicket[]>([]);

  const loadHelpdesk = async () => {
    try {
      const data = await helpdeskApi.listMy();
      setTickets(data);
    } catch (err) {
      console.error('Failed to load helpdesk tickets:', err);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketDescription) {
      alert('Subject and description required.');
      return;
    }
    try {
      const created = await helpdeskApi.createTicket({
        category: ticketCategory,
        subject: ticketSubject,
        description: ticketDescription,
        priority: 'Medium',
      });
      await loadHelpdesk();
      setIsCreateTicketOpen(false);
      setTicketSubject('');
      setTicketDescription('');
      showToast(`Support ticket ${created.ticket_code} raised successfully in PostgreSQL!`);
    } catch (err: any) {
      alert(`Failed to raise ticket: ${err.message || 'Database error'}`);
    }
  };

  // -------------------------------------------------------------------------
  // Goals, Documents, Assets & Resignation State (PostgreSQL)
  // -------------------------------------------------------------------------
  const [goals, setGoals] = useState<Goal[]>([]);
  const loadGoals = async () => {
    try {
      const data = await performanceApi.listGoals();
      setGoals(data);
    } catch (err) {
      console.error('Failed to load goals:', err);
    }
  };

  const [documents, setDocuments] = useState<EmployeeDocument[]>([]);
  const loadDocuments = async () => {
    try {
      const data = await documentsApi.listMy();
      setDocuments(data);
    } catch (err) {
      console.error('Failed to load documents:', err);
    }
  };

  const [assets, setAssets] = useState<EmployeeAsset[]>([]);
  const loadAssets = async () => {
    try {
      const data = await assetsApi.listMy();
      setAssets(data);
    } catch (err) {
      console.error('Failed to load assets:', err);
    }
  };

  const [isResignationModalOpen, setIsResignationModalOpen] = useState(false);
  const [resignDate, setResignDate] = useState('');
  const [resignReason, setResignReason] = useState('');
  const [resignationRequests, setResignationRequests] = useState<ResignationRequest[]>([]);

  const loadResignation = async () => {
    try {
      const data = await resignationApi.listMy();
      setResignationRequests(data);
    } catch (err) {
      console.error('Failed to load resignation requests:', err);
    }
  };

  const handleInitiateResignation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resignDate || !resignReason) {
      alert('Proposed last working day and reason are required.');
      return;
    }
    try {
      await resignationApi.initiate({
        reason: resignReason,
        proposed_last_day: resignDate,
      });
      await loadResignation();
      setIsResignationModalOpen(false);
      setResignDate('');
      setResignReason('');
      showToast('Separation request submitted to HR leadership in PostgreSQL!');
    } catch (err: any) {
      alert(`Failed to initiate separation: ${err.message || 'Database error'}`);
    }
  };

  // =========================================================================
  // HR ADMIN EMPLOYEES DIRECTORY STATE
  // =========================================================================
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals & Drawers state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await employeesApi.list({
        q: searchQuery || undefined,
        department: departmentFilter !== 'All' ? departmentFilter : undefined,
        status: statusFilter !== 'All' ? statusFilter : undefined,
      });
      setEmployees(data);
    } catch (err: any) {
      setError('Failed to fetch employee records from PostgreSQL backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEmployee) {
      loadProfile();
      loadLeave();
      loadAttendance();
      loadGoals();
      loadDocuments();
      loadAssets();
      loadHelpdesk();
      loadResignation();
    } else {
      fetchEmployees();
    }
  }, [departmentFilter, statusFilter, isEmployee]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEmployees();
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setDepartmentFilter('All');
    setStatusFilter('All');
  };

  const handleRowClick = (emp: Employee) => {
    setSelectedEmployee(emp);
    setIsDrawerOpen(true);
  };

  const handleEditClick = (e: React.MouseEvent, emp: Employee) => {
    e.stopPropagation();
    setSelectedEmployee(emp);
    setIsEditModalOpen(true);
  };

  const departments = [
    'All',
    'Leadership',
    'People Ops',
    'AI Research',
    'Engineering',
    'Sales',
    'Design',
    'Finance',
  ];

  const statuses = ['All', 'Active', 'On leave', 'Inactive'];
  const hasActiveFilters = searchQuery !== '' || departmentFilter !== 'All' || statusFilter !== 'All';

  // =========================================================================
  // RENDER: EMPLOYEE DASHBOARD (Screenshot 4)
  // =========================================================================
  if (isEmployee) {
    return (
      <div className="space-y-6 animate-in fade-in duration-150 pb-12">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 border border-slate-700 animate-in slide-in-from-bottom-5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs font-semibold">{toastMessage}</span>
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW 1: MY PROFILE (Screenshot 4)                                   */}
        {/* =================================================================== */}
        {currentView === 'profile' && (
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-[#10B981] uppercase">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                PEOPLE
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-heading mt-1">
                My profile
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Keep your details current so payroll, insurance and emergency contacts stay accurate.
              </p>
            </div>

            {/* Profile Card */}
            <div className="bg-white dark:bg-[#070D1E] rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#10B981] text-white text-xl font-bold flex items-center justify-center shrink-0 shadow-xs font-heading">
                  RV
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
                    {profileData.fullName}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                    Backend Engineer, Engineering
                  </p>
                </div>
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Active
                </span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 pt-1 overflow-x-auto">
              {(['Personal', 'Job', 'Bank & statutory', 'Family'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setProfileTab(tab)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    profileTab === tab
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs font-bold'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab 1: Personal details (Screenshot 4) */}
            {profileTab === 'Personal' && (
              <div className="bg-white dark:bg-[#070D1E] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-5">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                    Personal details
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setEditFullName(profileData.fullName);
                      setEditPhone(profileData.phone);
                      setEditDob(profileData.dob);
                      setEditBloodGroup(profileData.bloodGroup);
                      setEditAddress(profileData.address);
                      setEditEmergencyName(profileData.emergencyName);
                      setEditEmergencyRelation(profileData.emergencyRelation);
                      setEditEmergencyPhone(profileData.emergencyPhone);
                      setIsEditProfileOpen(true);
                    }}
                    className="text-[#2563EB] hover:text-[#1D4ED8] dark:text-blue-400 text-xs sm:text-sm font-semibold cursor-pointer transition-colors"
                  >
                    Edit details
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-7 gap-x-6 mt-6">
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Full name</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                      {profileData.fullName}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Work email</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                      {profileData.workEmail}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Phone</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                      {profileData.phone}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Date of birth</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                      {profileData.dob}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Blood group</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                      {profileData.bloodGroup}
                    </p>
                  </div>

                  <div className="lg:col-span-2">
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Address</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-1 leading-snug">
                      {profileData.address}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Emergency contact</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-1 leading-snug">
                      {profileData.emergencyContact}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Job details */}
            {profileTab === 'Job' && (
              <div className="bg-white dark:bg-[#070D1E] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div className="border-b border-slate-100 dark:border-slate-800/80 pb-5">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                    Employment &amp; Job information
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-7 gap-x-6 mt-6">
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Employee ID</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">BC-1038</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Designation</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">Backend Engineer</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Department</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">Engineering</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Employment type</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">Full-time Regular</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Date of joining</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">Aug 15, 2022</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Reporting manager</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">Ananya Rao (VP of Engineering)</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Work location</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">Hyderabad (Hybrid)</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Notice period</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">60 Days</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Bank & statutory */}
            {profileTab === 'Bank & statutory' && (
              <div className="bg-white dark:bg-[#070D1E] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div className="border-b border-slate-100 dark:border-slate-800/80 pb-5">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                    Bank, Tax &amp; Statutory details
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-7 gap-x-6 mt-6">
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Bank name</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">HDFC Bank Ltd.</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Account number</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">•••• •••• 8842</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">IFSC code</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">HDFC0001842</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">PAN number</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">ABCDE1234F</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">UAN / PF number</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">100928374619</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Tax regime</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">New Tax Regime (Section 115BAC)</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Family */}
            {profileTab === 'Family' && (
              <div className="bg-white dark:bg-[#070D1E] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div className="border-b border-slate-100 dark:border-slate-800/80 pb-5">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                    Family &amp; Nominee details
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-7 gap-x-6 mt-6">
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Father's name</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">Suresh Varma</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Mother's name</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">Lakshmi Varma</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Marital status</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">Single</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Insurance nominee</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">Lakshmi Varma (100% share)</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Dependents covered</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">1 (Mother - Medical Cover ₹5,00,000)</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW 2: LEAVE SELF-SERVICE                                         */}
        {/* =================================================================== */}
        {currentView === 'leave' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-[#10B981] uppercase">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  LEAVE
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-heading mt-1">
                  Leave &amp; Time off
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Check available balances and apply for time off.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsApplyLeaveOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#10B981] hover:bg-[#059669] shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Apply for leave
              </button>
            </div>

            {/* Leave Balance Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-[#070D1E] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Casual Leave</div>
                <div className="mt-2 text-3xl font-bold text-slate-900 dark:text-white font-heading">14</div>
                <div className="mt-1 text-xs text-slate-400 font-medium">Days remaining / 18 annual</div>
              </div>
              <div className="bg-white dark:bg-[#070D1E] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Sick Leave</div>
                <div className="mt-2 text-3xl font-bold text-slate-900 dark:text-white font-heading">10</div>
                <div className="mt-1 text-xs text-slate-400 font-medium">Days remaining / 12 annual</div>
              </div>
              <div className="bg-white dark:bg-[#070D1E] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Earned / Privilege</div>
                <div className="mt-2 text-3xl font-bold text-slate-900 dark:text-white font-heading">8</div>
                <div className="mt-1 text-xs text-slate-400 font-medium">Days accrued / 15 annual</div>
              </div>
            </div>

            {/* History Table */}
            <div className="bg-white dark:bg-[#070D1E] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                  My leave history
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 text-slate-400 font-bold uppercase text-[11px]">
                      <th className="py-3 px-6">TYPE</th>
                      <th className="py-3 px-6">DATES</th>
                      <th className="py-3 px-6">DURATION</th>
                      <th className="py-3 px-6">APPLIED ON</th>
                      <th className="py-3 px-6">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {leaveRequests.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400">
                          No leave applications recorded yet in PostgreSQL database.
                        </td>
                      </tr>
                    ) : (
                      leaveRequests.map((req) => (
                        <tr key={req.id || req.request_id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                          <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                            {req.leave_type || (req as any).type}
                          </td>
                          <td className="py-4 px-6 text-slate-700 dark:text-slate-300">
                            {req.from_date && req.to_date ? `${req.from_date} to ${req.to_date}` : (req as any).dates}
                          </td>
                          <td className="py-4 px-6 text-slate-600 dark:text-slate-400">
                            {req.days || '1 day'}
                          </td>
                          <td className="py-4 px-6 text-slate-500">
                            {req.created_at ? new Date(req.created_at).toLocaleDateString() : (req as any).appliedOn || 'Recent'}
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                              req.status === 'Approved'
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${req.status === 'Approved' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                              {req.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW 3: ATTENDANCE (PostgreSQL-backed)                               */}
        {/* =================================================================== */}
        {currentView === 'attendance' && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-[#10B981] uppercase">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                ATTENDANCE
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-heading mt-1">
                Attendance tracker
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Daily check-ins, working hours, and monthly attendance records persisted in PostgreSQL.
              </p>
            </div>

            <div className="bg-white dark:bg-[#070D1E] rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                    Today: {attendanceStatusMsg}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Shift: 09:30 AM - 06:30 PM • Office Mode • Live Sync
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleToggleAttendance}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white shadow-sm transition-all cursor-pointer ${
                  isCheckedIn ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {isCheckedIn ? 'Check Out for the Day' : 'Clock In / Check In'}
              </button>
            </div>

            {/* Attendance History Table */}
            <div className="bg-white dark:bg-[#070D1E] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                  Attendance logs (PostgreSQL)
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 text-slate-400 font-bold uppercase text-[11px]">
                      <th className="py-3 px-6">DATE</th>
                      <th className="py-3 px-6">CLOCK IN</th>
                      <th className="py-3 px-6">CLOCK OUT</th>
                      <th className="py-3 px-6">WORK MODE</th>
                      <th className="py-3 px-6">HOURS</th>
                      <th className="py-3 px-6">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {attendanceRecords.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400">
                          No attendance records found yet. Click 'Clock In' above to record today's attendance.
                        </td>
                      </tr>
                    ) : (
                      attendanceRecords.map((att) => (
                        <tr key={att.id || att.record_id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                          <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">{att.date}</td>
                          <td className="py-4 px-6 text-slate-700 dark:text-slate-300">{att.clock_in}</td>
                          <td className="py-4 px-6 text-slate-600 dark:text-slate-400">{att.clock_out || '—'}</td>
                          <td className="py-4 px-6 text-slate-500">{att.work_mode}</td>
                          <td className="py-4 px-6 text-slate-500">{att.hours_worked || 'In progress'}</td>
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              {att.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW 4: GOALS & REVIEWS (PostgreSQL-backed)                         */}
        {/* =================================================================== */}
        {currentView === 'goals' && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-[#10B981] uppercase">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                GROW
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-heading mt-1">
                Goals &amp; reviews
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Performance Cycle OKRs and managerial evaluation backed by PostgreSQL.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {goals.length === 0 ? (
                <>
                  <div className="bg-white dark:bg-[#070D1E] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg">Engineering OKR 1</span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">85% Complete</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      High-throughput Async Task Engine
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Refactor Rust backend query layer to optimize PostgreSQL connection pooling and reduce p99 response times below 15ms.
                    </p>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#10B981] h-full rounded-full" style={{ width: '85%' }} />
                    </div>
                  </div>

                  <div className="bg-white dark:bg-[#070D1E] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg">Engineering OKR 2</span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">100% Complete</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Role-Based Access Control Architecture
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Design clean dual-role separation between HR Admin and Employee Self-Service with full end-to-end functionality.
                    </p>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#10B981] h-full rounded-full" style={{ width: '100%' }} />
                    </div>
                  </div>
                </>
              ) : (
                goals.map((g) => (
                  <div key={g.goal_id} className="bg-white dark:bg-[#070D1E] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg">{g.status}</span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{g.progress_percentage}% Complete</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{g.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{g.description || 'Target date: ' + g.target_date}</p>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#10B981] h-full rounded-full" style={{ width: `${g.progress_percentage}%` }} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW 5: DOCUMENTS & LETTERS (PostgreSQL-backed)                     */}
        {/* =================================================================== */}
        {currentView === 'documents' && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-[#10B981] uppercase">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                WORKPLACE
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-heading mt-1">
                Documents &amp; letters
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Access official employment documents, letters and signed agreements stored in PostgreSQL.
              </p>
            </div>

            <div className="bg-white dark:bg-[#070D1E] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs divide-y divide-slate-100 dark:divide-slate-800">
              {documents.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">No documents uploaded yet in PostgreSQL.</div>
              ) : (
                documents.map((doc) => (
                  <div key={doc.id || doc.doc_id} className="p-5 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{doc.title}</h4>
                        <p className="text-[11px] text-slate-400">{doc.issued_date} • {doc.file_size} • {doc.document_type}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => showToast(`Downloaded ${doc.title}`)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                      Download
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW 6: MY ASSETS (PostgreSQL-backed)                               */}
        {/* =================================================================== */}
        {currentView === 'assets' && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-[#10B981] uppercase">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                WORKPLACE
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-heading mt-1">
                My assets
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Company hardware and equipment assigned to you in PostgreSQL.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {assets.length === 0 ? (
                <div className="col-span-3 p-8 text-center text-slate-400 text-xs">No assets assigned yet in PostgreSQL.</div>
              ) : (
                assets.map((asset) => (
                  <div key={asset.id || asset.asset_id} className="bg-white dark:bg-[#070D1E] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center">
                      <Monitor className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{asset.model_name}</h3>
                    <p className="text-xs text-slate-500">{asset.asset_type} • Assigned {asset.assigned_date}</p>
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex justify-between">
                      <span>Serial: {asset.serial_number}</span>
                      <span className="text-emerald-600 font-bold">{asset.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW 7: HR HELPDESK (PostgreSQL-backed)                             */}
        {/* =================================================================== */}
        {currentView === 'helpdesk' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-[#10B981] uppercase">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  WORKPLACE
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-heading mt-1">
                  HR helpdesk
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Raise questions regarding payroll, insurance, IT hardware or policies. Persisted in PostgreSQL.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsCreateTicketOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#10B981] hover:bg-[#059669] shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Raise support ticket
              </button>
            </div>

            <div className="bg-white dark:bg-[#070D1E] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs divide-y divide-slate-100 dark:divide-slate-800">
              {tickets.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">No support tickets raised yet in PostgreSQL.</div>
              ) : (
                tickets.map((t) => (
                  <div key={t.id || t.ticket_code} className="p-5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.ticket_code} • {t.category}</span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5">{t.subject}</h4>
                      <p className="text-xs text-slate-500 mt-1">{t.description}</p>
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        {t.created_at ? new Date(t.created_at).toLocaleDateString() : 'Recent'}
                      </span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      t.status === 'Resolved' || t.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* VIEW 8: RESIGNATION (PostgreSQL-backed)                             */}
        {/* =================================================================== */}
        {currentView === 'resignation' && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-[#10B981] uppercase">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                WORKPLACE
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-heading mt-1">
                Resignation &amp; exit policy
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Brightcone career separation procedures and guidelines.
              </p>
            </div>

            <div className="bg-white dark:bg-[#070D1E] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Separation Policy Terms</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                As per your employment agreement, the contractual notice period for regular engineering roles is <strong>60 days</strong>. If you are exploring career changes or personal reasons, please speak with your reporting manager <strong>Ananya Rao</strong> or HR leadership prior to submitting a formal request.
              </p>

              {resignationRequests.length > 0 && (
                <div className="mt-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">Active Separation Request (PostgreSQL)</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200">
                      {resignationRequests[0].status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300">
                    <strong>Proposed Last Day:</strong> {resignationRequests[0].proposed_last_day}
                  </p>
                  <p className="text-xs text-slate-700 dark:text-slate-300">
                    <strong>Reason:</strong> {resignationRequests[0].reason}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Submitted on {resignationRequests[0].created_at ? new Date(resignationRequests[0].created_at).toLocaleDateString() : 'Recently'}
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsResignationModalOpen(true)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 border border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                >
                  Initiate separation request
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* MODAL: EDIT PERSONAL DETAILS (Screenshot 4)                         */}
        {/* =================================================================== */}
        {isEditProfileOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white dark:bg-[#070D1E] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-6 max-h-[90vh] overflow-y-auto">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-heading">
                  Edit personal details
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Update your contact, address and emergency contact details.
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Full name
                  </label>
                  <input
                    type="text"
                    required
                    value={editFullName}
                    onChange={(e) => setEditFullName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Phone
                    </label>
                    <input
                      type="text"
                      required
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Date of birth
                    </label>
                    <input
                      type="text"
                      value={editDob}
                      onChange={(e) => setEditDob(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Blood group
                  </label>
                  <input
                    type="text"
                    value={editBloodGroup}
                    onChange={(e) => setEditBloodGroup(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Address
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white resize-y"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Emergency name
                    </label>
                    <input
                      type="text"
                      value={editEmergencyName}
                      onChange={(e) => setEditEmergencyName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Relation
                    </label>
                    <input
                      type="text"
                      value={editEmergencyRelation}
                      onChange={(e) => setEditEmergencyRelation(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                      Contact phone
                    </label>
                    <input
                      type="text"
                      value={editEmergencyPhone}
                      onChange={(e) => setEditEmergencyPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditProfileOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-all cursor-pointer shadow-sm"
                  >
                    Save changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: APPLY FOR LEAVE */}
        {isApplyLeaveOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white dark:bg-[#070D1E] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
                  Apply for leave
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Manager approval will be requested automatically.
                </p>
              </div>

              <form onSubmit={handleApplyLeave} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Leave type
                  </label>
                  <select
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="Casual Leave">Casual Leave (14 available)</option>
                    <option value="Sick Leave">Sick Leave (10 available)</option>
                    <option value="Earned Leave">Earned Leave (8 available)</option>
                    <option value="Compensatory Off">Compensatory Off</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                      From date
                    </label>
                    <input
                      type="date"
                      required
                      value={leaveFrom}
                      onChange={(e) => setLeaveFrom(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                      To date
                    </label>
                    <input
                      type="date"
                      required
                      value={leaveTo}
                      onChange={(e) => setLeaveTo(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Reason
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={leaveReason}
                    onChange={(e) => setLeaveReason(e.target.value)}
                    placeholder="Brief explanation for time off..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white resize-y"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsApplyLeaveOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#10B981] hover:bg-[#059669]"
                  >
                    Submit request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: RAISE TICKET */}
        {isCreateTicketOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white dark:bg-[#070D1E] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
                  Raise HR ticket
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Our operations team will respond within 24 business hours.
                </p>
              </div>

              <form onSubmit={handleCreateTicket} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Category
                  </label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="IT Hardware">IT Hardware & Equipment</option>
                    <option value="Payroll">Payroll & Salary Slips</option>
                    <option value="Benefits">Medical Benefits & Insurance</option>
                    <option value="Facilities">Workplace & Facilities</option>
                    <option value="General">General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder="Brief subject summary"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={ticketDescription}
                    onChange={(e) => setTicketDescription(e.target.value)}
                    placeholder="Provide details of your request..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white resize-y"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateTicketOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#10B981] hover:bg-[#059669]"
                  >
                    Raise ticket
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: RESIGNATION */}
        {isResignationModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white dark:bg-[#070D1E] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white font-heading">
                  Initiate separation request
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Submit formal resignation to HR leadership and reporting manager in PostgreSQL.
                </p>
              </div>

              <form onSubmit={handleInitiateResignation} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Proposed last working day
                  </label>
                  <input
                    type="date"
                    required
                    value={resignDate}
                    onChange={(e) => setResignDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Standard notice period: 60 days</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Reason for separation
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={resignReason}
                    onChange={(e) => setResignReason(e.target.value)}
                    placeholder="Please share details regarding your career transition..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white resize-y"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsResignationModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700"
                  >
                    Confirm &amp; submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // RENDER: HR ADMIN EMPLOYEES DIRECTORY
  // =========================================================================
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#070D1E] p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Employees</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Add, edit and manage every employee record.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 shadow-2xs transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            Import CSV
          </button>

          <a
            href={employeesApi.exportCsvUrl({
              q: searchQuery || undefined,
              department: departmentFilter !== 'All' ? departmentFilter : undefined,
              status: statusFilter !== 'All' ? statusFilter : undefined,
            })}
            download="employees_export.csv"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Export
          </a>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0B2641] hover:bg-[#071B2F] rounded-xl shadow-xs transition-all hover:shadow-md cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5 text-[#12C2A2]" />
            Add employee
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white dark:bg-[#070D1E] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, role, or employee ID..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:border-[#0B6FDB] focus:ring-1 focus:ring-[#0B6FDB] outline-hidden transition-all text-slate-900 dark:text-white"
          />
        </form>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          {/* Department Filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400 hidden lg:inline">Dept:</span>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:border-[#0B6FDB] text-slate-700 dark:text-slate-300 font-medium"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === 'All' ? 'All Departments' : dept}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400 hidden lg:inline">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:border-[#0B6FDB] text-slate-700 dark:text-slate-300 font-medium"
            >
              {statuses.map((st) => (
                <option key={st} value={st}>
                  {st === 'All' ? 'All Statuses' : st}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Clear filters"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Table Area */}
      <div className="bg-white dark:bg-[#070D1E] rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0B6FDB]" />
            <p className="mt-2 text-xs text-slate-500">Loading directory from PostgreSQL...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-500 text-xs">
            <p>{error}</p>
            <button
              onClick={fetchEmployees}
              className="mt-3 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg font-semibold hover:bg-rose-100 text-xs"
            >
              Retry
            </button>
          </div>
        ) : employees.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No employees found</p>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your search query or filter criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">EMPLOYEE</th>
                  <th className="py-3 px-4">EMP ID</th>
                  <th className="py-3 px-4">DEPARTMENT</th>
                  <th className="py-3 px-4">DESIGNATION</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4">JOINED</th>
                  <th className="py-3 px-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {employees.map((emp) => (
                  <tr
                    key={emp.id}
                    onClick={() => handleRowClick(emp)}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <InitialsAvatar name={emp.full_name} size="md" />
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white group-hover:text-[#0B6FDB] transition-colors">
                            {emp.full_name}
                          </div>
                          <div className="text-[11px] text-slate-400">{emp.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-600 dark:text-slate-300">
                      {emp.employee_id}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-medium">{emp.department}</td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">{emp.designation}</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={emp.status} />
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{emp.joining_date}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => handleEditClick(e, emp)}
                        className="p-1.5 text-slate-400 hover:text-[#0B6FDB] hover:bg-blue-50 rounded-lg transition-colors"
                        title={`Edit ${emp.full_name}`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer record count */}
        <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {employees.length} employee records</span>
          <span className="text-[11px] text-slate-400">PostgreSQL persistent storage</span>
        </div>
      </div>

      {/* Add Employee Modal */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchEmployees}
        existingEmployees={employees}
      />

      {/* Edit Employee Modal */}
      <EditEmployeeModal
        employee={selectedEmployee}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedEmployee(null);
        }}
        onSuccess={fetchEmployees}
        existingEmployees={employees}
      />

      {/* Employee Detail Drawer */}
      <EmployeeDrawer
        employee={selectedEmployee}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedEmployee(null);
        }}
        onEdit={(emp) => {
          setSelectedEmployee(emp);
          setIsEditModalOpen(true);
        }}
      />

      {/* Import CSV Modal */}
      <ImportCsvModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={fetchEmployees}
      />
    </div>
  );
};
