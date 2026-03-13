// ─────────────────────────────────────────────
// RunIt! Mock Data — UC Berkeley area courts & games
// ─────────────────────────────────────────────

export type Sport = 'Basketball' | 'Soccer' | 'Pickleball' | 'Tennis' | 'Volleyball';

export interface User {
  user_id: string;
  full_name: string;
  email?: string;
  profile_photo_url: string | null;
  skill_level: 'Beginner' | 'Intermediate' | 'Advanced';
  has_completed_survey: boolean;
  preferred_radius?: number;
  preferred_sports: Sport[];
  availability: {
    days: string[]; // ['Mon', 'Tue', ...]
    times: ('Morning' | 'Afternoon' | 'Evening')[];
  };
  reliability_score: number;
  reliability_badge: string;
  games_attended_count: number;
  games_hosted_count: number;
  bio: string;
  created_at?: string;
}

export interface Court {
  court_id: string;
  court_name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  latitude: number;
  longitude: number;
  indoor_outdoor: 'Indoor' | 'Outdoor';
  court_type: string;
  is_active: boolean;
  notes: string;
  supported_sports: Sport[];
}

export interface Game {
  game_id: string;
  host_id: string;
  court_id: string;
  sport: Sport;
  scheduled_start_time: string;
  scheduled_end_time: string;
  skill_level: 'Beginner' | 'Intermediate' | 'Advanced';
  max_players: number;
  description: string;
  status: 'open' | 'completed' | 'cancelled';
  created_at: string;
  fee: number;
  is_wager?: boolean;
  wager_amount?: number;
}

export interface GameParticipant {
  game_id: string;
  user_id: string;
  role: 'player' | 'host';
  join_status: 'pending' | 'approved' | 'rejected' | 'waitlisted';
  attendance_status: 'unknown' | 'attended' | 'missed';
  paid: boolean;
}

export const CURRENT_USER: User = {
  user_id: 'u_001',
  full_name: 'Vishwa',
  email: 'vishwa@berkeley.edu',
  profile_photo_url: null,
  skill_level: 'Intermediate',
  has_completed_survey: false,
  preferred_radius: 5,
  preferred_sports: ['Basketball', 'Soccer'],
  availability: {
    days: ['Mon', 'Wed', 'Fri', 'Sat', 'Sun'],
    times: ['Afternoon', 'Evening'],
  },
  reliability_score: 92,
  reliability_badge: 'Reliable',
  games_attended_count: 14,
  games_hosted_count: 5,
  bio: 'Cal junior. Pickup hoops after class is my therapy.',
  created_at: '2025-09-01',
};

export const USERS: User[] = [
  CURRENT_USER,
  {
    user_id: 'u_002',
    full_name: 'Marcus Johnson',
    profile_photo_url: null,
    skill_level: 'Advanced',
    has_completed_survey: true,
    preferred_sports: ['Basketball'],
    availability: {
      days: ['Tue', 'Thu', 'Sat'],
      times: ['Evening'],
    },
    reliability_score: 97,
    reliability_badge: 'Reliable',
    games_attended_count: 32,
    games_hosted_count: 12,
    bio: 'Hooped at community college. Now I just run pickup.',
  },
  {
    user_id: 'u_003',
    full_name: 'Aiden Park',
    profile_photo_url: null,
    skill_level: 'Intermediate',
    has_completed_survey: true,
    preferred_sports: ['Soccer', 'Tennis'],
    availability: {
      days: ['Mon', 'Fri', 'Sun'],
      times: ['Morning', 'Afternoon'],
    },
    reliability_score: 85,
    reliability_badge: 'Reliable',
    games_attended_count: 9,
    games_hosted_count: 2,
    bio: 'CS major who shoots threes.',
  },
  {
    user_id: 'u_004',
    full_name: 'Jasmine Torres',
    profile_photo_url: null,
    skill_level: 'Beginner',
    has_completed_survey: false,
    preferred_sports: ['Pickleball', 'Volleyball'],
    availability: {
      days: ['Sat', 'Sun'],
      times: ['Afternoon'],
    },
    reliability_score: 0,
    reliability_badge: 'New',
    games_attended_count: 1,
    games_hosted_count: 0,
    bio: 'Just moved to Berkeley, looking for runs!',
  },
];

