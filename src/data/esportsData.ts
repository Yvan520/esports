export type GameType = 'LOL' | 'CS2' | 'DOTA2' | 'VALORANT' | 'PUBG' | 'HONOR';

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  region: string;
  wins: number;
  losses: number;
  winRate: number;
  points: number;
  game: GameType;
}

export interface Match {
  id: string;
  game: GameType;
  tournament: string;
  stage: string;
  teamA: { name: string; shortName: string; logo: string; score?: number };
  teamB: { name: string; shortName: string; logo: string; score?: number };
  status: 'live' | 'upcoming' | 'finished';
  startTime: string;
  viewers?: number;
  streamUrl?: string;
  bestOf: number;
}

export interface Tournament {
  id: string;
  name: string;
  game: GameType;
  logo: string;
  prizePool: string;
  startDate: string;
  endDate: string;
  status: 'ongoing' | 'upcoming' | 'finished';
  region: string;
  teams: number;
}

export interface News {
  id: string;
  title: string;
  summary: string;
  game: GameType;
  date: string;
  tag: string;
  image: string;
  slug?: string;
}

export function gameBg(game: { bgColor: string }, alpha: string): string {
  return game.bgColor.replace(/,([^,]+)\)$/, `,${alpha})`);
}

export const GAMES: { id: GameType; name: string; color: string; bgColor: string; emoji: string }[] = [
  { id: 'LOL', name: '英雄联盟', color: '#C89B3C', bgColor: 'rgba(200,155,60,0.15)', emoji: '⚔️' },
  { id: 'CS2', name: 'CS2', color: '#FF6B35', bgColor: 'rgba(255,107,53,0.15)', emoji: '🎯' },
  { id: 'DOTA2', name: 'DOTA 2', color: '#CC3333', bgColor: 'rgba(204,51,51,0.15)', emoji: '🗡️' },
  { id: 'VALORANT', name: 'VALORANT', color: '#FF4655', bgColor: 'rgba(255,70,85,0.15)', emoji: '🔫' },
  { id: 'PUBG', name: 'PUBG', color: '#F2A900', bgColor: 'rgba(242,169,0,0.15)', emoji: '🪖' },
  { id: 'HONOR', name: '王者荣耀', color: '#00D4FF', bgColor: 'rgba(0,212,255,0.15)', emoji: '👑' },
];

export const MATCHES: Match[] = [
  {
    id: 'm1',
    game: 'LOL',
    tournament: 'LPL 2026夏季赛',
    stage: '常规赛 第8周',
    teamA: { name: 'JDG战队', shortName: 'JDG', logo: '🐉', score: 2 },
    teamB: { name: 'BLG战队', shortName: 'BLG', logo: '⚡', score: 0 },
    status: 'live',
    startTime: '今日 17:00',
    viewers: 1876543,
    bestOf: 3,
  },
  {
    id: 'm2',
    game: 'VALORANT',
    tournament: 'VCT 2026太平洋赛',
    stage: '季后赛 决赛',
    teamA: { name: 'EDward Gaming', shortName: 'EDG', logo: '🦅', score: 2 },
    teamB: { name: 'ZETA DIVISION', shortName: 'ZETA', logo: '🌟', score: 1 },
    status: 'live',
    startTime: '今日 15:00',
    viewers: 924531,
    bestOf: 5,
  },
  {
    id: 'm3',
    game: 'CS2',
    tournament: 'BLAST 奥斯汀 2026',
    stage: '半决赛',
    teamA: { name: 'Natus Vincere', shortName: 'NAVI', logo: '🐺' },
    teamB: { name: 'Team Vitality', shortName: 'VIT', logo: '🐝' },
    status: 'upcoming',
    startTime: '今日 20:00',
    bestOf: 3,
  },
  {
    id: 'm4',
    game: 'DOTA2',
    tournament: 'The International 2026',
    stage: '小组赛 Day 1',
    teamA: { name: 'Team Spirit', shortName: 'TSP', logo: '👻' },
    teamB: { name: 'PSG.LGD', shortName: 'LGD', logo: '🐼' },
    status: 'upcoming',
    startTime: '明日 14:00',
    bestOf: 2,
  },
  {
    id: 'm5',
    game: 'HONOR',
    tournament: 'KPL 2026夏季赛',
    stage: '季后赛 四强',
    teamA: { name: 'Hero久竞', shortName: 'Hero', logo: '🦸', score: 3 },
    teamB: { name: '广州TTG', shortName: 'TTG', logo: '🔥', score: 0 },
    status: 'finished',
    startTime: '昨日 19:00',
    bestOf: 5,
  },
  {
    id: 'm6',
    game: 'PUBG',
    tournament: 'PGC 2026全球冠军赛',
    stage: '决赛日 2',
    teamA: { name: '4AM战队', shortName: '4AM', logo: '💎', score: 1 },
    teamB: { name: 'Nova战队', shortName: 'Nova', logo: '🌙', score: 0 },
    status: 'finished',
    startTime: '昨日 17:00',
    bestOf: 1,
  },
  {
    id: 'm7',
    game: 'LOL',
    tournament: 'LCK 2026夏季赛',
    stage: '常规赛 第7周',
    teamA: { name: 'T1', shortName: 'T1', logo: '⚡', score: 2 },
    teamB: { name: 'Gen.G', shortName: 'GEN', logo: '🐯', score: 1 },
    status: 'live',
    startTime: '今日 16:00',
    viewers: 1523000,
    bestOf: 3,
  },
  {
    id: 'm8',
    game: 'LOL',
    tournament: 'LEC 2026夏季赛',
    stage: '常规赛 第6周',
    teamA: { name: 'G2 Esports', shortName: 'G2', logo: '👑', score: 1 },
    teamB: { name: 'Fnatic', shortName: 'FNC', logo: '🟠', score: 0 },
    status: 'live',
    startTime: '今日 23:00',
    viewers: 685000,
    bestOf: 1,
  },
  {
    id: 'm9',
    game: 'VALORANT',
    tournament: 'VCT 2026美洲赛',
    stage: '季后赛 胜者组',
    teamA: { name: 'Sentinels', shortName: 'SEN', logo: '🔫' },
    teamB: { name: 'LOUD', shortName: 'LOUD', logo: '📢' },
    status: 'upcoming',
    startTime: '明日 05:00',
    bestOf: 5,
  },
  {
    id: 'm10',
    game: 'CS2',
    tournament: 'ESL Pro League S21',
    stage: '总决赛',
    teamA: { name: 'FaZe Clan', shortName: 'FaZe', logo: '⚔️', score: 2 },
    teamB: { name: 'MOUZ', shortName: 'MOUZ', logo: '🖱️', score: 1 },
    status: 'live',
    startTime: '今日 22:00',
    viewers: 823000,
    bestOf: 5,
  },
  {
    id: 'm11',
    game: 'DOTA2',
    tournament: 'DreamLeague S25',
    stage: '小组赛 B组',
    teamA: { name: 'Team GG', shortName: 'GG', logo: '💚' },
    teamB: { name: 'Tundra', shortName: 'Tundra', logo: '❄️' },
    status: 'upcoming',
    startTime: '明日 18:00',
    bestOf: 2,
  },
  {
    id: 'm12',
    game: 'HONOR',
    tournament: 'KPL 2026夏季赛',
    stage: '常规赛 第5周',
    teamA: { name: 'AG超玩会', shortName: 'AG', logo: '⭐', score: 3 },
    teamB: { name: 'DYG', shortName: 'DYG', logo: '💙', score: 1 },
    status: 'finished',
    startTime: '昨天 20:00',
    bestOf: 5,
  },
  {
    id: 'm13',
    game: 'PUBG',
    tournament: 'PCL 2026夏季赛',
    stage: '常规赛 第3周',
    teamA: { name: '17Gaming', shortName: '17G', logo: '🔫' },
    teamB: { name: 'NH战队', shortName: 'NH', logo: '🦅' },
    status: 'upcoming',
    startTime: '今日 18:00',
    bestOf: 1,
  },
  {
    id: 'm14',
    game: 'VALORANT',
    tournament: 'VCT 2026中国赛区',
    stage: '预选赛 决赛',
    teamA: { name: 'FPX', shortName: 'FPX', logo: '🔥', score: 3 },
    teamB: { name: 'BLG', shortName: 'BLG', logo: '⚡', score: 2 },
    status: 'finished',
    startTime: '昨天 17:00',
    bestOf: 5,
  },
  {
    id: 'm15',
    game: 'LOL',
    tournament: 'LPL 2026夏季赛',
    stage: '常规赛 第9周',
    teamA: { name: 'WEIBO Gaming', shortName: 'WBG', logo: '🦊', score: 2 },
    teamB: { name: 'LNG电子竞技', shortName: 'LNG', logo: '🌊', score: 1 },
    status: 'finished',
    startTime: '前天 19:00',
    bestOf: 3,
  },
];

