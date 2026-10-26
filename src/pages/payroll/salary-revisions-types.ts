export interface SalaryRevisionRecord {
  id: string
  employeeId: string
  employeeName: string
  dept: string
  appraisalCycle: string
  rating: number
  currentCtc: number
  revisedCtc: number
  changePct: number
  effectiveDate: string
  approver: string
  status: 'Pending' | 'Approved' | 'Rejected' | 'Completed'
  isArchived?: boolean
}

export const INITIAL_REVISIONS: SalaryRevisionRecord[] = []
