import {
  ChatInputCommandInteraction,
  GuildMember,
  Message,
  SlashCommandBuilder
} from "discord.js";
import { Command, DiawwBotClient } from "../../client";
import { getGuildLanguage } from "../../database/schema";
import { t } from "../../i18n";
import { prepareAutoplayNextTrack } from "../../modules/musicManager";
import { createErrorEmbed, createSuccessEmbed } from "../../utils/embeds";

const slashData = new SlashCommandBuilder()
  .setName("autoplay")
  .setDescription("Toggle Smart Autoplay feature (Spotify Radio & YouTube Mix)");

const autoplayCommand: Command = {
  name: "autoplay",
  description: "Toggle Smart Autoplay based on Spotify Radio & YouTube Mix",
  aliases: ["ap", "auto"],
  category: "music",
  usage: "/autoplay or w!autoplay / w!ap",
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

    const currentStatus = player.get("autoplay") === true;
    const newStatus = !currentStatus;
    player.set("autoplay", newStatus);

    if (newStatus && player.queue.current) {
      prepareAutoplayNextTrack(player, client, player.queue.current).catch(() => { });
    }

    return interaction.reply({
      embeds: [
        createSuccessEmbed(
          t(lang, "autoplay.title"),
          newStatus ? t(lang, "autoplay.enabled_desc") : t(lang, "autoplay.disabled_desc")
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

    const currentStatus = player.get("autoplay") === true;
    const newStatus = !currentStatus;
    player.set("autoplay", newStatus);

    if (newStatus && player.queue.current) {
      prepareAutoplayNextTrack(player, client, player.queue.current).catch(() => { });
    }

    return message.reply({
      embeds: [
        createSuccessEmbed(
          t(lang, "autoplay.title"),
          newStatus ? t(lang, "autoplay.enabled_desc") : t(lang, "autoplay.disabled_desc")
        )
      ]
    });
  }
};

export default autoplayCommand;
