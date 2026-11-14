import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Message,
  TextChannel,
  User,
  VoiceState
} from "discord.js";
import {
  LavalinkManager,
  Player,
  SearchResult,
  Track
} from "lavalink-client";
import { DiawwBotClient } from "../client";
import { config } from "../config";
import { deletePlayerSession, getGuildLanguage, getGuildSettings } from "../database/schema";
import { t } from "../i18n";
import { resumeAllPlayerSessions, saveCurrentPlayerSession } from "./sessionManager";
import { createBaseEmbed, createInfoEmbed, createWarningEmbed, getBotAvatar } from "../utils/embeds";
import { createProgressBar, formatDuration } from "../utils/time";

/**
 * Interface ekstensi untuk track dengan flag autoplay
 */
export interface ExtendedTrack extends Track {
  isAutoplay?: boolean;
}

/**
 * Membersihkan judul lagu dari noise seperti [Official Video], (Lyrics), HD, Remastered, dll.
 */
export function cleanTrackTitle(title: string): string {
  if (!title) return "";

  return title
    .toLowerCase()
    // Hapus kurung siku, kurung biasa, dan isinya jika memuat kata kunci video/audio
    .replace(/[\(\[\{][^\)\]\}]*(?:official|video|audio|lyrics|lyric|remastered|remaster|hd|4k|mv|visualizer|clip|full|album|feat|ft|prod)[^\)\]\}]*[\)\]\}]/gi, "")
    // Hapus sisa-sisa kurung biasa/siku umum
    .replace(/[\(\[\{].*?[\)\]\}]/g, "")
    // Hapus kata-kata promosi/tag video
    .replace(/\b(?:official video|official audio|music video|lyric video|lyrics|remastered|remaster|hd|4k|mv|visualizer|slowed|reverb|sped up|bass boosted|audio)\b/gi, "")
    // Hapus tanda baca berlebihan
    .replace(/[|\-_~]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Mendeteksi apakah dua lagu sama atau sangat mirip (menghindari cover/re-upload kembar)
 */
export function isSameOrSimilarTrack(trackA: any, trackB: any): boolean {
  if (!trackA || !trackB) return false;

  const infoA = trackA.info || trackA;
  const infoB = trackB.info || trackB;

  // Jika identifier atau URI sama
  if (infoA.identifier && infoB.identifier && infoA.identifier === infoB.identifier) return true;
  if (infoA.uri && infoB.uri && infoA.uri === infoB.uri) return true;

  const cleanTitleA = cleanTrackTitle(infoA.title || "");
  const cleanTitleB = cleanTrackTitle(infoB.title || "");

  // Judul bersih persis sama
  if (cleanTitleA && cleanTitleB && cleanTitleA === cleanTitleB) return true;

  // Cek kemiripan kata (token overlap)
  const tokensA = cleanTitleA.split(" ").filter((t: string) => t.length > 2);
  const tokensB = cleanTitleB.split(" ").filter((t: string) => t.length > 2);

  if (tokensA.length > 0 && tokensB.length > 0) {
    const intersection = tokensA.filter((t: string) => tokensB.includes(t));
    const similarity = (intersection.length * 2) / (tokensA.length + tokensB.length);
    if (similarity > 0.75) return true;
  }

  return false;
}

/**
 * Mencatat lagu yang sudah diputar ke dalam riwayat player (maksimal 50 lagu)
 */
export function recordPlayedTrack(player: Player, track: Track): void {
  const history: Array<{ id: string; title: string; author: string }> = player.get("played_history") || [];

  const entry = {
    id: track.info.identifier,
    title: cleanTrackTitle(track.info.title),
    author: (track.info.author || "").toLowerCase()
  };

  // Cek apakah sudah ada di riwayat
  const alreadyExists = history.some(
    (h) => h.id === entry.id || (h.title === entry.title && h.author === entry.author)
  );

  if (!alreadyExists) {
    history.push(entry);
    if (history.length > 50) {
      history.shift(); // Jaga riwayat maksimal 50 lagu terakhir
    }
    player.set("played_history", history);
  }
}

/**
 * Algoritma Cerdas Autoplay (Spotify Radio & YouTube Mix Algorithm):
 * Mengambil lagu acuan, mencari Spotify Radio & Mix atau YouTube Mix,
 * dan memilih lagu sejenis yang belum pernah diputar (anti-repeat).
 */
export async function prepareAutoplayNextTrack(
  player: Player,
  client: DiawwBotClient,
  referenceTrack: Track
): Promise<void> {
  if (player.get("autoplay_fetching")) return;
  player.set("autoplay_fetching", true);

  try {
    const rawArtist = referenceTrack.info.author || "";
    const cleanArtist = rawArtist
      .replace(/\s*-\s*Topic$/i, "")
      .replace(/\s*VEVO$/i, "")
      .replace(/\s*Official$/i, "")
      .replace(/,\s*.*/, "") // Ambil artis utama pertama
      .trim();

    if (!cleanArtist) {
      player.set("autoplay_fetching", false);
      return;
    }

    const queries = [
      `spsearch:${cleanArtist} Radio`,
      `spsearch:${cleanArtist} Mix`,
      `ytsearch:${cleanArtist} Mix playlist`,
      `spsearch:${cleanArtist}`
    ];

    const history: Array<{ id: string; title: string; author: string }> = player.get("played_history") || [];
    const currentQueue = player.queue.tracks;

    let candidateTrack: Track | null = null;

    for (const q of queries) {
      try {
        const res = await player.search(q, { id: client.user?.id || "DIAWW_AUTOPLAY", username: "Autoplay Radio" });
        if (!res || !res.tracks || res.tracks.length === 0) continue;

        const validCandidates = res.tracks.filter((candidate: any) => {
          // Abaikan lagu acuan saat ini
          if (isSameOrSimilarTrack(candidate, referenceTrack)) return false;

          // Abaikan lagu yang sedang ada di antrean
          if (currentQueue.some((qTrack: any) => isSameOrSimilarTrack(candidate, qTrack))) return false;

          // Abaikan jika sudah pernah diputar di riwayat 50 lagu
          const candCleanTitle = cleanTrackTitle(candidate.info?.title || "");
          const inHistory = history.some(
            (h) => h.id === candidate.info?.identifier || h.title === candCleanTitle
          );
          if (inHistory) return false;

          // Filter durasi: antara 60 detik (1 menit) hingga 900 detik (15 menit)
          const duration = candidate.info?.duration || 0;
          if (duration < 60000 || duration > 900000) return false;

          return true;
        });

        if (validCandidates.length > 0) {
          const pickIndex = Math.floor(Math.random() * Math.min(validCandidates.length, 3));
          candidateTrack = validCandidates[pickIndex] as Track;
          break;
        }
      } catch (searchErr) {
        // Lanjutkan ke query alternatif
      }
    }

    if (candidateTrack) {
      (candidateTrack as ExtendedTrack).isAutoplay = true;
      player.set("autoplay_next_track", candidateTrack);
    }
  } catch (err) {
    console.warn("[AUTOPLAY ENGINE] Gagal menyiapkan lagu autoplay:", err);
  } finally {
    player.set("autoplay_fetching", false);
  }
}

/**
 * Mendapatkan badge platform musik yang estetik
 */
export function getSourceBadge(sourceName?: string, uri?: string): string {
  const src = (sourceName || "").toLowerCase();
  const link = (uri || "").toLowerCase();

  if (src.includes("spotify") || link.includes("spotify")) return "🟢 Spotify";
  if (src.includes("youtubemusic") || link.includes("music.youtube")) return "🔴 YouTube Music";
  if (src.includes("youtube") || link.includes("youtube") || link.includes("youtu.be")) return "🔴 YouTube";
  if (src.includes("apple") || link.includes("music.apple")) return "🍎 Apple Music";
  if (src.includes("soundcloud") || link.includes("soundcloud")) return "🟠 SoundCloud";
  if (src.includes("deezer") || link.includes("deezer")) return "💙 Deezer";
  if (src.includes("yandex") || link.includes("yandex")) return "🟡 Yandex Music";
  if (src.includes("bandcamp") || link.includes("bandcamp")) return "💿 Bandcamp";
  if (src.includes("twitch") || link.includes("twitch.tv")) return "🟣 Twitch";
  if (link.match(/\.(mp3|wav|flac|ogg|m4a|aac)($|\?)/i)) return "📁 File Audio HTTP";
  if (src.includes("http") || link.startsWith("http")) return "📻 HTTP Live Radio";

  return `✨ ${sourceName || "Audio Stream"}`;
}

/**
 * Membuat Embed Now Playing Resmi Multibahasa (Single Embed dengan kontrol penuh)
 */
export function buildNowPlayingEmbed(player: Player, track: Track): EmbedBuilder {
  const lang = getGuildLanguage(player.guildId);
  const isAutoplay = (track as ExtendedTrack).isAutoplay || player.get("current_is_autoplay") === true;
  const sourceBadge = getSourceBadge(track.info.sourceName, track.info.uri);

  const titleHeader = isAutoplay
    ? t(lang, "nowplaying.header_autoplay")
    : t(lang, "nowplaying.header_normal");

  const color = isAutoplay ? config.embedColors.autoplay : config.embedColors.primary;

  const currentPos = player.position || 0;
  const totalLength = track.info.duration || 0;
  const progressBar = createProgressBar(currentPos, totalLength, 15);

  const repeatMode =
    player.repeatMode === "track"
      ? t(lang, "nowplaying.loop_track")
      : player.repeatMode === "queue"
      ? t(lang, "nowplaying.loop_queue")
      : t(lang, "nowplaying.loop_off");

  const autoplayStatus = player.get("autoplay")
    ? t(lang, "nowplaying.status_active")
    : t(lang, "nowplaying.status_inactive");

  const mode247Status = player.get("mode_247")
    ? t(lang, "nowplaying.status_active")
    : t(lang, "nowplaying.status_inactive");

  // Penentuan lagu berikutnya
  let nextTrackText = t(lang, "nowplaying.next_empty");
  if (player.queue.tracks.length > 0) {
    const nextInQueue = player.queue.tracks[0];
    nextTrackText = `[${nextInQueue.info.title}](${nextInQueue.info.uri || "https://discord.com"})`;
  } else if (player.get("autoplay") && player.get("autoplay_next_track")) {
    const autoNext: Track = player.get("autoplay_next_track");
    nextTrackText = `📻 [Autoplay] ${autoNext.info.title} (${autoNext.info.author})`;
  }

  // Requester
  let requesterText = `🤖 ${t(lang, "nowplaying.requester_radio")}`;
  if (!isAutoplay && track.requester) {
    const req = track.requester as any;
    requesterText = `<@${req.id || req}>`;
  }

  const embed = new EmbedBuilder()
    .setColor(color as any)
    .setTitle(titleHeader)
    .setDescription(
      `### [${track.info.title}](${track.info.uri || "https://discord.com"})\n` +
      `👤 ${t(lang, "nowplaying.artist")}: **${track.info.author || "Unknown"}** • ${t(lang, "nowplaying.source")}: **${sourceBadge}**\n\n` +
      `${progressBar}`
    )
    .addFields(
      { name: `⏱️ ${t(lang, "nowplaying.duration")}`, value: `\`${formatDuration(totalLength)}\``, inline: true },
      { name: `👤 ${t(lang, "nowplaying.requester")}`, value: requesterText, inline: true },
      { name: `🔊 ${t(lang, "nowplaying.volume")}`, value: `\`${player.volume}%\``, inline: true },
      { name: `🔁 ${t(lang, "nowplaying.loop_mode")}`, value: `\`${repeatMode}\``, inline: true },
      { name: `📻 ${t(lang, "nowplaying.autoplay_status")}`, value: `\`${autoplayStatus}\``, inline: true },
      { name: `⏳ ${t(lang, "nowplaying.mode247_status")}`, value: `\`${mode247Status}\``, inline: true },
      { name: `⏭️ ${t(lang, "nowplaying.next_track")}`, value: nextTrackText, inline: false }
    )
    .setTimestamp()
    .setFooter({
      text: t(lang, "common.footer"),
      iconURL: getBotAvatar()
    });

  const artwork = track.info.artworkUrl || (track.info as any).thumbnail;
  if (artwork) {
    embed.setThumbnail(artwork);
  }

  return embed;
}

/**
 * Membuat Tombol Komponen Kontrol Interaktif Multibahasa 2 Baris
 */
export function buildNowPlayingComponents(player: Player): ActionRowBuilder<ButtonBuilder>[] {
  const lang = getGuildLanguage(player.guildId);
  const isPaused = player.paused;
  const isAutoplay = player.get("autoplay") === true;
  const is247 = player.get("mode_247") === true;

  // Baris 1: Play/Pause, Skip, Stop (Danger), Loop, Autoplay
  const row1 = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("music_toggle_pause")
      .setLabel(isPaused ? t(lang, "buttons.resume") : t(lang, "buttons.pause"))
      .setEmoji(isPaused ? "▶️" : "⏸️")
      .setStyle(isPaused ? ButtonStyle.Success : ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("music_skip")
      .setLabel(t(lang, "buttons.skip"))
      .setEmoji("⏭️")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId("music_stop")
      .setLabel(t(lang, "buttons.stop"))
      .setEmoji("⏹️")
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId("music_toggle_loop")
      .setLabel(`${t(lang, "buttons.loop")}: ${player.repeatMode.toUpperCase()}`)
      .setEmoji("🔁")
      .setStyle(player.repeatMode !== "off" ? ButtonStyle.Primary : ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("music_toggle_autoplay")
      .setLabel(`${t(lang, "buttons.autoplay")}: ${isAutoplay ? "ON" : "OFF"}`)
      .setEmoji("📻")
      .setStyle(isAutoplay ? ButtonStyle.Success : ButtonStyle.Secondary)
  );

  // Baris 2: Vol -10%, Vol +10%, Queue, Mode 24/7
  const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("music_vol_down")
      .setLabel(t(lang, "buttons.vol_down"))
      .setEmoji("🔉")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("music_vol_up")
      .setLabel(t(lang, "buttons.vol_up"))
      .setEmoji("🔊")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("music_show_queue")
      .setLabel(t(lang, "buttons.queue"))
      .setEmoji("📜")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("music_toggle_247")
      .setLabel(`${t(lang, "buttons.mode247")}: ${is247 ? "ON" : "OFF"}`)
      .setEmoji("⏳")
      .setStyle(is247 ? ButtonStyle.Success : ButtonStyle.Secondary)
  );

  return [row1, row2];
}

/**
 * Membuat Embed Antrean (/queue) Multibahasa lengkap dengan bagian Rekomendasi Autoplay
 */
export function buildQueueEmbed(player: Player, guildName: string): EmbedBuilder {
  const lang = getGuildLanguage(player.guildId);
  const current = player.queue.current;
  const tracks = player.queue.tracks;
  const isAutoplay = player.get("autoplay") === true;
  const autoNext: Track | null = player.get("autoplay_next_track");

  const embed = new EmbedBuilder()
    .setColor(config.embedColors.queue as any)
    .setTitle(t(lang, "queue.title", { guild: guildName }))
    .setTimestamp();

  if (current) {
    const badge = getSourceBadge(current.info.sourceName, current.info.uri);
    embed.setDescription(
      t(lang, "queue.now_playing", {
        title: current.info.title,
        uri: current.info.uri || "https://discord.com",
        duration: formatDuration(current.info.duration),
        source: badge
      })
    );
  } else {
    embed.setDescription(t(lang, "queue.empty_now_playing"));
  }

  // Tampilkan hingga 10 lagu antrean
  if (tracks.length > 0) {
    const list = tracks
      .slice(0, 10)
      .map((tTrack, index) => {
        const req = tTrack.requester ? `<@${(tTrack.requester as any).id || tTrack.requester}>` : "Anon";
        return `\`${index + 1}.\` [${tTrack.info.title}](${tTrack.info.uri || "https://discord.com"}) - \`${formatDuration(tTrack.info.duration)}\` (${req})`;
      })
      .join("\n");

    const remaining = tracks.length - 10;
    const remainingText = remaining > 0 ? t(lang, "queue.and_more", { count: remaining }) : "";

    const totalDuration = tracks.reduce((acc, trk) => acc + (trk.info.duration || 0), 0);

    embed.addFields({
      name: t(lang, "queue.tracks_in_queue", { count: tracks.length, duration: formatDuration(totalDuration) }),
      value: `${list}${remainingText}`,
      inline: false
    });
  } else {
    embed.addFields({
      name: "📋 " + t(lang, "buttons.queue"),
      value: t(lang, "queue.queue_empty"),
      inline: false
    });
  }

  // Bagian Khusus Rekomendasi Autoplay Berikutnya
  if (isAutoplay) {
    if (autoNext) {
      embed.addFields({
        name: t(lang, "queue.autoplay_next_title"),
        value: t(lang, "queue.autoplay_next_desc", {
          title: autoNext.info.title,
          uri: autoNext.info.uri || "https://discord.com",
          author: autoNext.info.author,
          duration: formatDuration(autoNext.info.duration)
        }),
        inline: false
      });
    } else {
      embed.addFields({
        name: t(lang, "queue.autoplay_next_title"),
        value: t(lang, "queue.autoplay_analyzing"),
        inline: false
      });
    }
  } else {
    embed.addFields({
      name: t(lang, "queue.autoplay_next_title"),
      value: t(lang, "queue.autoplay_off_desc"),
      inline: false
    });
  }

  embed.setFooter({
    text: `Loop: ${player.repeatMode.toUpperCase()} | Autoplay: ${isAutoplay ? "ON" : "OFF"} | 24/7: ${player.get("mode_247") ? "ON" : "OFF"}`,
    iconURL: getBotAvatar()
  });

  return embed;
}

/**
 * Menghapus pesan Now Playing lama dari channel
 */
export async function cleanOldNowPlayingMessage(player: Player, client: DiawwBotClient): Promise<void> {
  const oldMsgId = player.get<string>("nowplaying_msg_id");
  const oldChannelId = player.get<string>("nowplaying_channel_id");

  if (!oldMsgId || !oldChannelId) return;

  try {
    const channel = (await client.channels.fetch(oldChannelId).catch(() => null)) as TextChannel | null;
    if (channel) {
      const msg = await channel.messages.fetch(oldMsgId).catch(() => null);
      if (msg && "delete" in msg && typeof (msg as Message).delete === "function") {
        await (msg as Message).delete().catch(() => {});
      }
    }
  } catch (err) {
    // Ignore error jika pesan sudah dihapus sebelumnya
  } finally {
    player.set("nowplaying_msg_id", null);
  }
}

/**
 * Menghancurkan player secara instan, keluar dari voice channel, dan bersihkan pesan kartu pemutar
 */
export async function destroyAndCleanPlayer(player: Player, client: DiawwBotClient): Promise<void> {
  deletePlayerSession(player.guildId);

  const timer = player.get<NodeJS.Timeout>("disconnect_timeout");
  if (timer) {
    clearTimeout(timer);
    player.set("disconnect_timeout", null);
  }

  const emptyTimer = player.get<NodeJS.Timeout>("empty_vc_timeout");
  if (emptyTimer) {
    clearTimeout(emptyTimer);
    player.set("empty_vc_timeout", null);
  }

  await cleanOldNowPlayingMessage(player, client);

  player.queue.tracks.splice(0, player.queue.tracks.length);

  try {
    await player.stopPlaying(true, false);
  } catch {}

  try {
    await player.disconnect();
  } catch {}

  try {
    await player.destroy("User stop requested");
  } catch {}
}

/**
 * Membersihkan query pencarian pengguna agar ramah dengan search engine Spotify & streaming:
 * Menghapus tanda petik, tag live/vma/performance/official video, kurung noise, dan tahun 4-digit
 */
export function cleanSearchQuery(query: string): string {
  if (!query) return "";
  let clean = query;

  // Hapus tanda kutip dan tanda petik
  clean = clean.replace(/["'“”‘’`]/g, " ");

  // Hapus kurung dan isinya jika memuat noise video/live
  clean = clean.replace(/[\(\[\{][^\)\]\}]*(?:official|video|audio|lyrics|lyric|remaster|hd|4k|mv|live|perform|vma|concert|tour)[^\)\]\}]*[\)\]\}]/gi, " ");
  // Hapus kurung umum
  clean = clean.replace(/[\(\[\{\)\]\}]/g, " ");

  // Hapus kata-kata noise video/konser/acara TV umum
  clean = clean.replace(/\b(?:perform|performance|vma|vmas|live at|live|official video|official audio|music video|lyric video|lyrics|remastered|remaster|hd|4k|mv|visualizer|audio|full video)\b/gi, " ");

  // Hapus tahun 4 digit (misal 2024, 2025, 2026)
  clean = clean.replace(/\b(?:19|20)\d{2}\b/g, " ");

  // Hapus pemisah seperti |, /, \, ~, _
  clean = clean.replace(/[|/\\~_]/g, " ");

  // Rapikan spasi berlebih
  return clean.replace(/\s+/g, " ").trim();
}

