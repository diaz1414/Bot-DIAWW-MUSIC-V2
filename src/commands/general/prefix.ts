import {
  ChatInputCommandInteraction,
  GuildMember,
  Message,
  PermissionFlagsBits,
  SlashCommandBuilder
} from "discord.js";
import { Command, DiawwBotClient } from "../../client";
import { getGuildLanguage, getGuildSettings, setGuildPrefix } from "../../database/schema";
import { t } from "../../i18n";
import { createErrorEmbed, createSuccessEmbed, createWarningEmbed } from "../../utils/embeds";

const slashData = new SlashCommandBuilder()
  .setName("prefix")
  .setDescription("Change the bot command prefix for this server")
  .addStringOption((opt) =>
    opt
      .setName("new_prefix")
      .setDescription("New prefix (e.g. !, ?, $, w!)")
      .setRequired(true)
      .setMaxLength(10)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

const prefixCommand: Command = {
  name: "prefix",
  description: "Change custom bot prefix for this server",
  aliases: ["setprefix"],
  category: "general",
  usage: "/prefix <new_prefix> or w!prefix <new_prefix>",
  slashData,

  executeSlash: async (interaction: ChatInputCommandInteraction, _client: DiawwBotClient) => {
    const guildId = interaction.guildId!;
    const lang = getGuildLanguage(guildId);
    const member = interaction.member as GuildMember;

    if (!member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      return interaction.reply({
        embeds: [createErrorEmbed(t(lang, "common.error_title"), t(lang, "common.permission_denied"))],
        ephemeral: true
      });
    }

    const newPrefix = interaction.options.getString("new_prefix", true).trim();
    if (!newPrefix) {
      return interaction.reply({
        embeds: [createErrorEmbed(t(lang, "common.error_title"), t(lang, "prefix.empty"))],
        ephemeral: true
      });
    }

    setGuildPrefix(guildId, newPrefix);

    return interaction.reply({
      embeds: [
        createSuccessEmbed(
          t(lang, "prefix.title"),
          t(lang, "prefix.updated", { prefix: newPrefix })
        )
      ]
    });
  },

  executePrefix: async (message: Message, args: string[], _client: DiawwBotClient) => {
    const guildId = message.guildId!;
    const lang = getGuildLanguage(guildId);
    const member = message.member as GuildMember;

    if (!member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      return message.reply({
        embeds: [createErrorEmbed(t(lang, "common.error_title"), t(lang, "common.permission_denied"))]
      });
    }

    const currentPrefix = getGuildSettings(guildId).prefix;

    if (!args[0]) {
      return message.reply({
        embeds: [
          createWarningEmbed(
            t(lang, "prefix.title"),
            t(lang, "prefix.current", { prefix: currentPrefix })
          )
        ]
      });
    }

    const newPrefix = args[0].trim();
    if (newPrefix.length > 10) {
      return message.reply({
        embeds: [createErrorEmbed(t(lang, "common.error_title"), t(lang, "prefix.too_long"))]
      });
    }

    setGuildPrefix(guildId, newPrefix);

    return message.reply({
      embeds: [
        createSuccessEmbed(
          t(lang, "prefix.title"),
          t(lang, "prefix.updated", { prefix: newPrefix })
        )
      ]
    });
  }
};

export default prefixCommand;