export const COURTS: Court[] = [
  {
    court_id: 'c_001',
    court_name: 'RSF Outdoor Courts',
    address: '2301 Bancroft Way',
    city: 'Berkeley',
    state: 'CA',
    zip_code: '94720',
    latitude: 37.8685,
    longitude: -122.2625,
    indoor_outdoor: 'Outdoor',
    court_type: 'Full court',
    is_active: true,
    notes: '2 full courts behind the RSF. Lights until 10pm.',
    supported_sports: ['Basketball'],
  },
  {
    court_id: 'c_002',
    court_name: "People's Park Courts",
    address: '2556 Haste St',
    city: 'Berkeley',
    state: 'CA',
    zip_code: '94704',
    latitude: 37.8658,
    longitude: -122.2565,
    indoor_outdoor: 'Outdoor',
    court_type: 'Half court',
    is_active: true,
    notes: 'Half court. Good for 3v3.',
    supported_sports: ['Basketball'],
  },
  {
    court_id: 'c_003',
    court_name: 'San Pablo Park',
    address: '2800 Park St',
    city: 'Berkeley',
    state: 'CA',
    zip_code: '94702',
    latitude: 37.8573,
    longitude: -122.2867,
    indoor_outdoor: 'Outdoor',
    court_type: 'Full court',
    is_active: true,
    notes: 'Great public court. Can get busy on weekends.',
    supported_sports: ['Basketball', 'Soccer', 'Tennis'],
  },
  {
    court_id: 'c_004',
    court_name: 'Clark Kerr Courts',
    address: '2601 Warring St',
    city: 'Berkeley',
    state: 'CA',
    zip_code: '94720',
    latitude: 37.8665,
    longitude: -122.2505,
    indoor_outdoor: 'Outdoor',
    court_type: 'Multi-sport',
    is_active: true,
    notes: 'Beautiful hillside courts. Pickleball lines available on tennis courts.',
    supported_sports: ['Tennis', 'Pickleball', 'Basketball'],
  },
  {
    court_id: 'c_005',
    court_name: 'RSF Indoor Gym',
    address: '2301 Bancroft Way',
    city: 'Berkeley',
    state: 'CA',
    zip_code: '94720',
    latitude: 37.8685,
    longitude: -122.2625,
    indoor_outdoor: 'Indoor',
    court_type: 'Full court',
    is_active: true,
    notes: 'Indoor courts. Requires RSF membership or day pass.',
    supported_sports: ['Basketball', 'Volleyball'],
  },
  {
    court_id: 'c_006',
    court_name: 'Underhill Field',
    address: '2650 Channing Way',
    city: 'Berkeley',
    state: 'CA',
    zip_code: '94720',
    latitude: 37.8675,
    longitude: -122.2545,
    indoor_outdoor: 'Outdoor',
    court_type: 'Turf field',
    is_active: true,
    notes: 'Rooftop turf field. Great for soccer and frisbee.',
    supported_sports: ['Soccer'],
  },
];

// Helper: generate dates relative to today
const today = new Date();
const day = (offset: number, hour: number, minute = 0) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

