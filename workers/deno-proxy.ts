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

  // GET /api/live-matches?game=LOL
  // 返回指定游戏各平台房间的实时状态
  if (path === '/api/live-matches') {
    const game = url.searchParams.get('game') || '';
    const matches = LIVE_GAME_MAP;
    const results: any[] = [];

    for (const [gameId, rooms] of Object.entries(matches)) {
      if (game && gameId !== game) continue;
      for (const [platform, roomId] of Object.entries(rooms)) {
        if (!roomId) continue;
        try {
          const status = await checkRoomLive(String(platform), String(roomId));
          results.push({ game: gameId, platform, roomId, ...status });
        } catch {
          results.push({ game: gameId, platform, roomId, isLive: false, title: null, viewers: 0 });
        }
      }
    }
    return json(results);
  }

  return new Response('Not Found', { status: 404 });
}

async function checkRoomLive(platform: string, roomId: string): Promise<{ isLive: boolean; title: string | null; viewers: number; roomInfo?: any }> {
  switch (platform) {
    case 'douyu': {
      const res = await fetch(`https://www.douyu.com/${roomId}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
      });
      const html = await res.text();
      const isLive = html.includes('"show_status":1') || html.includes('is_show":1');
      const title = html.match(/"room_name":"([^"]+)"/)?.[1] || null;
      const viewers = parseInt(html.match(/"views":(\d+)/)?.[1] || '0', 10);
      return { isLive, title, viewers };
    }
    case 'bilibili': {
      const res = await fetch(`https://api.live.bilibili.com/room/v1/Room/get_info?room_id=${roomId}`);
      const data: any = await res.json();
      if (data.data) {
        return {
          isLive: data.data.live_status === 1,
          title: data.data.title || null,
          viewers: data.data.online || 0,
          roomInfo: data.data,
        };
      }
      return { isLive: false, title: null, viewers: 0 };
    }
    case 'huya': {
      const res = await fetch(`https://www.huya.com/${roomId}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
      });
      const html = await res.text();
      const isLive = html.includes('isLive=true') || html.includes('"liveStatus":"ON"');
      const title = html.match(/title:"([^"]+)"/)?.[1] || html.match(/"introduction":"([^"]+)"/)?.[1] || null;
      const viewers = parseInt(html.match(/"totalCount":(\d+)/)?.[1] || html.match(/"popular":(\d+)/)?.[1] || '0', 10);
      return { isLive, title, viewers };
    }
    default:
      return { isLive: false, title: null, viewers: 0 };
  }
}

// 游戏 → 各平台房间号映射（与前端 GAME_STREAM_MAP 保持同步）
const LIVE_GAME_MAP: Record<string, Record<string, string>> = {
  LOL: { bilibili: '7734200', huya: '660000', douyu: '288016' },
  VALORANT: { bilibili: '22683224', huya: '880001', douyu: '688001' },
  CS2: { bilibili: '33230', huya: '110001', douyu: '288016' },
  DOTA2: { bilibili: '3', huya: '210001', douyu: '556601' },
  PUBG: { bilibili: '25', huya: '410001', douyu: '886601' },
  HONOR: { bilibili: '89', huya: '330001', douyu: '716601' },
};

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
  const auth = md5(realRid + t13);
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

// MD5 哈希 - 纯 JS 实现 (Deno 不支持 crypto.subtle.digest('MD5'))
function md5(str: string): string {
  const rotateLeft = (x: number, n: number) => (x << n) | (x >>> (32 - n));
  const toHex = (n: number) => {
    let s = '', v: number;
    for (let i = 7; i >= 0; i--) {
      v = (n >>> (i * 4)) & 0x0f;
      s += v.toString(16);
    }
    return s;
  };

  const bin = str.split('').map(c => c.charCodeAt(0));
  const len = bin.length;
  // Append padding
  bin.push(0x80);
  while (bin.length % 64 !== 56) bin.push(0x00);
  // Append length in bits
  for (let i = 0; i < 8; i++) bin.push((len * 8) >>> (i * 8) & 0xff);

  const K = [0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee,
    0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
    0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be,
    0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
    0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa,
    0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
    0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed,
    0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
    0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c,
    0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
    0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05,
    0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
    0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039,
    0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
    0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1,
    0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391];

  const S = [7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21];

  let h0 = 0x67452301, h1 = 0xefcdab89, h2 = 0x98badcfe, h3 = 0x10325476;

  for (let i = 0; i < bin.length; i += 64) {
    const X: number[] = [];
    for (let j = 0; j < 16; j++) {
      X[j] = bin[i + j * 4] | (bin[i + j * 4 + 1] << 8) |
             (bin[i + j * 4 + 2] << 16) | (bin[i + j * 4 + 3] << 24);
    }
    let A = h0, B = h1, C = h2, D = h3;
    for (let j = 0; j < 64; j++) {
      let F: number, g: number;
      if (j < 16) { F = (B & C) | (~B & D); g = j; }
      else if (j < 32) { F = (D & B) | (~D & C); g = (5 * j + 1) % 16; }
      else if (j < 48) { F = B ^ C ^ D; g = (3 * j + 5) % 16; }
      else { F = C ^ (B | ~D); g = (7 * j) % 16; }
      const temp = D;
      D = C;
      C = B;
      B = B + rotateLeft(A + F + K[j] + X[g], S[j]);
      A = temp;
    }
    h0 = (h0 + A) | 0;
    h1 = (h1 + B) | 0;
    h2 = (h2 + C) | 0;
    h3 = (h3 + D) | 0;
  }

  return toHex(h0) + toHex(h1) + toHex(h2) + toHex(h3);
}

function json(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders() }
  });
}

Deno.serve(handleRequest);