export const TOURNAMENTS: Tournament[] = [
  {
    id: 't1',
    name: 'LPL 2026夏季赛',
    game: 'LOL',
    logo: '🏆',
    prizePool: '¥500万',
    startDate: '2026-05-20',
    endDate: '2026-08-10',
    status: 'ongoing',
    region: '中国',
    teams: 17,
  },
  {
    id: 't2',
    name: 'The International 2026',
    game: 'DOTA2',
    logo: '🌍',
    prizePool: '$45,000,000',
    startDate: '2026-08-01',
    endDate: '2026-08-17',
    status: 'upcoming',
    region: '全球',
    teams: 20,
  },
  {
    id: 't3',
    name: 'BLAST 奥斯汀 2026',
    game: 'CS2',
    logo: '🎯',
    prizePool: '$1,500,000',
    startDate: '2026-05-10',
    endDate: '2026-05-18',
    status: 'ongoing',
    region: '北美',
    teams: 16,
  },
  {
    id: 't4',
    name: 'VCT 2026太平洋赛',
    game: 'VALORANT',
    logo: '🔥',
    prizePool: '$600,000',
    startDate: '2026-04-15',
    endDate: '2026-06-20',
    status: 'ongoing',
    region: '亚太',
    teams: 12,
  },
  {
    id: 't5',
    name: 'KPL 2026夏季赛',
    game: 'HONOR',
    logo: '👑',
    prizePool: '¥800万',
    startDate: '2026-04-01',
    endDate: '2026-07-30',
    status: 'ongoing',
    region: '中国',
    teams: 18,
  },
  {
    id: 't6',
    name: 'PGC 2026全球冠军赛',
    game: 'PUBG',
    logo: '🪖',
    prizePool: '$2,500,000',
    startDate: '2026-06-10',
    endDate: '2026-06-22',
    status: 'upcoming',
    region: '全球',
    teams: 32,
  },
  {
    id: 't7',
    name: 'LCK 2026夏季赛',
    game: 'LOL',
    logo: '⚡',
    prizePool: '₩4억',
    startDate: '2026-05-15',
    endDate: '2026-08-20',
    status: 'ongoing',
    region: '韩国',
    teams: 10,
  },
  {
    id: 't8',
    name: 'LEC 2026夏季赛',
    game: 'LOL',
    logo: '🦅',
    prizePool: '€200,000',
    startDate: '2026-05-05',
    endDate: '2026-08-01',
    status: 'ongoing',
    region: '欧洲',
    teams: 10,
  },
  {
    id: 't9',
    name: 'VCT 2026美洲赛',
    game: 'VALORANT',
    logo: '🌎',
    prizePool: '$500,000',
    startDate: '2026-04-01',
    endDate: '2026-06-15',
    status: 'ongoing',
    region: '美洲',
    teams: 12,
  },
  {
    id: 't10',
    name: 'ESL Pro League S21',
    game: 'CS2',
    logo: '🏅',
    prizePool: '$750,000',
    startDate: '2026-06-01',
    endDate: '2026-06-14',
    status: 'ongoing',
    region: '全球',
    teams: 24,
  },
  {
    id: 't11',
    name: 'DreamLeague S25',
    game: 'DOTA2',
    logo: '💚',
    prizePool: '$1,000,000',
    startDate: '2026-05-20',
    endDate: '2026-06-08',
    status: 'ongoing',
    region: '全球',
    teams: 16,
  },
  {
    id: 't12',
    name: 'PCL 2026夏季赛',
    game: 'PUBG',
    logo: '🎯',
    prizePool: '¥300万',
    startDate: '2026-05-01',
    endDate: '2026-07-20',
    status: 'ongoing',
    region: '中国',
    teams: 24,
  },
  {
    id: 't13',
    name: 'VCT 2026中国赛区',
    game: 'VALORANT',
    logo: '🐉',
    prizePool: '$300,000',
    startDate: '2026-03-15',
    endDate: '2026-05-30',
    status: 'finished',
    region: '中国',
    teams: 12,
  },
  {
    id: 't14',
    name: 'MSI 2026季中冠军赛',
    game: 'LOL',
    logo: '🏆',
    prizePool: '$500,000',
    startDate: '2026-07-01',
    endDate: '2026-07-15',
    status: 'upcoming',
    region: '全球',
    teams: 12,
  },
];

export const STANDINGS: Team[] = [
  { id: 's1', name: 'JDG战队', shortName: 'JDG', logo: '🐉', region: '中国', wins: 18, losses: 4, winRate: 81.8, points: 36, game: 'LOL' },
  { id: 's2', name: 'BLG战队', shortName: 'BLG', logo: '⚡', region: '中国', wins: 16, losses: 6, winRate: 72.7, points: 32, game: 'LOL' },
  { id: 's3', name: 'EDward Gaming', shortName: 'EDG', logo: '🦅', region: '中国', wins: 15, losses: 7, winRate: 68.2, points: 30, game: 'LOL' },
  { id: 's4', name: 'NineRoads', shortName: 'NR', logo: '⚡', region: '中国', wins: 14, losses: 8, winRate: 63.6, points: 28, game: 'LOL' },
  { id: 's5', name: 'LNG电子竞技', shortName: 'LNG', logo: '🌊', region: '中国', wins: 12, losses: 10, winRate: 54.5, points: 24, game: 'LOL' },
  { id: 's6', name: 'WEIBO Gaming', shortName: 'WBG', logo: '🦊', region: '中国', wins: 11, losses: 11, winRate: 50.0, points: 22, game: 'LOL' },
  { id: 's7', name: 'TOP电子竞技', shortName: 'TOP', logo: '🔱', region: '中国', wins: 10, losses: 12, winRate: 45.5, points: 20, game: 'LOL' },
  { id: 's8', name: 'iG电子竞技', shortName: 'iG', logo: '🎭', region: '中国', wins: 8, losses: 14, winRate: 36.4, points: 16, game: 'LOL' },
  { id: 's9', name: 'Natus Vincere', shortName: 'NAVI', logo: '🐺', region: '欧洲', wins: 22, losses: 6, winRate: 78.6, points: 44, game: 'CS2' },
  { id: 's10', name: 'Team Vitality', shortName: 'VIT', logo: '🐝', region: '欧洲', wins: 20, losses: 8, winRate: 71.4, points: 40, game: 'CS2' },
  { id: 's11', name: 'FaZe Clan', shortName: 'FaZe', logo: '⚔️', region: '欧洲', wins: 18, losses: 10, winRate: 64.3, points: 36, game: 'CS2' },
  { id: 's12', name: 'G2 Esports', shortName: 'G2', logo: '👑', region: '欧洲', wins: 16, losses: 12, winRate: 57.1, points: 32, game: 'CS2' },
  { id: 's13', name: 'Team Spirit', shortName: 'TSP', logo: '👻', region: '东欧', wins: 14, losses: 14, winRate: 50.0, points: 28, game: 'DOTA2' },
  { id: 's14', name: 'PSG.LGD', shortName: 'LGD', logo: '🐼', region: '中国', wins: 13, losses: 15, winRate: 46.4, points: 26, game: 'DOTA2' },
  { id: 's15', name: 'OG', shortName: 'OG', logo: '🏆', region: '欧洲', wins: 12, losses: 16, winRate: 42.9, points: 24, game: 'DOTA2' },
  { id: 's16', name: 'Team Liquid', shortName: 'TL', logo: '💧', region: '欧洲', wins: 11, losses: 17, winRate: 39.3, points: 22, game: 'DOTA2' },
  { id: 's17', name: 'EDward Gaming', shortName: 'EDG', logo: '🦅', region: '中国', wins: 19, losses: 5, winRate: 79.2, points: 38, game: 'VALORANT' },
  { id: 's18', name: 'ZETA DIVISION', shortName: 'ZETA', logo: '🌟', region: '日本', wins: 17, losses: 7, winRate: 70.8, points: 34, game: 'VALORANT' },
  { id: 's19', name: 'Paper Rex', shortName: 'PRX', logo: '🦎', region: '亚太', wins: 15, losses: 9, winRate: 62.5, points: 30, game: 'VALORANT' },
  { id: 's20', name: 'DRX', shortName: 'DRX', logo: '🐲', region: '韩国', wins: 13, losses: 11, winRate: 54.2, points: 26, game: 'VALORANT' },
  { id: 's21', name: '4AM战队', shortName: '4AM', logo: '💎', region: '中国', wins: 24, losses: 8, winRate: 75.0, points: 48, game: 'PUBG' },
  { id: 's22', name: 'Nova战队', shortName: 'Nova', logo: '🌙', region: '中国', wins: 21, losses: 11, winRate: 65.6, points: 42, game: 'PUBG' },
  { id: 's23', name: 'Tianba战队', shortName: 'Tianba', logo: '⚡', region: '中国', wins: 18, losses: 14, winRate: 56.3, points: 36, game: 'PUBG' },
  { id: 's24', name: 'PeRo战队', shortName: 'PeRo', logo: '🎯', region: '中国', wins: 16, losses: 16, winRate: 50.0, points: 32, game: 'PUBG' },
  { id: 's25', name: 'Hero久竞', shortName: 'Hero', logo: '🦸', region: '中国', wins: 26, losses: 6, winRate: 81.3, points: 52, game: 'HONOR' },
  { id: 's26', name: '广州TTG', shortName: 'TTG', logo: '🔥', region: '中国', wins: 23, losses: 9, winRate: 71.9, points: 46, game: 'HONOR' },
  { id: 's27', name: '武汉eStarPro', shortName: 'eStar', logo: '⭐', region: '中国', wins: 20, losses: 12, winRate: 62.5, points: 40, game: 'HONOR' },
  { id: 's28', name: '重庆狼队', shortName: 'Wolves', logo: '🐺', region: '中国', wins: 18, losses: 14, winRate: 56.3, points: 36, game: 'HONOR' },
  // LOL additional
  { id: 's29', name: 'FunPlus Phoenix', shortName: 'FPX', logo: '🔥', region: '中国', wins: 9, losses: 13, winRate: 40.9, points: 18, game: 'LOL' },
  { id: 's30', name: 'RNG', shortName: 'RNG', logo: '🐯', region: '中国', wins: 7, losses: 15, winRate: 31.8, points: 14, game: 'LOL' },
  { id: 's31', name: 'T1', shortName: 'T1', logo: '⚡', region: '韩国', wins: 20, losses: 4, winRate: 83.3, points: 40, game: 'LOL' },
  { id: 's32', name: 'Gen.G', shortName: 'GEN', logo: '🐯', region: '韩国', wins: 18, losses: 6, winRate: 75.0, points: 36, game: 'LOL' },
  { id: 's33', name: 'G2 Esports', shortName: 'G2', logo: '👑', region: '欧洲', wins: 16, losses: 4, winRate: 80.0, points: 32, game: 'LOL' },
  { id: 's34', name: 'Fnatic', shortName: 'FNC', logo: '🟠', region: '欧洲', wins: 14, losses: 6, winRate: 70.0, points: 28, game: 'LOL' },
  // CS2 additional
  { id: 's35', name: 'MOUZ', shortName: 'MOUZ', logo: '🖱️', region: '欧洲', wins: 15, losses: 13, winRate: 53.6, points: 30, game: 'CS2' },
  { id: 's36', name: 'Virtus.pro', shortName: 'VP', logo: '🏛️', region: '东欧', wins: 14, losses: 14, winRate: 50.0, points: 28, game: 'CS2' },
  { id: 's37', name: 'Cloud9', shortName: 'C9', logo: '☁️', region: '北美', wins: 12, losses: 16, winRate: 42.9, points: 24, game: 'CS2' },
  { id: 's38', name: 'ENCE', shortName: 'ENCE', logo: '🦅', region: '欧洲', wins: 11, losses: 17, winRate: 39.3, points: 22, game: 'CS2' },
  // DOTA2 additional
  { id: 's39', name: 'Gaimin Gladiators', shortName: 'GG', logo: '💚', region: '欧洲', wins: 16, losses: 12, winRate: 57.1, points: 32, game: 'DOTA2' },
  { id: 's40', name: 'Tundra Esports', shortName: 'Tundra', logo: '❄️', region: '欧洲', wins: 15, losses: 13, winRate: 53.6, points: 30, game: 'DOTA2' },
  { id: 's41', name: 'Aurora Gaming', shortName: 'Aurora', logo: '🌌', region: '东南亚', wins: 10, losses: 18, winRate: 35.7, points: 20, game: 'DOTA2' },
  // VALORANT additional
  { id: 's42', name: 'Sentinels', shortName: 'SEN', logo: '🔫', region: '北美', wins: 16, losses: 8, winRate: 66.7, points: 32, game: 'VALORANT' },
  { id: 's43', name: 'LOUD', shortName: 'LOUD', logo: '📢', region: '巴西', wins: 14, losses: 10, winRate: 58.3, points: 28, game: 'VALORANT' },
  { id: 's44', name: 'FNATIC', shortName: 'FNC', logo: '🟠', region: '欧洲', wins: 18, losses: 6, winRate: 75.0, points: 36, game: 'VALORANT' },
  { id: 's45', name: '100 Thieves', shortName: '100T', logo: '💯', region: '北美', wins: 11, losses: 13, winRate: 45.8, points: 22, game: 'VALORANT' },
  // PUBG additional
  { id: 's46', name: '17Gaming', shortName: '17G', logo: '🔫', region: '中国', wins: 20, losses: 12, winRate: 62.5, points: 40, game: 'PUBG' },
  { id: 's47', name: 'NH战队', shortName: 'NH', logo: '🦅', region: '中国', wins: 17, losses: 15, winRate: 53.1, points: 34, game: 'PUBG' },
  { id: 's48', name: 'MCG战队', shortName: 'MCG', logo: '🎯', region: '中国', wins: 14, losses: 18, winRate: 43.8, points: 28, game: 'PUBG' },
  // HONOR additional
  { id: 's49', name: 'AG超玩会', shortName: 'AG', logo: '⭐', region: '中国', wins: 22, losses: 10, winRate: 68.8, points: 44, game: 'HONOR' },
  { id: 's50', name: 'DYG', shortName: 'DYG', logo: '💙', region: '中国', wins: 19, losses: 13, winRate: 59.4, points: 38, game: 'HONOR' },
  { id: 's51', name: '佛山GK', shortName: 'GK', logo: '🌊', region: '中国', wins: 15, losses: 17, winRate: 46.9, points: 30, game: 'HONOR' },
  { id: 's52', name: '北京WB', shortName: 'WB', logo: '🦊', region: '中国', wins: 16, losses: 16, winRate: 50.0, points: 32, game: 'HONOR' },
];

