import React, { useState } from 'react';
import { ic } from '../../components/icons';

interface FilingRecord {
  id: string;
  name: string;
  period: string;
  category: 'PF' | 'ESI' | 'TDS' | 'PT';
  dueDate: string;
  totalEmployees: number;
  totalAmount: string;
  challanRef?: string;
  status: 'Filed' | 'Pending' | 'Ready to File';
}

const INITIAL_FILINGS: FilingRecord[] = [
  {
    id: 'FIL-PF-2026-09',
    name: 'EPFO Monthly Electronic Challan Return (ECR)',
    period: 'September 2026',
    category: 'PF',
    dueDate: '15 Oct 2026',
    totalEmployees: 24,
    totalAmount: '₹1,94,400',
    challanRef: 'TRRN-883019284102',
    status: 'Filed',
  },
  {
    id: 'FIL-ESI-2026-09',
    name: 'ESIC Monthly Contribution Return',
    period: 'September 2026',
    category: 'ESI',
    dueDate: '15 Oct 2026',
    totalEmployees: 6,
    totalAmount: '₹18,240',
    challanRef: 'ESIC-CP-491028',
    status: 'Filed',
  },
  {
    id: 'FIL-TDS-2026-Q2',
    name: 'Income Tax Form 24Q (Salary TDS Return)',
    period: 'Q2 (Jul - Sep 2026)',
    category: 'TDS',
    dueDate: '31 Oct 2026',
    totalEmployees: 24,
    totalAmount: '₹4,82,600',
    challanRef: 'BSR-0291048-CH10',
    status: 'Ready to File',
  },
  {
    id: 'FIL-PT-2026-09',
    name: 'Telangana Professional Tax Monthly Return',
    period: 'September 2026',
    category: 'PT',
    dueDate: '10 Oct 2026',
    totalEmployees: 20,
    totalAmount: '₹4,000',
    challanRef: 'TG-PT-992014',
    status: 'Filed',
  },
  {
    id: 'FIL-PF-2026-10',
    name: 'EPFO Monthly Electronic Challan Return (ECR)',
    period: 'October 2026',
    category: 'PF',
    dueDate: '15 Nov 2026',
    totalEmployees: 25,
    totalAmount: '₹2,02,500',
    status: 'Pending',
  },
];

export const StatutoryFilings: React.FC = () => {
  const [filings, setFilings] = useState<FilingRecord[]>(INITIAL_FILINGS);
  const [filterCat, setFilterCat] = useState<string>('All');
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleFileNow = (id: string) => {
    setFilings((prev) =>
      prev.map((f) =>
        f.id === id
          ? {
              ...f,
              status: 'Filed',
              challanRef: `TRRN-${Math.floor(100000000000 + Math.random() * 900000000000)}`,
            }
          : f
      )
    );
    showToast(`Filing ${id} submitted & marked as Filed`);
  };

  const filteredFilings = filings.filter((f) =>
    filterCat === 'All' ? true : f.category === filterCat
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-['Sora']">
            Statutory Compliance & Filings
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            PF (ECR), ESIC, Professional Tax, and Income Tax Form 24Q returns [PAY-05, PAY-12]
          </p>
        </div>

        <button
          onClick={() => showToast('Generated composite ECR text file for EPFO portal')}
          className="px-4 py-2 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <span className="w-4 h-4">{ic('download', 16)}</span>
          Generate ECR File
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total PF Remitted (YTD)
          </p>
          <p className="text-2xl font-bold text-slate-900 mt-1 font-mono">₹11,64,000</p>
          <p className="text-[11px] text-emerald-600 mt-0.5">All months on schedule</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Quarterly TDS Liability
          </p>
          <p className="text-2xl font-bold text-slate-900 mt-1 font-mono">₹4,82,600</p>
          <p className="text-[11px] text-amber-600 mt-0.5">Due on 31 Oct 2026</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            ESIC Compliance
          </p>
          <p className="text-2xl font-bold text-slate-900 mt-1 font-mono">100%</p>
          <p className="text-[11px] text-slate-500 mt-0.5">6 eligible covered employees</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Next Statutory Deadline
          </p>
          <p className="text-2xl font-bold text-blue-600 mt-1 font-['Sora']">31 Oct</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Form 24Q Q2 Return</p>
        </div>
      </div>

      {/* Filings List Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="font-bold text-slate-900 text-sm font-['Sora']">
            Statutory Returns Register
          </h2>

          <div className="flex items-center gap-2">
            <select
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
              className="text-xs bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All">All Statutory Categories</option>
              <option value="PF">Provident Fund (PF)</option>
              <option value="ESI">Employee State Insurance (ESI)</option>
              <option value="TDS">Income Tax TDS (24Q)</option>
              <option value="PT">Professional Tax (PT)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-600 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Statutory Return</th>
                <th className="py-3 px-4">Period</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Employees</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Challan / Ref No</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredFilings.map((filing) => (
                <tr key={filing.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-900">{filing.name}</p>
                    <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700 mt-0.5">
                      {filing.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-600">
                    {filing.period}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-slate-500">{filing.dueDate}</td>
                  <td className="py-3 px-4 text-slate-600 font-mono">{filing.totalEmployees}</td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {filing.totalAmount}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                    {filing.challanRef || '—'}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        filing.status === 'Filed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : filing.status === 'Ready to File'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {filing.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    {filing.status === 'Ready to File' && (
                      <button
                        onClick={() => handleFileNow(filing.id)}
                        className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors"
                      >
                        Submit Filing
                      </button>
                    )}
                    {filing.status === 'Filed' && (
                      <button
                        onClick={() => showToast(`Downloaded Challan receipt for ${filing.name}`)}
                        className="px-2 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors inline-flex items-center gap-1"
                      >
                        <span className="w-3.5 h-3.5">{ic('download', 14)}</span>
                        Receipt
                      </button>
                    )}
                    {filing.status === 'Pending' && (
                      <span className="text-[11px] text-slate-400 italic">Awaiting Payroll</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-medium shadow-xl flex items-center gap-2 animate-fade-in">
          <span className="w-4 h-4 text-emerald-400">{ic('check', 16)}</span>
          {toastMsg}
        </div>
      )}
    </div>
  );
};

export default StatutoryFilings;
