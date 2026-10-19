import React from 'react';
import type { Employee } from '../types';
import { Drawer } from '../components/Drawer';
import { InitialsAvatar } from '../components/InitialsAvatar';
import { StatusBadge } from '../components/StatusBadge';
import { Edit2, Mail, Phone, MapPin, Building, Award, Calendar, DollarSign } from 'lucide-react';

interface EmployeeDrawerProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (employee: Employee) => void;
}

export const EmployeeDrawer: React.FC<EmployeeDrawerProps> = ({
  employee,
  isOpen,
  onClose,
  onEdit,
}) => {
  if (!employee) return null;

  const formatInr = (val?: number | null) => {
    if (!val) return '—';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Employee Details">
      <div className="space-y-6">
        {/* Profile Card */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <InitialsAvatar name={employee.full_name} size="lg" />
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-slate-900 truncate">{employee.full_name}</h3>
            <p className="text-xs text-slate-500 font-medium truncate">{employee.job_title}</p>
            <div className="mt-2">
              <StatusBadge status={employee.status} />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => {
            onClose();
            onEdit(employee);
          }}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#0B6FDB] hover:bg-[#095bc2] shadow-xs transition-colors"
        >
          <Edit2 className="w-3.5 h-3.5" />
          Edit Record
        </button>

        {/* KV Details List */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Professional Information
          </h4>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100/80">
              <span className="text-slate-400 font-medium flex items-center gap-1.5 mb-1">
                Employee ID
              </span>
              <span className="font-semibold text-slate-800 font-mono">
                {employee.employee_code}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100/80">
              <span className="text-slate-400 font-medium flex items-center gap-1.5 mb-1">
                <Building className="w-3.5 h-3.5" /> Department
              </span>
              <span className="font-semibold text-slate-800">{employee.department}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100/80">
              <span className="text-slate-400 font-medium flex items-center gap-1.5 mb-1">
                <Award className="w-3.5 h-3.5" /> Grade
              </span>
              <span className="font-semibold text-slate-800">{employee.grade}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100/80">
              <span className="text-slate-400 font-medium flex items-center gap-1.5 mb-1">
                <MapPin className="w-3.5 h-3.5" /> Location
              </span>
              <span className="font-semibold text-slate-800">{employee.location}</span>
            </div>
          </div>
        </div>

        {/* Reporting & Compensation */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Reporting & Compensation
          </h4>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100/80 text-xs">
            <span className="text-slate-400 font-medium block mb-1">Reports To (Manager)</span>
            <span className="font-semibold text-slate-800">
              {employee.manager_name || 'None (Direct to Board / CEO)'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100/80 text-xs flex items-center justify-between">
            <div>
              <span className="text-slate-400 font-medium block mb-1">Annual CTC</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                {formatInr(employee.ctc)}
              </span>
            </div>
            {employee.shift && (
              <div className="text-right">
                <span className="text-slate-400 font-medium block mb-1">Shift</span>
                <span className="font-semibold text-slate-800">{employee.shift}</span>
              </div>
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Contact Details
          </h4>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100/80 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#0B6FDB]" />
              <span className="text-slate-800 truncate">
                {employee.work_email || `${employee.employee_code.toLowerCase()}@brightcone.ai`}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100/80 flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-slate-800">{employee.phone || '+91 98480 11000'}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100/80 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-800">Joined: {employee.joined || '2022-01-15'}</span>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
};
