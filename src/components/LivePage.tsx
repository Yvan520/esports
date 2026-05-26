import { useState, useEffect, useRef } from "react";
import {
  Trophy,
  Tv,
  TrendingUp,
  Award,
  MessageSquare,
  Sliders,
  ChevronRight,
  BarChart2,
  CheckCircle2,
  Play,
  Volume2,
  Coins,
  Sparkles,
  Flame,
  Info,
  Send,
  BookOpen,
  Gamepad2
} from "lucide-react";

interface LivePageProps {
  onBack: () => void;
}

// Mock Teams Data
const TEAMS_DATA = [
  { id: "t1", name: "T1 Esports", logo: "🔴", country: "South Korea", winRate: 78, avgKda: 4.8, firstBlood: 62, goldDiff: 1240, fanIndex: 98, color: "from-red-600 to-rose-700" },
  { id: "geng", name: "Gen.G", logo: "🟡", country: "South Korea", winRate: 82, avgKda: 5.2, firstBlood: 58, goldDiff: 1450, fanIndex: 91, color: "from-amber-500 to-yellow-600" },
  { id: "blg", name: "Bilibili Gaming", logo: "🔵", country: "China", winRate: 75, avgKda: 4.6, firstBlood: 70, goldDiff: 1150, fanIndex: 93, color: "from-sky-400 to-blue-600" },
  { id: "wbg", name: "Weibo Gaming", logo: "⚪", country: "China", winRate: 68, avgKda: 4.1, firstBlood: 52, goldDiff: 850, fanIndex: 86, color: "from-gray-400 to-slate-600" },
  { id: "snt", name: "Sentinels", logo: "🔴", country: "United States", winRate: 70, avgKda: 4.3, firstBlood: 65, goldDiff: 920, fanIndex: 95, color: "from-red-500 to-pink-600" },
  { id: "fnc", name: "Fnatic", logo: "🟠", country: "Europe", winRate: 65, avgKda: 3.9, firstBlood: 55, goldDiff: 780, fanIndex: 89, color: "from-orange-500 to-amber-600" },
  { id: "navi", name: "Natus Vincere", logo: "🟡", country: "Ukraine", winRate: 76, avgKda: 4.7, firstBlood: 68, goldDiff: 1180, fanIndex: 92, color: "from-yellow-400 to-yellow-500" },
  { id: "vit", name: "Team Vitality", logo: "🐝", country: "France", winRate: 72, avgKda: 4.4, firstBlood: 60, goldDiff: 1020, fanIndex: 87, color: "from-yellow-500 to-amber-700" }
];

// Mock Tournament Bracket Matches
const BRACKET_MATCHES = [
  { id: "q1", stage: "Quarterfinals", team1: "T1 Esports", team2: "Fnatic", score1: 3, score2: 1, winner: "t1", status: "Finished", time: "2026-02-20" },
  { id: "q2", stage: "Quarterfinals", team2: "Bilibili Gaming", team1: "Sentinels", score1: 2, score2: 3, winner: "snt", status: "Finished", time: "2026-02-21" },
  { id: "q3", stage: "Quarterfinals", team1: "Gen.G", team2: "Team Vitality", score1: 3, score2: 0, winner: "geng", status: "Finished", time: "2026-02-22" },
  { id: "q4", stage: "Quarterfinals", team1: "Natus Vincere", team2: "Weibo Gaming", score1: 3, score2: 2, winner: "navi", status: "Finished", time: "2026-02-23" },
  { id: "s1", stage: "Semifinals", team1: "T1 Esports", team2: "Sentinels", score1: 2, score2: 0, winner: "", status: "Live", time: "Playing now" },
  { id: "s2", stage: "Semifinals", team1: "Gen.G", team2: "Natus Vincere", score1: 0, score2: 0, winner: "", status: "Upcoming", time: "Feb 28, 19:00" },
  { id: "f1", stage: "Grand Finals", team1: "T1 / Sentinels Winner", team2: "Gen.G / NaVi Winner", score1: 0, score2: 0, winner: "", status: "Upcoming", time: "Mar 02, 20:00" }
];

