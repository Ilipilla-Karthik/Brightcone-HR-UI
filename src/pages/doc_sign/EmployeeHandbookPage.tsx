import React, { useState } from 'react';
import { INITIAL_HANDBOOKS } from './mockData';
import { HandbookRecord } from './types';
import { ic } from '../../components/icons';

export const EmployeeHandbookPage: React.FC = () => {
  const [records, setRecords] = useState<HandbookRecord[]>(INITIAL_HANDBOOKS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showArchived, setShowArchived] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewRecord, setViewRecord] = useState<HandbookRecord | null>(null);
  const [editingRecord, setEditingRecord] = useState<HandbookRecord | null>(null);

  const [formVer, setFormVer] = useState('');
  const [formEff, setFormEff] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formOwner, setFormOwner] = useState('Ananya Rao');
  const [formFile, setFormFile] = useState('');
  const [formChanges, setFormChanges] = useState('');
  const [formStatus, setFormStatus] = useState<HandbookRecord['status']>('Draft');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const activeRecords = records.filter((r) => r.status !== 'Archived');
  const archivedRecords = records.filter((r) => r.status === 'Archived');
  const pool = showArchived ? archivedRecords : activeRecords;

  const filtered = pool.filter((r) => {
    const q = search.trim().toLowerCase();
    const matchSearch =
      !q ||
      r.id.toLowerCase().includes(q) ||
      r.title.toLowerCase().includes(q) ||
      r.version.toLowerCase().includes(q) ||
      r.owner.toLowerCase().includes(q) ||
      r.changesSummary.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const openAddModal = () => {
    setEditingRecord(null);
    setFormVer('4.1');
    setFormEff(new Date().toISOString().split('T')[0]);
    setFormTitle('Brightcone Employee Handbook 2026-27 (v4.1)');
    setFormOwner('Ananya Rao');
    setFormFile('Handbook_v4.1.pdf');
    setFormChanges('Updated hybrid attendance guidelines and remote allowances.');
    setFormStatus('Draft');
    setIsFormOpen(true);
  };

  const openEditModal = (rec: HandbookRecord) => {
    setEditingRecord(rec);
    setFormVer(rec.version);
    setFormEff(rec.effectiveDate);
    setFormTitle(rec.title);
    setFormOwner(rec.owner);
    setFormFile(rec.file);
    setFormChanges(rec.changesSummary);
    setFormStatus(rec.status);
    setIsFormOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formVer.trim() || !formTitle.trim()) {
      showToast('Please fill out version and title.');
      return;
    }

    if (editingRecord) {
      setRecords((prev) =>
        prev.map((r) => {
          if (r.id === editingRecord.id) {
            return {
              ...r,
              version: formVer,
              effectiveDate: formEff,
              title: formTitle,
              owner: formOwner,
              file: formFile || `${formTitle.replace(/\s+/g, '_')}.pdf`,
              changesSummary: formChanges,
              status: formStatus,
            };
          }
          if (formStatus === 'Published' && r.status === 'Published' && r.id !== editingRecord.id) {
            return { ...r, status: 'Archived' };
          }
          return r;
        })
      );
      showToast(`Updated Handbook v${formVer}`);
    } else {
      const newRec: HandbookRecord = {
        id: `HB-${formVer}`,
        version: formVer,
        effectiveDate: formEff,
        title: formTitle,
        owner: formOwner,
        file: formFile || `Handbook_v${formVer}.pdf`,
        changesSummary: formChanges,
        status: formStatus,
      };
      setRecords((prev) => {
        let updated = [newRec, ...prev];
        if (formStatus === 'Published') {
          updated = updated.map((x) =>
            x.id !== newRec.id && x.status === 'Published' ? { ...x, status: 'Archived' } : x
          );
        }
        return updated;
      });
      showToast(`Created handbook version v${formVer}`);
    }
    setIsFormOpen(false);
  };

  const exportCSV = () => {
    const headers = ['ID', 'Version', 'Title', 'Effective Date', 'Owner', 'File', 'Status'];
    const rows = filtered.map((r) => [
      r.id,
      r.version,
      `"${r.title.replace(/"/g, '""')}"`,
      r.effectiveDate,
      `"${r.owner}"`,
      r.file,
      r.status,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `employee_handbook_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    showToast('Exported Employee Handbook CSV.');
  };

  return (
    <div className="view pb-12 select-none" style={{ '--ac': '#D9466F', animation: 'fade .25s ease' } as React.CSSProperties}>
      {toastMessage && (
        <div className="toast on" style={{ position: 'fixed', zIndex: 100 }}>
          {ic('check', 18)}
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Head */}
      <div className="head flex items-end justify-between flex-wrap gap-4 mb-6">
        <div>
          <span className="eyebrow">Sign</span>
          <h1 className="text-2xl font-bold font-heading text-[var(--text)]">Employee handbook</h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            Versions of the employee handbook. Publish a version, then send it for acknowledgement.
          </p>
        </div>

        <div className="actions flex gap-2">
          <button type="button" className="btn" onClick={exportCSV}>
            {ic('download', 15)}
            Export CSV
          </button>
          <button
            type="button"
            className="btn primary"
            style={{ background: '#D9466F', borderColor: '#D9466F' }}
            onClick={openAddModal}
          >
            {ic('plus', 15)}
            Add handbook version
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid g4 mb-6">
        <div className="card stat">
          <div className="k"><i>{ic('doc', 16)}</i>Total records</div>
          <div className="v">{records.length}</div>
          <div className="d">{archivedRecords.length} archived</div>
        </div>
        <div className="card stat">
          <div className="k"><i>{ic('edit', 16)}</i>Draft</div>
          <div className="v">{records.filter((r) => r.status === 'Draft').length}</div>
          <div className="d">In editing</div>
        </div>
        <div className="card stat">
          <div className="k"><i>{ic('clock', 16)}</i>Under review</div>
          <div className="v">{records.filter((r) => r.status === 'Under review').length}</div>
          <div className="d">Awaiting sign-off</div>
        </div>
        <div className="card stat">
          <div className="k"><i>{ic('check', 16)}</i>Published</div>
          <div className="v">{records.filter((r) => r.status === 'Published').length}</div>
          <div className="d up">Current active standard</div>
        </div>
      </div>

      {/* Table Card */}
      <div className="card mt rv">
        <div className="toolbar rtools flex flex-wrap items-center gap-3 p-4 border-b border-[var(--line)]">
          <label className="search flex-1 min-w-[200px] max-w-sm flex items-center gap-2 bg-[var(--surface-2)] px-3 py-1.5 rounded-lg border border-[var(--line)]">
            {ic('search', 15)}
            <input
              className="bg-transparent border-0 outline-hidden text-xs w-full"
              type="search"
              placeholder="Search employee handbook"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>

          <select
            className="input text-xs py-1.5 px-3 rounded-lg border border-[var(--line)] bg-[var(--surface)]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All statuses</option>
            <option value="Draft">Draft</option>
            <option value="Under review">Under review</option>
            <option value="Published">Published</option>
          </select>

          <label className="check flex items-center gap-2 text-xs ml-auto cursor-pointer">
            <input
              type="checkbox"
              checked={showArchived}
              onChange={(e) => setShowArchived(e.target.checked)}
            />
            <span>Archived ({archivedRecords.length})</span>
          </label>
        </div>

        <div className="table-wrap overflow-x-auto">
          <table className="rtable w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--line)] bg-[var(--surface-2)]">
                <th className="py-2.5 px-4 font-semibold text-[var(--muted)]">VERSION</th>
                <th className="py-2.5 px-4 font-semibold text-[var(--muted)]">TITLE</th>
                <th className="py-2.5 px-4 font-semibold text-[var(--muted)]">EFFECTIVE DATE</th>
                <th className="py-2.5 px-4 font-semibold text-[var(--muted)]">OWNER</th>
                <th className="py-2.5 px-4 font-semibold text-[var(--muted)]">FILE</th>
                <th className="py-2.5 px-4 font-semibold text-[var(--muted)]">STATUS</th>
                <th className="py-2.5 px-4 font-semibold text-[var(--muted)] text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-[var(--line)] hover:bg-[var(--surface-2)] transition-colors">
                  <td className="py-3 px-4 font-bold text-[#D9466F]">v{r.version}</td>
                  <td className="py-3 px-4">
                    <b className="block text-[var(--text)]">{r.title}</b>
                    <span className="text-[11px] text-[var(--muted)] line-clamp-1">{r.changesSummary}</span>
                  </td>
                  <td className="py-3 px-4 text-[var(--muted)]">{r.effectiveDate}</td>
                  <td className="py-3 px-4 text-[var(--text)] font-medium">{r.owner}</td>
                  <td className="py-3 px-4">
                    <span className="filechip inline-flex items-center gap-1.5 px-2 py-1 rounded bg-[var(--surface-2)] border border-[var(--line)] text-[11px] font-mono">
                      {ic('doc', 12)}
                      {r.file}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`pill text-[10px] px-2 py-0.5 rounded-full font-semibold ${r.status === 'Published' ? 'p-ok' : r.status === 'Under review' ? 'p-warn' : 'p-info'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button type="button" className="btn sm ib" title="View details" aria-label={`View ${r.id}`} onClick={() => setViewRecord(r)}>
                        {ic('doc', 14)}
                      </button>
                      {showArchived ? (
                        <button type="button" className="btn sm" onClick={() => setRecords((prev) => prev.map((x) => x.id === r.id ? { ...x, status: 'Draft' } : x))}>
                          {ic('swap', 14)} Restore
                        </button>
                      ) : (
                        <>
                          <button type="button" className="btn sm ib" title="Edit" aria-label={`Edit ${r.id}`} onClick={() => openEditModal(r)}>
                            {ic('edit', 14)}
                          </button>
                          <button type="button" className="btn sm ib bad" title="Delete" aria-label={`Delete ${r.id}`} onClick={() => setRecords((prev) => prev.map((x) => x.id === r.id ? { ...x, status: 'Archived' } : x))}>
                            {ic('trash', 14)}
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="empty p-8 text-center text-xs text-[var(--muted)]">
              No handbook records match these filters. Use <b>Add handbook version</b> to create a new revision.
            </div>
          )}
        </div>

        <div className="rfoot flex items-center justify-between p-3 border-t border-[var(--line)] text-xs text-[var(--muted)]">
          <span>{filtered.length} of {showArchived ? archivedRecords.length : records.length} shown</span>
          <span>Saved in this browser · last saved today</span>
        </div>
      </div>

      {/* Add / Edit Form Modal */}
      {isFormOpen && (
        <>
          <div className="scrim on fixed inset-0 bg-black/40 z-40" onClick={() => setIsFormOpen(false)} />
          <div className="modal on fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--surface)] p-6 rounded-2xl border border-[var(--line)] shadow-xl z-50 w-full max-w-lg">
            <h2 className="text-lg font-bold font-heading mb-4 text-[var(--text)]">
              {editingRecord ? `Edit Handbook v${editingRecord.version}` : 'Add handbook version'}
            </h2>
            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="font-semibold text-[var(--muted)] block mb-1">Version *</span>
                  <input className="input w-full" value={formVer} onChange={(e) => setFormVer(e.target.value)} placeholder="e.g. 4.0" required />
                </label>
                <label className="block">
                  <span className="font-semibold text-[var(--muted)] block mb-1">Effective Date *</span>
                  <input className="input w-full" type="date" value={formEff} onChange={(e) => setFormEff(e.target.value)} required />
                </label>
              </div>

              <label className="block">
                <span className="font-semibold text-[var(--muted)] block mb-1">Title *</span>
                <input className="input w-full" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} required />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="font-semibold text-[var(--muted)] block mb-1">Owner</span>
                  <input className="input w-full" value={formOwner} onChange={(e) => setFormOwner(e.target.value)} />
                </label>
                <label className="block">
                  <span className="font-semibold text-[var(--muted)] block mb-1">Status</span>
                  <select className="input w-full" value={formStatus} onChange={(e) => setFormStatus(e.target.value as HandbookRecord['status'])}>
                    <option value="Draft">Draft</option>
                    <option value="Under review">Under review</option>
                    <option value="Published">Published</option>
                    <option value="Archived">Archived</option>
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="font-semibold text-[var(--muted)] block mb-1">Summary of changes</span>
                <textarea className="input w-full" rows={3} value={formChanges} onChange={(e) => setFormChanges(e.target.value)} placeholder="What changed in this revision..." />
              </label>

              <div className="flex justify-end gap-2 pt-3 border-t border-[var(--line)]">
                <button type="button" className="btn" onClick={() => setIsFormOpen(false)}>Cancel</button>
                <button type="submit" className="btn primary" style={{ background: '#D9466F', borderColor: '#D9466F' }}>Save version</button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Details View Modal */}
      {viewRecord && (
        <>
          <div className="scrim on fixed inset-0 bg-black/40 z-40" onClick={() => setViewRecord(null)} />
          <div className="modal on fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--surface)] p-6 rounded-2xl border border-[var(--line)] shadow-xl z-50 w-full max-w-md">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--line)] mb-4">
              <h2 className="text-base font-bold font-heading">{viewRecord.title}</h2>
              <button className="text-muted hover:text-[var(--text)]" onClick={() => setViewRecord(null)} aria-label="Close">{ic('x', 14)}</button>
            </div>
            <div className="space-y-2 text-xs">
              <div><span className="text-[var(--muted)]">Version:</span> <b>v{viewRecord.version}</b></div>
              <div><span className="text-[var(--muted)]">Effective date:</span> <b>{viewRecord.effectiveDate}</b></div>
              <div><span className="text-[var(--muted)]">Owner:</span> <b>{viewRecord.owner}</b></div>
              <div><span className="text-[var(--muted)]">File:</span> <span className="font-mono">{viewRecord.file}</span></div>
              <div><span className="text-[var(--muted)]">Status:</span> <span className="pill p-ok">{viewRecord.status}</span></div>
              <div className="mt-3 p-3 rounded-lg bg-[var(--surface-2)] border border-[var(--line)]">
                <strong className="block mb-1 text-[var(--text)]">Changes:</strong>
                <p className="text-[var(--muted)]">{viewRecord.changesSummary}</p>
              </div>
            </div>
            <div className="flex justify-end mt-4 pt-3 border-t border-[var(--line)]">
              <button className="btn sm" onClick={() => setViewRecord(null)}>Close</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EmployeeHandbookPage;
