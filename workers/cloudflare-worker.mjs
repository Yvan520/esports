// Cloudflare Worker - 直播流地址代理
// 部署: Cloudflare Dashboard → Workers & Pages → Create Worker → 粘贴此代码 → 部署
// 部署后记下域名如: https://your-worker.xxx.workers.dev
// 在 src/data/esportsData.ts 中 PROXY_URL 更新为此域名

const CACHE_TTL = 60_000;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/$/, '');

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders() });
    }

    // GET /api/stream?platform=bilibili&roomId=xxx
    if (path === '/api/stream') {
      const platform = url.searchParams.get('platform');
      const roomId = url.searchParams.get('roomId');
      const quality = parseInt(url.searchParams.get('quality') || '0', 10);
      if (!platform || !roomId) return json({ error: 'Missing platform or roomId' }, 400);
      try {
        let result;
        switch (platform) {
          case 'douyu': result = await getDouyuStream(roomId, quality); break;
          case 'huya': result = await getHuyaStream(roomId, quality); break;
          case 'bilibili': result = await getBilibiliStream(roomId, quality); break;
          default: return json({ error: `Unsupported: ${platform}` }, 400);
        }
        return json(result || { error: 'Stream not available' });
      } catch (err) {
        return json({ error: err.message || 'Unknown' }, 500);
      }
    }

    // GET /api/rooms - B站房间自动发现
    if (path === '/api/rooms') {
      const rooms = await getRoomMap();
      return json(rooms);
    }

    // GET /api/live-matches?game=LOL
    if (path === '/api/live-matches') {
      const game = url.searchParams.get('game') || '';
      const matches = await getRoomMap();
      const tasks = [];
      for (const [gameId, rooms] of Object.entries(matches)) {
        if (game && gameId !== game) continue;
        const bilibiliId = rooms.bilibili;
        if (!bilibiliId) continue;
        tasks.push(
          checkRoomLive('bilibili', bilibiliId).then(status =>
            ({ game: gameId, platform: 'bilibili', roomId: bilibiliId, ...status })
          ).catch(() =>
            ({ game: gameId, platform: 'bilibili', roomId: bilibiliId, isLive: false, title: null, viewers: 0 })
          )
        );
      }
      const results = await Promise.all(tasks);
      return json(results);
    }

    // GET /api/health
    if (path === '/api/health') {
      return json({ status: 'ok', platforms: ['douyu', 'huya', 'bilibili'] });
    }

    return new Response('Not Found', { status: 404 });
  }
};

function corsHeaders() {
  return { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Cache-Control': 'no-cache' };
}

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', ...corsHeaders(), ...extraHeaders } });
}

// ============ B站房间自动发现 ============

const FALLBACK_BILIBILI = {
  LOL: '7734200', VALORANT: '22908869', CS2: '21495949',
  DOTA2: '21495945', PUBG: '11218604', HONOR: '21144080',
  DELTA: '31250975', AB: '23927284',
};

const GAME_KEYWORDS = {
  LOL: '英雄联盟赛事', VALORANT: '无畏契约赛事', CS2: '完美世界电竞CS2',
  DOTA2: '完美世界电竞DOTA2', PUBG: 'PUBG赛事', HONOR: '王者荣耀赛事',
  DELTA: '三角洲行动赛事', AB: '暗区突围赛事',
};

let discoveredCache = null;
const DISCOVER_TTL = 86400_000;

async function discoverBilibiliRooms() {
  const result = {};
  for (const [game, keyword] of Object.entries(GAME_KEYWORDS)) {
    try {
      const res = await fetch(
        `https://api.bilibili.com/x/web-interface/search/type?search_type=live_room&keyword=${encodeURIComponent(keyword)}`,
        { headers: { 'User-Agent': 'Mozilla/5.0' } }
      );
      const data = await res.json();
      const rooms = data?.data?.result;
      if (rooms && rooms.length > 0) {
        rooms.sort((a, b) => (b.atten || 0) - (a.atten || 0));
        result[game] = String(rooms[0].roomid);
      }
    } catch {}
    if (!result[game] && FALLBACK_BILIBILI[game]) result[game] = FALLBACK_BILIBILI[game];
  }
  return result;
}

