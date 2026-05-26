import { Match, GAMES } from '../data/esportsData';

interface LivePageProps {
  match: Match;
  onBack: () => void;
}

function formatViewers(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}万`;
  return n.toString();
}

export default function LivePage({ match, onBack }: LivePageProps) {
  const game = GAMES.find(g => g.id === match.game);

  return (
    <div className="min-h-screen" style={{ background: '#050810', fontFamily: "'Noto Sans SC', 'Rajdhani', sans-serif" }}>
      {/* Nav bar */}
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: 'rgba(5,8,16,0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0,245,255,0.15)',
          boxShadow: '0 4px 30px rgba(0,0,0,0.5)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-lg font-black cursor-pointer"
              onClick={onBack}
              style={{
                background: 'linear-gradient(135deg, #00f5ff, #bf00ff)',
                boxShadow: '0 0 15px rgba(0,245,255,0.5)',
              }}
            >
              ⚡
            </div>
            <div className="flex flex-col leading-none">
              <span
                className="font-black text-sm tracking-widest uppercase"
                style={{ fontFamily: "'Orbitron', monospace", color: '#00f5ff', textShadow: '0 0 10px #00f5ff' }}
              >
                ESPORTS
              </span>
              <span className="text-[10px] text-gray-400 tracking-[0.2em] font-medium">电竞赛事中心</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(255,0,110,0.12)', border: '1px solid rgba(255,0,110,0.3)' }}
            >
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block animate-pulse" />
              <span className="text-xs font-bold text-red-400" style={{ fontFamily: "'Orbitron'" }}>LIVE</span>
            </div>
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all hover:opacity-90"
              style={{
                background: 'rgba(0,245,255,0.1)',
                border: '1px solid rgba(0,245,255,0.3)',
                color: '#00f5ff',
                fontFamily: "'Orbitron'",
                letterSpacing: '0.05em',
              }}
            >
              ← 返回
            </button>
          </div>
        </div>
      </nav>

      {/* Scan line overlay */}
      <div className="fixed inset-0 pointer-events-none z-10"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)',
        }}
      />

      {/* Ambient particles */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-20"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              background: i % 2 === 0 ? '#00f5ff' : '#bf00ff',
              left: `${10 + i * 15}%`,
              top: `${20 + i * 12}%`,
              animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.8}s`,
            }}
          />
        ))}
      </div>

      <main className="pt-24 pb-16 px-4 max-w-7xl mx-auto relative z-20">
        {/* Back link */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm mb-6 transition-colors cursor-pointer"
          style={{ color: '#6b7280', fontFamily: "'Orbitron'" }}
          onMouseEnter={e => (e.currentTarget.style.color = '#00f5ff')}
          onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}
        >
          ← 返回主页
        </button>

        {/* Video player area */}
        <div
          className="relative rounded-2xl overflow-hidden mb-6"
          style={{
            aspectRatio: '16/9',
            background: '#000',
            border: '1px solid rgba(0,245,255,0.15)',
            boxShadow: '0 0 40px rgba(0,245,255,0.05)',
          }}
        >
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: game
                ? `radial-gradient(ellipse at center, ${game.color}22, #000 80%)`
                : '#000',
            }}
          >
            <div className="text-center">
              <div className="text-8xl mb-4 opacity-30">{game?.emoji}</div>
              <div className="text-gray-600 text-sm">直播流加载中...</div>
            </div>
          </div>

          {/* Live badge */}
          <div
            className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-lg z-10"
            style={{ background: 'rgba(255,0,110,0.9)', boxShadow: '0 0 15px rgba(255,0,110,0.5)' }}
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-white text-xs font-bold" style={{ fontFamily: "'Orbitron'" }}>LIVE</span>
          </div>

          {/* Viewers */}
          <div
            className="absolute top-4 right-4 px-3 py-1.5 rounded-lg flex items-center gap-1.5 z-10"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
          >
            <span className="text-xs text-gray-400">👁️</span>
            <span className="text-xs text-white font-bold">{match.viewers ? formatViewers(match.viewers) : '-'}</span>
          </div>

          {/* Tournament info overlay */}
          <div className="absolute bottom-4 left-4 z-10">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{game?.emoji}</span>
              <span className="text-xs text-gray-400">{match.tournament} · {match.stage}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-white font-bold text-lg">{match.teamA.shortName}</span>
              <span className="text-gray-600 text-sm font-bold">VS</span>
              <span className="text-white font-bold text-lg">{match.teamB.shortName}</span>
            </div>
          </div>

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition-all hover:scale-110"
              style={{
                background: 'linear-gradient(135deg, rgba(0,245,255,0.8), rgba(191,0,255,0.8))',
                boxShadow: '0 0 30px rgba(0,245,255,0.5)',
              }}
            >
              <span className="text-white text-2xl ml-1">▶</span>
            </div>
          </div>
        </div>

        {/* Match info bar */}
        <div
          className="rounded-2xl p-6 mb-6"
          style={{
            background: 'rgba(13,17,23,0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(0,245,255,0.12)',
          }}
        >
          <div className="flex items-center justify-between">
            {/* Team A */}
            <div className="flex flex-col items-center gap-3 flex-1">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
                style={{
                  background: game ? `${game.color}22` : 'rgba(0,245,255,0.15)',
                  border: game ? `1px solid ${game.color}44` : '1px solid rgba(0,245,255,0.3)',
                }}
              >
                {match.teamA.logo}
              </div>
              <div className="text-center">
                <div className="font-bold text-white">{match.teamA.shortName}</div>
                <div className="text-xs text-gray-500">{match.teamA.name}</div>
              </div>
            </div>

            {/* Score */}
            <div className="flex flex-col items-center gap-2 px-6">
              <div className="flex items-center gap-4">
                <span
                  className="text-6xl font-black"
                  style={{
                    fontFamily: "'Orbitron'",
                    color: match.teamA.score !== undefined && match.teamB.score !== undefined && match.teamA.score > match.teamB.score ? '#00f5ff' : '#e2e8f0',
                    textShadow: match.teamA.score !== undefined && match.teamB.score !== undefined && match.teamA.score > match.teamB.score ? '0 0 20px rgba(0,245,255,0.6)' : 'none',
                  }}
                >
                  {match.teamA.score ?? '-'}
                </span>
                <span className="text-gray-600 text-2xl font-bold">:</span>
                <span
                  className="text-6xl font-black"
                  style={{
                    fontFamily: "'Orbitron'",
                    color: match.teamA.score !== undefined && match.teamB.score !== undefined && match.teamB.score > match.teamA.score ? '#ff006e' : '#e2e8f0',
                    textShadow: match.teamA.score !== undefined && match.teamB.score !== undefined && match.teamB.score > match.teamA.score ? '0 0 20px rgba(255,0,110,0.6)' : 'none',
                  }}
                >
                  {match.teamB.score ?? '-'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(0,245,255,0.08)', color: '#00f5ff', border: '1px solid rgba(0,245,255,0.2)' }}>
                  BO{match.bestOf}
                </span>
                <span className="text-xs text-gray-500">{match.stage}</span>
              </div>
            </div>

            {/* Team B */}
            <div className="flex flex-col items-center gap-3 flex-1">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
                style={{
                  background: game ? `${game.color}22` : 'rgba(0,245,255,0.15)',
                  border: game ? `1px solid ${game.color}44` : '1px solid rgba(0,245,255,0.3)',
                }}
              >
                {match.teamB.logo}
              </div>
              <div className="text-center">
                <div className="font-bold text-white">{match.teamB.shortName}</div>
                <div className="text-xs text-gray-500">{match.teamB.name}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: timeline + chat */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timeline */}
          <div
            className="lg:col-span-2 rounded-2xl p-5"
            style={{
              background: 'rgba(13,17,23,0.85)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(0,245,255,0.12)',
            }}
          >
            <h3 className="text-white font-bold text-sm mb-4" style={{ fontFamily: "'Orbitron'" }}>
              ⚡ 比赛动态
            </h3>
            <div className="space-y-3">
              {[
                { time: '12:45', event: `${match.teamA.shortName} 拿下第一条小龙`, type: 'neutral' },
                { time: '18:22', event: `${match.teamB.shortName} 完成一次精彩团战 3换5`, type: 'highlight' },
                { time: '24:10', event: `${match.teamA.shortName} 推掉中路一塔`, type: 'neutral' },
                { time: '31:05', event: `大龙争夺战 — ${match.teamB.shortName} 成功抢下大龙`, type: 'highlight' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span
                    className="text-xs font-bold shrink-0 mt-0.5"
                    style={{
                      fontFamily: "'Orbitron'",
                      color: item.type === 'highlight' ? '#00f5ff' : '#6b7280',
                      minWidth: '40px',
                    }}
                  >
                    {item.time}
                  </span>
                  <span className="text-xs" style={{ color: item.type === 'highlight' ? '#e2e8f0' : '#94a3b8' }}>
                    {item.event}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Chat */}
          <div
            className="rounded-2xl p-5 flex flex-col"
            style={{
              background: 'rgba(13,17,23,0.85)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(0,245,255,0.12)',
            }}
          >
            <h3 className="text-white font-bold text-sm mb-4" style={{ fontFamily: "'Orbitron'" }}>
              💬 互动聊天
            </h3>
            <div className="space-y-3 mb-4 flex-1" style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {[
                { user: '电竞老司机', msg: '这波操作太秀了！', color: '#00f5ff' },
                { user: 'RankKing', msg: `${match.teamA.shortName}加油！！！`, color: '#22c55e' },
                { user: '观赛达人', msg: '这失误有点大啊', color: '#f59e0b' },
                { user: '赛事通', msg: 'MVP已经预定好了', color: '#ff006e' },
              ].map((item, i) => (
                <div key={i}>
                  <span className="text-xs font-bold" style={{ color: item.color }}>{item.user}</span>
                  <span className="text-xs text-gray-400 ml-2">{item.msg}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-auto">
              <input
                type="text"
                placeholder="发送弹幕..."
                readOnly
                className="flex-1 px-3 py-2 rounded-lg text-xs text-gray-400 outline-none"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
              />
              <button
                className="px-4 py-2 rounded-lg text-xs font-bold text-white transition-all hover:opacity-90"
                style={{
                  background: 'linear-gradient(135deg, #00f5ff, #bf00ff)',
                  fontFamily: "'Orbitron'",
                }}
              >
                发送
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
