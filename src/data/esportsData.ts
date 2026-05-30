export type GameType = 'LOL' | 'CS2' | 'DOTA2' | 'VALORANT' | 'PUBG' | 'HONOR' | 'DELTA' | 'AB' | 'JCC' | 'OJ';

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
  { id: 'DELTA', name: '三角洲行动', color: '#CD7F32', bgColor: 'rgba(205,127,50,0.15)', emoji: '🦅' },
  { id: 'AB', name: '暗区突围', color: '#2E8B57', bgColor: 'rgba(46,139,87,0.15)', emoji: '🎒' },
  { id: 'JCC', name: '金铲铲之战', color: '#FFD700', bgColor: 'rgba(255,215,0,0.15)', emoji: '🪙' },
  { id: 'OJ', name: '决战平安京', color: '#E87CC4', bgColor: 'rgba(232,124,196,0.15)', emoji: '⛩️' },
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
  {
    id: 'm16',
    game: 'DELTA',
    tournament: '烽火职业联赛',
    stage: '夏季赛 第1周',
    teamA: { name: 'TES战队', shortName: 'TES', logo: '⚡', score: 2 },
    teamB: { name: 'TEC战队', shortName: 'TEC', logo: '🛡️', score: 0 },
    status: 'live',
    startTime: '今日 18:00',
    viewers: 356000,
    bestOf: 3,
  },
  {
    id: 'm17',
    game: 'AB',
    tournament: '暗区大师赛',
    stage: '海选赛 第3周',
    teamA: { name: '臭宝队', shortName: '臭宝', logo: '💎' },
    teamB: { name: '天霸队', shortName: '天霸', logo: '⚡' },
    status: 'upcoming',
    startTime: '今日 20:00',
    bestOf: 1,
  },
  {
    id: 'm18',
    game: 'JCC',
    tournament: 'JOC 2026夏季赛',
    stage: '精英巡回赛',
    teamA: { name: 'WBG.潇之助', shortName: '潇之助', logo: '🪙' },
    teamB: { name: '叶神.不言', shortName: '不言', logo: '🍃' },
    status: 'live',
    startTime: '今日 16:00',
    viewers: 528000,
    bestOf: 1,
  },
  {
    id: 'm19',
    game: 'OJ',
    tournament: 'OPL 2026夏季赛',
    stage: '常规赛 第5周',
    teamA: { name: 'LF战队', shortName: 'LF', logo: '🦁' },
    teamB: { name: 'OMG战队', shortName: 'OMG', logo: '🌊' },
    status: 'live',
    startTime: '今日 18:00',
    viewers: 312000,
    bestOf: 5,
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
  {
    id: 't15',
    name: '三角洲行动烽火职业联赛',
    game: 'DELTA',
    logo: '🦅',
    prizePool: '¥500万',
    startDate: '2026-03-25',
    endDate: '2026-08-30',
    status: 'ongoing',
    region: '中国',
    teams: 12,
  },
  {
    id: 't16',
    name: '暗区大师赛2026',
    game: 'AB',
    logo: '🎒',
    prizePool: '¥350,000',
    startDate: '2026-05-08',
    endDate: '2026-07-18',
    status: 'ongoing',
    region: '中国',
    teams: 30,
  },
  {
    id: 't17',
    name: 'JOC 2026夏季赛',
    game: 'JCC',
    logo: '🪙',
    prizePool: '¥200万',
    startDate: '2026-04-10',
    endDate: '2026-07-20',
    status: 'ongoing',
    region: '中国',
    teams: 64,
  },
  {
    id: 't18',
    name: 'OPL 2026夏季赛',
    game: 'OJ',
    logo: '⛩️',
    prizePool: '¥300万',
    startDate: '2026-04-15',
    endDate: '2026-08-15',
    status: 'ongoing',
    region: '中国',
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
  // DELTA additional
  { id: 's53', name: 'TES战队', shortName: 'TES', logo: '⚡', region: '中国', wins: 18, losses: 4, winRate: 81.8, points: 36, game: 'DELTA' },
  { id: 's54', name: 'TEC战队', shortName: 'TEC', logo: '🛡️', region: '中国', wins: 16, losses: 6, winRate: 72.7, points: 32, game: 'DELTA' },
  { id: 's55', name: 'JDG战队', shortName: 'JDG', logo: '🐉', region: '中国', wins: 14, losses: 8, winRate: 63.6, points: 28, game: 'DELTA' },
  { id: 's56', name: 'NOVA战队', shortName: 'NOVA', logo: '🌟', region: '中国', wins: 12, losses: 10, winRate: 54.5, points: 24, game: 'DELTA' },
  // AB additional
  { id: 's57', name: '臭宝队', shortName: '臭宝', logo: '💎', region: '中国', wins: 22, losses: 4, winRate: 84.6, points: 44, game: 'AB' },
  { id: 's58', name: '天霸队', shortName: '天霸', logo: '⚡', region: '中国', wins: 19, losses: 7, winRate: 73.1, points: 38, game: 'AB' },
];

// Proxy (Cloudflare Worker 或 Deno Deploy)
// 部署 Cloudflare Worker: 将 workers/cloudflare-worker.mjs 粘贴到 Cloudflare Dashboard
// 部署后把下面 URL 替换为你的 worker 域名
const PROXY_URL = 'https://dry-tooth-2d36.haoyunmeimei520.workers.dev';

// 支持中英文队伍名的 vs 匹配
function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, '').trim();
}

