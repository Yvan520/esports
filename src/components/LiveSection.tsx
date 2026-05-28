import { useState, useEffect } from 'react';
import { MATCHES, GAMES, GameType, fetchLiveMatches, type Match } from '../data/esportsData';

interface LiveSectionProps {
  activeGame: GameType | 'ALL';
  onWatchMatch?: (matchId: string) => void;
}

function formatViewers(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}万`;
  return n.toString();
}

export default function LiveSection({ activeGame, onWatchMatch }: LiveSectionProps) {
  const [allMatches, setAllMatches] = useState<Match[]>(MATCHES);

  useEffect(() => {
    const load = () => fetchLiveMatches().then(setAllMatches).catch(() => {});
    load();
    const timer = setInterval(load, 30000);
    return () => clearInterval(timer);
  }, []);

  const liveMatches = allMatches.filter(m => {
    const gameMatch = activeGame === 'ALL' || m.game === activeGame;
    return gameMatch && m.status === 'live';
  });

  if (liveMatches.length === 0) return null;

  return (
    <section id="live" className="py-16 max-w-7xl mx-auto px-4">
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
          <LiveMatchCard key={match.id} match={match} featured={idx === 0} onWatch={onWatchMatch} />
        ))}
      </div>
    </section>
  );
}

function LiveMatchCard({ match, featured, onWatch }: { match: typeof MATCHES[0]; featured: boolean; onWatch: (matchId: string) => void }) {
  const game = GAMES.find(g => g.id === match.game);

  return (
    <div
      onClick={() => onWatch(match.id)}
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
          <button onClick={e => { e.stopPropagation(); onWatch(match.id); }}
            className="px-4 py-2 rounded-lg text-xs font-bold transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.8), rgba(139,92,246,0.8))', color: 'white' }}>
            🔴 进入直播
          </button>
        </div>
      </div>
    </div>
  );
}
