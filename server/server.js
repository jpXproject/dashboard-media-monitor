// server.js — Express: serve dashboard statis + REST /api/stats + SSE /api/stream
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initDb, snapshot } from './db.js';
import { runPollCycle } from './mock.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;
const POLL_MS = 30000; // polling "platform API" tiap 30 detik (sesuai arsitektur)

initDb();

const app = express();
app.use(express.json());

// Serve dashboard statis dari folder induk (satu origin → tidak ada masalah CORS)
app.use(express.static(path.join(__dirname, '..')));

// REST: snapshot awal
app.get('/api/stats', (req, res) => {
  runPollCycle();
  res.json(snapshot());
});

// SSE: aliran realtime
app.get('/api/stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no'
  });
  res.write('retry: 5000\n\n');

  // Kirim snapshot awal, lalu update tiap interval
  const send = () => {
    runPollCycle();
    const data = snapshot();
    res.write(`event: update\ndata: ${JSON.stringify(data)}\n\n`);
  };
  send();

  const pollTimer = setInterval(send, POLL_MS);
  const beatTimer = setInterval(() => res.write(': ping\n\n'), 15000); // keep-alive

  req.on('close', () => {
    clearInterval(pollTimer);
    clearInterval(beatTimer);
    res.end();
  });
});

app.listen(PORT, () => {
  console.log(`🚀 SocialPulse server berjalan di http://localhost:${PORT}`);
  console.log(`   Dashboard:  http://localhost:${PORT}/social-dashboard.html`);
  console.log(`   REST:       http://localhost:${PORT}/api/stats`);
  console.log(`   SSE:        http://localhost:${PORT}/api/stream`);
});
