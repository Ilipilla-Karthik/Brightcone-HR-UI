import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  MessageSquare,
  Heart,
  Send,
  Calendar,
  Sparkles,
  LifeBuoy,
} from 'lucide-react';

interface FeedPost {
  id: string;
  author: string;
  authorRole: string;
  avatar: string;
  badge?: string;
  timeAgo: string;
  content: string;
  likes: number;
  commentsCount: number;
}

const DEFAULT_POSTS: FeedPost[] = [
  {
    id: 'post-1',
    author: 'Ananya Rao',
    authorRole: 'Head of HR • Leadership Announcement',
    avatar: 'AR',
    badge: 'Official',
    timeAgo: '2 hours ago',
    content: '🎉 Thrilled to announce that Brightcone has officially onboarded 148 team members! Join us this Friday at 4:30 PM for our Q4 Townhall where we celebrate engineering milestones and preview 2027 product roadmaps.',
    likes: 42,
    commentsCount: 9,
  },
  {
    id: 'post-2',
    author: 'Rahul Varma',
    authorRole: 'Senior Full-Stack Engineer',
    avatar: 'RV',
    badge: 'Peer Kudos',
    timeAgo: 'Yesterday',
    content: 'Huge shoutout to @Aditi Sharma and @Tejas Patil for shipping the zero-latency search indexing on our core Rust API. The response times dropped from 85ms to 9ms in benchmark load tests! 🚀👏',
    likes: 28,
    commentsCount: 6,
  },
  {
    id: 'post-3',
    author: 'Brightcone Bot',
    authorRole: 'Culture & Milestones',
    avatar: 'BB',
    badge: 'Anniversary',
    timeAgo: '2 days ago',
    content: '✨ Celebrating 2 years of impactful work with Kavya Pillai! Thank you for leading product design across our web applications with such elegance and craftsmanship. Happy Work Anniversary! 🎊',
    likes: 35,
    commentsCount: 11,
  },
];

