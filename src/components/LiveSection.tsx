import { useState, useEffect } from 'react';
import { MATCHES, GAMES, GameType } from '../data/esportsData';

interface LiveSectionProps {
  activeGame: GameType | 'ALL';
}

function formatViewers(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}万`;
  return n.toString();
}

export default function LiveSection({ activeGame }: LiveSectionProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash.replace('#live-', '');
    if (hash && MATCHES.find(m => m.id === hash && m.status === 'live')) {
      setSelectedId(hash);
    }
    const handler = () => {
      const h = window.location.hash.replace('#live-', '');
      if (h && MATCHES.find(m => m.id === h && m.status === 'live')) {
        setSelectedId(h);
      } else if (!h) {
        setSelectedId(null);
      }
    };
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  const liveMatches = MATCHES.filter(m => {
    const gameMatch = activeGame === 'ALL' || m.game === activeGame;
    return gameMatch && m.status === 'live';
  });

  if (liveMatches.length === 0) return null;

  const selectedMatch = selectedId ? liveMatches.find(m => m.id === selectedId) : null;

  const openMatch = (id: string) => {
    setSelectedId(id);
    window.location.hash = `live-${id}`;
    setTimeout(() => {
      const el = document.getElementById('live');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const closeMatch = () => {
    setSelectedId(null);
    window.location.hash = '';
    history.replaceState(null, '', window.location.pathname + window.location.search);
  };

  return (
    <section id="live" className="py-16 max-w-7xl mx-auto px-4">
      {selectedMatch ? (
        <LiveBroadcast match={selectedMatch} onClose={closeMatch} />
      ) : (
        <>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                <h2 className="text-2xl md:text-3xl font-black text-white" style={{ fontFamily: 'Rajdhani, sans-serif', textShadow: '0 0 15px rgba(99,102,241,0.5)' }}>
                  <span style={{ color: '#a5b4fc' }}>直播</span>赛事
                </h2>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#ef4444' }}>
                {liveMatches.length} 场进行中
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {liveMatches.map((match, idx) => (
              <LiveMatchCard key={match.id} match={match} featured={idx === 0} onWatch={() => openMatch(match.id)} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function LiveMatchCard({ match, featured, onWatch }: { match: typeof MATCHES[0]; featured: boolean; onWatch: () => void }) {
  const game = GAMES.find(g => g.id === match.game);

  return (
    <div
      onClick={onWatch}
      className="rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300 hover:-translate-y-1"
      style={{
        background: 'rgba(15,15,35,0.85)',
        border: featured ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(99,102,241,0.12)',
        boxShadow: featured ? '0 0 30px rgba(99,102,241,0.1)' : 'none',
      }}
    >
      <div className="flex items-center justify-between px-4 py-2.5" style={{
        background: featured ? 'linear-gradient(90deg, rgba(99,102,241,0.2), rgba(139,92,246,0.1))' : 'rgba(99,102,241,0.05)',
        borderBottom: `1px solid ${featured ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.1)'}`,
      }}>
        <div className="flex items-center gap-2">
          <span className="text-lg">{game?.emoji}</span>
          <span className="text-xs font-semibold text-gray-300">{match.tournament}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-black" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#ef4444' }}>LIVE</span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl" style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)' }}>
              {match.teamA.logo}
            </div>
            <div className="text-center">
              <div className="font-bold text-sm text-white">{match.teamA.shortName}</div>
              <div className="text-xs text-gray-500 hidden sm:block">{match.teamA.name}</div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1 px-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl font-black" style={{
                fontFamily: 'Rajdhani, sans-serif',
                color: match.teamA.score !== undefined && match.teamB.score !== undefined && match.teamA.score > match.teamB.score ? '#a5b4fc' : '#e5e7eb',
                textShadow: match.teamA.score !== undefined && match.teamB.score !== undefined && match.teamA.score > match.teamB.score ? '0 0 15px rgba(99,102,241,0.6)' : 'none',
              }}>
                {match.teamA.score ?? '-'}
              </span>
              <span className="text-gray-600 text-xl font-bold">:</span>
              <span className="text-4xl font-black" style={{
                fontFamily: 'Rajdhani, sans-serif',
                color: match.teamA.score !== undefined && match.teamB.score !== undefined && match.teamB.score > match.teamA.score ? '#a5b4fc' : '#e5e7eb',
                textShadow: match.teamA.score !== undefined && match.teamB.score !== undefined && match.teamB.score > match.teamA.score ? '0 0 15px rgba(99,102,241,0.6)' : 'none',
              }}>
                {match.teamB.score ?? '-'}
              </span>
            </div>
            <div className="text-xs text-gray-400 font-medium">{match.stage}</div>
          </div>

          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl" style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)' }}>
              {match.teamB.logo}
            </div>
            <div className="text-center">
              <div className="font-bold text-sm text-white">{match.teamB.shortName}</div>
              <div className="text-xs text-gray-500 hidden sm:block">{match.teamB.name}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-500">👁️</span>
            <span className="text-xs text-gray-400">{match.viewers ? formatViewers(match.viewers) : '-'} 人在观看</span>
          </div>
          <button onClick={e => { e.stopPropagation(); onWatch(); }}
            className="px-4 py-2 rounded-lg text-xs font-bold transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.8), rgba(139,92,246,0.8))', color: 'white' }}>
            🔴 进入直播
          </button>
        </div>
      </div>
    </div>
  );
}

