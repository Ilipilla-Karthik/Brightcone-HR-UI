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

export const INITIAL_POSTS: FeedPost[] = [
  {
    id: 'PO1',
    by: 'Priya Menon',
    type: 'Kudos',
    to: 'Rahul Varma',
    t: 'Huge thanks for the rate-limiter rewrite. The agent gateway p95 dropped by 40% overnight.',
    d: '2026-10-12',
    likes: ['Karthik Reddy', 'Arjun Nair', 'Ananya Rao'],
    comments: [{ by: 'Arjun Nair', t: 'Well deserved!' }],
  },
  {
    id: 'PO2',
    by: 'Ananya Rao',
    type: 'Announcement',
    t: 'Open enrolment for 2027 health cover closes Oct 31. Add dependents under Payroll, then Benefits.',
    d: '2026-10-05',
    likes: ['Meera Joshi'],
    comments: [],
  },
  {
    id: 'PO3',
    by: 'Karthik Reddy',
    type: 'Update',
    t: 'AI Research just shipped the new embeddings pipeline to production. Demo at Thursday’s lunch and learn.',
    d: '2026-10-03',
    likes: ['Priya Menon', 'Rahul Varma', 'Naresh Vemparala', 'Emily Carter'],
    comments: [{ by: 'Naresh Vemparala', t: 'Great work, team.' }],
  },
  {
    id: 'PO4',
    by: 'Lakshmi Prasad',
    type: 'Welcome',
    to: 'Divya Kulkarni',
    t: 'Please welcome Divya Kulkarni, who joins Engineering as a Security Engineer in Hyderabad.',
    d: '2026-09-28',
    likes: ['Priya Menon', 'Vikram Singh'],
    comments: [],
  },
];

export const INITIAL_GROUPS: GroupItem[] = [
  { n: 'Hyderabad office', m: 9 },
  { n: 'Engineering guild', m: 7 },
  { n: 'Bright Works launch', m: 12 },
  { n: 'Sports & fitness club', m: 6 },
];

export const INITIAL_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'A1',
    t: 'Open enrolment for 2027 health cover closes Oct 31',
    b: 'Add dependents or upgrade your plan under Benefits.',
    d: '2026-10-05',
    pin: true,
  },
  {
    id: 'A2',
    t: 'Q3 town hall on Oct 15, 4 pm IST',
    b: 'Agenda: product roadmap and the Bright Works launch.',
    d: '2026-10-02',
    pin: false,
  },
  {
    id: 'A3',
    t: 'Updated travel & expense policy',
    b: 'Effective Nov 1. Please read and acknowledge it in Documents.',
    d: '2026-09-30',
    pin: false,
  },
];

