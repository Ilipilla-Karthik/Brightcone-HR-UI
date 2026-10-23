import React, { useState } from 'react';
import { SignEnvelope, SignStatus } from './types';
import { INITIAL_SIGN_ENVELOPES } from './mockData';
import { NewSignatureModal } from './components/NewSignatureModal';
import { ic } from '../../components/icons';

const TABS: Array<'All' | SignStatus> = [
  'All',
  'Awaiting signature',
  'Viewed',
  'Completed',
  'Declined',
];

export const SignatureRequests: React.FC = () => {
  const [envelopes, setEnvelopes] = useState<SignEnvelope[]>(INITIAL_SIGN_ENVELOPES);
  const [activeTab, setActiveTab] = useState<'All' | SignStatus>('All');
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [voidConfirmId, setVoidConfirmId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  };

  const filtered = envelopes.filter(
    (g) => activeTab === 'All' || g.status === activeTab
  );

  const handleRemind = (g: SignEnvelope) => {
    showToast(`Reminder sent to ${g.to}`);
  };

  const handleVoid = (id: string) => {
    setEnvelopes((prev) =>
      prev.map((g) => (g.id === id ? { ...g, status: 'Voided' } : g))
    );
    setVoidConfirmId(null);
    showToast('Envelope voided');
  };

  const handleSend = (newEnv: Omit<SignEnvelope, 'id' | 'sent' | 'status'>) => {
    const item: SignEnvelope = {
      ...newEnv,
      id: `SG-${1043 + envelopes.length}`,
      sent: new Date().toISOString().slice(0, 10),
      status: 'Awaiting signature',
    };
    setEnvelopes([item, ...envelopes]);
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

      {/* Header */}
      <div className="head band">
        <div>
          <span className="eyebrow">Sign</span>
          <h1>Signature requests</h1>
          <p>Every envelope sent from Brightcone, with its signing status.</p>
        </div>

        <div className="actions">
          <button
            type="button"
            className="btn primary flex items-center gap-1.5"
            onClick={() => setIsNewOpen(true)}
          >
            {ic('pen', 16)}
            New signature request
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="tabs mb-4 flex gap-2">
        {TABS.map((tab) => {
          const count =
            tab === 'All'
              ? envelopes.length
              : envelopes.filter((g) => g.status === tab).length;
          return (
            <button
              key={tab}
              type="button"
              className={activeTab === tab ? 'on' : ''}
              onClick={() => setActiveTab(tab)}
            >
              {tab} ({count})
            </button>
          );
        })}
      </div>

      {/* Card Table */}
      <div className="card">
        <h3>
          {filtered.length} envelope{filtered.length === 1 ? '' : 's'}
        </h3>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Document</th>
                <th>Recipient</th>
                <th>Sent</th>
                <th>Due</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((r) => {
                  const isOpen =
                    r.status === 'Awaiting signature' || r.status === 'Viewed';
                  const isDone = r.status === 'Completed';

                  const pillClass =
                    r.status === 'Completed'
                      ? 'p-ok'
                      : r.status === 'Awaiting signature'
                      ? 'p-warn'
                      : r.status === 'Viewed'
                      ? 'p-info'
                      : 'p-bad';

                  return (
                    <tr key={r.id}>
                      <td>
                        <span className="muted font-mono">{r.id}</span>
                      </td>
                      <td>
                        <b>{r.doc}</b>
                        <div className="muted" style={{ fontSize: '12.5px' }}>
                          {r.tpl}
                        </div>
                      </td>
                      <td>
                        <div className="who flex items-center gap-2">
                          <span
                            className="av"
                            style={{
                              background: r.ext ? '#7C5CFF' : '#0B6FDB',
                              color: '#fff',
                            }}
                          >
                            {r.to
                              .split(' ')
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join('')}
                          </span>
                          <div>
                            <b>{r.to}</b>
                            <span>{r.ext ? 'External' : 'Employee'}</span>
                          </div>
                        </div>
                      </td>
                      <td>{r.sent}</td>
                      <td>{r.due}</td>
                      <td>
                        <span className={`pill ${pillClass}`}>{r.status}</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="flex items-center justify-end gap-1.5">
                          {isOpen && (
                            <>
                              <button
                                type="button"
                                className="btn sm"
                                onClick={() => handleRemind(r)}
                              >
                                Remind
                              </button>
                              <button
                                type="button"
                                className="btn sm bad"
                                onClick={() => setVoidConfirmId(r.id)}
                              >
                                Void
                              </button>
                            </>
                          )}
                          {isDone && (
                            <button
                              type="button"
                              className="btn sm"
                              onClick={() => showToast('Signed copy downloaded')}
                            >
                              {ic('download', 14)}
                              Signed copy
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7}>
                    <div className="empty">No envelopes in this list.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Void Confirmation Modal */}
      {voidConfirmId && (
        <>
          <div className="scrim on" onClick={() => setVoidConfirmId(null)} />
          <div className="modal on" style={{ maxWidth: '440px' }}>
            <h2>Void this envelope?</h2>
            <p className="sub">
              The recipient will no longer be able to sign this document. You can send a new request later.
            </p>
            <div className="mfoot flex justify-end gap-2">
              <button
                type="button"
                className="btn"
                onClick={() => setVoidConfirmId(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn primary"
                style={{ background: 'var(--bad)', borderColor: 'var(--bad)' }}
                onClick={() => handleVoid(voidConfirmId)}
              >
                Void envelope
              </button>
            </div>
          </div>
        </>
      )}

      {/* New Signature Modal */}
      <NewSignatureModal
        isOpen={isNewOpen}
        onClose={() => setIsNewOpen(false)}
        onSend={handleSend}
      />
    </div>
  );
};

export default SignatureRequests;
