import { useState, useEffect } from 'react';
import { fetchLiveMatches, GAMES, TOURNAMENTS } from '../data/esportsData';

interface HeroSectionProps {
  onSectionChange: (s: string) => void;
}

export default function HeroSection({ onSectionChange }: HeroSectionProps) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [highlights, setHighlights] = useState([
    { game: 'LOL', badge: '🔴 LIVE', title: 'LPL春季赛', match: 'JDG vs BLG', viewers: '123万在线', accent: '#C89B3C' },
    { game: 'VALORANT', badge: '🔴 LIVE', title: 'VCT亚太赛', match: 'EDG vs ZETA', viewers: '85万在线', accent: '#FF4655' },
    { game: 'CS2', badge: '⏰ 即将开始', title: 'IEM卡托维兹', match: 'NAVI vs VIT', viewers: '今晚20:00', accent: '#FF6B35' },
  ]);
  const [stats, setStats] = useState([
    { label: '正在进行', value: '12', unit: '场比赛' },
    { label: '今日赛程', value: '38', unit: '场对决' },
    { label: '在线观众', value: '890', unit: '万人次' },
    { label: '覆盖赛事', value: '60+', unit: '顶级赛事' },
  ]);

  useEffect(() => {
    fetchLiveMatches().then(all => {
      const live = all.filter((r: any) => r.isLive);
      const upcoming = all.filter((r: any) => !r.isLive);

      const newHighlights = live.slice(0, 3).map(r => {
        const game = GAMES.find(g => g.id === r.game);
        const m = r.match || {};
        return {
          game: r.game,
          badge: '🔴 LIVE',
          title: r.title?.split('】')[0]?.replace('【', '') || m.tournament || r.game,
          match: m.teamA?.shortName && m.teamB?.shortName ? `${m.teamA.shortName} vs ${m.teamB.shortName}` : r.title || '直播中',
          viewers: r.viewers ? `${(r.viewers / 10000).toFixed(0)}万在线` : '直播中',
          accent: game?.color || '#6366f1',
        };
      });

      if (newHighlights.length < 3) {
        upcoming.slice(0, 3 - newHighlights.length).forEach(r => {
          const game = GAMES.find(g => g.id === r.game);
          const m = r.match || {};
          newHighlights.push({
            game: r.game,
            badge: '⏰ 即将开始',
            title: r.title?.split('】')[0]?.replace('【', '') || m.tournament || r.game,
            match: m.teamA?.shortName && m.teamB?.shortName ? `${m.teamA.shortName} vs ${m.teamB.shortName}` : r.title || '即将开始',
            viewers: m.startTime || '即将开始',
            accent: game?.color || '#6366f1',
          });
        });
      }

      if (newHighlights.length > 0) {
        setHighlights(newHighlights);
      }

      const totalViewers = live.reduce((sum, r) => sum + (r.viewers || 0), 0);
      const allGamesCount = live.length + upcoming.length;
      setStats([
        { label: '正在进行', value: String(live.length), unit: '场比赛' },
        { label: '今日赛程', value: String(allGamesCount), unit: '场对决' },
        { label: '在线观众', value: totalViewers >= 10000 ? String(Math.round(totalViewers / 10000)) : String(totalViewers || '0'), unit: totalViewers >= 10000 ? '万人次' : '人' },
        { label: '覆盖赛事', value: String(TOURNAMENTS.length), unit: '顶级赛事' },
      ]);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (highlights.length <= 1) return;
    const timer = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent(c => (c + 1) % highlights.length);
        setAnimating(false);
      }, 300);
    }, 4000);
    return () => clearInterval(timer);
  }, [highlights]);

  const h = highlights.length > 0 ? highlights[current % highlights.length] : highlights[0];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src="/hero-bg.jpg" alt="hero" className="w-full h-full object-cover" style={{ opacity: 0.35 }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(8,8,20,0.3) 0%, rgba(8,8,20,0.7) 60%, rgba(8,8,20,1) 100%)' }} />
        {/* Grid overlay */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Animated orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl animate-pulse" style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl" style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)', animation: 'pulse 3s infinite 1s' }} />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full opacity-8 blur-3xl" style={{ background: `radial-gradient(circle, ${h.accent}, transparent)`, animation: 'pulse 4s infinite 0.5s' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-32 w-full">
        <div className="max-w-3xl">
          {/* Live badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 transition-all duration-300"
            style={{
              background: `rgba(${h.accent === '#FF4655' ? '255,70,85' : h.accent === '#FF6B35' ? '255,107,53' : '200,155,60'},0.15)`,
              border: `1px solid ${h.accent}`,
              color: h.accent,
              opacity: animating ? 0 : 1,
              transform: animating ? 'translateY(-8px)' : 'translateY(0)',
              transition: 'all 0.3s ease',
            }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: h.badge.includes('LIVE') ? '#ef4444' : '#f59e0b' }} />
            {h.badge} · {h.game} · {h.title}
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-black text-white mb-4 leading-tight" style={{ fontFamily: 'Rajdhani, Noto Sans SC, sans-serif' }}>
            <span style={{ color: '#a5b4fc' }}>电竞</span>
            <span className="text-white">赛事</span>
            <br />
            <span style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              实时中心
            </span>
          </h1>

          {/* Highlight match */}
          <div
            className="flex items-center gap-4 mb-6 transition-all duration-300"
            style={{ opacity: animating ? 0 : 1, transform: animating ? 'translateY(8px)' : 'translateY(0)' }}
          >
            <span className="text-2xl md:text-3xl font-bold text-white">{h.match}</span>
            <span className="text-gray-400">·</span>
            <span className="text-gray-400">{h.viewers}</span>
          </div>

          <p className="text-gray-400 text-lg mb-10 max-w-xl">
            全球顶级电竞赛事一站聚合 · 实时比分 · 赛程日历 · 战队积分 · 赛事直播
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => onSectionChange('live')}
              className="flex items-center gap-2 px-8 py-4 rounded-xl text-white font-bold text-lg cursor-pointer transition-all hover:scale-105 hover:shadow-2xl"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 0 30px rgba(99,102,241,0.4)' }}
            >
              <span>⚡</span> 观看直播
            </button>
            <button
              onClick={() => onSectionChange('tournaments')}
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg cursor-pointer transition-all hover:scale-105"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', color: '#e5e7eb' }}
            >
              <span>🏆</span> 全部赛事
            </button>
          </div>

          {/* Stats bar */}
          <div className="flex flex-wrap gap-8 mt-14 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            {stats.map(stat => (
              <div key={stat.label}>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black" style={{ color: '#a5b4fc', fontFamily: 'Rajdhani, sans-serif' }}>{stat.value}</span>
                  <span className="text-gray-400 text-sm">{stat.unit}</span>
                </div>
                <div className="text-gray-500 text-xs mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel dots */}
        <div className="absolute bottom-16 right-8 flex flex-col gap-2">
          {highlights.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="rounded-full transition-all cursor-pointer"
              style={{
                width: i === current ? '4px' : '4px',
                height: i === current ? '24px' : '12px',
                background: i === current ? '#6366f1' : 'rgba(255,255,255,0.2)',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
