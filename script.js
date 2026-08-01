
// ── THEME ──
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.dataset.theme === 'dark';
  html.dataset.theme = isDark ? 'light' : 'dark';
  document.getElementById('toggleThumb').textContent = isDark ? '☀️' : '🌙';
  updateCharts();
}

// ── SIDEBAR NAV ──
function setNav(el) {
  if (el.classList.contains('disabled')) return;
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  el.classList.add('active');
  const target = el.getAttribute('data-target');
  if (target) {
    const sec = document.getElementById(target);
    if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  closeSidebar();
}
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('overlay').classList.toggle('show');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('show');
}

// ── GREETING ──
const h = new Date().getHours();
document.getElementById('dayPart').textContent =
  h < 12 ? 'Selamat pagi' : h < 15 ? 'Selamat siang' : h < 18 ? 'Selamat sore' : 'Selamat malam';

// ── MINI BAR CHARTS ──
function makeBars(id, vals, col) {
  const el = document.getElementById(id);
  const max = Math.max(...vals);
  vals.forEach(v => {
    const bar = document.createElement('div');
    bar.className = 'mbc';
    bar.style.height = (v / max * 100) + '%';
    bar.style.background = col;
    bar.style.flex = '1';
    el.appendChild(bar);
  });
}
makeBars('bar1', [60,72,58,90,85,78,95], 'linear-gradient(to top,#7c3aed,#a78bfa)');
makeBars('bar2', [40,55,48,62,58,70,65], 'linear-gradient(to top,#ec4899,#f9a8d4)');
makeBars('bar3', [18,24,14,20,22,19,24], 'linear-gradient(to top,#06b6d4,#67e8f9)');
makeBars('bar4', [80,83,79,87,85,88,85], 'linear-gradient(to top,#10b981,#6ee7b7)');

// ── CALENDAR ──
let calDate = new Date();
function buildCalendar() {
  const months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  const days = ['Min','Sen','Sel','Rab','Kam','Jum','Sab'];
  document.getElementById('calMonth').textContent = months[calDate.getMonth()] + ' ' + calDate.getFullYear();
  const grid = document.getElementById('calGrid');
  grid.innerHTML = '';
  days.forEach(d => {
    const el = document.createElement('div');
    el.className = 'cal-day-name'; el.textContent = d;
    grid.appendChild(el);
  });
  const first = new Date(calDate.getFullYear(), calDate.getMonth(), 1);
  const lastDay = new Date(calDate.getFullYear(), calDate.getMonth()+1, 0).getDate();
  const today = new Date();
  const events = [2,5,10,14,18,22,28];
  // pad
  for (let i = 0; i < first.getDay(); i++) {
    const el = document.createElement('div');
    el.className = 'cal-day other-month';
    const prev = new Date(calDate.getFullYear(), calDate.getMonth(), -first.getDay()+i+1);
    el.textContent = prev.getDate() + first.getDay() - i -1 + 1;
    grid.appendChild(el);
  }
  for (let d = 1; d <= lastDay; d++) {
    const el = document.createElement('div');
    el.className = 'cal-day';
    if (d === today.getDate() && calDate.getMonth() === today.getMonth() && calDate.getFullYear() === today.getFullYear())
      el.classList.add('today');
    if (events.includes(d)) el.classList.add('has-event');
    el.textContent = d;
    grid.appendChild(el);
  }
}
function changeMonth(dir) { calDate = new Date(calDate.getFullYear(), calDate.getMonth()+dir, 1); buildCalendar(); }
buildCalendar();

// ── CHARTS ──
const platformColors = ['#7c3aed','#ec4899','#06b6d4','#10b981','#f59e0b','#ef4444'];
const platformLabels = ['TikTok','Instagram','X (Twitter)','YouTube','Facebook','Threads'];
const platformData = [30,25,20,12,9,4];
// ── PERIOD DATA LINE CHART (7H / 30H / 90H) ──
let currentPeriod = '7H';
const periodData = {
  '7H': {
    label: '7 hari terakhir',
    sub: 'Performa 7 hari terakhir per platform',
    labels: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'],
    series: [
      { label: 'TikTok',      data: [3200,4100,3800,5200,4700,6100,6700] },
      { label: 'Instagram',   data: [2800,3200,3600,4100,3900,4800,5100] },
      { label: 'X / Twitter', data: [3500,3800,3200,4600,4200,4900,4800] }
    ]
  },
  '30H': {
    label: '30 hari terakhir',
    sub: 'Performa 30 hari terakhir per platform',
    labels: ['H1','H3','H5','H7','H9','H11','H13','H15','H17','H19','H21','H23','H25','H27','H29','H30'],
    series: [
      { label: 'TikTok',      data: [2100,2400,2700,2900,3200,3400,3700,4100,4400,4700,5100,5400,5800,6200,6500,6700] },
      { label: 'Instagram',   data: [1800,2100,2300,2600,2800,3100,3400,3600,3900,4100,4400,4600,4900,5100,5400,5600] },
      { label: 'X / Twitter', data: [2400,2600,2900,3100,3300,3600,3800,4100,4300,4600,4800,5100,5300,5500,5700,5900] }
    ]
  },
  '90H': {
    label: '90 hari terakhir',
    sub: 'Performa 90 hari terakhir per platform',
    labels: ['M1','M2','M3','M4','M5','M6','M7','M8','M9','M10','M11','M12'],
    series: [
      { label: 'TikTok',      data: [1500,1800,2100,2400,2800,3100,3600,4100,4700,5400,6100,6700] },
      { label: 'Instagram',   data: [1200,1500,1800,2100,2400,2800,3200,3700,4200,4700,5200,5600] },
      { label: 'X / Twitter', data: [1800,2000,2300,2600,2900,3300,3700,4200,4700,5200,5600,5900] }
    ]
  }
};

