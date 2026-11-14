import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildMember,
  Message,
  SlashCommandBuilder
} from "discord.js";
import { Command, DiawwBotClient } from "../../client";
import {
  addTrackToPlaylist,
  createUserPlaylist,
  deleteUserPlaylist,
  getGuildLanguage,
  getGuildSettings,
  getPlaylistTracks,
  getUserPlaylist,
  getUserPlaylists,
  MAX_TRACKS_PER_PLAYLIST,
  MAX_USER_PLAYLISTS,
  removeTrackFromPlaylist
} from "../../database/schema";
import { t } from "../../i18n";
import { getSourceBadge, smartSearch } from "../../modules/musicManager";
import { createBaseEmbed, createErrorEmbed, createSuccessEmbed, createWarningEmbed, getBotAvatar } from "../../utils/embeds";
import { formatDuration } from "../../utils/time";

const slashData = new SlashCommandBuilder()
  .setName("playlist")
  .setDescription("Manage and play your personal custom music playlists")
  .addSubcommand((sub) =>
    sub
      .setName("create")
      .setDescription("Create a new personal music playlist")
      .addStringOption((opt) =>
        opt
          .setName("name")
          .setDescription("Name of the playlist (1-32 characters)")
          .setRequired(true)
      )
  )
  .addSubcommand((sub) =>
    sub
      .setName("addcurrent")
      .setDescription("Save the currently playing song to one of your playlists")
      .addStringOption((opt) =>
        opt
          .setName("name")
          .setDescription("Name of your playlist")
          .setRequired(true)
          .setAutocomplete(true)
      )
  )
  .addSubcommand((sub) =>
    sub
      .setName("add")
      .setDescription("Add a song or link URL to your playlist")
      .addStringOption((opt) =>
        opt
          .setName("name")
          .setDescription("Name of your playlist")
          .setRequired(true)
          .setAutocomplete(true)
      )
      .addStringOption((opt) =>
        opt
          .setName("query")
          .setDescription("Song title or link URL (Spotify, YouTube, SoundCloud, etc)")
          .setRequired(true)
      )
  )
  .addSubcommand((sub) =>
    sub
      .setName("play")
      .setDescription("Load and play all songs from your playlist into queue")
      .addStringOption((opt) =>
        opt
          .setName("name")
          .setDescription("Name of your playlist to play")
          .setRequired(true)
          .setAutocomplete(true)
      )
  )
  .addSubcommand((sub) =>
    sub
      .setName("list")
      .setDescription("View all of your custom playlists")
  )
  .addSubcommand((sub) =>
    sub
      .setName("view")
      .setDescription("Inspect tracks inside one of your playlists")
      .addStringOption((opt) =>
        opt
          .setName("name")
          .setDescription("Name of the playlist to view")
          .setRequired(true)
          .setAutocomplete(true)
      )
  )
  .addSubcommand((sub) =>
    sub
      .setName("remove")
      .setDescription("Remove a song from your playlist by its track number")
      .addStringOption((opt) =>
        opt
          .setName("name")
          .setDescription("Name of your playlist")
          .setRequired(true)
          .setAutocomplete(true)
      )
      .addIntegerOption((opt) =>
        opt
          .setName("index")
          .setDescription("Track number to remove (1, 2, ...)")
          .setRequired(true)
          .setMinValue(1)
      )
  )
  .addSubcommand((sub) =>
    sub
      .setName("delete")
      .setDescription("Delete an entire playlist")
      .addStringOption((opt) =>
        opt
          .setName("name")
          .setDescription("Name of your playlist to delete")
          .setRequired(true)
          .setAutocomplete(true)
      )
  );

