import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignEnvelope, SignTemplateItem } from './types';
import { INITIAL_SIGN_ENVELOPES, INITIAL_SIGN_TEMPLATES } from './mockData';
import { NewSignatureModal } from './components/NewSignatureModal';
import { ic } from '../../components/icons';
import * as templateService from '../../services/templateService';

export const SignDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [envelopes, setEnvelopes] = useState<SignEnvelope[]>(INITIAL_SIGN_ENVELOPES);
  const [templates, setTemplates] = useState<SignTemplateItem[]>(INITIAL_SIGN_TEMPLATES);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isNewOpen, setIsNewOpen] = useState(false);

  useEffect(() => {
    let active = true;
    templateService
      .getTemplates()
      .then((data) => {
        if (active && data && data.length > 0) {
          const mapped: SignTemplateItem[] = data.map((t) => ({
            id: t.id,
            n: t.title || 'Template',
            f: t.requiredFields || 4,
            used: t.usageCount || 10,
            category: t.category,
          }));
          setTemplates(mapped);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  };

  const openList = envelopes.filter(
    (g) => g.status === 'Awaiting signature' || g.status === 'Viewed'
  );
  const doneList = envelopes.filter((g) => g.status === 'Completed');
  const declinedList = envelopes.filter(
    (g) => g.status === 'Declined' || g.status === 'Voided' || g.status === 'Expired'
  );

  const tat = doneList.length
    ? (
        doneList.reduce((acc, g) => {
          const sent = new Date(g.sent).getTime();
          const signed = g.signed ? new Date(g.signed).getTime() : sent + 864e5;
          return acc + (signed - sent) / 864e5;
        }, 0) / doneList.length
      ).toFixed(1) + ' days'
    : '2.5 days';

  const totalCount = envelopes.length;
  const pct = totalCount ? Math.round((doneList.length / totalCount) * 100) : 0;
  const maxUsed = Math.max(1, ...templates.map((t) => t.used));

  const handleRemind = (_id: string, to: string) => {
    showToast(`Reminder sent to ${to}`);
  };

  const handleSend = (newEnv: Omit<SignEnvelope, 'id' | 'sent' | 'status'>) => {
    const item: SignEnvelope = {
      ...newEnv,
      id: `SG-${1043 + envelopes.length}`,
      sent: new Date().toISOString().slice(0, 10),
      status: 'Awaiting signature',
    };
    setEnvelopes([item, ...envelopes]);
    setTemplates((prev) =>
      prev.map((t) => (t.n === newEnv.tpl ? { ...t, used: t.used + 1 } : t))
    );
    showToast(`Sent to ${newEnv.to} for signature`);
  };

  return (
    <div
      className="view pb-12"
      style={{ '--ac': '#D9466F', animation: 'fade .25s ease' } as React.CSSProperties}
    >
      {toastMessage && (
        <div className="toast on" style={{ position: 'fixed', zIndex: 100 }}>
          {ic('check', 18)}
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Band */}
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
            onClick={() => setIsNewOpen(true)}
          >
            {ic('pen', 16)}
            New signature request
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid g4">
        <div className="card stat">
          <div className="k">
            <i>{ic('pen', 16)}</i>
            Awaiting signature
          </div>
          <div className="v">{openList.length}</div>
          <div className="d">
            {envelopes.filter((g) => g.status === 'Viewed').length} opened but not signed
          </div>
        </div>

        <div className="card stat">
          <div className="k">
            <i>{ic('check', 16)}</i>
            Completed
          </div>
          <div className="v">{doneList.length}</div>
          <div className="d up">Signed and filed</div>
        </div>

        <div className="card stat">
          <div className="k">
            <i>{ic('clock', 16)}</i>
            Average turnaround
          </div>
          <div className="v">{tat}</div>
          <div className="d">From sent to signed</div>
        </div>

        <div className="card stat">
          <div className="k">
            <i>{ic('x', 16)}</i>
            Declined or voided
          </div>
          <div className="v">{declinedList.length}</div>
          <div className="d">Need follow-up</div>
        </div>
      </div>

      {/* Split Grid: Waiting on others + Envelope status */}
      <div className="grid g-dash mt">
        <div className="card">
          <h3>
            Waiting on others
            <button
              type="button"
              className="link"
              onClick={() => navigate('/doc-sign/requests')}
            >
              All requests
            </button>
          </h3>

          {openList.length > 0 ? (
            <div className="list">
              {openList.map((g) => {
                const isLate = g.due < new Date().toISOString().slice(0, 10);
                return (
                  <div key={g.id} className="row">
                    <span
                      className="av"
                      style={{
                        background: 'color-mix(in srgb, var(--ac) 14%, transparent)',
                        color: 'var(--ac)',
                      }}
                    >
                      {ic('doc', 16)}
                    </span>
                    <div className="grow min-w-0">
                      <b className="truncate block font-semibold">{g.doc}</b>
                      <div className="sub text-xs text-[var(--muted)] truncate">
                        To {g.to}
                        {g.ext ? ' (external)' : ''} ·{' '}
                        {isLate ? (
                          <span style={{ color: 'var(--bad)', fontWeight: 600 }}>overdue</span>
                        ) : (
                          `due ${g.due}`
                        )}
                      </div>
                    </div>
                    <span className={`pill ${g.status === 'Viewed' ? 'p-info' : 'p-warn'}`}>
                      {g.status}
                    </span>
                    <button
                      type="button"
                      className="btn sm"
                      onClick={() => handleRemind(g.id, g.to)}
                    >
                      Remind
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty">Nothing waiting for a signature.</div>
          )}
        </div>

        {/* Right: Envelope status & Donut */}
        <div className="card">
          <h3>Envelope status</h3>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div
              className="donut"
              style={{ '--p': pct, '--ac': '#D9466F' } as React.CSSProperties}
              role="img"
              aria-label={`${pct}%`}
            >
              <b>{pct}%</b>
            </div>
            <div className="list" style={{ flex: 1, minWidth: '150px' }}>
              <div className="row">
                <div className="grow">
                  <span className="pill p-ok">Completed</span>
                </div>
                <b>{doneList.length}</b>
              </div>
              <div className="row">
                <div className="grow">
                  <span className="pill p-warn">Awaiting signature</span>
                </div>
                <b>{envelopes.filter((g) => g.status === 'Awaiting signature').length}</b>
              </div>
              <div className="row">
                <div className="grow">
                  <span className="pill p-info">Viewed</span>
                </div>
                <b>{envelopes.filter((g) => g.status === 'Viewed').length}</b>
              </div>
              <div className="row">
                <div className="grow">
                  <span className="pill p-bad">Declined</span>
                </div>
                <b>{envelopes.filter((g) => g.status === 'Declined').length}</b>
              </div>
            </div>
          </div>
          <p className="muted" style={{ fontSize: '12.5px', marginTop: '14px' }}>
            Share of all envelopes that are fully signed.
          </p>
        </div>
      </div>

      {/* Bottom Card: Most-used templates */}
      <div className="card mt">
        <h3>Most-used templates</h3>
        <div className="dept-bars wide2">
          {[...templates]
            .sort((a, b) => b.used - a.used)
            .map((t) => (
              <div key={t.n} className="r">
                <span title={t.n}>{t.n}</span>
                <div className="bar">
                  <span
                    style={{
                      width: `${Math.max(0, Math.min(100, (t.used / maxUsed) * 100))}%`,
                    }}
                  />
                </div>
                <em>{t.used}</em>
              </div>
            ))}
        </div>
      </div>

      {/* New Signature Request Modal */}
      <NewSignatureModal
        isOpen={isNewOpen}
        onClose={() => setIsNewOpen(false)}
        onSend={handleSend}
      />
    </div>
  );
};

export default SignDashboard;
