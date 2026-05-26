import { MATCHES, GameType } from '../data/esportsData';
import MatchCard from './MatchCard';

interface MatchesSectionProps {
  activeGame: GameType | 'ALL';
  onWatchMatch?: () => void;
}

export default function MatchesSection({ activeGame, onWatchMatch }: MatchesSectionProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'live' | 'upcoming' | 'finished'>('all');

  const filtered = MATCHES.filter(m => {
    const gameMatch = activeGame === 'ALL' || m.game === activeGame;
    const tabMatch = activeTab === 'all' || m.status === activeTab;
    return gameMatch && tabMatch;
  });

  const tabs = [
    { id: 'all', label: '全部', count: MATCHES.filter(m => activeGame === 'ALL' || m.game === activeGame).length },
    { id: 'live', label: '进行中', count: MATCHES.filter(m => m.status === 'live' && (activeGame === 'ALL' || m.game === activeGame)).length },
    { id: 'upcoming', label: '即将开始', count: MATCHES.filter(m => m.status === 'upcoming' && (activeGame === 'ALL' || m.game === activeGame)).length },
    { id: 'finished', label: '已结束', count: MATCHES.filter(m => m.status === 'finished' && (activeGame === 'ALL' || m.game === activeGame)).length },
  ] as const;

  return (
    <section id="matches" className="py-16 max-w-7xl mx-auto px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-white" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            实时<span style={{ color: '#a5b4fc' }}>赛程</span>
          </h2>
          <p className="text-gray-500 text-sm mt-1">实时更新 · 比分直播</p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer"
              style={{
                background: activeTab === tab.id ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
                color: activeTab === tab.id ? '#fff' : '#9ca3af',
              }}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: activeTab === tab.id ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)' }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Live indicator */}
      {(activeTab === 'all' || activeTab === 'live') && filtered.some(m => m.status === 'live') && (
        <div className="flex items-center gap-2 mb-6">
          <span className="flex items-center gap-1.5 text-red-400 text-sm font-semibold">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="w-2 h-2 rounded-full bg-red-500 -ml-3.5" />
            正在直播
          </span>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(239,68,68,0.4), transparent)' }} />
        </div>
      )}

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(match => (
            <MatchCard key={match.id} match={match} onWatchMatch={onWatchMatch} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🎮</div>
          <div className="text-gray-400 text-lg">暂无符合条件的赛事</div>
          <div className="text-gray-600 text-sm mt-2">请尝试更换游戏或时间筛选</div>
        </div>
      )}
    </section>
  );
}
