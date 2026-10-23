import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface ExpenseClaim {
  id: string;
  category: string;
  description: string;
  amount: string;
  date: string;
  status: 'Approved' | 'Pending Review' | 'Reimbursed';
}

const DEFAULT_CLAIMS: ExpenseClaim[] = [
  { id: 'EXP-101', category: 'Client Dinner', description: 'Enterprise client onboarding dinner at Novotel', amount: '₹4,850', date: '21 Oct 2026', status: 'Approved' },
  { id: 'EXP-102', category: 'Travel & Cab', description: 'Uber rides for client on-site visits in Hitec City', amount: '₹1,240', date: '19 Oct 2026', status: 'Pending Review' },
  { id: 'EXP-103', category: 'Hardware & Peripherals', description: 'Ergonomic keyboard and monitor stand allowance', amount: '₹8,400', date: '14 Oct 2026', status: 'Reimbursed' },
  { id: 'EXP-104', category: 'Team Learning', description: 'Rust Advanced Concurrency book & conference pass', amount: '₹3,500', date: '08 Oct 2026', status: 'Reimbursed' },
];

export const ExpenseEmployeePage: React.FC = () => {
  const [claims, setClaims] = useState<ExpenseClaim[]>(DEFAULT_CLAIMS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [category, setCategory] = useState('Travel & Cab');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;
    const newClaim: ExpenseClaim = {
      id: `EXP-10${claims.length + 5}`,
      category,
      description,
      amount: `₹${amount}`,
      date: 'Today',
      status: 'Pending Review',
    };
    setClaims([newClaim, ...claims]);
    setIsModalOpen(false);
    setDescription('');
    setAmount('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--surface)] p-6 rounded-2xl border border-[var(--line)] shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--brand)]">
            <span className="w-2 h-2 rounded-full bg-[var(--brand)] animate-pulse" />
            Employee Expense Portal
          </div>
          <h1 className="text-2xl font-bold text-[var(--text)] mt-1">Expense Claims & Reimbursements</h1>
          <p className="text-sm text-[var(--muted)] mt-0.5">
            Submit business expenditure, track finance approval stages, and view receipts.
          </p>
        </div>
        <div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[var(--brand)] text-white text-sm font-semibold rounded-xl hover:opacity-90 transition shadow-sm"
          >
            <Plus size={16} /> Submit New Claim
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--line)]">
          <span className="text-xs text-[var(--muted)] font-medium">Pending Review</span>
          <p className="text-2xl font-bold text-[var(--warn)] mt-1 font-mono">₹1,240</p>
        </div>
        <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--line)]">
          <span className="text-xs text-[var(--muted)] font-medium">Approved for Payout</span>
          <p className="text-2xl font-bold text-[var(--info)] mt-1 font-mono">₹4,850</p>
        </div>
        <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--line)]">
          <span className="text-xs text-[var(--muted)] font-medium">Total Reimbursed YTD</span>
          <p className="text-2xl font-bold text-[var(--ok)] mt-1 font-mono">₹11,900</p>
        </div>
      </div>

      {/* Claims Table */}
      <div className="bg-[var(--surface)] rounded-2xl border border-[var(--line)] overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[var(--line)] flex items-center justify-between">
          <h2 className="text-sm font-bold text-[var(--text)]">Recent Expenditure Records</h2>
          <span className="text-xs text-[var(--muted)]">{claims.length} claims tracked</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-[var(--line)] bg-[var(--surface-2)] text-[var(--muted)] font-semibold text-xs uppercase tracking-wider">
                <th className="py-3 px-4">Claim ID</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {claims.map((claim) => (
                <tr key={claim.id} className="hover:bg-[var(--surface-2)]/60">
                  <td className="py-3 px-4 font-mono text-xs font-semibold text-[var(--muted)]">{claim.id}</td>
                  <td className="py-3 px-4 text-xs font-semibold text-[var(--text)]">{claim.category}</td>
                  <td className="py-3 px-4 text-xs text-[var(--muted)]">{claim.description}</td>
                  <td className="py-3 px-4 text-xs text-[var(--muted)]">{claim.date}</td>
                  <td className="py-3 px-4 font-mono text-xs font-bold text-[var(--text)]">{claim.amount}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        claim.status === 'Approved'
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          : claim.status === 'Reimbursed'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {claim.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submit Claim Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-[var(--surface)] w-full max-w-md rounded-2xl border border-[var(--line)] shadow-xl overflow-hidden p-6 space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[var(--line)]">
              <h2 className="text-lg font-bold text-[var(--text)]">Submit Business Expense</h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-[var(--muted)] hover:text-[var(--text)]"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-[var(--muted)] mb-1">Expense Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--surface-2)] border border-[var(--line)] rounded-xl text-sm"
                >
                  <option value="Travel & Cab">Travel & Cab</option>
                  <option value="Client Dinner">Client Dinner</option>
                  <option value="Hardware & Peripherals">Hardware & Peripherals</option>
                  <option value="Team Learning">Team Learning</option>
                  <option value="Office Supplies">Office Supplies</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--muted)] mb-1">Amount (INR)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 2400"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[var(--surface-2)] border border-[var(--line)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--muted)] mb-1">Purpose / Details</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Explain the business expenditure context..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[var(--surface-2)] border border-[var(--line)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-[var(--line)]">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-[var(--muted)] hover:bg-[var(--surface-2)] rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-semibold bg-[var(--brand)] text-white rounded-xl hover:opacity-95"
              >
                Submit Claim
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ExpenseEmployeePage;