export const GAMES: Game[] = [
  // Today
  {
    game_id: 'g_001',
    host_id: 'u_002',
    court_id: 'c_001',
    sport: 'Basketball',
    scheduled_start_time: day(0, 17, 30),
    scheduled_end_time: day(0, 19, 0),
    skill_level: 'Intermediate',
    max_players: 10,
    description: 'After-class 5s. Bring water — no fountain nearby.',
    status: 'open',
    created_at: day(-1, 10),
    fee: 2,
    is_wager: true,
    wager_amount: 5,
  },
  {
    game_id: 'g_005',
    host_id: 'u_004',
    court_id: 'c_002',
    sport: 'Basketball',
    scheduled_start_time: day(0, 16, 0),
    scheduled_end_time: day(0, 17, 30),
    skill_level: 'Beginner',
    max_players: 6,
    description: 'Learning the ropes. Just a chill shootaround and light 3v3.',
    status: 'open',
    created_at: day(-1, 9),
    fee: 2,
  },
  {
    game_id: 'g_006',
    host_id: 'u_003',
    court_id: 'c_003',
    sport: 'Soccer',
    scheduled_start_time: day(0, 19, 0),
    scheduled_end_time: day(0, 21, 0),
    skill_level: 'Advanced',
    max_players: 14,
    description: 'High intensity 7v7. No slide tackling.',
    status: 'open',
    created_at: day(-2, 11),
    fee: 2,
  },
  // Tomorrow
  {
    game_id: 'g_002',
    host_id: 'u_003',
    court_id: 'c_003',
    sport: 'Soccer',
    scheduled_start_time: day(1, 10, 0),
    scheduled_end_time: day(1, 12, 0),
    skill_level: 'Advanced',
    max_players: 12,
    description: 'Competitive 6v6. Come ready to run.',
    status: 'open',
    created_at: day(-1, 14),
    fee: 2,
  },
  {
    game_id: 'g_004',
    host_id: 'u_002',
    court_id: 'c_004',
    sport: 'Pickleball',
    scheduled_start_time: day(1, 18, 0),
    scheduled_end_time: day(1, 20, 0),
    skill_level: 'Intermediate',
    max_players: 4,
    description: 'Sunset pickleball doubles. All levels welcome but we play at an intermediate pace.',
    status: 'open',
    created_at: day(0, 12),
    fee: 2,
  },
  {
    game_id: 'g_007',
    host_id: 'u_001',
    court_id: 'c_001',
    sport: 'Basketball',
    scheduled_start_time: day(1, 15, 0),
    scheduled_end_time: day(1, 16, 30),
    skill_level: 'Beginner',
    max_players: 10,
    description: 'Casual full court. Good for getting back into the game.',
    status: 'open',
    created_at: day(0, 9),
    fee: 2,
  },
  // Day After Tomorrow
  {
    game_id: 'g_003',
    host_id: 'u_001',
    court_id: 'c_002',
    sport: 'Basketball',
    scheduled_start_time: day(2, 16, 0),
    scheduled_end_time: day(2, 17, 30),
    skill_level: 'Beginner',
    max_players: 6,
    description: "Chill 3v3, all skill levels welcome. Let's hoop!",
    status: 'open',
    created_at: day(0, 8),
    fee: 2,
  },
  {
    game_id: 'g_008',
    host_id: 'u_002',
    court_id: 'c_004',
    sport: 'Tennis',
    scheduled_start_time: day(2, 10, 0),
    scheduled_end_time: day(2, 12, 0),
    skill_level: 'Intermediate',
    max_players: 4,
    description: 'Morning doubles. Looking for consistent hitters.',
    status: 'open',
    created_at: day(-1, 15),
    fee: 2,
  },
  {
    game_id: 'g_009',
    host_id: 'u_003',
    court_id: 'c_001',
    sport: 'Basketball',
    scheduled_start_time: day(2, 18, 0),
    scheduled_end_time: day(2, 20, 0),
    skill_level: 'Advanced',
    max_players: 10,
    description: 'Elite 5s. High school/college experience preferred.',
    status: 'open',
    created_at: day(0, 10),
    fee: 2,
  },
  // Day 3
  {
    game_id: 'g_010',
    host_id: 'u_004',
    court_id: 'c_003',
    sport: 'Pickleball',
    scheduled_start_time: day(3, 17, 0),
    scheduled_end_time: day(3, 19, 0),
    skill_level: 'Beginner',
    max_players: 8,
    description: 'Pickleball social. We will rotate courts and help newcomers.',
    status: 'open',
    created_at: day(0, 11),
    fee: 2,
  },
  {
    game_id: 'g_011',
    host_id: 'u_001',
    court_id: 'c_001',
    sport: 'Basketball',
    scheduled_start_time: day(3, 19, 30),
    scheduled_end_time: day(3, 21, 0),
    skill_level: 'Intermediate',
    max_players: 10,
    description: 'Night runs under the lights.',
    status: 'open',
    created_at: day(1, 9),
    fee: 2,
  },
  {
    game_id: 'g_012',
    host_id: 'u_002',
    court_id: 'c_003',
    sport: 'Soccer',
    scheduled_start_time: day(3, 10, 0),
    scheduled_end_time: day(3, 12, 0),
    skill_level: 'Advanced',
    max_players: 12,
    description: 'Fast-paced 6v6. Bring dark and light shirts.',
    status: 'open',
    created_at: day(1, 14),
    fee: 2,
  },
  // Day 4
  {
    game_id: 'g_013',
    host_id: 'u_001',
    court_id: 'c_005',
    sport: 'Volleyball',
    scheduled_start_time: day(4, 18, 0),
    scheduled_end_time: day(4, 20, 0),
    skill_level: 'Intermediate',
    max_players: 12,
    description: 'Indoor volleyball. 6v6 rotation.',
    status: 'open',
    created_at: day(2, 10),
    fee: 2,
  },
  {
    game_id: 'g_014',
    host_id: 'u_002',
    court_id: 'c_006',
    sport: 'Soccer',
    scheduled_start_time: day(4, 16, 0),
    scheduled_end_time: day(4, 18, 0),
    skill_level: 'Beginner',
    max_players: 14,
    description: 'Casual soccer on the turf. All welcome!',
    status: 'open',
    created_at: day(2, 12),
    fee: 2,
  },
  {
    game_id: 'g_015',
    host_id: 'u_003',
    court_id: 'c_001',
    sport: 'Basketball',
    scheduled_start_time: day(4, 19, 0),
    scheduled_end_time: day(4, 21, 0),
    skill_level: 'Advanced',
    max_players: 10,
    description: 'High level 5s. Bring your A game.',
    status: 'open',
    created_at: day(2, 14),
    fee: 2,
  },
  // Day 5
  {
    game_id: 'g_016',
    host_id: 'u_004',
    court_id: 'c_004',
    sport: 'Pickleball',
    scheduled_start_time: day(5, 9, 0),
    scheduled_end_time: day(5, 11, 0),
    skill_level: 'Advanced',
    max_players: 4,
    description: 'Competitive pickleball doubles.',
    status: 'open',
    created_at: day(3, 8),
    fee: 2,
  },
  {
    game_id: 'g_017',
    host_id: 'u_001',
    court_id: 'c_002',
    sport: 'Basketball',
    scheduled_start_time: day(5, 17, 0),
    scheduled_end_time: day(5, 18, 30),
    skill_level: 'Intermediate',
    max_players: 6,
    description: '3v3 half court runs.',
    status: 'open',
    created_at: day(3, 10),
    fee: 2,
  },
  {
    game_id: 'g_018',
    host_id: 'u_003',
    court_id: 'c_003',
    sport: 'Soccer',
    scheduled_start_time: day(5, 11, 0),
    scheduled_end_time: day(5, 13, 0),
    skill_level: 'Beginner',
    max_players: 12,
    description: 'Morning soccer social.',
    status: 'open',
    created_at: day(3, 12),
    fee: 2,
  },
  // Day 6
  {
    game_id: 'g_019',
    host_id: 'u_002',
    court_id: 'c_001',
    sport: 'Basketball',
    scheduled_start_time: day(6, 14, 0),
    scheduled_end_time: day(6, 16, 0),
    skill_level: 'Beginner',
    max_players: 10,
    description: 'Weekend casual hoops.',
    status: 'open',
    created_at: day(4, 9),
    fee: 2,
  },
  {
    game_id: 'g_020',
    host_id: 'u_004',
    court_id: 'c_005',
    sport: 'Volleyball',
    scheduled_start_time: day(6, 10, 0),
    scheduled_end_time: day(6, 12, 0),
    skill_level: 'Advanced',
    max_players: 12,
    description: 'Competitive indoor volleyball.',
    status: 'open',
    created_at: day(4, 11),
    fee: 2,
  },
  {
    game_id: 'g_021',
    host_id: 'u_001',
    court_id: 'c_004',
    sport: 'Tennis',
    scheduled_start_time: day(6, 17, 0),
    scheduled_end_time: day(6, 19, 0),
    skill_level: 'Intermediate',
    max_players: 4,
    description: 'Mixed doubles tennis.',
    status: 'open',
    created_at: day(4, 15),
    fee: 2,
  },
];

