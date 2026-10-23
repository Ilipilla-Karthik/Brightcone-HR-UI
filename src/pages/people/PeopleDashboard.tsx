import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  UserPlus,
  Users,
  User,
  Shield,
  Clock,
  Laptop,
  FileText,
  Download,
} from 'lucide-react';
import { api } from '../../services/api';
import { EmployeeItem, AddEmployeeModal, ApplyLeaveModal, EmployeeDetailModal } from './PeopleModals';

const DEFAULT_EMPLOYEES: EmployeeItem[] = [
  { id: '1', code: 'BC-1001', name: 'Ananya Rao', department: 'People Operations', designation: 'Head of HR', email: 'ananya.rao@brightcone.ai', status: 'Active', joiningDate: '15 Jan 2021' },
  { id: '2', code: 'BC-1038', name: 'Rahul Varma', department: 'Engineering', designation: 'Senior Full-Stack Engineer', email: 'rahul.varma@brightcone.ai', status: 'Active', joiningDate: '12 Aug 2022' },
  { id: '3', code: 'BC-1045', name: 'Aditi Sharma', department: 'Engineering', designation: 'Staff ML Engineer', email: 'aditi.sharma@brightcone.ai', status: 'Active', joiningDate: '01 Feb 2023' },
  { id: '4', code: 'BC-1052', name: 'Rohan Gupta', department: 'Engineering', designation: 'DevOps Specialist', email: 'rohan.gupta@brightcone.ai', status: 'On Leave', joiningDate: '10 Nov 2023' },
  { id: '5', code: 'BC-1061', name: 'Kavya Pillai', department: 'Product & Design', designation: 'Principal Product Designer', email: 'kavya.pillai@brightcone.ai', status: 'Active', joiningDate: '18 Apr 2023' },
  { id: '6', code: 'BC-1070', name: 'Marcus Lee', department: 'Solutions Architecture', designation: 'Solutions Architect', email: 'marcus.lee@brightcone.ai', status: 'Probation', joiningDate: '01 Jul 2026' },
  { id: '7', code: 'BC-1082', name: 'Neha Bansal', department: 'Data Science', designation: 'Senior ML Engineer', email: 'neha.bansal@brightcone.ai', status: 'Active', joiningDate: '20 Sep 2023' },
  { id: '8', code: 'BC-1094', name: 'Tejas Patil', department: 'Quality Assurance', designation: 'QA Automation Lead', email: 'tejas.patil@brightcone.ai', status: 'Active', joiningDate: '05 Jan 2024' },
];