let donutChart, lineChart;

function getCSS(v) { return getComputedStyle(document.documentElement).getPropertyValue(v).trim(); }

function initCharts() {
  const isDark = document.documentElement.dataset.theme === 'dark';
  const textColor = isDark ? '#ede8ff' : '#1a1228';
  const gridColor = isDark ? 'rgba(160,130,220,0.10)' : 'rgba(160,130,220,0.15)';

  // DONUT
  const dctx = document.getElementById('donutChart').getContext('2d');
  if (donutChart) donutChart.destroy();
  donutChart = new Chart(dctx, {
    type: 'doughnut',
    data: {
      labels: platformLabels,
      datasets: [{
        data: platformData,
        backgroundColor: platformColors,
        borderColor: isDark ? '#1c1530' : '#fff',
        borderWidth: 3,
        hoverOffset: 8
      }]
    },
    options: {
      cutout: '68%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.label}: ${ctx.parsed}%`
          }
        }
      }
    }
  });

  // Legend
  const legend = document.getElementById('donutLegend');
  legend.innerHTML = platformLabels.map((l,i) =>
    `<div class="legend-item"><div class="legend-dot" style="background:${platformColors[i]}"></div>${l} ${platformData[i]}%</div>`
  ).join('');

  // LINE CHART
  const lctx = document.getElementById('lineChart').getContext('2d');
  if (lineChart) lineChart.destroy();

  const gradPurple = lctx.createLinearGradient(0,0,0,200);
  gradPurple.addColorStop(0,'rgba(124,58,237,0.3)');
  gradPurple.addColorStop(1,'rgba(124,58,237,0)');
  const gradPink = lctx.createLinearGradient(0,0,0,200);
  gradPink.addColorStop(0,'rgba(236,72,153,0.25)');
  gradPink.addColorStop(1,'rgba(236,72,153,0)');
  const gradCyan = lctx.createLinearGradient(0,0,0,200);
  gradCyan.addColorStop(0,'rgba(6,182,212,0.2)');
  gradCyan.addColorStop(1,'rgba(6,182,212,0)');

  lineChart = new Chart(lctx, {
    type: 'line',
    data: {
      labels: periodData[currentPeriod].labels,
      datasets: periodData[currentPeriod].series.map((s, i) => ({
        label: s.label,
        data: s.data,
        borderColor: ['#7c3aed','#ec4899','#06b6d4'][i],
        backgroundColor: [gradPurple, gradPink, gradCyan][i],
        fill: true, tension: 0.45, borderWidth: 2.5,
        pointBackgroundColor: ['#7c3aed','#ec4899','#06b6d4'][i],
        pointRadius: i === 2 ? 3 : 4, pointHoverRadius: i === 2 ? 5 : 6
      }))
    },
    options: {
      responsive: true,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          labels: { color: textColor, font: { family: 'Inter', size: 11 }, usePointStyle: true, pointStyleWidth: 8 }
        },
        tooltip: { backgroundColor: isDark ? '#1c1530' : '#fff', titleColor: textColor, bodyColor: isDark ? '#a99dc4' : '#6b5e85', borderColor: isDark ? 'rgba(124,58,237,0.3)' : 'rgba(124,58,237,0.2)', borderWidth: 1 }
      },
      scales: {
        x: { grid: { color: gridColor }, ticks: { color: isDark ? '#6a5f84' : '#a394bb', font: { size: 11 } } },
        y: { grid: { color: gridColor }, ticks: { color: isDark ? '#6a5f84' : '#a394bb', font: { size: 11 } } }
      }
    }
  });
}

function updateCharts() {
  setTimeout(initCharts, 50);
}

initCharts();

// ── PERIOD BUTTONS ──
function applyPeriod(period) {
  if (!periodData[period] || !lineChart) return;
  currentPeriod = period;
  lineChart.data.labels = periodData[period].labels;
  periodData[period].series.forEach((s, i) => {
    if (lineChart.data.datasets[i]) lineChart.data.datasets[i].data = s.data;
  });
  lineChart.update();
  const sub = document.getElementById('lineChartSub');
  if (sub) sub.textContent = periodData[period].sub;
}