function extractTeams(title: string): [string, string] | null {
  const clean = stripHtml(title).replace(/^[【\[\(（].*?[】\]\)）]\s*/, '');
  const en = clean.match(/([A-Za-z0-9\u00C0-\u024F.]+(?:\s+[A-Za-z0-9\u00C0-\u024F.]+)?)\s*(?:vs|VS|v)\s*([A-Za-z0-9\u00C0-\u024F.]+(?:\s+[A-Za-z0-9\u00C0-\u024F.]+)?)/);
  if (en) return [en[1].trim(), en[2].trim()];
  const zh = clean.match(/([\u4e00-\u9fa5A-Za-z0-9]{2,8})\s*(?:vs|[Vv][Ss]|大战|对阵|对决)\s*([\u4e00-\u9fa5A-Za-z0-9]{2,8})/);
  if (zh) return [zh[1].trim(), zh[2].trim()];
  return null;
}

// 只保留 B站 房间（自动发现），排除硬编码的虎牙/斗鱼
function isBilibiliOnly(room: any): boolean {
  return room.platform === 'bilibili';
}

export const NON_LIVE_MATCHES: Match[] = MATCHES.filter(m => m.status !== 'live');

function staticNonLiveMatches(): Match[] {
  return NON_LIVE_MATCHES;
}

