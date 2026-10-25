import React, { useState } from 'react';
import { ic } from '../../components/icons';

interface JobRequisition {
  id: string;
  title: string;
  department: string;
  openings: number;
  applicants: number;
  location: string;
  experience: string;
  status: 'Published' | 'Draft' | 'Closed';
  createdDate: string;
}

const DEFAULT_JOBS: JobRequisition[] = [
  { id: 'JOB-201', title: 'Staff Rust Systems Engineer', department: 'Engineering', openings: 2, applicants: 18, location: 'Hyderabad (Hybrid)', experience: '5-8 yrs', status: 'Published', createdDate: '2026-10-01' },
  { id: 'JOB-202', title: 'Senior Frontend Engineer (React/TypeScript)', department: 'Engineering', openings: 2, applicants: 26, location: 'Hyderabad / Bengaluru', experience: '4-7 yrs', status: 'Published', createdDate: '2026-10-05' },
  { id: 'JOB-203', title: 'Applied AI Research Scientist', department: 'AI Research', openings: 1, applicants: 14, location: 'Hyderabad', experience: '3-6 yrs', status: 'Published', createdDate: '2026-10-10' },
  { id: 'JOB-204', title: 'DevOps & Site Reliability Engineer', department: 'Engineering', openings: 1, applicants: 9, location: 'Hyderabad', experience: '4-8 yrs', status: 'Published', createdDate: '2026-10-12' },
  { id: 'JOB-205', title: 'Technical Product Manager', department: 'Product', openings: 1, applicants: 11, location: 'Bengaluru', experience: '5-8 yrs', status: 'Published', createdDate: '2026-10-15' },
  { id: 'JOB-206', title: 'Enterprise Sales Director', department: 'Sales', openings: 1, applicants: 4, location: 'Delhi NCR', experience: '8-12 yrs', status: 'Draft', createdDate: '2026-10-20' },
];

export const RecruitAdminPage: React.FC = () => {
  const [jobs, setJobs] = useState<JobRequisition[]>(DEFAULT_JOBS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newJob, setNewJob] = useState({ title: '', department: 'Engineering', openings: 1, location: 'Hyderabad (Hybrid)', experience: '3-5 yrs' });

  const filtered = jobs.filter((j) => {
    const matchSearch = !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.department.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || j.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJob.title) return;
    const item: JobRequisition = {
      id: `JOB-${200 + jobs.length + 1}`,
      title: newJob.title,
      department: newJob.department,
      openings: Number(newJob.openings) || 1,
      applicants: 0,
      location: newJob.location,
      experience: newJob.experience,
      status: 'Published',
      createdDate: new Date().toISOString().split('T')[0],
    };
    setJobs([item, ...jobs]);
    setIsModalOpen(false);
    setNewJob({ title: '', department: 'Engineering', openings: 1, location: 'Hyderabad (Hybrid)', experience: '3-5 yrs' });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--line)]">
        <div>
          <h1 className="text-2xl font-bold font-['Sora'] tracking-tight text-[var(--text)]">Jobs & Requisitions</h1>
          <p className="text-sm text-[var(--muted)] mt-1">Open job postings, talent pipelines, and applicant tracking management.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="btn primary text-xs font-semibold px-4 py-2 flex items-center gap-1.5 rounded-xl text-white shadow-sm"
          style={{ background: '#7C5CFF' }}
        >
          {ic('plus', 14)} Create Job Opening
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-2xs">
        <div className="flex items-center gap-2 w-full md:w-80 px-3 py-1.5 rounded-xl bg-[var(--surface-2)] border border-[var(--line)]">
          {ic('search', 15)}
          <input
            type="text"
            placeholder="Search job postings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-xs text-[var(--text)] focus:outline-none w-full"
          />
        </div>
        <div className="flex gap-2">
          {['All', 'Published', 'Draft', 'Closed'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors ${
                statusFilter === s ? 'bg-[#7C5CFF] text-white' : 'bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Table */}
      <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-2xs overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--surface-2)] border-b border-[var(--line)] text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Requisition</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Openings</th>
              <th className="py-3 px-4">Applicants</th>
              <th className="py-3 px-4">Experience</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]">
            {filtered.map((j) => (
              <tr key={j.id} className="hover:bg-[var(--surface-2)]/50 transition-colors">
                <td className="py-3 px-4">
                  <b className="block text-xs font-semibold text-[var(--text)]">{j.title}</b>
                  <span className="block text-[11px] font-mono text-[var(--muted)]">{j.id} · Posted {j.createdDate}</span>
                </td>
                <td className="py-3 px-4 text-xs font-medium text-[var(--text)]">{j.department}</td>
                <td className="py-3 px-4 text-xs font-mono font-semibold text-[var(--text)]">{j.openings}</td>
                <td className="py-3 px-4 text-xs font-mono font-semibold text-[#7C5CFF]">{j.applicants} Candidates</td>
                <td className="py-3 px-4 text-xs text-[var(--muted)]">{j.experience}</td>
                <td className="py-3 px-4 text-xs text-[var(--muted)]">{j.location}</td>
                <td className="py-3 px-4">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                    j.status === 'Published' ? 'bg-emerald-100 text-emerald-700' :
                    j.status === 'Draft' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {j.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <form onSubmit={handlePost} className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-['Sora'] text-lg font-bold text-[var(--text)]">Create Job Requisition</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-[var(--text)] mb-1">Position Title</label>
                <input required type="text" placeholder="e.g. Senior Backend Engineer" value={newJob.title} onChange={(e) => setNewJob({ ...newJob, title: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] text-[var(--text)] focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[var(--text)] mb-1">Department</label>
                  <select value={newJob.department} onChange={(e) => setNewJob({ ...newJob, department: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] text-[var(--text)] focus:outline-none">
                    <option value="Engineering">Engineering</option>
                    <option value="AI Research">AI Research</option>
                    <option value="Product">Product</option>
                    <option value="People Ops">People Ops</option>
                    <option value="Sales">Sales</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-[var(--text)] mb-1">Openings</label>
                  <input type="number" min="1" max="10" value={newJob.openings} onChange={(e) => setNewJob({ ...newJob, openings: Number(e.target.value) })} className="w-full px-3 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] text-[var(--text)] focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[var(--text)] mb-1">Location</label>
                  <input type="text" value={newJob.location} onChange={(e) => setNewJob({ ...newJob, location: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] text-[var(--text)] focus:outline-none" />
                </div>
                <div>
                  <label className="block font-medium text-[var(--text)] mb-1">Experience</label>
                  <input type="text" value={newJob.experience} onChange={(e) => setNewJob({ ...newJob, experience: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] text-[var(--text)] focus:outline-none" />
                </div>
              </div>
            </div>
            <div className="pt-2 flex justify-end gap-2 border-t border-[var(--line)]">
              <button type="button" onClick={() => setIsModalOpen(false)} className="btn text-xs font-semibold px-4 py-2 border border-[var(--line)] rounded-xl hover:bg-[var(--surface-2)]">Cancel</button>
              <button type="submit" className="btn primary text-xs font-semibold px-4 py-2 rounded-xl text-white shadow-sm" style={{ background: '#7C5CFF' }}>Publish Opening</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default RecruitAdminPage;
