import { EmbedBuilder, TextChannel } from "discord.js";
import { Player, Track } from "lavalink-client";
import { DiawwBotClient } from "../client";
import { config } from "../config";
import {
  deletePlayerSession,
  getAllPlayerSessions,
  PlayerSessionRow,
  updatePlayerSessionPosition,
  upsertPlayerSession
} from "../database/schema";
import { getBotAvatar } from "../utils/embeds";
import { formatDuration } from "../utils/time";

let hasResumedSessions = false;
let persistenceInterval: NodeJS.Timeout | null = null;

/**
 * Menyimpan seluruh data player yang sedang aktif ke dalam database SQLite
 */
export function saveCurrentPlayerSession(player: Player): void {
  if (!player.queue.current || !player.voiceChannelId) {
    deletePlayerSession(player.guildId);
    return;
  }

  const current = player.queue.current;
  const currentData = {
    encoded: current.encoded,
    info: { ...current.info },
    requester: current.requester
  };

  const queueData = player.queue.tracks.slice(0, 50).map((t) => ({
    encoded: t.encoded,
    info: { ...t.info },
    requester: t.requester
  }));

  const sessionRow: PlayerSessionRow = {
    guild_id: player.guildId,
    voice_channel_id: player.voiceChannelId,
    text_channel_id: player.textChannelId || null,
    current_track: JSON.stringify(currentData),
    position: Math.max(0, Math.floor(player.position || 0)),
    queue_tracks: JSON.stringify(queueData),
    volume: player.volume || 80,
    repeat_mode: player.repeatMode || "off",
    autoplay: player.get("autoplay") === true ? 1 : 0,
    mode_247: player.get("mode_247") === true ? 1 : 0,
    updated_at: Date.now()
  };

  upsertPlayerSession(sessionRow);
}

/**
 * Menyimpan seluruh sesi player aktif saat ini sebelum bot shutdown/restart
 */
export function saveAllActiveSessions(client: DiawwBotClient): void {
  if (!client.lavalink || !client.lavalink.players) return;

  for (const player of client.lavalink.players.values()) {
    try {
      if (player.queue.current && player.voiceChannelId) {
        saveCurrentPlayerSession(player);
      }
    } catch (err) {
      console.error(`[SESSION PERSISTENCE] Gagal menyimpan sesi Guild ${player.guildId}:`, err);
    }
  }
}

/**
 * Memulai loop interval background ringan (tiap 5 detik) untuk memperbarui posisi detik pemutaran lagu
 */
export function startSessionPersistence(client: DiawwBotClient): void {
  if (persistenceInterval) return;

  persistenceInterval = setInterval(() => {
    if (!client.lavalink || !client.lavalink.players) return;

    for (const player of client.lavalink.players.values()) {
      try {
        if (player.playing && player.queue.current) {
          const currentPos = Math.max(0, Math.floor(player.position || 0));
          updatePlayerSessionPosition(player.guildId, currentPos);
        }
      } catch {}
    }
  }, 5000);
}

/**
 * Menghentikan loop persistence
 */
export function stopSessionPersistence(): void {
  if (persistenceInterval) {
    clearInterval(persistenceInterval);
    persistenceInterval = null;
  }
}

/**
 * Memulihkan seluruh sesi musik yang tersimpan setelah bot restart/reboot
 */
