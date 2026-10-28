// Shared types, employee list, mock data and utility helpers for Payroll & Compliance views

export interface EmployeeRef {
  id: string
  name: string
  email: string
  dept: string
  role: string
}

export const DEMO_EMPLOYEES: EmployeeRef[] = [
  { id: 'BC-1001', name: 'Ananya Rao', email: 'ananya.rao@brightcone.ai', dept: 'People Ops', role: 'People Ops Lead' },
  { id: 'BC-1002', name: 'Naresh Vemparala', email: 'naresh.vemparala@brightcone.ai', dept: 'Operations', role: 'VP Operations' },
  { id: 'BC-1003', name: 'Karthik Reddy', email: 'karthik.reddy@brightcone.ai', dept: 'Engineering', role: 'Principal Architect' },
  { id: 'BC-1004', name: 'Priya Menon', email: 'priya.menon@brightcone.ai', dept: 'Product', role: 'Head of Product' },
  { id: 'BC-1005', name: 'Meera Joshi', email: 'meera.joshi@brightcone.ai', dept: 'Finance', role: 'Finance Lead' },
  { id: 'BC-1006', name: 'Rahul Varma', email: 'rahul.varma@brightcone.ai', dept: 'Engineering', role: 'Staff Engineer' },
  { id: 'BC-1007', name: 'Sneha Iyer', email: 'sneha.iyer@brightcone.ai', dept: 'Design', role: 'Product Designer' },
  { id: 'BC-1008', name: 'Arjun Nair', email: 'arjun.nair@brightcone.ai', dept: 'Sales', role: 'Account Executive' },
]

export async function getPayrollEmployees(): Promise<EmployeeRef[]> {
  try {
    const res = await fetch('/api/v1/employees');
    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data) ? data : data.value || [];
      if (list.length > 0) {
        return list.map((e: any) => ({
          id: e.employee_code || (e.id ? `BC-${e.id}` : 'BC-1000'),
          name: e.full_name || e.name || 'Staff Member',
          email: e.work_email || `${(e.full_name || 'employee').toLowerCase().replace(/\s+/g, '.')}@brightcone.ai`,
          dept: e.department || e.dept || 'Engineering',
          role: e.job_title || e.role || 'Staff',
        }));
      }
    }
  } catch {}
  return DEMO_EMPLOYEES;
}

export function formatINR(val: number | string | undefined | null): string {
  if (val === undefined || val === null || val === '') return '₹0'
  const num = typeof val === 'string' ? parseFloat(val) : val
  if (isNaN(num)) return '₹0'
  return '₹' + Math.round(num).toLocaleString('en-IN')
}

export function exportToCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  const csvString = [
    headers.join(','),
    ...rows.map((e) => e.map((x) => `"${String(x ?? '').replace(/"/g, '""')}"`).join(','))
  ].join('\r\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