// 从 Deno proxy 获取实时比赛数据
const PROXY_URL = 'https://healthy-mustang-32.yvan520.deno.net';

export async function fetchLiveMatches(): Promise<Match[]> {
  try {
    const res = await fetch(`${PROXY_URL}/api/live-matches`);
    if (!res.ok) throw new Error('Failed to fetch');
    const rooms: any[] = await res.json();

    // 按 game 分组，取每个游戏中第一个 live 的房间
    const liveByGame = new Map<string, any>();
    for (const room of rooms) {
      if (room.isLive && !liveByGame.has(room.game)) {
        liveByGame.set(room.game, room);
      }
    }

    if (liveByGame.size === 0) return MATCHES; // fallback

    const liveMatches: Match[] = [];
    let idCounter = 1000;

    for (const [gameId, room] of liveByGame) {
      const gameInfo = GAMES.find(g => g.id === gameId);
      if (!gameInfo) continue;

      // Parse title like "LPL 2026夏季赛 JDG vs BLG" or use raw title
      const title = room.title || `${gameInfo.name} 直播中`;
      const viewers = room.viewers || 0;

      // Try to extract team names from title
      let teamA = 'Team A';
      let teamB = 'Team B';
      const vsMatch = title.match(/([A-Za-z0-9]{2,8})\s*v[vs\.]\s*([A-Za-z0-9]{2,8})/);
      if (vsMatch) {
        teamA = vsMatch[1];
        teamB = vsMatch[2];
      }

      liveMatches.push({
        id: `live-${idCounter++}`,
        game: gameId as GameType,
        tournament: `${gameInfo.name} Esports`,
        stage: room.platform === 'bilibili' ? 'B站直播' : room.platform === 'huya' ? '虎牙直播' : '斗鱼直播',
        teamA: { name: teamA, shortName: teamA, logo: gameInfo.emoji },
        teamB: { name: teamB, shortName: teamB, logo: gameInfo.emoji },
        status: 'live',
        startTime: '直播中',
        viewers: viewers || undefined,
        bestOf: 1,
      });
    }

    if (liveMatches.length > 0) {
      // Merge with upcoming/finished from static data
      const staticUpcoming = MATCHES.filter(m => m.status !== 'live');
      return [...liveMatches, ...staticUpcoming];
    }
    return MATCHES;
  } catch {
    return MATCHES; // fallback to static data
  }
}