export let GAME_PARTICIPANTS: GameParticipant[] = [
  { game_id: 'g_001', user_id: 'u_001', role: 'player', join_status: 'approved', attendance_status: 'unknown', paid: true },
  { game_id: 'g_001', user_id: 'u_003', role: 'player', join_status: 'waitlisted', attendance_status: 'unknown', paid: false },
];

export const getCourtById = (id: string) => COURTS.find((c) => c.court_id === id);
export const getUserById = (id: string) => USERS.find((u) => u.user_id === id);
export const getParticipantsForGame = (gameId: string) => GAME_PARTICIPANTS.filter((p) => p.game_id === gameId);

export const joinGame = (gameId: string, userId: string) => {
  const game = GAMES.find(g => g.game_id === gameId);
  if (!game) return;

  const participants = getParticipantsForGame(gameId);
  const approvedCount = participants.filter(p => p.join_status === 'approved').length;
  
  const status = approvedCount >= game.max_players ? 'waitlisted' : 'approved';
  
  const newParticipant: GameParticipant = {
    game_id: gameId,
    user_id: userId,
    role: 'player',
    join_status: status,
    attendance_status: 'unknown',
    paid: game.fee > 0
  };
  
  GAME_PARTICIPANTS.push(newParticipant);
  return newParticipant;
};

