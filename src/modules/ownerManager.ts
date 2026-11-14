import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  EmbedBuilder,
  Guild,
  Message,
  TextChannel,
  User
} from "discord.js";
import os from "node:os";
import { DiawwBotClient } from "../client";
import { getDatabase } from "../database/db";
import { createBaseEmbed, createErrorEmbed, createSuccessEmbed, getBotAvatar } from "../utils/embeds";
import { formatDuration } from "../utils/time";
import { saveAllActiveSessions, stopSessionPersistence } from "./sessionManager";

export const DEFAULT_OWNER_ID = "1157912761184026764";

/**
 * Memeriksa apakah suatu user ID adalah Owner Bot
 */
export function isOwner(userId: string, client?: DiawwBotClient): boolean {
  const configuredOwnerId = client?.config.owner.id || DEFAULT_OWNER_ID;
  return userId === configuredOwnerId || userId === DEFAULT_OWNER_ID;
}

/**
 * Mengirimkan laporan/aduan user ke DM Personal Owner
 */
export async function forwardReportToOwner(
  client: DiawwBotClient,
  data: {
    user: User;
    guild: Guild;
    channelName: string;
    content: string;
  }
): Promise<boolean> {
  const ownerId = client.config.owner.id || DEFAULT_OWNER_ID;

  try {
    const owner = await client.users.fetch(ownerId).catch(() => null);
    if (!owner) {
      console.error(`[REPORT SYSTEM] ❌ Tidak dapat menemukan user Owner dengan ID: ${ownerId}`);
      return false;
    }

    const embed = new EmbedBuilder()
      .setColor(client.config.embedColors.warning as any)
      .setTitle("📩 [LAPORAN ADUAN PENGGUNA MASUK]")
      .setDescription(
        `Ada pesan support/aduan baru dari pengguna bot di server **${data.guild.name}**:\n\n` +
        `>>> **"${data.content}"**`
      )
      .addFields(
        {
          name: "👤 Pengirim",
          value: `• Nama: **${data.user.tag}**\n• Mention: <@${data.user.id}>\n• User ID: \`${data.user.id}\``,
          inline: true
        },
        {
          name: "🏰 Server Discord",
          value: `• Nama: **${data.guild.name}**\n• Guild ID: \`${data.guild.id}\`\n• Member: **${data.guild.memberCount}** warga\n• Saluran: \`#${data.channelName}\``,
          inline: true
        },
        {
          name: "💡 Cara Membalas Aduan Ini",
          value: `Ketik langsung di DM ini:\n\`reply ${data.user.id} <pesan balasan kamu>\`\n*(Bot akan langsung mengirimkan pesan balasanmu ke DM user tersebut)*`,
          inline: false
        }
      )
      .setThumbnail(data.user.displayAvatarURL({ size: 256 }))
      .setTimestamp()
      .setFooter({
        text: `DIAWW MUSIC • Report Dispatcher • User ID: ${data.user.id}`,
        iconURL: getBotAvatar()
      });

    await owner.send({ embeds: [embed] });
    console.log(`[REPORT SYSTEM] ✅ Berhasil meneruskan aduan dari ${data.user.tag} ke DM Owner (${ownerId})`);
    return true;
  } catch (err: any) {
    console.error("[REPORT SYSTEM] ❌ Gagal mengirim DM ke Owner:", err.message);
    return false;
  }
}

/**
 * Membuat Embed Dashboard Menu Utama Owner Panel
 */
