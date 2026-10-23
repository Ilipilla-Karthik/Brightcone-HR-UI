import React, { useState, useEffect } from 'react';
import { INITIAL_TEMPLATES } from './mockData';
import { SignatureTemplate, DocumentCategory } from './types';
import { ic } from '../../components/icons';
import * as templateService from '../../services/templateService';

export const TemplateBuilder: React.FC = () => {
  const [templates, setTemplates] = useState<SignatureTemplate[]>(INITIAL_TEMPLATES);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [activeTemplate, setActiveTemplate] = useState<SignatureTemplate | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Upload modal form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<DocumentCategory>('Agreements');
  const [newDesc, setNewDesc] = useState('');
  const [newFields, setNewFields] = useState(3);
  const [newBody, setNewBody] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      const data = await templateService.getTemplates(selectedCategory, search);
      setTemplates(data);
    } catch {
      // Fallback already handled inside templateService
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, [selectedCategory, search]);

  const handleUseTemplate = async (tpl: SignatureTemplate) => {
    try {
      const res = await templateService.useTemplate(tpl.id);
      setTemplates((prev) =>
        prev.map((t) => (t.id === tpl.id ? { ...t, usageCount: res.usageCount } : t))
      );
      showToast(`Draft envelope ${res.draftEnvelopeId} created using "${tpl.title}".`);
    } catch {
      showToast(`Template "${tpl.title}" selected for draft.`);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast('Please enter a template title');
      return;
    }

    try {
      const created = await templateService.createTemplate({
        title: newTitle.trim(),
        category: newCategory,
        description: newDesc.trim() || 'Custom digital agreement template.',
        requiredFields: newFields || 2,
        bodyTemplate: newBody.trim() || 'Please review and electronically sign this agreement.',
      });

      setTemplates((prev) => [created, ...prev]);
      setIsUploadModalOpen(false);
      setNewTitle('');
      setNewDesc('');
      setNewBody('');
      showToast(`Template "${created.title}" successfully added to backend library!`);
    } catch (err) {
      showToast('Failed to create template');
    }
  };

  const filteredTemplates = templates.filter(
    (t) => selectedCategory === 'all' || t.category === selectedCategory
  );

  return (
    <div className="view pb-12 select-none" style={{ '--ac': '#D9466F', animation: 'fade .25s ease' } as React.CSSProperties}>
      {/* Head */}
      <div className="head flex items-end justify-between flex-wrap gap-4 mb-6">
        <div>
          <span className="eyebrow">Sign</span>
          <h1 className="text-2xl font-bold font-heading text-[var(--text)]">Templates</h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            Reusable documents with signature and form fields already placed.
          </p>
        </div>
        <div className="actions flex gap-2">
          <button
            type="button"
            className="btn primary"
            style={{ background: '#D9466F', borderColor: '#D9466F' }}
            onClick={() => setIsUploadModalOpen(true)}
          >
            {ic('upload', 15)}
            Upload template
          </button>
        </div>
      </div>

      {/* Filter Toolbar Card */}
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

          <label className="search flex items-center gap-2 bg-[var(--surface-2)] px-3 py-1.5 rounded-lg border border-[var(--line)]">
            {ic('search', 15)}
            <input
              className="bg-transparent border-0 outline-hidden text-xs w-48"
              type="search"
              placeholder="Search templates"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
        </div>
      </div>

      {/* Grid of Templates */}
      {isLoading && templates.length === 0 ? (
        <div className="card text-center py-12 text-muted text-sm">
          Loading templates from backend...
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="card empty text-center py-12">
          <div className="empty-ic mb-2">{ic('doc', 28)}</div>
          <p className="text-muted text-sm">No templates found in this category.</p>
        </div>
      ) : (
        <div className="tplgrid">
          {filteredTemplates.map((tpl) => (
            <div key={tpl.id} className="card flex flex-col justify-between hover:border-[#D9466F] transition-colors">
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
                    onClick={() => handleUseTemplate(tpl)}
                  >
                    Use template
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Template Preview Modal */}
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
                <span className="font-script text-xl text-[#D9466F]">Signed E-Attestation Placeholder</span>
              </div>
            </div>

            <div className="mfoot flex justify-end gap-2 pt-3 border-t border-[var(--line)]">
              <button type="button" className="btn" onClick={() => setActiveTemplate(null)}>
                Close Preview
              </button>
              <button
                type="button"
                className="btn primary"
                style={{ background: '#D9466F', borderColor: '#D9466F' }}
                onClick={() => {
                  const tpl = activeTemplate;
                  setActiveTemplate(null);
                  handleUseTemplate(tpl);
                }}
              >
                Use this template
              </button>
            </div>
          </div>
        </>
      )}

      {/* Upload/Create Template Modal */}
      {isUploadModalOpen && (
        <>
          <div className="scrim on" onClick={() => setIsUploadModalOpen(false)} />
          <div className="modal on" style={{ maxWidth: '520px' }}>
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
              <h2 className="text-lg font-bold font-heading">Upload / Create Template</h2>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                aria-label="Close"
                className="w-8 h-8 rounded-lg border border-[var(--line)] flex items-center justify-center text-muted hover:text-black"
              >
                {ic('x', 14)}
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 my-4 text-xs">
              <div>
                <label className="block font-medium mb-1 text-[var(--text)]">Template Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Non-Disclosure Agreement v2.0"
                  className="input w-full"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1 text-[var(--text)]">Category</label>
                  <select
                    className="input w-full"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as DocumentCategory)}
                  >
                    <option value="Agreements">Agreements</option>
                    <option value="Offers">Offers</option>
                    <option value="NDAs">NDAs</option>
                    <option value="Policies">Policies</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-1 text-[var(--text)]">Required Signatures</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    className="input w-full"
                    value={newFields}
                    onChange={(e) => setNewFields(Number(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1 text-[var(--text)]">Description</label>
                <input
                  type="text"
                  placeholder="Brief summary of document purpose"
                  className="input w-full"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-[var(--text)]">Document Text / Body</label>
                <textarea
                  rows={4}
                  placeholder="Enter standard template wording or legal clauses..."
                  className="input w-full font-mono text-xs"
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                />
              </div>

              <div className="mfoot flex justify-end gap-2 pt-3 border-t border-[var(--line)]">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setIsUploadModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn primary"
                  style={{ background: '#D9466F', borderColor: '#D9466F' }}
                >
                  {ic('check', 14)}
                  Save & Publish Template
                </button>
              </div>
            </form>
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
