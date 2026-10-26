import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Clock, CheckCircle2, DollarSign, FileText, Calendar, X, UploadCloud } from "lucide-react";
import { useNotifications } from "../../services/NotificationsContext";

interface ExpenseClaim {
  id: string;
  employee_id: string;
  employee_name: string;
  category: string;
  amount: number;
  date: string;
  description: string;
  receipt_url?: string;
  status: "Pending" | "Approved" | "Paid" | "Rejected";
  paid_at?: string;
  rejection_reason?: string;
  created_at: string;
}

const categories = [
  "Travel",
  "Meals",
  "Internet",
  "Client entertainment",
  "Learning",
  "Office supplies",
  "Other",
];

export const ExpenseEmployeePage: React.FC = () => {
  const [claims, setClaims] = useState<ExpenseClaim[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<string>("All");
  const { addNotification } = useNotifications();

  const [category, setCategory] = useState("Travel");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState("");

  const fetchClaims = async () => {
    try {
      const res = await axios.get("/api/expenses");
      if (res.data && Array.isArray(res.data)) {
        setClaims(res.data);
      }
    } catch {
      // Fallback to initial records
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      alert("Please enter a valid expense amount greater than 0.");
      return;
    }

    const payload = {
      category,
      amount: numAmount,
      date,
      description,
      receipt_url: fileName ? `/uploads/${fileName}` : undefined,
    };

    try {
      const res = await axios.post("/api/expenses", payload);
      if (res.data) {
        setClaims((prev) => [res.data, ...prev]);
      }
    } catch {
      const newClaim: ExpenseClaim = {
        id: `E-${Math.floor(100 + Math.random() * 900)}`,
        employee_id: "EMP-001",
        employee_name: "Ananya Rao",
        category,
        amount: numAmount,
        date,
        description,
        status: "Pending",
        created_at: new Date().toISOString(),
      };
      setClaims((prev) => [newClaim, ...prev]);
    }

    addNotification({
      title: "Expense Claim Submitted",
      message: `Your claim of ₹${numAmount.toLocaleString("en-IN")} for ${category} has been submitted for approval.`,
      category: "expense",
      actionUrl: "/payroll/expenses",
    });

    setIsModalOpen(false);
    setAmount("");
    setDescription("");
    setFileName("");
  };

  const totalClaimed = claims.reduce((sum, c) => sum + c.amount, 0);
  const totalReimbursed = claims
    .filter((c) => c.status === "Paid")
    .reduce((sum, c) => sum + c.amount, 0);
  const totalPending = claims
    .filter((c) => c.status === "Pending" || c.status === "Approved")
    .reduce((sum, c) => sum + c.amount, 0);

  const filteredClaims = claims.filter((c) =>
    filter === "All" ? true : c.status === filter
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-sora text-2xl font-semibold text-txt">My Expense Claims</h1>
          <p className="text-xs text-txt-muted mt-1">
            Claim business expenses and reimbursements. Approved claims are paid directly into your salary account.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand hover:bg-brand/90 text-white font-medium text-xs shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Claim</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-surface border border-line">
          <div className="flex items-center gap-2 text-txt-muted text-xs">
            <DollarSign className="w-4 h-4 text-brand" />
            <span>Total Claimed</span>
          </div>
          <div className="text-xl font-bold font-sora text-txt mt-2">
            ₹{totalClaimed.toLocaleString("en-IN")}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-surface border border-line">
          <div className="flex items-center gap-2 text-txt-muted text-xs">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Pending Approval</span>
          </div>
          <div className="text-xl font-bold font-sora text-txt mt-2">
            ₹{totalPending.toLocaleString("en-IN")}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-surface border border-line">
          <div className="flex items-center gap-2 text-txt-muted text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Reimbursed to Date</span>
          </div>
          <div className="text-xl font-bold font-sora text-txt mt-2">
            ₹{totalReimbursed.toLocaleString("en-IN")}
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-surface border border-line overflow-hidden">
        <div className="p-4 border-b border-line flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {["All", "Pending", "Approved", "Paid", "Rejected"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  filter === f
                    ? "bg-brand text-white"
                    : "text-txt-muted hover:text-txt hover:bg-surface-secondary"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-line">
          {filteredClaims.length === 0 ? (
            <div className="p-8 text-center text-txt-muted text-xs">
              No claims found in this category.
            </div>
          ) : (
            filteredClaims.map((claim) => (
              <div key={claim.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-surface-secondary/40 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-txt">{claim.category}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      claim.status === "Paid"
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                        : claim.status === "Approved"
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
                        : claim.status === "Rejected"
                        ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                        : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                    }`}>
                      {claim.status}
                    </span>
                  </div>
                  <p className="text-xs text-txt-muted">{claim.description}</p>
                  <div className="flex items-center gap-4 text-[11px] text-txt-faint">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {claim.date}</span>
                    <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> ID: {claim.id}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold font-sora text-txt">₹{claim.amount.toLocaleString("en-IN")}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-surface border border-line shadow-2xl overflow-hidden animate-scale-in">
            <div className="p-4 border-b border-line flex items-center justify-between bg-surface-secondary/40">
              <h3 className="font-sora font-semibold text-sm text-txt">Claim an Expense</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-txt-faint hover:text-txt rounded-md">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-txt font-medium mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-line text-txt outline-none focus:border-brand"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-txt font-medium mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 1500"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-line text-txt outline-none focus:border-brand"
                  />
                </div>
                <div>
                  <label className="block text-txt font-medium mb-1">Expense Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-line text-txt outline-none focus:border-brand"
                  />
                </div>
              </div>
              <div>
                <label className="block text-txt font-medium mb-1">Description / Purpose</label>
                <textarea
                  rows={3}
                  placeholder="What was this expense for?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-line text-txt outline-none focus:border-brand"
                />
              </div>
              <div>
                <label className="block text-txt font-medium mb-1">Receipt Attachment (Optional)</label>
                <div className="border-2 border-dashed border-line rounded-xl p-4 text-center hover:border-brand/50 transition-colors cursor-pointer bg-surface-secondary/30">
                  <UploadCloud className="w-6 h-6 text-txt-faint mx-auto mb-1" />
                  <p className="text-txt-muted text-xs">{fileName ? fileName : "Click or browse file"}</p>
                  <input
                    type="file"
                    className="hidden"
                    id="receipt-file"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFileName(e.target.files[0].name);
                      }
                    }}
                  />
                  <label htmlFor="receipt-file" className="text-brand font-medium cursor-pointer underline text-[11px] mt-1 block">
                    Browse file
                  </label>
                </div>
              </div>
              <div className="pt-2 border-t border-line flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-line text-txt-muted hover:text-txt font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-brand text-white font-semibold hover:bg-brand/90 shadow-sm"
                >
                  Submit Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseEmployeePage;
