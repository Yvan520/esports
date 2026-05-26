import { useEffect, useRef, useState } from "react";

type StreamPlatform = 'twitch' | 'youtube' | 'bilibili' | 'huya' | 'douyu' | 'custom';

interface StreamPlayerProps {
  platform: StreamPlatform;
  roomId?: string;
  embedUrl?: string;
  streamUrl?: string;
  proxyUrl?: string;
  onError?: () => void;
  onLoad?: () => void;
}

export default function StreamPlayer({ platform, roomId, embedUrl, streamUrl: propStreamUrl, proxyUrl, onError, onLoad }: StreamPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<'loading' | 'playing' | 'error' | 'idle'>('idle');
  const [useDirectVideo, setUseDirectVideo] = useState(false);
  const [directUrl, setDirectUrl] = useState<string | null>(null);
  const flvPlayerRef = useRef<any>(null);
  const hlsPlayerRef = useRef<any>(null);

  // 根据平台决定使用 iframe 还是 direct video
  const isIframePlatform = platform === 'twitch' || platform === 'youtube' || platform === 'bilibili' || platform === 'huya' || (platform === 'custom' && embedUrl?.includes('embed'));
  const useIframe = isIframePlatform && !useDirectVideo;

  // 通过 proxy 获取流地址 (仅斗鱼需要)
  useEffect(() => {
    if (platform === 'custom' && propStreamUrl) {
      const isIframeUrl = propStreamUrl.includes('embed') || propStreamUrl.includes('player.') || propStreamUrl.includes('youtube.com');
      if (isIframeUrl) {
        // 如果是 iframe URL，不使用 direct video
        return;
      }
      setDirectUrl(propStreamUrl);
      setUseDirectVideo(true);
      return;
    }

    if (platform === 'douyu' && proxyUrl && roomId) {
      setStatus('loading');
      fetch(`${proxyUrl}/api/stream?platform=douyu&roomId=${roomId}`)
        .then(r => r.json())
        .then(data => {
          if (data.url) {
            setDirectUrl(data.url);
            setUseDirectVideo(true);
          } else {
            setStatus('error');
            onError?.();
          }
        })
        .catch(() => {
          setStatus('error');
          onError?.();
        });
      return;
    }
  }, [platform, roomId, proxyUrl, propStreamUrl]);

  // 播放 direct URL (flv.js / hls.js)
  useEffect(() => {
    if (!useDirectVideo || !directUrl || !videoRef.current) return;

    setStatus('loading');

    const video = videoRef.current;
    const isFlv = directUrl.includes('.flv') || platform === 'douyu';
    const isHls = directUrl.includes('.m3u8');

    if (isFlv && typeof window !== 'undefined') {
      loadFlvJs().then(() => {
        const flvjs = (window as any).flvjs;
        if (flvjs && flvjs.isSupported()) {
          if (flvPlayerRef.current) flvPlayerRef.current.destroy();
          const player = flvjs.createPlayer({
            type: 'flv',
            url: directUrl,
            isLive: true,
          }, {
            enableWorker: false,
            enableStashBuffer: false,
            stashInitialSize: 128,
          });
          player.attachMediaElement(video);
          player.load();
          player.play().then(() => {
            setStatus('playing');
            onLoad?.();
          }).catch(() => {
            // 自动播放被阻止，用户需要交互
            setStatus('idle');
          });
          flvPlayerRef.current = player;
        } else {
          fallbackPlay(directUrl);
        }
      });
    } else if (isHls && typeof window !== 'undefined') {
      loadHlsJs().then(() => {
        const Hls = (window as any).Hls;
        if (Hls && Hls.isSupported()) {
          if (hlsPlayerRef.current) hlsPlayerRef.current.destroy();
          const hls = new Hls();
          hls.loadSource(directUrl);
          hls.attachMedia(video);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play().then(() => {
              setStatus('playing');
              onLoad?.();
            }).catch(() => setStatus('idle'));
          });
          hls.on(Hls.Events.ERROR, () => {
            setStatus('error');
            onError?.();
          });
          hlsPlayerRef.current = hls;
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = directUrl;
          video.play().then(() => {
            setStatus('playing');
            onLoad?.();
          }).catch(() => setStatus('idle'));
        } else {
          fallbackPlay(directUrl);
        }
      });
    } else {
      fallbackPlay(directUrl);
    }

    return () => {
      if (flvPlayerRef.current) {
        flvPlayerRef.current.pause();
        flvPlayerRef.current.destroy();
        flvPlayerRef.current = null;
      }
      if (hlsPlayerRef.current) {
        hlsPlayerRef.current.destroy();
        hlsPlayerRef.current = null;
      }
    };
  }, [useDirectVideo, directUrl, platform]);

  function fallbackPlay(url: string) {
    const video = videoRef.current;
    if (!video) return;
    video.src = url;
    video.play().then(() => {
      setStatus('playing');
      onLoad?.();
    }).catch(() => setStatus('idle'));
  }

  function handleIframeLoad() {
    setStatus('playing');
    onLoad?.();
  }

  function handleIframeError() {
    setStatus('error');
    onError?.();
  }

  function handleUserPlay() {
    videoRef.current?.play().catch(() => {});
  }

  return (
    <>
      {useIframe && embedUrl && (
        <iframe
          key={embedUrl}
          className="absolute inset-0 w-full h-full"
          src={embedUrl}
          allow="autoplay; fullscreen"
          allowFullScreen
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      )}

      {useDirectVideo && (
        <div className="absolute inset-0 w-full h-full bg-black" onClick={handleUserPlay}>
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            autoPlay
            playsInline
            muted
            controls
          />
          {status === 'loading' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-cyan-400 text-xs font-mono">加载直播流...</span>
              </div>
            </div>
          )}
        </div>
      )}

      {!useIframe && !useDirectVideo && platform !== 'custom' && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950">
          <p className="text-slate-500 text-xs">
            {platform === 'douyu' ? '斗鱼暂不支持页面内播放，请在新窗口观看' : '加载中...'}
          </p>
        </div>
      )}
    </>
  );
}

// 动态加载 flv.js (从 CDN，避免打包)
let flvJsPromise: Promise<void> | null = null;
function loadFlvJs(): Promise<void> {
  if ((window as any).flvjs) return Promise.resolve();
  if (flvJsPromise) return flvJsPromise;
  flvJsPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/flv.js@latest/dist/flv.min.js';
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load flv.js'));
    document.head.appendChild(s);
  });
  return flvJsPromise;
}

let hlsJsPromise: Promise<void> | null = null;
function loadHlsJs(): Promise<void> {
  if ((window as any).Hls) return Promise.resolve();
  if (hlsJsPromise) return hlsJsPromise;
  hlsJsPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest/dist/hls.min.js';
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load hls.js'));
    document.head.appendChild(s);
  });
  return hlsJsPromise;
}
