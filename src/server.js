// Minimal Node server with Basic Auth and static serving
// - Reads mock data to serve logs for a given session
// - Simple HTML Basic Auth; credentials via env or generated at startup

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;

// Generate random credentials if not provided
function randomString(len = 12) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let out = '';
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

if (!process.env.BASIC_AUTH_USER) process.env.BASIC_AUTH_USER = `user_${randomString(6)}`;
if (!process.env.BASIC_AUTH_PASS) process.env.BASIC_AUTH_PASS = randomString(16);

const AUTH_USER = process.env.BASIC_AUTH_USER;
const AUTH_PASS = process.env.BASIC_AUTH_PASS;

// Load mock data (JS module exporting constants)
const mockPath = path.join(__dirname, '..', 'data', 'mockData.js');
let mock = { components: [], mockLogEntries: [], mockSessionData: null };
try {
  mock = require(mockPath);
} catch (e) {
  console.warn('Warning: mock data not found at', mockPath, e.message);
}

function sendJSON(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body)
  });
  res.end(body);
}

function unauthorized(res) {
  res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="Diro Session Crash Troubleshooting"' });
  res.end('Unauthorized');
}

function checkAuth(req, res) {
  const header = req.headers['authorization'];
  if (!header || !header.startsWith('Basic ')) return false;
  const creds = Buffer.from(header.split(' ')[1], 'base64').toString();
  const [user, pass] = creds.split(':');
  return user === AUTH_USER && pass === AUTH_PASS;
}

function serveStatic(req, res) {
  const publicDir = path.join(__dirname, '..', 'public');
  let filePath = path.join(publicDir, req.url === '/' ? 'index.html' : req.url);
  // Prevent path traversal
  if (!filePath.startsWith(publicDir)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }
  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404);
      return res.end('Not found');
    }
    const ext = path.extname(filePath).toLowerCase();
    const types = {
      '.html': 'text/html; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.json': 'application/json; charset=utf-8',
      '.svg': 'image/svg+xml',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.ico': 'image/x-icon'
    };
    const ctype = types[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': ctype });
    fs.createReadStream(filePath).pipe(res);
  });
}

function getUnifiedLogsBySession(sessionId) {
  // For now, return all mock entries that match the session in details/message
  const entries = (mock.mockLogEntries || []).filter(e => {
    const s = JSON.stringify(e);
    return s.includes(sessionId);
  });
  // Sort by timestamp
  entries.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  return entries;
}

const server = http.createServer((req, res) => {
  // Auth first for all routes
  if (!checkAuth(req, res)) return unauthorized(res);

  if (req.url.startsWith('/api/')) {
    if (req.method === 'GET' && req.url.startsWith('/api/session')) {
      const urlObj = new URL(req.url, `http://${req.headers.host}`);
      const sessionId = urlObj.searchParams.get('id');
      if (!sessionId) return sendJSON(res, 400, { error: 'Missing id' });
      const session = mock.mockSessionData && mock.mockSessionData.sessionId === sessionId
        ? mock.mockSessionData
        : { sessionId, status: 'Unknown' };
      const logs = getUnifiedLogsBySession(sessionId);
      const lastTimestamps = {};
      for (const e of logs) {
        lastTimestamps[e.component] = e.timestamp;
      }
      return sendJSON(res, 200, {
        session,
        components: mock.components || [],
        logs,
        lastTimestamps
      });
    }
    if (req.method === 'GET' && req.url === '/api/config') {
      return sendJSON(res, 200, {
        title: 'Diro Session Crash Troubleshooting',
        components: mock.components || []
      });
    }
    res.writeHead(404);
    return res.end('Not found');
  }

  // Serve static files
  serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`[server] Listening on http://localhost:${PORT}`);
  console.log(`[auth] BASIC_AUTH_USER=${AUTH_USER}`);
  console.log(`[auth] BASIC_AUTH_PASS=${AUTH_PASS}`);
});

