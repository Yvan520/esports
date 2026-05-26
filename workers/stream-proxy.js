// Cloudflare Worker - Live Stream URL Proxy
// 从各直播平台提取真实流媒体地址（FLV/HLS）
// Deploy: npm install -g wrangler && wrangler deploy
// 部署后设置 STREAM_PROXY_URL 环境变量供前端使用

// 支持的平台列表
const PLATFORMS = ['douyu', 'huya', 'bilibili'];

// 缓存流地址 (1分钟有效，直播流地址会过期)
const cache = new Map();
const CACHE_TTL = 60_000;

async function handleRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/$/, '');

  // CORS 头
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'no-cache',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // GET /api/stream?platform=douyu&roomId=288016
  if (path === '/api/stream') {
    const platform = url.searchParams.get('platform');
    const roomId = url.searchParams.get('roomId');
    const quality = parseInt(url.searchParams.get('quality') || '0', 10);

    if (!platform || !roomId) {
      return new Response(JSON.stringify({ error: 'Missing platform or roomId' }), {
        status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    if (!PLATFORMS.includes(platform)) {
      return new Response(JSON.stringify({ error: `Unsupported platform: ${platform}` }), {
        status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    const cacheKey = `${platform}:${roomId}:${quality}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      return new Response(JSON.stringify(cached.data), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    try {
      let result;
      switch (platform) {
        case 'douyu':
          result = await getDouyuStream(roomId, quality);
          break;
        case 'huya':
          result = await getHuyaStream(roomId, quality);
          break;
        case 'bilibili':
          result = await getBilibiliStream(roomId, quality);
          break;
      }

      if (result && result.url) {
        cache.set(cacheKey, { data: result, ts: Date.now() });
      }

      return new Response(JSON.stringify(result || { error: 'Stream not available' }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
  }

  // GET /api/check?platform=douyu&roomId=288016 - 检查房间是否在直播
  if (path === '/api/check') {
    const platform = url.searchParams.get('platform');
    const roomId = url.searchParams.get('roomId');

    if (!platform || !roomId) {
      return new Response(JSON.stringify({ error: 'Missing params' }), {
        status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    try {
      let isLive = false;
      let roomInfo = {};

      switch (platform) {
        case 'douyu': {
          const res = await fetch(`https://www.douyu.com/${roomId}`, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
          });
          const html = await res.text();
          isLive = html.includes('"show_status":1') || html.includes('is_show":1');
          break;
        }
        case 'bilibili': {
          const res = await fetch(`https://api.live.bilibili.com/room/v1/Room/get_info?room_id=${roomId}`);
          const data = await res.json();
          isLive = data.data?.live_status === 1;
          roomInfo = data.data || {};
          break;
        }
        case 'huya': {
          const res = await fetch(`https://www.huya.com/${roomId}`, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
          });
          const html = await res.text();
          isLive = html.includes('isLive=true') || html.includes('"liveStatus":"ON"');
          break;
        }
      }

      return new Response(JSON.stringify({ isLive, roomInfo }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message, isLive: false }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
  }

  // Health check
  if (path === '/api/health') {
    return new Response(JSON.stringify({ status: 'ok', platforms: PLATFORMS }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }

  return new Response('Not Found', { status: 404 });
}

// ============================================================
// 斗鱼 - 获取直播流地址
// API: https://playweb.douyucdn.cn/lapi/live/hlsH5Preview/{rid}
// ============================================================
async function getDouyuStream(roomId, quality) {
  const t13 = String(Date.now());
  const did = '10000000000000000000000000001501';

  // Step 1: 获取真实 rid (短号转长号)
  const roomRes = await fetch(`https://m.douyu.com/${roomId}`, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P) AppleWebKit/537.36' }
  });
  const roomHtml = await roomRes.text();
  const ridMatch = roomHtml.match(/rid":(\d{1,8})/);
  const realRid = ridMatch ? ridMatch[1] : roomId;

  // Step 2: 调用预览 API
  const auth = await md5(realRid + t13);
  const formData = new URLSearchParams();
  formData.append('rid', realRid);
  formData.append('did', did);

  const res = await fetch(`https://playweb.douyucdn.cn/lapi/live/hlsH5Preview/${realRid}`, {
    method: 'POST',
    headers: {
      'rid': realRid,
      'time': t13,
      'auth': auth,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P) AppleWebKit/537.36'
    },
    body: formData.toString()
  });
  const data = await res.json();

  if (data.error === 0 && data.data) {
    let key = data.data.rtmp_live || '';
    // 提取 key
    const keyMatch = key.match(/(\d{1,8}[0-9a-zA-Z]+)_?\d{0,4}(?:\/playlist|\.m3u8)?/);
    if (keyMatch) key = keyMatch[1];

    return {
      platform: 'douyu',
      roomId: realRid,
      isLive: true,
      url: `http://tx2play1.douyucdn.cn/live/${key}.flv?uuid=`,
      urlHls: key.includes('.m3u8') ? key : null,
      urlFlv: `http://tx2play1.douyucdn.cn/live/${key}.flv?uuid=`,
      quality: quality || 0,
    };
  }

  if (data.error === 104) {
    return { platform: 'douyu', roomId, isLive: false, url: null, error: '房间未开播' };
  }

  // Step 3: 如果 preview API 失败，尝试 ratestream API (moble)
  const res2 = await fetch('https://m.douyu.com/api/room/ratestream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P) AppleWebKit/537.36'
    },
    body: new URLSearchParams({
      rid: realRid,
      did: did,
      rate: String(quality >= 0 ? quality : 0),
      tt: String(Math.floor(Date.now() / 1000)),
      v: '2501' + new Date().toISOString().slice(0, 10).replace(/-/g, '')
    }).toString()
  });
  const data2 = await res2.json();
  if (data2.code === 0 && data2.data?.url) {
    return {
      platform: 'douyu',
      roomId: realRid,
      isLive: true,
      url: data2.data.url,
      urlFlv: data2.data.url,
    };
  }

  return { platform: 'douyu', roomId, isLive: false, url: null, error: '无法获取直播源' };
}

