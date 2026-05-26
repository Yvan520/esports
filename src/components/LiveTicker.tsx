import { useEffect, useRef } from 'react';

const TICKER_ITEMS = [
  '🔴 LIVE · JDG vs BLG · LPL春季赛 · 2:1',
  '⚡ EDG vs ZETA · VCT亚太赛 · 1:1 第5局激战中',
  '🏆 TI 2025 · 奖金池突破$40,000,000',
  '⏰ NAVI vs VIT · IEM卡托维兹 · 今晚20:00开赛',
  '👑 Hero久竞 3:0 晋级KPL决赛圈',
  '🎯 s1mple宣布参加IEM卡托维兹表演赛',
  '🔴 LIVE · 4AM vs Nova · PGC决赛 · 进行中',
];

export default function LiveTicker() {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
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
  }, []);

  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="overflow-hidden py-2 relative" style={{ background: 'rgba(99,102,241,0.08)', borderBottom: '1px solid rgba(99,102,241,0.15)' }}>
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 z-10" style={{ background: 'linear-gradient(90deg, rgba(8,8,20,1), transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-20 z-10" style={{ background: 'linear-gradient(-90deg, rgba(8,8,20,1), transparent)' }} />

      {/* Left label */}
      <div className="absolute left-0 top-0 bottom-0 z-20 flex items-center px-3">
        <span className="flex items-center gap-1.5 text-xs font-bold text-red-400 px-2 py-1 rounded-full" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', whiteSpace: 'nowrap' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping absolute" />
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          <span className="ml-1">滚动播报</span>
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
