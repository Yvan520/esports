import { TOURNAMENTS, GAMES, GameType, gameBg } from '../data/esportsData';
import { useLang } from '../i18n/LanguageContext';

interface TournamentsSectionProps {
  activeGame: GameType | 'ALL';
}

export default function TournamentsSection({ activeGame }: TournamentsSectionProps) {
  const { t } = useLang();
  const filtered = TOURNAMENTS.filter(t => activeGame === 'ALL' || t.game === activeGame);

  const statusConfig = {
    ongoing: { label: t('matches.live'), color: '#22c55e', bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.3)' },
    upcoming: { label: t('matches.upcoming'), color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)' },
    finished: { label: t('matches.finished'), color: '#6b7280', bg: 'rgba(107,114,128,0.12)', border: 'rgba(107,114,128,0.3)' },
  };

  return (
    <section id="tournaments" className="py-16 max-w-7xl mx-auto px-4">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-white" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            {t('tournaments.title')}
          </h2>
          <p className="text-gray-500 text-sm mt-1">{t('tournaments.subtitle')}</p>
        </div>
        <button className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer">{t('tournaments.viewAll')}</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(tourn => {
          const game = GAMES.find(g => g.id === tourn.game);
          const sc = statusConfig[tourn.status];
          return (
            <div
              key={tourn.id}
              className="rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
              style={{
                background: 'rgba(15,15,35,0.8)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {/* Banner */}
              <div className="relative h-28 flex items-center justify-center overflow-hidden" style={{ background: `linear-gradient(135deg, ${game ? gameBg(game, '0.4') : 'rgba(99,102,241,0.4)'}, rgba(8,8,20,0.8))` }}>
                {/* Grid pattern */}
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }} />
                <div className="text-6xl group-hover:scale-110 transition-transform duration-300">{tourn.logo}</div>
                <div className="absolute top-3 right-3">
                  <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ color: sc.color, background: sc.bg, border: `1px solid ${sc.border}` }}>
                    {sc.label}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ color: game?.color, background: game?.bgColor }}>
                    {game?.emoji} {tourn.game}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-white font-bold text-base mb-3 group-hover:text-indigo-300 transition-colors">{tourn.name}</h3>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  {[
                    { icon: '💰', label: t('tournaments.prizePool'), value: tourn.prizePool },
                    { icon: '🌍', label: t('tournaments.region'), value: tourn.region },
                    { icon: '👥', label: t('tournaments.teams'), value: `${tourn.teams}${t('tournaments.teamsUnit')}` },
                    { icon: '📅', label: t('tournaments.date'), value: tourn.endDate },
                  ].map(item => (
                    <div key={item.label} className="p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <div className="text-xs text-gray-500 mb-0.5">{item.icon} {item.label}</div>
                      <div className="text-sm text-white font-semibold">{item.value}</div>
                    </div>
                  ))}
                </div>

                {/* Prize pool highlight */}
                <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: `linear-gradient(135deg, ${game ? gameBg(game, '0.2') : 'rgba(99,102,241,0.2)'}, rgba(8,8,20,0.5))`, border: `1px solid ${game?.color}30` }}>
                  <span className="text-xs text-gray-400">{t('tournaments.prizePool')}</span>
                  <span className="text-lg font-black" style={{ color: game?.color, fontFamily: 'Rajdhani, sans-serif' }}>{tourn.prizePool}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
