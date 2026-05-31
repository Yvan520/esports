import { useEffect, useRef, useState } from 'react';
import { fetchLiveMatches } from '../data/esportsData';
import { useLang } from '../i18n/LanguageContext';

export default function LiveTicker() {
  const { t } = useLang();
  const contentRef = useRef<HTMLDivElement>(null);
  const [tickerItems, setTickerItems] = useState<string[]>([]);

  useEffect(() => {
    fetchLiveMatches().then(all => {
      const items: string[] = [];
      const live = all.filter((r: any) => r.status === 'live');
      const upcoming = all.filter((r: any) => r.status === 'upcoming');

      live.forEach((r: any) => {
        const title = r.teamA?.shortName && r.teamB?.shortName
          ? `${r.teamA.shortName} vs ${r.teamB.shortName}`
          : `${r.game} ${t('stream.live')}`;
        const score = `${r.teamA?.score ?? 0}:${r.teamB?.score ?? 0}`;
        items.push(`🔴 LIVE · ${title} · ${r.tournament || r.game} · ${score}`);
      });
      upcoming.forEach((r: any) => {
        const title = r.teamA?.shortName && r.teamB?.shortName
          ? `${r.teamA.shortName} vs ${r.teamB.shortName}`
          : `${r.game}`;
        items.push(`⏰ ${title} · ${r.tournament || r.game} · ${r.startTime || t('stream.upcoming')}`);
      });

      if (items.length > 0) {
        setTickerItems(items);
      } else {
        setTickerItems([
          '🔴 LIVE · BLG vs WE · LPL淘汰赛 · 0:0',
          '⏰ NAVI vs VIT · IEM科隆Major · 即将开始',
        ]);
      }
    }).catch(() => {
      setTickerItems([
        '🔴 LIVE · BLG vs WE · LPL淘汰赛 · 0:0',
        '⏰ NAVI vs VIT · IEM科隆Major · 即将开始',
      ]);
    });
  }, []);

  useEffect(() => {
    const el = contentRef.current;
    if (!el || tickerItems.length === 0) return;
    let pos = 0;
    const speed = 0.5;
    let raf: number;
    const animate = () => {
      pos -= speed;
      if (pos <= -el.scrollWidth / 2) pos = 0;
      el.style.transform = `translateX(${pos}px)`;
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [tickerItems]);

  const items = [...tickerItems, ...tickerItems];

  if (tickerItems.length === 0) return null;

  return (
    <div className="overflow-hidden py-2 relative" style={{ background: 'rgba(99,102,241,0.08)', borderBottom: '1px solid rgba(99,102,241,0.15)' }}>
      <div className="absolute left-0 top-0 bottom-0 w-20 z-10" style={{ background: 'linear-gradient(90deg, rgba(8,8,20,1), transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-20 z-10" style={{ background: 'linear-gradient(-90deg, rgba(8,8,20,1), transparent)' }} />
      <div className="absolute left-0 top-0 bottom-0 z-20 flex items-center px-3">
        <span className="flex items-center gap-1.5 text-xs font-bold text-red-400 px-2 py-1 rounded-full" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', whiteSpace: 'nowrap' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping absolute" />
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          <span className="ml-1">{t('ticker.label')}</span>
        </span>
      </div>
      <div ref={contentRef} className="flex items-center" style={{ willChange: 'transform', paddingLeft: '120px' }}>
        {items.map((item, i) => (
          <span key={i} className="flex items-center flex-shrink-0 text-sm text-gray-400 mx-8">
            {item}
            <span className="mx-8 text-gray-700">|</span>
          </span>
        ))}
      </div>
    </div>
  );
}
