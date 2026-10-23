import React, { useState } from 'react';
import { Modal } from './Modal';
import { employeesApi, type ImportSummary } from '../api/employees';
import { UploadCloud, CheckCircle2, AlertTriangle } from 'lucide-react';

interface ImportCsvModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const SAMPLE_CSV = `Employee ID,Name,Job Title,Department,Grade,Location,Manager,Status
BC-1051,Pooja Hegde,Frontend Engineer,Engineering,L4,Hyderabad,Priya Menon,Active
BC-1052,Manish Malhotra,Brand Designer,Design,L5,Bengaluru,Sneha Iyer,Active`;

export const ImportCsvModal: React.FC<ImportCsvModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [csvContent, setCsvContent] = useState(SAMPLE_CSV);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<ImportSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCsvContent(event.target?.result as string);
        setSummary(null);
        setError(null);
      };
      reader.readAsText(file);
    }
  };

  const handleImport = async () => {
    if (!csvContent.trim()) {
      setError('CSV content cannot be empty.');
      return;
    }

    setLoading(true);
    setError(null);
    setSummary(null);

    try {
      const result = await employeesApi.importCsv(csvContent);
      setSummary(result);
      if (result.success_count > 0) {
        onSuccess();
      }
    } catch (err: any) {
      setError(
        err.response?.data?.description ||
          err.response?.data?.error ||
          'Failed to process CSV import.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Import Employees via CSV"
      subtitle="Validates headers, required fields, and duplicate IDs before insertion"
      maxWidth="lg"
    >
      <div className="space-y-4 text-xs">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {summary && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Import Result Summary
            </div>
            <div className="flex gap-4 text-xs">
              <span className="text-emerald-700 font-semibold">
                ✓ {summary.success_count} inserted
              </span>
              {summary.error_count > 0 && (
                <span className="text-rose-600 font-semibold">
                  ✕ {summary.error_count} failed
                </span>
              )}
            </div>
            {summary.errors.length > 0 && (
              <div className="mt-2 text-rose-600 space-y-1 bg-white p-2.5 rounded-lg border border-rose-100 max-h-32 overflow-y-auto font-mono text-[11px]">
                {summary.errors.map((err, i) => (
                  <div key={i}>{err}</div>
                ))}
              </div>
            )}
          </div>
        )}

        <div>
          <label className="block font-semibold text-slate-700 mb-1.5">
            Upload CSV File or Paste Raw Content
          </label>
          <div className="mb-2">
            <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors">
              <UploadCloud className="w-3.5 h-3.5" />
              Choose .csv file
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
          <textarea
            rows={7}
            value={csvContent}
            onChange={(e) => setCsvContent(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] focus:bg-white focus:border-[#0B6FDB] outline-hidden"
            placeholder="Employee ID,Name,Job Title,Department,Grade,Location,Manager,Status..."
          />
          <p className="mt-1 text-[11px] text-slate-400">
            Required headers: Employee ID, Name, Job Title, Department
          </p>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleImport}
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-[#0B2641] hover:bg-[#071B2F] text-white font-semibold shadow-xs disabled:opacity-50"
          >
            {loading ? 'Validating & Importing...' : 'Run Import'}
          </button>
        </div>
      </div>
    </Modal>
  );
};
