import { useState, useEffect, useRef } from "react";
import {
  Trophy,
  Tv,
  Flame,
  MessageSquare,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Coins,
  Sparkles,
  Info,
  Send,
} from "lucide-react";
import { MATCHES, GAMES, type Match } from "../data/esportsData";

interface LivePageProps {
  onBack: () => void;
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

export default function LivePage({ onBack }: LivePageProps) {
  const liveMatches = MATCHES.filter(m => m.status === 'live');
  const defaultMatch = liveMatches[0] || MATCHES[0];

  const [selectedMatch, setSelectedMatch] = useState<Match>(defaultMatch);
  const [notification, setNotification] = useState<string | null>("欢迎来到赛事直播大厅！参与实时预测即可获得竞技积分。");

  const game = GAMES.find(g => g.id === selectedMatch.game);
  const teamAColor = game?.color || '#6366f1';
  const teamBColor = game ? GAMES.find(g => g.id !== selectedMatch.game)?.color || '#FF4655' : '#FF4655';

  const [liveMatchStats, setLiveMatchStats] = useState({
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

  const [liveEvents, setLiveEvents] = useState<string[]>([
    `🕹️ ${selectedMatch.tournament} ${selectedMatch.stage} 比赛正式开始！`,
    `💰 首杀由 ${selectedMatch.teamA.shortName} 在上路拿下！`,
    `🐉 ${selectedMatch.teamA.shortName} 拿下第一条小龙。`,
  ]);

  const [chatMessages, setChatMessages] = useState<{ id: number; user: string; msg: string; isUser?: boolean; vip?: boolean; team?: string }[]>([
    { id: 1, user: "电竞老司机", msg: `${selectedMatch.teamA.shortName} 今天状态太好了！🔥`, vip: true, team: selectedMatch.teamA.shortName },
    { id: 2, user: "RankKing", msg: `${selectedMatch.teamB.shortName} 稳住，还有机会！`, vip: false, team: selectedMatch.teamB.shortName },
    { id: 3, user: "直播达人", msg: "网页直播不卡顿，太流畅了！🚀", vip: false, team: "Neutral" }
  ]);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [userChatMessage, setUserChatMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  useEffect(() => {
    if (selectedMatch.status !== 'live') return;
    const interval = setInterval(() => {
      setLiveMatchStats((prev) => {
        const timeParts = prev.gameTime.split(":");
        let minutes = parseInt(timeParts[0]);
        let seconds = parseInt(timeParts[1]) + 3;
        if (seconds >= 60) { minutes += 1; seconds = seconds - 60; }
        const score1Add = Math.random() > 0.75 ? 1 : 0;
        const score2Add = Math.random() > 0.85 ? 1 : 0;
        const gold1Val = parseFloat(prev.team1Gold) + (score1Add * 0.4) + (Math.random() * 0.1);
        const gold2Val = parseFloat(prev.team2Gold) + (score2Add * 0.4) + (Math.random() * 0.1);
        return {
          ...prev,
          gameTime: `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
          team1Score: prev.team1Score + score1Add,
          team2Score: prev.team2Score + score2Add,
          team1Gold: `${gold1Val.toFixed(1)}k`,
          team2Gold: `${gold2Val.toFixed(1)}k`
        };
      });

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

  const allMatches = MATCHES;

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

                <div className="aspect-video bg-slate-950 flex flex-col justify-between relative overflow-hidden select-none">
                  {/* Actual video element */}
                  <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover"
                    src="https://www.w3schools.com/html/mov_bbb.mp4"
                    poster="https://www.w3schools.com/html/pic_trulli.jpg"
                    playsInline
                    muted={isMuted}
                    loop
                    onError={() => setVideoError(true)}
                  />
                  {videoError && (
                    <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950">
                      <div className="text-center">
                        <Tv className="h-16 w-16 text-slate-700 mx-auto mb-3" />
                        <p className="text-slate-400 text-sm">视频流加载失败</p>
                        <p className="text-slate-600 text-xs mt-1">可尝试刷新页面或检查网络连接</p>
                      </div>
                    </div>
                  )}

                  {/* Gradient overlay for readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 pointer-events-none z-[1]"></div>

                  {/* Play overlay when paused */}
                  {!isPlaying && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/40 transition-all duration-300">
                      <div
                        className="flex flex-col items-center gap-3 group cursor-pointer"
                        onClick={() => {
                          setIsPlaying(true);
                          videoRef.current?.play();
                        }}
                      >
                        <div className="w-20 h-20 rounded-full bg-cyan-500/20 border-2 border-cyan-400/60 flex items-center justify-center group-hover:bg-cyan-500/30 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-cyan-500/20">
                          <Play className="h-10 w-10 text-cyan-400 ml-1" />
                        </div>
                        <span className="text-cyan-300 text-sm font-semibold tracking-wider">点击开始观看直播</span>
                      </div>
                    </div>
                  )}

                  {/* Scores overlay */}
                  <div className="relative z-[5] flex items-center justify-between max-w-xl mx-auto w-full bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 backdrop-blur shadow-lg mt-12">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{selectedMatch.teamA.logo}</span>
                      <div className="text-left">
                        <h4 className="font-extrabold text-slate-100 text-sm sm:text-base">{selectedMatch.teamA.shortName}</h4>
                        <p className="text-[10px] text-slate-400">{selectedMatch.teamA.name}</p>
                      </div>
                    </div>
                    <div className="text-center px-4">
                      <div className="text-xs text-slate-400 font-mono tracking-widest uppercase mb-1">BO{selectedMatch.bestOf} · {selectedMatch.stage}</div>
                      <div className="flex items-center gap-3 justify-center">
                        <span className="text-2xl font-extrabold text-red-500 font-mono">{liveMatchStats.team1Score}</span>
                        <span className="text-slate-600 font-bold text-sm">VS</span>
                        <span className="text-2xl font-extrabold text-cyan-400 font-mono">{liveMatchStats.team2Score}</span>
                      </div>
                      {selectedMatch.status === 'live' && (
                        <div className="text-xs font-mono text-yellow-500 mt-1.5 bg-yellow-500/10 px-2 py-0.5 rounded">🕒 比赛时长 {liveMatchStats.gameTime}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 flex-row-reverse text-right">
                      <span className="text-3xl">{selectedMatch.teamB.logo}</span>
                      <div>
                        <h4 className="font-extrabold text-slate-100 text-sm sm:text-base">{selectedMatch.teamB.shortName}</h4>
                        <p className="text-[10px] text-slate-400">{selectedMatch.teamB.name}</p>
                      </div>
                    </div>
                  </div>

                  {/* Gold & Objectives (only for live matches) */}
                  {selectedMatch.status === 'live' && (
                    <div className="grid grid-cols-3 gap-4 max-w-md mx-auto w-full relative z-[5] mt-auto mb-4 text-xs font-mono text-center">
                      <div className="bg-slate-900/80 border border-slate-800/60 rounded-xl p-2 backdrop-blur">
                        <div className="text-slate-400 text-[10px]">经济对比</div>
                        <div className="text-slate-200 flex justify-center gap-2 mt-0.5">
                          <span className="text-red-400">{liveMatchStats.team1Gold}</span><span>:</span><span className="text-cyan-400">{liveMatchStats.team2Gold}</span>
                        </div>
                      </div>
                      <div className="bg-slate-900/80 border border-slate-800/60 rounded-xl p-2 backdrop-blur">
                        <div className="text-slate-400 text-[10px]">纳什男爵</div>
                        <div className="text-slate-200 flex justify-center gap-3 mt-0.5">
                          <span className="text-red-400">{liveMatchStats.team1Barons}</span><span>/</span><span className="text-cyan-400">{liveMatchStats.team2Barons}</span>
                        </div>
                      </div>
                      <div className="bg-slate-900/80 border border-slate-800/60 rounded-xl p-2 backdrop-blur">
                        <div className="text-slate-400 text-[10px]">巨龙数量</div>
                        <div className="text-slate-200 flex justify-center gap-3 mt-0.5">
                          <span className="text-red-400">{liveMatchStats.team1Dragons}</span><span>/</span><span className="text-cyan-400">{liveMatchStats.team2Dragons}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Controls */}
                  <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 px-4 py-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-900 z-10">
                    <div className="flex items-center gap-3">
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isPlaying) {
                            videoRef.current?.pause();
                            setIsPlaying(false);
                          } else {
                            videoRef.current?.play();
                            setIsPlaying(true);
                          }
                        }}
                        className="cursor-pointer"
                      >
                        {isPlaying ? <Pause className="h-4.5 w-4.5 text-cyan-400" /> : <Play className="h-4.5 w-4.5 text-cyan-400 animate-pulse" />}
                      </span>
                      <span className="relative">
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            if (videoRef.current) {
                              videoRef.current.muted = !isMuted;
                              setIsMuted(!isMuted);
                            }
                          }}
                          className="cursor-pointer"
                        >
                          {isMuted ? <VolumeX className="h-4.5 w-4.5 text-slate-500" /> : <Volume2 className="h-4.5 w-4.5 text-slate-400" />}
                        </span>
                      </span>
                      {isPlaying && <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping"></span>}
                      <span className="text-[10px] font-mono">实时推流：超清 1080P / 60FPS</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">网络延迟: 8ms</span>
                      <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-emerald-400 font-semibold">H.265 加速</span>
                    </div>
                  </div>
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
                        <div key={m.id} onClick={() => { setSelectedMatch(m); triggerAlert(`已切换至 ${m.teamA.shortName} vs ${m.teamB.shortName}`); }}
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
                      <div key={m.id} onClick={() => { setSelectedMatch(m); triggerAlert(`已查看预告：${m.teamA.shortName} vs ${m.teamB.shortName}`); }}
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
                      <div key={m.id} onClick={() => { setSelectedMatch(m); }}
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