export const NEWS: News[] = [
  { id: "n1", title: "Knight以12次MVP领跑LPL常规赛，BLG强势登顶", summary: "2026 LPL第二赛段常规赛收官，BLG中单Knight以12次MVP、场均7击杀的统治级表现领跑全联盟，BLG以12胜2负的战绩登顶积分榜。", game: "LOL", date: "2026-05-26", tag: "赛事速报", image: "👑", slug: "lpl-mvp-knight" },
  { id: "n2", title: "历史首次！三支涅槃组队伍以下克上", summary: "LPL第二赛段骑士之路创造历史——TT、EDG、LGD三支涅槃组战队分别击败登峰组的iG、NIP、WBG，上演史诗级以下克上。", game: "LOL", date: "2026-05-24", tag: "赛事速报", image: "🔥", slug: "lpl-cinderella-story" },
  { id: "n3", title: "2026 LPL夏季赛6月14日开赛，全新赛制引发期待", summary: "2026 LPL夏季赛定于6月14日正式打响，新赛季将引入多项赛制改革，包括扁平化分组和双败淘汰制的全面推广。", game: "LOL", date: "2026-05-27", tag: "赛事直播", image: "☀️", slug: "lpl-summer-2026" },
  { id: "n4", title: "AL 2-0横扫JDG，锁定石油杯参赛资格", summary: "在LPL第二赛段关键战中，AL战队以2-0完胜JDG，成功锁定2026电竞世界杯（石油杯）的LPL赛区参赛名额。", game: "LOL", date: "2026-05-22", tag: "赛事速报", image: "🌍", slug: "al-esports-world-cup" },
  { id: "n5", title: "从RNG到LGD：中单汤圆的重生之路", summary: "前RNG中单选手汤圆在LGD完成职业生涯的华丽转身，骑士之路关键战中发挥出色，帮助LGD淘汰WBG。", game: "LOL", date: "2026-05-23", tag: "行业资讯", image: "🔄", slug: "rng-tangyuan-lgd" },
  { id: "n6", title: "Spirit 3-0横扫Falcons夺得PGL Astana冠军", summary: "Team Spirit在PGL Astana 2026决赛中以3-0横扫Team Falcons，donk以1.61 rating的恐怖数据获得MVP。", game: "CS2", date: "2026-05-12", tag: "赛事速报", image: "🏆", slug: "cs2-spirit-pgl-astana" },
  { id: "n7", title: "Legacy 3-1击败Falcons，CAC 2026上海站夺冠", summary: "CS Asia Championships 2026在上海落幕，巴西战队Legacy以3-1击败Falcons夺冠。", game: "CS2", date: "2026-05-20", tag: "赛事速报", image: "🇨🇳", slug: "cs2-legacy-cac-shanghai" },
  { id: "n8", title: "NAVI 3-0完胜GamerLegion，夺得IEM Atlanta冠军", summary: "NAVI在IEM Atlanta决赛中以3-0横扫GamerLegion，w0nderful以稳定的狙击表现获得MVP。", game: "CS2", date: "2026-04-20", tag: "赛事速报", image: "🇪🇺", slug: "cs2-navi-iem-atlanta" },
  { id: "n9", title: "Vitality 3-0 NAVI豪取五连冠", summary: "Vitality在BLAST Rivals Spring 2026决赛中以3-0横扫NAVI，实现了跨赛季的五连冠伟业。", game: "CS2", date: "2026-05-18", tag: "赛事速报", image: "🐝", slug: "cs2-vitality-five-peat" },
  { id: "n10", title: "100 Thieves夺得队史首个CS2线下大赛冠军", summary: "100 Thieves在Parken Challenger Championship中击败各路强敌，夺得俱乐部历史上首个CS2线下赛事冠军。", game: "CS2", date: "2026-05-10", tag: "赛事速报", image: "🇺🇸", slug: "cs2-100t-first-lan-title" },
  { id: "n11", title: "G2 Esports 3-2险胜Leviatán，加冕VCT Americas冠军", summary: "G2 Esports在VCT Americas Stage 1决赛中以3-2击败Leviatán，夺得2026赛季首个VCT国际联赛冠军。", game: "VALORANT", date: "2026-05-19", tag: "赛事速报", image: "🇺🇸", slug: "valorant-g2-americas-champion" },
  { id: "n12", title: "败者组奇迹！Team Heretics夺得VCT EMEA冠军", summary: "Team Heretics从败者组一路杀出，在VCT EMEA Stage 1决赛中击败对手，完成了不可思议的败者组夺冠之旅。", game: "VALORANT", date: "2026-05-18", tag: "赛事速报", image: "🇪🇸", slug: "valorant-heretics-emea-champion" },
  { id: "n13", title: "Paper Rex 3-0横扫FULL SENSE，称霸VCT Pacific", summary: "Paper Rex在VCT Pacific Stage 1决赛中以3-0横扫FULL SENSE，以统治级表现夺得太平洋赛区冠军。", game: "VALORANT", date: "2026-05-17", tag: "赛事速报", image: "🇸🇬", slug: "valorant-prx-pacific-champion" },
  { id: "n14", title: "VCT Masters London 2026即将开战", summary: "VCT Masters London 2026定于6月6日至6月21日在伦敦举行，来自全球三大赛区的顶级战队将齐聚伦敦。", game: "VALORANT", date: "2026-05-27", tag: "赛事直播", image: "🇬🇧", slug: "valorant-masters-london-preview" },
  { id: "n15", title: "Wildcard击败FOKUS，夺得BC Game Masters冠军", summary: "北美战队Wildcard在BC Game Masters决赛中击败FOKUS，赢得队史首个线下大赛冠军。", game: "CS2", date: "2026-05-15", tag: "赛事速报", image: "🎮", slug: "cs2-wildcard-bcgame" },
  { id: "n16", title: "JDG 击败 BLG，英雄联盟联赛再下一城", summary: "在昨晚进行的英雄联盟顶级联赛中，JDG战队展现出强大的统治力，以碾压之势战胜BLG。比赛中队伍的核心选手发挥出色，多次打出精彩操作，带领团队取得关键胜利。目前该队在积分榜上排名稳步上升。", game: "LOL", date: "10分钟前", tag: "赛事速报", image: "🎮" },
  { id: "n17", title: "惊天逆转！BLG 在英雄联盟比赛中让二追三", summary: "BLG战队在落后两局的情况下展现出惊人的韧性，连扳三局完成史诗级逆转。决胜局中选手们顶住了巨大压力，通过精妙的战术配合与完美的执行力，最终以3:2的比分击败对手。这场比赛必将成为本赛季最经典的战役之一。", game: "LOL", date: "4小时前", tag: "赛事速报", image: "🎮" },
  { id: "n3", title: "EDG 横扫 WBG 强势晋级英雄联盟季后赛", summary: "EDG在季后赛资格关键战中直落三局击败WBG，凭借这场胜利锁定季后赛席位。队伍的战术体系日趋成熟，选手之间的配合愈发默契，展现出冠军相。教练组赛后表示团队状态正在最佳时期。", game: "LOL", date: "6小时前", tag: "赛事速报", image: "🎮" },
  { id: "n4", title: "英雄联盟全明星赛阵容公布，TES多人入选", summary: "备受瞩目的英雄联盟全明星赛正式公布参赛阵容，TES战队成为最大赢家，多名选手入选首发名单。全明星赛将于本月下旬举行，届时将有solo赛、娱乐赛以及正赛等丰富内容。票务信息已开启预售。", game: "LOL", date: "13小时前", tag: "行业资讯", image: "🎮" },
  { id: "n5", title: "英雄联盟2027赛季赛程正式公布，揭幕战由WBG对阵LNG", summary: "官方正式公布了英雄联盟2027赛季的完整赛程安排，新赛季将于近期拉开帷幕。揭幕战将由WBG对阵LNG，两支队伍在休赛期都进行了阵容补强，这场对决看点十足。常规赛将继续沿用主客场制。", game: "LOL", date: "17小时前", tag: "行业资讯", image: "🎮" },
  { id: "n6", title: "重磅！LNG 明星选手转会加盟 FPX", summary: "据多方消息确认，LNG战队的核心选手正式转会至FPX，转会费创下英雄联盟历史纪录。这名选手在过去两个赛季中表现极为亮眼，多次获得MVP荣誉。新东家对他寄予厚望，相信他能带领队伍重返巅峰。", game: "LOL", date: "21小时前", tag: "转会新闻", image: "🎮" },
  { id: "n7", title: "英雄联盟转会期汇总：iG重建，RNG补强", summary: "英雄联盟转会市场风起云涌，多支战队进行了阵容调整。iG正式宣布重建，老将离队的同时引入多名青训新秀。而RNG则通过精准引援补强了薄弱位置，新赛季阵容令人期待。转会窗口将于下周关闭。", game: "LOL", date: "25小时前", tag: "转会新闻", image: "🎮" },
  { id: "n8", title: "传奇选手宣布退役，RNG英雄联盟传奇谢幕", summary: "在英雄联盟赛场征战八年的传奇选手正式宣布退役。他曾效力于RNG等多支顶级战队，获得过无数荣誉。退役声明中他感谢了粉丝和俱乐部的支持，并表示将继续以教练或解说身份留在电竞行业。", game: "LOL", date: "29小时前", tag: "转会新闻", image: "🎮" },
  { id: "n9", title: "英雄联盟发布重大版本更新，游戏格局将迎来巨变", summary: "英雄联盟开发团队发布了本年度最大规模版本更新，涉及英雄/角色平衡性调整、地图改动以及装备系统重做。专业分析师认为，这些改动将彻底改变当前版本的游戏格局，一些冷门英雄/角色有望回归赛场。", game: "LOL", date: "2天前", tag: "版本更新", image: "🎮" },
  { id: "n10", title: "英雄联盟新版本上线首周数据解读：WE适应最快", summary: "英雄联盟新版本上线已满一周，数据显示WE战队对新版本的适应速度最快，胜率高达75%以上。分析师指出他们的战术体系完美契合了新版本的改动方向。其他队伍也在积极调整战术策略以适应新版本。", game: "LOL", date: "3天前", tag: "版本更新", image: "🎮" },
  { id: "n11", title: "深度解析：JDG 战术体系为何称霸英雄联盟", summary: "本文深入剖析JDG战队在当前英雄联盟版本中的战术体系。从BP策略到野区/地图控制，从对线期到团战配合，全方位解读这支王者之师的制胜之道。他们的打法融合了创新的战术思路和扎实的基本功。", game: "LOL", date: "4天前", tag: "战术分析", image: "🎮" },
  { id: "n12", title: "英雄联盟最新Meta分析：BLG引领战术革命", summary: "当前英雄联盟版本Meta正在经历一场静默的革命，BLG率先采用的全新打法正在被各大战队效仿。本文深入分析这套战术体系的核心思路、执行要点以及克制方法。", game: "LOL", date: "5天前", tag: "战术分析", image: "🎮" },
  { id: "n13", title: "创造历史！EDG 达成英雄联盟130连胜纪录", summary: "EDG在昨晚的比赛中击败TES，正式达成130连胜壮举，刷新了英雄联盟历史最长连胜纪录。这支队伍本赛季展现了恐怖的统治力，所有队员竞技状态火热。", game: "LOL", date: "6天前", tag: "纪录时刻", image: "🎮" },
  { id: "n14", title: "TES核心选手专访：夺冠背后的故事", summary: "在独家专访中，TES的核心选手分享了他从新人到冠军的心路历程。他谈到了训练中的艰辛、团队的支持以及面对压力时的应对方式。他还透露了队伍的战术理念和对未来比赛的展望。", game: "LOL", date: "7天前", tag: "选手专访", image: "🎮" },
  { id: "n15", title: "英雄联盟新人王采访：WBG的希望之星", summary: "年仅18岁的WBG新人选手在短短一个赛季内就成长为队伍的核心力量。在本期专访中，他讲述了自己如何从路人王到职业选手的转变，以及他对当前英雄联盟版本的理解。", game: "LOL", date: "8天前", tag: "选手专访", image: "🎮" },
  { id: "n16", title: "英雄联盟赛事转播权卖出天价，电竞商业化再提速", summary: "据行业媒体报道，英雄联盟赛事的新一轮转播权竞标落下帷幕，成交价格较上一周期大幅上涨。这一数字反映了英雄联盟电竞赛事在全球范围内的持续增长和商业价值。多家传统媒体平台首次加入竞标。", game: "LOL", date: "9天前", tag: "商业动态", image: "🎮" },
  { id: "n17", title: "曝iG获千万级赞助，英雄联盟俱乐部商业化新标杆", summary: "iG俱乐部宣布获得一笔千万级赞助，这不仅是英雄联盟赛区近年来最大规模的商业合作，也为电竞俱乐部的商业化运营树立了新标杆。双方将在品牌营销、内容共创等多个维度展开深度合作。", game: "LOL", date: "10天前", tag: "商业动态", image: "🎮" },
  { id: "n18", title: "RNG 击败 FPX，英雄联盟联赛再下一城", summary: "在昨晚进行的英雄联盟顶级联赛中，RNG战队展现出强大的统治力，以碾压之势战胜FPX。比赛中队伍的核心选手发挥出色，多次打出精彩操作，带领团队取得关键胜利。目前该队在积分榜上排名稳步上升。", game: "LOL", date: "11天前", tag: "赛事速报", image: "🎮" },
  { id: "n19", title: "VALORANT全明星赛阵容公布，EDG多人入选", summary: "备受瞩目的VALORANT全明星赛正式公布参赛阵容，EDG战队成为最大赢家，多名选手入选首发名单。全明星赛将于本月下旬举行，届时将有solo赛、娱乐赛以及正赛等丰富内容。票务信息已开启预售。", game: "VALORANT", date: "10分钟前", tag: "行业资讯", image: "🔫" },
  { id: "n20", title: "VALORANT2027赛季赛程正式公布，揭幕战由ZETA对阵PRX", summary: "官方正式公布了VALORANT2027赛季的完整赛程安排，新赛季将于近期拉开帷幕。揭幕战将由ZETA对阵PRX，两支队伍在休赛期都进行了阵容补强，这场对决看点十足。常规赛将继续沿用主客场制。", game: "VALORANT", date: "4小时前", tag: "行业资讯", image: "🔫" },
  { id: "n21", title: "重磅！PRX 明星选手转会加盟 FNATIC", summary: "据多方消息确认，PRX战队的核心选手正式转会至FNATIC，转会费创下VALORANT历史纪录。这名选手在过去两个赛季中表现极为亮眼，多次获得MVP荣誉。新东家对他寄予厚望，相信他能带领队伍重返巅峰。", game: "VALORANT", date: "6小时前", tag: "转会新闻", image: "🔫" },
  { id: "n22", title: "VALORANT转会期汇总：DRX重建，LOUD补强", summary: "VALORANT转会市场风起云涌，多支战队进行了阵容调整。DRX正式宣布重建，老将离队的同时引入多名青训新秀。而LOUD则通过精准引援补强了薄弱位置，新赛季阵容令人期待。转会窗口将于下周关闭。", game: "VALORANT", date: "13小时前", tag: "转会新闻", image: "🔫" },
  { id: "n23", title: "传奇选手宣布退役，LOUDVALORANT传奇谢幕", summary: "在VALORANT赛场征战八年的传奇选手正式宣布退役。他曾效力于LOUD等多支顶级战队，获得过无数荣誉。退役声明中他感谢了粉丝和俱乐部的支持，并表示将继续以教练或解说身份留在电竞行业。", game: "VALORANT", date: "17小时前", tag: "转会新闻", image: "🔫" },
  { id: "n24", title: "VALORANT发布重大版本更新，游戏格局将迎来巨变", summary: "VALORANT开发团队发布了本年度最大规模版本更新，涉及英雄/角色平衡性调整、地图改动以及装备系统重做。专业分析师认为，这些改动将彻底改变当前版本的游戏格局，一些冷门英雄/角色有望回归赛场。", game: "VALORANT", date: "21小时前", tag: "版本更新", image: "🔫" },
  { id: "n25", title: "VALORANT新版本上线首周数据解读：SEN适应最快", summary: "VALORANT新版本上线已满一周，数据显示SEN战队对新版本的适应速度最快，胜率高达75%以上。分析师指出他们的战术体系完美契合了新版本的改动方向。其他队伍也在积极调整战术策略以适应新版本。", game: "VALORANT", date: "25小时前", tag: "版本更新", image: "🔫" },
  { id: "n26", title: "深度解析：100T 战术体系为何称霸VALORANT", summary: "本文深入剖析100T战队在当前VALORANT版本中的战术体系。从BP策略到野区/地图控制，从对线期到团战配合，全方位解读这支王者之师的制胜之道。他们的打法融合了创新的战术思路和扎实的基本功。", game: "VALORANT", date: "29小时前", tag: "战术分析", image: "🔫" },
  { id: "n27", title: "VALORANT最新Meta分析：EDG引领战术革命", summary: "当前VALORANT版本Meta正在经历一场静默的革命，EDG率先采用的全新打法正在被各大战队效仿。本文深入分析这套战术体系的核心思路、执行要点以及克制方法。", game: "VALORANT", date: "2天前", tag: "战术分析", image: "🔫" },
  { id: "n28", title: "创造历史！ZETA 达成VALORANT100连胜纪录", summary: "ZETA在昨晚的比赛中击败PRX，正式达成100连胜壮举，刷新了VALORANT历史最长连胜纪录。这支队伍本赛季展现了恐怖的统治力，所有队员竞技状态火热。", game: "VALORANT", date: "3天前", tag: "纪录时刻", image: "🔫" },
  { id: "n29", title: "PRX核心选手专访：夺冠背后的故事", summary: "在独家专访中，PRX的核心选手分享了他从新人到冠军的心路历程。他谈到了训练中的艰辛、团队的支持以及面对压力时的应对方式。他还透露了队伍的战术理念和对未来比赛的展望。", game: "VALORANT", date: "4天前", tag: "选手专访", image: "🔫" },
  { id: "n30", title: "VALORANT新人王采访：DRX的希望之星", summary: "年仅18岁的DRX新人选手在短短一个赛季内就成长为队伍的核心力量。在本期专访中，他讲述了自己如何从路人王到职业选手的转变，以及他对当前VALORANT版本的理解。", game: "VALORANT", date: "5天前", tag: "选手专访", image: "🔫" },
  { id: "n31", title: "VALORANT赛事转播权卖出天价，电竞商业化再提速", summary: "据行业媒体报道，VALORANT赛事的新一轮转播权竞标落下帷幕，成交价格较上一周期大幅上涨。这一数字反映了VALORANT电竞赛事在全球范围内的持续增长和商业价值。多家传统媒体平台首次加入竞标。", game: "VALORANT", date: "6天前", tag: "商业动态", image: "🔫" },
  { id: "n32", title: "曝FNATIC获千万级赞助，VALORANT俱乐部商业化新标杆", summary: "FNATIC俱乐部宣布获得一笔千万级赞助，这不仅是VALORANT赛区近年来最大规模的商业合作，也为电竞俱乐部的商业化运营树立了新标杆。双方将在品牌营销、内容共创等多个维度展开深度合作。", game: "VALORANT", date: "7天前", tag: "商业动态", image: "🔫" },
  { id: "n33", title: "SEN 击败 100T，VALORANT联赛再下一城", summary: "在昨晚进行的VALORANT顶级联赛中，SEN战队展现出强大的统治力，以碾压之势战胜100T。比赛中队伍的核心选手发挥出色，多次打出精彩操作，带领团队取得关键胜利。目前该队在积分榜上排名稳步上升。", game: "VALORANT", date: "8天前", tag: "赛事速报", image: "🔫" },
  { id: "n34", title: "惊天逆转！100T 在VALORANT比赛中让二追三", summary: "100T战队在落后两局的情况下展现出惊人的韧性，连扳三局完成史诗级逆转。决胜局中选手们顶住了巨大压力，通过精妙的战术配合与完美的执行力，最终以3:2的比分击败对手。这场比赛必将成为本赛季最经典的战役之一。", game: "VALORANT", date: "9天前", tag: "赛事速报", image: "🔫" },
  { id: "n35", title: "EDG 横扫 PRX 强势晋级VALORANT季后赛", summary: "EDG在季后赛资格关键战中直落三局击败PRX，凭借这场胜利锁定季后赛席位。队伍的战术体系日趋成熟，选手之间的配合愈发默契，展现出冠军相。教练组赛后表示团队状态正在最佳时期。", game: "VALORANT", date: "10天前", tag: "赛事速报", image: "🔫" },
  { id: "n36", title: "VALORANT全明星赛阵容公布，ZETA多人入选", summary: "备受瞩目的VALORANT全明星赛正式公布参赛阵容，ZETA战队成为最大赢家，多名选手入选首发名单。全明星赛将于本月下旬举行，届时将有solo赛、娱乐赛以及正赛等丰富内容。票务信息已开启预售。", game: "VALORANT", date: "11天前", tag: "行业资讯", image: "🔫" },
  { id: "n37", title: "CS2转会期汇总：NAVI重建，VIT补强", summary: "CS2转会市场风起云涌，多支战队进行了阵容调整。NAVI正式宣布重建，老将离队的同时引入多名青训新秀。而VIT则通过精准引援补强了薄弱位置，新赛季阵容令人期待。转会窗口将于下周关闭。", game: "CS2", date: "10分钟前", tag: "转会新闻", image: "🎯" },
  { id: "n38", title: "传奇选手宣布退役，VITCS2传奇谢幕", summary: "在CS2赛场征战八年的传奇选手正式宣布退役。他曾效力于VIT等多支顶级战队，获得过无数荣誉。退役声明中他感谢了粉丝和俱乐部的支持，并表示将继续以教练或解说身份留在电竞行业。", game: "CS2", date: "4小时前", tag: "转会新闻", image: "🎯" },
  { id: "n39", title: "CS2发布重大版本更新，游戏格局将迎来巨变", summary: "CS2开发团队发布了本年度最大规模版本更新，涉及英雄/角色平衡性调整、地图改动以及装备系统重做。专业分析师认为，这些改动将彻底改变当前版本的游戏格局，一些冷门英雄/角色有望回归赛场。", game: "CS2", date: "6小时前", tag: "版本更新", image: "🎯" },
  { id: "n40", title: "CS2新版本上线首周数据解读：G2适应最快", summary: "CS2新版本上线已满一周，数据显示G2战队对新版本的适应速度最快，胜率高达75%以上。分析师指出他们的战术体系完美契合了新版本的改动方向。其他队伍也在积极调整战术策略以适应新版本。", game: "CS2", date: "13小时前", tag: "版本更新", image: "🎯" },
  { id: "n41", title: "深度解析：MOUZ 战术体系为何称霸CS2", summary: "本文深入剖析MOUZ战队在当前CS2版本中的战术体系。从BP策略到野区/地图控制，从对线期到团战配合，全方位解读这支王者之师的制胜之道。他们的打法融合了创新的战术思路和扎实的基本功。", game: "CS2", date: "17小时前", tag: "战术分析", image: "🎯" },
  { id: "n42", title: "CS2最新Meta分析：VP引领战术革命", summary: "当前CS2版本Meta正在经历一场静默的革命，VP率先采用的全新打法正在被各大战队效仿。本文深入分析这套战术体系的核心思路、执行要点以及克制方法。", game: "CS2", date: "21小时前", tag: "战术分析", image: "🎯" },
  { id: "n43", title: "创造历史！Cloud9 达成CS270连胜纪录", summary: "Cloud9在昨晚的比赛中击败ENCE，正式达成70连胜壮举，刷新了CS2历史最长连胜纪录。这支队伍本赛季展现了恐怖的统治力，所有队员竞技状态火热。", game: "CS2", date: "25小时前", tag: "纪录时刻", image: "🎯" },
  { id: "n44", title: "ENCE核心选手专访：夺冠背后的故事", summary: "在独家专访中，ENCE的核心选手分享了他从新人到冠军的心路历程。他谈到了训练中的艰辛、团队的支持以及面对压力时的应对方式。他还透露了队伍的战术理念和对未来比赛的展望。", game: "CS2", date: "29小时前", tag: "选手专访", image: "🎯" },
  { id: "n45", title: "CS2新人王采访：NAVI的希望之星", summary: "年仅18岁的NAVI新人选手在短短一个赛季内就成长为队伍的核心力量。在本期专访中，他讲述了自己如何从路人王到职业选手的转变，以及他对当前CS2版本的理解。", game: "CS2", date: "2天前", tag: "选手专访", image: "🎯" },
  { id: "n46", title: "CS2赛事转播权卖出天价，电竞商业化再提速", summary: "据行业媒体报道，CS2赛事的新一轮转播权竞标落下帷幕，成交价格较上一周期大幅上涨。这一数字反映了CS2电竞赛事在全球范围内的持续增长和商业价值。多家传统媒体平台首次加入竞标。", game: "CS2", date: "3天前", tag: "商业动态", image: "🎯" },
  { id: "n47", title: "曝FaZe获千万级赞助，CS2俱乐部商业化新标杆", summary: "FaZe俱乐部宣布获得一笔千万级赞助，这不仅是CS2赛区近年来最大规模的商业合作，也为电竞俱乐部的商业化运营树立了新标杆。双方将在品牌营销、内容共创等多个维度展开深度合作。", game: "CS2", date: "4天前", tag: "商业动态", image: "🎯" },
  { id: "n48", title: "G2 击败 MOUZ，CS2联赛再下一城", summary: "在昨晚进行的CS2顶级联赛中，G2战队展现出强大的统治力，以碾压之势战胜MOUZ。比赛中队伍的核心选手发挥出色，多次打出精彩操作，带领团队取得关键胜利。目前该队在积分榜上排名稳步上升。", game: "CS2", date: "5天前", tag: "赛事速报", image: "🎯" },
  { id: "n49", title: "惊天逆转！MOUZ 在CS2比赛中让二追三", summary: "MOUZ战队在落后两局的情况下展现出惊人的韧性，连扳三局完成史诗级逆转。决胜局中选手们顶住了巨大压力，通过精妙的战术配合与完美的执行力，最终以3:2的比分击败对手。这场比赛必将成为本赛季最经典的战役之一。", game: "CS2", date: "6天前", tag: "赛事速报", image: "🎯" },
  { id: "n50", title: "VP 横扫 ENCE 强势晋级CS2季后赛", summary: "VP在季后赛资格关键战中直落三局击败ENCE，凭借这场胜利锁定季后赛席位。队伍的战术体系日趋成熟，选手之间的配合愈发默契，展现出冠军相。教练组赛后表示团队状态正在最佳时期。", game: "CS2", date: "7天前", tag: "赛事速报", image: "🎯" },
  { id: "n51", title: "CS2全明星赛阵容公布，Cloud9多人入选", summary: "备受瞩目的CS2全明星赛正式公布参赛阵容，Cloud9战队成为最大赢家，多名选手入选首发名单。全明星赛将于本月下旬举行，届时将有solo赛、娱乐赛以及正赛等丰富内容。票务信息已开启预售。", game: "CS2", date: "8天前", tag: "行业资讯", image: "🎯" },
  { id: "n52", title: "CS22026赛季赛程正式公布，揭幕战由ENCE对阵NAVI", summary: "官方正式公布了CS22026赛季的完整赛程安排，新赛季将于近期拉开帷幕。揭幕战将由ENCE对阵NAVI，两支队伍在休赛期都进行了阵容补强，这场对决看点十足。常规赛将继续沿用主客场制。", game: "CS2", date: "9天前", tag: "行业资讯", image: "🎯" },
  { id: "n53", title: "重磅！NAVI 明星选手转会加盟 G2", summary: "据多方消息确认，NAVI战队的核心选手正式转会至G2，转会费创下CS2历史纪录。这名选手在过去两个赛季中表现极为亮眼，多次获得MVP荣誉。新东家对他寄予厚望，相信他能带领队伍重返巅峰。", game: "CS2", date: "10天前", tag: "转会新闻", image: "🎯" },
  { id: "n54", title: "CS2转会期汇总：VIT重建，FaZe补强", summary: "CS2转会市场风起云涌，多支战队进行了阵容调整。VIT正式宣布重建，老将离队的同时引入多名青训新秀。而FaZe则通过精准引援补强了薄弱位置，新赛季阵容令人期待。转会窗口将于下周关闭。", game: "CS2", date: "11天前", tag: "转会新闻", image: "🎯" },
  { id: "n55", title: "DOTA2新版本上线首周数据解读：TSP适应最快", summary: "DOTA2新版本上线已满一周，数据显示TSP战队对新版本的适应速度最快，胜率高达75%以上。分析师指出他们的战术体系完美契合了新版本的改动方向。其他队伍也在积极调整战术策略以适应新版本。", game: "DOTA2", date: "10分钟前", tag: "版本更新", image: "🗡️" },
  { id: "n56", title: "深度解析：LGD 战术体系为何称霸DOTA2", summary: "本文深入剖析LGD战队在当前DOTA2版本中的战术体系。从BP策略到野区/地图控制，从对线期到团战配合，全方位解读这支王者之师的制胜之道。他们的打法融合了创新的战术思路和扎实的基本功。", game: "DOTA2", date: "4小时前", tag: "战术分析", image: "🗡️" },
  { id: "n57", title: "DOTA2最新Meta分析：OG引领战术革命", summary: "当前DOTA2版本Meta正在经历一场静默的革命，OG率先采用的全新打法正在被各大战队效仿。本文深入分析这套战术体系的核心思路、执行要点以及克制方法。", game: "DOTA2", date: "6小时前", tag: "战术分析", image: "🗡️" },
  { id: "n58", title: "创造历史！TL 达成DOTA240连胜纪录", summary: "TL在昨晚的比赛中击败GG，正式达成40连胜壮举，刷新了DOTA2历史最长连胜纪录。这支队伍本赛季展现了恐怖的统治力，所有队员竞技状态火热。", game: "DOTA2", date: "13小时前", tag: "纪录时刻", image: "🗡️" },
  { id: "n59", title: "GG核心选手专访：夺冠背后的故事", summary: "在独家专访中，GG的核心选手分享了他从新人到冠军的心路历程。他谈到了训练中的艰辛、团队的支持以及面对压力时的应对方式。他还透露了队伍的战术理念和对未来比赛的展望。", game: "DOTA2", date: "17小时前", tag: "选手专访", image: "🗡️" },
  { id: "n60", title: "DOTA2新人王采访：BC的希望之星", summary: "年仅18岁的BC新人选手在短短一个赛季内就成长为队伍的核心力量。在本期专访中，他讲述了自己如何从路人王到职业选手的转变，以及他对当前DOTA2版本的理解。", game: "DOTA2", date: "21小时前", tag: "选手专访", image: "🗡️" },
  { id: "n61", title: "DOTA2赛事转播权卖出天价，电竞商业化再提速", summary: "据行业媒体报道，DOTA2赛事的新一轮转播权竞标落下帷幕，成交价格较上一周期大幅上涨。这一数字反映了DOTA2电竞赛事在全球范围内的持续增长和商业价值。多家传统媒体平台首次加入竞标。", game: "DOTA2", date: "25小时前", tag: "商业动态", image: "🗡️" },
  { id: "n62", title: "曝Aurora获千万级赞助，DOTA2俱乐部商业化新标杆", summary: "Aurora俱乐部宣布获得一笔千万级赞助，这不仅是DOTA2赛区近年来最大规模的商业合作，也为电竞俱乐部的商业化运营树立了新标杆。双方将在品牌营销、内容共创等多个维度展开深度合作。", game: "DOTA2", date: "29小时前", tag: "商业动态", image: "🗡️" },
  { id: "n63", title: "TSP 击败 LGD，DOTA2联赛再下一城", summary: "在昨晚进行的DOTA2顶级联赛中，TSP战队展现出强大的统治力，以碾压之势战胜LGD。比赛中队伍的核心选手发挥出色，多次打出精彩操作，带领团队取得关键胜利。目前该队在积分榜上排名稳步上升。", game: "DOTA2", date: "2天前", tag: "赛事速报", image: "🗡️" },
  { id: "n64", title: "惊天逆转！LGD 在DOTA2比赛中让二追三", summary: "LGD战队在落后两局的情况下展现出惊人的韧性，连扳三局完成史诗级逆转。决胜局中选手们顶住了巨大压力，通过精妙的战术配合与完美的执行力，最终以3:2的比分击败对手。这场比赛必将成为本赛季最经典的战役之一。", game: "DOTA2", date: "3天前", tag: "赛事速报", image: "🗡️" },
  { id: "n65", title: "OG 横扫 GG 强势晋级DOTA2季后赛", summary: "OG在季后赛资格关键战中直落三局击败GG，凭借这场胜利锁定季后赛席位。队伍的战术体系日趋成熟，选手之间的配合愈发默契，展现出冠军相。教练组赛后表示团队状态正在最佳时期。", game: "DOTA2", date: "4天前", tag: "赛事速报", image: "🗡️" },
  { id: "n66", title: "DOTA2全明星赛阵容公布，TL多人入选", summary: "备受瞩目的DOTA2全明星赛正式公布参赛阵容，TL战队成为最大赢家，多名选手入选首发名单。全明星赛将于本月下旬举行，届时将有solo赛、娱乐赛以及正赛等丰富内容。票务信息已开启预售。", game: "DOTA2", date: "5天前", tag: "行业资讯", image: "🗡️" },
  { id: "n67", title: "DOTA22026赛季赛程正式公布，揭幕战由GG对阵BC", summary: "官方正式公布了DOTA22026赛季的完整赛程安排，新赛季将于近期拉开帷幕。揭幕战将由GG对阵BC，两支队伍在休赛期都进行了阵容补强，这场对决看点十足。常规赛将继续沿用主客场制。", game: "DOTA2", date: "6天前", tag: "行业资讯", image: "🗡️" },
  { id: "n68", title: "重磅！BC 明星选手转会加盟 TSP", summary: "据多方消息确认，BC战队的核心选手正式转会至TSP，转会费创下DOTA2历史纪录。这名选手在过去两个赛季中表现极为亮眼，多次获得MVP荣誉。新东家对他寄予厚望，相信他能带领队伍重返巅峰。", game: "DOTA2", date: "7天前", tag: "转会新闻", image: "🗡️" },
  { id: "n69", title: "DOTA2转会期汇总：Tundra重建，Aurora补强", summary: "DOTA2转会市场风起云涌，多支战队进行了阵容调整。Tundra正式宣布重建，老将离队的同时引入多名青训新秀。而Aurora则通过精准引援补强了薄弱位置，新赛季阵容令人期待。转会窗口将于下周关闭。", game: "DOTA2", date: "8天前", tag: "转会新闻", image: "🗡️" },
  { id: "n70", title: "传奇选手宣布退役，AuroraDOTA2传奇谢幕", summary: "在DOTA2赛场征战八年的传奇选手正式宣布退役。他曾效力于Aurora等多支顶级战队，获得过无数荣誉。退役声明中他感谢了粉丝和俱乐部的支持，并表示将继续以教练或解说身份留在电竞行业。", game: "DOTA2", date: "9天前", tag: "转会新闻", image: "🗡️" },
  { id: "n71", title: "DOTA2发布重大版本更新，游戏格局将迎来巨变", summary: "DOTA2开发团队发布了本年度最大规模版本更新，涉及英雄/角色平衡性调整、地图改动以及装备系统重做。专业分析师认为，这些改动将彻底改变当前版本的游戏格局，一些冷门英雄/角色有望回归赛场。", game: "DOTA2", date: "10天前", tag: "版本更新", image: "🗡️" },
  { id: "n72", title: "DOTA2新版本上线首周数据解读：LGD适应最快", summary: "DOTA2新版本上线已满一周，数据显示LGD战队对新版本的适应速度最快，胜率高达75%以上。分析师指出他们的战术体系完美契合了新版本的改动方向。其他队伍也在积极调整战术策略以适应新版本。", game: "DOTA2", date: "11天前", tag: "版本更新", image: "🗡️" },
  { id: "n73", title: "创造历史！4AM 达成PUBG10连胜纪录", summary: "4AM在昨晚的比赛中击败Nova，正式达成10连胜壮举，刷新了PUBG历史最长连胜纪录。这支队伍本赛季展现了恐怖的统治力，所有队员竞技状态火热。", game: "PUBG", date: "10分钟前", tag: "纪录时刻", image: "🪖" },
  { id: "n74", title: "Nova核心选手专访：夺冠背后的故事", summary: "在独家专访中，Nova的核心选手分享了他从新人到冠军的心路历程。他谈到了训练中的艰辛、团队的支持以及面对压力时的应对方式。他还透露了队伍的战术理念和对未来比赛的展望。", game: "PUBG", date: "4小时前", tag: "选手专访", image: "🪖" },
  { id: "n75", title: "PUBG新人王采访：Tianba的希望之星", summary: "年仅18岁的Tianba新人选手在短短一个赛季内就成长为队伍的核心力量。在本期专访中，他讲述了自己如何从路人王到职业选手的转变，以及他对当前PUBG版本的理解。", game: "PUBG", date: "6小时前", tag: "选手专访", image: "🪖" },
  { id: "n76", title: "PUBG赛事转播权卖出天价，电竞商业化再提速", summary: "据行业媒体报道，PUBG赛事的新一轮转播权竞标落下帷幕，成交价格较上一周期大幅上涨。这一数字反映了PUBG电竞赛事在全球范围内的持续增长和商业价值。多家传统媒体平台首次加入竞标。", game: "PUBG", date: "13小时前", tag: "商业动态", image: "🪖" },
  { id: "n77", title: "曝17Gaming获千万级赞助，PUBG俱乐部商业化新标杆", summary: "17Gaming俱乐部宣布获得一笔千万级赞助，这不仅是PUBG赛区近年来最大规模的商业合作，也为电竞俱乐部的商业化运营树立了新标杆。双方将在品牌营销、内容共创等多个维度展开深度合作。", game: "PUBG", date: "17小时前", tag: "商业动态", image: "🪖" },
  { id: "n78", title: "NH 击败 MCG，PUBG联赛再下一城", summary: "在昨晚进行的PUBG顶级联赛中，NH战队展现出强大的统治力，以碾压之势战胜MCG。比赛中队伍的核心选手发挥出色，多次打出精彩操作，带领团队取得关键胜利。目前该队在积分榜上排名稳步上升。", game: "PUBG", date: "21小时前", tag: "赛事速报", image: "🪖" },
  { id: "n79", title: "惊天逆转！MCG 在PUBG比赛中让二追三", summary: "MCG战队在落后两局的情况下展现出惊人的韧性，连扳三局完成史诗级逆转。决胜局中选手们顶住了巨大压力，通过精妙的战术配合与完美的执行力，最终以3:2的比分击败对手。这场比赛必将成为本赛季最经典的战役之一。", game: "PUBG", date: "25小时前", tag: "赛事速报", image: "🪖" },
  { id: "n80", title: "4AM 横扫 Tianba 强势晋级PUBG季后赛", summary: "4AM在季后赛资格关键战中直落三局击败Tianba，凭借这场胜利锁定季后赛席位。队伍的战术体系日趋成熟，选手之间的配合愈发默契，展现出冠军相。教练组赛后表示团队状态正在最佳时期。", game: "PUBG", date: "29小时前", tag: "赛事速报", image: "🪖" },
  { id: "n81", title: "PUBG全明星赛阵容公布，Nova多人入选", summary: "备受瞩目的PUBG全明星赛正式公布参赛阵容，Nova战队成为最大赢家，多名选手入选首发名单。全明星赛将于本月下旬举行，届时将有solo赛、娱乐赛以及正赛等丰富内容。票务信息已开启预售。", game: "PUBG", date: "2天前", tag: "行业资讯", image: "🪖" },
  { id: "n82", title: "PUBG2026赛季赛程正式公布，揭幕战由Tianba对阵PeRo", summary: "官方正式公布了PUBG2026赛季的完整赛程安排，新赛季将于近期拉开帷幕。揭幕战将由Tianba对阵PeRo，两支队伍在休赛期都进行了阵容补强，这场对决看点十足。常规赛将继续沿用主客场制。", game: "PUBG", date: "3天前", tag: "行业资讯", image: "🪖" },
  { id: "n83", title: "重磅！PeRo 明星选手转会加盟 MCG", summary: "据多方消息确认，PeRo战队的核心选手正式转会至MCG，转会费创下PUBG历史纪录。这名选手在过去两个赛季中表现极为亮眼，多次获得MVP荣誉。新东家对他寄予厚望，相信他能带领队伍重返巅峰。", game: "PUBG", date: "4天前", tag: "转会新闻", image: "🪖" },
  { id: "n84", title: "PUBG转会期汇总：17Gaming重建，NH补强", summary: "PUBG转会市场风起云涌，多支战队进行了阵容调整。17Gaming正式宣布重建，老将离队的同时引入多名青训新秀。而NH则通过精准引援补强了薄弱位置，新赛季阵容令人期待。转会窗口将于下周关闭。", game: "PUBG", date: "5天前", tag: "转会新闻", image: "🪖" },
  { id: "n85", title: "传奇选手宣布退役，NHPUBG传奇谢幕", summary: "在PUBG赛场征战八年的传奇选手正式宣布退役。他曾效力于NH等多支顶级战队，获得过无数荣誉。退役声明中他感谢了粉丝和俱乐部的支持，并表示将继续以教练或解说身份留在电竞行业。", game: "PUBG", date: "6天前", tag: "转会新闻", image: "🪖" },
  { id: "n86", title: "PUBG发布重大版本更新，游戏格局将迎来巨变", summary: "PUBG开发团队发布了本年度最大规模版本更新，涉及英雄/角色平衡性调整、地图改动以及装备系统重做。专业分析师认为，这些改动将彻底改变当前版本的游戏格局，一些冷门英雄/角色有望回归赛场。", game: "PUBG", date: "7天前", tag: "版本更新", image: "🪖" },
  { id: "n87", title: "PUBG新版本上线首周数据解读：4AM适应最快", summary: "PUBG新版本上线已满一周，数据显示4AM战队对新版本的适应速度最快，胜率高达75%以上。分析师指出他们的战术体系完美契合了新版本的改动方向。其他队伍也在积极调整战术策略以适应新版本。", game: "PUBG", date: "8天前", tag: "版本更新", image: "🪖" },
  { id: "n88", title: "深度解析：Nova 战术体系为何称霸PUBG", summary: "本文深入剖析Nova战队在当前PUBG版本中的战术体系。从BP策略到野区/地图控制，从对线期到团战配合，全方位解读这支王者之师的制胜之道。他们的打法融合了创新的战术思路和扎实的基本功。", game: "PUBG", date: "9天前", tag: "战术分析", image: "🪖" },
  { id: "n89", title: "PUBG最新Meta分析：Tianba引领战术革命", summary: "当前PUBG版本Meta正在经历一场静默的革命，Tianba率先采用的全新打法正在被各大战队效仿。本文深入分析这套战术体系的核心思路、执行要点以及克制方法。", game: "PUBG", date: "10天前", tag: "战术分析", image: "🪖" },
  { id: "n90", title: "创造历史！PeRo 达成PUBG180连胜纪录", summary: "PeRo在昨晚的比赛中击败17Gaming，正式达成180连胜壮举，刷新了PUBG历史最长连胜纪录。这支队伍本赛季展现了恐怖的统治力，所有队员竞技状态火热。", game: "PUBG", date: "11天前", tag: "纪录时刻", image: "🪖" },
  { id: "n91", title: "王者荣耀赛事转播权卖出天价，电竞商业化再提速", summary: "据行业媒体报道，王者荣耀赛事的新一轮转播权竞标落下帷幕，成交价格较上一周期大幅上涨。这一数字反映了王者荣耀电竞赛事在全球范围内的持续增长和商业价值。多家传统媒体平台首次加入竞标。", game: "HONOR", date: "10分钟前", tag: "商业动态", image: "👑" },
  { id: "n92", title: "曝TTG获千万级赞助，王者荣耀俱乐部商业化新标杆", summary: "TTG俱乐部宣布获得一笔千万级赞助，这不仅是王者荣耀赛区近年来最大规模的商业合作，也为电竞俱乐部的商业化运营树立了新标杆。双方将在品牌营销、内容共创等多个维度展开深度合作。", game: "HONOR", date: "4小时前", tag: "商业动态", image: "👑" },
  { id: "n93", title: "eStar 击败 Wolves，王者荣耀联赛再下一城", summary: "在昨晚进行的王者荣耀顶级联赛中，eStar战队展现出强大的统治力，以碾压之势战胜Wolves。比赛中队伍的核心选手发挥出色，多次打出精彩操作，带领团队取得关键胜利。目前该队在积分榜上排名稳步上升。", game: "HONOR", date: "6小时前", tag: "赛事速报", image: "👑" },
  { id: "n94", title: "惊天逆转！Wolves 在王者荣耀比赛中让二追三", summary: "Wolves战队在落后两局的情况下展现出惊人的韧性，连扳三局完成史诗级逆转。决胜局中选手们顶住了巨大压力，通过精妙的战术配合与完美的执行力，最终以3:2的比分击败对手。这场比赛必将成为本赛季最经典的战役之一。", game: "HONOR", date: "13小时前", tag: "赛事速报", image: "👑" },
  { id: "n95", title: "AG 横扫 GK 强势晋级王者荣耀季后赛", summary: "AG在季后赛资格关键战中直落三局击败GK，凭借这场胜利锁定季后赛席位。队伍的战术体系日趋成熟，选手之间的配合愈发默契，展现出冠军相。教练组赛后表示团队状态正在最佳时期。", game: "HONOR", date: "17小时前", tag: "赛事速报", image: "👑" },
  { id: "n96", title: "王者荣耀全明星赛阵容公布，DYG多人入选", summary: "备受瞩目的王者荣耀全明星赛正式公布参赛阵容，DYG战队成为最大赢家，多名选手入选首发名单。全明星赛将于本月下旬举行，届时将有solo赛、娱乐赛以及正赛等丰富内容。票务信息已开启预售。", game: "HONOR", date: "21小时前", tag: "行业资讯", image: "👑" },
  { id: "n97", title: "王者荣耀2026赛季赛程正式公布，揭幕战由GK对阵WB", summary: "官方正式公布了王者荣耀2026赛季的完整赛程安排，新赛季将于近期拉开帷幕。揭幕战将由GK对阵WB，两支队伍在休赛期都进行了阵容补强，这场对决看点十足。常规赛将继续沿用主客场制。", game: "HONOR", date: "25小时前", tag: "行业资讯", image: "👑" },
  { id: "n98", title: "重磅！WB 明星选手转会加盟 eStar", summary: "据多方消息确认，WB战队的核心选手正式转会至eStar，转会费创下王者荣耀历史纪录。这名选手在过去两个赛季中表现极为亮眼，多次获得MVP荣誉。新东家对他寄予厚望，相信他能带领队伍重返巅峰。", game: "HONOR", date: "29小时前", tag: "转会新闻", image: "👑" },
  { id: "n99", title: "王者荣耀转会期汇总：Hero重建，TTG补强", summary: "王者荣耀转会市场风起云涌，多支战队进行了阵容调整。Hero正式宣布重建，老将离队的同时引入多名青训新秀。而TTG则通过精准引援补强了薄弱位置，新赛季阵容令人期待。转会窗口将于下周关闭。", game: "HONOR", date: "2天前", tag: "转会新闻", image: "👑" },
  { id: "n100", title: "传奇选手宣布退役，TTG王者荣耀传奇谢幕", summary: "在王者荣耀赛场征战八年的传奇选手正式宣布退役。他曾效力于TTG等多支顶级战队，获得过无数荣誉。退役声明中他感谢了粉丝和俱乐部的支持，并表示将继续以教练或解说身份留在电竞行业。", game: "HONOR", date: "3天前", tag: "转会新闻", image: "👑" },
  { id: "n101", title: "王者荣耀发布重大版本更新，游戏格局将迎来巨变", summary: "王者荣耀开发团队发布了本年度最大规模版本更新，涉及英雄/角色平衡性调整、地图改动以及装备系统重做。专业分析师认为，这些改动将彻底改变当前版本的游戏格局，一些冷门英雄/角色有望回归赛场。", game: "HONOR", date: "4天前", tag: "版本更新", image: "👑" },
  { id: "n102", title: "王者荣耀新版本上线首周数据解读：Wolves适应最快", summary: "王者荣耀新版本上线已满一周，数据显示Wolves战队对新版本的适应速度最快，胜率高达75%以上。分析师指出他们的战术体系完美契合了新版本的改动方向。其他队伍也在积极调整战术策略以适应新版本。", game: "HONOR", date: "5天前", tag: "版本更新", image: "👑" },
  { id: "n103", title: "深度解析：AG 战术体系为何称霸王者荣耀", summary: "本文深入剖析AG战队在当前王者荣耀版本中的战术体系。从BP策略到野区/地图控制，从对线期到团战配合，全方位解读这支王者之师的制胜之道。他们的打法融合了创新的战术思路和扎实的基本功。", game: "HONOR", date: "6天前", tag: "战术分析", image: "👑" },
  { id: "n104", title: "王者荣耀最新Meta分析：DYG引领战术革命", summary: "当前王者荣耀版本Meta正在经历一场静默的革命，DYG率先采用的全新打法正在被各大战队效仿。本文深入分析这套战术体系的核心思路、执行要点以及克制方法。", game: "HONOR", date: "7天前", tag: "战术分析", image: "👑" },
  { id: "n105", title: "创造历史！GK 达成王者荣耀150连胜纪录", summary: "GK在昨晚的比赛中击败WB，正式达成150连胜壮举，刷新了王者荣耀历史最长连胜纪录。这支队伍本赛季展现了恐怖的统治力，所有队员竞技状态火热。", game: "HONOR", date: "8天前", tag: "纪录时刻", image: "👑" },
  { id: "n106", title: "WB核心选手专访：夺冠背后的故事", summary: "在独家专访中，WB的核心选手分享了他从新人到冠军的心路历程。他谈到了训练中的艰辛、团队的支持以及面对压力时的应对方式。他还透露了队伍的战术理念和对未来比赛的展望。", game: "HONOR", date: "9天前", tag: "选手专访", image: "👑" },
  { id: "n107", title: "王者荣耀新人王采访：Hero的希望之星", summary: "年仅18岁的Hero新人选手在短短一个赛季内就成长为队伍的核心力量。在本期专访中，他讲述了自己如何从路人王到职业选手的转变，以及他对当前王者荣耀版本的理解。", game: "HONOR", date: "10天前", tag: "选手专访", image: "👑" },
  { id: "n108", title: "王者荣耀赛事转播权卖出天价，电竞商业化再提速", summary: "据行业媒体报道，王者荣耀赛事的新一轮转播权竞标落下帷幕，成交价格较上一周期大幅上涨。这一数字反映了王者荣耀电竞赛事在全球范围内的持续增长和商业价值。多家传统媒体平台首次加入竞标。", game: "HONOR", date: "11天前", tag: "商业动态", image: "👑" },
  { id: "n109", title: "2026全球电竞产业报告：市场规模突破千亿", summary: "最新发布的全球电竞产业报告显示，2026年电竞市场规模首次突破千亿大关。移动电竞和PC电竞同步增长，中国市场贡献了全球约三分之一的收入。报告还指出电竞教育、电竞旅游等衍生领域正在快速崛起。", game: "LOL", date: "5天前", tag: "行业资讯", image: "📊" },
  { id: "n110", title: "亚运会电竞项目名单公布，六大项目入选", summary: "官方正式公布了下一届亚运会电竞项目名单，共六个项目入选。此次入选标志着电竞在体育化道路上迈出了重要一步。各国电竞协会已经开始筹备国家队选拔和集训工作。", game: "LOL", date: "7天前", tag: "行业资讯", image: "🏅" },
  { id: "n111", title: "高校电竞专业毕业生成香饽饽，就业率超95%", summary: "随着电竞产业的蓬勃发展，首批电竞专业毕业生成为就业市场的抢手资源。据统计，电竞相关专业毕业生的就业率超过95%，远高于平均水平。他们主要进入赛事运营、俱乐部管理、内容制作等领域。", game: "LOL", date: "11天前", tag: "行业资讯", image: "🎓" },
  { id: "n112", title: "电竞选手健康管理引关注，多家俱乐部设立专属医疗团队", summary: "随着电竞职业化程度的提高，选手健康问题日益受到重视。多家顶级俱乐部宣布成立专属医疗团队，为选手提供身体和心理健康的全方位保障。健康管理已成为俱乐部运营的重要一环。", game: "LOL", date: "8天前", tag: "行业资讯", image: "🏥" },
  { id: "n113", title: "AI技术在电竞领域应用加速，数据分析成制胜关键", summary: "人工智能技术正在深度改变电竞行业的运作方式。从选手训练辅助到赛事战术分析，从观众体验优化到内容自动生成，AI的应用场景不断扩展。多位业内人士认为AI将成为未来电竞竞争的核心因素。", game: "LOL", date: "10天前", tag: "行业资讯", image: "🤖" },
  { id: "n114", title: "女性电竞选手数量激增，电竞多元化趋势明显", summary: "最新数据显示，全球女性电竞选手数量在过去两年中增长了超过150%。各大联赛纷纷设立女子赛事，俱乐部也开始组建女子战队。电竞行业的多元化和平等化趋势正在加速。", game: "LOL", date: "7天前", tag: "行业资讯", image: "👩" },
  { id: "n115", title: "电竞观赛方式革新：VR直播技术全面商用", summary: "VR直播技术正式在顶级电竞赛事中全面商用，观众现在可以通过VR设备身临其境地观看比赛。这项技术提供了全新的观赛视角，包括选手第一人称视角、自由视角切换等革命性功能。", game: "LOL", date: "4天前", tag: "行业资讯", image: "🥽" },
  { id: "n116", title: "电竞+文旅模式走红：多地打造电竞主题城市名片", summary: "多个城市正在积极打造电竞主题文旅项目，通过电竞赛事带动地方经济发展。电竞主题酒店、电竞博物馆、电竞主题公园等新业态不断涌现，成为城市文化新名片。", game: "LOL", date: "4天前", tag: "行业资讯", image: "🏙️" },
  { id: "n117", title: "区块链技术在电竞领域的应用探索：NFT门票与数字藏品", summary: "多家电竞赛事组织方开始探索区块链技术的应用，推出NFT数字门票和赛事纪念数字藏品。这些创新不仅为赛事增加了新的收入来源，也为粉丝提供了独特的收藏体验。", game: "LOL", date: "9天前", tag: "行业资讯", image: "⛓️" },
  { id: "n118", title: "电竞教练职业化发展：顶级教练年薪突破百万", summary: "随着电竞职业化程度加深，教练岗位的重要性日益凸显。顶级战队的教练年薪已突破百万级别，越来越多的传统体育教练和数据分析师跨界加入电竞行业。", game: "LOL", date: "6天前", tag: "行业资讯", image: "📋" },
];

