import React, { useState } from 'react';
import {
  MessageSquare,
  Heart,
  Sparkles,
  Send,
} from 'lucide-react';

interface FeedPost {
  id: string;
  author: string;
  authorRole: string;
  avatar: string;
  badge?: string;
  badgeColor?: string;
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
    badgeColor: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
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
    badgeColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
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
    badgeColor: 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
    timeAgo: '2 days ago',
    content: '✨ Celebrating 2 years of impactful work with Kavya Pillai! Thank you for leading product design across our web applications with such elegance and craftsmanship. Happy Work Anniversary! 🎊',
    likes: 35,
    commentsCount: 11,
  },
];

export const CompanyFeedPage: React.FC = () => {
  const [posts, setPosts] = useState<FeedPost[]>(DEFAULT_POSTS);
  const [newPostText, setNewPostText] = useState('');
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    const newPost: FeedPost = {
      id: `post-${Date.now()}`,
      author: 'Rahul Varma',
      authorRole: 'Senior Full-Stack Engineer',
      avatar: 'RV',
      timeAgo: 'Just now',
      content: newPostText,
      likes: 1,
      commentsCount: 0,
    };
    setPosts([newPost, ...posts]);
    setNewPostText('');
  };

  const toggleLike = (id: string) => {
    setLikedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const isLiked = likedPosts[id];
          return { ...p, likes: isLiked ? p.likes - 1 : p.likes + 1 };
        }
        return p;
      })
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--line)] shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--brand)]">
          <Sparkles size={14} /> Culture & Community
        </div>
        <h1 className="text-2xl font-bold text-[var(--text)] mt-1">Company Feed & Announcements</h1>
        <p className="text-sm text-[var(--muted)] mt-0.5">
          Share updates, recognize colleagues, and keep up with organization milestones.
        </p>
      </div>

      {/* Share Update Box */}
      <form onSubmit={handleCreatePost} className="bg-[var(--surface)] p-4 rounded-2xl border border-[var(--line)] shadow-sm space-y-3">
        <textarea
          rows={3}
          value={newPostText}
          onChange={(e) => setNewPostText(e.target.value)}
          placeholder="Share an achievement, give kudos, or post an update to the team..."
          className="w-full p-3 bg-[var(--surface-2)] border border-[var(--line)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)] text-[var(--text)]"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 bg-[var(--brand)] text-white text-xs font-semibold rounded-xl hover:opacity-90 transition shadow-sm"
          >
            <Send size={13} /> Share with Team
          </button>
        </div>
      </form>

      {/* Posts List */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-[var(--surface)] p-5 rounded-2xl border border-[var(--line)] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--brand)] to-cyan-500 text-white font-bold text-sm flex items-center justify-center shadow-sm">
                  {post.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-[var(--text)]">{post.author}</span>
                    {post.badge && (
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${post.badgeColor}`}>
                        {post.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-[var(--muted)]">{post.authorRole} • {post.timeAgo}</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-[var(--text)] leading-relaxed">{post.content}</p>
            <div className="flex items-center gap-6 pt-2 border-t border-[var(--line)] text-xs text-[var(--muted)]">
              <button
                onClick={() => toggleLike(post.id)}
                className={`flex items-center gap-1.5 font-semibold transition ${
                  likedPosts[post.id] ? 'text-rose-500' : 'hover:text-[var(--text)]'
                }`}
              >
                <Heart size={14} className={likedPosts[post.id] ? 'fill-rose-500' : ''} />
                <span>{post.likes} Likes</span>
              </button>
              <span className="flex items-center gap-1.5">
                <MessageSquare size={14} /> {post.commentsCount} Comments
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyFeedPage;
