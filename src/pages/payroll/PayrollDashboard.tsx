import React, { useState } from 'react';
import {
  Download,
  CheckCircle2,
  Search,
  CreditCard,
} from 'lucide-react';

export const PayrollDashboard: React.FC = () => {
  const [search, setSearch] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  const employees = [
    { code: 'BC-1001', name: 'Ananya Rao', role: 'Head of HR', basic: '₹95,000', hra: '₹38,000', allow: '₹22,000', pf: '₹1,800', net: '₹1,53,200', status: 'Disbursed' },
    { code: 'BC-1038', name: 'Rahul Varma', role: 'Senior Engineer', basic: '₹85,000', hra: '₹34,000', allow: '₹21,000', pf: '₹1,800', net: '₹1,38,200', status: 'Disbursed' },
    { code: 'BC-1045', name: 'Aditi Sharma', role: 'Staff ML Engineer', basic: '₹1,10,000', hra: '₹44,000', allow: '₹26,000', pf: '₹1,800', net: '₹1,78,200', status: 'Disbursed' },
    { code: 'BC-1052', name: 'Rohan Gupta', role: 'DevOps Specialist', basic: '₹75,000', hra: '₹30,000', allow: '₹18,000', pf: '₹1,800', net: '₹1,21,200', status: 'Disbursed' },
    { code: 'BC-1061', name: 'Kavya Pillai', role: 'Product Designer', basic: '₹80,000', hra: '₹32,000', allow: '₹19,000', pf: '₹1,800', net: '₹1,29,200', status: 'Disbursed' },
    { code: 'BC-1070', name: 'Marcus Lee', role: 'Solutions Architect', basic: '₹90,000', hra: '₹36,000', allow: '₹20,000', pf: '₹1,800', net: '₹1,44,200', status: 'Disbursed' },
  ];

  const filtered = employees.filter(
    (e) => e.name.toLowerCase().includes(search.toLowerCase()) || e.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleRunPayroll = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 3500);
    }, 1200);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--surface)] p-6 rounded-2xl border border-[var(--line)] shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--brand)]">
            <span className="w-2 h-2 rounded-full bg-[var(--brand)] animate-pulse" />
            Payroll & Statutory Suite
          </div>
          <h1 className="text-2xl font-bold text-[var(--text)] mt-1">Payroll & Salary Operations</h1>
          <p className="text-sm text-[var(--muted)] mt-0.5">
            Process salary registers, review deductions, and disburse monthly employee payslips.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRunPayroll}
            disabled={isProcessing}
            className="flex items-center gap-2 px-4 py-2.5 bg-[var(--brand)] text-white text-sm font-semibold rounded-xl hover:opacity-90 transition shadow-sm disabled:opacity-50"
          >
            <CreditCard size={16} /> {isProcessing ? 'Processing...' : 'Run October Payroll'}
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {successToast && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-200 text-sm flex items-center gap-2">
          <CheckCircle2 size={16} /> Monthly payroll cycle successfully validated and scheduled for disbursement.
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--line)]">
          <span className="text-xs text-[var(--muted)] font-medium">Monthly Net Payout</span>
          <p className="text-2xl font-bold text-[var(--text)] mt-1 font-mono">₹8,64,200</p>
        </div>
        <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--line)]">
          <span className="text-xs text-[var(--muted)] font-medium">Payslips Disbursed</span>
          <p className="text-2xl font-bold text-[var(--ok)] mt-1">6 / 6</p>
        </div>
        <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--line)]">
          <span className="text-xs text-[var(--muted)] font-medium">Statutory PF Remittance</span>
          <p className="text-2xl font-bold text-[var(--info)] mt-1 font-mono">₹10,800</p>
        </div>
        <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--line)]">
          <span className="text-xs text-[var(--muted)] font-medium">Next Payroll Cycle</span>
          <p className="text-2xl font-bold text-[var(--text)] mt-1 text-base">01 Nov 2026</p>
        </div>
      </div>

      {/* Search and Table */}
      <div className="bg-[var(--surface)] rounded-2xl border border-[var(--line)] overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[var(--line)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-[var(--text)]">Salary Register Breakdown (October 2026)</h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--faint)]" size={14} />
            <input
              type="text"
              placeholder="Search employee..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[var(--surface-2)] border border-[var(--line)] rounded-lg text-xs focus:outline-none"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-[var(--line)] bg-[var(--surface-2)] text-[var(--muted)] font-semibold text-xs uppercase tracking-wider">
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Basic Pay</th>
                <th className="py-3 px-4">HRA</th>
                <th className="py-3 px-4">Special Allow.</th>
                <th className="py-3 px-4">PF Deduct.</th>
                <th className="py-3 px-4">Net Payout</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Payslip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {filtered.map((emp, i) => (
                <tr key={i} className="hover:bg-[var(--surface-2)]/60">
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-[var(--text)]">{emp.name}</p>
                    <p className="text-xs text-[var(--muted)] font-mono">{emp.code} • {emp.role}</p>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-[var(--text)]">{emp.basic}</td>
                  <td className="py-3.5 px-4 font-mono text-xs text-[var(--text)]">{emp.hra}</td>
                  <td className="py-3.5 px-4 font-mono text-xs text-[var(--text)]">{emp.allow}</td>
                  <td className="py-3.5 px-4 font-mono text-xs text-rose-600">{emp.pf}</td>
                  <td className="py-3.5 px-4 font-mono text-xs font-bold text-[var(--brand)]">{emp.net}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      {emp.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => alert(`Downloading payslip PDF for ${emp.name} (Code: ${emp.code})`)}
                      className="inline-flex items-center gap-1 text-xs text-[var(--brand)] font-semibold hover:underline"
                    >
                      <Download size={13} /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PayrollDashboard;
