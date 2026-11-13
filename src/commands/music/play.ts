import {
  ChatInputCommandInteraction,
  GuildMember,
  Message,
  SlashCommandBuilder
} from "discord.js";
import { Command, DiawwBotClient } from "../../client";
import { getGuildLanguage, getGuildSettings } from "../../database/schema";
import { t } from "../../i18n";
import {
  getSourceBadge,
  smartSearch
} from "../../modules/musicManager";
import { createErrorEmbed, createSuccessEmbed, createWarningEmbed } from "../../utils/embeds";
import { formatDuration } from "../../utils/time";

const slashData = new SlashCommandBuilder()
  .setName("play")
  .setDescription("Play music from 9+ platforms or search by title")
  .addStringOption((opt) =>
    opt
      .setName("query")
      .setDescription("Song/playlist link URL or song title keywords")
      .setRequired(true)
  )
  .addStringOption((opt) =>
    opt
      .setName("platform")
      .setDescription("Choose specific search platform (default: Auto Multi-Tier)")
      .setRequired(false)
      .addChoices(
        { name: "✨ Auto (Spotify -> YouTube -> etc)", value: "auto" },
        { name: "🟢 Spotify", value: "spotify" },
        { name: "🔴 YouTube", value: "youtube" },
        { name: "🍎 Apple Music", value: "applemusic" },
        { name: "💙 Deezer", value: "deezer" },
        { name: "🟠 SoundCloud", value: "soundcloud" },
        { name: "🟡 Yandex Music", value: "yandex" }
      )
  );

