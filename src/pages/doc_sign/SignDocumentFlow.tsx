import React, { useState } from 'react';
import { SignEnvelope } from './types';
import { INITIAL_SIGN_ENVELOPES } from './mockData';
import { SignDocumentModal } from './components/SignDocumentModal';
import { ic } from '../../components/icons';
import { useAuth } from '../../services/authContext';

export const SignDocumentFlow: React.FC = () => {
  const { user } = useAuth();
  const userName = user?.name || 'Rahul Varma';

  const [envelopes, setEnvelopes] = useState<SignEnvelope[]>(() =>
    INITIAL_SIGN_ENVELOPES.filter(
      (g) => g.to === userName || g.to === 'Rahul Varma' || !g.ext
    )
  );
  const [selectedEnvelope, setSelectedEnvelope] = useState<SignEnvelope | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  };

  const openList = envelopes.filter(
    (g) => g.status === 'Awaiting signature' || g.status === 'Viewed'
  );

  const handleSigned = (id: string, signatureText: string) => {
    setEnvelopes((prev) =>
      prev.map((g) =>
        g.id === id
          ? {
              ...g,
              status: 'Completed',
              signed: new Date().toISOString().slice(0, 10),
            }
          : g
      )
    );
    showToast(`Signed as "${signatureText}". Your copy is saved here.`);
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
      <div className="head">
        <div>
          <h1>Documents to sign</h1>
          <p>Review and e-sign documents HR sends you. Signed copies stay here.</p>
        </div>
      </div>

      {/* Open Documents Banner */}
      {openList.length > 0 && (
        <div
          className="banner"
          style={{
            background: 'color-mix(in srgb, var(--ac) 9%, var(--surface))',
            borderColor: 'color-mix(in srgb, var(--ac) 30%, transparent)',
          }}
        >
          {ic('pen', 18)}
          <span>
            <b style={{ color: 'var(--ac)' }}>
              {openList.length} document{openList.length > 1 ? 's' : ''}
            </b>{' '}
            waiting for your signature.
          </span>
        </div>
      )}

      {/* Documents Card Table */}
      <div className="card">
        <h3>Your documents</h3>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Document</th>
                <th>Received</th>
                <th>Sign by</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {envelopes.length > 0 ? (
                envelopes.map((r) => {
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
                        <b>{r.doc}</b>
                        <div className="muted" style={{ fontSize: '12.5px' }}>
                          From {r.from}
                        </div>
                      </td>
                      <td>{r.sent}</td>
                      <td>{r.due}</td>
                      <td>
                        <span className={`pill ${pillClass}`}>{r.status}</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="flex items-center justify-end gap-2">
                          {isOpen && (
                            <button
                              type="button"
                              className="btn sm primary flex items-center gap-1.5"
                              onClick={() => setSelectedEnvelope(r)}
                            >
                              {ic('pen', 14)}
                              Review & sign
                            </button>
                          )}
                          {isDone && (
                            <button
                              type="button"
                              className="btn sm flex items-center gap-1.5"
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
                  <td colSpan={5}>
                    <div className="empty">Nothing to sign right now.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* E-Sign Modal */}
      <SignDocumentModal
        envelope={selectedEnvelope}
        onClose={() => setSelectedEnvelope(null)}
        onSigned={handleSigned}
        currentUser={userName}
      />
    </div>
  );
};

export default SignDocumentFlow;
