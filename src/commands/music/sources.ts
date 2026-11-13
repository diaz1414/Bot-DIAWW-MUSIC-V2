import {
  ChatInputCommandInteraction,
  Message,
  SlashCommandBuilder
} from "discord.js";
import { Command, DiawwBotClient } from "../../client";
import { getGuildLanguage } from "../../database/schema";
import { t } from "../../i18n";
import { createBaseEmbed } from "../../utils/embeds";

const slashData = new SlashCommandBuilder()
  .setName("sources")
  .setDescription("Display the list of 9+ supported music & audio platforms");

const sourcesCommand: Command = {
  name: "sources",
  description: "List of supported audio sources in DIAWW MUSIC",
  aliases: ["source", "platforms"],
  category: "music",
  usage: "/sources or w!sources",
  slashData,

  executeSlash: async (interaction: ChatInputCommandInteraction, _client: DiawwBotClient) => {
    const guildId = interaction.guildId!;
    const lang = getGuildLanguage(guildId);

    const embed = createBaseEmbed(t(lang, "sources.title"))
      .setDescription(t(lang, "sources.description"))
      .addFields(
        {
          name: "🟢 1. Spotify",
          value: "• Track, Album, Playlist, Artist link\n• Direct keyword search via `spsearch:`\n• Spotify Radio recommendation engine for Smart Autoplay",
          inline: false
        },
        {
          name: "🔴 2. YouTube & YouTube Music",
          value: "• Video link, Shorts, Playlist, Live Streams\n• Search via `ytsearch:` and `ytmsearch:`\n• YouTube Mix Playlist fallback",
          inline: false
        },
        {
          name: "🍎 3. Apple Music",
          value: "• Song, Album, Playlist link\n• Search via `amsearch:`",
          inline: false
        },
        {
          name: "🟠 4. SoundCloud",
          value: "• Track link, Sets, User Playlist\n• Search via `scsearch:`",
          inline: false
        },
        {
          name: "💙 5. Deezer",
          value: "• Track, Album, Playlist, Artist link\n• Search via `dzsearch:` (Lossless FLAC)",
          inline: false
        },
        {
          name: "🟡 6. Yandex Music",
          value: "• Track link, Album link, search via `ymsearch:`",
          inline: false
        },
        {
          name: "📻 7. HTTP Audio Streaming (Web Radio)",
          value: "• Shoutcast & Icecast Live Streams\n• Playlist streams: `.m3u`, `.pls`, `.m3u8`",
          inline: false
        },
        {
          name: "📁 8. Direct HTTP Audio Files",
          value: "• Direct public audio files: `.mp3`, `.wav`, `.flac`, `.ogg`, `.m4a`, `.aac`",
          inline: false
        },
        {
          name: "✨ 9. Extra Platforms",
          value: "• Twitch Live Streams audio\n• Bandcamp Albums & Tracks",
          inline: false
        }
      );

    return interaction.reply({ embeds: [embed] });
  },

  executePrefix: async (message: Message, _args: string[], _client: DiawwBotClient) => {
    const guildId = message.guildId!;
    const lang = getGuildLanguage(guildId);

    const embed = createBaseEmbed(t(lang, "sources.title"))
      .setDescription(t(lang, "sources.description"))
      .addFields(
        {
          name: "🟢 1. Spotify",
          value: "• Track, Album, Playlist, Artist link\n• Direct keyword search via `spsearch:`\n• Spotify Radio recommendation engine for Smart Autoplay",
          inline: false
        },
        {
          name: "🔴 2. YouTube & YouTube Music",
          value: "• Video link, Shorts, Playlist, Live Streams\n• Search via `ytsearch:` and `ytmsearch:`\n• YouTube Mix Playlist fallback",
          inline: false
        },
        {
          name: "🍎 3. Apple Music",
          value: "• Song, Album, Playlist link\n• Search via `amsearch:`",
          inline: false
        },
        {
          name: "🟠 4. SoundCloud",
          value: "• Track link, Sets, User Playlist\n• Search via `scsearch:`",
          inline: false
        },
        {
          name: "💙 5. Deezer",
          value: "• Track, Album, Playlist, Artist link\n• Search via `dzsearch:` (Lossless FLAC)",
          inline: false
        },
        {
          name: "🟡 6. Yandex Music",
          value: "• Track link, Album link, search via `ymsearch:`",
          inline: false
        },
        {
          name: "📻 7. HTTP Audio Streaming (Web Radio)",
          value: "• Shoutcast & Icecast Live Streams\n• Playlist streams: `.m3u`, `.pls`, `.m3u8`",
          inline: false
        },
        {
          name: "📁 8. Direct HTTP Audio Files",
          value: "• Direct public audio files: `.mp3`, `.wav`, `.flac`, `.ogg`, `.m4a`, `.aac`",
          inline: false
        },
        {
          name: "✨ 9. Extra Platforms",
          value: "• Twitch Live Streams audio\n• Bandcamp Albums & Tracks",
          inline: false
        }
      );

    return message.reply({ embeds: [embed] });
  }
};

export default sourcesCommand;
