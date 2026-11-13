import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  Message,
  SlashCommandBuilder
} from "discord.js";
import { Command, DiawwBotClient } from "../../client";
import { getGuildLanguage } from "../../database/schema";
import { t } from "../../i18n";
import { createBaseEmbed } from "../../utils/embeds";

const slashData = new SlashCommandBuilder()
  .setName("donate")
  .setDescription("Support and donate to DIAWW MUSIC server & hosting via Saweria");

const donateCommand: Command = {
  name: "donate",
  description: "Dukung dan donasi untuk DIAWW MUSIC melalui Saweria",
  aliases: ["saweria", "donasi", "tip"],
  category: "general",
  usage: "/donate or w!donate",
  slashData,

  executeSlash: async (interaction: ChatInputCommandInteraction, client: DiawwBotClient) => {
    const guildId = interaction.guildId || "";
    const lang = getGuildLanguage(guildId);
    const saweriaUrl = client.config.owner.saweriaUrl || "https://saweria.co/diaww";

    const embed = createBaseEmbed(t(lang, "donate.title"))
      .setDescription(t(lang, "donate.description", { url: saweriaUrl }))
      .setImage("https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80");

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setLabel(t(lang, "donate.button_label"))
        .setStyle(ButtonStyle.Link)
        .setURL(saweriaUrl)
        .setEmoji("☕")
    );

    return interaction.reply({ embeds: [embed], components: [row] });
  },

  executePrefix: async (message: Message, _args: string[], client: DiawwBotClient) => {
    const guildId = message.guildId || "";
    const lang = getGuildLanguage(guildId);
    const saweriaUrl = client.config.owner.saweriaUrl || "https://saweria.co/diaww";

    const embed = createBaseEmbed(t(lang, "donate.title"))
      .setDescription(t(lang, "donate.description", { url: saweriaUrl }))
      .setImage("https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80");

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setLabel(t(lang, "donate.button_label"))
        .setStyle(ButtonStyle.Link)
        .setURL(saweriaUrl)
        .setEmoji("☕")
    );

    return message.reply({ embeds: [embed], components: [row] });
  }
};

export default donateCommand;
