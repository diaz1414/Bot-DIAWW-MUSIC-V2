import { TranslationSchema } from "../types";

const id: TranslationSchema = {
  common: {
    footer: "DIAWW MUSIC • High-Fidelity Audio • Serenetia Lavalink v4",
    error_title: "Terjadi Kesalahan",
    success_title: "Berhasil",
    info_title: "Informasi",
    warning_title: "Peringatan",
    no_voice_channel: "Kamu harus berada di Voice Channel untuk menggunakan perintah ini!",
    different_voice_channel: "Kamu harus berada di Voice Channel yang sama dengan bot!",
    no_music_playing: "Sedang tidak ada musik yang diputar di server ini.",
    permission_denied: "Kamu tidak memiliki izin untuk mengeksekusi perintah ini!",
    system_error: "Terjadi kesalahan saat memproses perintah ini. Silakan coba beberapa saat lagi."
  },
  nowplaying: {
    header_normal: "🎵 SEDANG DIPUTAR • NOW PLAYING",
    header_autoplay: "📻 SEDANG DIPUTAR • AUTOPLAY REKOMENDASI",
    artist: "Artis",
    source: "Sumber",
    duration: "Durasi",
    requester: "Diminta Oleh",
    requester_radio: "Sistem Radio",
    volume: "Volume",
    loop_mode: "Mode Loop",
    autoplay_status: "Autoplay Cerdas",
    mode247_status: "Mode 24/7",
    next_track: "Berikutnya",
    next_empty: "Tidak ada (Antrean kosong)",
    live_stream: "🔴 LIVE STREAM",
    status_active: "🟢 Aktif",
    status_inactive: "🔴 Nonaktif",
    loop_off: "❌ Mati",
    loop_track: "🔂 Lagu",
    loop_queue: "🔁 Antrean"
  },
  buttons: {
    pause: "Jeda",
    resume: "Lanjut",
    skip: "Lewati",
    stop: "Berhenti",
    loop: "Loop",
    autoplay: "Autoplay",
    vol_down: "Vol -10%",
    vol_up: "Vol +10%",
    queue: "Antrean",
    mode247: "24/7"
  },
  play: {
    searching: "Mencari lagu...",
    not_found: "Tidak ada hasil lagu yang ditemukan untuk: `{query}`.\nCoba gunakan link langsung atau kata kunci yang lebih spesifik.",
    starting_playback: "Memulai pemutaran: **[{title}]({uri})**\n👤 Artis: **{author}** • 🌐 Sumber: **{source}**\n⏱️ Durasi: `{duration}`",
    added_to_queue: "Ditambahkan ke antrean: **[{title}]({uri})**\n👤 Artis: **{author}** • 🌐 Sumber: **{source}**\n⏱️ Durasi: `{duration}`\n📍 Posisi Antrean: Ke-**{position}**",
    playlist_added: "📁 **[{title}]({uri})**\n🔢 Jumlah: **{count} lagu**\n⏱️ Total Durasi: **{duration}**\n🌐 Sumber: **{source}**\n👤 Diminta oleh: <@{user}>",
    queue_position: "Posisi Antrean",
    tracks_count: "Jumlah Lagu",
    total_duration: "Total Durasi",
    requested_by: "Diminta Oleh",
    usage_warning: "Harap masukkan judul lagu atau link.\nContoh: `w!play Yung Lean Ginseng Strip` atau `w!p <link>`"
  },
  stop: {
    title: "Pemutaran Dihentikan",
    description: "Antrean telah dikosongkan dan bot telah keluar dari voice channel.",
    button_stop: "Pemutaran dihentikan oleh <@{user}>. Antrean dikosongkan dan bot keluar dari voice channel."
  },
  skip: {
    title: "Lagu Dilewati",
    description: "Berhasil melewati: **{title}**"
  },
  pause: {
    title: "Pemutaran Dijeda",
    description: "Gunakan `/resume` atau tombol ▶️ untuk melanjutkan pemutaran.",
    already_paused: "Pemutar musik saat ini sudah dalam keadaan jeda (paused)."
  },
  resume: {
    title: "Pemutaran Dilanjutkan",
    description: "Musik kembali diputar!",
    not_paused: "Pemutar musik sedang berjalan normal (tidak dijeda)."
  },
  queue: {
    title: "📜 Antrean Musik • {guild}",
    now_playing: "🎶 **Sedang Diputar:**\n[{title}]({uri}) - `{duration}` ({source})\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    empty_now_playing: "Tidak ada lagu yang sedang diputar saat ini.",
    tracks_in_queue: "📋 Lagu Dalam Antrean ({count} lagu | Total: {duration})",
    queue_empty: "*Antrean kosong. Ketik `/play` atau `w!play` untuk menambahkan lagu.*",
    and_more: "\n*...dan {count} lagu lainnya dalam antrean.*",
    autoplay_next_title: "📻 Rekomendasi Autoplay Berikutnya",
    autoplay_next_desc: "✨ [{title}]({uri})\n👤 Artis: **{author}** • Durasi: `{duration}`\n*(Dipilih otomatis oleh sistem radio Spotify/YouTube Mix)*",
    autoplay_analyzing: "🔍 *Sedang menganalisis genre dan menyiapkan lagu rekomendasi di latar belakang...*",
    autoplay_off_desc: "*Autoplay saat ini NONAKTIF. Aktifkan dengan perintah `/autoplay` atau klik tombol 📻.*"
  },
  autoplay: {
    title: "Autoplay Diperbarui",
    enabled_desc: "Status Autoplay Cerdas sekarang: **🟢 AKTIF**\nBot akan otomatis memilihkan lagu sejenis dari Spotify Radio & YouTube Mix tanpa mengulang lagu yang sama.",
    disabled_desc: "Status Autoplay Cerdas sekarang: **🔴 NONAKTIF**\nBot akan berhenti setelah antrean lagu saat ini selesai diputar."
  },
  mode247: {
    title: "Pengaturan Mode 24/7 Diperbarui",
    enabled_desc: "Status Mode 24/7 di server ini sekarang: **🟢 AKTIF**\nBot akan tetap siaga di voice channel meskipun antrean telah selesai.",
    disabled_desc: "Status Mode 24/7 di server ini sekarang: **🔴 NONAKTIF**\nBot akan otomatis keluar jika antrean kosong selama 60 detik."
  },
  volume: {
    title: "Volume Diperbarui",
    current: "Tingkat volume saat ini adalah **{volume}%**.\nUntuk mengubah, ketik: `w!vol <1-150>`",
    updated: "Tingkat volume sekarang diatur ke: **{volume}%**",
    invalid: "Harap masukkan angka volume antara **1** hingga **{max}**!"
  },
  loop: {
    title: "Mode Loop Diperbarui",
    updated: "Mode loop sekarang diatur ke: **{mode}**",
    off: "❌ Mati (Normal)",
    track: "🔂 Mengulang Lagu Saat Ini",
    queue: "🔁 Mengulang Seluruh Antrean"
  },
  shuffle: {
    title: "Antrean Diacak",
    shuffled: "Berhasil mengacak **{count}** lagu di dalam antrean.",
    not_enough: "Minimal harus ada 2 lagu di dalam antrean untuk diacak."
  },
  sources: {
    title: "🌐 Platform Musik yang Didukung (9+ Sumber)",
    description: "DIAWW MUSIC ditenagai oleh **Serenetia Lavalink v4** dengan integrasi LavaSrc untuk kualitas audio lossless dan fleksibilitas platform tanpa batas:"
  },
  ping: {
    title: "🏓 Statistik & Latensi DIAWW MUSIC",
    ws: "📡 Discord Gateway (WS)",
    db: "💾 Database SQLite",
    uptime: "⏱️ Uptime Bot",
    runtime: "⚡ Runtime Environment",
    ram: "🧠 Pemakaian RAM",
    players: "🎵 Pemutar Aktif",
    nodes: "🔌 Status Node Lavalink v4"
  },
  prefix: {
    title: "Prefix Berhasil Diubah",
    current: "Prefix saat ini adalah: `{prefix}`.\nUntuk mengubah, ketik: `{prefix}prefix <prefix_baru>`",
    updated: "Prefix perintah teks untuk server ini sekarang adalah: `{prefix}`\nContoh: `{prefix}play Yung Lean`",
    empty: "Prefix tidak boleh kosong!",
    too_long: "Panjang prefix maksimal adalah 10 karakter!"
  },
  language: {
    title: "🌐 Pengaturan Bahasa",
    current: "Bahasa server saat ini: **{flag} {name} ({code})**",
    updated: "Bahasa bot untuk server ini berhasil diubah ke: **{flag} {name} ({code})**",
    available: "Bahasa yang tersedia:\n{list}\n\nUntuk mengubah bahasa, gunakan `/language <kode_atau_nama>` atau `w!lang <kode_atau_nama>`.",
    invalid: "Bahasa `{input}` tidak valid!\nBahasa yang didukung: {supported}"
  },
  donate: {
    title: "☕ Donasi & Dukung DIAWW MUSIC",
    description: "Terima kasih banyak telah menggunakan **DIAWW MUSIC**!\nJika kamu menikmati audio lossless dan fitur bot kami, kamu dapat mendukung biaya hosting & server kami melalui Saweria:\n\n🔗 **Link Saweria:** [{url}]({url})\n\nSetiap dukungan sangat berarti bagi kelangsungan bot ini! ❤️",
    button_label: "Donasi via Saweria"
  },
  support: {
    title: "📩 Kirim Aduan / Support ke Developer",
    description: "Aduan, laporan bug, atau saranmu telah diteruskan langsung ke DM personal Owner bot! Terima kasih telah membantu kami.",
    success_sent: "Laporanmu berhasil dikirimkan langsung ke developer bot! Kamu akan menerima balasan langsung ke DM jika diperlukan.",
    usage_warning: "Harap tuliskan pesan aduan atau saranmu.\nContoh: `w!report Lagu Spotify DJ slow tidak keluar suara`",
    empty_message: "Pesan aduan tidak boleh kosong!"
  },
  help: {
    title: "📖 Buku Panduan • DIAWW MUSIC",
    description: "**DIAWW MUSIC** adalah Dedicated High-Fidelity Discord Music Bot dengan dukungan **9+ Platform Musik**, sistem pencarian cerdas bertingkat, dan algoritma Autoplay Spotify Radio.\n\n🔹 **Prefix Server Ini:** `{prefix}` *(Bebas huruf kapital/kecil: `{prefix}play`, `{prefix_upper}play`)*\n🔹 **Bahasa:** `{lang_flag} {lang_name}` (`/language`)\n🔹 **Slash Commands:** Ketik `/` untuk memilih menu interaktif Discord.",
    music_commands: "🎵 Perintah Musik Utama",
    queue_commands: "⚙️ Pengaturan & Kontrol Antrean",
    general_commands: "🛠️ Perintah Umum & Server",
    buttons_info: "🔘 Tombol Kontrol Interaktif (Now Playing Card)"
  },
  playlist: {
    title: "Playlist Pribadi Pengguna",
    created: "Berhasil membuat playlist baru bernama **{name}**!",
    deleted: "Berhasil menghapus playlist **{name}**.",
    not_found: "Playlist bernama **{name}** tidak ditemukan di koleksimu.",
    already_exists: "Kamu sudah memiliki playlist bernama **{name}**!",
    limit_reached: "Kamu sudah mencapai batas maksimal **10 playlist**. Hapus salah satu untuk membuat yang baru.",
    track_added: "Berhasil menambahkan lagu **[{title}]({uri})** ke playlist **{name}**!",
    track_limit_reached: "Playlist **{name}** sudah mencapai batas maksimal **50 lagu**.",
    track_removed: "Berhasil menghapus **{title}** dari playlist **{name}**.",
    invalid_index: "Nomor urut lagu tidak valid! Cek daftar nomor menggunakan `/playlist view {name}`.",
    empty: "Playlist **{name}** saat ini masih kosong.",
    list_title: "📂 Daftar Playlist Kamu ({count}/10)",
    list_empty: "Kamu belum memiliki playlist apapun! Buat dengan `/playlist create <nama>`.",
    view_title: "📂 Isi Playlist: {name} ({count}/50 Lagu)",
    playing: "Sedang memuat dan memutar **{count} lagu** dari playlist **{name}**!",
    no_tracks_to_play: "Tidak dapat memutar playlist **{name}** karena belum memiliki lagu.",
    name_invalid: "Nama playlist harus berukuran antara 1 hingga 32 karakter."
  },
  events: {
    queue_end_247_title: "Antrean Telah Selesai",
    queue_end_247_desc: "Semua lagu telah selesai diputar. Bot tetap siaga di voice channel karena **Mode 24/7 Aktif**.",
    queue_end_countdown_title: "Antrean Lagu Selesai",
    queue_end_countdown_desc: "Tidak ada lagu lagi di antrean. Bot akan otomatis disconnect dalam **60 detik** jika tidak ada lagu baru."
  }
};

export default id;
