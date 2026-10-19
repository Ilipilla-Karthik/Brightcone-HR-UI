import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ic, IconName } from '../../components/icons';

interface AppCardItem {
  key: string;
  name: string;
  color: string;
  description: string;
  metric: string;
  metricLabel: string;
  path: string;
  isImplemented?: boolean;
}

const APP_ICONS: Record<string, IconName> = {
  sign: 'pen',
  people: 'users',
  recruit: 'briefcase',
  payroll: 'pay',
  expense: 'receipt',
  connect: 'chat',
  learn: 'learn',
  shift: 'clock',
  plus: 'grid',
};

const APPS: AppCardItem[] = [
  {
    key: 'sign',
    name: 'Sign (DocSign)',
    color: '#D9466F',
    description: 'E-signatures, employment agreements, offer letters, and NDAs.',
    metric: '12',
    metricLabel: 'pending envelopes',
    path: '/doc-sign/dashboard',
    isImplemented: true,
  },
  {
    key: 'people',
    name: 'People',
    color: '#12A58E',
    description: 'Employee records, org structure, onboarding, and workforce profiles.',
    metric: '148',
    metricLabel: 'team members',
    path: '/people',
  },
  {
    key: 'recruit',
    name: 'Recruit',
    color: '#7C5CFF',
    description: 'Candidate pipelines, open jobs, interview schedules, and offers.',
    metric: '18',
    metricLabel: 'active candidates',
    path: '/recruit',
  },
  {
    key: 'payroll',
    name: 'Payroll',
    color: '#0F9F6E',
    description: 'Salary register, statutory filings, tax computation, and payslips.',
    metric: '₹42.8L',
    metricLabel: 'October payroll',
    path: '/payroll',
  },
  {
    key: 'expense',
    name: 'Expense',
    color: '#E07A1D',
    description: 'Employee reimbursement claims, mileage, and travel receipts.',
    metric: '8',
    metricLabel: 'claims to review',
    path: '/expense',
  },
  {
    key: 'connect',
    name: 'Connect',
    color: '#0BA6CC',
    description: 'Company feed, celebrations, kudos, and announcements.',
    metric: '4',
    metricLabel: 'kudos this week',
    path: '/engagement',
  },
  {
    key: 'learn',
    name: 'Learn',
    color: '#6366F1',
    description: 'Mandatory compliance training, course catalogues, and certifications.',
    metric: '92%',
    metricLabel: 'compliance rate',
    path: '/learn',
  },
  {
    key: 'shift',
    name: 'Shift',
    color: '#3B82C4',
    description: 'Rosters, shift swaps, overtime hours, and digital clock cards.',
    metric: '24',
    metricLabel: 'on duty now',
    path: '/time',
  },
  {
    key: 'plus',
    name: 'Advanced HR',
    color: '#0B6FDB',
    description: 'Executive analytics, eNPS sentiment, and compliance scorecards.',
    metric: '78',
    metricLabel: 'eNPS pulse',
    path: '/advanced-hr',
  },
];