export const cancelParticipation = (gameId: string, userId: string) => {
  const index = GAME_PARTICIPANTS.findIndex(p => p.game_id === gameId && p.user_id === userId);
  if (index === -1) return;

  const cancelledParticipant = GAME_PARTICIPANTS[index];
  GAME_PARTICIPANTS.splice(index, 1);

  // If the cancelled person was 'approved', move the first 'waitlisted' person up
  if (cancelledParticipant.join_status === 'approved') {
    const firstWaitlisted = GAME_PARTICIPANTS.find(p => p.game_id === gameId && p.join_status === 'waitlisted');
    if (firstWaitlisted) {
      firstWaitlisted.join_status = 'approved';
      
      // Notify the promoted user
      const game = GAMES.find(g => g.game_id === gameId);
      const court = getCourtById(game?.court_id || '');
      addNotification({
        type: 'approval',
        title: 'Off the Waitlist!',
        message: `A spot opened up! You've been moved to the player list for the game at ${court?.court_name}.`,
        time: 'Just now',
        unread: true,
      });
      
      return { promotedUserId: firstWaitlisted.user_id };
    }
  }
  return {};
};

export interface Notification {
  id: string;
  type: 'request' | 'approval' | 'chat' | 'info';
  title: string;
  message: string;
  time: string;
  unread: boolean;
}

export let NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'request',
    title: 'New Join Request',
    message: 'Marcus Johnson wants to join your game at RSF.',
    time: '2m ago',
    unread: true,
  },
  {
    id: '2',
    type: 'approval',
    title: 'Request Approved',
    message: 'Devon Williams approved your request for San Pablo Park.',
    time: '1h ago',
    unread: true,
  },
  {
    id: '3',
    type: 'chat',
    title: 'New Message',
    message: 'Aiden: "Yo, anyone bringing a pump?"',
    time: '3h ago',
    unread: false,
  },
  {
    id: '4',
    type: 'info',
    title: 'Game Reminder',
    message: 'Your game at People\'s Park starts in 2 hours.',
    time: '5h ago',
    unread: false,
  },
];

export const addNotification = (notif: Omit<Notification, 'id'>) => {
  const newNotif = {
    ...notif,
    id: Math.random().toString(36).substr(2, 9),
  };
  NOTIFICATIONS = [newNotif, ...NOTIFICATIONS];
  return newNotif;
};

export const generateRandomTeams = (gameId: string, numTeams: number = 2) => {
  const participants = getParticipantsForGame(gameId).filter(p => p.join_status === 'approved');
  const shuffled = [...participants].sort(() => Math.random() - 0.5);
  
  const teams: GameParticipant[][] = Array.from({ length: numTeams }, () => []);
  
  shuffled.forEach((participant, index) => {
    teams[index % numTeams].push(participant);
  });
  
  return teams;
};
