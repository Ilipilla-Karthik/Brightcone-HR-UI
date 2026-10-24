import {
  SignEnvelope,
  SignTemplateItem,
  HandbookRecord,
  PolicyRecord,
  PolicyAckRecord,
} from './types';

export const INITIAL_SIGN_ENVELOPES: SignEnvelope[] = [];

export const INITIAL_SIGN_TEMPLATES: SignTemplateItem[] = [];

export const INITIAL_HANDBOOKS: HandbookRecord[] = [
  {
    id: 'HB-001',
    ver: '4.0',
    version: '4.0',
    eff: '2026-01-05',
    effectiveDate: '2026-01-05',
    title: 'Brightcone Employee Handbook 2026',
    owner: 'Ananya Rao',
    file: 'employee-handbook-v4.pdf',
    changes: 'Updated leave carry-forward, hybrid guidelines and travel allowance',
    changesSummary: 'Updated leave carry-forward, hybrid guidelines and travel allowance',
    status: 'Published',
  },
  {
    id: 'HB-002',
    ver: '3.0',
    version: '3.0',
    eff: '2025-01-05',
    effectiveDate: '2025-01-05',
    title: 'Brightcone Employee Handbook 2025',
    owner: 'Ananya Rao',
    file: 'employee-handbook-v3.pdf',
    changes: 'Initial revised handbook release',
    changesSummary: 'Initial revised handbook release',
    status: 'Archived',
  },
];

export const INITIAL_POLICIES: PolicyRecord[] = [
  { id: 'POL-01', name: 'Employee handbook 2026', cat: 'Code of conduct', category: 'Code of conduct', ver: '3.0', version: '3.0', eff: '2026-01-05', effectiveDate: '2026-01-05', review: '2027-01-05', nextReviewDate: '2027-01-05', owner: 'Ananya Rao', file: 'handbook-2026.pdf', ackReq: true, ackRequired: true, status: 'Published', ack: ['Rahul Varma', 'Arjun Nair', 'Priya Menon', 'Karthik Reddy', 'Meera Joshi'] },
  { id: 'POL-02', name: 'Leave & holiday policy', cat: 'Leave', category: 'Leave', ver: '2.1', version: '2.1', eff: '2026-03-01', effectiveDate: '2026-03-01', review: '2027-03-01', nextReviewDate: '2027-03-01', owner: 'Ananya Rao', file: 'leave-policy-v2.1.pdf', ackReq: false, ackRequired: false, status: 'Published', ack: ['Rahul Varma'] },
  { id: 'POL-03', name: 'Travel & expense policy', cat: 'Travel & expense', category: 'Travel & expense', ver: '4.0', version: '4.0', eff: '2026-09-30', effectiveDate: '2026-09-30', review: '2027-09-30', nextReviewDate: '2027-09-30', owner: 'Meera Joshi', file: 'travel-expense-v4.0.pdf', ackReq: true, ackRequired: true, status: 'Published', ack: ['Meera Joshi'] },
  { id: 'POL-04', name: 'Code of conduct', cat: 'Code of conduct', category: 'Code of conduct', ver: '2.0', version: '2.0', eff: '2026-01-05', effectiveDate: '2026-01-05', review: '2027-01-05', nextReviewDate: '2027-01-05', owner: 'Naresh Vemparala', file: 'code-of-conduct-v2.pdf', ackReq: true, ackRequired: true, status: 'Published', ack: ['Rahul Varma', 'Priya Menon', 'Karthik Reddy'] },
  { id: 'POL-05', name: 'Remote & hybrid work policy', cat: 'Attendance & WFH', category: 'Attendance & WFH', ver: '1.2', version: '1.2', eff: '2026-06-10', effectiveDate: '2026-06-10', review: '2027-06-10', nextReviewDate: '2027-06-10', owner: 'Ananya Rao', file: 'hybrid-work-v1.2.pdf', ackReq: false, ackRequired: false, status: 'Published', ack: [] },
  { id: 'POL-06', name: 'POSH policy', cat: 'POSH', category: 'POSH', ver: '1.4', version: '1.4', eff: '2026-02-01', effectiveDate: '2026-02-01', review: '2027-02-01', nextReviewDate: '2027-02-01', owner: 'Priya Menon', file: 'posh-policy-v1.4.pdf', ackReq: true, ackRequired: true, status: 'Published', ack: ['Priya Menon'] },
];

export const INITIAL_ACKS: PolicyAckRecord[] = [
  { id: 'ACK-01', policy: 'POL-01', policyId: 'POL-01', policyName: 'Employee handbook 2026', emp: 'Rahul Varma', employeeName: 'Rahul Varma', employeeEmail: 'rahul.varma@brightcone.ai', department: 'Engineering', sent: '2026-01-10', sentDate: '2026-01-10', due: '2026-01-25', dueDate: '2026-01-25', ackOn: '2026-01-12', acknowledgedOn: '2026-01-12', status: 'Acknowledged' },
  { id: 'ACK-02', policy: 'POL-03', policyId: 'POL-03', policyName: 'Travel & expense policy', emp: 'Rahul Varma', employeeName: 'Rahul Varma', employeeEmail: 'rahul.varma@brightcone.ai', department: 'Engineering', sent: '2026-10-01', sentDate: '2026-10-01', due: '2026-10-31', dueDate: '2026-10-31', status: 'Pending' },
  { id: 'ACK-03', policy: 'POL-04', policyId: 'POL-04', policyName: 'Code of conduct', emp: 'Divya Kulkarni', employeeName: 'Divya Kulkarni', employeeEmail: 'divya.kulkarni@brightcone.ai', department: 'Engineering', sent: '2026-09-28', sentDate: '2026-09-28', due: '2026-10-15', dueDate: '2026-10-15', status: 'Pending' },
  { id: 'ACK-04', policy: 'POL-06', policyId: 'POL-06', policyName: 'POSH policy', emp: 'Priya Menon', employeeName: 'Priya Menon', employeeEmail: 'priya.menon@brightcone.ai', department: 'Engineering', sent: '2026-02-05', sentDate: '2026-02-05', due: '2026-02-20', dueDate: '2026-02-20', ackOn: '2026-02-06', acknowledgedOn: '2026-02-06', status: 'Acknowledged' },
];

export const ALL_RECIPIENTS = [
  { name: 'Neha Bansal', role: 'Senior ML Engineer', ext: true },
  { name: 'Olivia Martin', role: 'Solutions Architect', ext: true },
  { name: 'Marcus Lee', role: 'Solutions Architect', ext: true },
  { name: 'Rahul Varma', role: 'Staff Platform Engineer', ext: false },
  { name: 'Divya Kulkarni', role: 'Frontend Architect', ext: false },
  { name: 'Farhan Ali', role: 'Senior QA Analyst', ext: false },
  { name: 'Vikram Singh', role: 'DevOps Specialist', ext: false },
  { name: 'Aditi Sharma', role: 'Lead AI Engineer', ext: false },
  { name: 'Kavya Pillai', role: 'Principal Designer', ext: false },
  { name: 'Tejas Patil', role: 'Automation Lead', ext: false },
];

export const INITIAL_POLICY_ACKS = INITIAL_ACKS;
export const INITIAL_TEMPLATES: any[] = INITIAL_SIGN_TEMPLATES;
export const INITIAL_REQUESTS: any[] = INITIAL_SIGN_ENVELOPES;
