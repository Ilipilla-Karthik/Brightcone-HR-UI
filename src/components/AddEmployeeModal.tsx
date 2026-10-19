import React, { useState } from 'react';
import type { Employee } from '../types';
import { Modal } from './Modal';
import { employeesApi } from '../api/employees';
import { AlertCircle } from 'lucide-react';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  existingEmployees: Employee[];
}

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  existingEmployees,
}) => {
  const [employeeCode, setEmployeeCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [grade, setGrade] = useState('L4');
  const [location, setLocation] = useState('Hyderabad');
  const [managerName, setManagerName] = useState('');
  const [status, setStatus] = useState<'Active' | 'On leave' | 'Inactive'>('Active');
  const [ctc, setCtc] = useState<number>(2400000);
  const [workEmail, setWorkEmail] = useState('');
  const [phone, setPhone] = useState('+91 98480 11000');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const departments = [
    'Leadership',
    'People Ops',
    'AI Research',
    'Engineering',
    'Sales',
    'Design',
    'Finance',
    'Customer Success',
  ];

  const locations = [
    'Hyderabad',
    'Bengaluru',
    'San Francisco',
    'Austin',
    'Pune',
    'Remote',
  ];

  const grades = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!employeeCode || !fullName || !jobTitle) {
      setError('Employee ID, Full Name, and Job Title are required.');
      return;
    }

    setLoading(true);
    try {
      await employeesApi.create({
        employee_code: employeeCode.trim(),
        full_name: fullName.trim(),
        job_title: jobTitle.trim(),
        department,
        grade,
        location,
        manager_name: managerName.trim() ? managerName.trim() : null,
        status,
        ctc: Number(ctc),
        work_email: workEmail.trim() || undefined,
        phone: phone.trim() || undefined,
        shift: 'General',
        joined: new Date().toISOString().split('T')[0],
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.description || err.response?.data?.error || 'Failed to create employee record.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Employee"
      subtitle="Creates a permanent employee record in PostgreSQL"
      maxWidth="lg"
    >
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Employee ID <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={employeeCode}
              onChange={(e) => setEmployeeCode(e.target.value)}
              placeholder="e.g. BC-1045"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0B6FDB] focus:ring-1 focus:ring-[#0B6FDB] outline-hidden font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Arun Kumar"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0B6FDB] focus:ring-1 focus:ring-[#0B6FDB] outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Job Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. Staff Security Engineer"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0B6FDB] focus:ring-1 focus:ring-[#0B6FDB] outline-hidden"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0B6FDB] outline-hidden"
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Grade</label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0B6FDB] outline-hidden"
            >
              {grades.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Location</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0B6FDB] outline-hidden"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0B6FDB] outline-hidden"
            >
              <option value="Active">Active</option>
              <option value="On leave">On leave</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Reports To (Manager)</label>
            <select
              value={managerName}
              onChange={(e) => setManagerName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0B6FDB] outline-hidden"
            >
              <option value="">None (CEO / Founder)</option>
              {existingEmployees.map((emp) => (
                <option key={emp.employee_code} value={emp.full_name}>
                  {emp.full_name} ({emp.employee_code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Annual CTC (INR)</label>
            <input
              type="number"
              value={ctc}
              onChange={(e) => setCtc(Number(e.target.value))}
              placeholder="e.g. 2400000"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0B6FDB] outline-hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Work Email</label>
            <input
              type="email"
              value={workEmail}
              onChange={(e) => setWorkEmail(e.target.value)}
              placeholder="name@brightcone.ai"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0B6FDB] outline-hidden"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98480 11000"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0B6FDB] outline-hidden"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-[#0B2641] hover:bg-[#071B2F] text-white font-semibold shadow-xs disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Add Employee'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
