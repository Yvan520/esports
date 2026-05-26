import { useState } from 'react';
import { GameType, GAMES } from '../data/esportsData';

interface NavbarProps {
  activeGame: GameType | 'ALL';
  onGameChange: (game: GameType | 'ALL') => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function Navbar({ activeGame, onGameChange, activeSection, onSectionChange }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const sections = [
    { id: 'home', label: '首页' },
    { id: 'matches', label: '赛程' },
    { id: 'tournaments', label: '赛事' },
    { id: 'standings', label: '积分榜' },
    { id: 'news', label: '资讯' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: 'rgba(8,8,20,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(99,102,241,0.2)' }}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSectionChange('home')}>
            <div className="relative">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xl" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)' }}>
                ⚡
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            </div>
            <div>
              <div className="text-white font-bold text-lg leading-none" style={{ fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.05em' }}>
                ESPORTS<span style={{ color: '#6366f1' }}>HUB</span>
              </div>
              <div className="text-gray-400 text-xs leading-none">电竞赛事中心</div>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => onSectionChange(s.id)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer"
                style={{
                  color: activeSection === s.id ? '#a5b4fc' : '#9ca3af',
                  background: activeSection === s.id ? 'rgba(99,102,241,0.15)' : 'transparent',
                  borderBottom: activeSection === s.id ? '2px solid #6366f1' : '2px solid transparent',
                }}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            <button className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors cursor-pointer">
              登录
            </button>
            <button className="px-4 py-2 text-sm text-white rounded-lg font-medium cursor-pointer transition-all hover:opacity-90 hover:scale-105" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              免费注册
            </button>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setMenuOpen(!menuOpen)}>
            <div className="w-6 flex flex-col gap-1.5">
              <span className={`block h-0.5 bg-current transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 bg-current transition-all ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-current transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>

        {/* Game filter bar */}
        <div className="flex items-center gap-2 pb-3 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => onGameChange('ALL')}
            className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer"
            style={{
              background: activeGame === 'ALL' ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.06)',
              color: activeGame === 'ALL' ? '#fff' : '#9ca3af',
              border: '1px solid',
              borderColor: activeGame === 'ALL' ? 'transparent' : 'rgba(255,255,255,0.08)',
            }}
          >
            全部赛事
          </button>
          {GAMES.map(g => (
            <button
              key={g.id}
              onClick={() => onGameChange(g.id)}
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer"
              style={{
                background: activeGame === g.id ? g.bgColor : 'rgba(255,255,255,0.06)',
                color: activeGame === g.id ? g.color : '#9ca3af',
                border: '1px solid',
                borderColor: activeGame === g.id ? g.color : 'rgba(255,255,255,0.08)',
              }}
            >
              <span>{g.emoji}</span>
              <span>{g.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t px-4 py-4 flex flex-col gap-2" style={{ background: 'rgba(8,8,20,0.98)', borderColor: 'rgba(99,102,241,0.2)' }}>
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => { onSectionChange(s.id); setMenuOpen(false); }}
              className="text-left px-4 py-3 rounded-lg text-sm font-medium transition-all"
              style={{
                color: activeSection === s.id ? '#a5b4fc' : '#9ca3af',
                background: activeSection === s.id ? 'rgba(99,102,241,0.15)' : 'transparent',
              }}
            >
              {s.label}
            </button>
          ))}
          <div className="flex gap-2 mt-2">
            <button className="flex-1 py-2 text-sm text-gray-300 rounded-lg cursor-pointer" style={{ background: 'rgba(255,255,255,0.06)' }}>登录</button>
            <button className="flex-1 py-2 text-sm text-white rounded-lg font-medium cursor-pointer" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>免费注册</button>
          </div>
        </div>
      )}
    </nav>
  );
}
