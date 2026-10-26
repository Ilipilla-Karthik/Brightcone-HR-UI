import React, { useEffect, useState } from 'react';
import api from '../../services/api';

interface Notification {
  id: string;
  title: string;
  message?: string;
  priority: 'high' | 'medium' | 'low';
  due_date?: string;
  status: 'pending' | 'done';
  category?: string;
}

const PRIORITIES = ['All', 'high', 'medium', 'low'];

const priorityColor = (p: string) => {
  if (p === 'high') return '#dc2626';
  if (p === 'medium') return '#f59e0b';
  return '#22c55e';
};

export const ActionsRemindersPage: React.FC = () => {
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [showDone, setShowDone] = useState(false);
  const [marking, setMarking] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    api.get('/notifications')
      .then(r => { if (mounted) setItems(r.data || []); })
      .catch(() => {
        if (mounted) setItems([
          { id: 'n1', title: 'Probation review due — Rohan Verma', message: 'Complete the 3-month probation review for Rohan Verma (Associate QA).', priority: 'high', due_date: '2026-10-27', status: 'pending', category: 'People' },
          { id: 'n2', title: 'October payroll approval pending', message: 'Finance team is waiting for HR sign-off on October salary batch.', priority: 'high', due_date: '2026-10-26', status: 'pending', category: 'Payroll' },
          { id: 'n3', title: 'POSH training completion reminder', message: '6 employees haven\'t completed mandatory POSH training.', priority: 'high', due_date: '2026-10-30', status: 'pending', category: 'Compliance' },
          { id: 'n4', title: 'Offer letter awaiting issuance — Neha Gupta', message: 'Offer accepted but letter not yet issued.', priority: 'medium', due_date: '2026-10-28', status: 'pending', category: 'Recruit' },
          { id: 'n5', title: 'Equipment return — Ramesh Babu (exit)', message: 'Laptop and access card return pending from Ramesh Babu.', priority: 'medium', due_date: '2026-10-29', status: 'pending', category: 'Assets' },
          { id: 'n6', title: 'Q3 performance reviews to be finalized', message: 'Deadline for finalising Q3 appraisal cycle is next week.', priority: 'medium', due_date: '2026-11-02', status: 'pending', category: 'Performance' },
          { id: 'n7', title: 'Update holiday calendar for 2027', message: 'Add regional holidays for FY 2026-27 before November.', priority: 'low', due_date: '2026-11-15', status: 'pending', category: 'Admin' },
          { id: 'n8', title: 'Benefits enrolment window closing', message: 'Annual benefits enrolment closes end of month.', priority: 'low', due_date: '2026-10-31', status: 'pending', category: 'Payroll' },
          { id: 'n9', title: 'BGV completed — Sita Lakshmi', message: 'Background verification cleared. Update onboarding status.', priority: 'low', due_date: '2026-10-26', status: 'done', category: 'Recruit' },
        ]);
      })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const markDone = async (id: string) => {
    setMarking(id);
    try { await api.put(`/notifications/${id}/read`); } catch { /* optimistic */ }
    setItems(prev => prev.map(n => n.id === id ? { ...n, status: 'done' } : n));
    setMarking(null);
  };

  const filtered = items.filter(n => {
    const matchP = filter === 'All' || n.priority === filter;
    const matchDone = showDone || n.status === 'pending';
    return matchP && matchDone;
  });

  const overdue = items.filter(n => n.status === 'pending' && n.due_date && new Date(n.due_date) < new Date());
  const pending = items.filter(n => n.status === 'pending').length;

  return (
    <div style={{ padding: 24, maxWidth: 960, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', fontFamily: 'Sora, sans-serif', margin: 0 }}>Actions & Reminders</h1>
        <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Pending HR tasks, approvals, and time-sensitive reminders</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Pending Actions', value: pending, color: '#f59e0b' },
          { label: 'Overdue', value: overdue.length, color: '#dc2626' },
          { label: 'Completed', value: items.filter(n => n.status === 'done').length, color: '#16a34a' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,.05)' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>{s.label}</p>
            <p style={{ fontSize: 28, fontWeight: 800, color: s.color, margin: '6px 0 0', fontFamily: 'Sora, sans-serif' }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {PRIORITIES.map(p => (
            <button key={p} onClick={() => setFilter(p)}
              style={{ padding: '5px 14px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12, fontWeight: 600, cursor: 'pointer', background: filter === p ? '#6366f1' : '#fff', color: filter === p ? '#fff' : '#64748b' }}>
              {p === 'All' ? 'All' : p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b', cursor: 'pointer', marginLeft: 'auto' }}>
          <input type="checkbox" checked={showDone} onChange={e => setShowDone(e.target.checked)} />
          Show completed
        </label>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
          <div style={{ width: 32, height: 32, border: '3px solid #e2e8f0', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(n => {
            const isOverdue = n.status === 'pending' && n.due_date && new Date(n.due_date) < new Date();
            return (
              <div key={n.id} style={{ background: '#fff', border: `1px solid ${n.status === 'done' ? '#f1f5f9' : '#e2e8f0'}`, borderLeft: `4px solid ${n.status === 'done' ? '#e2e8f0' : priorityColor(n.priority)}`, borderRadius: 12, padding: '14px 18px', boxShadow: '0 1px 3px rgba(0,0,0,.04)', display: 'flex', alignItems: 'flex-start', gap: 14, opacity: n.status === 'done' ? 0.65 : 1 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', textDecoration: n.status === 'done' ? 'line-through' : 'none' }}>{n.title}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 99, background: priorityColor(n.priority) + '1a', color: priorityColor(n.priority), textTransform: 'uppercase', letterSpacing: '0.05em' }}>{n.priority}</span>
                    {n.category && <span style={{ fontSize: 10, padding: '1px 7px', borderRadius: 99, background: '#f1f5f9', color: '#64748b', fontWeight: 600 }}>{n.category}</span>}
                  </div>
                  {n.message && <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 6px' }}>{n.message}</p>}
                  {n.due_date && (
                    <p style={{ fontSize: 11, fontWeight: 600, color: isOverdue ? '#dc2626' : '#94a3b8', margin: 0 }}>
                      {isOverdue ? '⚠ Overdue · ' : ''}Due: {n.due_date}
                    </p>
                  )}
                </div>
                {n.status === 'pending' && (
                  <button onClick={() => markDone(n.id)} disabled={marking === n.id}
                    style={{ flexShrink: 0, padding: '6px 14px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12, fontWeight: 600, cursor: 'pointer', background: '#f0fdf4', color: '#16a34a', opacity: marking === n.id ? 0.6 : 1 }}>
                    {marking === n.id ? '…' : '✓ Done'}
                  </button>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && <div style={{ textAlign: 'center', color: '#94a3b8', padding: 40 }}>No actions match your filters</div>}
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default ActionsRemindersPage;
