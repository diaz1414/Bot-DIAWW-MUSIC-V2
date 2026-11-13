import {
  ChatInputCommandInteraction,
  GuildMember,
  Message,
  PermissionFlagsBits,
  SlashCommandBuilder
} from "discord.js";
import { Command, DiawwBotClient } from "../../client";
import { getGuildLanguage, setGuildLanguage } from "../../database/schema";
import {
  getAvailableLanguagesList,
  getLanguageMeta,
  resolveLanguage,
  SUPPORTED_LANGUAGES,
  t
} from "../../i18n";
import { createBaseEmbed, createErrorEmbed, createSuccessEmbed } from "../../utils/embeds";

const slashData = new SlashCommandBuilder()
  .setName("language")
  .setDescription("View or change the bot language for this server (English default, Indonesian, etc.)")
  .addStringOption((opt) =>
    opt
      .setName("lang")
      .setDescription("Choose the language to set for this server")
      .setRequired(false)
      .addChoices(
        { name: "🇺🇸 English (Default)", value: "en" },
        { name: "🇮🇩 Bahasa Indonesia", value: "id" },
        { name: "🇪🇸 Español", value: "es" },
        { name: "🇯🇵 日本語", value: "ja" },
        { name: "🇧🇷 Português", value: "pt" },
        { name: "🇷🇺 Русский", value: "ru" },
        { name: "🇫🇷 Français", value: "fr" },
        { name: "🇩🇪 Deutsch", value: "de" }
      )
  );

const languageCommand: Command = {
  name: "language",
  description: "View or change the bot language for this server",
  aliases: ["lang", "setlang", "bahasa"],
  category: "general",
  usage: "/language [lang] or w!language [lang]",
  slashData,

  executeSlash: async (interaction: ChatInputCommandInteraction, _client: DiawwBotClient) => {
    const guildId = interaction.guildId!;
    const currentLang = getGuildLanguage(guildId);
    const chosenLangInput = interaction.options.getString("lang");

    // Jika tidak memilih bahasa, tampilkan status saat ini & daftar pilihan
    if (!chosenLangInput) {
      const meta = getLanguageMeta(currentLang);
      const embed = createBaseEmbed(t(currentLang, "language.title"))
        .setDescription(
          t(currentLang, "language.current", {
            flag: meta.flag,
            name: meta.name,
            code: currentLang
          }) +
          "\n\n" +
          t(currentLang, "language.available", {
            list: getAvailableLanguagesList()
          })
        );

      return interaction.reply({ embeds: [embed] });
    }

    // Jika ingin mengubah bahasa, periksa permission
    const member = interaction.member as GuildMember;
    if (!member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      return interaction.reply({
        embeds: [createErrorEmbed(t(currentLang, "common.error_title"), t(currentLang, "common.permission_denied"))],
        ephemeral: true
      });
    }

    const resolved = resolveLanguage(chosenLangInput);
    if (!resolved) {
      const supportedCodes = Object.keys(SUPPORTED_LANGUAGES).join(", ");
      return interaction.reply({
        embeds: [
          createErrorEmbed(
            t(currentLang, "common.error_title"),
            t(currentLang, "language.invalid", {
              input: chosenLangInput,
              supported: supportedCodes
            })
          )
        ],
        ephemeral: true
      });
    }

    // Simpan bahasa baru ke SQLite
    const newLang = setGuildLanguage(guildId, resolved);
    const meta = getLanguageMeta(newLang);

    return interaction.reply({
      embeds: [
        createSuccessEmbed(
          t(newLang, "language.title"),
          t(newLang, "language.updated", {
            flag: meta.flag,
            name: meta.name,
            code: newLang
          })
        )
      ]
    });
  },

  executePrefix: async (message: Message, args: string[], _client: DiawwBotClient) => {
    const guildId = message.guildId!;
    const currentLang = getGuildLanguage(guildId);

    if (!args[0]) {
      const meta = getLanguageMeta(currentLang);
      const embed = createBaseEmbed(t(currentLang, "language.title"))
        .setDescription(
          t(currentLang, "language.current", {
            flag: meta.flag,
            name: meta.name,
            code: currentLang
          }) +
          "\n\n" +
          t(currentLang, "language.available", {
            list: getAvailableLanguagesList()
          })
        );

      return message.reply({ embeds: [embed] });
    }

    const member = message.member as GuildMember;
    if (!member.permissions.has(PermissionFlagsBits.ManageGuild)) {
      return message.reply({
        embeds: [createErrorEmbed(t(currentLang, "common.error_title"), t(currentLang, "common.permission_denied"))]
      });
    }

    const chosenLangInput = args[0];
    const resolved = resolveLanguage(chosenLangInput);

    if (!resolved) {
      const supportedCodes = Object.keys(SUPPORTED_LANGUAGES).join(", ");
      return message.reply({
        embeds: [
          createErrorEmbed(
            t(currentLang, "common.error_title"),
            t(currentLang, "language.invalid", {
              input: chosenLangInput,
              supported: supportedCodes
            })
          )
        ]
      });
    }

    const newLang = setGuildLanguage(guildId, resolved);
    const meta = getLanguageMeta(newLang);

    return message.reply({
      embeds: [
        createSuccessEmbed(
          t(newLang, "language.title"),
          t(newLang, "language.updated", {
            flag: meta.flag,
            name: meta.name,
            code: newLang
          })
        )
      ]
    });
  }
};

export default languageCommand;