/**
 * Sistem Pencarian Cerdas Multi-Tier Berbasis Prioritas Spotify:
 * 1. Jika URL -> langsung cari via link asli
 * 2. Jika judul teks dengan preferredPlatform -> cari sesuai platform tersebut
 * 3. Jika judul teks mode Auto (Default):
 *    a. Prioritaskan SPOTIFY (spsearch:) dengan query asli di player.node
 *    b. Jika kosong / error, coba SPOTIFY dengan query bersih (cleanSearchQuery)
 *    c. Jika player.node gagal/kosong, coba SPOTIFY di seluruh node terhubung lainnya (failover multi-node)
 *    d. Hanya jika Spotify benar-benar nihil di semua node, baru beralih ke YouTube -> Apple Music -> Deezer -> dll.
 */
export async function smartSearch(
  player: Player,
  query: string,
  user: User | any,
  preferredPlatform?: string
): Promise<SearchResult | null> {
  const trimmed = query.trim();

  // 1. Cek apakah input adalah link URL
  if (/^https?:\/\//i.test(trimmed)) {
    const res = await player.search({ query: trimmed }, user);
    return res as SearchResult;
  }

  // 2. Jika platform ditentukan secara spesifik
  if (preferredPlatform && preferredPlatform !== "auto") {
    const platformPrefixMap: Record<string, string> = {
      spotify: "spsearch:",
      youtube: "ytsearch:",
      youtubemusic: "ytmsearch:",
      applemusic: "amsearch:",
      deezer: "dzsearch:",
      soundcloud: "scsearch:",
      yandex: "ymsearch:"
    };

    const prefix = platformPrefixMap[preferredPlatform.toLowerCase()] || "spsearch:";
    try {
      const res = await player.search({ query: `${prefix}${trimmed}` }, user);
      if (res && res.tracks && res.tracks.length > 0) return res as SearchResult;
    } catch {}

    const cleaned = cleanSearchQuery(trimmed);
    if (cleaned && cleaned.toLowerCase() !== trimmed.toLowerCase()) {
      try {
        const res = await player.search({ query: `${prefix}${cleaned}` }, user);
        if (res && res.tracks && res.tracks.length > 0) return res as SearchResult;
      } catch {}
    }
    return null;
  }

  // 3. Mode Auto: PRIORITAS UTAMA SPOTIFY
  const cleaned = cleanSearchQuery(trimmed);
  const spotifyQueries = [trimmed];
  if (cleaned && cleaned.toLowerCase() !== trimmed.toLowerCase()) {
    spotifyQueries.push(cleaned);
  }

  // 3a. Coba cari di node aktif player saat ini
  for (const sq of spotifyQueries) {
    try {
      const res = await player.search({ query: `spsearch:${sq}` }, user);
      if (res && res.tracks && res.tracks.length > 0) {
        return res as SearchResult;
      }
    } catch {}
  }

  // 3b. Jika node saat ini gagal (misal rate-limit atau plugin issue), cari Spotify di node aktif lain
  const altNodes = [...player.LavalinkManager.nodeManager.nodes.values()].filter(
    (n) => n.connected && n.id !== player.node.id
  );

  for (const altNode of altNodes) {
    for (const sq of spotifyQueries) {
      try {
        const altRes = await altNode.search({ query: `spsearch:${sq}` }, user);
        if (altRes && altRes.tracks && altRes.tracks.length > 0) {
          // Ganti player ke node yang berhasil menemukan Spotify secara mulus
          try {
            await player.changeNode(altNode, false);
          } catch {}
          return altRes as SearchResult;
        }
      } catch {}
    }
  }

  // 4. Fallback Tiers: Hanya jika Spotify benar-benar tidak memiliki hasil di semua node
  const fallbackTiers = [
    { name: "YouTube", prefix: "ytsearch:" },
    { name: "Apple Music", prefix: "amsearch:" },
    { name: "Deezer", prefix: "dzsearch:" },
    { name: "SoundCloud", prefix: "scsearch:" },
    { name: "YouTube Music", prefix: "ytmsearch:" },
    { name: "Yandex", prefix: "ymsearch:" }
  ];

  for (const tier of fallbackTiers) {
    try {
      const res = await player.search({ query: `${tier.prefix}${trimmed}` }, user);
      if (res && res.tracks && res.tracks.length > 0) {
        return res as SearchResult;
      }
    } catch {}

    if (cleaned && cleaned.toLowerCase() !== trimmed.toLowerCase()) {
      try {
        const res = await player.search({ query: `${tier.prefix}${cleaned}` }, user);
        if (res && res.tracks && res.tracks.length > 0) {
          return res as SearchResult;
        }
      } catch {}
    }
  }

  return null;
}

