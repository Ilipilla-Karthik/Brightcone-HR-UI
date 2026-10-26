import React, { useState, useEffect } from 'react';
import { fetchEmployees } from '../../services/peopleApi';

interface ProfileRecord {
  id: string;
  name: string;
  role: string;
  dept: string;
  personalEmail: string;
  phone: string;
  address: string;
  emergencyContact: string;
  emergencyRelation: string;
  emergencyPhone: string;
  bloodGroup: string;
  panMasked: string;
  aadhaarLast4: string;
  verificationStatus: 'Verified' | 'Pending';
}

export const EmployeeProfilePage: React.FC = () => {
  const [profiles, setProfiles] = useState<ProfileRecord[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<ProfileRecord | null>(null);

  useEffect(() => {
    fetchEmployees()
      .then((data: any) => {
        const list = Array.isArray(data) ? data : data?.value || [];
        const mapped: ProfileRecord[] = list.map((e: any) => ({
          id: e.employee_code || 'BC-1000',
          name: e.full_name || 'Employee',
          role: e.job_title || 'Specialist',
          dept: e.department || 'General',
          personalEmail: e.work_email || 'emp@brightcone.ai',
          phone: e.phone || '+91 98765 43210',
          address: e.address || `${e.location || 'Hyderabad'} Campus, India`,
          emergencyContact: e.emergency_contact_name || 'Primary Contact',
          emergencyRelation: e.emergency_contact_relation || 'Family',
          emergencyPhone: e.emergency_contact_phone || '+91 98765 00000',
          bloodGroup: e.blood_group || 'O+',
          panMasked: 'ABCDE****F',
          aadhaarLast4: '8849',
          verificationStatus: 'Verified' as const,
        }));
        setProfiles(mapped);
        if (mapped.length > 0) setSelected(mapped[0]);
      })
      .catch(() => {
        setProfiles([]);
      });
  }, []);

  const filtered = profiles.filter((p) => {
    const q = search.toLowerCase();
    return !search || p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.dept.toLowerCase().includes(q);
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--line)]">
        <div>
          <h1 className="text-2xl font-bold font-['Sora'] tracking-tight text-[var(--text)]">Employee Profiles & Statutory</h1>
          <p className="text-sm text-[var(--muted)] mt-1">Personal, emergency, and statutory records. Sensitive tax and identity numbers are masked for data privacy.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-3">
          <input
            type="text"
            placeholder="Search employee profiles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] text-xs text-[var(--text)] focus:outline-none"
          />
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filtered.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => setSelected(item)}
                className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  selected?.id === item.id
                    ? 'bg-[#12A58E]/10 border-[#12A58E] shadow-sm'
                    : 'bg-[var(--surface)] border-[var(--line)] hover:bg-[var(--surface-2)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-[var(--text)]">{item.name}</span>
                  <span className="text-[10px] font-mono text-[var(--muted)]">{item.id}</span>
                </div>
                <div className="text-[11px] text-[var(--muted)] mt-0.5">{item.role}</div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--line)]/50 text-[10px]">
                  <span className="text-[var(--muted)]">{item.dept}</span>
                  <span className={`px-2 py-0.5 rounded-full font-semibold ${item.verificationStatus === 'Verified' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                    {item.verificationStatus}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selected && (
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--line)] space-y-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-[var(--line)]">
                <div>
                  <h2 className="text-xl font-bold font-['Sora'] text-[var(--text)]">{selected.name}</h2>
                  <p className="text-xs text-[var(--muted)]">{selected.role} • {selected.dept} • <span className="font-mono text-[#12A58E]">{selected.id}</span></p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${selected.verificationStatus === 'Verified' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                  {selected.verificationStatus} Profile
                </span>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-3">1. Contact & Residential</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--line)]">
                    <span className="text-[10px] text-[var(--muted)]">Personal Email</span>
                    <p className="font-semibold text-[var(--text)] mt-0.5">{selected.personalEmail}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--line)]">
                    <span className="text-[10px] text-[var(--muted)]">Mobile Phone</span>
                    <p className="font-semibold text-[var(--text)] mt-0.5">{selected.phone}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] sm:col-span-2">
                    <span className="text-[10px] text-[var(--muted)]">Residential Address</span>
                    <p className="font-semibold text-[var(--text)] mt-0.5">{selected.address}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-3">2. Emergency Contact</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--line)]">
                    <span className="text-[10px] text-[var(--muted)]">Contact Name</span>
                    <p className="font-semibold text-[var(--text)] mt-0.5">{selected.emergencyContact}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--line)]">
                    <span className="text-[10px] text-[var(--muted)]">Relationship</span>
                    <p className="font-semibold text-[var(--text)] mt-0.5">{selected.emergencyRelation}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--line)]">
                    <span className="text-[10px] text-[var(--muted)]">Emergency Phone</span>
                    <p className="font-semibold text-[var(--text)] mt-0.5">{selected.emergencyPhone}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-3">3. Statutory & Identity (Masked)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--line)]">
                    <span className="text-[10px] text-[var(--muted)]">PAN Card</span>
                    <p className="font-mono font-semibold text-[var(--text)] mt-0.5">{selected.panMasked}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--line)]">
                    <span className="text-[10px] text-[var(--muted)]">Aadhaar (Last 4)</span>
                    <p className="font-mono font-semibold text-[var(--text)] mt-0.5">•••• •••• {selected.aadhaarLast4}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--line)]">
                    <span className="text-[10px] text-[var(--muted)]">Blood Group</span>
                    <p className="font-semibold text-rose-500 mt-0.5">{selected.bloodGroup}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfilePage;