export async function fetchLiveMatches(): Promise<Match[]> {
  try {
    const res = await fetch(`${PROXY_URL}/api/live-matches`);
    if (!res.ok) throw new Error('Failed to fetch');
    const rooms: any[] = await res.json();

    const liveRooms = rooms.filter(r => r.isLive && isBilibiliOnly(r));

    if (liveRooms.length === 0) return staticNonLiveMatches();

    const liveMatches: Match[] = [];

    for (const room of liveRooms) {
      const gameId = room.game || 'LOL';
      const gameInfo = GAMES.find(g => g.id === gameId);
      if (!gameInfo) continue;

      const title = stripHtml(room.title || '');
      const viewers = room.viewers || 0;
      const teams = extractTeams(title);
      const stableId = `bilibili-${room.roomId}`;

      if (teams) {
        liveMatches.push({
          id: stableId,
          game: gameId as GameType,
          tournament: `${gameInfo.name}`,
          stage: 'B站直播',
          teamA: { name: teams[0], shortName: teams[0], logo: gameInfo.emoji },
          teamB: { name: teams[1], shortName: teams[1], logo: gameInfo.emoji },
          status: 'live',
          startTime: '直播中',
          viewers: viewers || undefined,
          bestOf: 1,
        });
      } else {
        liveMatches.push({
          id: stableId,
          game: gameId as GameType,
          tournament: `${gameInfo.name}`,
          stage: 'B站直播',
          teamA: { name: title || `${gameInfo.name} 直播中`, shortName: title ? title.slice(0, 16) : gameInfo.name, logo: gameInfo.emoji },
          teamB: { name: 'B站直播间', shortName: '直播中', logo: '📺' },
          status: 'live',
          startTime: '直播中',
          viewers: viewers || undefined,
          bestOf: 1,
        });
      }
    }

    if (liveMatches.length > 0) {
      return [...liveMatches, ...staticNonLiveMatches()];
    }
    return staticNonLiveMatches();
  } catch {
    return staticNonLiveMatches();
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
  { id: "n16", title: "IEM Cologne Major 2026前瞻：32支战队逐鹿科隆", summary: "IEM Cologne Major 2026将于6月2日至21日在德国科隆举行，32支顶级战队将争夺$1,250,000奖金池。", game: "CS2", date: "2026-05-28", tag: "赛事直播", image: "🏆", slug: "cs2-iem-cologne-major-2026-preview" },
  { id: "n17", title: "Falcons组建银河战舰：karrigan时代启航", summary: "Team Falcons在karrigan加盟后两度杀入决赛，虽尚未捧杯但已成为CS2赛场不可忽视的力量。", game: "CS2", date: "2026-05-26", tag: "战术分析", image: "🦅", slug: "cs2-falcons-karrigan-era" },
  { id: "n18", title: "从垫底到亚军：GamerLegion的IEM Atlanta黑马之路", summary: "GamerLegion在IEM Atlanta 2026上演黑马奇迹，连克强敌闯入决赛，虽不敌NAVI但赢得全场尊重。", game: "CS2", date: "2026-05-19", tag: "赛事速报", image: "🐴", slug: "cs2-gamerlegion-iem-atlanta-run" },
  { id: "n19", title: "CS2 2026上半年总结：五大豪门逐鹿中原", summary: "2026上半年CS2赛事竞争空前激烈，Vitality、NAVI、Spirit、Legacy、Falcons五支豪门轮番登顶。", game: "CS2", date: "2026-05-27", tag: "行业资讯", image: "📊", slug: "cs2-2026-midseason-review" },
  { id: "n20", title: "MOUZ 2026：稳定得可怕的CS2常青树", summary: "MOUZ在2026年上半年延续了稳定的表现，多次杀入大赛四强，证明了没有超级明星也能保持竞争力的团队体系。", game: "CS2", date: "2026-05-25", tag: "战术分析", image: "🌳", slug: "cs2-mouz-2026-consistency" },
  { id: "n21", title: "VCT Americas Stage 1：G2加冕四冠王，leaf荣膺MVP", summary: "G2 Esports在VCT Americas Stage 1决赛中3-2险胜LEVIATÁN，夺得队史第四个美洲冠军并锁定Masters London头号种子。", game: "VALORANT", date: "2026-05-26", tag: "赛事速报", image: "🇺🇸", slug: "valorant-americas-stage-1-review" },
  { id: "n22", title: "VCT China Stage 1：XL Gaming登顶，中国瓦坛新格局", summary: "XL Gaming以12个冠军积分领跑VCT China Stage 1，All Gamers和Dragon Ranger Gaming紧随其后。", game: "VALORANT", date: "2026-05-24", tag: "赛事速报", image: "🇨🇳", slug: "valorant-china-stage-1-review" },
  { id: "n23", title: "VCT Pacific Stage 1：韩国军团崛起，PRX四连冠称霸", summary: "Paper Rex在决赛中3-0横扫FULL SENSE，Nongshim RedForce和T1展现出韩国VALORANT的强劲崛起势头。", game: "VALORANT", date: "2026-05-22", tag: "赛事速报", image: "🌏", slug: "valorant-pacific-stage-1-review" },
  { id: "n24", title: "Masters London 2026参赛队伍全解析", summary: "VCT Masters London 2026将于6月6日至21日举行，13支来自全球四大赛区的顶级战队将为冠军荣誉而战。", game: "VALORANT", date: "2026-05-28", tag: "行业资讯", image: "🇬🇧", slug: "valorant-masters-london-qualifiers" },
  { id: "n25", title: "Heretics败者组神话：五届亚军终夺冠", summary: "Team Heretics完成败者组五连胜奇迹，在VCT EMEA Stage 1决赛中击败Team Vitality，打破五次亚军魔咒。", game: "VALORANT", date: "2026-05-20", tag: "赛事速报", image: "🔥", slug: "valorant-emea-stage-1-review" },
  { id: "n26", title: "WE 3-2 LNG：骑士之路鏖战五局晋级季后赛", summary: "在LPL骑士之路关键战中，WE战队历经五局鏖战以3-2击败LNG，成功晋级季后赛。", game: "LOL", date: "2026-05-24", tag: "赛事速报", image: "🐺", slug: "lpl-we-lng-knights-road" },
  { id: "n27", title: "EDG 3-2 NIP：Leave泽丽一往无前", summary: "EDG在骑士之路中3-2险胜NIP，Leave选手的泽丽在决胜局打出惊天表现，帮助EDG晋级淘汰赛。", game: "LOL", date: "2026-05-25", tag: "赛事速报", image: "⚡", slug: "lpl-edg-nip-knights-road" },
  { id: "n28", title: "水鬼传说再现！LGD 3-2 WBG爆冷", summary: "LGD在骑士之路中以3-2击败WBG，小虎时隔2117天再次无缘季后赛，WBG跌入涅槃组。", game: "LOL", date: "2026-05-25", tag: "赛事速报", image: "🌊", slug: "lpl-lgd-wbg-upset" },
  { id: "n29", title: "TT 3-0横扫iG：骑士之路最大冷门", summary: "涅槃组TT战队以3-0横扫登峰组iG，创下骑士之路最大冷门，iG惨遭横扫俯冲涅槃组。", game: "LOL", date: "2026-05-24", tag: "赛事速报", image: "💥", slug: "lpl-tt-ig-sweep" },
  { id: "n30", title: "LPL第二赛段淘汰赛对阵解析：BLG领衔四强争霸", summary: "LPL第二赛段淘汰赛将于5月29日打响，BLG、JDG、TES、AL四支登峰组强队将争夺冠军。", game: "LOL", date: "2026-05-27", tag: "赛事直播", image: "🏅", slug: "lpl-playoffs-stage-2-preview" },
  { id: "n31", title: "PARIVISION加冕DreamLeague S29冠军，东欧新王崛起", summary: "PARIVISION在DreamLeague Season 29决赛中以3-1击败BetBoom Team，RAMZES666宝刀不老，用统治级表现夺得2026年DOTA2首个顶级赛事冠军。", game: "DOTA2", date: "2026-05-06", tag: "赛事速报", image: "🏆", slug: "dota2-dreamleague-s29" },
  { id: "n32", title: "BetBoom Team横扫Aurora夺得PGL Wallachia S8冠军", summary: "BetBoom Team在PGL Wallachia Season 8决赛中以3-0完胜Aurora Gaming，gpk以MVP级表现证明了自己世界顶级中单的实力。", game: "DOTA2", date: "2026-04-20", tag: "赛事速报", image: "💥", slug: "dota2-pgl-wallachia-s8" },
  { id: "n33", title: "Made in Thailand夺得PGS 4冠军，泰国战队首捧PUBG全球赛事奖杯", summary: "Made in Thailand在PGS 4决赛中力压群雄夺冠，为泰国电竞书写了历史性的一页。17Gaming获得第四名。", game: "PUBG", date: "2026-05-20", tag: "赛事速报", image: "🇹🇭", slug: "pubg-pgs-4" },
  { id: "n34", title: "PGS Circuit 2激战正酣：PUBG电竞全球化新篇章", summary: "PUBG Esports 2026赛季PGS Circuit 2赛事正在进行，24支全球顶尖战队争夺PGC 2026积分，NAVI、FaZe Clan和17Gaming等豪门悉数出战。", game: "PUBG", date: "2026-05-15", tag: "行业资讯", image: "🌍", slug: "pubg-pgs-circuit-2" },
  { id: "n35", title: "KSG登顶2026 KPL春季赛，新王加冕改写王者荣耀电竞格局", summary: "苏州KSG在2026年KPL春季赛总决赛中以4:2击败对手，夺得队史首座KPL冠军奖杯。年轻战队的崛起宣告了KPL新时代的到来。", game: "HONOR", date: "2026-04-26", tag: "赛事速报", image: "👑", slug: "kpl-spring-2026-ksg" },
  { id: "n36", title: "重庆狼队再夺挑战者杯冠军，王者荣耀电竞豪门续写传奇", summary: "重庆狼队在2026年王者荣耀挑战者杯决赛中以4:1击败对手，Fly选手的总决赛表现堪称完美，传奇继续。", game: "HONOR", date: "2026-05-10", tag: "赛事速报", image: "🐺", slug: "honor-wolves-challenger-cup" },
  { id: "n37", title: "TES问鼎三角洲行动烽火职业联赛春季赛总冠军", summary: "TES在五棵松体育馆七局鏖战中脱颖而出，夺得首个烽火职业联赛冠军。white以场均淘汰第一的数据斩获FMVP。", game: "DELTA", date: "2026-05-16", tag: "赛事速报", image: "🦅", slug: "delta-force-spring-final" },
  { id: "n38", title: "5000万DAU之后：三角洲行动电竞的进化之路", summary: "从质疑到爆红，三角洲行动用18个月拿下5000万DAU，再以完备的职业赛事体系回应「搜打撤能不能电竞」的质疑。", game: "DELTA", date: "2026-05-10", tag: "行业资讯", image: "🔥", slug: "delta-force-esports-launch" },
  { id: "n39", title: "2026暗区大师赛全面升级：35万奖金池点燃战术博弈", summary: "2026暗区大师赛于5月8日开赛，总奖金35万。全新赛点制、价值保底机制让战术撤离电竞达到新高度。", game: "AB", date: "2026-05-08", tag: "赛事速报", image: "🎒", slug: "arena-breakout-masters-2026" },
  { id: "n40", title: "从大金杯到暗区大师赛：战术撤离电竞在中国的崛起", summary: "暗区突围赛事体系从2022年起步，到2026年已发展出覆盖职业、主播和全民赛事的完整生态。", game: "AB", date: "2026-05-12", tag: "行业资讯", image: "🔥", slug: "arena-breakout-esports-ecosystem" },
  { id: "n41", title: "历史首次！BLG五人全员入选最佳一阵，Knight追平MVP纪录", summary: "LPL第二赛段最佳阵容评选结果出炉，BLG创造历史成为首支全员包揽一阵的战队，Knight以全票当选MVP追平Doinb和Rookie的纪录。", game: "LOL", date: "2026-05-29", tag: "赛事速报", image: "👑", slug: "lpl-blg-all-pro-sweep" },
  { id: "n42", title: "LPL确认不参加亚运会，LCK谁去谁免兵役？", summary: "2026年亚运会电竞项目名单公布，LOL项目没有中国大陆队参赛，LCK赛区夺冠几乎无悬念，金牌意味着免兵役引发韩网热议。", game: "LOL", date: "2026-05-29", tag: "行业资讯", image: "🏅", slug: "lpl-no-asian-games" },
  { id: "n43", title: "IEM Cologne Major 2026开幕！Vitality冲击三连冠王朝", summary: "CS2年度最大赛事IEM Cologne Major在德国科隆正式打响，32支战队争夺125万美元奖金，Vitality若夺冠将追平Astralis三连冠纪录。", game: "CS2", date: "2026-05-30", tag: "赛事直播", image: "🏆", slug: "cs2-iem-cologne-major-2026-kickoff" },
  { id: "n44", title: "VCT Masters London抽签出炉：6月6日伦敦铜盒竞技场开战", summary: "VALORANT伦敦大师赛分组抽签结果公布，12支战队齐聚英国，G2、EDG、PRX、TH四支头号种子直通淘汰赛。", game: "VALORANT", date: "2026-05-30", tag: "赛事直播", image: "🇬🇧", slug: "valorant-masters-london-draw" },
  { id: "n45", title: "Cypher Spy Cam Bug再现被紧急禁用，新特工Miks上线", summary: "VALORANT经典Bug——Cypher摄像头武器化漏洞再次出现，Riot紧急禁用该特工。此前Neon因NVIDIA漏洞被禁，新特工Miks成版本答案。", game: "VALORANT", date: "2026-05-29", tag: "行业资讯", image: "🔧", slug: "valorant-cypher-disabled" },
  { id: "n46", title: "Legacy卫冕CAC冠军，Falcons七连亚NiKo直言不可接受", summary: "CS Asia Championships 2026决赛，巴西Legacy以3-1击败Falcons卫冕成功。Falcons惨遭七连亚，NiKo赛后直言「这是不可接受的」。", game: "CS2", date: "2026-05-24", tag: "赛事速报", image: "🇧🇷", slug: "cs2-legacy-cac-falcons-curse" },
  { id: "n47", title: "LPL淘汰赛：TES 3-0横扫LGD，小天自称涅槃之王", summary: "LPL第二赛段淘汰赛首日，TES以3-0零封LGD晋级胜者组，打野Tian赛后自称「涅槃之王」登上热搜。同日AL零封EDG。", game: "LOL", date: "2026-05-29", tag: "赛事速报", image: "⚡", slug: "lpl-playoffs-tes-sweep-lgd" },
  { id: "n48", title: "TI15直邀名单公布！7支战队直通上海，中国赛区2个名额", summary: "DOTA2国际邀请赛TI15将于8月重回上海东方体育中心，7支直邀战队公布包括Xtreme Gaming和Ame+fy组合，门票6月10日开售。", game: "DOTA2", date: "2026-05-28", tag: "赛事直播", image: "🎫", slug: "dota2-ti15-shanghai-invites" },
  { id: "n49", title: "PGS Circuit 2：Made in Thailand夺冠，T1韩国战队强势崛起", summary: "PUBG Global Series Circuit 2首周战罢，Made in Thailand再夺一冠，韩国T1战队以16杀吃鸡的恐怖表现获得亚军锁定EWC名额。", game: "PUBG", date: "2026-05-26", tag: "赛事速报", image: "🇰🇷", slug: "pubg-pgs-circuit-2-t1-rise" },
  { id: "n50", title: "LEC最疯狂一幕：G2 Soraka闪现沉默惊天翻盘KOI", summary: "LEC春季赛季后赛G2对阵Movistar KOI，G2在0-2落后且第五局基地被推边缘时，辅助Labrov的索拉卡闪现沉默开团逆转翻盘。", game: "LOL", date: "2026-05-28", tag: "赛事速报", image: "🌟", slug: "lol-lec-g2-soraka-comeback" },
  { id: "n51", title: "JOC夏季赛精英巡回赛激战正酣，WBG.潇之助领跑积分榜", summary: "2026金铲铲之战公开赛夏季赛精英巡回赛火热进行中，WBG.潇之助以65分登顶积分榜，CN赛区与APAC赛区跨区对抗赛同步打响。", game: "JCC", date: "2026-05-30", tag: "赛事速报", image: "🪙", slug: "jcc-summer-elite-tour" },
  { id: "n52", title: "OPL夏季赛常规赛激战：LF与OMG领跑积分榜", summary: "2026决战平安京职业联赛OPL夏季赛常规赛第五周战罢，LF战队以不败战绩领跑，OMG战队紧随其后，季后赛名额争夺进入白热化。", game: "OJ", date: "2026-05-29", tag: "赛事速报", image: "⛩️", slug: "opl-summer-2026" },
];

