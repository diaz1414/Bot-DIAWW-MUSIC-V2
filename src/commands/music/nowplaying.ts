import {
  ChatInputCommandInteraction,
  Message,
  SlashCommandBuilder
} from "discord.js";
import { Command, DiawwBotClient } from "../../client";
import { getGuildLanguage } from "../../database/schema";
import { t } from "../../i18n";
import { buildNowPlayingComponents, buildNowPlayingEmbed } from "../../modules/musicManager";
import { createErrorEmbed } from "../../utils/embeds";

const slashData = new SlashCommandBuilder()
  .setName("nowplaying")
  .setDescription("Display the comprehensive now playing card for the current track");

const nowPlayingCommand: Command = {
  name: "nowplaying",
  description: "Display information about the currently playing song with control buttons",
  aliases: ["np", "current"],
  category: "music",
  usage: "/nowplaying or w!np",
  slashData,

  executeSlash: async (interaction: ChatInputCommandInteraction, client: DiawwBotClient) => {
    const guildId = interaction.guildId!;
    const lang = getGuildLanguage(guildId);
    const player = client.lavalink.getPlayer(guildId);

    if (!player || !player.queue.current) {
      return interaction.reply({
        embeds: [createErrorEmbed(t(lang, "common.error_title"), t(lang, "common.no_music_playing"))],
        ephemeral: true
      });
    }

    const embed = buildNowPlayingEmbed(player, player.queue.current);
    const components = buildNowPlayingComponents(player);

    return interaction.reply({ embeds: [embed], components });
  },

  executePrefix: async (message: Message, _args: string[], client: DiawwBotClient) => {
    const guildId = message.guildId!;
    const lang = getGuildLanguage(guildId);
    const player = client.lavalink.getPlayer(guildId);

    if (!player || !player.queue.current) {
      return message.reply({
        embeds: [createErrorEmbed(t(lang, "common.error_title"), t(lang, "common.no_music_playing"))]
      });
    }

    const embed = buildNowPlayingEmbed(player, player.queue.current);
    const components = buildNowPlayingComponents(player);

    return message.reply({ embeds: [embed], components });
  }
};

export default nowPlayingCommand;
