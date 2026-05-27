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

const GAME_IMAGES: Record<string, string> = {
  LOL: 'https://www.gamewayz.com/hero-bg.jpg',
  VALORANT: 'https://www.gamewayz.com/hero-bg.jpg',
  CS2: 'https://www.gamewayz.com/hero-bg.jpg',
  DOTA2: 'https://www.gamewayz.com/hero-bg.jpg',
  PUBG: 'https://www.gamewayz.com/hero-bg.jpg',
  HONOR: 'https://www.gamewayz.com/hero-bg.jpg',
};

function toISODate(startTime: string): string | null {
  const now = new Date();
  const match = startTime.match(/(\d{4}-\d{2}-\d{2})/);
  if (match) return match[1] + 'T12:00:00+08:00';
  const timeMatch = startTime.match(/(\d{2}):(\d{2})/);
  if (!timeMatch) return null;
  let d = new Date(now);
  d.setHours(parseInt(timeMatch[1]), parseInt(timeMatch[2]), 0, 0);
  if (startTime.includes('明日') || startTime.includes('明天')) d.setDate(d.getDate() + 1);
  else if (startTime.includes('昨天') || startTime.includes('昨日')) d.setDate(d.getDate() - 1);
  else if (startTime.includes('前天')) d.setDate(d.getDate() - 2);
  if (d <= now) d.setDate(d.getDate() + 1);
  return d.toISOString();
}

function statusToEventStatus(status: string): string {
  if (status === 'live') return 'https://schema.org/EventActive';
  if (status === 'finished') return 'https://schema.org/EventEnded';
  return 'https://schema.org/EventScheduled';
}

export default function SEO() {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    fetchLiveMatches().then(setMatches).catch(() => {});
  }, []);

  const live = matches.filter(m => m.status === 'live' || m.status === 'upcoming');

  useEffect(() => {
    const existing = document.getElementById('seo-sports-event');
    if (existing) existing.remove();

    if (live.length === 0) return;

    const events = live.map(m => {
      const startDate = toISODate(m.startTime);
      if (!startDate) return null;

      return {
        '@type': 'SportsEvent',
        name: `${m.teamA.shortName} vs ${m.teamB.shortName} - ${m.tournament}`,
        description: `${GAME_NAMES[m.game] || m.game} 赛事直播：${m.teamA.shortName} 对阵 ${m.teamB.shortName}`,
        startDate,
        endDate: new Date(new Date(startDate).getTime() + 3 * 60 * 60 * 1000).toISOString(),
        eventStatus: statusToEventStatus(m.status),
        eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
        location: {
          '@type': 'Place',
          name: m.tournament,
          address: {
            '@type': 'PostalAddress',
            addressLocality: '线上',
          },
        },
        image: GAME_IMAGES[m.game] || 'https://www.gamewayz.com/hero-bg.jpg',
        performer: {
          '@type': 'PerformingGroup',
          name: `${m.teamA.name} vs ${m.teamB.name}`,
        },
        organizer: {
          '@type': 'Organization',
          name: m.tournament,
          url: 'https://www.gamewayz.com/',
        },
      };
    }).filter(Boolean);

    if (events.length === 0) return;

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
