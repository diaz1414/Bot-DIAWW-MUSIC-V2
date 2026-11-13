import {
  ChatInputCommandInteraction,
  GuildMember,
  Message,
  SlashCommandBuilder
} from "discord.js";
import { Command, DiawwBotClient } from "../../client";
import { config } from "../../config";
import { getGuildLanguage, setGuildDefaultVolume } from "../../database/schema";
import { t } from "../../i18n";
import { createErrorEmbed, createSuccessEmbed, createWarningEmbed } from "../../utils/embeds";

const slashData = new SlashCommandBuilder()
  .setName("volume")
  .setDescription("Set the audio volume level of the music player (1 - 150%)")
  .addIntegerOption((opt) =>
    opt
      .setName("amount")
      .setDescription("Volume level (1 - 150)")
      .setRequired(true)
      .setMinValue(1)
      .setMaxValue(config.lavalink.maxVolume || 150)
  );

const volumeCommand: Command = {
  name: "volume",
  description: "Set the audio playback volume from 1% to 150%",
  aliases: ["vol", "v"],
  category: "music",
  usage: "/volume <1-150> or w!vol <1-150>",
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

    const volume = interaction.options.getInteger("amount", true);

    await player.setVolume(volume);
    setGuildDefaultVolume(guildId, volume);

    return interaction.reply({
      embeds: [
        createSuccessEmbed(
          t(lang, "volume.title"),
          t(lang, "volume.updated", { volume })
        )
      ]
    });
  },

  executePrefix: async (message: Message, args: string[], client: DiawwBotClient) => {
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

    if (!args[0] || isNaN(parseInt(args[0], 10))) {
      return message.reply({
        embeds: [
          createWarningEmbed(
            t(lang, "volume.title"),
            t(lang, "volume.current", { volume: player.volume })
          )
        ]
      });
    }

    const volume = parseInt(args[0], 10);
    const max = config.lavalink.maxVolume || 150;

    if (volume < 1 || volume > max) {
      return message.reply({
        embeds: [
          createErrorEmbed(
            t(lang, "common.error_title"),
            t(lang, "volume.invalid", { max })
          )
        ]
      });
    }

    await player.setVolume(volume);
    setGuildDefaultVolume(guildId, volume);

    return message.reply({
      embeds: [
        createSuccessEmbed(
          t(lang, "volume.title"),
          t(lang, "volume.updated", { volume })
        )
      ]
    });
  }
};

export default volumeCommand;
