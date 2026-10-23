import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--line)] shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--brand)]">
          <ShieldCheck size={15} /> Statutory Governance & Audit
        </div>
        <h1 className="text-2xl font-bold text-[var(--text)] mt-1">HR Compliance & Governance</h1>
        <p className="text-sm text-[var(--muted)] mt-0.5">
          Monitor enterprise labor law adherence, statutory return filings, and workplace audit logs.
        </p>
      </div>

      {/* Compliance Health Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--line)]">
          <span className="text-xs text-[var(--muted)] font-medium">Compliance Health Score</span>
          <p className="text-2xl font-bold text-[var(--ok)] mt-1">98.4%</p>
          <span className="text-xs text-[var(--muted)]">Zero outstanding audit notices</span>
        </div>
        <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--line)]">
          <span className="text-xs text-[var(--muted)] font-medium">Policy Acknowledgements</span>
          <p className="text-2xl font-bold text-[var(--brand)] mt-1">96.8%</p>
          <span className="text-xs text-[var(--muted)]">143 of 148 signed</span>
        </div>
        <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--line)]">
          <span className="text-xs text-[var(--muted)] font-medium">Pending Statutory Returns</span>
          <p className="text-2xl font-bold text-[var(--text)] mt-1">0 Overdue</p>
          <span className="text-xs text-[var(--muted)]">Next filing: PF Challan Nov 15</span>
        </div>
      </div>

      {/* Compliance Filings Table */}
      <div className="bg-[var(--surface)] rounded-2xl border border-[var(--line)] overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[var(--line)] flex items-center justify-between">
          <h2 className="text-sm font-bold text-[var(--text)]">Statutory Filings Calendar</h2>
          <span className="text-xs text-[var(--muted)]">FY 2026-27 Schedule</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-[var(--line)] bg-[var(--surface-2)] text-[var(--muted)] font-semibold text-xs uppercase tracking-wider">
                <th className="py-3 px-4">Statutory Body</th>
                <th className="py-3 px-4">Filing Type</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Estimated Amount</th>
                <th className="py-3 px-4">Filing Status</th>
                <th className="py-3 px-4 text-right">Acknowledgement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {[
                { authority: 'EPFO (Provident Fund)', filing: 'ECR & PF Monthly Return', due: '15 Nov 2026', amount: '₹2,66,400', status: 'Upcoming' },
                { authority: 'ESIC', filing: 'Monthly Contribution Challan', due: '15 Nov 2026', amount: '₹48,200', status: 'Upcoming' },
                { authority: 'Income Tax Department', filing: 'Form 24Q (TDS Q2 Filing)', due: '31 Oct 2026', amount: '₹4,12,000', status: 'Filed & Cleared' },
                { authority: 'Professional Tax (Telangana)', filing: 'Form XII Monthly Return', due: '10 Nov 2026', amount: '₹29,600', status: 'Upcoming' },
                { authority: 'Ministry of Labour', filing: 'Annual Return Under POSH Act', due: '31 Jan 2027', amount: 'N/A', status: 'Compliant' },
              ].map((item, i) => (
                <tr key={i} className="hover:bg-[var(--surface-2)]/60">
                  <td className="py-3.5 px-4 font-semibold text-[var(--text)]">{item.authority}</td>
                  <td className="py-3.5 px-4 text-xs text-[var(--muted)]">{item.filing}</td>
                  <td className="py-3.5 px-4 font-mono text-xs text-[var(--text)]">{item.due}</td>
                  <td className="py-3.5 px-4 font-mono text-xs text-[var(--text)]">{item.amount}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        item.status === 'Filed & Cleared' || item.status === 'Compliant'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-xs text-[var(--brand)] font-semibold">
                    ACK-2026-{100 + i}
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

export default AdminDashboard;
