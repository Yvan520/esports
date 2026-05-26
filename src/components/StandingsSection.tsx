import { STANDINGS, GAMES, GameType } from '../data/esportsData';

interface StandingsSectionProps {
  activeGame: GameType | 'ALL';
}

export default function StandingsSection({ activeGame }: StandingsSectionProps) {
  const gameForStandings = activeGame === 'ALL' ? 'LOL' : activeGame;
  const standings = STANDINGS.filter(t => t.game === gameForStandings);
  const game = GAMES.find(g => g.id === gameForStandings);

  const rankStyles = [
    { bg: 'linear-gradient(135deg, #FFD700, #FFA500)', color: '#000', shadow: '0 0 15px rgba(255,215,0,0.4)' },
    { bg: 'linear-gradient(135deg, #C0C0C0, #A8A8A8)', color: '#000', shadow: '0 0 10px rgba(192,192,192,0.3)' },
    { bg: 'linear-gradient(135deg, #CD7F32, #A05A2C)', color: '#fff', shadow: '0 0 10px rgba(205,127,50,0.3)' },
  ];

  return (
    <section id="standings" className="py-16 max-w-7xl mx-auto px-4">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-white" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            积分<span style={{ color: '#a5b4fc' }}>排行榜</span>
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {activeGame === 'ALL' ? '显示 LPL 2025春季赛 · 切换游戏查看对应积分榜' : `${game?.name} 当前赛季积分榜`}
          </p>
        </div>

        {/* Legend */}
        <div className="hidden md:flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded" style={{ background: 'rgba(34,197,94,0.5)' }} /> 晋级区</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded" style={{ background: 'rgba(245,158,11,0.5)' }} /> 附加赛</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded" style={{ background: 'rgba(239,68,68,0.5)' }} /> 降级区</span>
        </div>
      </div>

      {standings.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📊</div>
          <div className="text-gray-400">该游戏暂无积分数据</div>
          <div className="text-gray-600 text-sm mt-2">请从上方筛选栏切换到其他游戏查看积分榜</div>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
          {/* Table header */}
          <div className="grid gap-4 px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider" style={{ background: 'rgba(255,255,255,0.03)', gridTemplateColumns: '50px 1fr 80px 80px 80px 80px 100px' }}>
            <span>排名</span>
            <span>战队</span>
            <span className="text-center">胜</span>
            <span className="text-center">负</span>
            <span className="text-center">胜率</span>
            <span className="text-center">积分</span>
            <span className="text-center">赛季状态</span>
          </div>

          {/* Rows */}
          {standings.map((team, idx) => {
            const rankStyle = rankStyles[idx];
            const isPromo = idx === 3 || idx === 4;
            const isRel = idx >= standings.length - 2;
            const isTop = idx < 3;

            return (
              <div
                key={team.id}
                className="grid gap-4 items-center px-5 py-4 transition-all hover:bg-white/[0.02] cursor-pointer group"
                style={{
                  gridTemplateColumns: '50px 1fr 80px 80px 80px 80px 100px',
                  borderTop: idx === 0 ? 'none' : '1px solid rgba(255,255,255,0.04)',
                  background: isTop && idx === 0 ? 'linear-gradient(90deg, rgba(99,102,241,0.06), transparent)' : 'transparent',
                  borderLeft: isTop ? '3px solid rgba(34,197,94,0.5)' : isPromo ? '3px solid rgba(245,158,11,0.5)' : isRel ? '3px solid rgba(239,68,68,0.5)' : '3px solid transparent',
                }}
              >
                {/* Rank */}
                <div className="flex justify-center">
                  {rankStyle ? (
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black" style={{ background: rankStyle.bg, color: rankStyle.color, boxShadow: rankStyle.shadow }}>
                      {idx + 1}
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-gray-400" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      {idx + 1}
                    </div>
                  )}
                </div>

                {/* Team */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    {team.logo}
                  </div>
                  <div className="min-w-0">
                    <div className="text-white font-bold text-sm truncate group-hover:text-indigo-300 transition-colors">{team.name}</div>
                    <div className="text-gray-500 text-xs">{team.region} · {team.shortName}</div>
                  </div>
                </div>

                {/* Stats */}
                <div className="text-center text-green-400 font-bold">{team.wins}</div>
                <div className="text-center text-red-400 font-bold">{team.losses}</div>
                <div className="text-center">
                  <span className="font-bold" style={{ color: team.winRate >= 60 ? '#22c55e' : team.winRate >= 50 ? '#f59e0b' : '#ef4444' }}>
                    {team.winRate}%
                  </span>
                </div>
                <div className="text-center">
                  <span className="font-black text-lg" style={{ color: '#a5b4fc', fontFamily: 'Rajdhani, sans-serif' }}>{team.points}</span>
                </div>

                {/* Status */}
                <div className="flex justify-center">
                  <span className="text-xs px-2 py-1 rounded-full font-semibold"
                    style={{
                      color: isTop ? '#22c55e' : isPromo ? '#f59e0b' : isRel ? '#ef4444' : '#6b7280',
                      background: isTop ? 'rgba(34,197,94,0.1)' : isPromo ? 'rgba(245,158,11,0.1)' : isRel ? 'rgba(239,68,68,0.1)' : 'rgba(107,114,128,0.1)',
                    }}>
                    {isTop ? '晋级区' : isPromo ? '附加赛' : isRel ? '降级区' : '常规'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
