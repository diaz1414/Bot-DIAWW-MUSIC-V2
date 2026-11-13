import { Message } from "discord.js";
import { DiawwBotClient } from "../client";
import { getGuildLanguage, getGuildSettings } from "../database/schema";
import { t } from "../i18n";
import { handleOwnerDM, isOwner } from "../modules/ownerManager";
import { createBaseEmbed, createErrorEmbed } from "../utils/embeds";

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default async function onMessageCreate(
  client: DiawwBotClient,
  message: Message
): Promise<void> {
  // Abaikan pesan dari sesama bot
  if (message.author.bot) return;

  // ============================================================================
  // 1. OWNER CONTROL PANEL VIA PERSONAL CHAT (DIRECT MESSAGE / DM)
  // ============================================================================
  if (!message.guild || !message.guildId) {
    if (isOwner(message.author.id, client)) {
      await handleOwnerDM(client, message);
    } else {
      await message.reply({
        embeds: [
          createBaseEmbed(
            "DIAWW MUSIC Support",
            "Halo! Untuk mendengarkan musik, gunakan perintah di server Discord Anda.\n" +
            "Jika ingin mengirim aduan, kendala, atau saran ke developer, gunakan perintah `/support <pesan>` di server Discord."
          )
        ]
      }).catch(() => {});
    }
    return;
  }

  // ============================================================================
  // 2. GUILD PREFIX COMMANDS (CASE-INSENSITIVE)
  // ============================================================================
  const guildSettings = getGuildSettings(message.guildId);
  const guildPrefix = guildSettings.prefix || client.config.bot.defaultPrefix || "w!";

  // Regex case-insensitive: mendukung w!, W!, DIAWW!, diaww!, dll.
  const prefixRegex = new RegExp(`^(${escapeRegex(guildPrefix)})`, "i");
  const match = message.content.match(prefixRegex);

  if (!match) return;

  // Potong prefix dan parse command name serta argumen
  const withoutPrefix = message.content.slice(match[0].length).trim();
  if (!withoutPrefix) return;

  const [rawCommandName, ...args] = withoutPrefix.split(/\s+/);
  if (!rawCommandName) return;

  const commandName = rawCommandName.toLowerCase();

  // Cari command berdasarkan nama utama atau alias
  const command =
    client.commands.get(commandName) ||
    client.commands.get(client.aliases.get(commandName) || "");

  if (!command || !command.executePrefix) return;

  try {
    await command.executePrefix(message, args, client);
  } catch (err: any) {
    console.error(`[PREFIX COMMAND ERROR] Error pada ${match[0]}${rawCommandName}:`, err);
    const lang = getGuildLanguage(message.guildId);
    await message.reply({
      embeds: [
        createErrorEmbed(
          t(lang, "common.error_title"),
          t(lang, "common.system_error")
        )
      ]
    }).catch(() => {});
  }
}
