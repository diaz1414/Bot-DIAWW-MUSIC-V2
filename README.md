# 🎵 DIAWW MUSIC - DEDICATED HIGH-FIDELITY DISCORD MUSIC BOT

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-Strict%20Mode-blue?logo=typescript)
![Runtime](https://img.shields.io/badge/Runtime-Bun%20%7C%20Node.js%20v22+-fbf0df?logo=bun)
![Discord.js](https://img.shields.io/badge/discord.js-v14.16.3-5865F2?logo=discord)
![Lavalink](https://img.shields.io/badge/Lavalink-v4%20Serenetia%20Failover-red)
![Database](https://img.shields.io/badge/SQLite-WAL%20Mode-003B57?logo=sqlite)
![License](https://img.shields.io/badge/License-MIT-green)

**DIAWW MUSIC** adalah Dedicated High-Fidelity Discord Music Bot modern yang dirancang dari nol menggunakan **TypeScript (Strict Mode)**, **discord.js v14**, **lavalink-client v2**, dan **SQLite** (WAL mode adaptif Bun/Node.js). Bot ini dibuat khusus untuk berjalan dengan performa maksimal dan latensi ultra-rendah pada **Pterodactyl Bun Egg** serta **Node.js v22+**.

</div>

---

## 🌟 FITUR UTAMA & KEUNGGULAN ARSITEKTUR

### 1. 🌐 Dukungan Multi-Platform (9+ Sumber Audio)
Ditenagai oleh node Lavalink v4 dengan plugin audio mutakhir (LavaSrc), bot ini mendukung pemutaran langsung dan pencarian dari:
- 🟢 **Spotify**: Lagu, Album, Playlist, Artis, stasiun radio artis (`spsearch:`).
- 🔴 **YouTube**: Video biasa, YouTube Shorts, Playlist, Live Streams (`ytsearch:`).
- 🔴 **YouTube Music**: Track & Mix album (`ytmsearch:`).
- 🍎 **Apple Music**: Lagu, Album, Playlist (`amsearch:`).
- 🟠 **SoundCloud**: Track, Sets, User Playlist (`scsearch:`).
- 💙 **Deezer**: Track, Album, Playlist, Artis lossless FLAC (`dzsearch:`).
- 🟡 **Yandex Music**: Track dan Album (`ymsearch:`).
- 📻 **HTTP Live Streaming**: Web Radio Shoutcast, Icecast, `.m3u`, `.pls`, `.m3u8`.
- 📁 **Direct HTTP Audio Files**: File audio publik langsung (`.mp3`, `.wav`, `.flac`, `.ogg`, `.m4a`, `.aac`).
- ✨ **Ekstra**: Twitch stream audio, Bandcamp, dan web audio lainnya.

### 2. 🧠 Smart Multi-Tier Search (Pencarian Cerdas Bertingkat)
- **Input Link URL**: Bot langsung mendeteksi domain dan memutar audio dari sumber aslinya.
- **Input Judul Teks (Mode Auto)**:
  1. Melakukan pencarian di **Spotify** (`spsearch:`) untuk metadata dan kualitas audio resmi.
  2. Jika tidak ditemukan atau gagal (misal lagu DJ remix/cover YouTube), otomatis fallback ke **YouTube** (`ytsearch:`).
  3. Jika masih tidak ada, fallback berturut-turut ke **Apple Music**, **Deezer**, **SoundCloud**, **YouTube Music**, dan **Yandex**.
- **Pilihan Platform Manual**: Pengguna dapat memilih platform secara eksplisit via Slash Command option (`platform: spotify / youtube / applemusic / deezer / soundcloud / yandex`).

### 3. 📻 Algoritma Autoplay Cerdas (Spotify Radio & YouTube Mix)
- **Anti-Repeat (Bukan Pengulangan Lagu yang Sama)**: Bot TIDAK AKAN mengulang lagu yang sama, remix slowed/reverb, atau video cover kembar dari lagu acuan.
- **Pencarian Berbasis Radio & Mix**: Mengambil artis utama dari lagu acuan lalu mencari stasiun radio resmi Spotify (`spsearch:[Artist] Radio`, `spsearch:[Artist] Mix`) dan YouTube Mix (`ytsearch:[Artist] Mix playlist`).
- **Penyaringan 50 Riwayat Terakhir (`played_history`)**: Mencatat hingga 50 lagu yang telah diputar dan membersihkan judul dari noise (*Official Video, Lyrics, HD, 4K, Remastered*) menggunakan algoritma similarity token untuk mencegah duplikasi.
- **Pre-Fetch & Tampil di `/queue`**: Lagu rekomendasi disiapkan lebih awal di latar belakang. Saat pengguna mengetik `/queue`, mereka dapat melihat pratinjau lagu yang akan diputar selanjutnya di bagian `📻 Rekomendasi Autoplay Berikutnya`.
- **Prioritas Permintaan Pengguna**: Jika ada pengguna yang meminta lagu manual via `/play`, antrean pengguna selalu diprioritaskan terlebih dahulu dan sistem Autoplay otomatis mengalibrasi ulang rekomendasinya.

### 4. 🎛️ UI/UX Bersih & Anti-Dobel (Single Now Playing Card)
- **Tanpa Pesan Dobel**: Saat lagu berganti atau Autoplay memutar lagu rekomendasi, bot **TIDAK MENGIRIM EMBED PEMBERITAHUAN TERPISAH**.
- **Kartu Kontrol Now Playing Terpadu**: Menampilkan kartu pemutar bertuliskan `📻 SEDANG DIPUTAR • AUTOPLAY REKOMENDASI` atau `🎵 SEDANG DIPUTAR` lengkap dengan:
  - Judul lagu dengan hyperlink aktif
  - Live Interactive Progress Bar `🔘▬▬▬▬▬▬▬▬▬▬ [01:23 / 03:45]`
  - Badge platform audio
  - Informasi durasi, requester, volume, loop, autoplay, dan status 24/7
  - Pratinjau lagu berikutnya
  - Cover album resolusi tinggi
- **Auto-Clean**: Saat lagu baru mulai diputar, kartu pesan Now Playing sebelumnya otomatis dihapus dari channel teks agar chat tidak menumpuk.
- **Stop Instan**: Tombol **⏹️ Stop** atau perintah stop langsung mengosongkan antrean, mematikan pemutar, disconnect seketika dari voice channel, dan menghapus pesan kartu pemutar.

### 5. 🔀 Sistem Perintah Ganda (Dual Hybrid Commands)
- **Slash Commands (`/`)**: Interaktif, autocomplete, dan mendukung opsi platform.
- **Prefix Commands Bebas Kapital/Kecil (Case-Insensitive)**:
  - Prefix bawaan: `w!` (dapat diubah per server dan disimpan di SQLite).
  - Regex case-insensitive canggih: `w!play`, `W!play`, `W!PLAY`, `w!p`, `W!P` semuanya dieksekusi dengan sempurna.
  - Berbagai alias ringkas untuk kenyamanan pengguna handphone dan PC.

### 6. 🌐 Sistem Multibahasa Terpadu (Internationalization / i18n)
- **Bahasa Default:** **English (en)** sebagai bahasa utama internasional.
- **Bahasa Kedua:** **Bahasa Indonesia (id)**, serta dukungan bahasa populer dunia lainnya: **Español (es)**, **日本語 (ja)**, **Português (pt)**, **Русский (ru)**, **Français (fr)**, dan **Deutsch (de)**.
- **Tersimpan per Server di SQLite:** Pengaturan bahasa server A dan server B tidak saling mempengaruhi dan tersimpan permanen di database SQLite WAL mode.
- **Otomatis & Menyeluruh:** Seluruh kartu kontrol Now Playing, pesan error, label tombol, antrean, dan panduan perintah otomatis menyesuaikan dengan bahasa yang dipilih server tersebut.

### 7. 🛡️ Sistem Anti-Crash 24/7 & SQLite WAL Mode
- Dilengkapi penanganan `process.on('unhandledRejection')` dan `process.on('uncaughtException')` sehingga bot tidak akan pernah down/crash akibat kegagalan koneksi atau error eksternal.
- Database SQLite berjalan dalam mode **WAL (Write-Ahead Logging)** yang cepat, tahan korupsi data, dan adaptif untuk runtime **Bun (`bun:sqlite`)** maupun **Node.js v22+ (`node:sqlite`)**.

---

## 📁 STRUKTUR DIREKTORI PROYEK

```
diaww-music/
├── index.ts                     # Root entry point untuk Pterodactyl Bun Egg
├── config.json                  # Konfigurasi bot, lavalink nodes, warna embed
├── .env                         # Token bot Discord, Client ID, Prefix bawaan
├── .env.example                 # Template environment variables
├── package.json                 # Dependensi & script Bun/Node
├── tsconfig.json                # TypeScript compiler options (Strict Mode)
├── data/
│   └── diaww.sqlite             # Database SQLite WAL mode (dibuat otomatis)
├── dist/                        # Hasil kompilasi TypeScript untuk Node.js
├── src/
│   ├── index.ts                 # Startup bot & anti-crash global handler
│   ├── client.ts                # Extended Discord Client (Lavalink & Collections)
│   ├── config.ts                # Environment validator & config loader
│   ├── database/
│   │   ├── db.ts                # Driver adaptif (bun:sqlite & node:sqlite)
│   │   └── schema.ts            # Skema tabel guild_settings (prefix, 24/7, volume)
│   ├── modules/
│   │   └── musicManager.ts      # Lavalink v4, Smart Search, Autoplay Engine, UI Embed
│   ├── events/
│   │   ├── ready.ts             # Registrasi Slash Commands global & rotasi aktivitas
│   │   ├── interactionCreate.ts # Handler slash commands & tombol kontrol interaktif
│   │   └── messageCreate.ts     # Handler pesan prefix case-insensitive (W!, w!)
│   ├── commands/
│   │   ├── music/
│   │   │   ├── play.ts          # Putar lagu / playlist (Multi-Tier Search)
│   │   │   ├── stop.ts          # Hentikan musik & disconnect seketika
│   │   │   ├── skip.ts          # Lewati lagu
│   │   │   ├── pause.ts         # Jeda pemutaran
│   │   │   ├── resume.ts        # Lanjutkan pemutaran
│   │   │   ├── queue.ts         # Daftar antrean & rekomendasi autoplay
│   │   │   ├── nowplaying.ts    # Tampilkan kartu kontrol Now Playing
│   │   │   ├── autoplay.ts      # Toggle fitur Autoplay Cerdas
│   │   │   ├── mode247.ts       # Toggle standby 24/7 di voice channel
│   │   │   ├── volume.ts        # Atur volume 1 - 150%
│   │   │   ├── loop.ts          # Mode loop: off, track, queue
│   │   │   ├── shuffle.ts       # Acak antrean
│   │   │   └── sources.ts       # Tampilkan 9+ platform yang didukung
│   │   └── general/
│   │       ├── ping.ts          # Latensi websocket, lavalink, sqlite, memory RAM
│   │       ├── prefix.ts        # Ubah prefix server di database
│   │       └── help.ts          # Buku panduan lengkap perintah
│   └── utils/
│       ├── embeds.ts            # Template embed Discord konsisten
│       └── time.ts              # Konversi ms -> format waktu & progress bar
└── README.md                    # Dokumentasi lengkap
```

---

## 🚀 PANDUAN INSTALASI & DEPLOYMENT

### A. Konfigurasi Awal (Environment & Config)

1. Salin file `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```
2. Buka file `.env` dan isi token bot Anda:
   ```env
   DISCORD_TOKEN=OTk5OTk5...
   CLIENT_ID=123456789012345678
   DEFAULT_PREFIX=w!
   ```
   > 💡 **Catatan:** Dapatkan Token dan Client ID di [Discord Developer Portal](https://discord.com/developers/applications). Pastikan pada menu **Bot** -> **Privileged Gateway Intents**, opsi **Message Content Intent**, **Server Members Intent**, dan **Presence Intent** telah diaktifkan!

3. Periksa file `config.json`. Node Lavalink publik Serenetia v4 (SSL Port 443 & Non-SSL Port 80) sudah terpasang secara bawaan:
   ```json
   {
     "bot": {
       "name": "DIAWW MUSIC",
       "defaultPrefix": "w!",
       "status": [
         { "name": "w!help | DIAWW MUSIC", "type": 2 },
         { "name": "/play | High-Fidelity Audio", "type": 2 },
         { "name": "9+ Sumber Musik & Radio", "type": 0 }
       ],
       "statusInterval": 30000
     },
     "lavalink": {
       "nodes": [
         {
           "id": "Serenetia-SSL",
           "host": "lavalinkv4.serenetia.com",
           "port": 443,
           "authorization": "https://seretia.link/discord",
           "secure": true
         },
         {
           "id": "Serenetia-NonSSL",
           "host": "lavalinkv4.serenetia.com",
           "port": 80,
           "authorization": "https://seretia.link/discord",
           "secure": false
         }
       ],
       "defaultVolume": 80,
       "maxVolume": 150,
       "disconnectTimeout": 60000
     }
   }
   ```

---

### B. Deployment di Pterodactyl Panel (Bun Egg) ⭐ Direkomendasikan

Bot ini dirancang khusus untuk kompatibel penuh dengan **Pterodactyl Bun Egg**:
1. Kompres semua file proyek (atau clone repository) ke root server Pterodactyl Anda.
2. Di Pterodactyl Panel, pastikan Egg yang digunakan adalah **Bun**.
3. Default Startup Command Pterodactyl adalah:
   ```bash
   bun run index.ts
   ```
   *Karena file `index.ts` sudah tersedia di root direktori di luar folder `src/`, bot akan langsung berjalan mulus tanpa memerlukan kompilasi atau konfigurasi tambahan!*
4. File database SQLite akan otomatis dibuat di folder `/data/diaww.sqlite` dalam format WAL mode yang sangat cepat dan ringan.

---

### C. Deployment di Node.js (v22+)

Jika Anda menggunakan VPS Linux / Windows dengan Node.js v22+:
1. Pasang dependensi:
   ```bash
   npm install
   ```
2. Kompilasi TypeScript ke folder `dist/`:
   ```bash
   npm run build
   ```
3. Jalankan bot:
   ```bash
   npm start
   # atau
   npm run node:start
   ```
4. Untuk proses development dengan auto-reload (TSX):
   ```bash
   npm run node:dev
   ```

---

## 📜 DAFTAR LENGKAP PERINTAH (COMMANDS)

Semua perintah prefix di bawah ini bersifat **Case-Insensitive** (`w!`, `W!`, `diaww!`, `DIAWW!`).

### 🎵 1. Perintah Musik
| Slash Command | Prefix Command | Aliases | Keterangan |
|---|---|---|---|
| `/play <query> [platform]` | `w!play <query>` | `w!p` | Memutar lagu/playlist dari 9+ sumber audio atau pencarian judul cerdas. |
| `/stop` | `w!stop` | `w!dc`, `w!leave`, `w!disconnect` | Menghentikan musik seketika, mengosongkan antrean, dan keluar dari voice channel. |
| `/skip` | `w!skip` | `w!s`, `w!next` | Melewati lagu yang sedang diputar ke lagu berikutnya. |
| `/pause` | `w!pause` | `w!hold` | Menjeda pemutaran musik sementara. |
| `/resume` | `w!resume` | `w!unpause`, `w!continue` | Melanjutkan kembali pemutaran musik yang dijeda. |
| `/nowplaying` | `w!nowplaying` | `w!np`, `w!current` | Menampilkan kartu kontrol resmi Now Playing dengan tombol interaktif. |
| `/queue` | `w!queue` | `w!q`, `w!list` | Menampilkan daftar antrean dan pratinjau lagu Autoplay berikutnya. |
| `/autoplay` | `w!autoplay` | `w!ap`, `w!auto` | Mengaktifkan/menonaktifkan Autoplay Cerdas (Spotify Radio & YouTube Mix). |
| `/mode247` | `w!mode247` | `w!247`, `w!stay` | Mengatur bot agar tetap standby di voice channel 24/7 nonstop. |
| `/volume <1-150>` | `w!volume <1-150>` | `w!vol`, `w!v` | Mengatur tingkat volume pemutar musik (1% - 150%). |
| `/loop [mode]` | `w!loop [mode]` | `w!l`, `w!repeat` | Mengatur mode pengulangan (`off`, `track`, `queue`). |
| `/shuffle` | `w!shuffle` | `w!sh`, `w!random` | Mengacak urutan antrean lagu yang ada. |
| `/sources` | `w!sources` | `w!source`, `w!platforms` | Menampilkan daftar 9+ platform musik yang didukung beserta formatnya. |

### 🛠️ 2. Perintah Umum & Server
| Slash Command | Prefix Command | Aliases | Keterangan |
|---|---|---|---|
| `/language [lang]` | `w!language [lang]` | `w!lang`, `w!setlang`, `w!bahasa` | Melihat atau mengubah bahasa bot per-server (Default: English, Indonesia, Español, 日本語, dll). |
| `/donate` | `w!donate` | `w!saweria`, `w!donasi` | Dukung dan donasi untuk biaya hosting & server DIAWW MUSIC via Saweria. |
| `/support <pesan>` | `w!support <pesan>` | `w!report`, `w!aduan` | Kirim aduan kendala/bug/saran yang otomatis diteruskan langsung ke DM Owner. |
| `/ping` | `w!ping` | `w!latency` | Cek latensi Discord WebSocket, Lavalink v4, SQLite DB, dan pemakaian RAM. |
| `/prefix <new_prefix>` | `w!prefix <baru>` | `w!setprefix` | Mengubah custom prefix bot di server (Memerlukan izin Manage Server). |
| `/help` | `w!help` | `w!h`, `w!commands`, `w!menu` | Menampilkan buku panduan interaktif seluruh fitur DIAWW MUSIC. |

---

## 👑 PANDUAN OWNER CONTROL PANEL (DM PERSONAL KHUSUS OWNER)

Bot ini memiliki **Private Control Panel** yang beroperasi eksklusif melalui **Chat Langsung / Direct Message (DM)** antara bot dan Owner (User ID: `1157912761184026764`):

### Cara Mengakses:
Cukup kirim pesan langsung (DM) ke akun bot Discord Anda dengan mengetik `panel`, `menu`, atau `help`. Bot akan langsung membalas dengan dashboard interaktif beserta tombol navigasi:

### Daftar Perintah Owner di DM:
1. **`menu` / `panel` / `help`**: Menampilkan dashboard kontrol interaktif dengan tombol status, daftar server, dan restart.
2. **`stats` / `health` / `system`**: Menampilkan status kesehatan sistem lengkap:
   - Penggunaan RAM (Heap, RSS, OS Total & Free RAM)
   - Uptime Bot & Runtime Host (Bun / Node.js)
   - Status & beban CPU tiap node Lavalink v4
   - Jumlah pemutar musik aktif & total server
   - Status koneksi database SQLite WAL mode
3. **`servers` / `guilds`**: Menampilkan seluruh server Discord yang menggunakan bot Anda, lengkap dengan ID Server, jumlah anggota warga, dan status pemutaran musik saat itu.
4. **`leave <guild_id>`**: Memerintahkan bot keluar secara paksa dari server tertentu jika diperlukan.
5. **`reply <user_id> <pesan>`**: Membalas laporan/aduan pengguna yang masuk ke DM Anda. Bot akan otomatis mengirimkan pesan balasan resmi langsung ke DM pengguna tersebut.
6. **`broadcast <pesan>`**: Mengirimkan pengumuman resmi ke channel teks utama di seluruh server Discord yang mengundang bot.
7. **`restart`**: Melakukan restart bot proses secara graceful (aman untuk hosting Pterodactyl/PM2).
8. **`eval <code>`**: Menjalankan evaluasi kode JavaScript/TypeScript untuk keperluan pemeliharaan atau debugging teknis.

---

## 🎛️ PANDUAN TOMBOL KONTROL NOW PLAYING

Setiap kali lagu diputar, bot menampilkan **Kartu Kontrol Now Playing** dengan 2 baris tombol instan:

```
[ Baris 1 ]
[ ⏯️ Jeda/Lanjut ] [ ⏭️ Lewati ] [ ⏹️ Berhenti ] [ 🔁 Loop ] [ 📻 Autoplay ]

[ Baris 2 ]
[ 🔉 Vol -10% ] [ 🔊 Vol +10% ] [ 📜 Antrean ] [ ⏳ Mode 24/7 ]
```

- **⏯️ Jeda / Lanjut**: Beralih antara mode jeda (pause) dan lanjut (resume) tanpa mengetik perintah.
- **⏭️ Lewati**: Langsung memutar lagu berikutnya di antrean atau lagu rekomendasi Autoplay.
- **⏹️ Berhenti (Tombol Merah)**: Seketika mengosongkan antrean, mematikan pemutar, disconnect dari voice channel, dan menghapus kartu pesan pemutar.
- **🔁 Loop**: Mengganti status loop secara berurutan: `OFF` -> `TRACK` (ulang lagu) -> `QUEUE` (ulang antrean) -> `OFF`.
- **📻 Autoplay**: Mengaktifkan atau mematikan sistem radio otomatis.
- **🔉 / 🔊 Vol -/+ 10%**: Menyesuaikan volume langsung secara halus dan menyimpannya ke database server.
- **📜 Antrean**: Membuka popup antrean lengkap beserta rekomendasi lagu autoplay berikutnya (ephemeral/hanya terlihat oleh Anda).
- **⏳ Mode 24/7**: Mengaktifkan mode standby 24 jam agar bot tidak keluar saat antrean lagu habis.

---

## 📻 PANDUAN FITUR AUTOPLAY CERDAS & MODE 24 JAM

### Cara Kerja Autoplay:
1. Ketika lagu diputar (misalnya lagu dari *Yung Lean*), bot mengekstrak nama artis dan genre musik.
2. Bot mencari stasiun radio resmi Spotify (`spsearch:Yung Lean Radio`) dan YouTube Mix playlist.
3. Bot menyaring kandidat lagu:
   - Tidak boleh lagu yang sama atau lagu versi cover/slowed/reverb.
   - Tidak ada dalam 50 lagu terakhir yang telah diputar di server.
   - Durasi lagu wajar (1 hingga 15 menit).
4. Kandidat yang terpilih disimpan sebagai pratinjau di memori. Pengguna dapat melihatnya dengan mengetik `/queue`.
5. Saat antrean warga habis, lagu rekomendasi ini otomatis diputar mulus ke kartu Now Playing tanpa notifikasi dobel yang mengganggu.

### Cara Kerja Mode 24/7:
- Secara default, bot akan otomatis keluar dari voice channel jika antrean kosong selama 60 detik.
- Dengan mengaktifkan `/mode247` atau mengklik tombol **⏳ 24/7**, bot akan **tetap siaga di dalam voice channel** tanpa keluar meskipun Anda tidak sedang memutar lagu.
- Pengaturan ini tersimpan permanen di database SQLite per-guild, sehingga tetap aktif meskipun bot direstart.

---

## 🛡️ LISENSI & KONTRIBUSI

Proyek ini dirilis di bawah lisensi **MIT License**. Dibuat dengan dedikasi tinggi untuk komunitas musik Discord Indonesia.

Dikembangkan oleh **DIAWW Team** • Ditenagai oleh **Serenetia Lavalink v4**.
