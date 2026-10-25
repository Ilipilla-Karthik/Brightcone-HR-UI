import React, { useState } from 'react';

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

const DEFAULT_PROFILES: ProfileRecord[] = [
  {
    id: 'BC-1001',
    name: 'Naresh Vemparala',
    role: 'Founder & CEO',
    dept: 'Leadership',
    personalEmail: 'naresh.v@gmail.com',
    phone: '+91 98765 43210',
    address: 'Plot 42, Jubilee Hills, Hyderabad',
    emergencyContact: 'Lakshmi Vemparala',
    emergencyRelation: 'Spouse',
    emergencyPhone: '+91 98765 11111',
    bloodGroup: 'O+',
    panMasked: 'ABCDE****F',
    aadhaarLast4: '8849',
    verificationStatus: 'Verified',
  },
  {
    id: 'BC-1004',
    name: 'Ananya Rao',
    role: 'People Ops Lead',
    dept: 'People Ops',
    personalEmail: 'ananya.rao@gmail.com',
    phone: '+91 98765 43211',
    address: 'Tower 3, Hitec City, Hyderabad',
    emergencyContact: 'Kavita Rao',
    emergencyRelation: 'Mother',
    emergencyPhone: '+91 98765 22222',
    bloodGroup: 'B+',
    panMasked: 'BNXPR****K',
    aadhaarLast4: '3410',
    verificationStatus: 'Verified',
  },
  {
    id: 'BC-1012',
    name: 'Karthik Reddy',
    role: 'Principal AI Engineer',
    dept: 'AI Research',
    personalEmail: 'karthik.r@outlook.com',
    phone: '+91 98765 43212',
    address: 'Gachibowli Financial District, Hyderabad',
    emergencyContact: 'Ramesh Reddy',
    emergencyRelation: 'Father',
    emergencyPhone: '+91 98765 33333',
    bloodGroup: 'A+',
    panMasked: 'CRRPK****L',
    aadhaarLast4: '9921',
    verificationStatus: 'Verified',
  },
  {
    id: 'BC-1020',
    name: 'Rahul Varma',
    role: 'Backend Engineer',
    dept: 'Engineering',
    personalEmail: 'rahul.varma@gmail.com',
    phone: '+91 98765 43213',
    address: 'Kondapur, Hyderabad',
    emergencyContact: 'Sunil Varma',
    emergencyRelation: 'Brother',
    emergencyPhone: '+91 98765 44444',
    bloodGroup: 'AB+',
    panMasked: 'DRVMK****M',
    aadhaarLast4: '1092',
    verificationStatus: 'Pending',
  },
];

export const EmployeeProfilePage: React.FC = () => {
  const [profiles] = useState<ProfileRecord[]>(DEFAULT_PROFILES);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<ProfileRecord>(DEFAULT_PROFILES[0]);

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
                  selected.id === item.id
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
