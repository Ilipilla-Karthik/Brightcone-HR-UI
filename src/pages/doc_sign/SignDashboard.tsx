import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { INITIAL_REQUESTS, INITIAL_TEMPLATES } from './mockData';
import { SignatureRequest } from './types';
import { ic } from '../../components/icons';

export const SignDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [requests] = useState<SignatureRequest[]>(INITIAL_REQUESTS);
  const [templates] = useState(INITIAL_TEMPLATES);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const openEnvelopes = requests.filter(
    (r) => r.status === 'pending' || r.status === 'viewed' || (r.status as string) === 'Viewed'
  );

  const completedCount = requests.filter((r) => r.status === 'signed').length;
  const awaitingCount = requests.filter((r) => r.status === 'pending').length;
  const viewedCount = requests.filter((r) => r.status === 'viewed' || (r.status as string) === 'Viewed').length;
  const declinedCount = requests.filter((r) => r.status === 'declined').length;
  const totalCount = requests.length;

  const signedRequests = requests.filter((r) => r.status === 'signed');
  const averageTurnaround = signedRequests.length
    ? (signedRequests.reduce((acc, r) => {
        const sent = new Date(r.sentDate).getTime();
        const signedDateStr = r.signedAt ? r.signedAt.split(',').slice(0, 2).join(',') : r.sentDate;
        const signedTime = new Date(signedDateStr).getTime();
        return acc + (signedTime - sent) / 864e5;
      }, 0) / signedRequests.length).toFixed(1) + ' days'
    : '1.0 days';

  const completionPercentage = totalCount
    ? Math.round((completedCount / totalCount) * 100)
    : 0;

  const maxUsed = Math.max(...templates.map((t) => t.usageCount), 1);

  // SVG Donut calculation
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (completionPercentage / 100) * circumference;

  return (
    <div className="view pb-12" style={{ '--ac': '#D9466F', animation: 'fade .25s ease' } as React.CSSProperties}>
      {toastMessage && (
        <div className="toast on" style={{ position: 'fixed', zIndex: 100 }}>
          {ic('check', 18)}
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Banner */}
      <div className="head band">
        <div>
          <span className="eyebrow">Sign</span>
          <h1>Sign dashboard</h1>
          <p>
            Send offers, agreements and policies for e-signature and track every envelope.
          </p>
        </div>

        <div className="actions">
          <button
            type="button"
            className="btn"
            onClick={() => navigate('/doc-sign/templates')}
          >
            {ic('doc', 16)}
            Templates
          </button>
          <button
            type="button"
            className="btn primary"
            onClick={() => navigate('/doc-sign/requests')}
          >
            {ic('pen', 16)}
            New signature request
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid g4 mb-6">
        <div className="card stat">
          <div className="k"><i>{ic('pen', 16)}</i>Awaiting signature</div>
          <div className="v">{openEnvelopes.length}</div>
          <div className="d">{viewedCount} opened but not signed</div>
        </div>

        <div className="card stat">
          <div className="k"><i>{ic('check', 16)}</i>Completed</div>
          <div className="v">{completedCount}</div>
          <div className="d up">Signed and filed</div>
        </div>

        <div className="card stat">
          <div className="k"><i>{ic('clock', 16)}</i>Average turnaround</div>
          <div className="v">{averageTurnaround}</div>
          <div className="d">From sent to signed</div>
        </div>

        <div className="card stat">
          <div className="k"><i>{ic('x', 16)}</i>Declined or voided</div>
          <div className="v">{declinedCount}</div>
          <div className="d">Need follow-up</div>
        </div>
      </div>

      {/* Top row: Waiting on others + Envelope status */}
      <div className="grid g-dash">
        {/* Card 1: Waiting on others */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-[var(--text)] m-0">Waiting on others</h3>
            <button
              type="button"
              className="link text-xs font-medium text-[var(--brand)] hover:underline"
              onClick={() => navigate('/doc-sign/requests')}
            >
              All requests
            </button>
          </div>

          <div className="list">
            {openEnvelopes.map((envelope) => {
              const isOverdue = envelope.id === 'SG-1042' || envelope.id === 'SG-1037';
              const isViewed = envelope.status === 'viewed' || (envelope.status as string) === 'Viewed';

              return (
                <div
                  key={envelope.id}
                  className="row flex items-center gap-3 py-3 border-t border-[var(--line)] first:border-t-0 first:pt-0"
                >
                  <span
                    className="av flex-none w-9 h-9 rounded-full flex items-center justify-center shadow-xs"
                    style={{
                      background: 'color-mix(in srgb, #D9466F 14%, transparent)',
                      color: '#D9466F',
                    }}
                  >
                    {ic('doc', 16)}
                  </span>

                  <div className="grow min-w-0 flex-1">
                    <b className="block text-[13.5px] font-semibold text-[var(--text)] truncate">
                      {envelope.title}
                    </b>
                    <div className="sub text-xs text-[var(--muted)] truncate mt-0.5">
                      To {envelope.recipient.name}
                      {envelope.isExternal ? ' (external)' : ''} •{' '}
                      {isOverdue ? (
                        <span style={{ color: 'var(--bad)', fontWeight: 600 }}>overdue</span>
                      ) : (
                        `due ${envelope.dueDate.replace(', 2026', '')}`
                      )}
                    </div>
                  </div>

                  {isViewed ? (
                    <span className="pill p-info text-xs font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap">
                      ● Viewed
                    </span>
                  ) : (
                    <span className="pill p-warn text-xs font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap">
                      ● Awaiting signature
                    </span>
                  )}

                  <button
                    type="button"
                    className="btn sm text-xs px-2.5 py-1 border border-[var(--line)] rounded-lg hover:border-[var(--brand)] font-medium transition-colors"
                    onClick={() =>
                      showToast(`Reminder sent to ${envelope.recipient.name}`)
                    }
                  >
                    Remind
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 2: Envelope status */}
        <div className="card flex flex-col justify-between">
          <h3 className="text-base font-semibold text-[var(--text)] mb-3">Envelope status</h3>

          <div className="flex items-center gap-5 flex-wrap">
            {/* Donut Chart */}
            <div className="relative w-32 h-32 flex items-center justify-center flex-none">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="none"
                  stroke="var(--line)"
                  strokeWidth="12"
                />
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="none"
                  stroke="#D9466F"
                  strokeWidth="12"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-bold font-heading text-[var(--text)]">
                  {completionPercentage}%
                </span>
              </div>
            </div>

            {/* Breakdown List */}
            <div className="list flex-1 min-w-[140px] space-y-2">
              <div className="row flex items-center justify-between text-xs py-1 border-t border-[var(--line)] first:border-t-0">
                <span className="pill p-ok font-semibold px-2 py-0.5 rounded-full">
                  ● Completed
                </span>
                <b className="text-[var(--text)] font-bold text-sm">{completedCount}</b>
              </div>

              <div className="row flex items-center justify-between text-xs py-1 border-t border-[var(--line)]">
                <span className="pill p-warn font-semibold px-2 py-0.5 rounded-full">
                  ● Awaiting signature
                </span>
                <b className="text-[var(--text)] font-bold text-sm">{awaitingCount}</b>
              </div>

              <div className="row flex items-center justify-between text-xs py-1 border-t border-[var(--line)]">
                <span className="pill p-info font-semibold px-2 py-0.5 rounded-full">
                  ● Viewed
                </span>
                <b className="text-[var(--text)] font-bold text-sm">{viewedCount}</b>
              </div>

              <div className="row flex items-center justify-between text-xs py-1 border-t border-[var(--line)]">
                <span className="pill p-bad font-semibold px-2 py-0.5 rounded-full">
                  ● Declined
                </span>
                <b className="text-[var(--text)] font-bold text-sm">{declinedCount}</b>
              </div>
            </div>
          </div>

          <p className="text-xs text-[var(--muted)] mt-4 mb-0">
            Share of all envelopes that are fully signed.
          </p>
        </div>
      </div>

      {/* Bottom row: Most-used templates */}
      <div className="mt">
        <div className="card">
          <h3 className="text-base font-semibold text-[var(--text)] mb-4">Most-used templates</h3>

          <div className="dept-bars wide2 space-y-3">
            {templates.map((tpl) => {
              const pct = (tpl.usageCount / maxUsed) * 100;
              return (
                <div
                  key={tpl.id}
                  className="r grid grid-cols-[180px_1fr_40px] gap-3 items-center text-xs"
                >
                  <span className="text-[13px] font-medium text-[var(--text)] truncate">
                    {tpl.title}
                  </span>

                  <div className="bar h-2 bg-[var(--surface-2)] border border-[var(--line)] rounded-full overflow-hidden">
                    <span
                      className="block h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        background: 'linear-gradient(90deg, #D9466F, #F43F5E)',
                      }}
                    />
                  </div>

                  <em className="text-right text-[var(--muted)] font-mono text-xs not-italic">
                    {tpl.usageCount}
                  </em>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignDashboard;
