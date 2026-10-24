import React, { useState, useMemo, useEffect } from 'react';
import { ic } from '../../components/icons';
import { DirectoryEmployee } from './types';
import { fetchConnectDirectory } from '../../services/signConnectApi';
import { mapDirectoryEmployeeFromApi } from './apiMapper';

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

const getAvatarColor = (name: string) => {
  const colors = ['#0B6FDB', '#12A58E', '#7C5CFF', '#D9466F', '#E07A1D', '#0BA6CC', '#6366F1'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

interface TreeNodeProps {
  employee: DirectoryEmployee;
  allEmployees: DirectoryEmployee[];
  onSelect: (emp: DirectoryEmployee) => void;
}

const OrgTreeNode: React.FC<TreeNodeProps> = ({ employee, allEmployees, onSelect }) => {
  const children = allEmployees.filter(
    (e) => e.mgr === employee.name && e.status !== 'Inactive'
  );

  return (
    <li>
      <button
        type="button"
        className="node"
        onClick={() => onSelect(employee)}
      >
        <span
          className="av"
          style={{ backgroundColor: getAvatarColor(employee.name) }}
        >
          {getInitials(employee.name)}
        </span>
        <div className="text-left">
          <b>{employee.name}</b>
          <span>{employee.role}</span>
        </div>
      </button>

      {children.length > 0 && (
        <ul>
          {children.map((child) => (
            <OrgTreeNode
              key={child.id}
              employee={child}
              allEmployees={allEmployees}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

export const DirectoryPage: React.FC = () => {
  const [employees, setEmployees] = useState<DirectoryEmployee[]>([]);

  useEffect(() => {
    fetchConnectDirectory()
      .then((data) => {
        if (data) setEmployees(data.map(mapDirectoryEmployeeFromApi));
      })
      .catch(() => {});
  }, []);
  const [activeTab, setActiveTab] = useState<'People' | 'Org chart'>('People');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<DirectoryEmployee | null>(null);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const departments = useMemo(() => {
    const set = new Set<string>();
    employees.forEach((e) => {
      if (e.dept) set.add(e.dept);
    });
    return Array.from(set);
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return employees.filter((e) => {
      if (e.status === 'Inactive') return false;
      const matchesQuery =
        !q ||
        (e.name + ' ' + e.role + ' ' + e.dept + ' ' + e.loc)
          .toLowerCase()
          .includes(q);
      const matchesDept = !selectedDept || e.dept === selectedDept;
      return matchesQuery && matchesDept;
    });
  }, [employees, searchQuery, selectedDept]);

  const rootEmployees = useMemo(() => {
    return employees.filter((e) => !e.mgr && e.status !== 'Inactive');
  }, [employees]);

  const activeCount = employees.filter((e) => e.status !== 'Inactive').length;

  return (
    <div
      className="view max-w-[1240px] mx-auto"
      style={{ '--ac': '#0BA6CC' } as React.CSSProperties}
    >
      {/* Head */}
      <div className="head">
        <div>
          <h1>People directory</h1>
          <p>{activeCount} people at Brightcone.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs mb-4">
        {(['People', 'Org chart'] as const).map((t) => (
          <button
            key={t}
            type="button"
            className={activeTab === t ? 'on' : ''}
            onClick={() => setActiveTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* People View */}
      {activeTab === 'People' && (
        <>
          <div className="toolbar">
            <div className="search">
              {ic('search', 16)}
              <input
                className="input"
                id="dq"
                placeholder="Search by name, role or team"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="input"
              id="dd"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              <option value="">All departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="people-grid">
            {filteredEmployees.length === 0 ? (
              <div className="empty col-span-full">
                No one matches. Try another name.
              </div>
            ) : (
              filteredEmployees.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  className="pcard"
                  onClick={() => setSelectedEmployee(e)}
                >
                  <div className="who">
                    <span
                      className="av"
                      style={{ backgroundColor: getAvatarColor(e.name) }}
                    >
                      {getInitials(e.name)}
                    </span>
                    <div>
                      <b>{e.name}</b>
                      <span>{e.role}</span>
                    </div>
                  </div>
                  <div className="muted" style={{ fontSize: '13px' }}>
                    {e.dept}, {e.loc}
                  </div>
                </button>
              ))
            )}
          </div>
        </>
      )}

      {/* Org Chart View */}
      {activeTab === 'Org chart' && (
        <div className="card">
          <h3>Organisation chart</h3>
          <div style={{ overflowX: 'auto', padding: '10px 0' }}>
            <ul className="org">
              {rootEmployees.map((root) => (
                <OrgTreeNode
                  key={root.id}
                  employee={root}
                  allEmployees={employees}
                  onSelect={(emp) => setSelectedEmployee(emp)}
                />
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Employee Mini Profile Drawer */}
      <div
        className={`scrim ${selectedEmployee ? 'on' : ''}`}
        onClick={() => setSelectedEmployee(null)}
      />
      <div className={`drawer ${selectedEmployee ? 'on' : ''}`}>
        {selectedEmployee && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[12px] text-[var(--muted)] font-mono">
                {selectedEmployee.id}
              </span>
              <button
                type="button"
                className="icon-btn"
                onClick={() => setSelectedEmployee(null)}
                title="Close"
              >
                {ic('x', 18)}
              </button>
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <span
                className="av lg"
                style={{ backgroundColor: getAvatarColor(selectedEmployee.name) }}
              >
                {getInitials(selectedEmployee.name)}
              </span>
              <div>
                <h2 style={{ fontSize: '20px' }}>{selectedEmployee.name}</h2>
                <div className="muted">{selectedEmployee.role}</div>
              </div>
            </div>

            <dl className="kv">
              <dt>Department</dt>
              <dd>{selectedEmployee.dept}</dd>
              <dt>Reports to</dt>
              <dd>{selectedEmployee.mgr || '—'}</dd>
              <dt>Location</dt>
              <dd>{selectedEmployee.loc}</dd>
              <dt>Email</dt>
              <dd>{selectedEmployee.email}</dd>
              <dt>Phone</dt>
              <dd>{selectedEmployee.phone}</dd>
            </dl>

            <div className="mt">
              <button
                type="button"
                className="btn primary"
                onClick={() => {
                  showToast(
                    `Message sent to ${selectedEmployee.name.split(' ')[0]}`
                  );
                  setSelectedEmployee(null);
                }}
              >
                Send message
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      <div className={`toast ${toastMsg ? 'on' : ''}`}>
        {ic('chat', 18)}
        <span>{toastMsg}</span>
      </div>
    </div>
  );
};

export default DirectoryPage;
