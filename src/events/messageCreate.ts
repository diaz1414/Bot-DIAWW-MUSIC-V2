import { Message } from "discord.js";
import { DiawwBotClient } from "../client";
import { getGuildLanguage, getGuildSettings } from "../database/schema";
import { t } from "../i18n";
import { createErrorEmbed } from "../utils/embeds";

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default async function onMessageCreate(
  client: DiawwBotClient,
  message: Message
): Promise<void> {
  // Abaikan pesan dari sesama bot atau pesan di DM (hanya proses pesan guild)
  if (message.author.bot || !message.guild || !message.guildId) return;

  // Ambil prefix khusus guild dari SQLite (default: w!)
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
