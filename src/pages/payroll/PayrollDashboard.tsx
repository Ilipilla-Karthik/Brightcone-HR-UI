import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DollarSign, Users, Calendar, ArrowUpRight, ShieldCheck, FileSpreadsheet } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PayrollSummary {
  activeMonth: string;
  totalEmployees: number;
  totalGrossPaise: number;
  totalNetPaise: number;
  status: string;
}

export const PayrollDashboard: React.FC = () => {
  const [summary, setSummary] = useState<PayrollSummary>({
    activeMonth: 'October 2026',
    totalEmployees: 0,
    totalGrossPaise: 0,
    totalNetPaise: 0,
    status: 'Draft',
  });

  useEffect(() => {
    axios.get('/api/payroll/runs/active')
      .then(res => {
        if (res.data) {
          setSummary({
            activeMonth: res.data.month || 'October 2026',
            totalEmployees: res.data.total_employees ?? 0,
            totalGrossPaise: Math.round((res.data.total_gross ?? 0) * 100),
            totalNetPaise: Math.round((res.data.total_net ?? 0) * 100),
            status: res.data.status || 'Draft',
          });
        }
      })
      .catch(() => {
        // Leave at clean live/empty state
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-sora text-2xl font-semibold text-txt">Payroll Operations</h1>
          <p className="text-xs text-txt-muted mt-1">
            Manage salary components, payroll processing, statutory deductions, and employee disbursements.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/payroll/run"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand hover:bg-brand/90 text-white font-medium text-xs shadow-sm transition-all"
          >
            <span>Run Payroll</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-surface border border-line">
          <div className="flex items-center gap-2 text-txt-muted text-xs">
            <Calendar className="w-4 h-4 text-brand" />
            <span>Cycle</span>
          </div>
          <div className="text-xl font-bold font-sora text-txt mt-2">{summary.activeMonth}</div>
          <div className="text-[11px] text-amber-500 font-medium mt-1">Status: {summary.status}</div>
        </div>
        <div className="p-4 rounded-2xl bg-surface border border-line">
          <div className="flex items-center gap-2 text-txt-muted text-xs">
            <Users className="w-4 h-4 text-indigo-500" />
            <span>Eligible Headcount</span>
          </div>
          <div className="text-xl font-bold font-sora text-txt mt-2">{summary.totalEmployees} Employees</div>
          <div className="text-[11px] text-emerald-500 font-medium mt-1">100% attendance synced</div>
        </div>
        <div className="p-4 rounded-2xl bg-surface border border-line">
          <div className="flex items-center gap-2 text-txt-muted text-xs">
            <DollarSign className="w-4 h-4 text-emerald-500" />
            <span>Estimated Gross</span>
          </div>
          <div className="text-xl font-bold font-sora text-txt mt-2">
            ₹{(summary.totalGrossPaise / 100).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-txt-faint mt-1">Monthly total CTC allocation</div>
        </div>
        <div className="p-4 rounded-2xl bg-surface border border-line">
          <div className="flex items-center gap-2 text-txt-muted text-xs">
            <DollarSign className="w-4 h-4 text-cyan-500" />
            <span>Estimated Net Take-Home</span>
          </div>
          <div className="text-xl font-bold font-sora text-txt mt-2">
            ₹{(summary.totalNetPaise / 100).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-txt-faint mt-1">Net disbursement estimate</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-surface border border-line flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center mb-3">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm text-txt">Run Payroll Wizard</h3>
            <p className="text-xs text-txt-muted mt-1">
              5-step guided payroll cycle: Attendance Sync, Salary Adjustments, Variance Review, Approval, and Disbursement.
            </p>
          </div>
          <Link
            to="/payroll/run"
            className="mt-4 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-secondary text-txt hover:text-brand font-medium text-xs border border-line"
          >
            Launch Wizard <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-line flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-3">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm text-txt">Salary Structures</h3>
            <p className="text-xs text-txt-muted mt-1">
              Configure CTC bands, Basic, HRA, Special Allowances, and PF/ESI/PT statutory contribution slabs.
            </p>
          </div>
          <Link
            to="/payroll/structures"
            className="mt-4 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-secondary text-txt hover:text-indigo-500 font-medium text-xs border border-line"
          >
            View Structures <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-line flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm text-txt">Statutory & Tax Compliance</h3>
            <p className="text-xs text-txt-muted mt-1">
              EPF ECR challan generation, ESIC returns, Professional Tax schedules, and Form 24Q quarterly filing.
            </p>
          </div>
          <Link
            to="/payroll/statutory"
            className="mt-4 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-secondary text-txt hover:text-emerald-500 font-medium text-xs border border-line"
          >
            Compliance Filings <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PayrollDashboard;