const LIVE_EVENTS_TEMPLATES = [
  "🔴 T1 secured a crucial kill in the mid lane!",
  "⚔️ Teamfight breakdown! Sentinels trades 2 for 3 at the Baron Pit.",
  "🐉 Sentinels has secured the Hextech Dragon!",
  "🏆 T1 Faker performs a stunning flank, securing double kills!",
  "⚡ Baron Nashor has spawned! Both teams positioning aggressively.",
  "🎯 Sentinels TenZ scores a clean headshot in the brush!",
  "💰 Gold difference narrows down to just 800g in favor of T1.",
  "🛡️ T1 successfully defends their Tier 2 bot tower.",
  "💥 Insane team fight! T1 wiped 4 members of Sentinels, only TenZ survives!",
];

const BOT_CHAT_TEMPLATES = [
  { user: "CyberNinja99", msg: "T1 is looking super clean this game! 🔥", vip: true, team: "T1" },
  { user: "VandalMaster", msg: "Sentinels can still comeback if TenZ secures the next Baron!", vip: false, team: "Sentinels" },
  { user: "FakerFanboy_1", msg: "FAKER MY GOAT!!! DID YOU SEE THAT FLANK? 🐐🐐🐐", vip: true, team: "T1" },
  { user: "LPL_Enjoyer", msg: "Wait, is this game 3 of the Bo5? The crowd is going insane!", vip: false, team: "Neutral" },
  { user: "TacticalPro", msg: "The draft for Sentinels is a bit greedy, they need late game scaling.", vip: true, team: "Sentinels" },
  { user: "StreamWatcher", msg: "No lag at 1080p 60fps, this web player is buttery smooth! 🚀", vip: false, team: "Neutral" },
  { user: "ArenaBettor", msg: "Put all my Arena Points on T1 to win Game 3! Let's gooo!", vip: true, team: "T1" }
];

