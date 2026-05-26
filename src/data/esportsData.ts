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
    tournament: 'LPL 2025春季赛',
    stage: '常规赛 第12周',
    teamA: { name: 'JDG战队', shortName: 'JDG', logo: '🐉', score: 2 },
    teamB: { name: 'BLG战队', shortName: 'BLG', logo: '⚡', score: 1 },
    status: 'live',
    startTime: '今日 15:00',
    viewers: 1234567,
    bestOf: 3,
  },
  {
    id: 'm2',
    game: 'VALORANT',
    tournament: 'VCT 2025亚太赛',
    stage: '季后赛 半决赛',
    teamA: { name: 'EDward Gaming', shortName: 'EDG', logo: '🦅', score: 1 },
    teamB: { name: 'ZETA DIVISION', shortName: 'ZETA', logo: '🌟', score: 1 },
    status: 'live',
    startTime: '今日 16:30',
    viewers: 856432,
    bestOf: 5,
  },
  {
    id: 'm3',
    game: 'CS2',
    tournament: 'IEM 卡托维兹 2025',
    stage: '八强赛',
    teamA: { name: 'Natus Vincere', shortName: 'NAVI', logo: '🐺' },
    teamB: { name: 'Team Vitality', shortName: 'VIT', logo: '🐝' },
    status: 'upcoming',
    startTime: '今日 20:00',
    bestOf: 3,
  },
  {
    id: 'm4',
    game: 'DOTA2',
    tournament: 'The International 2025',
    stage: '小组赛 Day 2',
    teamA: { name: 'Team Spirit', shortName: 'TSP', logo: '👻' },
    teamB: { name: 'PSG.LGD', shortName: 'LGD', logo: '🐼' },
    status: 'upcoming',
    startTime: '明日 14:00',
    bestOf: 2,
  },
  {
    id: 'm5',
    game: 'HONOR',
    tournament: 'KPL 2025春季赛',
    stage: '季后赛',
    teamA: { name: 'Hero久竞', shortName: 'Hero', logo: '🦸', score: 3 },
    teamB: { name: '广州TTG', shortName: 'TTG', logo: '🔥', score: 0 },
    status: 'finished',
    startTime: '昨日 19:00',
    bestOf: 5,
  },
  {
    id: 'm6',
    game: 'PUBG',
    tournament: 'PGC 2025全球冠军赛',
    stage: '决赛日 3',
    teamA: { name: '4AM战队', shortName: '4AM', logo: '💎', score: 1 },
    teamB: { name: 'Nova战队', shortName: 'Nova', logo: '🌙', score: 0 },
    status: 'finished',
    startTime: '昨日 17:00',
    bestOf: 1,
  },
];

export const TOURNAMENTS: Tournament[] = [
  {
    id: 't1',
    name: 'LPL 2025春季赛',
    game: 'LOL',
    logo: '🏆',
    prizePool: '¥300万',
    startDate: '2025-01-14',
    endDate: '2025-04-13',
    status: 'ongoing',
    region: '中国',
    teams: 17,
  },
  {
    id: 't2',
    name: 'The International 2025',
    game: 'DOTA2',
    logo: '🌍',
    prizePool: '$40,000,000',
    startDate: '2025-08-01',
    endDate: '2025-08-17',
    status: 'upcoming',
    region: '全球',
    teams: 20,
  },
  {
    id: 't3',
    name: 'IEM 卡托维兹 2025',
    game: 'CS2',
    logo: '🎯',
    prizePool: '$1,250,000',
    startDate: '2025-02-01',
    endDate: '2025-02-16',
    status: 'ongoing',
    region: '欧洲',
    teams: 24,
  },
  {
    id: 't4',
    name: 'VCT 2025亚太赛',
    game: 'VALORANT',
    logo: '🔥',
    prizePool: '$500,000',
    startDate: '2025-01-20',
    endDate: '2025-04-06',
    status: 'ongoing',
    region: '亚太',
    teams: 10,
  },
  {
    id: 't5',
    name: 'KPL 2025春季赛',
    game: 'HONOR',
    logo: '👑',
    prizePool: '¥500万',
    startDate: '2025-03-01',
    endDate: '2025-05-18',
    status: 'upcoming',
    region: '中国',
    teams: 16,
  },
  {
    id: 't6',
    name: 'PGC 2025全球冠军赛',
    game: 'PUBG',
    logo: '🪖',
    prizePool: '$2,000,000',
    startDate: '2025-06-10',
    endDate: '2025-06-22',
    status: 'upcoming',
    region: '全球',
    teams: 32,
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
];

export const NEWS: News[] = [
  {
    id: 'n1',
    title: 'JDG战队完成惊天逆转！2:1险胜BLG晋级季后赛',
    summary: '在今日进行的LPL春季赛关键对决中，JDG战队在首局不利的情况下展现出强大的心理素质，凭借中后期的团战优势完成2:1惊天逆转，成功晋级季后赛并锁定前四席位。',
    game: 'LOL',
    date: '2小时前',
    tag: '赛事速报',
    image: '🎮',
  },
  {
    id: 'n2',
    title: 'IEM卡托维兹2025：NAVI与VIT激战在即，谁将问鼎冠军？',
    summary: '今晚20:00，CS2年度最受关注的赛事IEM卡托维兹八强对决即将打响。两支欧洲顶级队伍NAVI与Vitality再度相遇，这场宿命之战将决定谁有资格挑战冠军宝座。',
    game: 'CS2',
    date: '4小时前',
    tag: '赛前预测',
    image: '🎯',
  },
  {
    id: 'n3',
    title: 'The International 2025奖金池突破4000万美元创历史新高',
    summary: 'Valve官方宣布，今年的TI 2025国际邀请赛奖金池已正式突破4000万美元大关，再度刷新电子竞技史上的奖金纪录，吸引全球媒体广泛关注。',
    game: 'DOTA2',
    date: '6小时前',
    tag: '行业资讯',
    image: '💰',
  },
  {
    id: 'n4',
    title: 'VCT亚太赛：EDG与ZETA激战至第5局，赛事进入白热化',
    summary: 'EDG与日本老牌战队ZETA DIVISION的亚太赛半决赛已进入第五局决胜局，两队展现出极高水平，赛况之激烈让全场观众屏息以待。',
    game: 'VALORANT',
    date: '1小时前',
    tag: '赛事直播',
    image: '🔫',
  },
];