export function buildOwnerPanelEmbed(client: DiawwBotClient): { embed: EmbedBuilder; components: ActionRowBuilder<ButtonBuilder>[] } {
  const totalGuilds = client.guilds.cache.size;
  const totalUsers = client.guilds.cache.reduce((acc, g) => acc + (g.memberCount || 0), 0);
  const activePlayers = client.lavalink ? client.lavalink.players.size : 0;
  const uptime = formatDuration(process.uptime() * 1000);

  const embed = new EmbedBuilder()
    .setColor(client.config.embedColors.primary as any)
    .setTitle("👑 DIAWW MUSIC • OWNER CONTROL PANEL (PRIVATE DM)")
    .setDescription(
      `Selamat datang di **Owner Control Panel**!\n` +
      `Dari DM personal ini, kamu memiliki kontrol penuh atas bot, statistik kesehatan sistem, manajemen server, dan respon aduan pengguna.\n\n` +
      `📊 **Ringkasan Cepat:**\n` +
      `• Server Terhubung: **${totalGuilds} Server**\n` +
      `• Total Pengguna: **~${totalUsers.toLocaleString()} Members**\n` +
      `• Pemutar Musik Aktif: **${activePlayers} Guild**\n` +
      `• Uptime Bot: **${uptime}**`
    )
    .addFields(
      {
        name: "🛠️ Perintah Teks Owner DM yang Tersedia:",
        value:
          `• \`stats\` / \`health\` — Cek metrik lengkap RAM, CPU, Lavalink nodes & SQLite.\n` +
          `• \`servers\` / \`guilds\` — Lihat seluruh daftar server tempat bot berada.\n` +
          `• \`leave <guild_id>\` — Perintahkan bot keluar dari server tertentu.\n` +
          `• \`reply <user_id> <pesan>\` — Balas aduan laporan user langsung ke DM mereka.\n` +
          `• \`broadcast <pesan>\` — Kirim pengumuman HANYA ke server yang sedang aktif memutar musik.\n` +
          `• \`broadcast all <pesan>\` — Kirim pengumuman ke seluruh server tanpa terkecuali.\n` +
          `• \`restart\` — Restart bot process secara graceful.\n` +
          `• \`eval <code>\` — Eksekusi kode JavaScript/TypeScript langsung.`,
        inline: false
      }
    )
    .setTimestamp()
    .setFooter({ text: "DIAWW MUSIC • Owner Private Console", iconURL: getBotAvatar() });

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("owner_refresh_stats")
      .setLabel("Statistik Kesehatan")
      .setEmoji("📊")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId("owner_list_servers")
      .setLabel("Daftar Server")
      .setEmoji("🌐")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("owner_restart_confirm")
      .setLabel("Restart Bot")
      .setEmoji("🔄")
      .setStyle(ButtonStyle.Danger)
  );

  return { embed, components: [row] };
}

/**
 * Membuat Embed Status Kesehatan Sistem Lengkap (Health & Statistics)
 */
export function buildOwnerSystemStatsEmbed(client: DiawwBotClient): EmbedBuilder {
  const mem = process.memoryUsage();
  const ramRss = (mem.rss / 1024 / 1024).toFixed(1);
  const ramHeapUsed = (mem.heapUsed / 1024 / 1024).toFixed(1);
  const ramHeapTotal = (mem.heapTotal / 1024 / 1024).toFixed(1);

  const sysTotalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(1);
  const sysFreeMem = (os.freemem() / 1024 / 1024 / 1024).toFixed(1);

  const uptime = formatDuration(process.uptime() * 1000);
  const isBun = typeof (process.versions as any).bun !== "undefined";
  const runtime = isBun ? `Bun v${(process.versions as any).bun}` : `Node.js ${process.version}`;

  // Database Records
  let dbCount = 0;
  try {
    const row = getDatabase().get<{ count: number }>("SELECT COUNT(*) as count FROM guild_settings");
    dbCount = row?.count || 0;
  } catch {}

  // Lavalink Nodes Info
  let nodesInfo = "";
  if (client.lavalink) {
    client.lavalink.nodeManager.nodes.forEach((node) => {
      const stats = node.stats;
      const cpu = stats?.cpu ? `${(stats.cpu.lavalinkLoad * 100).toFixed(1)}% CPU` : "N/A";
      const ram = stats?.memory ? `${(stats.memory.used / 1024 / 1024).toFixed(0)}MB` : "N/A";
      nodesInfo += `• **${node.id}**: ${node.connected ? "🟢 Online" : "🔴 Offline"} (CPU: ${cpu} | RAM: ${ram})\n`;
    });
  }
  if (!nodesInfo) nodesInfo = "• *Tidak ada node Lavalink yang terdaftar*";

  return new EmbedBuilder()
    .setColor(client.config.embedColors.primary as any)
    .setTitle("🩺 Status Kesehatan Sistem & Diagnostik Lengkap")
    .addFields(
      {
        name: "💻 Host & Runtime",
        value:
          `• Runtime: **${runtime}**\n` +
          `• Platform OS: **${os.platform()} (${os.arch()})**\n` +
          `• Uptime Bot: **${uptime}**\n` +
          `• Discord WS Ping: **${client.ws.ping} ms**`,
        inline: true
      },
      {
        name: "🧠 Alokasi Memory RAM",
        value:
          `• Bot Heap: **${ramHeapUsed} MB / ${ramHeapTotal} MB**\n` +
          `• Bot RSS: **${ramRss} MB**\n` +
          `• Host RAM: **${sysFreeMem} GB Free / ${sysTotalMem} GB Total**`,
        inline: true
      },
      {
        name: "💾 Database SQLite",
        value: `• Mode: **WAL (Write-Ahead Logging)**\n• Total Guild Terdaftar: **${dbCount} Server**`,
        inline: true
      },
      {
        name: "🎵 Lavalink v4 & Pemutar Musik",
        value:
          `• Pemutar Aktif: **${client.lavalink ? client.lavalink.players.size : 0} Guild**\n` +
          nodesInfo,
        inline: false
      }
    )
    .setTimestamp()
    .setFooter({ text: "DIAWW MUSIC • System Diagnostics", iconURL: getBotAvatar() });
}