export const SuiteDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setDate(
        now.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="view pb-12">
      <div className="head band mb-6">
        <div>
          <div className="eyebrow">Enterprise HR Suite • Brightcone People Plus</div>
          <h1 className="text-3xl font-bold font-heading text-white">Good morning, HR Administrator</h1>
          <p className="text-sm mt-1 text-[#C3CEEA] max-w-2xl">
            Unified workforce intelligence, document e-signatures, payroll compliance, and talent operations.
          </p>
        </div>
        <div className="clock flex items-center gap-4 bg-white/10 px-4 py-2.5 rounded-xl border border-white/20">
          <div className="text-right">
            <div className="text-xs text-[#C9D3EE]">{date}</div>
            <div className="time text-xl font-bold text-white font-mono">{time}</div>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--ok)] shadow-[0_0_8px_var(--ok)]" />
        </div>
      </div>

      <div className="banner flex items-center justify-between gap-4 p-4 rounded-xl border border-[var(--brand)] bg-[var(--info-bg)] mb-6">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-[var(--brand)] text-white flex items-center justify-center font-bold">
            {ic('pen', 18)}
          </span>
          <div>
            <strong className="text-sm text-[var(--text)]">DocSign Module is Live and Ready</strong>
            <p className="text-xs text-muted mt-0.5">
              Review and sign documents as an Employee or manage signature envelopes and templates as an HR Admin.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="btn primary sm"
            onClick={() => navigate('/doc-sign/requests')}
          >
            HR Signature Tracker
          </button>
          <button
            type="button"
            className="btn sm"
            onClick={() => navigate('/doc-sign/flow')}
          >
            Employee Sign Flow
          </button>
        </div>
      </div>

      <div className="grid g4 mb-6">
        <div className="card stat">
          <div className="k">
            <i>
              {ic('users', 16)}
            </i>
            Total Workforce
          </div>
          <div className="v">148</div>
          <div className="d text-muted">Across 6 global departments</div>
        </div>

        <div className="card stat">
          <div className="k">
            <i style={{ color: 'var(--brand)', background: 'var(--info-bg)' }}>
              {ic('pen', 16)}
            </i>
            DocSign Envelopes
          </div>
          <div className="v" style={{ color: 'var(--brand)' }}>12</div>
          <div className="d text-muted">Awaiting signer response</div>
        </div>

        <div className="card stat">
          <div className="k">
            <i style={{ color: 'var(--ok)', background: 'var(--ok-bg)' }}>
              {ic('check', 16)}
            </i>
            Signed Documents
          </div>
          <div className="v" style={{ color: 'var(--ok)' }}>34</div>
          <div className="d text-muted">Executed this month</div>
        </div>

        <div className="card stat">
          <div className="k">
            <i style={{ color: 'var(--warn)', background: 'var(--warn-bg)' }}>
              {ic('clock', 16)}
            </i>
            Pending Approvals
          </div>
          <div className="v">8</div>
          <div className="d text-muted">Leaves & expense claims</div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold font-heading">Suite Applications</h2>
            <p className="text-xs text-muted">Access modular HR workspaces across the Brightcone ecosystem.</p>
          </div>
          <span className="text-xs text-muted">9 Active Modules</span>
        </div>

        <div className="apps-grid">
          {APPS.map((app) => (
            <div
              key={app.key}
              onClick={() => navigate(app.path)}
              className="appcard"
              style={{ '--c': app.color } as React.CSSProperties}
            >
              <div className="t">
                <i>
                  {ic(APP_ICONS[app.key] || 'grid', 18)}
                </i>
                <b>{app.name}</b>
                <span className="go">{ic('arrow', 14)}</span>
              </div>
              <div className="m">
                {app.metric}
                <small>{app.metricLabel}</small>
              </div>
              <p>{app.description}</p>
              {app.isImplemented && (
                <span className="pill p-ok self-start text-[10px] mt-1">Live Feature</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-sm font-semibold flex justify-between items-center">
            <span>Workforce Department Distribution</span>
            <span className="text-xs text-muted font-normal">148 Employees</span>
          </h3>
          <div className="dept-bars mt-4 space-y-3">
            <div className="r">
              <span>Engineering</span>
              <div className="bar">
                <span style={{ width: '45%' }} />
              </div>
              <em>68</em>
            </div>
            <div className="r">
              <span>Product & Design</span>
              <div className="bar">
                <span style={{ width: '22%' }} />
              </div>
              <em>32</em>
            </div>
            <div className="r">
              <span>People & HR</span>
              <div className="bar">
                <span style={{ width: '12%' }} />
              </div>
              <em>18</em>
            </div>
            <div className="r">
              <span>Finance & Legal</span>
              <div className="bar">
                <span style={{ width: '10%' }} />
              </div>
              <em>15</em>
            </div>
            <div className="r">
              <span>Operations & Sales</span>
              <div className="bar">
                <span style={{ width: '11%' }} />
              </div>
              <em>15</em>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-sm font-semibold flex justify-between items-center">
            <span>Recent DocSign Activity</span>
            <button
              onClick={() => navigate('/doc-sign/requests')}
              className="text-xs text-brand font-medium hover:underline"
            >
              View all
            </button>
          </h3>
          <div className="list mt-3">
            <div className="row">
              <div className="who">
                <span className="av" style={{ background: '#0B6FDB' }}>AS</span>
                <div className="grow">
                  <b>Aditi Sharma — Senior Software Engineer</b>
                  <div className="sub">Employment Offer & Agreement • Oct 14, 2026</div>
                </div>
              </div>
              <span className="pill p-warn">Pending Sign</span>
            </div>
            <div className="row">
              <div className="who">
                <span className="av" style={{ background: '#7C5CFF' }}>RM</span>
                <div className="grow">
                  <b>Rohan Mehra — Advisory Partner</b>
                  <div className="sub">Mutual NDA Agreement • Oct 12, 2026</div>
                </div>
              </div>
              <span className="pill p-warn">Pending Sign</span>
            </div>
            <div className="row">
              <div className="who">
                <span className="av" style={{ background: '#12A58E' }}>PV</span>
                <div className="grow">
                  <b>Pooja Venkatesh — Product Designer</b>
                  <div className="sub">HIPAA & Security Policy • Signed Oct 11, 2026</div>
                </div>
              </div>
              <span className="pill p-ok">Completed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuiteDashboard;