export const CompanyFeedPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'feed';

  const [posts, setPosts] = useState<FeedPost[]>(DEFAULT_POSTS);
  const [newPostContent, setNewPostContent] = useState('');
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  const [tickets] = useState([
    { id: 'HD-101', subject: 'Tax deduction discrepancy in September payslip', requester: 'Marcus Lee', status: 'In Review', priority: 'High', date: '22 Oct 2026' },
    { id: 'HD-102', subject: 'Requesting second 4K monitor for workstation', requester: 'Rahul Varma', status: 'Resolved', priority: 'Medium', date: '18 Oct 2026' },
    { id: 'HD-103', subject: 'Health insurance beneficiary update for parents', requester: 'Aditi Sharma', status: 'Open', priority: 'Medium', date: '21 Oct 2026' },
  ]);

  const setTab = (tab: string) => setSearchParams({ tab });

  const handleLike = (id: string) => {
    setLikedPosts((prev) => {
      const isLiked = !prev[id];
      setPosts((pList) =>
        pList.map((p) => (p.id === id ? { ...p, likes: p.likes + (isLiked ? 1 : -1) } : p))
      );
      return { ...prev, [id]: isLiked };
    });
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    const newPost: FeedPost = {
      id: `post-${Date.now()}`,
      author: 'Ananya Rao',
      authorRole: 'Head of HR',
      avatar: 'AR',
      badge: 'Update',
      timeAgo: 'Just now',
      content: newPostContent,
      likes: 0,
      commentsCount: 0,
    };
    setPosts([newPost, ...posts]);
    setNewPostContent('');
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--surface)] p-6 rounded-2xl border border-[var(--line)] shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--brand)]">
            <span className="w-2 h-2 rounded-full bg-[var(--brand)] animate-pulse" />
            Connect & Engagement Hub
          </div>
          <h1 className="text-2xl font-bold text-[var(--text)] mt-1">Company Workplace & Culture</h1>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            Internal company wall, leadership townhalls, celebration milestones, and HR helpdesk.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--line)] pb-3 overflow-x-auto text-xs font-semibold">
        {[
          { key: 'feed', label: 'Company Feed', icon: <MessageSquare size={14} />, count: posts.length },
          { key: 'events', label: 'Events & Townhalls', icon: <Calendar size={14} />, count: 3 },
          { key: 'celebrations', label: 'Celebrations', icon: <Sparkles size={14} /> },
          { key: 'helpdesk', label: 'HR Helpdesk', icon: <LifeBuoy size={14} />, count: tickets.length },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
              currentTab === t.key
                ? 'bg-[var(--surface-2)] text-[var(--brand)] shadow-xs'
                : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]/50'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
            {t.count !== undefined && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-[var(--line)] text-[var(--text)]">
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab 1: Company Feed */}
      {currentTab === 'feed' && (
        <div className="space-y-4">
          <form
            onSubmit={handleCreatePost}
            className="bg-[var(--surface)] p-4 rounded-2xl border border-[var(--line)] shadow-sm space-y-3"
          >
            <textarea
              rows={3}
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="Share an update, milestone or celebrate a colleague with the team..."
              className="w-full p-3 bg-[var(--surface-2)] border border-[var(--line)] rounded-xl text-xs focus:outline-none"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!newPostContent.trim()}
                className="flex items-center gap-1.5 px-4 py-2 bg-[var(--brand)] text-white text-xs font-semibold rounded-xl hover:opacity-90 disabled:opacity-40"
              >
                <Send size={13} /> Post Update
              </button>
            </div>
          </form>

          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-[var(--surface)] p-5 rounded-2xl border border-[var(--line)] shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#3B82F6] to-[#06B6D4] text-white font-bold text-xs flex items-center justify-center">
                      {post.avatar}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-[var(--text)]">{post.author}</h3>
                      <p className="text-[11px] text-[var(--muted)]">{post.authorRole}</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-[var(--muted)]">{post.timeAgo}</span>
                </div>
                <p className="text-xs text-[var(--text)] leading-relaxed">{post.content}</p>
                <div className="flex items-center gap-4 pt-2 border-t border-[var(--line)] text-xs">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1.5 font-semibold transition ${
                      likedPosts[post.id] ? 'text-rose-600' : 'text-[var(--muted)] hover:text-rose-600'
                    }`}
                  >
                    <Heart size={14} className={likedPosts[post.id] ? 'fill-current' : ''} />
                    <span>{post.likes} Likes</span>
                  </button>
                  <span className="flex items-center gap-1.5 text-[var(--muted)]">
                    <MessageSquare size={14} />
                    <span>{post.commentsCount} Comments</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Events & Townhalls */}
      {currentTab === 'events' && (
        <div className="space-y-3">
          {[
            { title: 'Brightcone Q4 All-Hands Townhall', date: '25 Oct 2026, 04:30 PM', mode: 'Main Auditorium & Google Meet', host: 'Naresh Vemparala & Leadership', rsvp: 'Going (112 attending)' },
            { title: 'Engineering Tech Talk: Zero-Cost Rust Concurrency', date: '30 Oct 2026, 03:00 PM', mode: 'Tech Room 2 & Stream', host: 'Rahul Varma', rsvp: 'Going (64 attending)' },
            { title: 'Annual Hackathon 2026: Agentic Workflows', date: '12 Nov - 14 Nov 2026', mode: 'Hyderabad HQ', host: 'Innovation Labs', rsvp: 'Registered (18 teams)' },
          ].map((ev, i) => (
            <div key={i} className="bg-[var(--surface)] p-5 rounded-2xl border border-[var(--line)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-[var(--text)]">{ev.title}</h3>
                <p className="text-[var(--muted)]">{ev.date} • {ev.mode}</p>
                <p className="text-[11px] text-[var(--brand)]">Host: {ev.host}</p>
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-semibold text-xs rounded-xl self-start sm:self-auto">
                {ev.rsvp}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Celebrations */}
      {currentTab === 'celebrations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-[var(--surface)] p-5 rounded-2xl border border-[var(--line)] space-y-3">
            <h3 className="font-bold text-sm text-[var(--text)] flex items-center gap-2">
              <Sparkles size={16} className="text-amber-500" /> Upcoming Work Anniversaries
            </h3>
            <div className="divide-y divide-[var(--line)]">
              {[
                { name: 'Kavya Pillai', tenure: '2 Years', date: '24 Oct 2026' },
                { name: 'Rahul Varma', tenure: '4 Years', date: '12 Aug 2026' },
              ].map((m, i) => (
                <div key={i} className="py-2.5 flex justify-between items-center">
                  <span className="font-semibold text-[var(--text)]">{m.name}</span>
                  <span className="text-[var(--brand)] font-bold">{m.tenure} ({m.date})</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[var(--surface)] p-5 rounded-2xl border border-[var(--line)] space-y-3">
            <h3 className="font-bold text-sm text-[var(--text)] flex items-center gap-2">
              <Sparkles size={16} className="text-pink-500" /> Upcoming Birthdays
            </h3>
            <div className="divide-y divide-[var(--line)]">
              {[
                { name: 'Aditi Sharma', date: '29 Oct' },
                { name: 'Marcus Lee', date: '04 Nov' },
              ].map((m, i) => (
                <div key={i} className="py-2.5 flex justify-between items-center">
                  <span className="font-semibold text-[var(--text)]">{m.name}</span>
                  <span className="text-pink-600 font-bold">{m.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: HR Helpdesk */}
      {currentTab === 'helpdesk' && (
        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--line)] divide-y divide-[var(--line)] text-xs">
          {tickets.map((tk) => (
            <div key={tk.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="font-bold text-sm text-[var(--text)]">{tk.subject}</p>
                <p className="text-[var(--muted)]">{tk.id} • Raised by: {tk.requester} on {tk.date}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  tk.priority === 'High' ? 'bg-rose-50 text-rose-700' : 'bg-blue-50 text-blue-700'
                }`}>
                  {tk.priority} Priority
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                  {tk.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyFeedPage;
