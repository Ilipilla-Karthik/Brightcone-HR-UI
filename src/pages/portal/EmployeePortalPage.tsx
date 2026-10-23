import React, { useState } from 'react';
import {
  Sidebar,
  PageHeader,
  StatCard,
  PrimaryButton,
} from '../../components/common/EmployeePortalComponents';

export const EmployeePortalPage: React.FC = () => {
  const [activePage, setActivePage] = useState('Dashboard');
  const [clockedIn, setClockedIn] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F4F6FB] text-[#0E1730]">
      {/* 1. Sidebar */}
      <div className="w-[248px] shrink-0 h-full">
        <Sidebar activePage={activePage} onNavigate={setActivePage} />
      </div>

      {/* 2. Main content area with PageHeader */}
      <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
        <PageHeader />

        <main className="flex-1 overflow-y-auto p-7">
          {activePage === 'Dashboard' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-['Sora'] text-2xl font-semibold text-[#0E1730]">
                    Welcome back, Karthik!
                  </h1>
                  <p className="mt-1 text-sm text-[#5B6787]">
                    Here is what is happening with your workspace today.
                  </p>
                </div>
                <div className="flex gap-2">
                  <PrimaryButton
                    onClick={() => {
                      setClockedIn(!clockedIn);
                      showToast(clockedIn ? 'Clocked out successfully' : 'Clocked in at 09:30 AM');
                    }}
                  >
                    {clockedIn ? 'Clock Out' : 'Clock In Now'}
                  </PrimaryButton>
                </div>
              </div>

              {/* StatCards grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                  label="Available Leave Balance"
                  value="18 Days"
                  detail="12 Paid · 4 Casual · 2 Sick"
                />
                <StatCard
                  label="Logged Hours This Week"
                  value="36.5 Hrs"
                  detail="Target: 40 hrs (91% complete)"
                />
                <StatCard
                  label="Pending Approvals"
                  value="1 Request"
                  detail="WFH on Friday, Oct 30"
                />
              </div>

              {/* Quick Overview Card */}
              <div className="rounded-2xl border border-[#E3E8F2] bg-white p-5 shadow-[0_1px_2px_rgba(14,23,48,0.06),0_8px_24px_-12px_rgba(14,23,48,0.12)]">
                <h3 className="font-['Sora'] text-base font-semibold text-[#0E1730] mb-3">
                  Today's Shift & Activities
                </h3>
                <div className="divide-y divide-[#E3E8F2] text-sm">
                  <div className="py-2.5 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[#0E1730]">General Engineering Shift</p>
                      <p className="text-xs text-[#5B6787]">09:30 AM – 06:30 PM (IST)</p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-[#E3F6EE] px-2.5 py-0.5 text-xs font-semibold text-[#15A36B]">
                      On Duty
                    </span>
                  </div>
                  <div className="py-2.5 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[#0E1730]">DocSign Envelope Signed</p>
                      <p className="text-xs text-[#5B6787]">Mutual NDA completed electronically</p>
                    </div>
                    <span className="text-xs text-[#5B6787]">Completed</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activePage === 'My Profile' && (
            <div className="max-w-3xl space-y-5">
              <h1 className="font-['Sora'] text-2xl font-semibold text-[#0E1730]">
                My Profile
              </h1>
              <div className="rounded-2xl border border-[#E3E8F2] bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4 border-b border-[#E3E8F2] pb-5">
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-[#0B6FDB] text-xl font-bold text-white">
                    KS
                  </div>
                  <div>
                    <h2 className="font-['Sora'] text-lg font-semibold text-[#0E1730]">
                      Karthik Reddy
                    </h2>
                    <p className="text-sm text-[#5B6787]">Principal AI Engineer · AI Research</p>
                    <p className="text-xs text-[#8D97B0]">Hyderabad Office</p>
                  </div>
                </div>
                <dl className="grid grid-cols-2 gap-4 pt-4 text-sm">
                  <div>
                    <dt className="text-[#5B6787] text-xs">Email</dt>
                    <dd className="font-medium mt-0.5">karthik.reddy@brightcone.ai</dd>
                  </div>
                  <div>
                    <dt className="text-[#5B6787] text-xs">Employee ID</dt>
                    <dd className="font-medium mt-0.5 font-mono">BC-1012</dd>
                  </div>
                  <div>
                    <dt className="text-[#5B6787] text-xs">Reports To</dt>
                    <dd className="font-medium mt-0.5">Naresh Vemparala (CEO)</dd>
                  </div>
                  <div>
                    <dt className="text-[#5B6787] text-xs">Joining Date</dt>
                    <dd className="font-medium mt-0.5">18 Apr 2022</dd>
                  </div>
                </dl>
              </div>
            </div>
          )}

          {activePage === 'Attendance' && (
            <div className="max-w-4xl space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-['Sora'] text-2xl font-semibold text-[#0E1730]">
                    Daily Attendance & Timings
                  </h1>
                  <p className="text-sm text-[#5B6787] mt-1">
                    Clock-ins, regularisation, and weekly working logs.
                  </p>
                </div>
                <PrimaryButton
                  onClick={() => {
                    setClockedIn(!clockedIn);
                    showToast(clockedIn ? 'Clocked out at 06:30 PM' : 'Clocked in at 09:30 AM');
                  }}
                >
                  {clockedIn ? 'Punch Out' : 'Punch In'}
                </PrimaryButton>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard label="Clock-in Time" value="09:30 AM" detail="On time today" />
                <StatCard label="Today's Duration" value="7h 15m" detail="Standard: 8 hours" />
                <StatCard label="Monthly Attendance" value="100%" detail="22 of 22 working days" />
              </div>
            </div>
          )}

          {activePage === 'Leave Management' && (
            <div className="max-w-4xl space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-['Sora'] text-2xl font-semibold text-[#0E1730]">
                    Leave Management
                  </h1>
                  <p className="text-sm text-[#5B6787] mt-1">
                    Apply for paid leaves, sick leave, or work from home.
                  </p>
                </div>
                <PrimaryButton onClick={() => showToast('Leave application modal opened')}>
                  Apply for Leave
                </PrimaryButton>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard label="Earned Leave" value="12 Days" detail="Carryover up to 30 days" />
                <StatCard label="Casual Leave" value="4 Days" detail="Valid through Dec 2026" />
                <StatCard label="Sick Leave" value="2 Days" detail="Medical proof for >2 days" />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Quick toast message */}
      {toastMsg && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 rounded-xl bg-[#06101F] px-4 py-2.5 text-sm font-medium text-white shadow-xl">
          {toastMsg}
        </div>
      )}
    </div>
  );
};

export default EmployeePortalPage;
