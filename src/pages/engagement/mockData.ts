import {
  FeedPost,
  GroupItem,
  AnnouncementItem,
  DirectoryEmployee,
  EventItem,
  FeedbackItem,
  TownhallItem,
  CelebrationItem,
} from './types';

// Dynamic-only architecture: Live data is fetched from PostgreSQL backend endpoints.
export const INITIAL_POSTS: FeedPost[] = [];
export const INITIAL_GROUPS: GroupItem[] = [];
export const INITIAL_ANNOUNCEMENTS: AnnouncementItem[] = [];
export const INITIAL_DIRECTORY_EMPLOYEES: DirectoryEmployee[] = [];
export const INITIAL_EVENTS: EventItem[] = [];
export const INITIAL_FEEDBACK: FeedbackItem[] = [];
export const INITIAL_TOWNHALLS: TownhallItem[] = [];
export const INITIAL_CELEBRATIONS: CelebrationItem[] = [];
