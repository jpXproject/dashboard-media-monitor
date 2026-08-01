// db.js — SQLite via node:sqlite (tanpa kompilasi native)
import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new DatabaseSync(path.join(__dirname, 'socialpulse.db'));

// ── SKEMA ──
export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS stats (
      id INTEGER PRIMARY KEY,
      label TEXT NOT NULL,
      value TEXT NOT NULL,
      change_text TEXT NOT NULL,
      change_class TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS platforms (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      icon TEXT NOT NULL,
      count TEXT NOT NULL,
      change_text TEXT NOT NULL,
      change_class TEXT NOT NULL,
      bar_pct INTEGER NOT NULL,
      bar_gradient TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS trending (
      id INTEGER PRIMARY KEY,
      rank INTEGER NOT NULL,
      tag TEXT NOT NULL,
      count_text TEXT NOT NULL,
      time_ago TEXT NOT NULL,
      platform_icon TEXT NOT NULL,
      change_text TEXT NOT NULL,
      change_class TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS viral (
      id INTEGER PRIMARY KEY,
      avatar_letter TEXT NOT NULL,
      avatar_gradient TEXT NOT NULL,
      name TEXT NOT NULL,
      handle TEXT NOT NULL,
      platform_icon TEXT NOT NULL,
      content TEXT NOT NULL,
      m1 TEXT NOT NULL,
      m2 TEXT NOT NULL,
      sentiment_class TEXT NOT NULL,
      sentiment_text TEXT NOT NULL,
      time_ago TEXT NOT NULL
    );
  `);

  const { c } = db.prepare('SELECT COUNT(*) AS c FROM stats').get();
  if (c === 0) seed();
}

// Pastikan skema & seed siap SEBELUM statement prepare di bawah dijalankan
initDb();

// ── SEED (data awal sama dengan yang tampil di dashboard) ──
function seed() {
  const insStat = db.prepare('INSERT INTO stats (label, value, change_text, change_class) VALUES (?,?,?,?)');
  [
    ['Total Mentions', '12.8k', '▲ 18.3%', 'up'],
    ['Engagement Rate', '4.5%', '▲ 2.1%', 'up'],
    ['Trending Topics Aktif', '24+', '▲ 6', 'up'],
    ['Skor Sentimen Positif', '85%', '▼ 1.2%', 'down']
  ].forEach(r => insStat.run(...r));

  const insPlat = db.prepare('INSERT INTO platforms (name, icon, count, change_text, change_class, bar_pct, bar_gradient) VALUES (?,?,?,?,?,?,?)');
  [
    ['Facebook', '📘', '3.2k', '▲ 12%', 'up', 68, 'linear-gradient(90deg,#1877f2,#42a5f5)'],
    ['X (Twitter)', '✖️', '4.8k', '▲ 31%', 'up', 85, 'linear-gradient(90deg,#14171a,#657786)'],
    ['Instagram', '📸', '5.1k', '▲ 25%', 'up', 90, 'linear-gradient(90deg,#e1306c,#f77737)'],
    ['Threads', '🧵', '1.4k', '▲ 8%', 'up', 32, 'linear-gradient(90deg,#000,#444)'],
    ['TikTok', '🎵', '6.7k', '▲ 44%', 'up', 95, 'linear-gradient(90deg,#010101,#fe2c55)'],
    ['YouTube', '▶️', '2.9k', '▼ 3%', 'down', 55, 'linear-gradient(90deg,#ff0000,#ff6b6b)']
  ].forEach(r => insPlat.run(...r));

  const insTrend = db.prepare('INSERT INTO trending (rank, tag, count_text, time_ago, platform_icon, change_text, change_class) VALUES (?,?,?,?,?,?,?)');
  [
    [1, '#PemiluDaerah2026', '580,000 cuitan', '2 jam lalu', '✖️', '▲ 234%', 'up'],
    [2, '#MusicFest2026', '1.2jt post', '5 jam lalu', '📸', '▲ 180%', 'up'],
    [3, '#BudgetNasional', '890k views', '4 jam lalu', '🎵', '▲ 156%', 'up'],
    [4, '#OpenAI2026', '430k komentar', '1 jam lalu', '▶️', '▲ 98%', 'up'],
    [5, '#RupiaDigital', '215k diskusi', '3 jam lalu', '🧵', '▲ 73%', 'up'],
    [6, '#GempaJakarta', '1.8jt reaksi', '30 mnt lalu', '📘', '▲ 512%', 'up']
  ].forEach(r => insTrend.run(...r));

  const insViral = db.prepare('INSERT INTO viral (avatar_letter, avatar_gradient, name, handle, platform_icon, content, m1, m2, sentiment_class, sentiment_text, time_ago) VALUES (?,?,?,?,?,?,?,?,?,?,?)');
  [
    ['B', 'linear-gradient(135deg,#7c3aed,#ec4899)', '@beritaviralid', 'instagram.com', '📸',
      'Festival musik terbesar tahun ini buka pendaftaran! 50+ artis lokal dan internasional siap memukau penonton. Daftarkan diri sebelum kehabisan…',
      '❤️ 48.2k', '💬 3.1k', 's-positive', '😊 Positif', '14 mnt lalu'],
    ['T', 'linear-gradient(135deg,#06b6d4,#3b82f6)', '@techreviewid', 'tiktok.com', '🎵',
      'Review jujur smartphone terbaru yang BIKIN SYOK! Spek dewa, harga anak kost. Gak nyangka bisa sebagus ini. Langsung trending #1…',
      '❤️ 234k', '💬 12k', 's-positive', '😊 Positif', '32 mnt lalu'],
    ['P', 'linear-gradient(135deg,#f59e0b,#ef4444)', '@politikpanas', 'twitter.com', '✖️',
      '🚨 BREAKING: Hasil survei terbaru pilkada menunjukkan pergeseran signifikan. Kandidat incumbent tertinggal 8 poin. Thread lengkap di bawah…',
      '❤️ 18.7k', '💬 8.4k', 's-neutral', '😐 Netral', '1 jam lalu'],
    ['Y', 'linear-gradient(135deg,#10b981,#3b82f6)', '@ytcreatorid', 'youtube.com', '▶️',
      'AI bisa buat musik sendiri sekarang?! Gue test 5 platform AI musik terbaru — hasilnya bikin geleng kepala. Nonton sampai habis ya…',
      '👁️ 1.2jt', '💬 4.8k', 's-positive', '😊 Positif', '2 jam lalu'],
    ['K', 'linear-gradient(135deg,#ef4444,#f97316)', '@kabargempa', 'threads.net', '🧵',
      '⚠️ ALERT: Gempa M5.2 mengguncang NTB pukul 14:32 WIB. BMKG: tidak berpotensi tsunami. Warga diminta tetap tenang dan waspada…',
      '❤️ 9.2k', '💬 2.1k', 's-negative', '😟 Negatif', '28 mnt lalu'],
    ['F', 'linear-gradient(135deg,#1877f2,#0d65c8)', '@foodieindonesia', 'facebook.com', '📘',
      'Kuliner nusantara masuk daftar 50 makanan terbaik dunia versi CNN Travel! Rendang, sate, dan nasi goreng makin mendunia! Bangga jadi orang Indonesia…',
      '❤️ 87k', '💬 6.3k', 's-positive', '😊 Positif', '3 jam lalu']
  ].forEach(r => insViral.run(...r));
}

// ── BACA ──
export function getStats() { return db.prepare('SELECT * FROM stats ORDER BY id').all(); }
export function getPlatforms() { return db.prepare('SELECT * FROM platforms ORDER BY id').all(); }
export function getTrending() { return db.prepare('SELECT * FROM trending ORDER BY rank').all(); }
export function getViral() { return db.prepare('SELECT * FROM viral ORDER BY id').all(); }

export function getTotalMentions() {
  const v = db.prepare("SELECT value FROM stats WHERE id = 1").get();
  return v ? parseFloat(v.value.replace(/[^0-9.]/g, '')) * 1000 : 12800;
}

// ── TULIS (update oleh mock generator) ──
export const updateStatValue = db.prepare('UPDATE stats SET value = ?, change_text = ?, change_class = ? WHERE id = ?');
export const updatePlat = db.prepare('UPDATE platforms SET count = ?, change_text = ?, change_class = ?, bar_pct = ? WHERE id = ?');
export const updateTrend = db.prepare('UPDATE trending SET count_text = ?, change_text = ?, change_class = ? WHERE id = ?');
export const updateViralMeta = db.prepare('UPDATE viral SET m1 = ?, m2 = ?, time_ago = ? WHERE id = ?');

export function snapshot() {
  return {
    totalMentions: getTotalMentions(),
    stats: getStats(),
    platforms: getPlatforms(),
    trending: getTrending(),
    viral: getViral()
  };
}
