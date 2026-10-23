import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Download,
  CheckCircle2,
  Search,
  CreditCard,
  Layers,
  FileText,
  Shield,
  Gift,
} from 'lucide-react';

export const PayrollDashboard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'runs';

  const [search, setSearch] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  const employees = [
    { code: 'BC-1001', name: 'Ananya Rao', role: 'Head of HR', basic: '₹95,000', hra: '₹38,000', allow: '₹22,000', pf: '₹1,800', net: '₹1,53,200', status: 'Disbursed' },
    { code: 'BC-1038', name: 'Rahul Varma', role: 'Senior Full-Stack Engineer', basic: '₹85,000', hra: '₹34,000', allow: '₹21,000', pf: '₹1,800', net: '₹1,38,200', status: 'Disbursed' },
    { code: 'BC-1045', name: 'Aditi Sharma', role: 'Staff ML Engineer', basic: '₹1,10,000', hra: '₹44,000', allow: '₹26,000', pf: '₹1,800', net: '₹1,78,200', status: 'Disbursed' },
    { code: 'BC-1052', name: 'Rohan Gupta', role: 'DevOps Specialist', basic: '₹75,000', hra: '₹30,000', allow: '₹18,000', pf: '₹1,800', net: '₹1,21,200', status: 'Disbursed' },
    { code: 'BC-1061', name: 'Kavya Pillai', role: 'Principal Product Designer', basic: '₹80,000', hra: '₹32,000', allow: '₹19,000', pf: '₹1,800', net: '₹1,29,200', status: 'Disbursed' },
    { code: 'BC-1070', name: 'Marcus Lee', role: 'Solutions Architect', basic: '₹90,000', hra: '₹36,000', allow: '₹20,000', pf: '₹1,800', net: '₹1,44,200', status: 'Disbursed' },
  ];

  const setTab = (tab: string) => setSearchParams({ tab });

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
          <h1 className="text-2xl font-bold text-[var(--text)] mt-1">Payroll & Compensation Engine</h1>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            Process monthly salary registers, review deductions, and disburse employee payslips.
          </p>
        </div>
        <button
          onClick={handleRunPayroll}
          disabled={isProcessing}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--brand)] text-white text-xs font-semibold rounded-xl hover:opacity-90 transition shadow-sm disabled:opacity-50"
        >
          <CreditCard size={15} /> {isProcessing ? 'Processing...' : 'Run October Payroll'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--line)] pb-3 overflow-x-auto text-xs font-semibold">
        {[
          { key: 'runs', label: 'Monthly Runs', icon: <CreditCard size={14} />, count: 'Oct 2026' },
          { key: 'structure', label: 'Salary Structure', icon: <Layers size={14} /> },
          { key: 'slips', label: 'My Payslips', icon: <FileText size={14} />, count: 6 },
          { key: 'compliance', label: 'Tax & Compliance', icon: <Shield size={14} /> },
          { key: 'benefits', label: 'Benefits & Perks', icon: <Gift size={14} /> },
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
            {t.count && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-[var(--line)] text-[var(--text)]">
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {successToast && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 size={16} /> Monthly payroll cycle successfully validated and scheduled for disbursement.
        </div>
      )}

      {/* Tab 1: Runs */}
      {currentTab === 'runs' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--line)]">
              <span className="text-xs text-[var(--muted)]">Monthly Net Payout</span>
              <p className="text-2xl font-bold text-[var(--text)] mt-1 font-mono">₹8,64,200</p>
            </div>
            <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--line)]">
              <span className="text-xs text-[var(--muted)]">Payslips Disbursed</span>
              <p className="text-2xl font-bold text-emerald-600 mt-1">6 / 6</p>
            </div>
            <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--line)]">
              <span className="text-xs text-[var(--muted)]">Statutory PF Remittance</span>
              <p className="text-2xl font-bold text-blue-600 mt-1 font-mono">₹10,800</p>
            </div>
            <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--line)]">
              <span className="text-xs text-[var(--muted)]">Next Cycle</span>
              <p className="text-2xl font-bold text-[var(--text)] mt-1 text-base">01 Nov 2026</p>
            </div>
          </div>

          <div className="bg-[var(--surface)] rounded-2xl border border-[var(--line)] overflow-hidden shadow-sm">
            <div className="p-4 border-b border-[var(--line)] flex flex-col sm:flex-row items-center justify-between gap-3">
              <h2 className="text-xs font-bold text-[var(--text)]">Salary Register Breakdown (October 2026)</h2>
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
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--surface-2)] border-b border-[var(--line)] text-[var(--muted)] uppercase font-semibold">
                  <tr>
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
                      <td className="py-3 px-4">
                        <p className="font-semibold text-[var(--text)]">{emp.name}</p>
                        <p className="text-[11px] text-[var(--muted)] font-mono">{emp.code} • {emp.role}</p>
                      </td>
                      <td className="py-3 px-4 font-mono text-[var(--text)]">{emp.basic}</td>
                      <td className="py-3 px-4 font-mono text-[var(--text)]">{emp.hra}</td>
                      <td className="py-3 px-4 font-mono text-[var(--text)]">{emp.allow}</td>
                      <td className="py-3 px-4 font-mono text-rose-600">{emp.pf}</td>
                      <td className="py-3 px-4 font-mono font-bold text-[var(--brand)]">{emp.net}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700">
                          {emp.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => alert(`Downloading payslip PDF for ${emp.name}`)}
                          className="inline-flex items-center gap-1 text-[11px] text-[var(--brand)] font-semibold hover:underline"
                        >
                          <Download size={12} /> PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Salary Structure */}
      {currentTab === 'structure' && (
        <div className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--line)] space-y-4 text-xs">
          <h3 className="font-bold text-sm text-[var(--text)]">Standard CTC Structure (Engineering & Tech)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 p-4 bg-[var(--surface-2)] rounded-xl border border-[var(--line)]">
              <h4 className="font-semibold text-[var(--text)]">Earnings Components</h4>
              <p className="flex justify-between"><span>Basic Salary (50% of CTC)</span><b className="font-mono">₹50,000 / mo</b></p>
              <p className="flex justify-between"><span>House Rent Allowance (HRA 40%)</span><b className="font-mono">₹20,000 / mo</b></p>
              <p className="flex justify-between"><span>Special Allowance</span><b className="font-mono">₹22,000 / mo</b></p>
              <p className="flex justify-between border-t border-[var(--line)] pt-2 font-bold"><span>Gross Monthly Salary</span><b className="font-mono text-emerald-600">₹92,000 / mo</b></p>
            </div>
            <div className="space-y-2 p-4 bg-[var(--surface-2)] rounded-xl border border-[var(--line)]">
              <h4 className="font-semibold text-[var(--text)]">Deductions & Statutory</h4>
              <p className="flex justify-between"><span>Employee PF (12% of Basic)</span><b className="font-mono text-rose-600">₹1,800 / mo</b></p>
              <p className="flex justify-between"><span>Professional Tax (PT)</span><b className="font-mono text-rose-600">₹200 / mo</b></p>
              <p className="flex justify-between"><span>Estimated TDS (Income Tax)</span><b className="font-mono text-rose-600">₹4,200 / mo</b></p>
              <p className="flex justify-between border-t border-[var(--line)] pt-2 font-bold"><span>Net Take-Home Salary</span><b className="font-mono text-[var(--brand)]">₹85,800 / mo</b></p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: My Payslips */}
      {currentTab === 'slips' && (
        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--line)] divide-y divide-[var(--line)] text-xs">
          {[
            { month: 'September 2026', gross: '₹1,40,000', net: '₹1,38,200', date: '30 Sep 2026' },
            { month: 'August 2026', gross: '₹1,40,000', net: '₹1,38,200', date: '31 Aug 2026' },
            { month: 'July 2026', gross: '₹1,40,000', net: '₹1,38,200', date: '31 Jul 2026' },
            { month: 'June 2026', gross: '₹1,40,000', net: '₹1,38,200', date: '30 Jun 2026' },
          ].map((sl, i) => (
            <div key={i} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-[var(--text)]">{sl.month}</p>
                <p className="text-[var(--muted)]">Gross: {sl.gross} • Net Credited: <b className="text-[var(--text)]">{sl.net}</b></p>
              </div>
              <button
                onClick={() => alert(`Downloading payslip for ${sl.month}`)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--surface-2)] text-[var(--text)] rounded-xl hover:bg-[var(--line)]"
              >
                <Download size={13} /> PDF
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Compliance */}
      {currentTab === 'compliance' && (
        <div className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--line)] space-y-3 text-xs">
          <h3 className="font-bold text-sm text-[var(--text)]">Statutory & Tax Remittance Status</h3>
          <div className="divide-y divide-[var(--line)]">
            {[
              { authority: 'Employees Provident Fund Organization (EPFO)', filing: 'ECR Challan Sep 2026', status: 'Filed & Verified', date: '15 Oct 2026' },
              { authority: 'Employees State Insurance (ESIC)', filing: 'Monthly Contribution Challan', status: 'Compliant (Exempt)', date: '15 Oct 2026' },
              { authority: 'Income Tax Department (TDS 24Q)', filing: 'Quarterly TDS Return Q2', status: 'Submitted', date: '20 Oct 2026' },
            ].map((c, i) => (
              <div key={i} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-bold text-[var(--text)]">{c.authority}</p>
                  <p className="text-[var(--muted)]">{c.filing} • Filing Date: {c.date}</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Benefits */}
      {currentTab === 'benefits' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {[
            { title: 'Group Health Insurance', cover: '₹10,00,000 Sum Insured', provider: 'HDFC ERGO', status: 'Active' },
            { title: 'Wellness & Gym Allowance', cover: '₹3,000 / month', provider: 'Cult.fit & Healthify', status: 'Active' },
            { title: 'Learning & Certification Subsidy', cover: '₹50,000 / year', provider: 'Brightcone Learning Hub', status: 'Active' },
          ].map((b, i) => (
            <div key={i} className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--line)] space-y-2">
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                {b.status}
              </span>
              <p className="font-bold text-sm text-[var(--text)]">{b.title}</p>
              <p className="text-[var(--muted)]">{b.cover}</p>
              <p className="text-[11px] text-[var(--brand)]">{b.provider}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PayrollDashboard;
