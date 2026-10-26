export interface SalaryStructureRecord {
  id: string
  employeeId: string
  employeeName: string
  dept: string
  effectiveFrom: string
  annualCtc: number
  basic: number
  basicMonthly?: number
  hra: number
  hraMonthly?: number
  specialAllowance: number
  otherAllowance: number
  employerPf: number
  pfDeduction?: number
  ptDeduction?: number
  monthlyGross: number
  status: 'Draft' | 'Active' | 'Superseded'
  isArchived?: boolean
}

export const INITIAL_STRUCTURES: SalaryStructureRecord[] = []
