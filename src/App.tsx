import { useState, useEffect, useRef } from 'react';
import { GameType } from './data/esportsData';
import { LangProvider } from './i18n/LanguageContext';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import LiveTicker from './components/LiveTicker';
import LiveSection from './components/LiveSection';
import LivePage from './components/LivePage';
import MatchesSection from './components/MatchesSection';
import TournamentsSection from './components/TournamentsSection';
import StandingsSection from './components/StandingsSection';
import NewsSection from './components/NewsSection';
import Footer from './components/Footer';
import SEO from './components/SEO';

const SECTION_TITLES: Record<string, string> = {
  home: '首页 - 全球电竞赛事直播',
  live: '直播赛事 - 实时比分',
  matches: '赛程 - 比赛日历',
  tournaments: '赛事 - 锦标赛信息',
  standings: '积分榜 - 战队排名',
  news: '最新资讯 - 电竞新闻',
};

export default function App() {
  const [activeGame, setActiveGame] = useState<GameType | 'ALL'>('ALL');
  const [activeSection, setActiveSection] = useState('home');
  const [showLivePage, setShowLivePage] = useState(false);
  const [initialMatchId, setInitialMatchId] = useState<string | null>(null);

  useEffect(() => {
    const base = 'GameWayz 电竞赛事中心';
    const sectionLabel = SECTION_TITLES[activeSection] || '首页';
    document.title = `${sectionLabel} | ${base}`;
  }, [activeSection]);

  useEffect(() => {
    if (showLivePage) {
      document.title = '赛事直播大厅 | GameWayz 电竞赛事中心';
    }
  }, [showLivePage]);

  const liveRef = useRef<HTMLDivElement>(null);
  const matchesRef = useRef<HTMLDivElement>(null);
  const tournamentsRef = useRef<HTMLDivElement>(null);
  const standingsRef = useRef<HTMLDivElement>(null);
  const newsRef = useRef<HTMLDivElement>(null);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    if (section === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const refs: Record<string, React.RefObject<HTMLDivElement | null>> = {
      live: liveRef,
      matches: matchesRef,
      tournaments: tournamentsRef,
      standings: standingsRef,
      news: newsRef,
    };
    const ref = refs[section];
    if (ref?.current) {
      const offset = 100;
      const top = ref.current.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  // Track scroll to update active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY < 400) { setActiveSection('home'); return; }
      const refs = [
        { id: 'news', ref: newsRef },
        { id: 'standings', ref: standingsRef },
        { id: 'tournaments', ref: tournamentsRef },
        { id: 'matches', ref: matchesRef },
        { id: 'live', ref: liveRef },
      ];
      for (const { id, ref } of refs) {
        if (ref.current) {
          const top = ref.current.getBoundingClientRect().top + scrollY - 120;
          if (scrollY >= top) {
            setActiveSection(id);
            return;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleWatchMatch = (matchId?: string) => {
    if (matchId) setInitialMatchId(matchId);
    setShowLivePage(true);
    window.scrollTo({ top: 0 });
  };

  const handleBackFromLive = () => {
    setShowLivePage(false);
    setInitialMatchId(null);
  };

  if (showLivePage) {
    return <LivePage onBack={handleBackFromLive} initialMatchId={initialMatchId} />;
  }

  return (
    <LangProvider>
    <div style={{ background: '#080814', minHeight: '100vh', fontFamily: "'Noto Sans SC', sans-serif" }}>
      <SEO />
      <Navbar
        activeGame={activeGame}
        onGameChange={setActiveGame}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      {/* Hero */}
      <HeroSection onSectionChange={handleSectionChange} />

      {/* Live Ticker */}
      <div style={{ position: 'sticky', top: '88px', zIndex: 40 }}>
        <LiveTicker />
      </div>

      {/* Main content */}
      <main>
        <div ref={liveRef}>
          <LiveSection activeGame={activeGame} onWatchMatch={handleWatchMatch} />
        </div>

        <div ref={matchesRef}>
          <MatchesSection activeGame={activeGame} onWatchMatch={handleWatchMatch} />
        </div>

        {/* Divider */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent)' }} />
        </div>

        <div ref={tournamentsRef}>
          <TournamentsSection activeGame={activeGame} />
        </div>

        <div className="max-w-7xl mx-auto px-4">
          <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent)' }} />
        </div>

        <div ref={standingsRef}>
          <StandingsSection activeGame={activeGame} />
        </div>

        <div className="max-w-7xl mx-auto px-4">
          <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent)' }} />
        </div>

        <div ref={newsRef}>
          <NewsSection activeGame={activeGame} />
        </div>
      </main>

      <Footer />

      {/* Scroll to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold cursor-pointer transition-all hover:scale-110 z-50"
        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}
        title="回到顶部"
      >
        ↑
      </button>
    </div>
    </LangProvider>
  );
}