async function getRoomMap() {
  if (discoveredCache && Date.now() - discoveredCache.ts < DISCOVER_TTL) return discoveredCache.data;
  const bilibiliRooms = await discoverBilibiliRooms();
  const result = {};
  for (const game of Object.keys(GAME_KEYWORDS)) {
    result[game] = {};
    if (bilibiliRooms[game]) result[game].bilibili = bilibiliRooms[game];
  }
  discoveredCache = { data: result, ts: Date.now() };
  return result;
}

async function checkRoomLive(platform, roomId) {
  if (platform === 'bilibili') {
    const res = await fetch(`https://api.live.bilibili.com/room/v1/Room/get_info?room_id=${roomId}`);
    const data = await res.json();
    if (data.data) return { isLive: data.data.live_status === 1, title: data.data.title || null, viewers: data.data.online || 0, roomInfo: data.data };
    return { isLive: false, title: null, viewers: 0 };
  }
  return { isLive: false, title: null, viewers: 0 };
}

// ============ 流地址解析 ============

async function getBilibiliStream(roomId, quality) {
  const qualityMap = { 0: 10000, 1: 400, 2: 250, 3: 150, 4: 80 };
  const qn = qualityMap[quality] || 10000;
  const infoRes = await fetch(`https://api.live.bilibili.com/room/v1/Room/get_info?room_id=${roomId}`);
  const infoData = await infoRes.json();
  const realRoomId = infoData.data?.room_id || roomId;
  if (infoData.data?.live_status !== 1) return { platform: 'bilibili', roomId, isLive: false, url: null, error: '未开播' };
  const res = await fetch(`https://api.live.bilibili.com/room/v1/Room/playUrl?cid=${realRoomId}&qn=${qn}&platform=web`,
    { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } });
  const data = await res.json();
  if (data.code === 0 && data.data?.durl?.length > 0) {
    return { platform: 'bilibili', roomId: realRoomId, isLive: true, url: data.data.durl[0].url, urls: data.data.durl.map(d => d.url) };
  }
  return { platform: 'bilibili', roomId, isLive: true, url: null, error: '无法获取播放地址' };
}

async function getDouyuStream(roomId, quality) {
  const t13 = String(Date.now());
  const did = '10000000000000000000000000001501';
  const roomRes = await fetch(`https://m.douyu.com/${roomId}`, { headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P) AppleWebKit/537.36' } });
  const roomHtml = await roomRes.text();
  const ridMatch = roomHtml.match(/rid":(\d{1,8})/);
  const realRid = ridMatch ? ridMatch[1] : roomId;
  const auth = md5(realRid + t13);
  const formData = new URLSearchParams();
  formData.append('rid', realRid);
  formData.append('did', did);
  const res = await fetch(`https://playweb.douyucdn.cn/lapi/live/hlsH5Preview/${realRid}`, {
    method: 'POST',
    headers: { 'rid': realRid, 'time': t13, 'auth': auth, 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P) AppleWebKit/537.36' },
    body: formData.toString()
  });
  const data = await res.json();
  if (data.error === 0 && data.data) {
    let key = data.data.rtmp_live || '';
    const keyMatch = key.match(/(\d{1,8}[0-9a-zA-Z]+)_?\d{0,4}(?:\/playlist|\.m3u8)?/);
    if (keyMatch) key = keyMatch[1];
    return { platform: 'douyu', roomId: realRid, isLive: true, url: `http://tx2play1.douyucdn.cn/live/${key}.flv?uuid=`, urlFlv: `http://tx2play1.douyucdn.cn/live/${key}.flv?uuid=` };
  }
  if (data.error === 104) return { platform: 'douyu', roomId, isLive: false, url: null, error: '房间未开播' };
  return { platform: 'douyu', roomId, isLive: false, url: null, error: '无法获取直播源' };
}

async function getHuyaStream(roomId, quality) {
  const res = await fetch(`https://www.huya.com/${roomId}`, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } });
  const html = await res.text();
  const flvMatch = html.match(/flvUrl\s*[=:]\s*['"]([^'"]+)['"]/);
  const hlsMatch = html.match(/hlsUrl\s*[=:]\s*['"]([^'"]+)['"]/);
  const url = flvMatch?.[1] || hlsMatch?.[1];
  if (url) return { platform: 'huya', roomId, isLive: true, url: url.replace(/\\/g, '') };
  return { platform: 'huya', roomId, isLive: false, url: null, error: '未开播或房间不存在' };
}

