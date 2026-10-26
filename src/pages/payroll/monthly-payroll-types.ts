export interface MonthlyPayrollRecord {
  id: string
  month: string
  employeeId: string
  employeeName: string
  dept: string
  workingDays: number
  lopDays: number
  paidDays: number
  grossPay: number
  totalDeductions: number
  deductions?: number
  netPay: number
  status: 'Draft' | 'Processed' | 'Approved' | 'Paid'
  isArchived?: boolean
}

export const INITIAL_MONTHLY_PAYROLL: MonthlyPayrollRecord[] = []

export const INITIAL_RECORDS = INITIAL_MONTHLY_PAYROLL
