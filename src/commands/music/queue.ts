import {
  ChatInputCommandInteraction,
  Message,
  SlashCommandBuilder
} from "discord.js";
import { Command, DiawwBotClient } from "../../client";
import { getGuildLanguage } from "../../database/schema";
import { t } from "../../i18n";
import { buildQueueEmbed } from "../../modules/musicManager";
import { createErrorEmbed } from "../../utils/embeds";

const slashData = new SlashCommandBuilder()
  .setName("queue")
  .setDescription("View music queue & preview next autoplay recommendation");

const queueCommand: Command = {
  name: "queue",
  description: "Display the queue and preview the next autoplay track",
  aliases: ["q", "list"],
  category: "music",
  usage: "/queue or w!queue / w!q",
  slashData,

  executeSlash: async (interaction: ChatInputCommandInteraction, client: DiawwBotClient) => {
    const guildId = interaction.guildId!;
    const lang = getGuildLanguage(guildId);
    const player = client.lavalink.getPlayer(guildId);

    if (!player) {
      return interaction.reply({
        embeds: [createErrorEmbed(t(lang, "common.error_title"), t(lang, "common.no_music_playing"))],
        ephemeral: true
      });
    }

    const embed = buildQueueEmbed(player, interaction.guild?.name || "Server");
    return interaction.reply({ embeds: [embed] });
  },

  executePrefix: async (message: Message, _args: string[], client: DiawwBotClient) => {
    const guildId = message.guildId!;
    const lang = getGuildLanguage(guildId);
    const player = client.lavalink.getPlayer(guildId);

    if (!player) {
      return message.reply({
        embeds: [createErrorEmbed(t(lang, "common.error_title"), t(lang, "common.no_music_playing"))]
      });
    }

    const embed = buildQueueEmbed(player, message.guild?.name || "Server");
    return message.reply({ embeds: [embed] });
  }
};

export default queueCommand;
