import React, { useEffect, useState } from 'react';
import api from '../../services/api';

interface Employee {
  id: string;
  name: string;
  department?: string;
  designation?: string;
  current_role?: string;
  date_of_joining?: string;
  status?: string;
}

interface PromotionRequest {
  id: string;
  employee_name: string;
  current_role: string;
  proposed_role: string;
  department: string;
  requested_by: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

const STATIC_REQUESTS: PromotionRequest[] = [
  { id: 'p1', employee_name: 'Karthik Reddy', current_role: 'Senior AI Engineer', proposed_role: 'Principal AI Engineer', department: 'Engineering', requested_by: 'Naresh Vemparala', status: 'pending', date: '2026-10-20' },
  { id: 'p2', employee_name: 'Meera Joshi', current_role: 'Associate Product Manager', proposed_role: 'Product Manager', department: 'Product', requested_by: 'Ananya Rao', status: 'pending', date: '2026-10-18' },
  { id: 'p3', employee_name: 'Vikram Singh', current_role: 'Senior Sales Executive', proposed_role: 'Sales Manager', department: 'Sales', requested_by: 'Suresh Kumar', status: 'approved', date: '2026-09-30' },
  { id: 'p4', employee_name: 'Deepa Krishnan', current_role: 'Finance Analyst', proposed_role: 'Senior Finance Analyst', department: 'Finance', requested_by: 'Ananya Rao', status: 'rejected', date: '2026-09-15' },
];

const CAREER_PATHS = [
  { role: 'Associate Engineer', next: 'Engineer', years: '1–2 yrs' },
  { role: 'Engineer', next: 'Senior Engineer', years: '2–3 yrs' },
  { role: 'Senior Engineer', next: 'Principal Engineer', years: '3–4 yrs' },
  { role: 'Associate PM', next: 'Product Manager', years: '1–2 yrs' },
  { role: 'Product Manager', next: 'Senior PM', years: '2–3 yrs' },
];

const tenureYears = (doj?: string) => {
  if (!doj) return 0;
  return (Date.now() - new Date(doj).getTime()) / (1000 * 60 * 60 * 24 * 365.25);
};

export const CareerPromotionsPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [requests, setRequests] = useState<PromotionRequest[]>(STATIC_REQUESTS);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    api.get('/employees')
      .then(r => { if (mounted) setEmployees(r.data || []); })
      .catch(() => {
        if (mounted) setEmployees([
          { id: 'e1', name: 'Karthik Reddy', department: 'Engineering', designation: 'Senior AI Engineer', date_of_joining: '2020-09-05' },
          { id: 'e2', name: 'Meera Joshi', department: 'Product', designation: 'Associate PM', date_of_joining: '2022-07-19' },
          { id: 'e3', name: 'Suresh Kumar', department: 'Sales', designation: 'Sales Executive', date_of_joining: '2025-01-15' },
          { id: 'e4', name: 'Ananya Rao', department: 'HR & Ops', designation: 'People Ops Lead', date_of_joining: '2021-06-20' },
          { id: 'e5', name: 'Vikram Singh', department: 'Engineering', designation: 'Engineer', date_of_joining: '2024-02-10' },
        ]);
      })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const eligible = employees.filter(e => tenureYears(e.date_of_joining) >= 1);

  const handleAction = async (id: string, action: 'approved' | 'rejected') => {
    setActing(id);
    try { await api.put(`/promotions/${id}`, { status: action }); } catch { /* optimistic */ }
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: action } : r));
    setActing(null);
  };

  const statusColor = (s: string) => ({ approved: '#16a34a', rejected: '#dc2626', pending: '#f59e0b' }[s] || '#64748b');
  const statusBg = (s: string) => ({ approved: '#dcfce7', rejected: '#fef2f2', pending: '#fef9c3' }[s] || '#f1f5f9');

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', fontFamily: 'Sora, sans-serif', margin: 0 }}>Career Growth & Promotions</h1>
        <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Promotion requests, eligible employees, and career paths</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
          <div style={{ width: 32, height: 32, border: '3px solid #e2e8f0', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
      ) : (
        <>
          {/* Promotion Requests */}
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,.05)', overflow: 'hidden', marginBottom: 20 }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>Promotion Requests</h2>
                <p style={{ fontSize: 12, color: '#94a3b8', margin: '2px 0 0' }}>{requests.filter(r => r.status === 'pending').length} pending review</p>
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    {['Employee', 'Current Role', 'Proposed Role', 'Dept', 'Date', 'Status', 'Action'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: '#64748b', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {requests.map(req => (
                    <tr key={req.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '11px 14px', fontWeight: 600, color: '#1e293b' }}>{req.employee_name}</td>
                      <td style={{ padding: '11px 14px', color: '#64748b' }}>{req.current_role}</td>
                      <td style={{ padding: '11px 14px', color: '#6366f1', fontWeight: 600 }}>{req.proposed_role}</td>
                      <td style={{ padding: '11px 14px', color: '#64748b' }}>{req.department}</td>
                      <td style={{ padding: '11px 14px', color: '#94a3b8', fontSize: 12 }}>{req.date}</td>
                      <td style={{ padding: '11px 14px' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: statusBg(req.status), color: statusColor(req.status), textTransform: 'uppercase' }}>{req.status}</span>
                      </td>
                      <td style={{ padding: '11px 14px' }}>
                        {req.status === 'pending' ? (
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button onClick={() => handleAction(req.id, 'approved')} disabled={acting === req.id}
                              style={{ padding: '4px 10px', borderRadius: 7, border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', background: '#dcfce7', color: '#16a34a' }}>✓ Approve</button>
                            <button onClick={() => handleAction(req.id, 'rejected')} disabled={acting === req.id}
                              style={{ padding: '4px 10px', borderRadius: 7, border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', background: '#fef2f2', color: '#dc2626' }}>✕ Reject</button>
                          </div>
                        ) : <span style={{ fontSize: 12, color: '#94a3b8' }}>—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Eligible Employees */}
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,.05)', overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9' }}>
                <h2 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0 }}>Eligible for Promotion</h2>
                <p style={{ fontSize: 12, color: '#94a3b8', margin: '2px 0 0' }}>Tenure ≥ 1 year</p>
              </div>
              <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {eligible.map(e => (
                  <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#f8fafc', borderRadius: 8 }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', margin: 0 }}>{e.name}</p>
                      <p style={{ fontSize: 11, color: '#94a3b8', margin: '2px 0 0' }}>{e.designation || e.department}</p>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', background: '#6366f11a', padding: '2px 8px', borderRadius: 99 }}>
                      {Math.floor(tenureYears(e.date_of_joining))}y {Math.floor((tenureYears(e.date_of_joining) % 1) * 12)}m
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Career Paths */}
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,.05)', overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9' }}>
                <h2 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0 }}>Career Path Suggestions</h2>
                <p style={{ fontSize: 12, color: '#94a3b8', margin: '2px 0 0' }}>Standard progression tracks</p>
              </div>
              <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {CAREER_PATHS.map((cp, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: '#f8fafc', borderRadius: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#334155', flex: 1 }}>{cp.role}</span>
                    <span style={{ fontSize: 16, color: '#94a3b8' }}>→</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', flex: 1 }}>{cp.next}</span>
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>{cp.years}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default CareerPromotionsPage;