// MD5 纯JS实现 (Workers 不支持 crypto.subtle.digest('MD5'))
function md5(str) {
  const rotateLeft = (x, n) => (x << n) | (x >>> (32 - n));
  const toHex = n => { let s = '', v; for (let i = 7; i >= 0; i--) { v = (n >>> (i * 4)) & 0x0f; s += v.toString(16); } return s; };
  const bin = str.split('').map(c => c.charCodeAt(0));
  const len = bin.length;
  bin.push(0x80);
  while (bin.length % 64 !== 56) bin.push(0x00);
  for (let i = 0; i < 8; i++) bin.push((len * 8) >>> (i * 8) & 0xff);
  const K = [0xd76aa478,0xe8c7b756,0x242070db,0xc1bdceee,0xf57c0faf,0x4787c62a,0xa8304613,0xfd469501,0x698098d8,0x8b44f7af,0xffff5bb1,0x895cd7be,0x6b901122,0xfd987193,0xa679438e,0x49b40821,0xf61e2562,0xc040b340,0x265e5a51,0xe9b6c7aa,0xd62f105d,0x02441453,0xd8a1e681,0xe7d3fbc8,0x21e1cde6,0xc33707d6,0xf4d50d87,0x455a14ed,0xa9e3e905,0xfcefa3f8,0x676f02d9,0x8d2a4c8a,0xfffa3942,0x8771f681,0x6d9d6122,0xfde5380c,0xa4beea44,0x4bdecfa9,0xf6bb4b60,0xbebfbc70,0x289b7ec6,0xeaa127fa,0xd4ef3085,0x04881d05,0xd9d4d039,0xe6db99e5,0x1fa27cf8,0xc4ac5665,0xf4292244,0x432aff97,0xab9423a7,0xfc93a039,0x655b59c3,0x8f0ccc92,0xffeff47d,0x85845dd1,0x6fa87e4f,0xfe2ce6e0,0xa3014314,0x4e0811a1,0xf7537e82,0xbd3af235,0x2ad7d2bb,0xeb86d391];
  const S = [7,12,17,22,7,12,17,22,7,12,17,22,7,12,17,22,5,9,14,20,5,9,14,20,5,9,14,20,5,9,14,20,4,11,16,23,4,11,16,23,4,11,16,23,4,11,16,23,6,10,15,21,6,10,15,21,6,10,15,21,6,10,15,21];
  let h0=0x67452301,h1=0xefcdab89,h2=0x98badcfe,h3=0x10325476;
  for (let i=0;i<bin.length;i+=64) {
    const X=[];
    for(let j=0;j<16;j++) X[j]=bin[i+j*4]|(bin[i+j*4+1]<<8)|(bin[i+j*4+2]<<16)|(bin[i+j*4+3]<<24);
    let A=h0,B=h1,C=h2,D=h3;
    for(let j=0;j<64;j++) {
      let F,g;
      if(j<16){F=(B&C)|(~B&D);g=j;}
      else if(j<32){F=(D&B)|(~D&C);g=(5*j+1)%16;}
      else if(j<48){F=B^C^D;g=(3*j+5)%16;}
      else{F=C^(B|~D);g=(7*j)%16;}
      const temp=D;D=C;C=B;B=B+rotateLeft(A+F+K[j]+X[g],S[j]);A=temp;
    }
    h0=(h0+A)|0;h1=(h1+B)|0;h2=(h2+C)|0;h3=(h3+D)|0;
  }
  return toHex(h0)+toHex(h1)+toHex(h2)+toHex(h3);
}