function LiveBroadcast({ match, onClose }: { match: typeof MATCHES[0]; onClose: () => void }) {
  const game = GAMES.find(g => g.id === match.game);

  return (
    <div>
      {/* Back button */}
      <button onClick={onClose} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4 text-sm cursor-pointer">
        ← 返回赛事列表
      </button>

      {/* Video player area */}
      <div className="relative rounded-2xl overflow-hidden mb-5" style={{ aspectRatio: '16/9', background: '#000' }}>
        <div className="absolute inset-0 flex items-center justify-center" style={{
          background: `radial-gradient(ellipse at center, ${game?.color}22, #000 80%)`,
        }}>
          <div className="text-center">
            <div className="text-8xl mb-4 opacity-40">{game?.emoji}</div>
            <div className="text-gray-600 text-sm">直播流加载中...</div>
          </div>
        </div>
        {/* Live badge overlay */}
        <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(239,68,68,0.9)' }}>
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="text-white text-xs font-bold">LIVE</span>
        </div>
        {/* Viewer count overlay */}
        <div className="absolute top-4 right-4 px-3 py-1.5 rounded-lg flex items-center gap-1.5" style={{ background: 'rgba(0,0,0,0.6)' }}>
          <span className="text-xs text-gray-400">👁️</span>
          <span className="text-xs text-white font-bold">{match.viewers ? formatViewers(match.viewers) : '-'}</span>
        </div>
        {/* Tournament info */}
        <div className="absolute bottom-4 left-4">
          <div className="text-xs text-gray-400 mb-1">{match.tournament} · {match.stage}</div>
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-lg">{match.teamA.shortName}</span>
            <span className="text-gray-500 text-sm font-bold">VS</span>
            <span className="text-white font-bold text-lg">{match.teamB.shortName}</span>
          </div>
        </div>
        {/* Play button overlay center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition-all hover:scale-110" style={{ background: 'rgba(99,102,241,0.8)', boxShadow: '0 0 30px rgba(99,102,241,0.5)' }}>
            <span className="text-white text-2xl ml-1">▶</span>
          </div>
        </div>
      </div>

      {/* Match info bar */}
      <div className="rounded-2xl p-5 mb-5" style={{ background: 'rgba(15,15,35,0.85)', border: '1px solid rgba(99,102,241,0.2)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mx-auto mb-1" style={{ background: 'rgba(99,102,241,0.15)' }}>
                {match.teamA.logo}
              </div>
              <div className="text-white font-bold text-sm">{match.teamA.shortName}</div>
            </div>
            <div className="text-center flex-1">
              <div className="flex items-center justify-center gap-4">
                <span className="text-5xl font-black" style={{ fontFamily: 'Rajdhani, sans-serif', color: match.teamA.score !== undefined && match.teamB.score !== undefined && match.teamA.score > match.teamB.score ? '#a5b4fc' : '#e5e7eb' }}>
                  {match.teamA.score ?? 0}
                </span>
                <span className="text-gray-600 text-2xl font-bold">:</span>
                <span className="text-5xl font-black" style={{ fontFamily: 'Rajdhani, sans-serif', color: match.teamA.score !== undefined && match.teamB.score !== undefined && match.teamB.score > match.teamA.score ? '#a5b4fc' : '#e5e7eb' }}>
                  {match.teamB.score ?? 0}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">BO{match.bestOf} · {match.stage}</div>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mx-auto mb-1" style={{ background: 'rgba(99,102,241,0.15)' }}>
                {match.teamB.logo}
              </div>
              <div className="text-white font-bold text-sm">{match.teamB.shortName}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: timeline + chat side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Timeline */}
        <div className="lg:col-span-2 rounded-2xl p-5" style={{ background: 'rgba(15,15,35,0.85)', border: '1px solid rgba(99,102,241,0.12)' }}>
          <h3 className="text-white font-bold text-sm mb-4">⚡ 比赛动态</h3>
          <div className="space-y-3">
            {[
              { time: '12:45', event: `${match.teamA.shortName} 拿下第一条小龙`, type: 'neutral' },
              { time: '18:22', event: `${match.teamB.shortName} 完成一次精彩团战 3换5`, type: 'highlight' },
              { time: '24:10', event: `${match.teamA.shortName} 推掉中路一塔`, type: 'neutral' },
              { time: '31:05', event: `大龙争夺战 — ${match.teamB.shortName} 成功抢下大龙`, type: 'highlight' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-xs font-bold shrink-0 mt-0.5" style={{ fontFamily: 'Rajdhani, sans-serif', color: item.type === 'highlight' ? '#a5b4fc' : '#6b7280', minWidth: '40px' }}>
                  {item.time}
                </span>
                <span className="text-xs" style={{ color: item.type === 'highlight' ? '#e5e7eb' : '#9ca3af' }}>
                  {item.event}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div className="rounded-2xl p-5" style={{ background: 'rgba(15,15,35,0.85)', border: '1px solid rgba(99,102,241,0.12)' }}>
          <h3 className="text-white font-bold text-sm mb-4">💬 互动聊天</h3>
          <div className="space-y-3 mb-4" style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {[
              { user: '电竞老司机', msg: '这波操作太秀了！', color: '#a5b4fc' },
              { user: 'RankKing', msg: 'JDG加油！！！', color: '#22c55e' },
              { user: '观赛达人', msg: '这失误有点大啊', color: '#f59e0b' },
              { user: '赛事通', msg: 'MVP已经预定好了', color: '#ef4444' },
            ].map((item, i) => (
              <div key={i}>
                <span className="text-xs font-bold" style={{ color: item.color }}>{item.user}</span>
                <span className="text-xs text-gray-400 ml-2">{item.msg}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input type="text" placeholder="发送弹幕..." readOnly
              className="flex-1 px-3 py-2 rounded-lg text-xs text-gray-400 outline-none"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
            />
            <button className="px-4 py-2 rounded-lg text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              发送
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
