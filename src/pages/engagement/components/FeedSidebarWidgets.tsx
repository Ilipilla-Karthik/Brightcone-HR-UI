import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ic } from '../../../components/icons';
import { GroupItem, AnnouncementItem, CelebrationItem } from '../types';

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

interface FeedSidebarWidgetsProps {
  celebrations: CelebrationItem[];
  announcements: AnnouncementItem[];
  groups: GroupItem[];
  joinedGroups: Record<string, boolean>;
  isAdmin: boolean;
  onWish: (name: string, occasion: string) => void;
  onJoinGroup: (groupName: string) => void;
}

export const FeedSidebarWidgets: React.FC<FeedSidebarWidgetsProps> = ({
  celebrations,
  announcements,
  groups,
  joinedGroups,
  isAdmin,
  onWish,
  onJoinGroup,
}) => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Celebrations this month */}
      <div className="card">
        <h3>Celebrations this month</h3>
        <div className="list">
          {celebrations.slice(0, 4).map((c) => (
            <div key={c.id} className="row">
              <span className="av" style={{ backgroundColor: getAvatarColor(c.name) }}>
                {getInitials(c.name)}
              </span>
              <div className="grow">
                <b>{c.name}</b>
                <div className="sub">
                  {c.occasion} · {c.date} ({c.milestone})
                </div>
              </div>
              <button
                type="button"
                className="btn sm"
                onClick={() => onWish(c.name, c.occasion)}
              >
                Wish
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Pinned Announcements */}
      <div className="card mt">
        <h3>
          <span>Pinned</span>
          {isAdmin && (
            <button
              type="button"
              className="link"
              onClick={() => navigate('/engagement/announcements')}
            >
              Manage
            </button>
          )}
        </h3>
        <div className="list">
          {announcements
            .filter((a) => a.pin)
            .concat(announcements.filter((a) => !a.pin))
            .slice(0, 3)
            .map((a) => (
              <div key={a.id} className="row">
                <div className="grow">
                  <b style={{ whiteSpace: 'normal' }}>{a.t}</b>
                  <div className="sub">{a.d}</div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Groups */}
      <div className="card mt">
        <h3>Groups</h3>
        <div className="list">
          {groups.map((g) => {
            const isJoined = joinedGroups[g.n];
            return (
              <div key={g.n} className="row">
                <span
                  className="av"
                  style={{
                    background: 'color-mix(in srgb, var(--ac) 14%, transparent)',
                    color: 'var(--ac)',
                  }}
                >
                  {ic('users', 16)}
                </span>
                <div className="grow">
                  <b>{g.n}</b>
                  <div className="sub">{g.m} members</div>
                </div>
                <button
                  type="button"
                  className={`btn sm ${isJoined ? 'ok' : ''}`}
                  disabled={isJoined}
                  onClick={() => onJoinGroup(g.n)}
                >
                  {isJoined ? 'Joined' : 'Join'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FeedSidebarWidgets;