export async function resumeAllPlayerSessions(client: DiawwBotClient): Promise<void> {
  if (hasResumedSessions) return;
  hasResumedSessions = true;

  const sessions = getAllPlayerSessions();
  if (sessions.length === 0) {
    console.log("[AUTO-RESUME] ℹ️ Tidak ada sesi musik tersimpan yang perlu dipulihkan.");
    return;
  }

  console.log(`[AUTO-RESUME] 🔄 Ditemukan ${sessions.length} sesi musik sebelumnya. Memulai pemulihan otomatis...`);

  for (const session of sessions) {
    try {
      const guild = client.guilds.cache.get(session.guild_id);
      if (!guild) {
        deletePlayerSession(session.guild_id);
        continue;
      }

      const voiceChannel = guild.channels.cache.get(session.voice_channel_id);
      if (!voiceChannel) {
        deletePlayerSession(session.guild_id);
        continue;
      }

      // Re-create player
      let player = client.lavalink.getPlayer(session.guild_id);
      if (!player) {
        player = client.lavalink.createPlayer({
          guildId: session.guild_id,
          voiceChannelId: session.voice_channel_id,
          textChannelId: session.text_channel_id || undefined,
          selfDeaf: true,
          volume: session.volume || 80
        });
      }

      player.set("autoplay", session.autoplay === 1);
      player.set("mode_247", session.mode_247 === 1);
      player.setRepeatMode((session.repeat_mode as any) || "off");

      if (!player.connected) {
        await player.connect();
      }

      // Restore current track
      const curData = JSON.parse(session.current_track);
      let curTrack: Track | null = null;

      if (curData.encoded && curData.info) {
        try {
          curTrack = client.lavalink.utils.buildTrack(curData, curData.requester) as Track;
        } catch {}
      }

      if (!curTrack && curData.info) {
        const searchRes = await player.search(
          { query: curData.info.uri || curData.info.title },
          curData.requester || { id: client.user?.id, username: "Auto-Resume" }
        );
        if (searchRes && searchRes.tracks.length > 0) {
          curTrack = searchRes.tracks[0] as Track;
        }
      }

      if (!curTrack) {
        deletePlayerSession(session.guild_id);
        continue;
      }

      player.queue.add(curTrack);

      // Restore remaining queue tracks
      if (session.queue_tracks) {
        try {
          const qList = JSON.parse(session.queue_tracks);
          if (Array.isArray(qList)) {
            for (const item of qList) {
              if (item.encoded && item.info) {
                try {
                  const t = client.lavalink.utils.buildTrack(item, item.requester) as Track;
                  player.queue.add(t);
                } catch {}
              }
            }
          }
        } catch {}
      }

      // Jalankan pemutaran langsung dari posisi detik terakhir yang tersimpan!
      const safePosition = Math.max(0, session.position || 0);
      await player.play({
        position: safePosition
      });

      console.log(
        `[AUTO-RESUME] ✅ Berhasil melanjutkan audio di server '${guild.name}' pada menit ${formatDuration(safePosition)}!`
      );

      // Kirimkan notifikasi ramah ke text channel pemutar
      if (session.text_channel_id) {
        const textChannel = guild.channels.cache.get(session.text_channel_id) as TextChannel | null;
        if (textChannel && textChannel.isTextBased()) {
          const resumeEmbed = new EmbedBuilder()
            .setColor(config.embedColors.success as any)
            .setTitle("🛡️ PEMULIHAN MUSIK OTOMATIS (AUTO-RESUME)")
            .setDescription(
              `Bot baru saja selesai *restart* dan **berhasil menyambungkan kembali musikmu secara otomatis**!\n\n` +
              `🎵 **Lagu:** [${curTrack.info.title}](${curTrack.info.uri || "https://discord.com"})\n` +
              `👤 **Artis:** **${curTrack.info.author || "Unknown"}**\n` +
              `⏱️ **Melanjutkan Dari:** \`${formatDuration(safePosition)}\` di saluran <#${session.voice_channel_id}>\n` +
              `📋 **Sisa Antrean:** \`${player.queue.tracks.length} lagu\``
            )
            .setThumbnail(curTrack.info.artworkUrl || (curTrack.info as any).thumbnail || null)
            .setTimestamp()
            .setFooter({ text: "DIAWW MUSIC • Crash & Restart Shield", iconURL: getBotAvatar() });

          await textChannel.send({ embeds: [resumeEmbed] }).catch(() => {});
        }
      }
    } catch (err: any) {
      console.error(`[AUTO-RESUME] ❌ Gagal memulihkan sesi guild ${session.guild_id}:`, err.message);
      deletePlayerSession(session.guild_id);
    }
  }
}
