import React, { useState, useEffect } from 'react';
import {
  Search,
  UserPlus,
  Mail,
  X,
  Filter,
} from 'lucide-react';
import { api } from '../../services/api';

interface EmployeeItem {
  id: string | number;
  code: string;
  name: string;
  department: string;
  designation: string;
  email: string;
  status: 'Active' | 'On Leave' | 'Probation' | 'Notice';
  joiningDate: string;
}

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
  const [employees, setEmployees] = useState<EmployeeItem[]>(DEFAULT_EMPLOYEES);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [selectedEmp, setSelectedEmp] = useState<EmployeeItem | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newDept, setNewDept] = useState('Engineering');
  const [newRole, setNewRole] = useState('Software Engineer');

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

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;
    const newEmp: EmployeeItem = {
      id: `${Date.now()}`,
      code: `BC-10${employees.length + 12}`,
      name: newName,
      email: newEmail,
      department: newDept,
      designation: newRole,
      status: 'Active',
      joiningDate: 'Today',
    };
    setEmployees([newEmp, ...employees]);
    setIsAddOpen(false);
    setNewName('');
    setNewEmail('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--surface)] p-6 rounded-2xl border border-[var(--line)] shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--brand)]">
            <span className="w-2 h-2 rounded-full bg-[var(--brand)] animate-pulse" />
            Active Workforce Directory
          </div>
          <h1 className="text-2xl font-bold text-[var(--text)] mt-1">People & Team Directory</h1>
          <p className="text-sm text-[var(--muted)] mt-0.5">
            Manage organization members, departments, roles, and status.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[var(--brand)] text-white text-sm font-semibold rounded-xl hover:opacity-90 transition shadow-sm"
          >
            <UserPlus size={16} /> Add Employee
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--line)]">
          <span className="text-xs text-[var(--muted)] font-medium">Total Headcount</span>
          <p className="text-2xl font-bold text-[var(--text)] mt-1">{employees.length}</p>
        </div>
        <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--line)]">
          <span className="text-xs text-[var(--muted)] font-medium">Active Members</span>
          <p className="text-2xl font-bold text-[var(--ok)] mt-1">
            {employees.filter((e) => e.status === 'Active').length}
          </p>
        </div>
        <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--line)]">
          <span className="text-xs text-[var(--muted)] font-medium">On Leave</span>
          <p className="text-2xl font-bold text-[var(--warn)] mt-1">
            {employees.filter((e) => e.status === 'On Leave').length}
          </p>
        </div>
        <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--line)]">
          <span className="text-xs text-[var(--muted)] font-medium">Probationary</span>
          <p className="text-2xl font-bold text-[var(--info)] mt-1">
            {employees.filter((e) => e.status === 'Probation').length}
          </p>
        </div>
      </div>

      {/* Search and Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--faint)]" size={16} />
          <input
            type="text"
            placeholder="Search by name, ID, role or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--surface)] border border-[var(--line)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={16} className="text-[var(--muted)]" />
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-2.5 bg-[var(--surface)] border border-[var(--line)] rounded-xl text-sm text-[var(--text)] focus:outline-none"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d === 'All' ? 'All Departments' : d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-[var(--surface)] rounded-2xl border border-[var(--line)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-[var(--line)] bg-[var(--surface-2)] text-[var(--muted)] font-semibold text-xs uppercase tracking-wider">
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Designation</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {filtered.map((emp) => (
                <tr
                  key={emp.id}
                  onClick={() => setSelectedEmp(emp)}
                  className="hover:bg-[var(--surface-2)]/60 cursor-pointer transition"
                >
                  <td className="py-3.5 px-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[var(--brand)] to-cyan-500 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                      {emp.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--text)]">{emp.name}</p>
                      <p className="text-xs text-[var(--muted)] flex items-center gap-1">
                        <Mail size={12} /> {emp.email}
                      </p>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-[var(--muted)]">{emp.code}</td>
                  <td className="py-3.5 px-4 text-[var(--text)]">{emp.department}</td>
                  <td className="py-3.5 px-4 text-[var(--muted)]">{emp.designation}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        emp.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : emp.status === 'On Leave'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                      }`}
                    >
                      {emp.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEmp(emp);
                      }}
                      className="text-xs text-[var(--brand)] font-semibold hover:underline"
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-[var(--muted)] text-sm">
                    No employees found matching "{search}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Profile Detail Drawer Modal */}
      {selectedEmp && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--surface)] w-full max-w-lg rounded-2xl border border-[var(--line)] shadow-xl overflow-hidden p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <h2 className="text-lg font-bold text-[var(--text)]">Employee Details</h2>
              <button
                onClick={() => setSelectedEmp(null)}
                className="text-[var(--muted)] hover:text-[var(--text)] p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[var(--brand)] to-cyan-500 text-white font-bold text-lg flex items-center justify-center shadow-md">
                {selectedEmp.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--text)]">{selectedEmp.name}</h3>
                <p className="text-xs text-[var(--muted)] font-mono">{selectedEmp.code} • {selectedEmp.designation}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm bg-[var(--surface-2)] p-4 rounded-xl">
              <div>
                <span className="text-xs text-[var(--muted)]">Department</span>
                <p className="font-medium text-[var(--text)] mt-0.5">{selectedEmp.department}</p>
              </div>
              <div>
                <span className="text-xs text-[var(--muted)]">Status</span>
                <p className="font-medium text-[var(--text)] mt-0.5">{selectedEmp.status}</p>
              </div>
              <div>
                <span className="text-xs text-[var(--muted)]">Work Email</span>
                <p className="font-medium text-[var(--text)] mt-0.5 truncate">{selectedEmp.email}</p>
              </div>
              <div>
                <span className="text-xs text-[var(--muted)]">Joining Date</span>
                <p className="font-medium text-[var(--text)] mt-0.5">{selectedEmp.joiningDate}</p>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedEmp(null)}
                className="px-4 py-2 bg-[var(--surface-2)] text-[var(--text)] text-sm font-semibold rounded-xl hover:bg-[var(--line)] transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAddSubmit}
            className="bg-[var(--surface)] w-full max-w-md rounded-2xl border border-[var(--line)] shadow-xl overflow-hidden p-6 space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[var(--line)]">
              <h2 className="text-lg font-bold text-[var(--text)]">Add New Team Member</h2>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="text-[var(--muted)] hover:text-[var(--text)]"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-[var(--muted)] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sreya Sengupta"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[var(--surface-2)] border border-[var(--line)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--muted)] mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="sreya@brightcone.ai"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[var(--surface-2)] border border-[var(--line)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--muted)] mb-1">Department</label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full px-3 py-2 bg-[var(--surface-2)] border border-[var(--line)] rounded-xl text-sm"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product & Design">Product & Design</option>
                    <option value="People Operations">People Operations</option>
                    <option value="Data Science">Data Science</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--muted)] mb-1">Designation</label>
                  <input
                    type="text"
                    required
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[var(--surface-2)] border border-[var(--line)] rounded-xl text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-[var(--line)]">
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-[var(--muted)] hover:bg-[var(--surface-2)] rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-semibold bg-[var(--brand)] text-white rounded-xl hover:opacity-95"
              >
                Save Member
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PeopleDashboard;