export const PeopleDashboard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'directory';

  const [employees, setEmployees] = useState<EmployeeItem[]>(DEFAULT_EMPLOYEES);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [selectedEmp, setSelectedEmp] = useState<EmployeeItem | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isLeaveOpen, setIsLeaveOpen] = useState(false);
  const [clockedIn, setClockedIn] = useState(true);

  const [leavesList, setLeavesList] = useState([
    { id: 'LV-1', type: 'Casual Leave', dates: '24 Oct 2026', days: '1 day', status: 'Approved', reason: 'Personal family event' },
    { id: 'LV-2', type: 'Sick Leave', dates: '12 Sep - 13 Sep 2026', days: '2 days', status: 'Approved', reason: 'Viral fever recovery' },
  ]);

  useEffect(() => {
    let active = true;
    api.get('/employees')
      .then((res) => {
        if (active && res.data && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: EmployeeItem[] = res.data.map((e: any, idx: number) => ({
            id: e.id || `emp-${idx}`,
            code: e.employee_code || e.code || `BC-10${idx + 10}`,
            name: e.full_name || e.name || 'Team Member',
            department: e.department || 'Engineering',
            designation: e.designation || e.role || 'Software Engineer',
            email: e.email || `${e.name?.toLowerCase().replace(/\s+/g, '.')}@brightcone.ai`,
            status: (e.status as any) || 'Active',
            joiningDate: e.joining_date || '01 Jan 2024',
          }));
          setEmployees(mapped);
        }
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  const setTab = (tab: string) => setSearchParams({ tab });

  const departments = ['All', ...Array.from(new Set(employees.map((e) => e.department)))];

  const filtered = employees.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.code.toLowerCase().includes(search.toLowerCase()) ||
      e.designation.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === 'All' || e.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--surface)] p-6 rounded-2xl border border-[var(--line)] shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--brand)]">
            <span className="w-2 h-2 rounded-full bg-[var(--brand)] animate-pulse" />
            People & Workplace Directory
          </div>
          <h1 className="text-2xl font-bold text-[var(--text)] mt-1">Workforce & Employee Portal</h1>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            Manage organization members, profiles, leaves, attendance, and equipment.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLeaveOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[var(--surface-2)] text-[var(--text)] text-xs font-semibold rounded-xl hover:bg-[var(--line)] transition"
          >
            <Shield size={14} /> Apply Leave
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[var(--brand)] text-white text-xs font-semibold rounded-xl hover:opacity-90 transition shadow-sm"
          >
            <UserPlus size={14} /> Add Member
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-[var(--line)] pb-3 overflow-x-auto text-xs font-semibold">
        {[
          { key: 'directory', label: 'All Employees', icon: <Users size={14} />, count: employees.length },
          { key: 'profile', label: 'My Profile', icon: <User size={14} /> },
          { key: 'leaves', label: 'Leaves & Balances', icon: <Shield size={14} />, count: '28d' },
          { key: 'attendance', label: 'Attendance', icon: <Clock size={14} /> },
          { key: 'assets', label: 'Hardware Assets', icon: <Laptop size={14} />, count: 3 },
          { key: 'documents', label: 'Documents', icon: <FileText size={14} />, count: 4 },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
              currentTab === t.key
                ? 'bg-[var(--surface-2)] text-[var(--brand)] shadow-xs'
                : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]/50'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
            {t.count !== undefined && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-[var(--line)] text-[var(--text)]">
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab 1: Directory */}
      {currentTab === 'directory' && (
        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--line)] overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[var(--line)] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--faint)]" size={14} />
              <input
                type="text"
                placeholder="Search by name, designation, code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-[var(--surface-2)] border border-[var(--line)] rounded-xl text-xs focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="px-3 py-1.5 bg-[var(--surface-2)] border border-[var(--line)] rounded-xl text-xs"
              >
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--surface-2)] border-b border-[var(--line)] text-[var(--muted)] uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Employee ID</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Role / Designation</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Joined</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {filtered.map((emp) => (
                  <tr key={emp.id} className="hover:bg-[var(--surface-2)]/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#3B82F6] to-[#06B6D4] text-white font-bold text-[10px] flex items-center justify-center">
                          {emp.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-bold text-[var(--text)]">{emp.name}</p>
                          <p className="text-[11px] text-[var(--muted)]">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-[var(--muted)]">{emp.code}</td>
                    <td className="py-3 px-4 text-[var(--text)]">{emp.department}</td>
                    <td className="py-3 px-4 text-[var(--muted)]">{emp.designation}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        {emp.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[var(--muted)]">{emp.joiningDate}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedEmp(emp)}
                        className="px-2.5 py-1 text-xs font-semibold bg-[var(--surface-2)] hover:bg-[var(--line)] rounded-lg text-[var(--text)]"
                      >
                        Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Employee Profile */}
      {currentTab === 'profile' && (
        <div className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--line)] space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-[var(--line)]">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#3B82F6] to-[#06B6D4] text-white font-bold text-xl flex items-center justify-center shadow-md">
              RV
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--text)]">Rahul Varma</h2>
              <p className="text-xs text-[var(--muted)] font-mono">BC-1038 • Senior Full-Stack Engineer</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                Active Employee
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-3 p-4 bg-[var(--surface-2)] rounded-xl border border-[var(--line)]">
              <h3 className="font-bold text-[var(--text)] text-sm">Personal & Contact Details</h3>
              <p><span className="text-[var(--muted)]">Email:</span> rahul.varma@brightcone.ai</p>
              <p><span className="text-[var(--muted)]">Phone:</span> +91 98480 11038</p>
              <p><span className="text-[var(--muted)]">Blood Group:</span> B+</p>
              <p><span className="text-[var(--muted)]">Address:</span> Flat 402, Aparna Towers, Kondapur, Hyderabad 500084</p>
            </div>
            <div className="space-y-3 p-4 bg-[var(--surface-2)] rounded-xl border border-[var(--line)]">
              <h3 className="font-bold text-[var(--text)] text-sm">Job & Organization Details</h3>
              <p><span className="text-[var(--muted)]">Department:</span> Engineering</p>
              <p><span className="text-[var(--muted)]">Designation:</span> Senior Full-Stack Engineer</p>
              <p><span className="text-[var(--muted)]">Reporting Manager:</span> Naresh Vemparala (CEO)</p>
              <p><span className="text-[var(--muted)]">Date of Joining:</span> 12 Aug 2022</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Leaves & Balances */}
      {currentTab === 'leaves' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--line)]">
              <span className="text-xs text-[var(--muted)]">Casual Leave</span>
              <p className="text-2xl font-bold text-[var(--brand)] mt-1">8 Days</p>
              <span className="text-[10px] text-[var(--muted)]">Used 4 of 12 days</span>
            </div>
            <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--line)]">
              <span className="text-xs text-[var(--muted)]">Sick Leave</span>
              <p className="text-2xl font-bold text-emerald-600 mt-1">6 Days</p>
              <span className="text-[10px] text-[var(--muted)]">Used 2 of 8 days</span>
            </div>
            <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--line)]">
              <span className="text-xs text-[var(--muted)]">Earned Leave</span>
              <p className="text-2xl font-bold text-violet-600 mt-1">14 Days</p>
              <span className="text-[10px] text-[var(--muted)]">Carried forward: 5 days</span>
            </div>
          </div>
          <div className="bg-[var(--surface)] rounded-2xl border border-[var(--line)] divide-y divide-[var(--line)]">
            {leavesList.map((lv) => (
              <div key={lv.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <p className="font-bold text-sm text-[var(--text)]">{lv.type} ({lv.days})</p>
                  <p className="text-[var(--muted)]">{lv.dates} • Reason: {lv.reason}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                  {lv.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Attendance Records */}
      {currentTab === 'attendance' && (
        <div className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--line)] space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[var(--surface-2)] rounded-xl border border-[var(--line)]">
            <div>
              <p className="font-bold text-sm text-[var(--text)]">Today's Clock Status</p>
              <p className="text-[var(--muted)]">Clocked in at 09:30 AM (Logged: 5h 45m)</p>
            </div>
            <button
              onClick={() => setClockedIn(!clockedIn)}
              className={`px-4 py-2 font-semibold text-xs rounded-xl transition ${
                clockedIn ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
              }`}
            >
              {clockedIn ? 'Clock Out Now' : 'Clock In Now'}
            </button>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-[var(--text)]">Recent Check-In Logs</h3>
            <div className="divide-y divide-[var(--line)]">
              {['23 Oct 2026', '22 Oct 2026', '21 Oct 2026', '20 Oct 2026'].map((dt, i) => (
                <div key={i} className="py-2.5 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-semibold text-[var(--text)]">{dt}</span>
                    <span className="text-[11px] text-[var(--muted)] ml-2">General Shift (09:30 AM - 06:00 PM)</span>
                  </div>
                  <span className="text-emerald-600 font-bold">Present (8h 30m)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Hardware Assets */}
      {currentTab === 'assets' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {[
            { name: 'Apple MacBook Pro M3 Max 16"', sn: 'BC-APL-9921', date: '15 Aug 2022', condition: 'Excellent' },
            { name: 'Dell UltraSharp 32" 4K Monitor', sn: 'BC-MON-4412', date: '20 Aug 2022', condition: 'Good' },
            { name: 'Jabra Evolve2 85 Wireless Headset', sn: 'BC-AUD-7719', date: '01 Nov 2023', condition: 'Excellent' },
          ].map((ast, i) => (
            <div key={i} className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--line)] space-y-2">
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Assigned
              </span>
              <p className="font-bold text-sm text-[var(--text)]">{ast.name}</p>
              <p className="font-mono text-[var(--muted)]">S/N: {ast.sn}</p>
              <p className="text-[var(--muted)]">Issued: {ast.date}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tab 6: Documents */}
      {currentTab === 'documents' && (
        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--line)] divide-y divide-[var(--line)] text-xs">
          {[
            { title: 'Employment Contract & Appointment Letter', date: '12 Aug 2022', size: '1.4 MB' },
            { title: 'Non-Disclosure & Confidentiality Agreement', date: '12 Aug 2022', size: '820 KB' },
            { title: 'Form 16 Tax Certificate (FY 2025-26)', date: '30 Jun 2026', size: '2.1 MB' },
            { title: 'Brightcone HR Handbook Policy Acknowledgement', date: '15 Jan 2026', size: '450 KB' },
          ].map((doc, i) => (
            <div key={i} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-[var(--text)]">{doc.title}</p>
                <p className="text-[var(--muted)]">Issued: {doc.date} • {doc.size}</p>
              </div>
              <button
                onClick={() => alert(`Downloading ${doc.title}`)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--surface-2)] text-[var(--text)] rounded-xl hover:bg-[var(--line)]"
              >
                <Download size={13} /> Download
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <AddEmployeeModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={(newEmp) => {
          setEmployees([{ id: `${Date.now()}`, status: 'Active', joiningDate: 'Today', ...newEmp }, ...employees]);
        }}
      />

      <ApplyLeaveModal
        isOpen={isLeaveOpen}
        onClose={() => setIsLeaveOpen(false)}
        onSubmit={(lv) => {
          setLeavesList([{ id: `LV-${Date.now().toString().slice(-3)}`, type: lv.type, dates: `${lv.from} to ${lv.to}`, days: '1 day', status: 'Submitted', reason: lv.reason }, ...leavesList]);
        }}
      />

      <EmployeeDetailModal
        emp={selectedEmp}
        onClose={() => setSelectedEmp(null)}
      />
    </div>
  );
};

export default PeopleDashboard;