/**
 * Membuat daftar seluruh server yang menggunakan bot
 */
export function buildOwnerServerListEmbed(client: DiawwBotClient): EmbedBuilder[] {
  const guilds = Array.from(client.guilds.cache.values()).sort(
    (a, b) => (b.memberCount || 0) - (a.memberCount || 0)
  );

  const embeds: EmbedBuilder[] = [];
  const chunkSize = 15;

  for (let i = 0; i < guilds.length; i += chunkSize) {
    const chunk = guilds.slice(i, i + chunkSize);
    const pageNum = Math.floor(i / chunkSize) + 1;
    const totalPages = Math.ceil(guilds.length / chunkSize) || 1;

    const listText = chunk
      .map((g, idx) => {
        const isPlaying = client.lavalink?.getPlayer(g.id)?.playing;
        const statusEmoji = isPlaying ? "🎵 [Playing]" : "💤 [Idle]";
        return `\`${i + idx + 1}.\` **${g.name}**\n` +
               `   🆔 \`${g.id}\` • 👥 **${(g.memberCount || 0).toLocaleString()}** warga • ${statusEmoji}`;
      })
      .join("\n\n");

    const embed = new EmbedBuilder()
      .setColor(client.config.embedColors.primary as any)
      .setTitle(`🌐 Daftar Server Pengguna DIAWW MUSIC (Hal. ${pageNum}/${totalPages})`)
      .setDescription(
        `Total Server: **${guilds.length} Guilds** • Total Pengguna Terjangkau: **~${guilds.reduce((a, b) => a + (b.memberCount || 0), 0).toLocaleString()}**\n\n` +
        listText
      )
      .setFooter({
        text: `Ketik 'leave <guild_id>' untuk mengeluarkan bot dari server tertentu.`,
        iconURL: getBotAvatar()
      })
      .setTimestamp();

    embeds.push(embed);
  }

  if (embeds.length === 0) {
    embeds.push(
      createBaseEmbed("Daftar Server", "Bot saat ini belum bergabung ke server manapun.")
    );
  }

  return embeds;
}

/**
 * Handler Utama Pesan DM Personal dari Owner
 */
