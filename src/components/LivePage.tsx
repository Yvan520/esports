import { liveMatches } from '../data/referenceData';

export default function LivePage() {
  return (
    <section id="live" className="py-16 px-4 max-w-7xl mx-auto">
      {/* Section header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="live-dot w-3 h-3 rounded-full bg-red-500 inline-block"></span>
            <h2
              className="text-2xl md:text-3xl font-black"
              style={{ fontFamily: 'Orbitron', color: '#00f5ff', textShadow: '0 0 15px rgba(0,245,255,0.5)' }}
            >
              LIVE 直播
            </h2>
          </div>
          <span
            className="px-2 py-0.5 rounded text-xs font-bold"
            style={{ background: 'rgba(255,0,110,0.15)', border: '1px solid rgba(255,0,110,0.4)', color: '#ff006e' }}
          >
            {liveMatches.length} 场进行中
          </span>
        </div>
        <button className="btn-cyber text-xs">全部直播</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {liveMatches.map((match, idx) => (
          <LiveMatchCard key={match.id} match={match} featured={idx === 0} />
        ))}
      </div>
    </section>
  );
}

function LiveMatchCard({ match, featured }: { match: typeof liveMatches[0]; featured: boolean }) {
  return (
    <div
      className="glass-card overflow-hidden group cursor-pointer transition-all duration-300"
      style={{
        border: featured ? '1px solid rgba(255,0,110,0.4)' : '1px solid rgba(0,245,255,0.12)',
        boxShadow: featured ? '0 0 30px rgba(255,0,110,0.1)' : undefined,
        transform: featured ? undefined : undefined,
      }}
    >
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{
          background: featured
            ? 'linear-gradient(90deg, rgba(255,0,110,0.2), rgba(191,0,255,0.1))'
            : 'rgba(0,245,255,0.05)',
          borderBottom: `1px solid ${featured ? 'rgba(255,0,110,0.2)' : 'rgba(0,245,255,0.1)'}`,
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{match.gameIcon}</span>
          <span className="text-xs font-semibold text-gray-300">{match.tournament}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="live-dot w-1.5 h-1.5 rounded-full bg-red-500 inline-block"></span>
          <span className="text-xs font-black" style={{ fontFamily: 'Orbitron', color: '#ff006e' }}>LIVE</span>
        </div>
      </div>

      {/* Match body */}
      <div className="p-5">
        {/* Teams and score */}
        <div className="flex items-center justify-between mb-4">
          {/* Team 1 */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
              style={{ background: `${match.team1.color}22`, border: `1px solid ${match.team1.color}44` }}
            >
              {match.team1.logo}
            </div>
            <div className="text-center">
              <div className="font-bold text-sm text-white">{match.team1.short}</div>
              <div className="text-xs text-gray-500 hidden sm:block">{match.team1.name}</div>
            </div>
          </div>

          {/* Score */}
          <div className="flex flex-col items-center gap-1 px-4">
            <div className="flex items-center gap-3">
              <span
                className="text-4xl font-black"
                style={{
                  fontFamily: 'Orbitron',
                  color: match.team1.score > match.team2.score ? '#00f5ff' : '#e2e8f0',
                  textShadow: match.team1.score > match.team2.score ? '0 0 15px rgba(0,245,255,0.6)' : 'none',
                }}
              >
                {match.team1.score}
              </span>
              <span className="text-gray-600 text-xl font-bold">:</span>
              <span
                className="text-4xl font-black"
                style={{
                  fontFamily: 'Orbitron',
                  color: match.team2.score > match.team1.score ? '#ff006e' : '#e2e8f0',
                  textShadow: match.team2.score > match.team1.score ? '0 0 15px rgba(255,0,110,0.6)' : 'none',
                }}
              >
                {match.team2.score}
              </span>
            </div>
            <div className="text-xs text-gray-400 font-medium">{match.time}</div>
          </div>

          {/* Team 2 */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
              style={{ background: `${match.team2.color}22`, border: `1px solid ${match.team2.color}44` }}
            >
              {match.team2.logo}
            </div>
            <div className="text-center">
              <div className="font-bold text-sm text-white">{match.team2.short}</div>
              <div className="text-xs text-gray-500 hidden sm:block">{match.team2.name}</div>
            </div>
          </div>
        </div>

        {/* Viewers */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-500">👁️</span>
            <span className="text-xs text-gray-400">{match.viewers} 人在观看</span>
          </div>
          <span
            className="text-xs px-2 py-0.5 rounded"
            style={{ background: 'rgba(0,245,255,0.08)', color: '#00f5ff', border: '1px solid rgba(0,245,255,0.2)' }}
          >
            {match.tournamentTag}
          </span>
        </div>

        {/* Watch button */}
        <button
          className="w-full py-2.5 rounded-lg text-sm font-bold transition-all duration-300 group-hover:opacity-90"
          style={{
            background: 'linear-gradient(135deg, rgba(255,0,110,0.8), rgba(191,0,255,0.8))',
            color: 'white',
            fontFamily: 'Orbitron',
            fontSize: '0.75rem',
            letterSpacing: '0.08em',
            boxShadow: '0 4px 15px rgba(255,0,110,0.2)',
          }}
        >
          🔴 立即观看
        </button>
      </div>
    </div>
  );
}
