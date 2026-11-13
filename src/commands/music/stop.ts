import {
  ChatInputCommandInteraction,
  GuildMember,
  Message,
  SlashCommandBuilder
} from "discord.js";
import { Command, DiawwBotClient } from "../../client";
import { getGuildLanguage } from "../../database/schema";
import { t } from "../../i18n";
import { destroyAndCleanPlayer } from "../../modules/musicManager";
import { createErrorEmbed, createSuccessEmbed } from "../../utils/embeds";

const slashData = new SlashCommandBuilder()
  .setName("stop")
  .setDescription("Stop playing music, clear queue, and disconnect bot");

const stopCommand: Command = {
  name: "stop",
  description: "Instantly stop playback, clear queue, and disconnect from voice channel",
  aliases: ["leave", "dc", "disconnect"],
  category: "music",
  usage: "/stop or w!stop / w!dc",
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

    await destroyAndCleanPlayer(player, client);

    return interaction.reply({
      embeds: [
        createSuccessEmbed(
          t(lang, "stop.title"),
          t(lang, "stop.description")
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

    await destroyAndCleanPlayer(player, client);

    return message.reply({
      embeds: [
        createSuccessEmbed(
          t(lang, "stop.title"),
          t(lang, "stop.description")
        )
      ]
    });
  }
};

export default stopCommand;
