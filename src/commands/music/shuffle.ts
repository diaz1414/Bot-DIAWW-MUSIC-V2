import {
  ChatInputCommandInteraction,
  GuildMember,
  Message,
  SlashCommandBuilder
} from "discord.js";
import { Command, DiawwBotClient } from "../../client";
import { getGuildLanguage } from "../../database/schema";
import { t } from "../../i18n";
import { createErrorEmbed, createSuccessEmbed, createWarningEmbed } from "../../utils/embeds";

const slashData = new SlashCommandBuilder()
  .setName("shuffle")
  .setDescription("Shuffle the tracks in the current queue randomly");

const shuffleCommand: Command = {
  name: "shuffle",
  description: "Shuffle the music queue randomly",
  aliases: ["sh", "random"],
  category: "music",
  usage: "/shuffle or w!shuffle / w!sh",
  slashData,

  executeSlash: async (interaction: ChatInputCommandInteraction, client: DiawwBotClient) => {
    const guildId = interaction.guildId!;
    const lang = getGuildLanguage(guildId);
    const member = interaction.member as GuildMember;
    const player = client.lavalink.getPlayer(guildId);

    if (!player) {
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

    if (!player.queue.tracks || player.queue.tracks.length < 2) {
      return interaction.reply({
        embeds: [createWarningEmbed(t(lang, "common.warning_title"), t(lang, "shuffle.not_enough"))],
        ephemeral: true
      });
    }

    await player.queue.shuffle();

    return interaction.reply({
      embeds: [
        createSuccessEmbed(
          t(lang, "shuffle.title"),
          t(lang, "shuffle.shuffled", { count: player.queue.tracks.length })
        )
      ]
    });
  },

  executePrefix: async (message: Message, _args: string[], client: DiawwBotClient) => {
    const guildId = message.guildId!;
    const lang = getGuildLanguage(guildId);
    const member = message.member as GuildMember;
    const player = client.lavalink.getPlayer(guildId);

    if (!player) {
      return message.reply({
        embeds: [createErrorEmbed(t(lang, "common.error_title"), t(lang, "common.no_music_playing"))]
      });
    }

    if (member?.voice?.channelId !== player.voiceChannelId) {
      return message.reply({
        embeds: [createErrorEmbed(t(lang, "common.error_title"), t(lang, "common.different_voice_channel"))]
      });
    }

    if (!player.queue.tracks || player.queue.tracks.length < 2) {
      return message.reply({
        embeds: [createWarningEmbed(t(lang, "common.warning_title"), t(lang, "shuffle.not_enough"))]
      });
    }

    await player.queue.shuffle();

    return message.reply({
      embeds: [
        createSuccessEmbed(
          t(lang, "shuffle.title"),
          t(lang, "shuffle.shuffled", { count: player.queue.tracks.length })
        )
      ]
    });
  }
};

export default shuffleCommand;
