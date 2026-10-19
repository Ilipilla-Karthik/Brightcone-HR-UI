import React, { useState } from 'react';
import { INITIAL_REQUESTS } from './mockData';
import { EnvelopeStatus, SignatureRequest } from './types';
import { DocSignStats } from './components/DocSignStats';
import { NewEnvelopeModal } from './components/NewEnvelopeModal';
import { DocumentViewerModal } from './components/DocumentViewerModal';
import { ic } from '../../components/icons';

export const SignatureRequests: React.FC = () => {
  const [requests, setRequests] = useState<SignatureRequest[]>(INITIAL_REQUESTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | EnvelopeStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedEnvelope, setSelectedEnvelope] = useState<SignatureRequest | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.recipient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.envelopeNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || req.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleSendReminder = (req: SignatureRequest) => {
    showToast(`Reminder notification dispatched to ${req.recipient.email}.`);
  };

  const handleRevoke = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'declined' } : r))
    );
    showToast('Signature envelope has been revoked.');
  };

  const handleCreateEnvelope = (newReq: SignatureRequest) => {
    setRequests((prev) => [newReq, ...prev]);
    showToast(`Signature request "${newReq.title}" dispatched.`);
  };

  return (
    <div className="view pb-12">
      <div className="head flex items-end justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-[var(--text)]">Signature requests</h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            Every envelope sent from Brightcone, with its signing status.
          </p>
        </div>
        <div className="actions flex gap-2">
          <button
            type="button"
            className="btn primary"
            style={{ background: '#D9466F', borderColor: '#D9466F' }}
            onClick={() => setIsNewModalOpen(true)}
          >
            {ic('pen', 15)}
            New signature request
          </button>
        </div>
      </div>

      <DocSignStats requests={requests} />

      <div className="card rv">
        <div className="rtools flex flex-wrap gap-3 items-center justify-between p-4 border-b border-[var(--line)]">
          <div className="search relative flex-1 min-w-[240px] max-w-[380px]">
            {ic('search', 16, 'absolute left-3 top-1/2 -translate-y-1/2 text-[var(--faint)]')}
            <input
              type="text"
              className="input w-full pl-9"
              placeholder="Search by title, recipient, or envelope ID…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <div className="tabs">
              <button
                type="button"
                className={statusFilter === 'all' ? 'on' : ''}
                onClick={() => setStatusFilter('all')}
              >
                All ({requests.length})
              </button>
              <button
                type="button"
                className={statusFilter === 'pending' ? 'on' : ''}
                onClick={() => setStatusFilter('pending')}
              >
                Pending ({requests.filter((r) => r.status === 'pending').length})
              </button>
              <button
                type="button"
                className={statusFilter === 'signed' ? 'on' : ''}
                onClick={() => setStatusFilter('signed')}
              >
                Signed ({requests.filter((r) => r.status === 'signed').length})
              </button>
              <button
                type="button"
                className={statusFilter === 'declined' ? 'on' : ''}
                onClick={() => setStatusFilter('declined')}
              >
                Declined ({requests.filter((r) => r.status === 'declined').length})
              </button>
            </div>

            <select
              className="input text-xs"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="Offers">Employment Offers</option>
              <option value="NDAs">NDAs</option>
              <option value="Policies">Policies</option>
              <option value="Agreements">Agreements</option>
            </select>
          </div>
        </div>

        <div className="table-wrap">
          <table className="rtable w-full text-left">
            <thead>
              <tr>
                <th>Document / Envelope</th>
                <th>Recipient</th>
                <th>Category</th>
                <th>Sent / Due Date</th>
                <th>Status</th>
                <th className="ract">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="empty">
                      <div className="empty-ic">
                        {ic('doc', 24)}
                      </div>
                      <strong>No matching signature requests</strong>
                      <p className="text-muted text-xs mt-1">Try modifying your search or filter criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id}>
                    <td>
                      <div>
                        <strong className="block text-sm text-[var(--text)] font-semibold">
                          {req.title}
                        </strong>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-muted">
                          <span className="font-mono">{req.envelopeNumber}</span>
                          <span>•</span>
                          <span>{req.pagesCount} pages</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="who">
                        <span
                          className="av"
                          style={{ background: req.recipient.avatarColor || 'var(--brand)' }}
                        >
                          {req.recipient.name.slice(0, 2).toUpperCase()}
                        </span>
                        <div>
                          <b>{req.recipient.name}</b>
                          <span>{req.recipient.role}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="pill p-info">{req.category}</span>
                    </td>
                    <td>
                      <div className="text-xs">
                        <div>Sent: {req.sentDate}</div>
                        <div className="text-muted">Due: {req.dueDate}</div>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`pill ${
                          req.status === 'signed'
                            ? 'p-ok'
                            : req.status === 'pending'
                            ? 'p-warn'
                            : 'p-bad'
                        }`}
                      >
                        {req.status === 'signed'
                          ? 'Completed'
                          : req.status === 'pending'
                          ? 'Pending Sign'
                          : 'Declined'}
                      </span>
                    </td>
                    <td className="ract">
                      <div className="racts">
                        <button
                          type="button"
                          className="btn ib"
                          title="Preview document"
                          onClick={() => {
                            setSelectedEnvelope(req);
                            setIsViewerOpen(true);
                          }}
                        >
                          {ic('doc', 15)}
                        </button>
                        {req.status === 'pending' && (
                          <button
                            type="button"
                            className="btn ib"
                            title="Send reminder to recipient"
                            onClick={() => handleSendReminder(req)}
                          >
                            {ic('bell', 15)}
                          </button>
                        )}
                        {req.status === 'signed' && (
                          <button
                            type="button"
                            className="btn ib"
                            title="Download verified PDF"
                            onClick={() => showToast(`Downloaded signed copy of ${req.envelopeNumber}`)}
                          >
                            {ic('download', 15)}
                          </button>
                        )}
                        {req.status === 'pending' && (
                          <button
                            type="button"
                            className="btn ib bad"
                            title="Revoke request"
                            onClick={() => handleRevoke(req.id)}
                          >
                            {ic('x', 15)}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="rfoot">
          <span>Showing {filteredRequests.length} of {requests.length} total envelopes</span>
          <span>Compliance: SOC 2 Type II Aligned • Audit Hashed</span>
        </div>
      </div>

      <DocumentViewerModal
        envelope={selectedEnvelope}
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
      />

      <NewEnvelopeModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSubmit={handleCreateEnvelope}
      />

      {toastMessage && (
        <div className="toast on">
          {ic('check', 18)}
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default SignatureRequests;