export default function LivePage({ onBack }: LivePageProps) {
  const [userPoints, setUserPoints] = useState<number>(3500);
  const [notification, setNotification] = useState<string | null>(
    "欢迎来到 E-Arena 赛事中心！参与实时预测即可获得竞技积分。"
  );

  // Live Match Engine State
  const [liveMatchStats, setLiveMatchStats] = useState({
    team1Score: 21,
    team2Score: 17,
    gameTime: "24:15",
    team1Gold: "48.5k",
    team2Gold: "46.2k",
    team1Barons: 1,
    team2Barons: 0,
    team1Dragons: 2,
    team2Dragons: 2,
    team1VotedPercent: 62,
    team2VotedPercent: 38,
    hasVoted: false,
    votedTeam: ""
  });

  const [liveEvents, setLiveEvents] = useState<string[]>([
    "🕹️ Game 3 of the Semifinals has commenced!",
    "💰 First Blood secured by T1 in the top lane!",
    "🐉 T1 takes the first Infernal Dragon.",
    "⚔️ Sentinels fights back at Rift Herald, securing 2 kills and the Herald!"
  ]);

  const [chatMessages, setChatMessages] = useState<{ id: number; user: string; msg: string; isUser?: boolean; vip?: boolean; team?: string }[]>([
    { id: 1, user: "CyberNinja99", msg: "T1 is looking super clean this game! 🔥", vip: true, team: "T1" },
    { id: 2, user: "VandalMaster", msg: "Sentinels can still comeback if TenZ secures the next Baron!", vip: false, team: "Sentinels" },
    { id: 3, user: "StreamWatcher", msg: "No lag at 1080p 60fps, this web player is buttery smooth! 🚀", vip: false, team: "Neutral" }
  ]);
  
  const [userChatMessage, setUserChatMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const [selectedBracketMatch, setSelectedBracketMatch] = useState<any>(BRACKET_MATCHES[4]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Live match engine
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMatchStats((prev) => {
        const timeParts = prev.gameTime.split(":");
        let minutes = parseInt(timeParts[0]);
        let seconds = parseInt(timeParts[1]) + 3;
        if (seconds >= 60) {
          minutes += 1;
          seconds = seconds - 60;
        }
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
        const randomEvent = LIVE_EVENTS_TEMPLATES[Math.floor(Math.random() * LIVE_EVENTS_TEMPLATES.length)];
        setLiveEvents((prev) => [randomEvent, ...prev.slice(0, 12)]);
      }

      if (Math.random() > 0.5) {
        const randomBotMsg = BOT_CHAT_TEMPLATES[Math.floor(Math.random() * BOT_CHAT_TEMPLATES.length)];
        setChatMessages((prev) => [
          ...prev,
          { id: Date.now(), user: randomBotMsg.user, msg: randomBotMsg.msg, vip: randomBotMsg.vip, team: randomBotMsg.team }
        ]);
      }
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const triggerAlert = (text: string) => {
    setNotification(text);
    setTimeout(() => { setNotification(null); }, 6000);
  };

  const handlePredict = (team: string) => {
    if (liveMatchStats.hasVoted) return;
    const voteReward = 200;
    setUserPoints((prev) => prev + voteReward);
    setLiveMatchStats((prev) => {
      const t1Pct = team === "T1" ? prev.team1VotedPercent + 2 : prev.team1VotedPercent - 2;
      const t2Pct = 100 - t1Pct;
      return { ...prev, hasVoted: true, votedTeam: team, team1VotedPercent: t1Pct, team2VotedPercent: t2Pct };
    });
    triggerAlert(`✨ 预测成功！已投给 ${team}。系统赠送您 [${voteReward}] 点竞技积分！`);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userChatMessage.trim()) return;
    const newMsg = { id: Date.now(), user: "我 (You)", msg: userChatMessage, isUser: true, vip: true, team: "T1" };
    setChatMessages((prev) => [...prev, newMsg]);
    setUserChatMessage("");
    setTimeout(() => {
      const replies = ["老哥分析得很有道理！我也觉得是这样 👍", "哈哈，看好你哦！", "真假？我还是觉得这把有转机！🔥", "冲冲冲，这一波我支持兄弟！"];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      setChatMessages((prev) => [...prev, { id: Date.now() + 1, user: "电竞智囊团", msg: `@我 (You) ${randomReply}`, vip: false, team: "Neutral" }]);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Notification Banner */}
      {notification && (
        <div className="bg-gradient-to-r from-cyan-900 via-violet-950 to-cyan-900 border-b border-cyan-500/30 py-2.5 px-4 text-sm transition-all duration-500 ease-in-out sticky top-0 z-50 shadow-md shadow-cyan-950/40 backdrop-blur-md">
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
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-cyan-500 via-indigo-500 to-violet-600 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
                <div className="bg-slate-950 h-full w-full rounded-[10px] flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-cyan-400 animate-bounce" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-white via-cyan-300 to-indigo-400 bg-clip-text text-transparent tracking-tight">E-ARENA</h1>
                  <span className="text-[9px] font-mono bg-cyan-500/10 text-cyan-400 px-1.5 py-0.2 rounded border border-cyan-500/20">PRO</span>
                </div>
                <p className="text-[11px] text-slate-400 tracking-wider">智能电竞赛事中心 & 商业沙盒系统</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2 shadow-inner">
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-slate-400">积分:</span>
                    <span className="text-sm font-bold text-cyan-400 font-mono">{userPoints}</span>
                  </div>
                  <span className="text-[9px] text-slate-500">等级: LV.12 (白银预测师)</span>
                </div>
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-xs font-extrabold text-slate-950 ring-2 ring-cyan-500/30 shadow">U</div>
              </div>
              <button onClick={onBack} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-medium transition cursor-pointer">← 返回主页</button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Live Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Stream + Log + Bracket */}
            <div className="lg:col-span-2 space-y-6">
              {/* Streaming Video Mockup */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative group">
                <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-slate-950/90 to-transparent p-4 flex items-center justify-between z-10">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-0.5 rounded text-xs font-extrabold bg-red-600 text-white flex items-center gap-1">🔴 直播中</span>
                    <h3 className="text-sm font-bold text-white tracking-wide">LOL 2026 圣杯总决赛 Semifinals</h3>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-300 bg-slate-950/60 px-3 py-1 rounded-full border border-slate-800">
                    <span className="flex items-center gap-1 text-rose-400 font-mono"><Flame className="h-3 w-3" /> 2,485,102 观众</span>
                  </div>
                </div>

                <div className="aspect-video bg-slate-950 flex flex-col justify-between p-6 relative overflow-hidden select-none">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-64 h-64 rounded-full border-2 border-dashed border-indigo-500/15 animate-spin duration-10000"></div>
                    <div className="w-48 h-48 rounded-full border border-cyan-500/10 absolute animate-pulse"></div>
                  </div>

                  {/* Scores */}
                  <div className="mt-12 relative z-10 flex items-center justify-between max-w-xl mx-auto w-full bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 backdrop-blur shadow-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">🔴</span>
                      <div className="text-left">
                        <h4 className="font-extrabold text-slate-100 text-sm sm:text-base">T1 Esports</h4>
                        <p className="text-[10px] text-slate-400">首血率 62% | 控龙 54%</p>
                      </div>
                    </div>
                    <div className="text-center px-4">
                      <div className="text-xs text-slate-400 font-mono tracking-widest uppercase mb-1">GAME 3 (BO5)</div>
                      <div className="flex items-center gap-3 justify-center">
                        <span className="text-2xl font-extrabold text-red-500 font-mono">{liveMatchStats.team1Score}</span>
                        <span className="text-slate-600 font-bold text-sm">VS</span>
                        <span className="text-2xl font-extrabold text-cyan-400 font-mono">{liveMatchStats.team2Score}</span>
                      </div>
                      <div className="text-xs font-mono text-yellow-500 mt-1.5 bg-yellow-500/10 px-2 py-0.5 rounded">🕒 比赛时长 {liveMatchStats.gameTime}</div>
                    </div>
                    <div className="flex items-center gap-3 flex-row-reverse text-right">
                      <span className="text-3xl">🔵</span>
                      <div>
                        <h4 className="font-extrabold text-slate-100 text-sm sm:text-base">Sentinels</h4>
                        <p className="text-[10px] text-slate-400">首血率 65% | 控龙 46%</p>
                      </div>
                    </div>
                  </div>

                  {/* Gold & Objectives */}
                  <div className="grid grid-cols-3 gap-4 max-w-md mx-auto w-full relative z-10 mt-auto mb-4 text-xs font-mono text-center">
                    <div className="bg-slate-900/90 border border-slate-800/60 rounded-xl p-2">
                      <div className="text-slate-400 text-[10px]">经济对比</div>
                      <div className="text-slate-200 flex justify-center gap-2 mt-0.5">
                        <span className="text-red-400">{liveMatchStats.team1Gold}</span>
                        <span>:</span>
                        <span className="text-cyan-400">{liveMatchStats.team2Gold}</span>
                      </div>
                    </div>
                    <div className="bg-slate-900/90 border border-slate-800/60 rounded-xl p-2">
                      <div className="text-slate-400 text-[10px]">纳什男爵</div>
                      <div className="text-slate-200 flex justify-center gap-3 mt-0.5">
                        <span className="text-red-400">{liveMatchStats.team1Barons}</span>
                        <span>/</span>
                        <span className="text-cyan-400">{liveMatchStats.team2Barons}</span>
                      </div>
                    </div>
                    <div className="bg-slate-900/90 border border-slate-800/60 rounded-xl p-2">
                      <div className="text-slate-400 text-[10px]">巨龙数量</div>
                      <div className="text-slate-200 flex justify-center gap-3 mt-0.5">
                        <span className="text-red-400">{liveMatchStats.team1Dragons}</span>
                        <span>/</span>
                        <span className="text-cyan-400">{liveMatchStats.team2Dragons}</span>
                      </div>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 px-4 py-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-900 z-10">
                    <div className="flex items-center gap-3">
                      <Play className="h-4.5 w-4.5 text-cyan-400 animate-pulse cursor-pointer" />
                      <Volume2 className="h-4.5 w-4.5 text-slate-400 cursor-pointer" />
                      <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping"></span>
                      <span className="text-[10px] font-mono">实时推流：超清 1080P / 60FPS</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">网络延迟: 8ms (极佳)</span>
                      <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-emerald-400 font-semibold">H.265 硬件加速</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Event Log */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-ping"></div>
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300">赛事高光情报 (实时生成)</h3>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">3秒前更新</span>
                </div>
                <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 max-h-48 overflow-y-auto space-y-2.5 font-mono text-xs">
                  {liveEvents.map((event, index) => (
                    <div key={index} className={`flex items-start gap-2 py-1 border-b border-slate-900/50 last:border-0 transition-all duration-300 ${index === 0 ? "text-cyan-300 font-semibold translate-x-1" : "text-slate-400"}`}>
                      <span className="text-slate-600">[{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}]</span>
                      <span>{event}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bracket Explorer */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      E-Arena 2026 网络公开大师赛对阵图
                    </h3>
                    <p className="text-xs text-slate-400">单败淘汰制 · 线上赛段实时赛程</p>
                  </div>
                  <div className="bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 text-xs text-slate-300">
                    总奖金: <span className="text-yellow-500 font-bold">$1,000,000 USD</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 relative">
                  {/* Quarterfinals */}
                  <div className="space-y-4">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-2 border-l-2 border-slate-700">八强赛 (已完赛)</div>
                    <div className="space-y-3">
                      {BRACKET_MATCHES.filter(m => m.stage === "Quarterfinals").map((m) => (
                        <div key={m.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2 hover:border-slate-700 transition relative cursor-pointer" onClick={() => { setSelectedBracketMatch(m); triggerAlert(`已载入对阵数据: ${m.team1} vs ${m.team2}`); }}>
                          <div className="flex justify-between text-xs items-center">
                            <span className="text-[10px] text-slate-500 font-mono">{m.time}</span>
                            <span className="text-[10px] bg-slate-900 px-1.5 py-0.2 text-slate-400 rounded border border-slate-800">BO5</span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs items-center">
                              <span className={m.winner === "t1" || m.winner === "geng" || m.winner === "snt" || m.winner === "navi" ? "font-bold text-slate-200" : "text-slate-400"}>🔴 {m.team1}</span>
                              <span className="font-mono font-bold text-slate-300">{m.score1}</span>
                            </div>
                            <div className="flex justify-between text-xs items-center">
                              <span className={m.winner === "blg" || m.winner === "fnc" || m.winner === "vit" || m.winner === "wbg" ? "font-bold text-slate-200" : "text-slate-400"}>🔵 {m.team2}</span>
                              <span className="font-mono font-bold text-slate-300">{m.score2}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Semifinals */}
                  <div className="space-y-4">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-2 border-l-2 border-cyan-500">半决赛 (热赛进行中)</div>
                    <div className="space-y-3">
                      {BRACKET_MATCHES.filter(m => m.stage === "Semifinals").map((m) => {
                        const isLive = m.status === "Live";
                        return (
                          <div key={m.id} className={`bg-slate-950 border rounded-xl p-3 space-y-2 hover:border-cyan-500/50 transition relative cursor-pointer ${isLive ? "border-cyan-500/50 shadow-md shadow-cyan-950/40" : "border-slate-800"}`} onClick={() => { setSelectedBracketMatch(m); triggerAlert(`已载入半决赛数据: ${m.team1} vs ${m.team2}`); }}>
                            <div className="flex justify-between text-xs items-center">
                              <span className="text-[10px] text-slate-500 font-mono">{m.time}</span>
                              {isLive ? (
                                <span className="text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-1.5 py-0.2 rounded font-semibold animate-pulse">● 直播中</span>
                              ) : (
                                <span className="text-[10px] bg-slate-900 px-1.5 py-0.2 text-slate-400 rounded border border-slate-800">未开始</span>
                              )}
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs items-center">
                                <span className="font-semibold text-slate-200">🔴 {m.team1}</span>
                                <span className="font-mono font-bold text-rose-500">{m.score1}</span>
                              </div>
                              <div className="flex justify-between text-xs items-center">
                                <span className="font-semibold text-slate-200">🔵 {m.team2}</span>
                                <span className="font-mono font-bold text-cyan-400">{m.score2}</span>
                              </div>
                            </div>
                            <div className="text-[10px] text-cyan-400 flex items-center justify-end gap-1">
                              <span>点击查看预测与赔率</span>
                              <ChevronRight className="h-3 w-3" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Grand Finals */}
                  <div className="space-y-4">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-2 border-l-2 border-yellow-500">总决赛 (即将开战)</div>
                    <div className="space-y-3">
                      {BRACKET_MATCHES.filter(m => m.stage === "Grand Finals").map((m) => (
                        <div key={m.id} className="bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800 rounded-xl p-3 space-y-3 hover:border-yellow-500/40 transition relative cursor-pointer" onClick={() => { setSelectedBracketMatch(m); triggerAlert("已查看总决赛规划与场馆预约。"); }}>
                          <div className="flex justify-between text-xs items-center">
                            <span className="text-[10px] text-slate-500 font-mono">{m.time}</span>
                            <span className="text-[10px] bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-1.5 py-0.2 rounded font-semibold">🏆 冠军杯</span>
                          </div>
                          <div className="space-y-1.5 text-xs">
                            <div className="text-slate-400">🏆 {m.team1}</div>
                            <div className="text-slate-400">⚔️ {m.team2}</div>
                          </div>
                          <div className="pt-1 border-t border-slate-800/60 text-[10px] text-slate-400 flex justify-between">
                            <span>总决赛场馆: 鸟巢中心</span>
                            <span className="text-yellow-500 font-bold">BO7</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Selected Match Detail */}
                {selectedBracketMatch && (
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-cyan-400" />
                      <h4 className="text-sm font-extrabold text-slate-300">对局深度详情 ({selectedBracketMatch.stage})</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <div className="text-slate-500">参赛战队</div>
                        <div className="text-slate-200 font-semibold mt-0.5">{selectedBracketMatch.team1} vs {selectedBracketMatch.team2}</div>
                      </div>
                      <div>
                        <div className="text-slate-500">开赛时间</div>
                        <div className="text-slate-200 mt-0.5">{selectedBracketMatch.time}</div>
                      </div>
                      <div>
                        <div className="text-slate-500">胜率预测模型 (AI评估)</div>
                        <div className="text-emerald-400 font-semibold mt-0.5">
                          {selectedBracketMatch.team1.includes("T1") ? "T1 (68%) : Sentinels (32%)" : "Gen.G (72%) : NaVi (28%)"}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Prediction + Chat */}
            <div className="space-y-6">
              {/* Prediction Panel */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 rounded-full filter blur-lg"></div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coins className="h-5 w-5 text-yellow-500" />
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-200">实时金币预测系统</h3>
                  </div>
                  <span className="text-[10px] bg-cyan-500/15 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded">限时获利</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">当前对局：T1 对阵 Sentinels。预测正确即可瓜分 100,000 点竞技积分。投出您神圣的一票！</p>
                <div className="space-y-3.5 pt-2">
                  <button disabled={liveMatchStats.hasVoted} onClick={() => handlePredict("T1")} className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-left transition-all flex items-center justify-between border cursor-pointer ${liveMatchStats.hasVoted && liveMatchStats.votedTeam === "T1" ? "bg-red-600 border-red-500 text-white shadow-lg shadow-red-950/40" : liveMatchStats.hasVoted ? "bg-slate-950/50 border-slate-900 text-slate-500 opacity-60 cursor-not-allowed" : "bg-slate-950 hover:bg-slate-900 border-slate-800 hover:border-red-500/50 text-slate-200 group"}`}>
                    <span className="flex items-center gap-2"><span className="text-red-500 group-hover:animate-pulse">🔴</span> T1 Esports 获胜</span>
                    <span className="font-mono text-slate-400 group-hover:text-red-400">{liveMatchStats.team1VotedPercent}% 支持</span>
                  </button>
                  <button disabled={liveMatchStats.hasVoted} onClick={() => handlePredict("Sentinels")} className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-left transition-all flex items-center justify-between border cursor-pointer ${liveMatchStats.hasVoted && liveMatchStats.votedTeam === "Sentinels" ? "bg-cyan-600 border-cyan-500 text-slate-950 shadow-lg shadow-cyan-950/40" : liveMatchStats.hasVoted ? "bg-slate-950/50 border-slate-900 text-slate-500 opacity-60 cursor-not-allowed" : "bg-slate-950 hover:bg-slate-900 border-slate-800 hover:border-cyan-500/50 text-slate-200 group"}`}>
                    <span className="flex items-center gap-2"><span className="text-cyan-400 group-hover:animate-pulse">🔵</span> Sentinels 获胜</span>
                    <span className="font-mono text-slate-400 group-hover:text-cyan-400">{liveMatchStats.team2VotedPercent}% 支持</span>
                  </button>
                </div>
                {liveMatchStats.hasVoted ? (
                  <div className="bg-slate-950 border border-emerald-500/20 rounded-xl p-3 text-center text-xs text-emerald-400">🎉 感谢参与！您当前赔率：1.65x。系统将在本局比赛结束后自动为您结算积分。</div>
                ) : (
                  <div className="text-[11px] text-slate-500 text-center">提示：单次投票扣减 200 积分，但成功预测后至少双倍返还。</div>
                )}
              </div>

              {/* Chat Room */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col h-[420px] shadow-lg relative">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-cyan-400" />
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-200">直播聊天互动室</h3>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    在线: 8.4k
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
                  {chatMessages.map((chat) => (
                    <div key={chat.id} className="space-y-0.5 transition-all duration-200">
                      <div className="flex items-center gap-1.5">
                        {chat.vip && <span className="px-1 text-[9px] bg-yellow-500/20 text-yellow-500 font-bold rounded border border-yellow-500/20">PRO</span>}
                        <span className={`font-semibold ${chat.isUser ? "text-cyan-400" : "text-slate-400"}`}>{chat.user}</span>
                        {chat.team && chat.team !== "Neutral" && (
                          <span className={`text-[9px] px-1 rounded ${chat.team === "T1" ? "bg-red-950 text-red-400" : "bg-cyan-950 text-cyan-400"}`}>{chat.team}粉</span>
                        )}
                      </div>
                      <p className="text-slate-200 bg-slate-950/40 px-2.5 py-1.5 rounded-lg border border-slate-950 inline-block max-w-full break-words">{chat.msg}</p>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                {/* Quick Expressions */}
                <div className="py-2 flex gap-1 overflow-x-auto shrink-0">
                  {["Faker 666! 🐐", "T1战胜SEN! 🚀", "起飞！🦅", "GG WP! 🙌", "心疼TenZ 😭"].map((quickText) => (
                    <button key={quickText} onClick={() => { setUserChatMessage(quickText); }} className="text-[10px] bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 px-2 py-1 rounded border border-slate-800 shrink-0 cursor-pointer">{quickText}</button>
                  ))}
                </div>

                {/* Chat Input */}
                <form onSubmit={handleSendChat} className="flex items-center gap-2 mt-2 shrink-0 border-t border-slate-800/80 pt-3">
                  <input type="text" value={userChatMessage} onChange={(e) => setUserChatMessage(e.target.value)} placeholder="发送弹幕与电竞迷一起讨论..." className="flex-1 bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl px-3 py-2 text-xs outline-none text-slate-200" />
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
