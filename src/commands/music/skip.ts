import {
  ChatInputCommandInteraction,
  GuildMember,
  Message,
  SlashCommandBuilder
} from "discord.js";
import { Track } from "lavalink-client";
import { Command, DiawwBotClient } from "../../client";
import { getGuildLanguage } from "../../database/schema";
import { t } from "../../i18n";
import { ExtendedTrack } from "../../modules/musicManager";
import { createErrorEmbed, createSuccessEmbed } from "../../utils/embeds";

const slashData = new SlashCommandBuilder()
  .setName("skip")
  .setDescription("Skip the currently playing track to the next one");

const skipCommand: Command = {
  name: "skip",
  description: "Skip the currently playing track",
  aliases: ["s", "next"],
  category: "music",
  usage: "/skip or w!skip / w!s",
  slashData,

  executeSlash: async (interaction: ChatInputCommandInteraction, client: DiawwBotClient) => {
    const guildId = interaction.guildId!;
    const lang = getGuildLanguage(guildId);
    const member = interaction.member as GuildMember;
    const player = client.lavalink.getPlayer(guildId);

    if (!player || !player.queue.current) {
      return interaction.reply({
        embeds: [createErrorEmbed(t(lang, "common.error_title"), t(lang, "common.no_music_playing"))],
        ephemeral: true
      });
    }

    if (member?.voice?.channelId !== player.voiceChannelId) {
      return interaction.reply({
        embeds: [createErrorEmbed(t(lang, "common.error_title"), t(lang, "common.different_voice_channel"))],
        ephemeral: true
      });
    }

    const skippedTitle = player.queue.current.info.title;

    // Jika antrean kosong tapi Autoplay aktif, masukkan lagu autoplay berikutnya langsung
    if (player.queue.tracks.length === 0 && player.get("autoplay") === true) {
      const autoNext = player.get<Track>("autoplay_next_track");
      if (autoNext) {
        player.set("autoplay_next_track", null);
        (autoNext as ExtendedTrack).isAutoplay = true;
        player.queue.add(autoNext);
      }
    }

    try {
      await player.skip(0, false);
    } catch {
      await player.stopPlaying(true, false).catch(() => {});
    }

    return interaction.reply({
      embeds: [
        createSuccessEmbed(
          t(lang, "skip.title"),
          t(lang, "skip.description", { title: skippedTitle })
        )
      ]
    });
  },

  executePrefix: async (message: Message, _args: string[], client: DiawwBotClient) => {
    const guildId = message.guildId!;
    const lang = getGuildLanguage(guildId);
    const member = message.member as GuildMember;
    const player = client.lavalink.getPlayer(guildId);

    if (!player || !player.queue.current) {
      return message.reply({
        embeds: [createErrorEmbed(t(lang, "common.error_title"), t(lang, "common.no_music_playing"))]
      });
    }

    if (member?.voice?.channelId !== player.voiceChannelId) {
      return message.reply({
        embeds: [createErrorEmbed(t(lang, "common.error_title"), t(lang, "common.different_voice_channel"))]
      });
    }

    const skippedTitle = player.queue.current.info.title;

    // Jika antrean kosong tapi Autoplay aktif, masukkan lagu autoplay berikutnya langsung
    if (player.queue.tracks.length === 0 && player.get("autoplay") === true) {
      const autoNext = player.get<Track>("autoplay_next_track");
      if (autoNext) {
        player.set("autoplay_next_track", null);
        (autoNext as ExtendedTrack).isAutoplay = true;
        player.queue.add(autoNext);
      }
    }

    try {
      await player.skip(0, false);
    } catch {
      await player.stopPlaying(true, false).catch(() => {});
    }

    return message.reply({
      embeds: [
        createSuccessEmbed(
          t(lang, "skip.title"),
          t(lang, "skip.description", { title: skippedTitle })
        )
      ]
    });
  }
};

export default skipCommand;
