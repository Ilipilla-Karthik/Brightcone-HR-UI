import React, { useState } from 'react';
import { useAuth } from '../../services/authContext';
import { ic } from '../../components/icons';
import { FeedPost, PostType, AnnouncementItem } from './types';
import {
  INITIAL_POSTS,
  INITIAL_GROUPS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_DIRECTORY_EMPLOYEES,
  INITIAL_CELEBRATIONS,
} from './mockData';
import { NewAnnouncementModal } from './components/NewAnnouncementModal';
import { PostCard } from './components/PostCard';
import { FeedSidebarWidgets } from './components/FeedSidebarWidgets';

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

export const CompanyFeedPage: React.FC = () => {
  const { user } = useAuth();
  const currentUser = user?.name || (user?.role === 'employee' ? 'Rahul Varma' : 'Ananya Rao');
  const isAdmin =
    user?.role === 'hr_admin' ||
    user?.role === 'HR_ADMIN' ||
    user?.role === 'ADMIN' ||
    currentUser === 'Ananya Rao';

  const [posts, setPosts] = useState<FeedPost[]>(INITIAL_POSTS);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(INITIAL_ANNOUNCEMENTS);
  const [groups, setGroups] = useState(INITIAL_GROUPS);
  const [joinedGroups, setJoinedGroups] = useState<Record<string, boolean>>({});
  const [celebrations] = useState(INITIAL_CELEBRATIONS);

  const [postType, setPostType] = useState<PostType>('Update');
  const [postText, setPostText] = useState('');
  const [kudoTo, setKudoTo] = useState('Rahul Varma');
  const [isAnnModalOpen, setIsAnnModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleCreatePost = () => {
    const text = postText.trim();
    if (!text) {
      showToast('Write something before posting');
      return;
    }
    const newP: FeedPost = {
      id: `PO${Date.now()}`,
      by: currentUser,
      type: postType,
      to: postType === 'Kudos' ? kudoTo : undefined,
      t: text,
      d: new Date().toISOString().slice(0, 10),
      likes: [],
      comments: [],
    };
    setPosts([newP, ...posts]);
    setPostText('');
    showToast('Posted to the company feed');
  };

  const handleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const hasLiked = p.likes.includes(currentUser);
        const newLikes = hasLiked
          ? p.likes.filter((name) => name !== currentUser)
          : [...p.likes, currentUser];
        return { ...p, likes: newLikes };
      })
    );
  };

  const handleAddComment = (postId: string, text: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          comments: [...p.comments, { by: currentUser, t: text }],
        };
      })
    );
  };

  const handleJoinGroup = (groupName: string) => {
    setJoinedGroups((prev) => ({ ...prev, [groupName]: true }));
    setGroups((prev) =>
      prev.map((g) => (g.n === groupName ? { ...g, m: g.m + 1 } : g))
    );
    showToast(`You joined ${groupName}`);
  };

  const handleWish = (name: string, occasion: string) => {
    const newP: FeedPost = {
      id: `PO${Date.now()}`,
      by: currentUser,
      type: 'Celebration',
      to: name,
      t: `Wishing ${name} a wonderful ${occasion.toLowerCase()}! 🎉 Have a fantastic year ahead!`,
      d: new Date().toISOString().slice(0, 10),
      likes: [currentUser],
      comments: [],
    };
    setPosts([newP, ...posts]);
    showToast(`Wished ${name}! Added celebration post.`);
  };

  const handleSaveAnnouncement = (ann: { title: string; body: string; pin: boolean }) => {
    const newA: AnnouncementItem = {
      id: `A${Date.now()}`,
      t: ann.title,
      b: ann.body,
      pin: ann.pin,
      d: new Date().toISOString().slice(0, 10),
    };
    setAnnouncements([newA, ...announcements]);
    showToast('Announcement published');
  };

  const otherEmployees = INITIAL_DIRECTORY_EMPLOYEES.filter(
    (e) => e.name !== currentUser
  );

  return (
    <div
      className="view max-w-[1240px] mx-auto"
      style={{ '--ac': '#0BA6CC' } as React.CSSProperties}
    >
      {/* Head */}
      <div className="head">
        <div>
          <h1>Company feed</h1>
          <p>Updates, kudos and celebrations from across Brightcone.</p>
        </div>
        {isAdmin && (
          <div className="actions">
            <button
              type="button"
              className="btn"
              onClick={() => setIsAnnModalOpen(true)}
            >
              {ic('mega', 16)}
              Post announcement
            </button>
          </div>
        )}
      </div>

      {/* Grid: Left Feed Column + Right Widgets */}
      <div className="grid g-dash items-start">
        {/* Left Column: Composer + Posts */}
        <div>
          {/* Composer Card */}
          <div className="card composer">
            <div className="who">
              <span
                className="av"
                style={{ backgroundColor: getAvatarColor(currentUser) }}
              >
                {getInitials(currentUser)}
              </span>
              <div>
                <b>{currentUser}</b>
                <span>Share with everyone at Brightcone</span>
              </div>
            </div>

            <textarea
              className="input"
              rows={3}
              placeholder="Share an update or thank a colleague"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
            />

            <div className="cfoot">
              <div className="tabs" id="ptype">
                {(['Update', 'Kudos', 'Celebration'] as PostType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={postType === t ? 'on' : ''}
                    onClick={() => setPostType(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {postType === 'Kudos' && (
                <select
                  className="input"
                  value={kudoTo}
                  onChange={(e) => setKudoTo(e.target.value)}
                  aria-label="Who to thank"
                >
                  {otherEmployees.map((e) => (
                    <option key={e.id} value={e.name}>
                      {e.name}
                    </option>
                  ))}
                </select>
              )}

              <button
                type="button"
                className="btn primary ml-auto"
                onClick={handleCreatePost}
              >
                {ic('send', 16)}
                Post
              </button>
            </div>
          </div>

          {/* Posts List */}
          {posts.map((p) => {
            const author = INITIAL_DIRECTORY_EMPLOYEES.find((e) => e.name === p.by);
            const deptText = author?.dept || 'Engineering';

            return (
              <PostCard
                key={p.id}
                post={p}
                currentUser={currentUser}
                deptText={deptText}
                onLike={handleLike}
                onAddComment={handleAddComment}
              />
            );
          })}
        </div>

        {/* Right Widgets Column */}
        <FeedSidebarWidgets
          celebrations={celebrations}
          announcements={announcements}
          groups={groups}
          joinedGroups={joinedGroups}
          isAdmin={isAdmin}
          onWish={handleWish}
          onJoinGroup={handleJoinGroup}
        />
      </div>

      {/* New Announcement Modal */}
      <NewAnnouncementModal
        isOpen={isAnnModalOpen}
        onClose={() => setIsAnnModalOpen(false)}
        onSave={handleSaveAnnouncement}
      />

      {/* Toast Notification */}
      <div className={`toast ${toastMsg ? 'on' : ''}`}>
        {ic('chat', 18)}
        <span>{toastMsg}</span>
      </div>
    </div>
  );
};

export default CompanyFeedPage;
