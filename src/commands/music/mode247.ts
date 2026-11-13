import {
  ChatInputCommandInteraction,
  GuildMember,
  Message,
  SlashCommandBuilder
} from "discord.js";
import { Command, DiawwBotClient } from "../../client";
import { getGuildLanguage, getGuildSettings, setGuild247 } from "../../database/schema";
import { t } from "../../i18n";
import { createSuccessEmbed } from "../../utils/embeds";

const slashData = new SlashCommandBuilder()
  .setName("mode247")
  .setDescription("Toggle 24/7 Mode (Bot stays standby in the Voice Channel)");

const mode247Command: Command = {
  name: "mode247",
  description: "Keep the bot in the voice channel 24/7 without auto-disconnect",
  aliases: ["247", "stay"],
  category: "music",
  usage: "/mode247 or w!247",
  slashData,

  executeSlash: async (interaction: ChatInputCommandInteraction, client: DiawwBotClient) => {
    const guildId = interaction.guildId!;
    const lang = getGuildLanguage(guildId);
    const guildSettings = getGuildSettings(guildId);
    const newStatus = !(guildSettings.mode_247 === 1);

    setGuild247(guildId, newStatus);

    const player = client.lavalink.getPlayer(guildId);
    if (player) {
      player.set("mode_247", newStatus);

      if (newStatus) {
        const timer = player.get<NodeJS.Timeout>("disconnect_timeout");
        if (timer) {
          clearTimeout(timer);
          player.set("disconnect_timeout", null);
        }
      }
    }

    return interaction.reply({
      embeds: [
        createSuccessEmbed(
          t(lang, "mode247.title"),
          newStatus ? t(lang, "mode247.enabled_desc") : t(lang, "mode247.disabled_desc")
        )
      ]
    });
  },

  executePrefix: async (message: Message, _args: string[], client: DiawwBotClient) => {
    const guildId = message.guildId!;
    const lang = getGuildLanguage(guildId);
    const guildSettings = getGuildSettings(guildId);
    const newStatus = !(guildSettings.mode_247 === 1);

    setGuild247(guildId, newStatus);

    const player = client.lavalink.getPlayer(guildId);
    if (player) {
      player.set("mode_247", newStatus);

      if (newStatus) {
        const timer = player.get<NodeJS.Timeout>("disconnect_timeout");
        if (timer) {
          clearTimeout(timer);
          player.set("disconnect_timeout", null);
        }
      }
    }

    return message.reply({
      embeds: [
        createSuccessEmbed(
          t(lang, "mode247.title"),
          newStatus ? t(lang, "mode247.enabled_desc") : t(lang, "mode247.disabled_desc")
        )
      ]
    });
  }
};

export default mode247Command;
