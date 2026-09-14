// Zero-dependency dev server with live reload.
//   node dev-server.mjs      →  http://localhost:3000
// Edit index.html and the browser refreshes on save. No npm install needed.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const PORT = Number(process.env.PORT || 3000);

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.mp4': 'video/mp4',
  '.webm': 'video/webm', '.json': 'application/json', '.ico': 'image/x-icon',
};

// Browsers ask for byte ranges when scrubbing video; honour them.
function sendFile(req, res, file) {
  const stat = fs.statSync(file);
  const type = TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream';
  const range = req.headers.range;
  if (range) {
    const m = /bytes=(\d*)-(\d*)/.exec(range);
    const start = m[1] ? Number(m[1]) : 0;
    const end = m[2] ? Number(m[2]) : stat.size - 1;
    res.writeHead(206, {
      'Content-Type': type, 'Accept-Ranges': 'bytes',
      'Content-Range': `bytes ${start}-${end}/${stat.size}`,
      'Content-Length': end - start + 1,
    });
    return fs.createReadStream(file, { start, end }).pipe(res);
  }
  res.writeHead(200, { 'Content-Type': type, 'Content-Length': stat.size, 'Cache-Control': 'no-store', 'Accept-Ranges': 'bytes' });
  fs.createReadStream(file).pipe(res);
}

const RELOAD = `<script>
new EventSource('/__reload').onmessage = () => location.reload();
</script>`;

const clients = new Set();

const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);

  if (url === '/__reload') {
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
    res.write('\n');
    clients.add(res);
    req.on('close', () => clients.delete(res));
    return;
  }

  const rel = url === '/' ? 'index.html' : url.replace(/^\/+/, '');
  const file = path.join(ROOT, rel);
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end('Not found: ' + rel);
  }

  if (file.endsWith('.html')) {
    const html = fs.readFileSync(file, 'utf8').replace('</body>', RELOAD + '</body>');
    res.writeHead(200, { 'Content-Type': TYPES['.html'], 'Cache-Control': 'no-store' });
    return res.end(html);
  }
  sendFile(req, res, file);
});

let timer = null;
fs.watch(ROOT, { recursive: true }, (_e, name) => {
  if (!name || name.includes('.git') || name.endsWith('~')) return;
  clearTimeout(timer);
  timer = setTimeout(() => {
    for (const c of clients) c.write('data: reload\n\n');
  }, 120);
});

server.listen(PORT, () => {
  console.log(`\n  E3 homepage draft → http://localhost:${PORT}\n  Editing index.html reloads the browser automatically.\n  Ctrl+C to stop.\n`);
});