document.querySelectorAll('.period-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    applyPeriod(this.textContent.trim());
  });
});

// ── LIVE COUNTER (simulate) ──
let mc = 12847;
let localSimTimer = null;
window.stopLocalSim = function () {
  if (localSimTimer) { clearInterval(localSimTimer); localSimTimer = null; }
};
localSimTimer = setInterval(() => {
  mc += Math.floor(Math.random() * 12) + 1;
  const el = document.getElementById('mcount');
  if (el) el.textContent = mc.toLocaleString('id-ID');
}, 3000);

// ── SEARCH FILTER (live) ──
(function initSearch() {
  const input = document.getElementById('searchInput');
  if (!input) return;

  // Pesan saat tidak ada hasil (dibuat sekali, ditaruh di akhir main)
  const main = document.querySelector('.main');
  let empty = document.getElementById('searchEmpty');
  if (!empty && main) {
    empty = document.createElement('div');
    empty.id = 'searchEmpty';
    empty.style.cssText = 'display:none;text-align:center;padding:30px 16px;color:var(--text2);font-size:13px;background:var(--surface);border:1px dashed var(--border);border-radius:var(--radius-md);';
    empty.textContent = 'Tidak ada hasil untuk pencarian ini. Coba kata kunci lain.';
    main.appendChild(empty);
  }

  function cardVisible(card) {
    return card.style.display !== 'none';
  }

  // Sembunyikan seluruh section bila semua kartunya tidak cocok
  function syncSections() {
    document.querySelectorAll('.trending-grid, .viral-grid, .platform-row').forEach((grid) => {
      const section = grid.parentElement;
      if (!section) return;
      const any = Array.prototype.some.call(
        grid.querySelectorAll('.trending-card, .viral-card, .plat-card'),
        cardVisible
      );
      section.style.display = any ? '' : 'none';
    });
  }

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    const cards = document.querySelectorAll('.trending-card, .viral-card, .plat-card');
    let visible = 0;
    cards.forEach((card) => {
      const match = card.textContent.toLowerCase().indexOf(q) !== -1;
      card.style.display = match ? '' : 'none';
      if (match) visible++;
    });
    if (empty) empty.style.display = (q && visible === 0) ? '' : 'none';
    syncSections();
  });
})();


// ── SSE REALTIME (backend) ──
(function initSSE() {
  // Hanya aktif saat di-serve oleh backend (http), bukan dibuka via file://
  if (!window.EventSource || location.protocol === 'file:') return;

  const src = new EventSource('/api/stream');
  let liveOn = false;

  function setStat(i, val, change, cls) {
    const card = document.querySelectorAll('.stat-card')[i];
    if (!card) return;
    const v = card.querySelector('.stat-val');
    const c = card.querySelector('.stat-change');
    if (v) v.textContent = val;
    if (c) { c.textContent = change; c.className = 'stat-change ' + cls; }
  }
  function setPlat(i, count, change, cls, bar) {
    const card = document.querySelectorAll('.plat-card')[i];
    if (!card) return;
    const c = card.querySelector('.plat-count');
    const ch = card.querySelector('.plat-change');
    const fill = card.querySelector('.plat-bar-fill');
    if (c) c.textContent = count;
    if (ch) { ch.textContent = change; ch.className = 'plat-change ' + cls; }
    if (fill) fill.style.width = (bar || 50) + '%';
  }
  function setTrend(i, count, change) {
    const card = document.querySelectorAll('.trending-card')[i];
    if (!card) return;
    const c = card.querySelector('.trend-count');
    const u = card.querySelector('.trend-up');
    if (c) c.textContent = count;
    if (u) { u.textContent = change; u.className = 'trend-up'; }
  }
  function setViral(i, m1, m2, time) {
    const card = document.querySelectorAll('.viral-card')[i];
    if (!card) return;
    const ms = card.querySelectorAll('.vc-metric');
    const t = card.querySelector('.vc-time');
    if (ms[0]) ms[0].textContent = m1;
    if (ms[1]) ms[1].textContent = m2;
    if (t) t.textContent = time;
  }

  src.addEventListener('update', (e) => {
    try {
      const d = JSON.parse(e.data);
      if (!liveOn) {
        liveOn = true;
        if (window.stopLocalSim) window.stopLocalSim(); // matikan simulasi lokal
      }
      const mc = document.getElementById('mcount');
      if (mc && d.totalMentions) mc.textContent = Math.round(d.totalMentions).toLocaleString('id-ID');
      if (d.stats) d.stats.forEach((s, i) => setStat(i, s.value, s.change_text, s.change_class));
      if (d.platforms) d.platforms.forEach((p, i) => setPlat(i, p.count, p.change_text, p.change_class, p.bar_pct));
      if (d.trending) d.trending.forEach((t, i) => setTrend(i, t.count_text + ' · ' + t.time_ago, t.change_text));
      if (d.viral) d.viral.forEach((v, i) => setViral(i, v.m1, v.m2, v.time_ago));
    } catch (err) { /* abaikan frame yang rusak */ }
  });
})();