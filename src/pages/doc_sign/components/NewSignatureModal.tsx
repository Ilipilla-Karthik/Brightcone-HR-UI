import React, { useState, useEffect } from 'react';
import { SignEnvelope } from '../types';
import { INITIAL_SIGN_TEMPLATES, ALL_RECIPIENTS } from '../mockData';
import { ic } from '../../../components/icons';

interface NewSignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (envelope: Omit<SignEnvelope, 'id' | 'sent' | 'status'>) => void;
  defaultTemplate?: string;
}

export const NewSignatureModal: React.FC<NewSignatureModalProps> = ({
  isOpen,
  onClose,
  onSend,
  defaultTemplate,
}) => {
  const [tpl, setTpl] = useState(defaultTemplate || 'Offer letter');
  const [doc, setDoc] = useState('');
  const [to, setTo] = useState(ALL_RECIPIENTS[0].name);
  const [due, setDue] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (defaultTemplate) {
      setTpl(defaultTemplate);
      setDoc(`${defaultTemplate}: Senior Engineer`);
    } else {
      setDoc('Offer letter: Senior ML Engineer');
    }
  }, [defaultTemplate, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doc.trim()) {
      setError('Document title is required.');
      return;
    }
    const recObj = ALL_RECIPIENTS.find((r) => r.name === to);
    onSend({
      doc: doc.trim(),
      tpl,
      to,
      ext: recObj?.ext ?? false,
      from: 'Ananya Rao',
      due,
      fileSize: '1.2 MB',
      pagesCount: 4,
      description: `E-signature request for ${tpl}.`,
    });
    onClose();
  };

  return (
    <>
      <div className="scrim on" onClick={onClose} />
      <div className="modal on" role="dialog" aria-modal="true" style={{ maxWidth: '540px' }}>
        <h2>New signature request</h2>
        <p className="sub">The recipient gets an email with a secure signing link.</p>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <label className="field">
            <span>Template</span>
            <select
              className="input"
              value={tpl}
              onChange={(e) => {
                setTpl(e.target.value);
                setDoc(`${e.target.value}: ${to}`);
              }}
            >
              {INITIAL_SIGN_TEMPLATES.map((t) => (
                <option key={t.n} value={t.n}>
                  {t.n}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>
              Document title <span className="req">*</span>
            </span>
            <input
              type="text"
              required
              className="input"
              placeholder="e.g. Offer letter: QA Automation Engineer"
              value={doc}
              onChange={(e) => {
                setDoc(e.target.value);
                setError(null);
              }}
            />
          </label>

          <div className="frow">
            <label className="field">
              <span>Recipient</span>
              <select
                className="input"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              >
                {ALL_RECIPIENTS.map((r) => (
                  <option key={r.name} value={r.name}>
                    {r.name} ({r.ext ? 'External' : r.role})
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>
                Sign by <span className="req">*</span>
              </span>
              <input
                type="date"
                required
                className="input"
                value={due}
                onChange={(e) => setDue(e.target.value)}
              />
            </label>
          </div>

          {error && (
            <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">{error}</p>
          )}

          <div className="mfoot flex justify-end gap-2 pt-3 border-t border-[var(--line)]">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn primary flex items-center gap-1.5">
              {ic('send', 15)}
              Send for signature
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default NewSignatureModal;