const playCommand: Command = {
  name: "play",
  description: "Play music or playlist from 9+ platforms (Spotify, YouTube, Apple Music, SoundCloud, etc)",
  aliases: ["p"],
  category: "music",
  usage: "/play <query> [platform] or w!play <query>",
  slashData,

  executeSlash: async (interaction: ChatInputCommandInteraction, client: DiawwBotClient) => {
    const guildId = interaction.guildId!;
    const lang = getGuildLanguage(guildId);
    const member = interaction.member as GuildMember;
    const voiceChannel = member?.voice?.channel;

    if (!voiceChannel) {
      return interaction.reply({
        embeds: [createErrorEmbed(t(lang, "common.error_title"), t(lang, "common.no_voice_channel"))],
        ephemeral: true
      });
    }

    const query = interaction.options.getString("query", true);
    const platform = interaction.options.getString("platform") || "auto";

    await interaction.deferReply();

    const guildSettings = getGuildSettings(guildId);

    let player = client.lavalink.getPlayer(guildId);
    if (!player) {
      player = client.lavalink.createPlayer({
        guildId: guildId,
        voiceChannelId: voiceChannel.id,
        textChannelId: interaction.channelId,
        selfDeaf: true,
        selfMute: false,
        volume: guildSettings.default_volume || 80
      });
      player.set("mode_247", guildSettings.mode_247 === 1);
      player.set("autoplay", true);
    }

    if (!player.connected) {
      await player.connect();
    }

    player.textChannelId = interaction.channelId;

    const res = await smartSearch(player, query, interaction.user, platform);

    if (!res || !res.tracks || res.tracks.length === 0) {
      return interaction.editReply({
        embeds: [
          createWarningEmbed(
            t(lang, "common.warning_title"),
            t(lang, "play.not_found", { query })
          )
        ]
      });
    }

    // Playlist
    if (res.loadType === "playlist" && res.playlist) {
      player.queue.add(res.tracks);

      const totalDuration = res.tracks.reduce((acc, trk) => acc + (trk.info.duration || 0), 0);
      const badge = getSourceBadge(res.tracks[0]?.info?.sourceName, res.tracks[0]?.info?.uri);

      if (!player.playing && !player.paused) {
        await player.play();
      }

      return interaction.editReply({
        embeds: [
          createSuccessEmbed(
            t(lang, "play.playlist_added", {
              title: res.playlist.title,
              uri: query,
              count: res.tracks.length,
              duration: formatDuration(totalDuration),
              source: badge,
              user: interaction.user.id
            })
          )
        ]
      });
    }

    // Single Track
    const track = res.tracks[0];
    player.queue.add(track);

    const badge = getSourceBadge(track.info.sourceName, track.info.uri);

    if (!player.playing && !player.paused) {
      await player.play();
      return interaction.editReply({
        embeds: [
          createSuccessEmbed(
            t(lang, "play.starting_playback", {
              title: track.info.title,
              uri: track.info.uri,
              author: track.info.author,
              source: badge,
              duration: formatDuration(track.info.duration)
            })
          )
        ]
      });
    }

    return interaction.editReply({
      embeds: [
        createSuccessEmbed(
          t(lang, "play.added_to_queue", {
            title: track.info.title,
            uri: track.info.uri,
            author: track.info.author,
            source: badge,
            duration: formatDuration(track.info.duration),
            position: player.queue.tracks.length
          })
        )
      ]
    });
  },

  executePrefix: async (message: Message, args: string[], client: DiawwBotClient) => {
    const guildId = message.guildId!;
    const lang = getGuildLanguage(guildId);
    const member = message.member as GuildMember;
    const voiceChannel = member?.voice?.channel;

    if (!voiceChannel) {
      return message.reply({
        embeds: [createErrorEmbed(t(lang, "common.error_title"), t(lang, "common.no_voice_channel"))]
      });
    }

    if (!args || args.length === 0) {
      return message.reply({
        embeds: [createWarningEmbed(t(lang, "common.warning_title"), t(lang, "play.usage_warning"))]
      });
    }

    const query = args.join(" ");
    const guildSettings = getGuildSettings(guildId);

    let player = client.lavalink.getPlayer(guildId);
    if (!player) {
      player = client.lavalink.createPlayer({
        guildId: guildId,
        voiceChannelId: voiceChannel.id,
        textChannelId: message.channelId,
        selfDeaf: true,
        selfMute: false,
        volume: guildSettings.default_volume || 80
      });
      player.set("mode_247", guildSettings.mode_247 === 1);
      player.set("autoplay", true);
    }

    if (!player.connected) {
      await player.connect();
    }

    player.textChannelId = message.channelId;

    const res = await smartSearch(player, query, message.author, "auto");

    if (!res || !res.tracks || res.tracks.length === 0) {
      return message.reply({
        embeds: [
          createWarningEmbed(
            t(lang, "common.warning_title"),
            t(lang, "play.not_found", { query })
          )
        ]
      });
    }

    // Playlist
    if (res.loadType === "playlist" && res.playlist) {
      player.queue.add(res.tracks);

      const totalDuration = res.tracks.reduce((acc, trk) => acc + (trk.info.duration || 0), 0);
      const badge = getSourceBadge(res.tracks[0]?.info?.sourceName, res.tracks[0]?.info?.uri);

      if (!player.playing && !player.paused) {
        await player.play();
      }

      return message.reply({
        embeds: [
          createSuccessEmbed(
            t(lang, "play.playlist_added", {
              title: res.playlist.title,
              uri: query,
              count: res.tracks.length,
              duration: formatDuration(totalDuration),
              source: badge,
              user: message.author.id
            })
          )
        ]
      });
    }

    // Single Track
    const track = res.tracks[0];
    player.queue.add(track);

    const badge = getSourceBadge(track.info.sourceName, track.info.uri);

    if (!player.playing && !player.paused) {
      await player.play();
      return message.reply({
        embeds: [
          createSuccessEmbed(
            t(lang, "play.starting_playback", {
              title: track.info.title,
              uri: track.info.uri,
              author: track.info.author,
              source: badge,
              duration: formatDuration(track.info.duration)
            })
          )
        ]
      });
    }

    return message.reply({
      embeds: [
        createSuccessEmbed(
          t(lang, "play.added_to_queue", {
            title: track.info.title,
            uri: track.info.uri,
            author: track.info.author,
            source: badge,
            duration: formatDuration(track.info.duration),
            position: player.queue.tracks.length
          })
        )
      ]
    });
  }
};

export default playCommand;
