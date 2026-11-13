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
  .setName("pause")
  .setDescription("Pause the currently playing music");

const pauseCommand: Command = {
  name: "pause",
  description: "Pause music playback",
  aliases: ["hold"],
  category: "music",
  usage: "/pause or w!pause",
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

    if (player.paused) {
      return interaction.reply({
        embeds: [createWarningEmbed(t(lang, "common.warning_title"), t(lang, "pause.already_paused"))],
        ephemeral: true
      });
    }

    await player.pause();

    return interaction.reply({
      embeds: [createSuccessEmbed(t(lang, "pause.title"), t(lang, "pause.description"))]
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

    if (player.paused) {
      return message.reply({
        embeds: [createWarningEmbed(t(lang, "common.warning_title"), t(lang, "pause.already_paused"))]
      });
    }

    await player.pause();

    return message.reply({
      embeds: [createSuccessEmbed(t(lang, "pause.title"), t(lang, "pause.description"))]
    });
  }
};

export default pauseCommand;
