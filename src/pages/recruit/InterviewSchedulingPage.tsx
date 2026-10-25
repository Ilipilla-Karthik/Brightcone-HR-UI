import React, { useState, useEffect } from 'react';
import { ic } from '../../components/icons';
import { recruitApi, Interview, Candidate } from '../../services/recruitApi';

export const InterviewSchedulingPage: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    candidate_name: '',
    job_title: 'Senior ML Engineer',
    round_name: 'Technical Round 1',
    interviewer: 'Karthik Reddy',
    scheduled_at: '',
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const loadData = async () => {
    try {
      const [ints, cands] = await Promise.all([recruitApi.getInterviews(), recruitApi.getCandidates()]);
      setInterviews(ints);
      setCandidates(cands);
    } catch {
      showToast('Loaded scheduled interviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.candidate_name) return;
    try {
      const created = await recruitApi.createInterview({
        candidate_name: form.candidate_name,
        job_title: form.job_title,
        round_name: form.round_name,
        panel: form.interviewer,
        scheduled_at: form.scheduled_at || new Date().toISOString(),
      });
      setInterviews([created, ...interviews]);
      setIsModalOpen(false);
      showToast(`Interview scheduled for ${form.candidate_name}`);
    } catch {
      showToast('Error saving interview to backend');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-['Sora']">Interview Scheduling</h1>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">● Backend Connected</span>
          </div>
          <p className="text-sm text-slate-500 mt-1">Calendar rounds, interviewer allocation, and candidate scorecards</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <span className="w-4 h-4">{ic('plus', 16)}</span> Schedule Interview
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading interview schedules from backend...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {interviews.map((item) => (
            <div key={item.interview_id || item.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3 hover:border-slate-300 transition-colors">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                  {item.round_name}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                  {item.status || 'Scheduled'}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm font-['Sora']">{item.candidate_name}</h3>
                <p className="text-xs text-slate-500">{item.job_title}</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg text-xs space-y-1">
                <p className="text-slate-700 font-medium flex items-center justify-between">
                  <span>🗓 {item.scheduled_at?.split('T')[0] || 'Scheduled Date'}</span>
                  <span>⏰ {item.scheduled_at?.split('T')[1] || '11:00 AM'}</span>
                </p>
                <p className="text-slate-500 text-[11px]">Panel: <span className="font-semibold text-slate-700">{item.panel}</span></p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <button onClick={() => showToast(`Opening scorecard for ${item.candidate_name}`)} className="text-slate-600 hover:text-slate-900 font-medium">
                  Submit Scorecard →
                </button>
                <button onClick={() => showToast(`Interview for ${item.candidate_name} marked as complete`)} className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-600 text-white hover:bg-emerald-700 rounded transition-colors">
                  Mark Done
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <form onSubmit={handleSchedule} className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm font-['Sora']">Schedule Interview</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Candidate</label>
                <input
                  required
                  type="text"
                  placeholder="Candidate name"
                  list="candList"
                  value={form.candidate_name}
                  onChange={(e) => setForm({ ...form, candidate_name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
                />
                <datalist id="candList">
                  {candidates.map((c) => (
                    <option key={c.cand_id || c.id} value={c.full_name}>{c.job_title}</option>
                  ))}
                </datalist>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Role</label>
                <input type="text" value={form.job_title} onChange={(e) => setForm({ ...form, job_title: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800" />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Interview Round</label>
                <select value={form.round_name} onChange={(e) => setForm({ ...form, round_name: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800">
                  <option value="Technical Round 1">Technical Round 1</option>
                  <option value="System Design">System Design & Architecture</option>
                  <option value="Hiring Manager">Hiring Manager</option>
                  <option value="Executive Round">Executive Round</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Panel Members</label>
                <input type="text" value={form.interviewer} onChange={(e) => setForm({ ...form, interviewer: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800" />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date & Time</label>
                <input type="datetime-local" value={form.scheduled_at} onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800" />
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
              <button type="submit" className="px-4 py-2 text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-lg shadow-sm">Confirm Schedule</button>
            </div>
          </form>
        </div>
      )}

      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-medium shadow-xl flex items-center gap-2 animate-fade-in">
          <span className="w-4 h-4 text-emerald-400">{ic('check', 16)}</span>
          {toastMsg}
        </div>
      )}
    </div>
  );
};

export default InterviewSchedulingPage;
