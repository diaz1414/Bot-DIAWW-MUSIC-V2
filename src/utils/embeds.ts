import { EmbedBuilder } from "discord.js";
import { config } from "../config";

const FOOTER_TEXT = "DIAWW MUSIC • High-Fidelity Audio • Serenetia Lavalink v4";
const DEFAULT_AVATAR = "https://cdn.discordapp.com/embed/avatars/0.png";

let cachedBotAvatar: string = DEFAULT_AVATAR;

/**
 * Memperbarui URL avatar bot dari akun bot Discord asli (PP Bot)
 */
export function setBotAvatar(url: string | null | undefined): void {
  if (url) {
    cachedBotAvatar = url;
  }
}

/**
 * Mengambil URL avatar bot saat ini (PP Bot Discord asli)
 */
export function getBotAvatar(): string {
  return cachedBotAvatar;
}

/**
 * Base Embed generator dengan icon footer dinamis mengikuti Avatar / PP Bot
 */
export function createBaseEmbed(title?: string, description?: string): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setColor(config.embedColors.primary as any)
    .setTimestamp()
    .setFooter({ text: FOOTER_TEXT, iconURL: getBotAvatar() });

  if (title) embed.setTitle(title);
  if (description) embed.setDescription(description);

  return embed;
}

/**
 * Success Embed (Hijau)
 */
export function createSuccessEmbed(title: string, description?: string): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setColor(config.embedColors.success as any)
    .setTitle(`✅ ${title}`)
    .setTimestamp()
    .setFooter({ text: FOOTER_TEXT, iconURL: getBotAvatar() });

  if (description) embed.setDescription(description);

  return embed;
}

/**
 * Error Embed (Merah)
 */
export function createErrorEmbed(title: string, description?: string): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setColor(config.embedColors.error as any)
    .setTitle(`❌ ${title}`)
    .setTimestamp()
    .setFooter({ text: FOOTER_TEXT, iconURL: getBotAvatar() });

  if (description) embed.setDescription(description);

  return embed;
}

/**
 * Info Embed (Biru / Primary)
 */
export function createInfoEmbed(title: string, description?: string): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setColor(config.embedColors.primary as any)
    .setTitle(`ℹ️ ${title}`)
    .setTimestamp()
    .setFooter({ text: FOOTER_TEXT, iconURL: getBotAvatar() });

  if (description) embed.setDescription(description);

  return embed;
}

/**
 * Warning Embed (Kuning)
 */
export function createWarningEmbed(title: string, description?: string): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setColor(config.embedColors.warning as any)
    .setTitle(`⚠️ ${title}`)
    .setTimestamp()
    .setFooter({ text: FOOTER_TEXT, iconURL: getBotAvatar() });

  if (description) embed.setDescription(description);

  return embed;
}
