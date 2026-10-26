export interface SalaryStructure {
  id: string;
  employee_id: string;
  employee_name: string;
  department: string;
  effective_from: string;
  gross_monthly: number;
  basic: number;
  hra: number;
  special_allowance: number;
  employee_pf: number;
  professional_tax: number;
  estimated_tds: number;
  net_take_home: number;
  annual_ctc: number;
  pf_opt_out: boolean;
  tax_regime: string;
  is_active: boolean;
  superseded_by?: string;
}

export interface SalaryRevision {
  id: string;
  employee_id: string;
  employee_name: string;
  current_gross: number;
  proposed_gross: number;
  increment_percent: number;
  effective_date: string;
  reason: string;
  notes: string;
  status: "Draft" | "Under Review" | "Approved" | "Rejected";
  approved_by?: string;
  approved_at?: string;
  created_at: string;
}

export interface IncrementRecord {
  id: string;
  employee_id: string;
  employee_name: string;
  previous_gross: number;
  revised_gross: number;
  increment_amount: number;
  increment_percentage: number;
  effective_date: string;
  change_type: string;
  approved_by: string;
  approved_at: string;
  notes: string;
}

export interface SalaryBreakdown {
  gross_monthly_rupees: number;
  basic_monthly_rupees: number;
  hra_monthly_rupees: number;
  special_allowance_rupees: number;
  employee_pf_rupees: number;
  employer_pf_rupees: number;
  professional_tax_rupees: number;
  estimated_tds_rupees: number;
  net_take_home_rupees: number;
  annual_ctc_rupees: number;
  gross_monthly_paise: number;
  basic_monthly_paise: number;
  hra_monthly_paise: number;
  special_allowance_paise: number;
  employee_pf_paise: number;
  employer_pf_paise: number;
  professional_tax_paise: number;
  estimated_tds_paise: number;
  net_take_home_paise: number;
}

export const defaultStructures: SalaryStructure[] = [];

export const defaultRevisions: SalaryRevision[] = [];

export const defaultHistory: IncrementRecord[] = [];
