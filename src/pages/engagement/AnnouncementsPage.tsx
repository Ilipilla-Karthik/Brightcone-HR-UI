import React, { useState } from 'react';
import { ic } from '../../components/icons';
import { AnnouncementItem } from './types';
import { INITIAL_ANNOUNCEMENTS } from './mockData';
import { NewAnnouncementModal } from './components/NewAnnouncementModal';

export const AnnouncementsPage: React.FC = () => {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(INITIAL_ANNOUNCEMENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<AnnouncementItem | null>(null);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleTogglePin = (id: string, pin: boolean) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, pin } : a))
    );
    showToast(pin ? 'Announcement pinned' : 'Announcement unpinned');
  };

  const handleDelete = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    showToast('Announcement deleted');
  };

  const handleSave = (item: { title: string; body: string; pin: boolean; id?: string }) => {
    if (item.id) {
      setAnnouncements((prev) =>
        prev.map((a) =>
          a.id === item.id
            ? { ...a, t: item.title, b: item.body, pin: item.pin }
            : a
        )
      );
      showToast('Announcement updated');
    } else {
      const newA: AnnouncementItem = {
        id: `A${Date.now()}`,
        t: item.title,
        b: item.body,
        pin: item.pin,
        d: new Date().toISOString().slice(0, 10),
      };
      setAnnouncements([newA, ...announcements]);
      showToast('Announcement published');
    }
  };

  const handleOpenEdit = (a: AnnouncementItem) => {
    setEditItem(a);
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditItem(null);
    setIsModalOpen(true);
  };

  return (
    <div
      className="view max-w-[1240px] mx-auto"
      style={{ '--ac': '#0BA6CC' } as React.CSSProperties}
    >
      <div className="head">
        <div>
          <h1>Announcements</h1>
          <p>Posts appear on every employee’s home page.</p>
        </div>
        <div className="actions">
          <button
            type="button"
            className="btn primary"
            onClick={handleOpenCreate}
          >
            {ic('plus', 16)}
            Post announcement
          </button>
        </div>
      </div>

      <div className="card">
        <h3>Published</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Posted</th>
                <th>Pinned</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {announcements.length === 0 ? (
                <tr>
                  <td colSpan={4} className="empty">
                    No announcements yet.
                  </td>
                </tr>
              ) : (
                announcements.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <b>{r.t}</b>
                      <div
                        className="muted"
                        style={{ fontSize: '12.5px', whiteSpace: 'normal' }}
                      >
                        {r.b}
                      </div>
                    </td>
                    <td>{r.d}</td>
                    <td>
                      <label className="sw">
                        <input
                          type="checkbox"
                          checked={r.pin}
                          onChange={(e) => handleTogglePin(r.id, e.target.checked)}
                          aria-label="Pin"
                        />
                        <i />
                      </label>
                    </td>
                    <td className="text-right">
                      <div className="inline-flex gap-2 justify-end">
                        <button
                          type="button"
                          className="btn sm"
                          onClick={() => handleOpenEdit(r)}
                          title="Edit"
                        >
                          {ic('edit', 15)}
                        </button>
                        <button
                          type="button"
                          className="btn sm bad"
                          onClick={() => handleDelete(r.id)}
                          title="Delete"
                          aria-label="Delete"
                        >
                          {ic('trash', 15)}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <NewAnnouncementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editItem={editItem}
      />

      <div className={`toast ${toastMsg ? 'on' : ''}`}>
        {ic('chat', 18)}
        <span>{toastMsg}</span>
      </div>
    </div>
  );
};

export default AnnouncementsPage;