export async function handleOwnerDM(client: DiawwBotClient, message: Message): Promise<void> {
  const content = message.content.trim();
  if (!content) return;

  const [commandName, ...args] = content.split(/\s+/);
  const cmd = commandName.toLowerCase();

  switch (cmd) {
    case "menu":
    case "panel":
    case "help":
    case "start": {
      const panel = buildOwnerPanelEmbed(client);
      await message.reply({ embeds: [panel.embed], components: panel.components });
      break;
    }

    case "stats":
    case "health":
    case "system":
    case "ping": {
      const statsEmbed = buildOwnerSystemStatsEmbed(client);
      await message.reply({ embeds: [statsEmbed] });
      break;
    }

    case "servers":
    case "guilds":
    case "serverlist": {
      const embeds = buildOwnerServerListEmbed(client);
      // Kirim halaman pertama (atau maksimal 3 halaman pertama jika banyak)
      for (const emb of embeds.slice(0, 3)) {
        await message.reply({ embeds: [emb] });
      }
      break;
    }

    case "leave": {
      const guildId = args[0];
      if (!guildId) {
        await message.reply({
          embeds: [createErrorEmbed("Format Salah", "Gunakan format: `leave <guild_id>`")]
        });
        return;
      }

      const guild = client.guilds.cache.get(guildId);
      if (!guild) {
        await message.reply({
          embeds: [createErrorEmbed("Tidak Ditemukan", `Bot tidak berada di server dengan ID: \`${guildId}\``)]
        });
        return;
      }

      // Hentikan player jika ada
      try {
        const player = client.lavalink?.getPlayer(guildId);
        if (player) {
          player.disconnect();
          player.destroy("Owner forced leave");
        }
      } catch {}

      const guildName = guild.name;
      await guild.leave();

      await message.reply({
        embeds: [createSuccessEmbed("Berhasil Keluar", `Bot telah resmi keluar dari server **${guildName}** (\`${guildId}\`).`)]
      });
      break;
    }

    case "reply":
    case "balas": {
      const targetUserId = args[0];
      const replyMessage = args.slice(1).join(" ");

      if (!targetUserId || !replyMessage) {
        await message.reply({
          embeds: [
            createErrorEmbed(
              "Format Salah",
              "Gunakan format: `reply <user_id> <pesan balasan>`\nContoh: `reply 1234567890 Halo! Masalah lagu sudah kami atasi.`"
            )
          ]
        });
        return;
      }

      try {
        const targetUser = await client.users.fetch(targetUserId).catch(() => null);
        if (!targetUser) {
          await message.reply({
            embeds: [createErrorEmbed("User Tidak Ditemukan", `Tidak dapat menemukan user Discord dengan ID: \`${targetUserId}\``)]
          });
          return;
        }

        const replyEmbed = new EmbedBuilder()
          .setColor(client.config.embedColors.success as any)
          .setTitle("📩 Tanggapan Resmi dari Developer DIAWW MUSIC")
          .setDescription(
            `Halo **${targetUser.username}**!\n` +
            `Developer DIAWW MUSIC telah menanggapi laporan/aduan yang kamu kirimkan:\n\n` +
            `>>> **"${replyMessage}"**\n\n` +
            `*Terima kasih telah membantu kami meningkatkan kualitas bot DIAWW MUSIC!*`
          )
          .setTimestamp()
          .setFooter({ text: "DIAWW MUSIC • Developer Support Response", iconURL: getBotAvatar() });

        await targetUser.send({ embeds: [replyEmbed] });

        await message.reply({
          embeds: [
            createSuccessEmbed(
              "Balasan Terkirim",
              `Pesan balasan resmi berhasil dikirimkan langsung ke DM **${targetUser.tag}** (\`${targetUserId}\`).`
            )
          ]
        });
      } catch (err: any) {
        await message.reply({
          embeds: [
            createErrorEmbed(
              "Gagal Mengirim DM",
              `Gagal mengirimkan balasan ke user: ${err.message}\n(Kemungkinan DM user tersebut ditutup/di-block).`
            )
          ]
        });
      }
      break;
    }

    case "broadcast":
    case "bc": {
      if (!args[0]) {
        await message.reply({
          embeds: [
            createErrorEmbed(
              "Format Salah",
              "Gunakan salah satu format berikut:\n" +
              "• `broadcast <pesan>` — Kirim HANYA ke server yang **sedang aktif memutar musik / menggunakan bot**.\n" +
              "• `broadcast all <pesan>` — Kirim ke **semua server** tanpa terkecuali."
            )
          ]
        });
        return;
      }

      const isAllMode = args[0].toLowerCase() === "all";
      const broadcastMsg = isAllMode ? args.slice(1).join(" ") : args.join(" ");

      if (!broadcastMsg) {
        await message.reply({
          embeds: [createErrorEmbed("Format Salah", "Pesan pengumuman tidak boleh kosong!")]
        });
        return;
      }

      const broadcastEmbed = new EmbedBuilder()
        .setColor(client.config.embedColors.primary as any)
        .setTitle("📢 PENGUMUMAN RESMI DEVELOPER • DIAWW MUSIC")
        .setDescription(broadcastMsg)
        .setTimestamp()
        .setFooter({ text: "DIAWW MUSIC • Official Announcement", iconURL: getBotAvatar() });

      // ========================================================================
      // MODE 1: HANYA SERVER YANG SEDANG AKTIF MENGGUNAKAN BOT / MEMUTAR MUSIK
      // ========================================================================
      if (!isAllMode) {
        const activeTargets: Array<{ guild: Guild; channel: TextChannel; currentTrack?: string }> = [];

        if (client.lavalink) {
          for (const [guildId, player] of client.lavalink.players.entries()) {
            if (
              player &&
              player.connected &&
              player.voiceChannelId &&
              (player.playing || player.paused || player.queue.current)
            ) {
              const guild = client.guilds.cache.get(guildId);
              if (!guild) continue;

              const textChannelId = player.textChannelId;
              if (!textChannelId) continue;

              const channel = guild.channels.cache.get(textChannelId) as TextChannel | null;
              if (channel && channel.isTextBased()) {
                activeTargets.push({
                  guild,
                  channel,
                  currentTrack: player.queue.current?.info?.title || "Audio Stream"
                });
              }
            }
          }
        }

        if (activeTargets.length === 0) {
          await message.reply({
            embeds: [
              createBaseEmbed(
                "Tidak Ada Server Aktif",
                "⚠️ Saat ini **tidak ada server yang sedang memutar musik atau menggunakan bot**.\n\n" +
                "Broadcast dibatalkan agar tidak mengganggu channel umum server yang sedang idle.\n" +
                "💡 *Jika kamu tetap ingin mengirim ke semua server tanpa peduli sedang aktif atau tidak, gunakan:* \`broadcast all <pesan>\`"
              )
            ]
          });
          return;
        }

        const progressMsg = await message.reply(
          `📢 Mengirim pengumuman ke **${activeTargets.length} server** yang sedang aktif memutar musik...`
        );

        let successCount = 0;
        const sentServerList: string[] = [];

        for (const target of activeTargets) {
          try {
            await target.channel.send({ embeds: [broadcastEmbed] });
            successCount++;
            sentServerList.push(`• **${target.guild.name}** (Sedang memutar: *${target.currentTrack}*)`);
          } catch (err) {
            console.error(`[BROADCAST ACTIVE] Gagal mengirim ke ${target.guild.name}:`, err);
          }
        }

        await progressMsg.edit({
          content: null,
          embeds: [
            createSuccessEmbed(
              "Broadcast Server Aktif Selesai",
              `Pengumuman berhasil dikirimkan langsung ke text channel pemutar di **${successCount} server aktif**:\n\n` +
              sentServerList.join("\n")
            )
          ]
        });
        break;
      }

      // ========================================================================
      // MODE 2: SELURUH SERVER (broadcast all <pesan>)
      // ========================================================================
      let successCount = 0;
      let failCount = 0;

      const progressMsg = await message.reply("📢 Mengirim pengumuman ke seluruh server...");

      for (const guild of client.guilds.cache.values()) {
        try {
          const channel =
            guild.systemChannel ||
            (guild.channels.cache.find(
              (ch) =>
                ch.isTextBased() &&
                !ch.isVoiceBased() &&
                ch.permissionsFor(guild.members.me || "")?.has(["SendMessages", "ViewChannel"])
            ) as TextChannel | null);

          if (channel) {
            await channel.send({ embeds: [broadcastEmbed] });
            successCount++;
            // Jeda singkat 200ms untuk mencegah Discord REST Rate Limit (429)
            await new Promise((r) => setTimeout(r, 200));
          } else {
            failCount++;
          }
        } catch {
          failCount++;
        }
      }

      await progressMsg.edit({
        content: null,
        embeds: [
          createSuccessEmbed(
            "Broadcast ke Semua Server Selesai",
            `Pengumuman berhasil dikirim ke **${successCount} server**.\n(Gagal di ${failCount} server karena ketiadaan izin channel teks).`
          )
        ]
      });
      break;
    }

    case "restart": {
      await message.reply({
        embeds: [
          createSuccessEmbed(
            "Merestart Bot (Auto-Resume Shield)",
            "Mempersiapkan graceful restart...\nSeluruh sesi pemutar musik aktif disimpan otomatis ke database dan akan langsung dilanjutkan pada detik yang sama setelah bot hidup kembali."
          )
        ]
      });

      console.log("[OWNER ACTION] Restart diperintahkan oleh Owner via DM!");

      // Simpan seluruh sesi musik aktif
      saveAllActiveSessions(client);
      stopSessionPersistence();

      if (client.lavalink) {
        client.lavalink.players.forEach((p) => {
          try {
            p.disconnect();
          } catch {}
        });
      }

      try {
        getDatabase().close();
      } catch {}

      setTimeout(() => {
        process.exit(0);
      }, 1000);
      break;
    }

    case "eval": {
      const code = args.join(" ");
      if (!code) {
        await message.reply("Ketik kode yang ingin dievaluasi: `eval <code>`");
        return;
      }

      try {
        let evaled = eval(code);
        if (typeof evaled !== "string") {
          evaled = require("node:util").inspect(evaled, { depth: 1 });
        }

        if (evaled.length > 1900) {
          evaled = evaled.substring(0, 1900) + "...";
        }

        await message.reply(`\`\`\`javascript\n${evaled}\n\`\`\``);
      } catch (err: any) {
        await message.reply(`\`\`\`javascript\nError: ${err.message}\n\`\`\``);
      }
      break;
    }

    default: {
      const panel = buildOwnerPanelEmbed(client);
      await message.reply({
        content: `Halo Owner! Ketik perintah yang ingin kamu jalankan atau klik tombol di bawah ini:`,
        embeds: [panel.embed],
        components: panel.components
      });
      break;
    }
  }
}

