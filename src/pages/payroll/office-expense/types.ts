export interface OfficeExpense {
  id: string;
  vendor_name: string;
  category: string;
  invoice_no: string;
  invoice_date: string;
  base_amount: number;
  gst_rate: number;
  gst_amount: number;
  total_amount: number;
  status: "Paid" | "Pending";
}

export const defaultExpenses: OfficeExpense[] = [];

export const categories = [
  "Office Rent",
  "Internet & Telecom",
  "Hardware & IT",
  "Office Supplies",
  "Electricity & Utilities",
  "Legal & Professional",
];

export const gstRates = [0, 5, 12, 18, 28];
