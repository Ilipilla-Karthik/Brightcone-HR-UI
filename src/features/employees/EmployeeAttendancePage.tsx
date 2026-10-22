import React, { useState, useEffect } from 'react';
import { employeesApi } from '../../api/employees.api';
import { EmployeeAttendance } from '../../types/employee.types';
import { Clock, CheckCircle, Fingerprint, Calendar, ArrowRight } from 'lucide-react';

export const EmployeeAttendancePage: React.FC = () => {
  const [records, setRecords] = useState<EmployeeAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchAttendance = async () => {
    try {
      const data = await employeesApi.getAttendance('BC-1038');
      setRecords(data);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePunch = async () => {
    try {
      const res = await employeesApi.punchAttendance('BC-1038');
      setToastMessage(
        res.punch_out
          ? `Punch Out recorded at ${res.punch_out} (${res.work_hours})!`
          : `Punch In recorded at ${res.punch_in}!`
      );
      setTimeout(() => setToastMessage(null), 4000);
      fetchAttendance();
    } catch (err) {
      alert('Failed to record punch: ' + err);
    }
  };

  const todayRecord = records.find((r) => r.date === '2026-10-16');

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-teal-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 text-sm font-semibold animate-bounce">
          <CheckCircle className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <div className="page-badge page-badge-people">
          <span className="page-badge-dot" />
          <span>PEOPLE · ME</span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Attendance & Clock-In
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Record your daily work presence and verify shift hours.
        </p>
      </div>

      {/* Punch Action Card */}
      <div className="stat-card bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border-teal-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-lg shadow-teal-500/25">
              <Fingerprint className="w-8 h-8" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                Live Attendance Terminal
              </div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                {currentTime}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Today: Friday, Oct 16, 2026 · Shift: 09:00 AM – 06:00 PM
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-slate-500">Today's Status</div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                {todayRecord ? (todayRecord.punch_out ? 'Shift Completed' : 'Punched In') : 'Not Checked In'}
              </div>
            </div>

            <button
              onClick={handlePunch}
              className="btn-primary-blue bg-teal-600 hover:bg-teal-700 shadow-teal-600/30 py-3 px-6 text-sm font-bold flex items-center gap-2 cursor-pointer"
            >
              <Clock className="w-4 h-4" />
              <span>{todayRecord && !todayRecord.punch_out ? 'Punch Out' : 'Punch In'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Attendance History Table */}
      <div className="data-table-container">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Recent Attendance Log
          </h3>
        </div>

        <table className="enterprise-table">
          <thead>
            <tr>
              <th>DATE</th>
              <th>PUNCH IN</th>
              <th>PUNCH OUT</th>
              <th>WORK HOURS</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-slate-400">
                  Loading attendance records...
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-slate-400">
                  No attendance records found.
                </td>
              </tr>
            ) : (
              records.map((r) => (
                <tr key={r.id}>
                  <td className="font-semibold text-slate-900 dark:text-white">
                    {r.date}
                  </td>
                  <td className="font-mono text-xs">{r.punch_in}</td>
                  <td className="font-mono text-xs">{r.punch_out || '—'}</td>
                  <td>{r.work_hours}</td>
                  <td>
                    <span className="badge-pill badge-approved">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>{r.status}</span>
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeAttendancePage;
