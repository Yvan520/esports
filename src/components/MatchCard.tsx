import { Match, GAMES } from '../data/esportsData';

interface MatchCardProps {
  match: Match;
  onWatchMatch?: () => void;
}

function formatViewers(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}万`;
  return n.toString();
}

export default function MatchCard({ match, onWatchMatch }: MatchCardProps) {
  const game = GAMES.find(g => g.id === match.game);
  const isLive = match.status === 'live';
  const isFinished = match.status === 'finished';

  function handleClick() {
    if (isLive && onWatchMatch) onWatchMatch();
  }

  return (
    <div
      onClick={handleClick}
      className="rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 group"
      style={{
        cursor: isLive ? 'pointer' : 'default',
        background: isLive
          ? 'linear-gradient(135deg, rgba(15,15,35,0.95), rgba(20,10,40,0.95))'
          : 'rgba(15,15,35,0.8)',
        border: isLive
          ? '1px solid rgba(99,102,241,0.5)'
          : '1px solid rgba(255,255,255,0.06)',
        boxShadow: isLive ? '0 0 30px rgba(99,102,241,0.15), inset 0 1px 0 rgba(255,255,255,0.05)' : 'none',
      }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5" style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="flex items-center gap-2">
          {isLive && (
            <span className="flex items-center gap-1.5 text-xs font-bold px-2 py-0.5 rounded-full text-red-400 animate-pulse" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              LIVE
            </span>
          )}
          {!isLive && !isFinished && (
            <span className="flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full text-yellow-400" style={{ background: 'rgba(234,179,8,0.12)', border: '1px solid rgba(234,179,8,0.25)' }}>
              即将开始
            </span>
          )}
          {isFinished && (
            <span className="text-xs font-semibold text-gray-500 px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              已结束
            </span>
          )}
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color: game?.color, background: game?.bgColor }}>
            {game?.emoji} {match.game}
          </span>
        </div>
        <div className="text-xs text-gray-500">{match.startTime}</div>
      </div>

      {/* Match content */}
      <div className="p-4">
        <div className="text-xs text-gray-500 mb-3 truncate">{match.tournament} · {match.stage} · BO{match.bestOf}</div>

        {/* Teams */}
        <div className="flex items-center gap-3">
          {/* Team A */}
          <div className={`flex-1 flex flex-col items-center gap-1 ${isFinished && match.teamA.score! < match.teamB.score! ? 'opacity-40' : ''}`}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
              {match.teamA.logo}
            </div>
            <div className="text-white font-bold text-sm text-center">{match.teamA.shortName}</div>
            <div className="text-xs text-gray-500 text-center truncate w-full">{match.teamA.name}</div>
          </div>

          {/* Score / VS */}
          <div className="flex flex-col items-center gap-1 min-w-[80px]">
            {(isLive || isFinished) && match.teamA.score !== undefined ? (
              <div className="flex items-center gap-3">
                <span className={`text-3xl font-black ${match.teamA.score! > match.teamB.score! ? 'text-white' : 'text-gray-500'}`} style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                  {match.teamA.score}
                </span>
                <span className="text-gray-600 text-lg">:</span>
                <span className={`text-3xl font-black ${match.teamB.score! > match.teamA.score! ? 'text-white' : 'text-gray-500'}`} style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                  {match.teamB.score}
                </span>
              </div>
            ) : (
              <div className="text-2xl font-black text-gray-600" style={{ fontFamily: 'Rajdhani, sans-serif' }}>VS</div>
            )}
            {isLive && (
              <div className="text-xs text-red-400 font-semibold animate-pulse">正在进行</div>
            )}
            {!isLive && !isFinished && (
              <div className="text-xs text-yellow-500 font-semibold">{match.startTime}</div>
            )}
          </div>

          {/* Team B */}
          <div className={`flex-1 flex flex-col items-center gap-1 ${isFinished && match.teamB.score! < match.teamA.score! ? 'opacity-40' : ''}`}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
              {match.teamB.logo}
            </div>
            <div className="text-white font-bold text-sm text-center">{match.teamB.shortName}</div>
            <div className="text-xs text-gray-500 text-center truncate w-full">{match.teamB.name}</div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          {isLive && match.viewers ? (
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              {formatViewers(match.viewers)} 观众在线
            </div>
          ) : (
            <div />
          )}
          {isLive && (
            <button
              onClick={e => { e.stopPropagation(); scrollToLive(); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white cursor-pointer hover:opacity-90 transition-all" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              ▶ 观看直播
            </button>
          )}
          {!isLive && !isFinished && (
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer hover:opacity-80 transition-all" style={{ background: 'rgba(255,255,255,0.07)', color: '#9ca3af', border: '1px solid rgba(255,255,255,0.08)' }}>
              🔔 设置提醒
            </button>
          )}
          {isFinished && (
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer hover:opacity-80 transition-all" style={{ background: 'rgba(255,255,255,0.05)', color: '#6b7280' }}>
              📺 回放
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
