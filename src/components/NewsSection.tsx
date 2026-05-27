import { NEWS, GAMES, GameType } from '../data/esportsData';

interface NewsSectionProps {
  activeGame: GameType | 'ALL';
}

export default function NewsSection({ activeGame }: NewsSectionProps) {
  const filtered = NEWS.filter(n => activeGame === 'ALL' || n.game === activeGame).slice(0, 6);

  const tagColors: Record<string, { color: string; bg: string }> = {
    '赛事速报': { color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
    '赛前预测': { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
    '行业资讯': { color: '#06b6d4', bg: 'rgba(6,182,212,0.12)' },
    '赛事直播': { color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
  };

  return (
    <section id="news" className="py-16 max-w-7xl mx-auto px-4">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-white" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            最新<span style={{ color: '#a5b4fc' }}>资讯</span>
          </h2>
          <p className="text-gray-500 text-sm mt-1">实时赛事动态 · 深度分析报道</p>
        </div>
        <a href="/news/" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer">更多资讯 →</a>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📰</div>
          <div className="text-gray-400">暂无相关资讯</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Featured - first item large */}
          {filtered[0] && (
              <a
                href={filtered[0].slug ? `/news/${filtered[0].slug}/` : '/news/'}
                className="md:row-span-2 rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 hover:scale-[1.01] hover:-translate-y-1"
              style={{ background: 'rgba(15,15,35,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              {/* Image placeholder */}
              <div className="h-48 flex items-center justify-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))' }}>
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                  backgroundSize: '30px 30px'
                }} />
                <span className="text-8xl group-hover:scale-110 transition-transform duration-500">{filtered[0].image}</span>
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 50%, rgba(15,15,35,0.95) 100%)' }} />
              </div>

              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ color: tagColors[filtered[0].tag]?.color || '#6366f1', background: tagColors[filtered[0].tag]?.bg || 'rgba(99,102,241,0.12)' }}>
                    {filtered[0].tag}
                  </span>
                  {(() => {
                    const game = GAMES.find(g => g.id === filtered[0].game);
                    return (
                      <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ color: game?.color, background: game?.bgColor }}>
                        {game?.emoji} {filtered[0].game}
                      </span>
                    );
                  })()}
                </div>
                <h3 className="text-white font-bold text-lg leading-snug mb-3 group-hover:text-indigo-300 transition-colors">
                  {filtered[0].title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                  {filtered[0].summary}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-xs">{filtered[0].date}</span>
                  <a href={filtered[0].slug ? `/news/${filtered[0].slug}/` : '/news/'} className="text-indigo-400 text-xs hover:text-indigo-300 transition-colors cursor-pointer">阅读全文 →</a>
                </div>
              </div>
            </a>
          )}

          {/* Rest items */}
          {filtered.slice(1).map(news => {
            const game = GAMES.find(g => g.id === news.game);
            const tc = tagColors[news.tag];
            return (
              <a
                key={news.id}
                href={news.slug ? `/news/${news.slug}/` : '/news/'}
                className="flex gap-4 p-4 rounded-2xl cursor-pointer group transition-all duration-300 hover:scale-[1.01]"
                style={{ background: 'rgba(15,15,35,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="w-20 h-20 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform"
                  style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15))' }}>
                  {news.image}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold px-1.5 py-0.5 rounded-full" style={{ color: tc?.color || '#6366f1', background: tc?.bg || 'rgba(99,102,241,0.12)' }}>
                      {news.tag}
                    </span>
                    <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full" style={{ color: game?.color, background: game?.bgColor }}>
                      {game?.emoji} {news.game}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold text-sm leading-snug mb-1 line-clamp-2 group-hover:text-indigo-300 transition-colors">
                    {news.title}
                  </h3>
                  <div className="text-gray-600 text-xs">{news.date}</div>
                </div>
            </a>
          );
          })}
        </div>
      )}
    </section>
  );
}
