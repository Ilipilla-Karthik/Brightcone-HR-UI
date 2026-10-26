import React, { useState, useEffect } from 'react';
import { ic } from '../../components/icons';
import { fetchDocuments } from '../../services/peopleApi';

interface DocumentRecord {
  id: string;
  title: string;
  type: 'Employment Contract' | 'Identity Proof' | 'Tax Declaration' | 'Non-Disclosure' | 'Degree Certificate';
  employeeName: string;
  employeeId: string;
  uploadDate: string;
  size: string;
  status: 'Verified' | 'Pending Review';
}

export const EmployeeDocuments: React.FC = () => {
  const [docs, setDocs] = useState<DocumentRecord[]>([]);
  const [filterType, setFilterType] = useState('All');
  const [search, setSearch] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [newDoc, setNewDoc] = useState({ title: '', type: 'Employment Contract' as const, employeeName: 'Rahul Varma' });

  useEffect(() => {
    fetchDocuments()
      .then((data) => {
        const list = Array.isArray(data) ? data : (data as any)?.value || [];
        const mapped: DocumentRecord[] = list.map((d: any, i: number) => ({
          id: String(d.id || i + 1),
          title: d.title || 'Official Document',
          type: (d.document_type || 'Employment Contract') as any,
          employeeName: d.employee_code === 'BC-1001' ? 'Naresh Vemparala' : 'Rahul Varma',
          employeeId: d.employee_code || `BC-100${i + 1}`,
          uploadDate: d.issued_date || '2026-10-01',
          size: d.file_size || '240 KB',
          status: 'Verified',
        }));
        setDocs(mapped);
      })
      .catch(() => {
        setDocs([]);
      });
  }, []);

  const types = ['All', 'Employment Contract', 'Identity Proof', 'Tax Declaration', 'Non-Disclosure', 'Degree Certificate'];

  const filtered = docs.filter((d) => {
    const q = search.toLowerCase();
    const matchSearch = !search || d.title.toLowerCase().includes(q) || d.employeeName.toLowerCase().includes(q) || d.employeeId.toLowerCase().includes(q);
    const matchType = filterType === 'All' || d.type === filterType;
    return matchSearch && matchType;
  });

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.title) return;
    const item: DocumentRecord = {
      id: `doc-${Date.now()}`,
      title: newDoc.title,
      type: newDoc.type,
      employeeName: newDoc.employeeName,
      employeeId: 'BC-1020',
      uploadDate: new Date().toISOString().split('T')[0],
      size: '950 KB',
      status: 'Pending Review',
    };
    setDocs([item, ...docs]);
    setIsUploadOpen(false);
    setNewDoc({ title: '', type: 'Employment Contract', employeeName: 'Rahul Varma' });
  };

  const handleDownload = (title: string) => {
    const content = `Brightcone Document Vault\nDocument: ${title}\nGenerated: ${new Date().toISOString()}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}.txt`;
    a.click();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--line)]">
        <div>
          <h1 className="text-2xl font-bold font-['Sora'] tracking-tight text-[var(--text)]">Employee Documents</h1>
          <p className="text-sm text-[var(--muted)] mt-1">Official letters, contracts, compliance filings, and identity proofs.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsUploadOpen(true)}
          className="btn primary text-xs font-semibold px-4 py-2 flex items-center gap-1.5 rounded-xl text-white shadow-sm"
          style={{ background: '#12A58E' }}
        >
          {ic('upload', 14)} Upload Document
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-2xs">
          <p className="text-xs text-[var(--muted)] font-medium">Archived Documents</p>
          <p className="text-2xl font-bold font-['Sora'] text-[var(--text)] mt-1">{docs.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-2xs">
          <p className="text-xs text-[var(--muted)] font-medium">Verified Records</p>
          <p className="text-2xl font-bold font-['Sora'] text-[#15A36B] mt-1">{docs.filter((d) => d.status === 'Verified').length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-2xs">
          <p className="text-xs text-[var(--muted)] font-medium">Pending Review</p>
          <p className="text-2xl font-bold font-['Sora'] text-[#E07A1D] mt-1">{docs.filter((d) => d.status === 'Pending Review').length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-2xs">
          <p className="text-xs text-[var(--muted)] font-medium">Encryption Standard</p>
          <p className="text-2xl font-bold font-['Sora'] text-[#0B6FDB] mt-1">AES-256</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-2xs">
        <div className="flex items-center gap-2 w-full md:w-80 px-3 py-1.5 rounded-xl bg-[var(--surface-2)] border border-[var(--line)]">
          {ic('search', 15)}
          <input
            type="text"
            placeholder="Search by title, employee or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-xs text-[var(--text)] focus:outline-none w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] text-xs text-[var(--text)] focus:outline-none cursor-pointer"
          >
            {types.map((t) => (<option key={t} value={t}>{t === 'All' ? 'All Document Types' : t}</option>))}
          </select>
        </div>
      </div>

      {/* Document Table */}
      <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-2xs overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--surface-2)] border-b border-[var(--line)] text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Document Title</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Employee</th>
              <th className="py-3 px-4">Upload Date</th>
              <th className="py-3 px-4">File Size</th>
              <th className="py-3 px-4">Verification</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]">
            {filtered.map((d) => (
              <tr key={d.id} className="hover:bg-[var(--surface-2)]/50 transition-colors">
                <td className="py-3 px-4 font-semibold text-xs text-[var(--text)] flex items-center gap-2">
                  <span className="text-[var(--muted)]">{ic('doc', 16)}</span>
                  {d.title}
                </td>
                <td className="py-3 px-4 text-xs text-[var(--muted)]">{d.type}</td>
                <td className="py-3 px-4 text-xs font-medium text-[var(--text)]">{d.employeeName} <span className="font-mono text-[11px] text-[var(--muted)]">({d.employeeId})</span></td>
                <td className="py-3 px-4 text-xs font-mono text-[var(--muted)]">{d.uploadDate}</td>
                <td className="py-3 px-4 text-xs text-[var(--muted)]">{d.size}</td>
                <td className="py-3 px-4">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    d.status === 'Verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {d.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => handleDownload(d.title)}
                    className="text-xs text-[#12A58E] font-semibold hover:underline flex items-center gap-1 ml-auto"
                  >
                    {ic('download', 13)} Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-[var(--muted)]">No employee documents found. Click "Upload Document" to add records.</div>
        )}
      </div>

      {/* Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <form onSubmit={handleUpload} className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-['Sora'] text-lg font-bold text-[var(--text)]">Upload Employee Document</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-[var(--text)] mb-1">Document Title</label>
                <input required type="text" placeholder="e.g. Identity Proof - Aditi Rao" value={newDoc.title} onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] text-[var(--text)] focus:outline-none" />
              </div>
              <div>
                <label className="block font-medium text-[var(--text)] mb-1">Document Type</label>
                <select value={newDoc.type} onChange={(e) => setNewDoc({ ...newDoc, type: e.target.value as any })} className="w-full px-3 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] text-[var(--text)] focus:outline-none">
                  <option value="Employment Contract">Employment Contract</option>
                  <option value="Identity Proof">Identity Proof</option>
                  <option value="Tax Declaration">Tax Declaration</option>
                  <option value="Non-Disclosure">Non-Disclosure</option>
                  <option value="Degree Certificate">Degree Certificate</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-[var(--text)] mb-1">Associated Employee</label>
                <input required type="text" value={newDoc.employeeName} onChange={(e) => setNewDoc({ ...newDoc, employeeName: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] text-[var(--text)] focus:outline-none" />
              </div>
              <div className="p-4 border-2 border-dashed border-[var(--line)] rounded-xl text-center text-[var(--muted)]">
                <span className="block mx-auto mb-1">{ic('upload', 24)}</span>
                <span className="text-xs">Drag & drop document file (PDF, PNG up to 10MB)</span>
              </div>
            </div>
            <div className="pt-2 flex justify-end gap-2 border-t border-[var(--line)]">
              <button type="button" onClick={() => setIsUploadOpen(false)} className="btn text-xs font-semibold px-4 py-2 border border-[var(--line)] rounded-xl hover:bg-[var(--surface-2)]">Cancel</button>
              <button type="submit" className="btn primary text-xs font-semibold px-4 py-2 rounded-xl text-white shadow-sm" style={{ background: '#12A58E' }}>Upload & Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default EmployeeDocuments;
