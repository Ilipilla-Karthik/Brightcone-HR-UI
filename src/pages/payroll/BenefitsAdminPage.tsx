import React, { useState } from 'react';
import { ic } from '../../components/icons';

interface BenefitPlan {
  id: string;
  name: string;
  category: 'Health' | 'Life' | 'Wellness' | 'Allowance';
  provider: string;
  coverage: string;
  enrolledEmployees: number;
  monthlyCostPerEmployee: string;
  status: 'Active' | 'Under Review';
}

interface Enrollment {
  id: string;
  employeeName: string;
  planName: string;
  dependents: number;
  coverageAmt: string;
  status: 'Enrolled' | 'Pending Verification' | 'Opted Out';
}

const BENEFIT_PLANS: BenefitPlan[] = [
  {
    id: 'BEN-01',
    name: 'Group Health Insurance (GHI)',
    category: 'Health',
    provider: 'HDFC ERGO Health',
    coverage: '₹5,00,000 Sum Insured (Family Floater)',
    enrolledEmployees: 24,
    monthlyCostPerEmployee: '₹1,850',
    status: 'Active',
  },
  {
    id: 'BEN-02',
    name: 'Group Term Life (GTL)',
    category: 'Life',
    provider: 'Tata AIA Life',
    coverage: '3x Annual CTC (Min ₹25 Lakhs)',
    enrolledEmployees: 24,
    monthlyCostPerEmployee: '₹420',
    status: 'Active',
  },
  {
    id: 'BEN-03',
    name: 'Pluxee Meal & Food Card',
    category: 'Allowance',
    provider: 'Pluxee (Sodexo)',
    coverage: '₹3,000 / month (Tax-Free Food Wallet)',
    enrolledEmployees: 21,
    monthlyCostPerEmployee: '₹3,000',
    status: 'Active',
  },
  {
    id: 'BEN-04',
    name: 'Cult.fit Corporate Wellness Pass',
    category: 'Wellness',
    provider: 'Cult.fit Healthcare',
    coverage: 'Unlimited Gym & Fitness Studio Access',
    enrolledEmployees: 18,
    monthlyCostPerEmployee: '₹1,200',
    status: 'Active',
  },
];

export const BenefitsAdminPage: React.FC = () => {
  const [plans] = useState<BenefitPlan[]>(BENEFIT_PLANS);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const [newPlan, setNewPlan] = useState({
    name: '',
    category: 'Health',
    provider: '',
    coverage: '',
    cost: '',
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlan.name || !newPlan.provider) return;
    setIsModalOpen(false);
    showToast(`Created new benefit plan: ${newPlan.name}`);
  };

  const verifyEnrollment = (id: string) => {
    setEnrollments((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'Enrolled' } : e))
    );
    showToast('Enrollment verified & active');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-['Sora']">
            Employee Benefits & Insurance
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Group medical floater, term life, meal allowances, and wellness programs [PAY-14]
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <span className="w-4 h-4">{ic('plus', 16)}</span>
          Add Benefit Plan
        </button>
      </div>

      {/* Plan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3 hover:border-slate-300 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                {plan.category}
              </span>
              <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                ● {plan.status}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-sm font-['Sora']">{plan.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{plan.provider}</p>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-lg text-xs space-y-1">
              <p className="text-slate-700 font-medium">{plan.coverage}</p>
              <p className="text-slate-400 text-[11px]">Cost: {plan.monthlyCostPerEmployee} / mo</p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>{plan.enrolledEmployees} Enrolled</span>
              <button
                onClick={() => showToast(`Opening policy details for ${plan.name}`)}
                className="text-emerald-700 font-semibold hover:underline"
              >
                View Policy →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Active Enrollments Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-sm font-['Sora']">
            Employee Enrollment Roster
          </h2>
          <span className="text-xs text-slate-500">{enrollments.length} active records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-600 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Benefit Plan</th>
                <th className="py-3 px-4">Dependents Covered</th>
                <th className="py-3 px-4">Coverage Value</th>
                <th className="py-3 px-4">Enrollment Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {enrollments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-1">
                      <span className="text-xl">📋</span>
                      <p className="font-semibold text-slate-700 text-sm">No Active Enrollments</p>
                      <p className="text-xs text-slate-400">Employee benefit enrollments will be listed here once submitted.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                enrollments.map((enr) => (
                  <tr key={enr.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">{enr.employeeName}</td>
                    <td className="py-3 px-4 text-slate-700 font-medium">{enr.planName}</td>
                    <td className="py-3 px-4 text-slate-500 font-mono">
                      {enr.dependents > 0 ? `${enr.dependents} Members` : 'Self Only'}
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-800">
                      {enr.coverageAmt}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          enr.status === 'Enrolled'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {enr.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {enr.status === 'Pending Verification' ? (
                        <button
                          onClick={() => verifyEnrollment(enr.id)}
                          className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors"
                        >
                          Verify
                        </button>
                      ) : (
                        <button
                          onClick={() => showToast(`Sent health e-card for ${enr.employeeName}`)}
                          className="px-2 py-1 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                        >
                          Send E-Card
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <form
            onSubmit={handleCreatePlan}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm font-['Sora']">Add New Benefit Plan</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Plan Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Executive Dental & Vision Add-on"
                  value={newPlan.name}
                  onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Benefit Category</label>
                <select
                  value={newPlan.category}
                  onChange={(e) => setNewPlan({ ...newPlan, category: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
                >
                  <option value="Health">Health</option>
                  <option value="Life">Life</option>
                  <option value="Wellness">Wellness</option>
                  <option value="Allowance">Allowance</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Insurance / Provider</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Care Health Insurance"
                  value={newPlan.provider}
                  onChange={(e) => setNewPlan({ ...newPlan, provider: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Coverage Specification</label>
                <input
                  type="text"
                  placeholder="e.g. ₹50,000 OPD per annum"
                  value={newPlan.coverage}
                  onChange={(e) => setNewPlan({ ...newPlan, coverage: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg shadow-sm"
              >
                Create Benefit Plan
              </button>
            </div>
          </form>
        </div>
      )}

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

export default BenefitsAdminPage;
