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
  .setName("resume")
  .setDescription("Resume the currently paused music");

const resumeCommand: Command = {
  name: "resume",
  description: "Resume paused music playback",
  aliases: ["unpause", "continue"],
  category: "music",
  usage: "/resume or w!resume",
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

    if (!player.paused) {
      return interaction.reply({
        embeds: [createWarningEmbed(t(lang, "common.warning_title"), t(lang, "resume.not_paused"))],
        ephemeral: true
      });
    }

    await player.resume();

    return interaction.reply({
      embeds: [createSuccessEmbed(t(lang, "resume.title"), t(lang, "resume.description"))]
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

    if (!player.paused) {
      return message.reply({
        embeds: [createWarningEmbed(t(lang, "common.warning_title"), t(lang, "resume.not_paused"))]
      });
    }

    await player.resume();

    return message.reply({
      embeds: [createSuccessEmbed(t(lang, "resume.title"), t(lang, "resume.description"))]
    });
  }
};

export default resumeCommand;