export const INITIAL_DIRECTORY_EMPLOYEES: DirectoryEmployee[] = [
  { id: 'BC-1001', name: 'Naresh Vemparala', role: 'Founder & CEO', dept: 'Leadership', loc: 'Hyderabad', status: 'Active', joined: '2021-03-01', mgr: '', phone: '+91 98480 11001', email: 'naresh.vemparala@brightcone.ai' },
  { id: 'BC-1004', name: 'Ananya Rao', role: 'People Ops Lead', dept: 'People Ops', loc: 'Hyderabad', status: 'Active', joined: '2022-01-10', mgr: 'Naresh Vemparala', phone: '+91 98480 11004', email: 'ananya.rao@brightcone.ai' },
  { id: 'BC-1012', name: 'Karthik Reddy', role: 'Principal AI Engineer', dept: 'AI Research', loc: 'Hyderabad', status: 'Active', joined: '2022-04-18', mgr: 'Naresh Vemparala', phone: '+91 98480 11012', email: 'karthik.reddy@brightcone.ai' },
  { id: 'BC-1019', name: 'Priya Menon', role: 'Engineering Manager', dept: 'Engineering', loc: 'Bengaluru', status: 'Active', joined: '2022-07-04', mgr: 'Karthik Reddy', phone: '+91 98480 11019', email: 'priya.menon@brightcone.ai' },
  { id: 'BC-1023', name: 'Daniel Brooks', role: 'Account Executive', dept: 'Sales', loc: 'San Francisco', status: 'Active', joined: '2023-02-13', mgr: 'Naresh Vemparala', phone: '+1 415 555 0123', email: 'daniel.brooks@brightcone.ai' },
  { id: 'BC-1031', name: 'Sneha Iyer', role: 'Product Designer', dept: 'Design', loc: 'Hyderabad', status: 'On leave', joined: '2023-05-22', mgr: 'Priya Menon', phone: '+91 98480 11031', email: 'sneha.iyer@brightcone.ai' },
  { id: 'BC-1038', name: 'Rahul Varma', role: 'Backend Engineer', dept: 'Engineering', loc: 'Hyderabad', status: 'Active', joined: '2023-08-07', mgr: 'Priya Menon', phone: '+91 98480 11038', email: 'rahul.varma@brightcone.ai', dob: '1996-10-07' },
  { id: 'BC-1042', name: 'Meera Joshi', role: 'Finance Manager', dept: 'Finance', loc: 'Hyderabad', status: 'Active', joined: '2023-10-02', mgr: 'Naresh Vemparala', phone: '+91 98480 11042', email: 'meera.joshi@brightcone.ai' },
  { id: 'BC-1047', name: 'Arjun Nair', role: 'ML Engineer', dept: 'AI Research', loc: 'Remote', status: 'Active', joined: '2024-01-15', mgr: 'Karthik Reddy', phone: '+91 98480 11047', email: 'arjun.nair@brightcone.ai' },
  { id: 'BC-1053', name: 'Emily Carter', role: 'Customer Success Manager', dept: 'Customer Success', loc: 'Austin', status: 'Active', joined: '2024-03-11', mgr: 'Daniel Brooks', phone: '+1 512 555 0188', email: 'emily.carter@brightcone.ai' },
  { id: 'BC-1058', name: 'Vikram Singh', role: 'DevOps Engineer', dept: 'Engineering', loc: 'Pune', status: 'Probation', joined: '2026-08-19', mgr: 'Priya Menon', phone: '+91 98480 11058', email: 'vikram.singh@brightcone.ai' },
  { id: 'BC-1061', name: 'Lakshmi Prasad', role: 'Recruiter', dept: 'People Ops', loc: 'Hyderabad', status: 'Active', joined: '2024-09-02', mgr: 'Ananya Rao', phone: '+91 98480 11061', email: 'lakshmi.prasad@brightcone.ai' },
  { id: 'BC-1066', name: 'Farhan Ali', role: 'Frontend Engineer', dept: 'Engineering', loc: 'Hyderabad', status: 'Notice period', joined: '2024-11-25', mgr: 'Priya Menon', phone: '+91 98480 11066', email: 'farhan.ali@brightcone.ai' },
  { id: 'BC-1070', name: 'Divya Kulkarni', role: 'Security Engineer', dept: 'Engineering', loc: 'Hyderabad', status: 'Probation', joined: '2026-09-28', mgr: 'Priya Menon', phone: '+91 98480 11070', email: 'divya.kulkarni@brightcone.ai' },
];

export const INITIAL_EVENTS: EventItem[] = [
  { id: 'EV-101', name: 'Diwali Office Celebration', etype: 'Festival', date: '2026-11-06', time: '16:00', venue: 'Hyderabad Cafeteria & Courtyard', organiser: 'Lakshmi Prasad', budget: 150000, att: 48, status: 'Confirmed', notes: 'Traditional dress code, lights, sweets and family games.' },
  { id: 'EV-102', name: 'Bright Works AI Product Launch Party', etype: 'Celebration', date: '2026-10-30', time: '18:00', venue: 'Terrace Lounge & Zoom Live', organiser: 'Ananya Rao', budget: 250000, att: 72, status: 'Planned', notes: 'Keynote by Naresh Vemparala, product live demo and cocktail dinner.' },
  { id: 'EV-103', name: 'Annual Hyderabad Badminton Tournament', etype: 'Sports', date: '2026-10-24', time: '09:00', venue: 'Gachibowli Indoor Arena', organiser: 'Vikram Singh', budget: 45000, att: 24, status: 'Confirmed', notes: 'Singles and doubles league.' },
  { id: 'EV-104', name: 'Engineering Q3 Offsite & Hackathon', etype: 'Offsite', date: '2026-09-18', time: '09:30', venue: 'Golconda Resort, Hyderabad', organiser: 'Priya Menon', budget: 420000, att: 36, status: 'Completed', notes: 'Shipped 6 internal developer tools.' },
];