const playlistCommand: Command = {
  name: "playlist",
  description: "Personal custom playlists system (100% Free - Up to 10 playlists @ 50 tracks)",
  aliases: ["pl"],
  category: "music",
  usage: "/playlist <subcommand> or w!pl <create/add/addcurrent/play/list/view/remove/delete>",
  slashData,

  // Autocomplete playlist names for user
  autocomplete: async (interaction: AutocompleteInteraction, _client: DiawwBotClient) => {
    const userId = interaction.user.id;
    const focused = interaction.options.getFocused(true);

    if (focused.name === "name") {
      const playlists = getUserPlaylists(userId);
      const query = focused.value.toLowerCase();
      const filtered = playlists
        .filter((p) => p.name.toLowerCase().includes(query))
        .slice(0, 25)
        .map((p) => ({
          name: `📁 ${p.name} (${p.track_count} tracks)`,
          value: p.name
        }));

      await interaction.respond(filtered).catch(() => {});
    }
  },

  // Slash Command Execution
  executeSlash: async (interaction: ChatInputCommandInteraction, client: DiawwBotClient) => {
    const guildId = interaction.guildId!;
    const lang = getGuildLanguage(guildId);
    const userId = interaction.user.id;
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      // 1. Create Playlist
      case "create": {
        const name = interaction.options.getString("name", true).trim();
        const result = createUserPlaylist(userId, name);

        if (!result.success) {
          if (result.error === "name_length") {
            return interaction.reply({
              embeds: [createWarningEmbed(t(lang, "common.warning_title"), t(lang, "playlist.name_invalid"))],
              ephemeral: true
            });
          }
          if (result.error === "limit_reached") {
            return interaction.reply({
              embeds: [createWarningEmbed(t(lang, "common.warning_title"), t(lang, "playlist.limit_reached"))],
              ephemeral: true
            });
          }
          if (result.error === "already_exists") {
            return interaction.reply({
              embeds: [createErrorEmbed(t(lang, "common.error_title"), t(lang, "playlist.already_exists", { name }))],
              ephemeral: true
            });
          }
          return interaction.reply({
            embeds: [createErrorEmbed(t(lang, "common.error_title"), result.error || "Failed to create playlist")],
            ephemeral: true
          });
        }

        return interaction.reply({
          embeds: [createSuccessEmbed(t(lang, "playlist.title"), t(lang, "playlist.created", { name }))],
          ephemeral: true
        });
      }

      // 2. Add Currently Playing Song
      case "addcurrent": {
        const name = interaction.options.getString("name", true).trim();
        const playlist = getUserPlaylist(userId, name);

        if (!playlist) {
          return interaction.reply({
            embeds: [createErrorEmbed(t(lang, "common.error_title"), t(lang, "playlist.not_found", { name }))],
            ephemeral: true
          });
        }

        const player = client.lavalink.getPlayer(guildId);
        if (!player || !player.queue.current) {
          return interaction.reply({
            embeds: [createWarningEmbed(t(lang, "common.warning_title"), t(lang, "common.no_music_playing"))],
            ephemeral: true
          });
        }

        const currentTrack = player.queue.current;
        const addResult = addTrackToPlaylist(playlist.id, {
          title: currentTrack.info.title,
          uri: currentTrack.info.uri || "",
          author: currentTrack.info.author || "Unknown",
          duration: currentTrack.info.duration || 0,
          source: currentTrack.info.sourceName || "unknown"
        });

        if (!addResult.success) {
          if (addResult.error === "track_limit_reached") {
            return interaction.reply({
              embeds: [createWarningEmbed(t(lang, "common.warning_title"), t(lang, "playlist.track_limit_reached", { name }))],
              ephemeral: true
            });
          }
          return interaction.reply({
            embeds: [createErrorEmbed(t(lang, "common.error_title"), addResult.error || "Failed to add track")],
            ephemeral: true
          });
        }

        return interaction.reply({
          embeds: [
            createSuccessEmbed(
              t(lang, "playlist.title"),
              t(lang, "playlist.track_added", {
                title: currentTrack.info.title,
                uri: currentTrack.info.uri || "https://discord.com",
                name
              })
            )
          ]
        });
      }

      // 3. Add Song via Search/Link
      case "add": {
        const name = interaction.options.getString("name", true).trim();
        const query = interaction.options.getString("query", true).trim();
        const playlist = getUserPlaylist(userId, name);

        if (!playlist) {
          return interaction.reply({
            embeds: [createErrorEmbed(t(lang, "common.error_title"), t(lang, "playlist.not_found", { name }))],
            ephemeral: true
          });
        }

        await interaction.deferReply();

        const hasConnectedNode = [...client.lavalink.nodeManager.nodes.values()].some((n) => n.connected);
        if (!hasConnectedNode) {
          return interaction.editReply({
            embeds: [createWarningEmbed(t(lang, "common.warning_title"), lang === "id" ? "⚠️ Server audio sedang menghubungkan ulang. Silakan coba kembali dalam beberapa saat (10-15 detik)." : "⚠️ Audio server is currently reconnecting. Please try again shortly.")]
          });
        }

        let player = client.lavalink.getPlayer(guildId);
        if (!player) {
          const member = interaction.member as GuildMember;
          const voiceChannelId = member?.voice?.channelId;
          if (!voiceChannelId) {
            return interaction.editReply({
              embeds: [createErrorEmbed(t(lang, "common.error_title"), t(lang, "common.no_voice_channel"))]
            });
          }
          const guildSettings = getGuildSettings(guildId);
          player = client.lavalink.createPlayer({
            guildId,
            voiceChannelId,
            textChannelId: interaction.channelId,
            selfDeaf: true,
            volume: guildSettings.default_volume || 80
          });
        }

        const searchRes = await smartSearch(player, query, interaction.user);
        if (!searchRes || !searchRes.tracks || searchRes.tracks.length === 0) {
          return interaction.editReply({
            embeds: [createErrorEmbed(t(lang, "common.error_title"), t(lang, "play.no_results", { query }))]
          });
        }

        const trackToAdd = searchRes.tracks[0];
        const addResult = addTrackToPlaylist(playlist.id, {
          title: trackToAdd.info.title,
          uri: trackToAdd.info.uri || "",
          author: trackToAdd.info.author || "Unknown",
          duration: trackToAdd.info.duration || 0,
          source: trackToAdd.info.sourceName || "unknown"
        });

        if (!addResult.success) {
          if (addResult.error === "track_limit_reached") {
            return interaction.editReply({
              embeds: [createWarningEmbed(t(lang, "common.warning_title"), t(lang, "playlist.track_limit_reached", { name }))]
            });
          }
          return interaction.editReply({
            embeds: [createErrorEmbed(t(lang, "common.error_title"), addResult.error || "Failed to add track")]
          });
        }

        return interaction.editReply({
          embeds: [
            createSuccessEmbed(
              t(lang, "playlist.title"),
              t(lang, "playlist.track_added", {
                title: trackToAdd.info.title,
                uri: trackToAdd.info.uri || "https://discord.com",
                name
              })
            )
          ]
        });
      }

      // 4. Play Playlist
      case "play": {
        const name = interaction.options.getString("name", true).trim();
        const playlist = getUserPlaylist(userId, name);

        if (!playlist) {
          return interaction.reply({
            embeds: [createErrorEmbed(t(lang, "common.error_title"), t(lang, "playlist.not_found", { name }))],
            ephemeral: true
          });
        }

        const member = interaction.member as GuildMember;
        const voiceChannel = member?.voice?.channel;
        if (!voiceChannel) {
          return interaction.reply({
            embeds: [createErrorEmbed(t(lang, "common.error_title"), t(lang, "common.no_voice_channel"))],
            ephemeral: true
          });
        }

        const tracks = getPlaylistTracks(playlist.id);
        if (!tracks || tracks.length === 0) {
          return interaction.reply({
            embeds: [createWarningEmbed(t(lang, "common.warning_title"), t(lang, "playlist.no_tracks_to_play", { name }))],
            ephemeral: true
          });
        }

        await interaction.deferReply();

        const hasConnectedNode = [...client.lavalink.nodeManager.nodes.values()].some((n) => n.connected);
        if (!hasConnectedNode) {
          return interaction.editReply({
            embeds: [createWarningEmbed(t(lang, "common.warning_title"), lang === "id" ? "⚠️ Server audio sedang menghubungkan ulang. Silakan coba kembali dalam beberapa saat (10-15 detik)." : "⚠️ Audio server is currently reconnecting. Please try again shortly.")]
          });
        }

        const guildSettings = getGuildSettings(guildId);
        let player = client.lavalink.getPlayer(guildId);

        if (!player) {
          player = client.lavalink.createPlayer({
            guildId,
            voiceChannelId: voiceChannel.id,
            textChannelId: interaction.channelId,
            selfDeaf: true,
            volume: guildSettings.default_volume || 80
          });
          player.set("mode_247", guildSettings.mode_247 === 1);
        }

        if (!player.connected) {
          await player.connect();
        }

        let addedCount = 0;
        for (const trk of tracks) {
          try {
            const res = await player.search({ query: trk.uri || trk.title }, interaction.user);
            if (res && res.tracks && res.tracks.length > 0) {
              player.queue.add(res.tracks[0]);
              addedCount++;
            }
          } catch {}
        }

        if (addedCount === 0) {
          return interaction.editReply({
            embeds: [createErrorEmbed(t(lang, "common.error_title"), t(lang, "playlist.no_tracks_to_play", { name }))]
          });
        }

        if (!player.playing && !player.paused) {
          await player.play();
        }

        return interaction.editReply({
          embeds: [
            createSuccessEmbed(
              t(lang, "playlist.title"),
              t(lang, "playlist.playing", { count: addedCount, name })
            )
          ]
        });
      }

      // 5. List User Playlists
      case "list": {
        const playlists = getUserPlaylists(userId);

        if (playlists.length === 0) {
          return interaction.reply({
            embeds: [createBaseEmbed(t(lang, "playlist.list_title", { count: 0 }), t(lang, "playlist.list_empty"))],
            ephemeral: true
          });
        }

        const listText = playlists
          .map((p, idx) => `\`${idx + 1}.\` **${p.name}** — \`${p.track_count}/${MAX_TRACKS_PER_PLAYLIST} songs\` *(Created: ${new Date(p.created_at).toLocaleDateString()})*`)
          .join("\n");

        const embed = new EmbedBuilder()
          .setColor(client.config.embedColors.primary as any)
          .setTitle(t(lang, "playlist.list_title", { count: playlists.length }))
          .setDescription(`${listText}\n\n💡 *Play with:* \`/playlist play name:<name>\` | *View with:* \`/playlist view name:<name>\``)
          .setTimestamp()
          .setFooter({ text: `Quota: ${playlists.length}/${MAX_USER_PLAYLISTS} Playlists`, iconURL: getBotAvatar() });

        return interaction.reply({ embeds: [embed] });
      }

      // 6. View Playlist Tracks
      case "view": {
        const name = interaction.options.getString("name", true).trim();
        const playlist = getUserPlaylist(userId, name);

        if (!playlist) {
          return interaction.reply({
            embeds: [createErrorEmbed(t(lang, "common.error_title"), t(lang, "playlist.not_found", { name }))],
            ephemeral: true
          });
        }

        const tracks = getPlaylistTracks(playlist.id);
        if (tracks.length === 0) {
          return interaction.reply({
            embeds: [createBaseEmbed(t(lang, "playlist.view_title", { name, count: 0 }), t(lang, "playlist.empty", { name }))],
            ephemeral: true
          });
        }

        const trackList = tracks
          .slice(0, 20)
          .map((trk, idx) => {
            const badge = getSourceBadge(trk.source, trk.uri);
            return `\`${idx + 1}.\` [${trk.title}](${trk.uri}) — \`${formatDuration(trk.duration)}\` (${badge})`;
          })
          .join("\n");

        const remaining = tracks.length - 20;
        const remainingText = remaining > 0 ? `\n*...and ${remaining} more tracks*` : "";

        const totalDuration = tracks.reduce((acc, t) => acc + (t.duration || 0), 0);

        const embed = new EmbedBuilder()
          .setColor(client.config.embedColors.queue as any)
          .setTitle(t(lang, "playlist.view_title", { name, count: tracks.length }))
          .setDescription(`${trackList}${remainingText}\n\n⏱️ **Total Duration:** \`${formatDuration(totalDuration)}\``)
          .setTimestamp()
          .setFooter({ text: `Total: ${tracks.length}/${MAX_TRACKS_PER_PLAYLIST} Songs`, iconURL: getBotAvatar() });

        return interaction.reply({ embeds: [embed] });
      }

      // 7. Remove Song from Playlist
      case "remove": {
        const name = interaction.options.getString("name", true).trim();
        const index = interaction.options.getInteger("index", true);
        const playlist = getUserPlaylist(userId, name);

        if (!playlist) {
          return interaction.reply({
            embeds: [createErrorEmbed(t(lang, "common.error_title"), t(lang, "playlist.not_found", { name }))],
            ephemeral: true
          });
        }

        const removeRes = removeTrackFromPlaylist(playlist.id, index);
        if (!removeRes.success || !removeRes.removedTrack) {
          return interaction.reply({
            embeds: [createErrorEmbed(t(lang, "common.error_title"), t(lang, "playlist.invalid_index", { name }))],
            ephemeral: true
          });
        }

        return interaction.reply({
          embeds: [
            createSuccessEmbed(
              t(lang, "playlist.title"),
              t(lang, "playlist.track_removed", {
                title: removeRes.removedTrack.title,
                name
              })
            )
          ]
        });
      }

      // 8. Delete Playlist
      case "delete": {
        const name = interaction.options.getString("name", true).trim();
        const deleted = deleteUserPlaylist(userId, name);

        if (!deleted) {
          return interaction.reply({
            embeds: [createErrorEmbed(t(lang, "common.error_title"), t(lang, "playlist.not_found", { name }))],
            ephemeral: true
          });
        }

        return interaction.reply({
          embeds: [createSuccessEmbed(t(lang, "playlist.title"), t(lang, "playlist.deleted", { name }))],
          ephemeral: true
        });
      }

      default:
        break;
    }
  },

  // Prefix Command Execution (w!pl / w!playlist)
  executePrefix: async (message: Message, args: string[], client: DiawwBotClient) => {
    const guildId = message.guildId!;
    const lang = getGuildLanguage(guildId);
    const userId = message.author.id;
    const sub = (args[0] || "").toLowerCase();

    // Petunjuk jika tidak ada argumen
    if (!sub) {
      const guideEmbed = new EmbedBuilder()
        .setColor(client.config.embedColors.primary as any)
        .setTitle(t(lang, "playlist.title"))
        .setDescription(
          "📂 **Panduan Perintah Custom Playlist (100% Free - Max 10 Playlist @ 50 Lagu):**\n\n" +
          "• `w!pl create <nama>` — Membuat playlist baru\n" +
          "• `w!pl addcurrent <nama>` — Menyimpan lagu yang sedang diputar ke playlist\n" +
          "• `w!pl add <nama> <link/judul>` — Menambahkan lagu tertentu ke playlist\n" +
          "• `w!pl play <nama>` — Memutar seluruh lagu di playlist sekaligus\n" +
          "• `w!pl list` — Melihat daftar seluruh playlist milikmu\n" +
          "• `w!pl view <nama>` — Melihat isi lagu di dalam playlist\n" +
          "• `w!pl remove <nama> <nomor>` — Menghapus lagu tertentu dari playlist\n" +
          "• `w!pl delete <nama>` — Menghapus seluruh playlist"
        )
        .setTimestamp()
        .setFooter({ text: "DIAWW MUSIC • User Playlists", iconURL: getBotAvatar() });

      return message.reply({ embeds: [guideEmbed] });
    }

    switch (sub) {
      case "create": {
        const name = args.slice(1).join(" ").trim();
        if (!name) {
          return message.reply({
            embeds: [createWarningEmbed(t(lang, "common.warning_title"), "Gunakan: `w!pl create <nama_playlist>`")]
          });
        }

        const result = createUserPlaylist(userId, name);
        if (!result.success) {
          if (result.error === "name_length") {
            return message.reply({ embeds: [createWarningEmbed(t(lang, "common.warning_title"), t(lang, "playlist.name_invalid"))] });
          }
          if (result.error === "limit_reached") {
            return message.reply({ embeds: [createWarningEmbed(t(lang, "common.warning_title"), t(lang, "playlist.limit_reached"))] });
          }
          if (result.error === "already_exists") {
            return message.reply({ embeds: [createErrorEmbed(t(lang, "common.error_title"), t(lang, "playlist.already_exists", { name }))] });
          }
          return message.reply({ embeds: [createErrorEmbed(t(lang, "common.error_title"), result.error || "Gagal membuat playlist")] });
        }

        return message.reply({
          embeds: [createSuccessEmbed(t(lang, "playlist.title"), t(lang, "playlist.created", { name }))]
        });
      }

      case "addcurrent": {
        const name = args.slice(1).join(" ").trim();
        if (!name) {
          return message.reply({
            embeds: [createWarningEmbed(t(lang, "common.warning_title"), "Gunakan: `w!pl addcurrent <nama_playlist>`")]
          });
        }

        const playlist = getUserPlaylist(userId, name);
        if (!playlist) {
          return message.reply({ embeds: [createErrorEmbed(t(lang, "common.error_title"), t(lang, "playlist.not_found", { name }))] });
        }

        const player = client.lavalink.getPlayer(guildId);
        if (!player || !player.queue.current) {
          return message.reply({ embeds: [createWarningEmbed(t(lang, "common.warning_title"), t(lang, "common.no_music_playing"))] });
        }

        const currentTrack = player.queue.current;
        const addResult = addTrackToPlaylist(playlist.id, {
          title: currentTrack.info.title,
          uri: currentTrack.info.uri || "",
          author: currentTrack.info.author || "Unknown",
          duration: currentTrack.info.duration || 0,
          source: currentTrack.info.sourceName || "unknown"
        });

        if (!addResult.success) {
          if (addResult.error === "track_limit_reached") {
            return message.reply({ embeds: [createWarningEmbed(t(lang, "common.warning_title"), t(lang, "playlist.track_limit_reached", { name }))] });
          }
          return message.reply({ embeds: [createErrorEmbed(t(lang, "common.error_title"), addResult.error || "Gagal menambahkan lagu")] });
        }

        return message.reply({
          embeds: [
            createSuccessEmbed(
              t(lang, "playlist.title"),
              t(lang, "playlist.track_added", {
                title: currentTrack.info.title,
                uri: currentTrack.info.uri || "https://discord.com",
                name
              })
            )
          ]
        });
      }

      case "add": {
        const name = args[1];
        const query = args.slice(2).join(" ").trim();

        if (!name || !query) {
          return message.reply({
            embeds: [createWarningEmbed(t(lang, "common.warning_title"), "Gunakan: `w!pl add <nama_playlist> <link/judul>`")]
          });
        }

        const playlist = getUserPlaylist(userId, name);
        if (!playlist) {
          return message.reply({ embeds: [createErrorEmbed(t(lang, "common.error_title"), t(lang, "playlist.not_found", { name }))] });
        }

        const member = message.member as GuildMember;
        const voiceChannelId = member?.voice?.channelId;
        if (!voiceChannelId) {
          return message.reply({ embeds: [createErrorEmbed(t(lang, "common.error_title"), t(lang, "common.no_voice_channel"))] });
        }

        const hasConnectedNode = [...client.lavalink.nodeManager.nodes.values()].some((n) => n.connected);
        if (!hasConnectedNode) {
          return message.reply({
            embeds: [createWarningEmbed(t(lang, "common.warning_title"), lang === "id" ? "⚠️ Server audio sedang menghubungkan ulang. Silakan coba kembali dalam beberapa saat (10-15 detik)." : "⚠️ Audio server is currently reconnecting. Please try again shortly.")]
          });
        }

        const guildSettings = getGuildSettings(guildId);
        let player = client.lavalink.getPlayer(guildId);
        if (!player) {
          player = client.lavalink.createPlayer({
            guildId,
            voiceChannelId,
            textChannelId: message.channelId,
            selfDeaf: true,
            volume: guildSettings.default_volume || 80
          });
        }

        const searchRes = await smartSearch(player, query, message.author);
        if (!searchRes || !searchRes.tracks || searchRes.tracks.length === 0) {
          return message.reply({ embeds: [createErrorEmbed(t(lang, "common.error_title"), t(lang, "play.no_results", { query }))] });
        }

        const trackToAdd = searchRes.tracks[0];
        const addResult = addTrackToPlaylist(playlist.id, {
          title: trackToAdd.info.title,
          uri: trackToAdd.info.uri || "",
          author: trackToAdd.info.author || "Unknown",
          duration: trackToAdd.info.duration || 0,
          source: trackToAdd.info.sourceName || "unknown"
        });

        if (!addResult.success) {
          if (addResult.error === "track_limit_reached") {
            return message.reply({ embeds: [createWarningEmbed(t(lang, "common.warning_title"), t(lang, "playlist.track_limit_reached", { name }))] });
          }
          return message.reply({ embeds: [createErrorEmbed(t(lang, "common.error_title"), addResult.error || "Gagal menambahkan lagu")] });
        }

        return message.reply({
          embeds: [
            createSuccessEmbed(
              t(lang, "playlist.title"),
              t(lang, "playlist.track_added", {
                title: trackToAdd.info.title,
                uri: trackToAdd.info.uri || "https://discord.com",
                name
              })
            )
          ]
        });
      }

      case "play": {
        const name = args.slice(1).join(" ").trim();
        if (!name) {
          return message.reply({
            embeds: [createWarningEmbed(t(lang, "common.warning_title"), "Gunakan: `w!pl play <nama_playlist>`")]
          });
        }

        const playlist = getUserPlaylist(userId, name);
        if (!playlist) {
          return message.reply({ embeds: [createErrorEmbed(t(lang, "common.error_title"), t(lang, "playlist.not_found", { name }))] });
        }

        const member = message.member as GuildMember;
        const voiceChannel = member?.voice?.channel;
        if (!voiceChannel) {
          return message.reply({ embeds: [createErrorEmbed(t(lang, "common.error_title"), t(lang, "common.no_voice_channel"))] });
        }

        const hasConnectedNode = [...client.lavalink.nodeManager.nodes.values()].some((n) => n.connected);
        if (!hasConnectedNode) {
          return message.reply({
            embeds: [createWarningEmbed(t(lang, "common.warning_title"), lang === "id" ? "⚠️ Server audio sedang menghubungkan ulang. Silakan coba kembali dalam beberapa saat (10-15 detik)." : "⚠️ Audio server is currently reconnecting. Please try again shortly.")]
          });
        }

        const tracks = getPlaylistTracks(playlist.id);
        if (!tracks || tracks.length === 0) {
          return message.reply({ embeds: [createWarningEmbed(t(lang, "common.warning_title"), t(lang, "playlist.no_tracks_to_play", { name }))] });
        }

        const loadingMsg = await message.reply(`⏳ Memuat **${tracks.length} lagu** dari playlist **${name}**...`);

        const guildSettings = getGuildSettings(guildId);
        let player = client.lavalink.getPlayer(guildId);

        if (!player) {
          player = client.lavalink.createPlayer({
            guildId,
            voiceChannelId: voiceChannel.id,
            textChannelId: message.channelId,
            selfDeaf: true,
            volume: guildSettings.default_volume || 80
          });
          player.set("mode_247", guildSettings.mode_247 === 1);
        }

        if (!player.connected) {
          await player.connect();
        }

        let addedCount = 0;
        for (const trk of tracks) {
          try {
            const res = await player.search({ query: trk.uri || trk.title }, message.author);
            if (res && res.tracks && res.tracks.length > 0) {
              player.queue.add(res.tracks[0]);
              addedCount++;
            }
          } catch {}
        }

        if (addedCount === 0) {
          return loadingMsg.edit({
            content: null,
            embeds: [createErrorEmbed(t(lang, "common.error_title"), t(lang, "playlist.no_tracks_to_play", { name }))]
          });
        }

        if (!player.playing && !player.paused) {
          await player.play();
        }

        return loadingMsg.edit({
          content: null,
          embeds: [
            createSuccessEmbed(
              t(lang, "playlist.title"),
              t(lang, "playlist.playing", { count: addedCount, name })
            )
          ]
        });
      }

      case "list": {
        const playlists = getUserPlaylists(userId);

        if (playlists.length === 0) {
          return message.reply({
            embeds: [createBaseEmbed(t(lang, "playlist.list_title", { count: 0 }), t(lang, "playlist.list_empty"))]
          });
        }

        const listText = playlists
          .map((p, idx) => `\`${idx + 1}.\` **${p.name}** — \`${p.track_count}/${MAX_TRACKS_PER_PLAYLIST} lagu\` *(Dibuat: ${new Date(p.created_at).toLocaleDateString()})*`)
          .join("\n");

        const embed = new EmbedBuilder()
          .setColor(client.config.embedColors.primary as any)
          .setTitle(t(lang, "playlist.list_title", { count: playlists.length }))
          .setDescription(`${listText}\n\n💡 *Putar:* \`w!pl play <nama>\` | *Lihat isi:* \`w!pl view <nama>\``)
          .setTimestamp()
          .setFooter({ text: `Kuota: ${playlists.length}/${MAX_USER_PLAYLISTS} Playlist`, iconURL: getBotAvatar() });

        return message.reply({ embeds: [embed] });
      }

      case "view": {
        const name = args.slice(1).join(" ").trim();
        if (!name) {
          return message.reply({
            embeds: [createWarningEmbed(t(lang, "common.warning_title"), "Gunakan: `w!pl view <nama_playlist>`")]
          });
        }

        const playlist = getUserPlaylist(userId, name);
        if (!playlist) {
          return message.reply({ embeds: [createErrorEmbed(t(lang, "common.error_title"), t(lang, "playlist.not_found", { name }))] });
        }

        const tracks = getPlaylistTracks(playlist.id);
        if (tracks.length === 0) {
          return message.reply({
            embeds: [createBaseEmbed(t(lang, "playlist.view_title", { name, count: 0 }), t(lang, "playlist.empty", { name }))]
          });
        }

        const trackList = tracks
          .slice(0, 20)
          .map((trk, idx) => {
            const badge = getSourceBadge(trk.source, trk.uri);
            return `\`${idx + 1}.\` [${trk.title}](${trk.uri}) — \`${formatDuration(trk.duration)}\` (${badge})`;
          })
          .join("\n");

        const remaining = tracks.length - 20;
        const remainingText = remaining > 0 ? `\n*...dan ${remaining} lagu lainnya*` : "";

        const totalDuration = tracks.reduce((acc, t) => acc + (t.duration || 0), 0);

        const embed = new EmbedBuilder()
          .setColor(client.config.embedColors.queue as any)
          .setTitle(t(lang, "playlist.view_title", { name, count: tracks.length }))
          .setDescription(`${trackList}${remainingText}\n\n⏱️ **Total Durasi:** \`${formatDuration(totalDuration)}\``)
          .setTimestamp()
          .setFooter({ text: `Total: ${tracks.length}/${MAX_TRACKS_PER_PLAYLIST} Lagu`, iconURL: getBotAvatar() });

        return message.reply({ embeds: [embed] });
      }

      case "remove": {
        const name = args[1];
        const rawIndex = args[2];
        const index = parseInt(rawIndex, 10);

        if (!name || isNaN(index)) {
          return message.reply({
            embeds: [createWarningEmbed(t(lang, "common.warning_title"), "Gunakan: `w!pl remove <nama_playlist> <nomor_lagu>`")]
          });
        }

        const playlist = getUserPlaylist(userId, name);
        if (!playlist) {
          return message.reply({ embeds: [createErrorEmbed(t(lang, "common.error_title"), t(lang, "playlist.not_found", { name }))] });
        }

        const removeRes = removeTrackFromPlaylist(playlist.id, index);
        if (!removeRes.success || !removeRes.removedTrack) {
          return message.reply({ embeds: [createErrorEmbed(t(lang, "common.error_title"), t(lang, "playlist.invalid_index", { name }))] });
        }

        return message.reply({
          embeds: [
            createSuccessEmbed(
              t(lang, "playlist.title"),
              t(lang, "playlist.track_removed", {
                title: removeRes.removedTrack.title,
                name
              })
            )
          ]
        });
      }

      case "delete": {
        const name = args.slice(1).join(" ").trim();
        if (!name) {
          return message.reply({
            embeds: [createWarningEmbed(t(lang, "common.warning_title"), "Gunakan: `w!pl delete <nama_playlist>`")]
          });
        }

        const deleted = deleteUserPlaylist(userId, name);
        if (!deleted) {
          return message.reply({ embeds: [createErrorEmbed(t(lang, "common.error_title"), t(lang, "playlist.not_found", { name }))] });
        }

        return message.reply({
          embeds: [createSuccessEmbed(t(lang, "playlist.title"), t(lang, "playlist.deleted", { name }))]
        });
      }

      default: {
        return message.reply({
          embeds: [
            createWarningEmbed(
              t(lang, "common.warning_title"),
              `Subcommand \`${sub}\` tidak dikenali. Ketik \`w!pl\` untuk melihat panduan lengkap.`
            )
          ]
        });
      }
    }
  }
};

export default playlistCommand;
