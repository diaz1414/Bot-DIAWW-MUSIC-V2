import {
  ChatInputCommandInteraction,
  Guild,
  Message,
  SlashCommandBuilder,
  TextChannel
} from "discord.js";
import { Command, DiawwBotClient } from "../../client";
import { getGuildLanguage } from "../../database/schema";
import { t } from "../../i18n";
import { forwardReportToOwner } from "../../modules/ownerManager";
import { createErrorEmbed, createSuccessEmbed, createWarningEmbed } from "../../utils/embeds";

const slashData = new SlashCommandBuilder()
  .setName("support")
  .setDescription("Send feedback, bug report, or help request directly to the bot owner")
  .addStringOption((opt) =>
    opt
      .setName("message")
      .setDescription("The issue, bug, or feedback you want to report")
      .setRequired(true)
      .setMaxLength(1000)
  );

const supportCommand: Command = {
  name: "support",
  description: "Kirim aduan, laporan bug, atau pesan bantuan langsung ke DM Owner Bot",
  aliases: ["report", "aduan", "feedback"],
  category: "general",
  usage: "/support <message> or w!report <message>",
  slashData,

  executeSlash: async (interaction: ChatInputCommandInteraction, client: DiawwBotClient) => {
    const guildId = interaction.guildId || "";
    const lang = getGuildLanguage(guildId);
    const reportText = interaction.options.getString("message", true).trim();

    if (!reportText) {
      return interaction.reply({
        embeds: [createErrorEmbed(t(lang, "common.error_title"), t(lang, "support.empty_message"))],
        ephemeral: true
      });
    }

    await interaction.deferReply({ ephemeral: true });

    const guild = interaction.guild as Guild;
    const channelName = (interaction.channel as TextChannel)?.name || "Direct Message";

    const sent = await forwardReportToOwner(client, {
      user: interaction.user,
      guild: guild || { name: "Direct Message", id: "DM", memberCount: 1 },
      channelName,
      content: reportText
    });

    if (sent) {
      return interaction.editReply({
        embeds: [
          createSuccessEmbed(
            t(lang, "support.title"),
            t(lang, "support.success_sent") + `\n\n>>> *"${reportText}"*`
          )
        ]
      });
    } else {
      return interaction.editReply({
        embeds: [
          createErrorEmbed(
            t(lang, "common.error_title"),
            t(lang, "common.system_error")
          )
        ]
      });
    }
  },

  executePrefix: async (message: Message, args: string[], client: DiawwBotClient) => {
    const guildId = message.guildId || "";
    const lang = getGuildLanguage(guildId);
    const reportText = args.join(" ").trim();

    if (!reportText) {
      return message.reply({
        embeds: [createWarningEmbed(t(lang, "common.warning_title"), t(lang, "support.usage_warning"))]
      });
    }

    const guild = message.guild as Guild;
    const channelName = (message.channel as TextChannel)?.name || "Direct Message";

    const sent = await forwardReportToOwner(client, {
      user: message.author,
      guild: guild || { name: "Direct Message", id: "DM", memberCount: 1 },
      channelName,
      content: reportText
    });

    if (sent) {
      return message.reply({
        embeds: [
          createSuccessEmbed(
            t(lang, "support.title"),
            t(lang, "support.success_sent") + `\n\n>>> *"${reportText}"*`
          )
        ]
      });
    } else {
      return message.reply({
        embeds: [
          createErrorEmbed(
            t(lang, "common.error_title"),
            t(lang, "common.system_error")
          )
        ]
      });
    }
  }
};

export default supportCommand;