export const INITIAL_FEEDBACK: FeedbackItem[] = [
  { id: 'FB-01', anon: 'No', emp: 'Rahul Varma', cat: 'Workplace', rating: '4', text: 'Dual monitor stands in Hyderabad 3rd floor are shaky. Need heavier adjustable arms for 4K displays.', date: '2026-10-18', owner: 'Lakshmi Prasad', action: 'Ordered 12 heavy duty arm brackets arriving Oct 25.', status: 'In progress' },
  { id: 'FB-02', anon: 'Yes', emp: '', cat: 'Culture', rating: '5', text: 'The async documentation culture and Friday no-meeting afternoons have drastically improved deep work.', date: '2026-10-12', owner: 'Ananya Rao', action: 'Highlighted in monthly leadership notes.', status: 'Completed' },
  { id: 'FB-03', anon: 'No', emp: 'Vikram Singh', cat: 'Pay & benefits', rating: '3', text: 'Could we introduce a digital health card app instead of carrying the physical TPA card to hospitals?', date: '2026-10-04', owner: 'Ananya Rao', action: 'E-cards made available in the portal and app.', status: 'Completed' },
];

export const INITIAL_TOWNHALLS: TownhallItem[] = [
  { id: 'TH-26-04', title: 'Q4 2026 All-Hands & Product Vision', date: '2026-11-20', time: '16:30', mode: 'Hybrid', host: 'Naresh Vemparala', agenda: '1. Revenue milestones\n2. Bright Works 2.0 launch\n3. Q&A', att: 85, status: 'Scheduled' },
  { id: 'TH-26-03', title: 'Q3 Town Hall & Growth Retrospective', date: '2026-10-02', time: '16:00', mode: 'Hybrid', host: 'Naresh Vemparala', agenda: '1. H2 Product roadmap\n2. Customer retention update\n3. Employee recognition', att: 78, status: 'Completed', minutes: 'Recorded session shared on Slack #general. 4 promotions announced.', actions: 'Publish updated travel guidelines by Nov 1.' },
  { id: 'TH-26-02', title: 'Mid-Year Leadership Town Hall', date: '2026-07-15', time: '15:00', mode: 'Online', host: 'Naresh Vemparala', agenda: '1. US expansion update\n2. Engineering org scaling', att: 74, status: 'Completed' },
];

export const INITIAL_CELEBRATIONS: CelebrationItem[] = [
  { id: 'C-01', empId: 'BC-1038', name: 'Rahul Varma', occasion: 'Birthday', date: '2026-10-07', daysAway: 0, milestone: 'Turns 30', dept: 'Engineering' },
  { id: 'BC-1042-wa', empId: 'BC-1042', name: 'Meera Joshi', occasion: 'Work anniversary', date: '2026-10-02', daysAway: 2, milestone: '3 years', dept: 'Finance' },
  { id: 'BC-1012-b', empId: 'BC-1012', name: 'Karthik Reddy', occasion: 'Birthday', date: '2026-10-28', daysAway: 4, milestone: 'Turns 32', dept: 'AI Research' },
  { id: 'BC-1066-b', empId: 'BC-1066', name: 'Farhan Ali', occasion: 'Birthday', date: '2026-11-04', daysAway: 11, milestone: 'Turns 28', dept: 'Engineering' },
  { id: 'BC-1066-wa', empId: 'BC-1066', name: 'Farhan Ali', occasion: 'Work anniversary', date: '2026-11-25', daysAway: 32, milestone: '2 years', dept: 'Engineering' },
  { id: 'BC-1047-wa', empId: 'BC-1047', name: 'Arjun Nair', occasion: 'Work anniversary', date: '2027-01-15', daysAway: 53, milestone: '3 years', dept: 'AI Research' },
];
