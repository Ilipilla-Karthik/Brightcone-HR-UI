export interface PayslipRecord {
  id: string
  employeeId: string
  employeeName: string
  dept: string
  month: string
  gross: number
  deductions: number
  netPay: number
  issuedOn: string
  status: 'Generated' | 'Sent' | 'Acknowledged'
  isArchived?: boolean
  basic?: number
  hra?: number
  specialAllowance?: number
  pf?: number
  pt?: number
  tds?: number
}

export const INITIAL_PAYSLIPS: PayslipRecord[] = []
