// Minimal static server for the built Vite app.
// Databricks Apps passes the port via DATABRICKS_APP_PORT.
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, 'dist');
const port = Number(process.env.DATABRICKS_APP_PORT || process.env.PORT || 8000);

const app = express();

app.get('/healthz', (_req, res) => res.status(200).send('ok'));

app.use(
  express.static(distDir, {
    maxAge: '1h',
    index: 'index.html',
    extensions: ['html'],
  }),
);

// SPA fallback — serve index.html for any unmatched route so deep links
// like /?slide=5 work.
app.get('*', (_req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`[slides] listening on 0.0.0.0:${port} (serving ${distDir})`);
});
