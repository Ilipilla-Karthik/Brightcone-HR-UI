import React, { useState } from 'react';
import { INITIAL_TEMPLATES } from './mockData';
import { SignatureTemplate } from './types';
import { ic } from '../../components/icons';

export const TemplateBuilder: React.FC = () => {
  const [templates] = useState<SignatureTemplate[]>(INITIAL_TEMPLATES);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTemplate, setActiveTemplate] = useState<SignatureTemplate | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredTemplates = templates.filter(
    (t) => selectedCategory === 'all' || t.category === selectedCategory
  );

  return (
    <div className="view pb-12">
      <div className="head flex items-end justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-[var(--text)]">Templates</h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            Reusable documents with signature and form fields already placed.
          </p>
        </div>
        <div className="actions flex gap-2">
          <button
            type="button"
            className="btn"
            onClick={() => showToast('Template upload isn’t connected in this prototype')}
          >
            {ic('upload', 15)}
            Upload template
          </button>
        </div>
      </div>

      <div className="card mb-6 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="tabs">
            <button
              type="button"
              className={selectedCategory === 'all' ? 'on' : ''}
              onClick={() => setSelectedCategory('all')}
            >
              All Templates ({templates.length})
            </button>
            <button
              type="button"
              className={selectedCategory === 'Offers' ? 'on' : ''}
              onClick={() => setSelectedCategory('Offers')}
            >
              Offers ({templates.filter((t) => t.category === 'Offers').length})
            </button>
            <button
              type="button"
              className={selectedCategory === 'NDAs' ? 'on' : ''}
              onClick={() => setSelectedCategory('NDAs')}
            >
              NDAs ({templates.filter((t) => t.category === 'NDAs').length})
            </button>
            <button
              type="button"
              className={selectedCategory === 'Policies' ? 'on' : ''}
              onClick={() => setSelectedCategory('Policies')}
            >
              Policies ({templates.filter((t) => t.category === 'Policies').length})
            </button>
            <button
              type="button"
              className={selectedCategory === 'Agreements' ? 'on' : ''}
              onClick={() => setSelectedCategory('Agreements')}
            >
              Agreements ({templates.filter((t) => t.category === 'Agreements').length})
            </button>
          </div>

          <span className="text-xs text-muted">
            All templates legally vetted for digital enforceability
          </span>
        </div>
      </div>

      <div className="tplgrid">
        {filteredTemplates.map((tpl) => (
          <div key={tpl.id} className="card flex flex-col justify-between hover:border-[var(--brand)] transition-colors">
            <div>
              <div className="tplprev">
                <i style={{ width: '85%' }} />
                <i style={{ width: '95%' }} />
                <i style={{ width: '70%' }} />
                <i style={{ width: '60%' }} />
                <em>
                  {ic('pen', 12)}
                  {tpl.requiredFields} Signatures Required
                </em>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="pill p-info">{tpl.category}</span>
                <span className="text-xs text-muted">Used {tpl.usageCount} times</span>
              </div>

              <h3 className="font-bold text-sm font-heading mb-1">{tpl.title}</h3>
              <p className="text-xs text-muted leading-relaxed line-clamp-2">{tpl.description}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-[var(--line)] flex items-center justify-between">
              <span className="text-[11px] text-faint">Updated {tpl.lastUpdated}</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="btn sm"
                  onClick={() => setActiveTemplate(tpl)}
                >
                  Preview
                </button>
                <button
                  type="button"
                  className="btn sm primary"
                  style={{ background: '#D9466F', borderColor: '#D9466F' }}
                  onClick={() => showToast(`Template "${tpl.title}" selected for envelope draft.`)}
                >
                  Use Template
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {activeTemplate && (
        <>
          <div className="scrim on" onClick={() => setActiveTemplate(null)} />
          <div className="modal on wide" style={{ maxWidth: '640px' }}>
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <div>
                <span className="pill p-info">{activeTemplate.category}</span>
                <h2 className="text-lg font-bold font-heading mt-1">{activeTemplate.title}</h2>
              </div>
              <button
                onClick={() => setActiveTemplate(null)}
                aria-label="Close"
                className="w-8 h-8 rounded-lg border border-[var(--line)] flex items-center justify-center text-muted hover:text-black hover:border-brand"
              >
                {ic('x', 14)}
              </button>
            </div>

            <div className="my-4 max-h-[50vh] overflow-y-auto space-y-3 p-4 bg-[var(--surface-2)] rounded-xl border border-[var(--line)]">
              <div className="text-xs font-mono whitespace-pre-line text-[var(--text)] leading-relaxed">
                {activeTemplate.bodyTemplate}
              </div>

              <div className="border-t border-[var(--line)] pt-3 flex justify-between items-center text-xs text-muted">
                <span>Required Signature Fields: {activeTemplate.requiredFields}</span>
                <span className="font-script text-xl text-[var(--brand)]">Signed E-Attestation Placeholder</span>
              </div>
            </div>

            <div className="mfoot flex justify-end gap-2 pt-3 border-t border-[var(--line)]">
              <button type="button" className="btn" onClick={() => setActiveTemplate(null)}>
                Close Preview
              </button>
              <button
                type="button"
                className="btn primary"
                onClick={() => {
                  const tpl = activeTemplate;
                  setActiveTemplate(null);
                  showToast(`Draft created using "${tpl.title}".`);
                }}
              >
                Create Request With This Template
              </button>
            </div>
          </div>
        </>
      )}

      {toastMessage && (
        <div className="toast on">
          {ic('check', 18)}
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default TemplateBuilder;
