// Zero-dependency static file server using Node stdlib only.
// Intentionally has no external deps — Databricks Apps runs this directly
// without `npm install`, which is unreachable from the Apps build env
// (see go/npm-registry-access · proxy not exposed to Apps builders).
//
// Serves ./dist (the Vite build output) with SPA fallback to index.html
// so deep links like /?slide=5 work. Binds to $DATABRICKS_APP_PORT.
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { join, dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, 'dist');
const port = Number(process.env.DATABRICKS_APP_PORT || process.env.PORT || 8000);

const MIME = {
  '.html':  'text/html; charset=utf-8',
  '.js':    'application/javascript; charset=utf-8',
  '.mjs':   'application/javascript; charset=utf-8',
  '.css':   'text/css; charset=utf-8',
  '.json':  'application/json; charset=utf-8',
  '.svg':   'image/svg+xml',
  '.png':   'image/png',
  '.jpg':   'image/jpeg',
  '.jpeg':  'image/jpeg',
  '.webp':  'image/webp',
  '.ico':   'image/x-icon',
  '.woff':  'font/woff',
  '.woff2': 'font/woff2',
  '.txt':   'text/plain; charset=utf-8',
  '.map':   'application/json; charset=utf-8',
};

async function resolveFile(urlPath) {
  const rel = urlPath.split('?')[0].split('#')[0];
  const requested = resolve(distDir, '.' + (rel === '/' ? '/index.html' : rel));
  // Safety: keep within dist/
  if (!requested.startsWith(distDir + sep) && requested !== distDir) return null;
  try {
    const s = await stat(requested);
    if (s.isDirectory()) return join(requested, 'index.html');
    return requested;
  } catch {
    return null;
  }
}

const server = createServer(async (req, res) => {
  const url = req.url || '/';

  if (url === '/healthz') {
    res.writeHead(200, { 'content-type': 'text/plain' });
    res.end('ok');
    return;
  }

  let file = await resolveFile(url);
  // SPA fallback
  if (!file) file = join(distDir, 'index.html');

  const type = MIME[extname(file).toLowerCase()] || 'application/octet-stream';
  res.writeHead(200, {
    'content-type': type,
    'cache-control': url === '/index.html' || url === '/' ? 'no-cache' : 'public, max-age=3600',
  });
  createReadStream(file)
    .on('error', () => {
      res.writeHead(500);
      res.end('internal error');
    })
    .pipe(res);
});

server.listen(port, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`[slides] listening on 0.0.0.0:${port} (serving ${distDir})`);
});
