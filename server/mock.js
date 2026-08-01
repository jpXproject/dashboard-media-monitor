// mock.js — generator data mock realistis (simulasi polling platform API tiap 30-60 detik)
// Di masa depan: ganti panggilan ini dengan fetch ke platform API sungguhan.
import { getTrending, getViral, getStats, getPlatforms, getTotalMentions,
         updateStatValue, updatePlat, updateTrend, updateViralMeta } from './db.js';

const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Format angka singkat: 12873 -> "12.9k", 1840000 -> "1.8jt"
export function fmtShort(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'jt';
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(n);
}

const trendBoosts = ['▲ 12%', '▲ 34%', '▲ 78%', '▲ 145%', '▲ 210%', '▲ 330%', '▲ 512%', '▲ 89%', '▲ 156%', '▲ 180%'];
const timeAgo = ['5 mnt lalu', '12 mnt lalu', '28 mnt lalu', '45 mnt lalu', '1 jam lalu', '2 jam lalu', '3 jam lalu', '5 jam lalu', '7 jam lalu'];
const viralTimes = ['3 mnt lalu', '8 mnt lalu', '17 mnt lalu', '26 mnt lalu', '38 mnt lalu', '52 mnt lalu', '1 jam lalu', '2 jam lalu'];

// Satu siklus "polling": update angka-angka di DB, lalu kembalikan snapshot baru
export function runPollCycle() {
  // 1) Stats: nilai naik perlahan
  const stats = getStats();
  const mentionVal = 12800 + rnd(200, 1600); // 12.8k..14.4k
  updateStatValue.run(fmtShort(mentionVal), '▲ ' + (15 + rnd(1, 8)).toFixed(1) + '%', 'up', 1);

  const engRate = 4.5 + Math.random() * 1.2;
  updateStatValue.run(engRate.toFixed(1) + '%', '▲ ' + (1 + Math.random() * 3).toFixed(1) + '%', 'up', 2);

  const trends = 24 + rnd(0, 3);
  updateStatValue.run(trends + '+', '▲ ' + rnd(4, 9), 'up', 3);

  const senti = 84 + rnd(0, 3);
  updateStatValue.run(senti + '%', (Math.random() < 0.5 ? '▲ ' : '▼ ') + (0.5 + Math.random() * 1.5).toFixed(1) + '%',
    Math.random() < 0.5 ? 'up' : 'down', 4);

  // 2) Platform: count & bar naik-turun ringan
  const plats = getPlatforms();
  plats.forEach(p => {
    const base = parseFloat(p.count.replace('k', '')) || 3;
    const delta = base * (0.8 + Math.random() * 1.5) / 100; // pertumbuhan 0.8-2.3%
    const nv = base + delta;
    const up = Math.random() < 0.78;
    const chg = (up ? '▲ ' : '▼ ') + rnd(2, 48) + '%';
    const bar = Math.min(98, Math.max(18, Math.round((p.bar_pct || 50) + (Math.random() * 6 - 3))));
    updatePlat.run(fmtShort(nv * 1000), chg, up ? 'up' : 'down', bar, p.id);
  });

  // 3) Trending: update count & boost
  const trending = getTrending();
  trending.forEach(t => {
    const mul = 1 + Math.random() * 0.5;
    const parts = t.count_text.split(' ');
    const raw = parseFloat(parts[0].replace(/[^0-9.]/g, ''));
    const unit = parts[0].includes('jt') ? 1000000 : parts[0].includes('k') ? 1000 : 1;
    const nv = raw * unit * mul;
    const countText = fmtShort(nv) + (parts[0].includes('cuitan') ? ' cuitan' : parts[0].includes('post') ? ' post' : parts[0].includes('views') ? ' views' : parts[0].includes('komentar') ? ' komentar' : parts[0].includes('reaksi') ? ' reaksi' : ' diskusi');
    updateTrend.run(countText, pick(trendBoosts), 'up', t.id);
  });

  // 4) Viral: update engagement & waktu
  const viral = getViral();
  viral.forEach(v => {
    const m1 = v.m1.split(' ');
    const num = parseFloat(m1[1].replace(/[^0-9.]/g, ''));
    const unit = m1[1].includes('jt') ? 1000000 : m1[1].includes('k') ? 1000 : 1;
    const nv = num * unit * (1 + Math.random() * 0.12);
    const m2 = v.m2.split(' ');
    const num2 = parseFloat(m2[1].replace(/[^0-9.]/g, ''));
    const unit2 = m2[1].includes('jt') ? 1000000 : m2[1].includes('k') ? 1000 : 1;
    const nv2 = num2 * unit2 * (1 + Math.random() * 0.15);
    updateViralMeta.run(m1[0] + ' ' + fmtShort(nv), m2[0] + ' ' + fmtShort(nv2), pick(viralTimes), v.id);
  });

  // Total mentions untuk banner (dari stats terbaru)
  const s1 = stats[0];
  const totalMentions = parseFloat(s1.value.replace(/[^0-9.]/g, '')) * 1000;

  return { totalMentions };
}