// ============================================================
// 虎牙 - 获取直播流地址
// 虎牙有官方 liveshare iframe，此 API 提供直接流地址
// ============================================================
async function getHuyaStream(roomId, quality) {
  const res = await fetch(`https://www.huya.com/${roomId}`, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  const html = await res.text();

  // 在页面源码中查找流地址
  const streamMatch = html.match(/"stream":\s*\{[^}]*"url":\s*"([^"]+)"/);
  const flvMatch = html.match(/flvUrl\s*[=:]\s*['"]([^'"]+)['"]/);
  const hlsMatch = html.match(/hlsUrl\s*[=:]\s*['"]([^'"]+)['"]/);

  const url = flvMatch?.[1] || hlsMatch?.[1] || streamMatch?.[1];
  if (url) {
    return {
      platform: 'huya',
      roomId,
      isLive: true,
      url: url.replace(/\\/g, ''),
      urlFlv: flvMatch?.[1]?.replace(/\\/g, '') || null,
      urlHls: hlsMatch?.[1]?.replace(/\\/g, '') || null,
    };
  }

  // 备用：使用 liveshare 的流地址
  const res2 = await fetch(`https://liveshare.huya.com/iframe/${roomId}`, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  const html2 = await res2.text();
  const shareMatch = html2.match(/streamUrl["']?\s*[:=]\s*["']([^"']+)["']/);
  if (shareMatch) {
    return {
      platform: 'huya',
      roomId,
      isLive: true,
      url: shareMatch[1].replace(/\\/g, ''),
    };
  }

  return { platform: 'huya', roomId, isLive: false, url: null, error: '未开播或房间不存在' };
}

// ============================================================
// B站 - 获取直播流地址
// API: https://api.live.bilibili.com/room/v1/Room/playUrl
// ============================================================
async function getBilibiliStream(roomId, quality) {
  const qualityMap = { 0: 10000, 1: 400, 2: 250, 3: 150, 4: 80 };
  const qn = qualityMap[quality] || 10000;

  // 获取真实 room_id (短号转长号)
  const infoRes = await fetch(`https://api.live.bilibili.com/room/v1/Room/get_info?room_id=${roomId}`);
  const infoData = await infoRes.json();
  const realRoomId = infoData.data?.room_id || roomId;
  const isLive = infoData.data?.live_status === 1;

  if (!isLive) {
    return { platform: 'bilibili', roomId, isLive: false, url: null, error: '未开播' };
  }

  const res = await fetch(
    `https://api.live.bilibili.com/room/v1/Room/playUrl?cid=${realRoomId}&qn=${qn}&platform=web`,
    { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }
  );
  const data = await res.json();

  if (data.code === 0 && data.data?.durl?.length > 0) {
    const durl = data.data.durl;
    return {
      platform: 'bilibili',
      roomId: realRoomId,
      isLive: true,
      url: durl[0].url,
      urls: durl.map(d => d.url),
      quality: data.data.current_qn,
      qualityDesc: data.data.quality_description?.find(q => q.qn === data.data.current_qn)?.desc || '',
    };
  }

  // 备用：使用新 API
  const res2 = await fetch(
    `https://api.live.bilibili.com/xlive/web-room/v2/index/getRoomPlayInfo?room_id=${realRoomId}&protocol=0,1&format=0,1,2&codec=0&platform=web&qn=${qn}`,
    { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }
  );
  const data2 = await res2.json();
  if (data2.code === 0 && data2.data?.play_url_info?.play_url?.stream?.length > 0) {
    const streams = data2.data.play_url_info.play_url.stream;
    for (const stream of streams) {
      for (const format of stream.format || []) {
        for (const codec of format.codec || []) {
          const baseUrl = codec.base_url || '';
          const urlInfo = codec.url_info?.[0];
          if (urlInfo) {
            const fullUrl = `${urlInfo.host}${baseUrl}${urlInfo.extra || ''}`;
            return {
              platform: 'bilibili',
              roomId: realRoomId,
              isLive: true,
              url: fullUrl,
              format: format.format_name,
            };
          }
        }
      }
    }
  }

  return { platform: 'bilibili', roomId, isLive: isLive, url: null, error: '无法获取播放地址' };
}

// MD5 哈希 (使用 Web Crypto API)
async function md5(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('MD5', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// 注册 Worker
export default {
  async fetch(request, env, ctx) {
    return handleRequest(request);
  }
};
