import { useEffect, useState } from 'react';
import { fetchLiveMatches, type Match } from '../data/esportsData';

const GAME_NAMES: Record<string, string> = {
  LOL: '英雄联盟',
  VALORANT: 'VALORANT 瓦罗兰特',
  CS2: 'Counter-Strike 2',
  DOTA2: 'DOTA 2',
  PUBG: 'PUBG: BATTLEGROUNDS',
  HONOR: '王者荣耀',
};

export default function SEO() {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    fetchLiveMatches().then(setMatches).catch(() => {});
  }, []);

  const live = matches.filter(m => m.status === 'live');

  useEffect(() => {
    const existing = document.getElementById('seo-sports-event');
    if (existing) existing.remove();

    if (live.length === 0) return;

    const events = live.map(m => ({
      '@type': 'SportsEvent',
      name: `${m.teamA.shortName} vs ${m.teamB.shortName} - ${m.tournament}`,
      description: `${GAME_NAMES[m.game] || m.game} 赛事直播：${m.teamA.shortName} 对阵 ${m.teamB.shortName}，${m.tournament} ${m.stage}，实时比分 ${m.teamA.score ?? '-'}:${m.teamB.score ?? '-'}`,
      startDate: m.startTime,
      location: {
        '@type': 'VirtualLocation',
        url: 'https://www.gamewayz.com/',
      },
      organizer: {
        '@type': 'Organization',
        name: m.tournament,
      },
    }));

    const script = document.createElement('script');
    script.id = 'seo-sports-event';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': events,
    }, null, 2);
    document.head.appendChild(script);

    return () => {
      const s = document.getElementById('seo-sports-event');
      if (s) s.remove();
    };
  }, [live]);

  return null;
}
