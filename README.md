# 📡 SocialPulse — Social Media Monitoring Dashboard

Dashboard monitoring sosial media real-time dengan backend Express + SQLite.
Menampilkan statistik mentions, sentimen, trending topics, dan viral posts dari berbagai platform (X, Instagram, TikTok, YouTube, Facebook, Threads).

## ✨ Fitur

- 📊 **Live Dashboard** — statistik real-time via SSE (Server-Sent Events)
- 🔥 **Trending Topics** — topik yang sedang viral dengan persentase pertumbuhan
- ⚡ **Viral Posts & Alerts** — postingan viral lintas platform dengan sentimen
- 🤖 **AI Insights** — rekomendasi konten & analisis sentimen
- 🌓 **Dark/Light Mode** — toggle tema
- 🗓️ **Calendar & Schedule** — jadwal harian
- 📈 **Chart.js** — visualisasi distribusi platform & volume mention
- 🗄️ **SQLite** — penyimpanan lokal via `node:sqlite` (tanpa kompilasi native)

## 🛠️ Teknologi

| Layer    | Teknologi                                   |
|----------|---------------------------------------------|
| Frontend | HTML5, CSS3, Vanilla JS, Chart.js 4.4.1     |
| Backend  | Node.js ≥ 22.5, Express 4                   |
| Database | SQLite (`node:sqlite` bawaan Node.js)       |
| Realtime | SSE (`/api/stream`)                         |

## 📁 Struktur Folder

```
dashboard-media-monitor/
├── social-dashboard.html   # Halaman dashboard utama
├── style.css               # Styling (light & dark theme)
├── script.js               # Logika frontend + integrasi SSE/API
├── .gitignore
├── README.md
└── server/
    ├── server.js           # Entry point Express + REST + SSE
    ├── db.js               # Skema SQLite + seed data awal
    ├── mock.js             # Generator data mock (simulasi polling API)
    └── package.json
```

## 🚀 Menjalankan

```bash
# 1. Install dependency
cd server
npm install

# 2. Jalankan server (mode development = auto-restart)
npm run dev

# atau mode production
npm start
```

Server berjalan di **http://localhost:3000**:

| Endpoint              | Deskripsi                          |
|-----------------------|------------------------------------|
| `/social-dashboard.html` | Dashboard utama                |
| `/api/stats`          | Snapshot data (REST)               |
| `/api/stream`         | Aliran data real-time (SSE)        |

## 🌐 GitHub Pages (pratinjau statis)

Dashboard juga bisa dilihat di **GitHub Pages** tanpa backend (mode simulasi lokal di `script.js`):

```
https://jpXproject.github.io/dashboard-media-monitor/
```

- Halaman utama `index.html` mengarahkan ke `social-dashboard.html`.
- Data statistik di Pages menggunakan **simulasi lokal** (angka mentions naik otomatis); SSE realtime hanya aktif saat dijalankan lewat server lokal (`localhost`).

## 🧪 Catatan Data

- Data di-generate secara mock oleh `server/mock.js` dengan simulasi polling setiap ±30 detik.
- File database `server/socialpulse.db` dibuat otomatis saat pertama kali server dijalankan (tidak perlu di-commit).
- Untuk integrasi data asli, ganti panggilan di `mock.js` dengan fetch ke platform API sungguhan.

## 🗂️ Endpoint API

### `GET /api/stats`
Mengembalikan snapshot lengkap: total mentions, stats, platforms, trending, viral.

### `GET /api/stream`
Server-Sent Events — mengirim update data setiap 30 detik.
