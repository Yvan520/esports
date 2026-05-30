import { useState, useEffect, useRef } from "react";
import {
  Trophy,
  Tv,
  Flame,
  MessageSquare,
  ChevronRight,
  Play,
  Pause,
  Coins,
  Sparkles,
  Info,
  Send,
  Settings,
} from "lucide-react";
import { MATCHES, GAMES, fetchLiveMatches, type Match } from "../data/esportsData";
import StreamPlayer from "./StreamPlayer";

interface LivePageProps {
  onBack: () => void;
  initialMatchId?: string | null;
}

function formatViewers(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}万`;
  return n.toString();
}

const LIVE_EVENTS_TEMPLATES = [
  (a: string, b: string) => `🔴 ${a} 在中路完成一次关键击杀！`,
  (a: string, b: string) => `⚔️ 团战爆发！${b} 在大龙坑打出 2换3`,
  (a: string, b: string) => `🐉 ${b} 成功拿下炼狱巨龙！`,
  (a: string, b: string) => `🏆 ${a} Faker 级操作，完成双杀！`,
  (a: string, b: string) => `⚡ 纳什男爵已刷新！双方战队正在集结。`,
  (a: string, b: string) => `💰 经济差缩小至 800g，${a} 略微领先`,
  (a: string, b: string) => `🛡️ ${a} 成功防守下路二塔`,
  (a: string, b: string) => `💥 精彩团战！${a} 击杀 ${b} 四名成员！`,
];

const BOT_CHAT_TEMPLATES = [
  (a: string, b: string) => ({ user: "电竞老司机", msg: `${a} 今天状态太好了！🔥`, vip: true, team: a }),
  (a: string, b: string) => ({ user: "RankKing", msg: `${b} 还有机会，只要拿下大龙就能翻盘！`, vip: false, team: b }),
  (a: string, b: string) => ({ user: "观赛达人", msg: `${a} 这波操作太秀了吧！！！🐐`, vip: true, team: a }),
  (a: string, b: string) => ({ user: "赛事通", msg: "这已经是 BO5 第三局了，现场观众太热情了！", vip: false, team: "Neutral" }),
  (a: string, b: string) => ({ user: "战术大师", msg: `${b} 的阵容有点贪，需要后期发育。`, vip: true, team: b }),
  (a: string, b: string) => ({ user: "直播达人", msg: "网页端看直播不卡顿，1080p 60fps 太流畅了！🚀", vip: false, team: "Neutral" }),
  (a: string, b: string) => ({ user: "竞猜王者", msg: `我把积分全压 ${a} 赢第三局！冲冲冲！`, vip: true, team: a }),
];

export default function LivePage({ onBack, initialMatchId }: LivePageProps) {
  const [allMatches, setAllMatches] = useState<Match[]>(MATCHES);
  const [dataLoading, setDataLoading] = useState(true);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [initialSelectionDone, setInitialSelectionDone] = useState(false);

  useEffect(() => {
    const load = () => fetchLiveMatches().then(live => {
      setAllMatches(live);
      setDataLoading(false);
    }).catch(() => setDataLoading(false));
    load();
    const timer = setInterval(load, 30000);
    return () => clearInterval(timer);
  }, []);

  const liveMatches = allMatches.filter(m => m.status === 'live');
  const selectedMatch = selectedMatchId
    ? allMatches.find(m => m.id === selectedMatchId) ?? liveMatches[0] ?? allMatches[0] ?? null
    : liveMatches[0] ?? allMatches[0] ?? null;

  // Auto-select on initial load: use initialMatchId if provided, else first live match
  useEffect(() => {
    if (initialSelectionDone) return;
    if (initialMatchId && allMatches.some(m => m.id === initialMatchId)) {
      setSelectedMatchId(initialMatchId);
      setInitialSelectionDone(true);
    } else if (liveMatches.length > 0) {
      setSelectedMatchId(liveMatches[0].id);
      setInitialSelectionDone(true);
    }
  }, [initialSelectionDone, initialMatchId, liveMatches, allMatches]);

  const [notification, setNotification] = useState<string | null>("欢迎来到赛事直播大厅！参与实时预测即可获得竞技积分。");

  const game = selectedMatch ? GAMES.find(g => g.id === selectedMatch.game) : undefined;
  const teamAColor = game?.color || '#6366f1';
  const teamBColor = game ? GAMES.find(g => g.id !== selectedMatch?.game)?.color || '#FF4655' : '#FF4655';

  const defaultStats = {
    team1Score: selectedMatch?.teamA.score ?? 0,
    team2Score: selectedMatch?.teamB.score ?? 0,
    gameTime: "00:00",
    team1Gold: "0.0k",
    team2Gold: "0.0k",
    team1Barons: 0,
    team2Barons: 0,
    team1Dragons: 0,
    team2Dragons: 0,
    team1VotedPercent: 55,
    team2VotedPercent: 45,
    hasVoted: false,
    votedTeam: ""
  };
  const [liveMatchStats, setLiveMatchStats] = useState(defaultStats);

  const [liveEvents, setLiveEvents] = useState<string[]>([]);

  const [chatMessages, setChatMessages] = useState<{ id: number; user: string; msg: string; isUser?: boolean; vip?: boolean; team?: string }[]>([]);
  
  // Reset match-specific state when user picks a different match
  useEffect(() => {
    if (!selectedMatch) return;
    setLiveMatchStats({
      team1Score: selectedMatch.teamA.score ?? 0,
      team2Score: selectedMatch.teamB.score ?? 0,
      gameTime: "00:00",
      team1Gold: "0.0k",
      team2Gold: "0.0k",
      team1Barons: 0,
      team2Barons: 0,
      team1Dragons: 0,
      team2Dragons: 0,
      team1VotedPercent: 55,
      team2VotedPercent: 45,
      hasVoted: false,
      votedTeam: ""
    });
    setLiveEvents([
      `🕹️ ${selectedMatch.tournament} ${selectedMatch.stage} 比赛正式开始！`,
      `💰 首杀由 ${selectedMatch.teamA.shortName} 在上路拿下！`,
      `🐉 ${selectedMatch.teamA.shortName} 拿下第一条小龙。`,
    ]);
    setChatMessages([
      { id: Date.now(), user: "电竞老司机", msg: `${selectedMatch.teamA.shortName} 今天状态太好了！🔥`, vip: true, team: selectedMatch.teamA.shortName },
      { id: Date.now() + 1, user: "RankKing", msg: `${selectedMatch.teamB.shortName} 稳住，还有机会！`, vip: false, team: selectedMatch.teamB.shortName },
      { id: Date.now() + 2, user: "直播达人", msg: "网页直播不卡顿，太流畅了！🚀", vip: false, team: "Neutral" }
    ]);
  }, [selectedMatchId]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [embedError, setEmbedError] = useState(false);
  const [userChatMessage, setUserChatMessage] = useState("");

  type Platform = 'bilibili' | 'twitch' | 'youtube' | 'huya' | 'douyu' | 'custom';
  const PLATFORMS: { id: Platform; label: string; color: string; canEmbed: boolean; viaProxy?: boolean }[] = [
    { id: 'bilibili', label: 'B站直播', color: '#00A1D6', canEmbed: false, viaProxy: true },
    { id: 'twitch', label: 'Twitch', color: '#9146FF', canEmbed: true },
    { id: 'youtube', label: 'YouTube', color: '#FF0033', canEmbed: true },
    { id: 'huya', label: '虎牙直播', color: '#FF6B35', canEmbed: false, viaProxy: true },
    { id: 'douyu', label: '斗鱼直播', color: '#FF8C00', canEmbed: false, viaProxy: true },
    { id: 'custom', label: '自定义', color: '#8B5CF6', canEmbed: true },
  ];
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('bilibili');
  const [customStreamUrl, setCustomStreamUrl] = useState("");
  const [proxyUrl, setProxyUrl] = useState("https://healthy-mustang-32.yvan520.deno.net");
  const [showProxySettings, setShowProxySettings] = useState(false);
  const [roomOverrides, setRoomOverrides] = useState<Record<string, string>>({});

  const PROXY_URL = 'https://healthy-mustang-32.yvan520.deno.net';

  // 从代理自动获取B站房间号
  useEffect(() => {
    fetch(`${PROXY_URL}/api/rooms`)
      .then(r => r.json())
      .then(data => {
        const overrides: Record<string, string> = {};
        for (const [game, rooms] of Object.entries(data) as [string, any][]) {
          if (rooms.bilibili) overrides[game] = rooms.bilibili;
        }
        setRoomOverrides(overrides);
      })
      .catch(() => {});
  }, []);

  const GAME_STREAM_MAP: Record<string, { twitch: string; youtube: string; bilibili: string; bilibiliRealId: string; huya: string; douyu: string; label: string }> = {
    LOL: { twitch: 'lpl', youtube: 'UC9MAhZQQd9egwWCxrwSIsJQ', bilibili: '6', bilibiliRealId: roomOverrides['LOL'] || '7734200', huya: '660000', douyu: '288016', label: '英雄联盟 LPL' },
    VALORANT: { twitch: 'valorant_esports', youtube: 'UC8CXsDF7Rd0W3PRjM2SZBKA', bilibili: '22908869', bilibiliRealId: roomOverrides['VALORANT'] || '22908869', huya: '880001', douyu: '688001', label: 'VALORANT VCT' },
    CS2: { twitch: 'esl_csgo', youtube: 'UC9ZR0jD4iS1L6Gq6qQqW6aQ', bilibili: '21495949', bilibiliRealId: roomOverrides['CS2'] || '21495949', huya: '110001', douyu: '288016', label: 'CS2 ESL' },
    DOTA2: { twitch: 'dota2ti', youtube: 'UCYNDoOH6F_2yXuKA6KDOGDQ', bilibili: '21495945', bilibiliRealId: roomOverrides['DOTA2'] || '21495945', huya: '210001', douyu: '556601', label: 'DOTA 2 TI' },
    PUBG: { twitch: 'pubg', youtube: 'UCnXU0J1f5Y5J5T5n5z5z5zQ', bilibili: '11218604', bilibiliRealId: roomOverrides['PUBG'] || '11218604', huya: '410001', douyu: '886601', label: 'PUBG Esports' },
    HONOR: { twitch: 'hoK', youtube: 'UCmXU0J1f5Y5J5T5n5z5z5zQ', bilibili: '21144080', bilibiliRealId: roomOverrides['HONOR'] || '21144080', huya: '330001', douyu: '716601', label: '王者荣耀 KPL' },
  };

  function getGameKey(): string {
    return selectedMatch.game;
  }

  function getPlatformInfo(): { id: Platform; label: string; color: string; canEmbed: boolean; viaProxy?: boolean } | undefined {
    return PLATFORMS.find(p => p.id === selectedPlatform);
  }

  function getStreamEmbedUrl(): string {
    const key = getGameKey();
    const info = GAME_STREAM_MAP[key];
    if (!info) return '';
    const domain = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    switch (selectedPlatform) {
      case 'youtube':
        return `https://www.youtube.com/embed/live_stream?channel=${info.youtube}&autoplay=1&mute=1`;
      case 'custom':
        return customStreamUrl;
      default:
        return `https://player.twitch.tv/?channel=${info.twitch}&parent=${domain}&parent=www.gamewayz.com&parent=gamewayz.com&muted=true`;
    }
  }

  function getStreamPageUrl(): string {
    const key = getGameKey();
    const info = GAME_STREAM_MAP[key];
    if (!info) return 'https://www.twitch.tv';
    switch (selectedPlatform) {
      case 'youtube': return `https://www.youtube.com/channel/${info.youtube}/live`;
      case 'bilibili': return `https://live.bilibili.com/${info.bilibiliRealId}`;
      case 'huya': return `https://www.huya.com/${info.huya}`;
      case 'douyu': return `https://www.douyu.com/${info.douyu}`;
      case 'custom': return customStreamUrl || 'https://www.twitch.tv';
      default: return `https://www.twitch.tv/${info.twitch}`;
    }
  }

  function getStreamLabel(): string {
    const key = getGameKey();
    const info = GAME_STREAM_MAP[key];
    if (!info) return '';
    const platform = PLATFORMS.find(p => p.id === selectedPlatform);
    const proxyNote = platform?.viaProxy ? ' · 直链直播' : '';
    return `${info.label} · ${platform?.label || selectedPlatform}${proxyNote}`;
  }

  function handlePlay() {
    const p = getPlatformInfo();
    if (!p) return;
    if (p.canEmbed) {
      setIsPlaying(true);
      setEmbedError(false);
    } else if (p.viaProxy && proxyUrl) {
      setIsPlaying(true);
      setEmbedError(false);
    } else {
      window.open(getStreamPageUrl(), '_blank', 'noopener');
    }
  }
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = chatEndRef.current?.parentElement?.parentElement;
    if (container) container.scrollTop = container.scrollHeight;
  }, [chatMessages]);

  // Use real match scores (stop faking game time/gold)
  const displayScoreA = selectedMatch?.teamA.score ?? liveMatchStats.team1Score;
  const displayScoreB = selectedMatch?.teamB.score ?? liveMatchStats.team2Score;

  useEffect(() => {
    if (!selectedMatch || selectedMatch.status !== 'live') return;
    const interval = setInterval(() => {
      if (Math.random() > 0.65) {
        const t = LIVE_EVENTS_TEMPLATES[Math.floor(Math.random() * LIVE_EVENTS_TEMPLATES.length)];
        setLiveEvents((prev) => [t(selectedMatch.teamA.shortName, selectedMatch.teamB.shortName), ...prev.slice(0, 12)]);
      }

      if (Math.random() > 0.5) {
        const t = BOT_CHAT_TEMPLATES[Math.floor(Math.random() * BOT_CHAT_TEMPLATES.length)];
        const msg = t(selectedMatch.teamA.shortName, selectedMatch.teamB.shortName);
        setChatMessages((prev) => [...prev, { id: Date.now(), user: msg.user, msg: msg.msg, vip: msg.vip, team: msg.team }]);
      }
    }, 3500);
    return () => clearInterval(interval);
  }, [selectedMatch]);

  const triggerAlert = (text: string) => {
    setNotification(text);
    setTimeout(() => { setNotification(null); }, 6000);
  };

  const handlePredict = (team: string) => {
    if (liveMatchStats.hasVoted) return;
    const voteReward = 200;
    setLiveMatchStats((prev) => {
      const t1Pct = team === selectedMatch.teamA.shortName ? prev.team1VotedPercent + 2 : prev.team1VotedPercent - 2;
      const t2Pct = 100 - t1Pct;
      return { ...prev, hasVoted: true, votedTeam: team, team1VotedPercent: t1Pct, team2VotedPercent: t2Pct };
    });
    triggerAlert(`✨ 预测成功！已投给 ${team}。系统赠送您 [${voteReward}] 点竞技积分！`);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userChatMessage.trim()) return;
    setChatMessages((prev) => [...prev, { id: Date.now(), user: "我 (You)", msg: userChatMessage, isUser: true, vip: true, team: selectedMatch.teamA.shortName }]);
    setUserChatMessage("");
    setTimeout(() => {
      const replies = ["老哥分析得很有道理！我也觉得是这样 👍", "哈哈，看好你哦！", "真假？我还是觉得这把有转机！🔥", "冲冲冲，这一波我支持兄弟！"];
      setChatMessages((prev) => [...prev, { id: Date.now() + 1, user: "电竞智囊团", msg: `@我 (You) ${replies[Math.floor(Math.random() * replies.length)]}`, vip: false, team: "Neutral" }]);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Notification */}
      {notification && (
        <div className="bg-gradient-to-r from-cyan-900 via-violet-950 to-cyan-900 border-b border-cyan-500/30 py-2.5 px-4 text-sm transition-all duration-500 ease-in-out sticky top-0 z-50 shadow-md backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-cyan-400 animate-pulse" />
              <span className="text-cyan-100 font-medium tracking-wide">{notification}</span>
            </div>
            <button onClick={() => setNotification(null)} className="text-cyan-400/60 hover:text-cyan-200 transition text-xs font-bold uppercase cursor-pointer">[关闭]</button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-slate-800/70 bg-slate-900/60 backdrop-blur-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(99,102,241,0.15),_transparent_50%)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 relative z-10">
            <div className="flex items-center gap-3 cursor-pointer" onClick={onBack}>
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-cyan-500 via-indigo-500 to-violet-600 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
                <div className="bg-slate-950 h-full w-full rounded-[10px] flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-cyan-400 animate-bounce" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white via-cyan-300 to-indigo-400 bg-clip-text text-transparent tracking-tight">ESPORTS HUB</h1>
                <p className="text-[11px] text-slate-400 tracking-wider">电竞赛事直播中心</p>
              </div>
            </div>
            <button onClick={onBack} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-medium transition cursor-pointer">← 返回主页</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Stream + Events + Match List */}
            <div className="lg:col-span-2 space-y-6">
              {/* Streaming Video Player */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative group">
                <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-slate-950/90 to-transparent p-4 flex items-center justify-between z-20">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-0.5 rounded text-xs font-extrabold bg-red-600 text-white flex items-center gap-1">
                      {selectedMatch.status === 'live' ? '🔴 直播中' : selectedMatch.status === 'upcoming' ? '⏳ 即将开始' : '✅ 已结束'}
                    </span>
                    <h3 className="text-sm font-bold text-white tracking-wide">{selectedMatch.tournament}</h3>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-300 bg-slate-950/60 px-3 py-1 rounded-full border border-slate-800">
                    <span className="flex items-center gap-1 text-rose-400 font-mono"><Flame className="h-3 w-3" /> {selectedMatch.viewers ? formatViewers(selectedMatch.viewers) : '-'} 观看</span>
                  </div>
                </div>

                <div className="aspect-video bg-slate-950 relative overflow-hidden rounded-t-2xl">
                  {/* Stream embed */}
                  {isPlaying ? (
                    <StreamPlayer
                      key={`${selectedPlatform}-${getStreamEmbedUrl()}`}
                      platform={selectedPlatform}
                      roomId={selectedPlatform !== 'custom' ? GAME_STREAM_MAP[getGameKey()]?.[selectedPlatform === 'bilibili' ? 'bilibiliRealId' : selectedPlatform] : undefined}
                      embedUrl={getStreamEmbedUrl()}
                      streamUrl={selectedPlatform === 'custom' ? customStreamUrl : undefined}
                      proxyUrl={proxyUrl || undefined}
                      onError={() => setEmbedError(true)}
                      onLoad={() => setEmbedError(false)}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950 cursor-pointer" onClick={handlePlay}>
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/30 to-indigo-500/30 border-2 border-cyan-400/60 flex items-center justify-center hover:scale-110 transition-all shadow-lg shadow-cyan-500/20">
                          <Play className="h-10 w-10 text-cyan-400 ml-1" />
                        </div>
                        <span className="text-cyan-300 text-sm font-semibold">点击观看 {selectedMatch.teamA.shortName} vs {selectedMatch.teamB.shortName}</span>
                        <span className="text-slate-500 text-xs">{getStreamLabel()}</span>
                      </div>
                    </div>
                  )}

                  {embedError && (
                    <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/90">
                      <div className="text-center px-6">
                        <Tv className="h-14 w-14 text-slate-700 mx-auto mb-3" />
                        <p className="text-slate-300 text-sm mb-4">直播嵌入失败，可换个平台或在原站观看</p>
                        <div className="flex gap-3 justify-center">
                          <button onClick={() => { setEmbedError(false); setIsPlaying(false); }} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium cursor-pointer">重试</button>
                          <a href={getStreamPageUrl()} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-slate-950 rounded-lg text-xs font-bold cursor-pointer">在新页面观看</a>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Minimal bottom bar */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/80 to-transparent px-4 py-3 flex items-center justify-between z-10 pointer-events-none">
                    <div className="flex items-center gap-2">
                      {isPlaying && <span className="h-2 w-2 rounded-full bg-red-500 animate-ping"></span>}
                      <span className="text-xs text-slate-300 font-medium">{isPlaying ? '直播中' : ''}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">{getStreamLabel()}</span>
                  </div>
                </div>
              </div>

              {/* Match info bar (below player) */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{selectedMatch.teamA.logo}</span>
                    <div>
                      <div className="text-sm font-bold text-slate-100">{selectedMatch.teamA.shortName}</div>
                      <div className="text-[10px] text-slate-500">{selectedMatch.teamA.name}</div>
                    </div>
                  </div>
                  <div className="text-center px-2">
                    <div className="text-xs text-slate-500 font-mono">{selectedMatch.tournament} · {selectedMatch.stage}</div>
                    <div className="flex items-center gap-2 justify-center mt-1">
                      <span className="text-xl font-extrabold text-red-500">{displayScoreA}</span>
                      <span className="text-slate-600 text-xs font-bold">VS</span>
                      <span className="text-xl font-extrabold text-cyan-400">{displayScoreB}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{selectedMatch.teamB.logo}</span>
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-100">{selectedMatch.teamB.shortName}</div>
                      <div className="text-[10px] text-slate-500">{selectedMatch.teamB.name}</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Flame className="h-3.5 w-3.5 text-rose-400" />
                  <span>{selectedMatch.viewers ? formatViewers(selectedMatch.viewers) : '-'} 观看</span>
                  {selectedMatch.status === 'live' && <span className="px-2 py-0.5 bg-red-600/10 text-red-400 border border-red-500/20 rounded text-[10px] font-bold ml-1">LIVE</span>}
                </div>
              </div>

              {/* Prominent Platform Selector */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Tv className="h-4 w-4 text-cyan-400" />
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">选择直播源平台</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {PLATFORMS.map(p => (
                    <button
                      key={p.id}
                      onClick={() => { setSelectedPlatform(p.id); setEmbedError(false); setIsPlaying(false); }}
                      className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold transition cursor-pointer ${
                        selectedPlatform === p.id
                          ? 'border-slate-100 text-white shadow-lg scale-105'
                          : 'border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                      }`}
                      style={{
                        background: selectedPlatform === p.id ? p.color : 'transparent',
                        boxShadow: selectedPlatform === p.id ? `0 0 20px ${p.color}40` : 'none',
                      }}
                    >
                      {p.label}
                      {!p.canEmbed && !p.viaProxy && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-950/60 text-slate-400 border border-slate-700">外链</span>
                      )}
                      {p.viaProxy && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-violet-950/60 text-violet-400 border border-violet-800">直链直播</span>
                      )}
                      {p.canEmbed && p.id !== 'custom' && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800">内嵌</span>
                      )}
                    </button>
                  ))}
                </div>
                {getStreamLabel() && (
                  <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-2 flex-wrap">
                    <span>当前: <span className="text-slate-300">{getStreamLabel()}</span></span>
                    <span className="text-slate-700">|</span>
                    {getPlatformInfo()?.canEmbed ? (
                      <span className="text-emerald-400">点击播放 = 页面内直接观看</span>
                    ) : getPlatformInfo()?.viaProxy ? (
                      <span className="text-violet-400">点击播放 = 通过直播流直链播放（需要 proxy）</span>
                    ) : (
                      <span className="text-amber-400">点击播放 = 新窗口打开原网站</span>
                    )}
                    <span className="text-slate-700">|</span>
                    <a href={getStreamPageUrl()} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 underline">在新页面打开</a>
                  </div>
                )}
                {selectedPlatform === 'custom' && (
                  <div className="mt-3 flex gap-2">
                    <input
                      type="text"
                      value={customStreamUrl}
                      onChange={(e) => setCustomStreamUrl(e.target.value)}
                      placeholder="粘贴任意直播平台的嵌入链接 (iframe src)"
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-cyan-500"
                    />
                    <button
                      onClick={() => { if (customStreamUrl) { setIsPlaying(true); setEmbedError(false); } }}
                      className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-slate-950 text-xs font-bold rounded-lg transition cursor-pointer shrink-0"
                    >
                      应用并播放
                    </button>
                  </div>
                )}

                {/* Proxy 设置 (可选 - 部署 Cloudflare Worker 后用) */}
                <div className="mt-3 pt-3 border-t border-slate-800/50">
                  <button
                    onClick={() => setShowProxySettings(!showProxySettings)}
                    className="flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-300 transition"
                  >
                    <Settings className="h-3 w-3" />
                    {showProxySettings ? '收起高级设置' : '高级设置 · 直播流代理'}
                  </button>
                  {showProxySettings && (
                    <div className="mt-2 flex gap-2">
                      <input
                        type="text"
                        value={proxyUrl}
                        onChange={(e) => setProxyUrl(e.target.value)}
                        placeholder="Cloudflare Worker 地址 (如 https://stream-proxy.xxx.workers.dev)"
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-cyan-500 font-mono"
                      />
                      <button
                        onClick={() => { if (proxyUrl) setShowProxySettings(false); }}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg transition cursor-pointer shrink-0"
                      >
                        保存
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Match Selector */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300">全部赛事</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Live */}
                  <div className="space-y-3">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-2 border-l-2 border-rose-500">直播中</div>
                    {allMatches.filter(m => m.status === 'live').map(m => {
                      const isSelected = m.id === selectedMatch.id;
                      return (
                        <div key={m.id} onClick={() => { setSelectedMatchId(m.id); triggerAlert(`已切换至 ${m.teamA.shortName} vs ${m.teamB.shortName}`); }}
                          className={`bg-slate-950 border rounded-xl p-3 space-y-2 hover:border-cyan-500/50 transition cursor-pointer ${isSelected ? 'border-cyan-500/50 shadow-md shadow-cyan-950/40' : 'border-slate-800'}`}>
                          <div className="flex justify-between text-xs items-center">
                            <span className="text-[10px] text-slate-500 font-mono">{m.tournament}</span>
                            <span className="text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-1.5 py-0.2 rounded font-semibold animate-pulse">● LIVE</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span>{m.teamA.logo}</span>
                            <span className="flex-1 font-semibold text-slate-200">{m.teamA.shortName}</span>
                            <span className="font-mono font-bold text-slate-300">{m.teamA.score ?? '-'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span>{m.teamB.logo}</span>
                            <span className="flex-1 font-semibold text-slate-200">{m.teamB.shortName}</span>
                            <span className="font-mono font-bold text-slate-300">{m.teamB.score ?? '-'}</span>
                          </div>
                        </div>
                      );
                    })}
                    {allMatches.filter(m => m.status === 'live').length === 0 && (
                      <div className="text-xs text-slate-500 text-center py-4">暂无直播中的赛事</div>
                    )}
                  </div>

                  {/* Upcoming */}
                  <div className="space-y-3">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-2 border-l-2 border-yellow-500">即将开始</div>
                    {allMatches.filter(m => m.status === 'upcoming').map(m => (
                      <div key={m.id} onClick={() => { setSelectedMatchId(m.id); triggerAlert(`已查看预告：${m.teamA.shortName} vs ${m.teamB.shortName}`); }}
                        className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2 hover:border-yellow-500/40 transition cursor-pointer">
                        <div className="flex justify-between text-xs items-center">
                          <span className="text-[10px] text-slate-500 font-mono">{m.tournament}</span>
                          <span className="text-[10px] bg-slate-900 px-1.5 py-0.2 text-slate-400 rounded border border-slate-800">未开始</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span>{m.teamA.logo}</span>
                          <span className="flex-1 font-semibold text-slate-200">{m.teamA.shortName}</span>
                          <span className="font-mono text-slate-500">VS</span>
                          <span>{m.teamB.logo}</span>
                          <span className="flex-1 font-semibold text-slate-200">{m.teamB.shortName}</span>
                        </div>
                        <div className="text-[10px] text-slate-500">🕒 {m.startTime}</div>
                      </div>
                    ))}
                  </div>

                  {/* Finished */}
                  <div className="space-y-3">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-2 border-l-2 border-slate-700">已结束</div>
                    {allMatches.filter(m => m.status === 'finished').map(m => (
                      <div key={m.id} onClick={() => { setSelectedMatchId(m.id); }}
                        className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2 hover:border-slate-700 transition cursor-pointer">
                        <div className="flex justify-between text-xs items-center">
                          <span className="text-[10px] text-slate-500 font-mono">{m.tournament}</span>
                          <span className="text-[10px] bg-slate-900 px-1.5 py-0.2 text-slate-400 rounded border border-slate-800">已结束</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span>{m.teamA.logo}</span>
                          <span className="flex-1 font-semibold text-slate-200">{m.teamA.shortName}</span>
                          <span className="font-mono font-bold text-slate-300">{m.teamA.score}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span>{m.teamB.logo}</span>
                          <span className="flex-1 font-semibold text-slate-200">{m.teamB.shortName}</span>
                          <span className="font-mono font-bold text-slate-300">{m.teamB.score}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selected Match Detail */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-cyan-400" />
                    <h4 className="text-sm font-extrabold text-slate-300">对局信息</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <div className="text-slate-500">参赛战队</div>
                      <div className="text-slate-200 font-semibold mt-0.5">{selectedMatch.teamA.shortName} vs {selectedMatch.teamB.shortName}</div>
                    </div>
                    <div>
                      <div className="text-slate-500">赛事</div>
                      <div className="text-slate-200 mt-0.5">{selectedMatch.tournament} · {selectedMatch.stage}</div>
                    </div>
                    <div>
                      <div className="text-slate-500">开赛时间</div>
                      <div className="text-slate-200 mt-0.5">{selectedMatch.startTime}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Prediction + Chat */}
            <div className="space-y-6">
              {/* Prediction */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 rounded-full filter blur-lg"></div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coins className="h-5 w-5 text-yellow-500" />
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-200">实时竞猜</h3>
                  </div>
                  <span className="text-[10px] bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded">限时获利</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{selectedMatch.teamA.shortName} 对阵 {selectedMatch.teamB.shortName}。预测正确即可瓜分积分！</p>
                <div className="space-y-3.5 pt-2">
                  <button disabled={liveMatchStats.hasVoted} onClick={() => handlePredict(selectedMatch.teamA.shortName)}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-left transition-all flex items-center justify-between border cursor-pointer ${liveMatchStats.hasVoted && liveMatchStats.votedTeam === selectedMatch.teamA.shortName ? "bg-red-600 border-red-500 text-white shadow-lg shadow-red-950/40" : liveMatchStats.hasVoted ? "bg-slate-950/50 border-slate-900 text-slate-500 opacity-60 cursor-not-allowed" : "bg-slate-950 hover:bg-slate-900 border-slate-800 hover:border-red-500/50 text-slate-200 group"}`}>
                    <span className="flex items-center gap-2"><span>{selectedMatch.teamA.logo}</span> {selectedMatch.teamA.shortName} 获胜</span>
                    <span className="font-mono text-slate-400 group-hover:text-red-400">{liveMatchStats.team1VotedPercent}%</span>
                  </button>
                  <button disabled={liveMatchStats.hasVoted} onClick={() => handlePredict(selectedMatch.teamB.shortName)}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-left transition-all flex items-center justify-between border cursor-pointer ${liveMatchStats.hasVoted && liveMatchStats.votedTeam === selectedMatch.teamB.shortName ? "bg-cyan-600 border-cyan-500 text-slate-950 shadow-lg shadow-cyan-950/40" : liveMatchStats.hasVoted ? "bg-slate-950/50 border-slate-900 text-slate-500 opacity-60 cursor-not-allowed" : "bg-slate-950 hover:bg-slate-900 border-slate-800 hover:border-cyan-500/50 text-slate-200 group"}`}>
                    <span className="flex items-center gap-2"><span>{selectedMatch.teamB.logo}</span> {selectedMatch.teamB.shortName} 获胜</span>
                    <span className="font-mono text-slate-400 group-hover:text-cyan-400">{liveMatchStats.team2VotedPercent}%</span>
                  </button>
                </div>
                {liveMatchStats.hasVoted ? (
                  <div className="bg-slate-950 border border-emerald-500/20 rounded-xl p-3 text-center text-xs text-emerald-400">🎉 感谢参与！系统将在比赛结束后自动结算积分。</div>
                ) : (
                  <div className="text-[11px] text-slate-500 text-center">预测成功可获得双倍积分返还</div>
                )}
              </div>

              {/* Chat */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col h-[420px] shadow-lg relative">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-cyan-400" />
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-200">互动聊天</h3>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    在线: {selectedMatch.viewers ? Math.round(selectedMatch.viewers / 100) : 0}k
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
                  {chatMessages.map((chat) => (
                    <div key={chat.id} className="space-y-0.5 transition-all duration-200">
                      <div className="flex items-center gap-1.5">
                        {chat.vip && <span className="px-1 text-[9px] bg-yellow-500/20 text-yellow-500 font-bold rounded border border-yellow-500/20">PRO</span>}
                        <span className={`font-semibold ${chat.isUser ? "text-cyan-400" : "text-slate-400"}`}>{chat.user}</span>
                        {chat.team && chat.team !== "Neutral" && (
                          <span className={`text-[9px] px-1 rounded ${chat.team === selectedMatch.teamA.shortName ? "bg-red-950 text-red-400" : "bg-cyan-950 text-cyan-400"}`}>{chat.team}粉</span>
                        )}
                      </div>
                      <p className="text-slate-200 bg-slate-950/40 px-2.5 py-1.5 rounded-lg border border-slate-950 inline-block max-w-full break-words">{chat.msg}</p>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                <div className="py-2 flex gap-1 overflow-x-auto shrink-0">
                  {[`${selectedMatch.teamA.shortName} 加油！🚀`, `${selectedMatch.teamB.shortName} 稳住！💪`, "起飞！🦅", "GG WP! 🙌"].map((quickText) => (
                    <button key={quickText} onClick={() => setUserChatMessage(quickText)} className="text-[10px] bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 px-2 py-1 rounded border border-slate-800 shrink-0 cursor-pointer">{quickText}</button>
                  ))}
                </div>
                <form onSubmit={handleSendChat} className="flex items-center gap-2 mt-2 shrink-0 border-t border-slate-800/80 pt-3">
                  <input type="text" value={userChatMessage} onChange={(e) => setUserChatMessage(e.target.value)} placeholder="发送弹幕..." className="flex-1 bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl px-3 py-2 text-xs outline-none text-slate-200" />
                  <button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold p-2 rounded-xl transition cursor-pointer shrink-0"><Send className="h-4 w-4" /></button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