/**
 * Handler Khusus Tombol Interaktif Owner Panel di DM
 */
export async function handleOwnerButton(
  client: DiawwBotClient,
  interaction: ButtonInteraction
): Promise<void> {
  const customId = interaction.customId;
  if (!customId.startsWith("owner_")) return;

  if (!isOwner(interaction.user.id, client)) {
    await interaction.reply({
      content: "❌ Akses Ditolak: Panel ini hanya dapat diakses oleh Owner bot.",
      ephemeral: true
    });
    return;
  }

  switch (customId) {
    case "owner_refresh_stats": {
      const statsEmbed = buildOwnerSystemStatsEmbed(client);
      await interaction.reply({ embeds: [statsEmbed] });
      break;
    }

    case "owner_list_servers": {
      const embeds = buildOwnerServerListEmbed(client);
      await interaction.reply({ embeds: [embeds[0]] });
      break;
    }

    case "owner_restart_confirm": {
      await interaction.reply({
        embeds: [
          createSuccessEmbed(
            "Merestart Bot",
            "Mempersiapkan graceful restart...\nSemua player akan diputuskan dengan rapi dan proses bot akan restart otomatis."
          )
        ]
      });

      console.log("[OWNER ACTION] Restart diperintahkan oleh Owner via Button DM!");

      if (client.lavalink) {
        client.lavalink.players.forEach((p) => {
          try {
            p.disconnect();
            p.destroy("Restarting bot");
          } catch {}
        });
      }

      try {
        getDatabase().close();
      } catch {}

      setTimeout(() => {
        process.exit(0);
      }, 1000);
      break;
    }

    default:
      break;
  }
}
