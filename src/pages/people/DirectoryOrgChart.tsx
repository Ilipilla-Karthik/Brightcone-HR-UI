import React, { useState } from 'react';
import { ic } from '../../components/icons';

interface OrgNode {
  id: string;
  name: string;
  role: string;
  dept: string;
  reports?: OrgNode[];
}

const ORG_DATA: OrgNode = {
  id: 'BC-1001',
  name: 'Naresh Vemparala',
  role: 'Founder & CEO',
  dept: 'Leadership',
  reports: [
    {
      id: 'BC-1004',
      name: 'Ananya Rao',
      role: 'People Ops Lead',
      dept: 'People Ops',
      reports: [
        { id: 'BC-1080', name: 'Tanvi Shah', role: 'HR Specialist', dept: 'People Ops' },
        { id: 'BC-1081', name: 'Kunal Mehra', role: 'Talent Acquisition Partner', dept: 'People Ops' },
      ],
    },
    {
      id: 'BC-1031',
      name: 'Vikram Malhotra',
      role: 'Head of Engineering',
      dept: 'Engineering',
      reports: [
        { id: 'BC-1020', name: 'Rahul Varma', role: 'Backend Engineer', dept: 'Engineering' },
        { id: 'BC-1025', name: 'Priya Sharma', role: 'Senior Frontend Engineer', dept: 'Engineering' },
        { id: 'BC-1071', name: 'Deepak S', role: 'DevOps Engineer', dept: 'Engineering' },
        { id: 'BC-1060', name: 'Rohan Verma', role: 'Associate QA Engineer', dept: 'Engineering' },
      ],
    },
    {
      id: 'BC-1012',
      name: 'Karthik Reddy',
      role: 'Principal AI Engineer',
      dept: 'AI Research',
      reports: [
        { id: 'BC-1088', name: 'Arjun Das', role: 'ML Research Scientist', dept: 'AI Research' },
        { id: 'BC-1065', name: 'Meera Nambiar', role: 'Product Designer', dept: 'Product' },
      ],
    },
    {
      id: 'BC-1044',
      name: 'Sneha Patel',
      role: 'Head of Finance',
      dept: 'Finance',
      reports: [
        { id: 'BC-1090', name: 'Varun Nair', role: 'Senior Financial Analyst', dept: 'Finance' },
      ],
    },
    {
      id: 'BC-1052',
      name: 'Amit Joshi',
      role: 'Head of Sales',
      dept: 'Sales',
      reports: [
        { id: 'BC-1095', name: 'Neha Gupta', role: 'Account Executive', dept: 'Sales' },
      ],
    },
  ],
};

export const DirectoryOrgChart: React.FC = () => {
  const [activeDept, setActiveDept] = useState('All');
  const [selectedNode, setSelectedNode] = useState<OrgNode | null>(null);

  const depts = ['All', 'Leadership', 'People Ops', 'Engineering', 'AI Research', 'Finance', 'Sales'];

  const renderCard = (node: OrgNode, isLead = false) => {
    const isVisible = activeDept === 'All' || node.dept === activeDept || isLead;
    return (
      <div
        key={node.id}
        onClick={() => setSelectedNode(node)}
        className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-2xs hover:shadow-md ${
          isVisible ? 'bg-[var(--surface)] border-[var(--line)]' : 'bg-[var(--surface-2)]/40 border-dashed border-[var(--line)] opacity-40'
        } ${isLead ? 'w-64 mx-auto ring-2 ring-[#12A58E]/40' : 'w-56'}`}
      >
        <div className="flex items-center gap-3">
          <span
            className="w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs"
            style={{ background: isLead ? '#0E1730' : '#12A58E' }}
          >
            {node.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </span>
          <div className="min-w-0 flex-1">
            <b className="block text-xs font-semibold text-[var(--text)] truncate">{node.name}</b>
            <span className="block text-[11px] text-[var(--muted)] truncate">{node.role}</span>
          </div>
        </div>
        <div className="mt-3 pt-2.5 border-t border-[var(--line)] flex items-center justify-between text-[10px] text-[var(--muted)]">
          <span className="font-medium px-2 py-0.5 rounded-md bg-[var(--surface-2)]">{node.dept}</span>
          <span>{node.reports ? `${node.reports.length} Direct Reports` : 'Individual Contributor'}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--line)]">
        <div>
          <h1 className="text-2xl font-bold font-['Sora'] tracking-tight text-[var(--text)]">Organization Chart</h1>
          <p className="text-sm text-[var(--muted)] mt-1">Hierarchical reporting lines and departmental structure.</p>
        </div>
        <div className="flex items-center gap-2">
          {depts.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setActiveDept(d)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                activeDept === d ? 'bg-[#12A58E] text-white shadow-xs' : 'bg-[var(--surface)] border border-[var(--line)] text-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Chart Hierarchy */}
      <div className="space-y-10 py-6 overflow-x-auto">
        {/* Tier 1: CEO */}
        <div className="flex justify-center">{renderCard(ORG_DATA, true)}</div>

        {/* Connecting line */}
        <div className="w-0.5 h-6 bg-[var(--line)] mx-auto" />

        {/* Tier 2: Leads */}
        <div className="flex flex-wrap justify-center gap-6">
          {ORG_DATA.reports?.map((lead) => (
            <div key={lead.id} className="flex flex-col items-center space-y-4">
              {renderCard(lead)}
              {/* Connecting line to reports */}
              {lead.reports && lead.reports.length > 0 && (
                <>
                  <div className="w-0.5 h-4 bg-[var(--line)]" />
                  <div className="flex flex-col gap-3">
                    {lead.reports.map((sub) => renderCard(sub))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Selected Node Details Modal */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl max-w-sm w-full p-6 shadow-2xl relative">
            <button type="button" onClick={() => setSelectedNode(null)} className="absolute top-4 right-4 text-[var(--muted)] hover:text-[var(--text)]">
              {ic('x', 18)}
            </button>
            <div className="flex items-center gap-3 pb-3 border-b border-[var(--line)]">
              <span className="w-12 h-12 rounded-2xl bg-[#12A58E] text-white flex items-center justify-center font-bold text-base">
                {selectedNode.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </span>
              <div>
                <b className="font-['Sora'] text-base text-[var(--text)] block">{selectedNode.name}</b>
                <span className="text-xs text-[var(--muted)]">{selectedNode.role}</span>
              </div>
            </div>
            <div className="py-3 text-xs space-y-2">
              <p><span className="text-[var(--muted)]">Employee Code:</span> <b>{selectedNode.id}</b></p>
              <p><span className="text-[var(--muted)]">Department:</span> <b>{selectedNode.dept}</b></p>
              <p><span className="text-[var(--muted)]">Direct Reports:</span> <b>{selectedNode.reports ? selectedNode.reports.length : 0}</b></p>
            </div>
            <button type="button" onClick={() => setSelectedNode(null)} className="btn w-full mt-2 text-xs font-semibold py-2 border border-[var(--line)] rounded-xl hover:bg-[var(--surface-2)]">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DirectoryOrgChart;
