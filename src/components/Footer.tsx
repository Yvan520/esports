import { GAMES } from '../data/esportsData';

export default function Footer() {
  return (
    <footer className="mt-20" style={{ background: 'rgba(5,5,15,0.95)', borderTop: '1px solid rgba(99,102,241,0.15)' }}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                ⚡
              </div>
              <div>
                <div className="text-white font-bold text-xl" style={{ fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.05em' }}>
                  ESPORTS<span style={{ color: '#6366f1' }}>HUB</span>
                </div>
                <div className="text-gray-500 text-xs">电竞赛事中心</div>
              </div>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              全球顶级电竞赛事一站聚合平台，提供实时比分、赛程日历、战队积分、高清直播等服务，服务全球1000万+电竞爱好者。
            </p>
            <div className="flex gap-3 mt-5">
              {['微博', 'B站', '微信', 'Discord'].map(s => (
                <button key={s} className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white transition-colors cursor-pointer" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Games */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">覆盖游戏</h4>
            <ul className="space-y-2">
              {GAMES.map(g => (
                <li key={g.id}>
                  <button className="text-gray-500 text-sm hover:text-gray-300 transition-colors cursor-pointer flex items-center gap-2">
                    <span>{g.emoji}</span> {g.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">关于我们</h4>
            <ul className="space-y-2">
              {['关于平台', '赛事合作', '媒体资源', '用户协议', '隐私政策', '帮助中心', '加入我们'].map(l => (
                <li key={l}>
                  <button className="text-gray-500 text-sm hover:text-gray-300 transition-colors cursor-pointer">{l}</button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="text-gray-600 text-xs">© 2025 EsportsHub 电竞赛事中心. 保留所有权利.</div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            所有系统正常运行
            <span className="ml-2">·</span>
            <span>延迟: &lt;50ms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
