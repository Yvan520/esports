// Deno Deploy - 直播流地址代理
// 在 Deno Deploy 面板: 点击 "New Playground" → 粘贴此代码 → 部署

const CACHE = new Map<string, { data: any; ts: number }>();
const CACHE_TTL = 60_000;

function corsHeaders(): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'no-cache',
  };
}

async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname.replace(/\/$/, '');

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders() });
  }

  // GET /api/stream?platform=douyu&roomId=288016
  if (path === '/api/stream') {
    const platform = url.searchParams.get('platform');
    const roomId = url.searchParams.get('roomId');
    const quality = parseInt(url.searchParams.get('quality') || '0', 10);

    if (!platform || !roomId) {
      return json({ error: 'Missing platform or roomId' }, 400);
    }

    const cacheKey = `${platform}:${roomId}:${quality}`;
    const cached = CACHE.get(cacheKey);
    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      return json(cached.data);
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
        default:
          return json({ error: `Unsupported platform: ${platform}` }, 400);
      }

      if (result?.url) {
        CACHE.set(cacheKey, { data: result, ts: Date.now() });
      }

      return json(result || { error: 'Stream not available' });
    } catch (err) {
      return json({ error: err instanceof Error ? err.message : 'Unknown error' }, 500);
    }
  }

  // GET /api/check?platform=douyu&roomId=288016
  if (path === '/api/check') {
    const platform = url.searchParams.get('platform');
    const roomId = url.searchParams.get('roomId');

    if (!platform || !roomId) {
      return json({ error: 'Missing params' }, 400);
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
          const data: any = await res.json();
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

      return json({ isLive, roomInfo });
    } catch (err) {
      return json({ error: err instanceof Error ? err.message : 'Unknown', isLive: false });
    }
  }

  if (path === '/api/health') {
    return json({ status: 'ok', platforms: ['douyu', 'huya', 'bilibili'] });
  }

  return new Response('Not Found', { status: 404 });
}

// ============================================================
// 斗鱼 - 获取直播流地址
// ============================================================
async function getDouyuStream(roomId: string, quality: number) {
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
  const data: any = await res.json();

  if (data.error === 0 && data.data) {
    let key = data.data.rtmp_live || '';
    const keyMatch = key.match(/(\d{1,8}[0-9a-zA-Z]+)_?\d{0,4}(?:\/playlist|\.m3u8)?/);
    if (keyMatch) key = keyMatch[1];
    return {
      platform: 'douyu', roomId: realRid, isLive: true,
      url: `http://tx2play1.douyucdn.cn/live/${key}.flv?uuid=`,
      urlFlv: `http://tx2play1.douyucdn.cn/live/${key}.flv?uuid=`,
    };
  }

  if (data.error === 104) {
    return { platform: 'douyu', roomId, isLive: false, url: null, error: '房间未开播' };
  }

  // Step 3: 备用 - 使用 ratestream API
  const res2 = await fetch('https://m.douyu.com/api/room/ratestream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P) AppleWebKit/537.36'
    },
    body: new URLSearchParams({
      rid: realRid, did,
      rate: String(quality >= 0 ? quality : 0),
      tt: String(Math.floor(Date.now() / 1000)),
      v: '2501' + new Date().toISOString().slice(0, 10).replace(/-/g, '')
    }).toString()
  });
  const data2: any = await res2.json();
  if (data2.code === 0 && data2.data?.url) {
    return { platform: 'douyu', roomId: realRid, isLive: true, url: data2.data.url };
  }

  return { platform: 'douyu', roomId, isLive: false, url: null, error: '无法获取直播源' };
}

// ============================================================
// 虎牙 - 获取直播流地址
// ============================================================
async function getHuyaStream(roomId: string, quality: number) {
  const res = await fetch(`https://www.huya.com/${roomId}`, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  const html = await res.text();

  const flvMatch = html.match(/flvUrl\s*[=:]\s*['"]([^'"]+)['"]/);
  const hlsMatch = html.match(/hlsUrl\s*[=:]\s*['"]([^'"]+)['"]/);
  const url = flvMatch?.[1] || hlsMatch?.[1];
  if (url) {
    return { platform: 'huya', roomId, isLive: true, url: url.replace(/\\/g, '') };
  }

  // 备用: liveshare
  const res2 = await fetch(`https://liveshare.huya.com/iframe/${roomId}`, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  const html2 = await res2.text();
  const shareMatch = html2.match(/streamUrl["']?\s*[:=]\s*["']([^"']+)["']/);
  if (shareMatch) {
    return { platform: 'huya', roomId, isLive: true, url: shareMatch[1].replace(/\\/g, '') };
  }

  return { platform: 'huya', roomId, isLive: false, url: null, error: '未开播或房间不存在' };
}

// ============================================================
// B站 - 获取直播流地址
// ============================================================
async function getBilibiliStream(roomId: string, quality: number) {
  const qualityMap: Record<number, number> = { 0: 10000, 1: 400, 2: 250, 3: 150, 4: 80 };
  const qn = qualityMap[quality] || 10000;

  const infoRes = await fetch(`https://api.live.bilibili.com/room/v1/Room/get_info?room_id=${roomId}`);
  const infoData: any = await infoRes.json();
  const realRoomId = infoData.data?.room_id || roomId;
  const isLive = infoData.data?.live_status === 1;

  if (!isLive) {
    return { platform: 'bilibili', roomId, isLive: false, url: null, error: '未开播' };
  }

  const res = await fetch(
    `https://api.live.bilibili.com/room/v1/Room/playUrl?cid=${realRoomId}&qn=${qn}&platform=web`,
    { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }
  );
  const data: any = await res.json();

  if (data.code === 0 && data.data?.durl?.length > 0) {
    return {
      platform: 'bilibili', roomId: realRoomId, isLive: true,
      url: data.data.durl[0].url,
      urls: data.data.durl.map((d: any) => d.url),
    };
  }

  return { platform: 'bilibili', roomId, isLive, url: null, error: '无法获取播放地址' };
}

// MD5 哈希
async function md5(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('MD5', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function json(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders() }
  });
}

Deno.serve(handleRequest);