/**
 * Inisialisasi LavalinkManager v4 dengan sistem Smart Cold Standby Failover Guard
 */
export function initMusicManager(client: DiawwBotClient): LavalinkManager {
  // Pisahkan node aktif dan node siaga (Cold Standby)
  const activeNodeConfigs = config.lavalink.nodes.filter((n) => !n.standby);
  const standbyNodeConfigs = config.lavalink.nodes.filter((n) => n.standby);

  const manager = new LavalinkManager({
    nodes: activeNodeConfigs.map((node) => ({
      id: node.id,
      host: node.host,
      port: node.port,
      authorization: node.authorization,
      secure: node.secure,
      retryAmount: node.retryAmount || 100,
      retryDelay: node.retryDelay || 15000,
      requestSignalTimeoutMS: node.requestTimeout || 20000,
      heartBeatInterval: 15000,
      enablePingOnStatsCheck: true
    })),
    sendToShard: (guildId: string, payload: any) => {
      client.guilds.cache.get(guildId)?.shard?.send(payload);
    },
    client: {
      id: client.user?.id || process.env.CLIENT_ID || "",
      username: client.user?.username || "DIAWW MUSIC"
    },
    autoSkip: true,
    autoMove: true,
    advancedOptions: {
      playerMigration: {
        concurrency: 5,
        perTargetConcurrency: 2,
        backpressureDelayMs: 50
      }
    },
    playerOptions: {
      clientBasedPositionUpdateInterval: 100,
      defaultSearchPlatform: "spsearch",
      volumeDecrementer: 1,
      onDisconnect: {
        autoReconnect: true,
        autoReconnectOnlyWithTracks: false,
        destroyPlayer: false
      }
    },
    queueOptions: {
      maxPreviousTracks: 50
    }
  });

  // Beritahu log tentang node siaga (Cold Standby)
  for (const standby of standbyNodeConfigs) {
    console.log(
      `[LAVALINK SHIELD] 🛡️ Node '${standby.id}' (${standby.host}:${standby.port}) disiagakan dalam mode Cold Standby (pengaman untuk '${standby.standbyFor || "utama"}'). Koneksi ditahan agar tidak terjadi rate-limit.`
    );
  }

  // Forward Voice Gateway events ke Lavalink
  client.on("raw", (d) => manager.sendRawData(d));

  // Voice State Safety: Keluar otomatis jika bot di-kick atau channel kosong (tanpa mode 24/7)
  client.on("voiceStateUpdate", async (oldState: VoiceState, newState: VoiceState) => {
    // 1. Jika bot itu sendiri dikeluarkan atau dipindahkan dari Voice Channel
    if (oldState.id === client.user?.id) {
      if (!newState.channelId && oldState.channelId) {
        const player = client.lavalink.getPlayer(oldState.guild.id);
        if (player) {
          await destroyAndCleanPlayer(player, client).catch(() => {});
        }
      }
      return;
    }

    // 2. Jika semua user manusia keluar dari Voice Channel (Channel Kosong)
    if (oldState.channelId && oldState.channel) {
      const player = client.lavalink.getPlayer(oldState.guild.id);
      if (player && player.voiceChannelId === oldState.channelId) {
        const is247 = player.get("mode_247") === true;
        if (!is247) {
          const humanMembers = oldState.channel.members.filter((m) => !m.user.bot);
          if (humanMembers.size === 0) {
            let timer = player.get<NodeJS.Timeout>("empty_vc_timeout");
            if (!timer) {
              timer = setTimeout(async () => {
                const currentPl = client.lavalink.getPlayer(oldState.guild.id);
                if (currentPl && currentPl.voiceChannelId === oldState.channelId) {
                  const stillEmpty = oldState.channel?.members.filter((m) => !m.user.bot).size === 0;
                  if (stillEmpty && currentPl.get("mode_247") !== true) {
                    await destroyAndCleanPlayer(currentPl, client).catch(() => {});
                  }
                }
              }, 60000);
              player.set("empty_vc_timeout", timer);
            }
          }
        }
      }
    }

    // 3. Jika ada manusia masuk kembali ke Voice Channel, batalkan timer disconnect
    if (newState.channelId && newState.channel) {
      const player = client.lavalink.getPlayer(newState.guild.id);
      if (player && player.voiceChannelId === newState.channelId) {
        const timer = player.get<NodeJS.Timeout>("empty_vc_timeout");
        if (timer) {
          clearTimeout(timer);
          player.set("empty_vc_timeout", null);
        }
      }
    }
  });

  // Pengaman Cold Standby failover timer
  const standbyTimers = new Map<string, NodeJS.Timeout>();

  // Flag auto-resume satu kali saat bot boot
  let initialResumeDone = false;

  // Anti-Spam Log Throttler: Mencegah konsol banjir log saat ada node publik yang labil
  const lastLogTime = new Map<string, number>();
  const shouldLog = (key: string, cooldownMs = 60000): boolean => {
    const now = Date.now();
    const last = lastLogTime.get(key) || 0;
    if (now - last > cooldownMs) {
      lastLogTime.set(key, now);
      return true;
    }
    return false;
  };

  // Node Manager Events: Koneksi, Rekoneksi, dan Failover Otomatis
  manager.nodeManager.on("connect", async (node) => {
    console.log(`[LAVALINK v4] ✅ Node '${node.id}' (${node.options.host}:${node.options.port}) BERHASIL TERHUBUNG!`);

    // Batalkan timer aktivasi standby jika node utama sudah connect
    const matchingStandbys = standbyNodeConfigs.filter((s) => s.standbyFor === node.id);
    for (const standby of matchingStandbys) {
      const timer = standbyTimers.get(standby.id);
      if (timer) {
        clearTimeout(timer);
        standbyTimers.delete(standby.id);
      }

      // Jika node backup sempat menyala saat node utama mati, sekarang matikan backup kembali ke mode siaga
      if (manager.nodeManager.nodes.has(standby.id)) {
        console.log(`[LAVALINK SHIELD] 🛡️ Node utama '${node.id}' telah pulih! Memutus dan mengembalikan '${standby.id}' ke mode siaga (Cold Standby) agar tidak bentrok.`);
        try {
          const playersOnStandby = [...manager.players.values()].filter((p) => p.node?.id === standby.id);
          for (const pl of playersOnStandby) {
            try {
              await pl.changeNode(node.id, false);
            } catch {}
          }
          await manager.nodeManager.deleteNode(standby.id);
        } catch {}
      }
    }

    // Pulihkan sesi pemutaran HANYA SATU KALI saat pertama kali ada node yang terhubung pasca-boot
    if (!initialResumeDone) {
      initialResumeDone = true;
      setTimeout(() => {
        resumeAllPlayerSessions(client).catch((err) => {
          console.error("[AUTO-RESUME] Gagal memulihkan sesi pemutar:", err);
        });
      }, 1500);
    }
  });

  manager.nodeManager.on("reconnecting", (node) => {
    if (shouldLog(`reconnect_${node.id}`, 60000)) {
      console.log(`[LAVALINK v4] 🔄 Node '${node.id}' sedang mencoba menyambung kembali di background...`);
    }
  });

  manager.nodeManager.on("disconnect", async (node, reason) => {
    if (reason && (reason.code === 4000 || (reason.reason && reason.reason.includes("Too many websocket")))) {
      if (shouldLog(`ratelimit_${node.id}`, 120000)) {
        console.warn(`[LAVALINK v4] ⚠️ Node '${node.id}' terkena pembatasan publik (Rate Limit). Beristirahat sejenak di background.`);
      }
    } else {
      if (shouldLog(`disconnect_${node.id}`, 60000)) {
        console.warn(`[LAVALINK v4] ⚠️ Node '${node.id}' terputus (${reason?.reason || reason?.code || "Jaringan terputus"}).`);
      }
    }

    // Cek apakah ada node standby yang bertugas meng-cover node yang mati ini
    const matchingStandbys = standbyNodeConfigs.filter((s) => s.standbyFor === node.id);
    for (const standby of matchingStandbys) {
      if (standbyTimers.has(standby.id)) continue;

      // Berikan grace period 10 detik. Jika node utama benar-benar mati / belum pulih, aktifkan backup
      const timer = setTimeout(() => {
        standbyTimers.delete(standby.id);

        const primaryNode = manager.nodeManager.nodes.get(node.id);
        const isPrimaryConnected = primaryNode && primaryNode.connected;

        // Jika node utama masih belum terkoneksi, dan backup belum dibuat
        if (!isPrimaryConnected && !manager.nodeManager.nodes.has(standby.id)) {
          console.warn(`[LAVALINK SHIELD] 🚨 Node utama '${node.id}' terputus & tidak kunjung pulih! Mengaktifkan Backup Darurat '${standby.id}' (${standby.host}:${standby.port})...`);
          const created = manager.nodeManager.createNode({
            id: standby.id,
            host: standby.host,
            port: standby.port,
            authorization: standby.authorization,
            secure: standby.secure,
            retryAmount: standby.retryAmount || 50,
            retryDelay: standby.retryDelay || 15000,
            requestSignalTimeoutMS: standby.requestTimeout || 10000,
            heartBeatInterval: 15000,
            enablePingOnStatsCheck: true
          });
          created.connect();
        }
      }, 10000);

      standbyTimers.set(standby.id, timer);
    }
  });

  manager.nodeManager.on("resumed", (node, payload, players) => {
    const playerCount = Array.isArray(players) ? players.length : 0;
    console.log(`[LAVALINK v4] ⚡ Session berhasil di-resume pada node '${node.id}'! (${playerCount} player tersinkronisasi)`);
  });

  manager.nodeManager.on("error", (node, error) => {
    if (shouldLog(`error_${node.id}_${error.message}`, 60000)) {
      if (error.message?.includes("ECONNREFUSED")) {
        console.warn(`[LAVALINK v4] ℹ️ Node '${node.id}' (${node.options.host}:${node.options.port}) belum aktif (Connection Refused).`);
      } else if (error.message?.includes("ECONNRESET") || error.message?.includes("ETIMEDOUT") || error.message?.includes("ENOTFOUND")) {
        console.warn(`[LAVALINK v4] ⚠️ Node '${node.id}' jaringan timeout/gagal resolve, mencoba rekoneksi di background.`);
      } else {
        console.error(`[LAVALINK v4] ❌ Error pada node '${node.id}':`, error.message);
      }
    }
  });

  // Player Event: trackStart
  manager.on("trackStart", async (player: Player, track: Track | null) => {
    if (!track) return;

    const timer = player.get<NodeJS.Timeout>("disconnect_timeout");
    if (timer) {
      clearTimeout(timer);
      player.set("disconnect_timeout", null);
    }

    recordPlayedTrack(player, track);

    // Simpan status sesi pemutar ke SQLite untuk pemulihan otomatis jika bot restart
    saveCurrentPlayerSession(player);

    const isAutoplay = (track as ExtendedTrack).isAutoplay === true;
    player.set("current_is_autoplay", isAutoplay);

    if (player.get("autoplay") === true) {
      prepareAutoplayNextTrack(player, client, track).catch(() => {});
    }

    await cleanOldNowPlayingMessage(player, client);

    if (player.textChannelId) {
      try {
        const channel = (await client.channels.fetch(player.textChannelId).catch(() => null)) as TextChannel | null;
        if (channel) {
          const embed = buildNowPlayingEmbed(player, track);
          const components = buildNowPlayingComponents(player);

          const msg = await channel.send({ embeds: [embed], components });
          player.set("nowplaying_msg_id", msg.id);
          player.set("nowplaying_channel_id", msg.channelId);
        }
      } catch (sendErr) {
        console.error("[MUSIC MANAGER] Gagal mengirim pesan now playing:", sendErr);
      }
    }
  });

  // Player Event: queueEnd
  manager.on("queueEnd", async (player: Player, track: any) => {
    const lang = getGuildLanguage(player.guildId);

    // 1. Cek Autoplay
    if (player.get("autoplay") === true) {
      let nextTrack: Track | null = player.get("autoplay_next_track");

      if (!nextTrack && track) {
        await prepareAutoplayNextTrack(player, client, track as Track);
        nextTrack = player.get("autoplay_next_track");
      }

      if (nextTrack) {
        player.set("autoplay_next_track", null);
        (nextTrack as ExtendedTrack).isAutoplay = true;

        player.queue.add(nextTrack);
        await player.play();
        return;
      }
    }

    // 2. Cek Mode 24/7
    deletePlayerSession(player.guildId);
    const guildSettings = getGuildSettings(player.guildId);
    const is247 = player.get("mode_247") === true || guildSettings.mode_247 === 1;

    if (is247) {
      if (player.textChannelId) {
        try {
          const channel = (await client.channels.fetch(player.textChannelId).catch(() => null)) as TextChannel | null;
          if (channel) {
            const embed = createInfoEmbed(
              t(lang, "events.queue_end_247_title"),
              t(lang, "events.queue_end_247_desc")
            );
            await channel.send({ embeds: [embed] });
          }
        } catch {}
      }
      return;
    }

    // 3. Mode Normal (Non-24/7): Beritahu dan hitung mundur 60 detik untuk keluar
    if (player.textChannelId) {
      try {
        const channel = (await client.channels.fetch(player.textChannelId).catch(() => null)) as TextChannel | null;
        if (channel) {
          const embed = createWarningEmbed(
            t(lang, "events.queue_end_countdown_title"),
            t(lang, "events.queue_end_countdown_desc")
          );
          await channel.send({ embeds: [embed] });
        }
      } catch {}
    }

    const disconnectTimer = setTimeout(async () => {
      if (!player.queue.current && player.queue.tracks.length === 0 && !player.get("mode_247")) {
        await destroyAndCleanPlayer(player, client);
      }
    }, config.lavalink.disconnectTimeout || 60000);

    player.set("disconnect_timeout", disconnectTimer);
  });

  // Player Event: playerDisconnect
  manager.on("playerDisconnect", async (player: Player) => {
    await cleanOldNowPlayingMessage(player, client);
  });

  return manager;
}
