import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { URL } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '0.0.0.0';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

const sendJson = (res, status, payload) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
};

const securityHeaders = (res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
};

const readBody = (req) => new Promise((resolve, reject) => {
  let body = '';
  req.setEncoding('utf8');
  req.on('data', chunk => {
    body += chunk;
    if (body.length > 2_000_000) {
      reject(new Error('Request body is too large.'));
      req.destroy();
    }
  });
  req.on('end', () => {
    if (!body) return resolve({});
    try { resolve(JSON.parse(body)); }
    catch { reject(new Error('Invalid JSON request.')); }
  });
  req.on('error', reject);
});

const createVercelResponse = (res) => {
  const wrapper = {
    status(code) {
      res.statusCode = code;
      return wrapper;
    },
    setHeader(name, value) {
      res.setHeader(name, value);
      return wrapper;
    },
    json(payload) {
      if (!res.headersSent) res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify(payload));
      return wrapper;
    }
  };
  return wrapper;
};

let serverHandler;
let cronHandler;

async function loadHandlers() {
  if (!serverHandler) ({ default: serverHandler } = await import('./api/server.js'));
  if (!cronHandler) ({ default: cronHandler } = await import('./api/cron/[job].js'));
}

async function handleApi(req, res, url) {
  await loadHandlers();

  if (url.pathname === '/api/server') {
    const body = await readBody(req);
    const apiReq = {
      ...req,
      method: req.method,
      body,
      query: Object.fromEntries(url.searchParams),
      headers: req.headers,
    };
    await serverHandler(apiReq, createVercelResponse(res));
    return true;
  }

  if (url.pathname.startsWith('/api/cron/')) {
    const job = url.pathname.slice('/api/cron/'.length);
    const apiReq = {
      ...req,
      method: req.method,
      body: {},
      query: { job },
      headers: req.headers,
    };
    await cronHandler(apiReq, createVercelResponse(res));
    return true;
  }

  return false;
}

async function serveStatic(req, res, url) {
  let requestPath = decodeURIComponent(url.pathname);
  if (requestPath === '/') requestPath = '/index.html';
  if (requestPath.includes('..')) return sendJson(res, 400, { success: false, message: 'Invalid path.' });

  const filePath = path.join(ROOT, requestPath);
  try {
    const info = await stat(filePath);
    if (!info.isFile()) return sendJson(res, 404, { success: false, message: 'Not found.' });

    const ext = path.extname(filePath).toLowerCase();
    res.statusCode = 200;
    res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream');
    res.setHeader('Cache-Control', requestPath.startsWith('/assets/') ? 'public, max-age=0, must-revalidate' : 'public, max-age=3600');
    res.end(await readFile(filePath));
  } catch {
    if (!path.extname(requestPath)) {
      try {
        res.statusCode = 200;
        res.setHeader('Content-Type', MIME['.html']);
        res.end(await readFile(path.join(ROOT, 'index.html')));
        return;
      } catch {}
    }
    sendJson(res, 404, { success: false, message: 'Not found.' });
  }
}

const server = http.createServer(async (req, res) => {
  securityHeaders(res);

  try {
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

    if (url.pathname.startsWith('/api/')) {
      const handled = await handleApi(req, res, url);
      if (!handled) sendJson(res, 404, { success: false, message: 'API route not found.' });
      return;
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      sendJson(res, 405, { success: false, message: 'Method not allowed.' });
      return;
    }

    if (req.method === 'HEAD') {
      const originalEnd = res.end.bind(res);
      res.end = () => originalEnd();
    }

    await serveStatic(req, res, url);
  } catch (error) {
    console.error('Brightlife server error:', error);
    if (!res.headersSent) sendJson(res, 500, { success: false, message: 'Internal server error.' });
    else res.end();
  }
});

server.listen(PORT, HOST, () => {
  console.log(`SND Brightlife running at http://localhost:${PORT}`);
});
