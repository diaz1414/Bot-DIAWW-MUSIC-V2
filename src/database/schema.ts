import { getDatabase } from "./db";
import { config } from "../config";
import { DEFAULT_LANGUAGE, resolveLanguage, SupportedLanguage } from "../i18n";

export interface GuildSettings {
  guild_id: string;
  prefix: string;
  mode_247: number; // 0 = false, 1 = true
  default_volume: number;
  language: string; // 'en', 'id', 'es', 'ja', 'pt', 'ru', 'fr', 'de'
  updated_at: string;
}

/**
 * Inisialisasi skema tabel SQLite dan migrasi kolom
 */
export function initDatabase(): void {
  const db = getDatabase();

  db.exec(`
    CREATE TABLE IF NOT EXISTS guild_settings (
      guild_id TEXT PRIMARY KEY,
      prefix TEXT DEFAULT 'w!',
      mode_247 INTEGER DEFAULT 0,
      default_volume INTEGER DEFAULT 80,
      language TEXT DEFAULT 'en',
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Migrasi aman jika database sudah dibuat sebelumnya tanpa kolom language
  try {
    db.run("ALTER TABLE guild_settings ADD COLUMN language TEXT DEFAULT 'en';");
  } catch {
    // Abaikan jika kolom sudah ada
  }

  console.log("[DATABASE] Skema database guild_settings berhasil diinisialisasi & dimigrasikan.");
}

/**
 * Mengambil pengaturan guild. Jika belum ada, otomatis membuat data default.
 */
export function getGuildSettings(guildId: string): GuildSettings {
  const db = getDatabase();
  const defaultPrefix = config.bot.defaultPrefix || "w!";
  const defaultVolume = config.lavalink.defaultVolume || 80;

  let row = db.get<GuildSettings>("SELECT * FROM guild_settings WHERE guild_id = ?", guildId);

  if (!row) {
    db.run(
      "INSERT INTO guild_settings (guild_id, prefix, mode_247, default_volume, language, updated_at) VALUES (?, ?, 0, ?, 'en', CURRENT_TIMESTAMP)",
      guildId,
      defaultPrefix,
      defaultVolume
    );

    row = {
      guild_id: guildId,
      prefix: defaultPrefix,
      mode_247: 0,
      default_volume: defaultVolume,
      language: DEFAULT_LANGUAGE,
      updated_at: new Date().toISOString()
    };
  }

  // Jaga-jaga jika record lama memiliki language null/undefined
  if (!row.language) {
    row.language = DEFAULT_LANGUAGE;
  }

  return row;
}

/**
 * Mengambil kode bahasa server (fallback ke DEFAULT_LANGUAGE = 'en')
 */
export function getGuildLanguage(guildId: string): SupportedLanguage {
  const settings = getGuildSettings(guildId);
  const resolved = resolveLanguage(settings.language);
  return resolved || DEFAULT_LANGUAGE;
}

/**
 * Mengubah bahasa bot untuk guild tertentu
 */
export function setGuildLanguage(guildId: string, language: string): SupportedLanguage {
  const db = getDatabase();
  getGuildSettings(guildId); // Pastikan record ada

  const validLang = resolveLanguage(language) || DEFAULT_LANGUAGE;

  db.run(
    "UPDATE guild_settings SET language = ?, updated_at = CURRENT_TIMESTAMP WHERE guild_id = ?",
    validLang,
    guildId
  );

  return validLang;
}

/**
 * Mengubah custom prefix untuk guild tertentu
 */
export function setGuildPrefix(guildId: string, prefix: string): void {
  const db = getDatabase();
  getGuildSettings(guildId); // Pastikan record ada

  db.run(
    "UPDATE guild_settings SET prefix = ?, updated_at = CURRENT_TIMESTAMP WHERE guild_id = ?",
    prefix,
    guildId
  );
}

/**
 * Mengubah status Mode 24/7 (standby di voice channel)
 */
export function setGuild247(guildId: string, enabled: boolean): void {
  const db = getDatabase();
  getGuildSettings(guildId); // Pastikan record ada

  db.run(
    "UPDATE guild_settings SET mode_247 = ?, updated_at = CURRENT_TIMESTAMP WHERE guild_id = ?",
    enabled ? 1 : 0,
    guildId
  );
}

/**
 * Mengubah volume default per guild
 */
export function setGuildDefaultVolume(guildId: string, volume: number): void {
  const db = getDatabase();
  getGuildSettings(guildId); // Pastikan record ada

  db.run(
    "UPDATE guild_settings SET default_volume = ?, updated_at = CURRENT_TIMESTAMP WHERE guild_id = ?",
    Math.max(1, Math.min(volume, config.lavalink.maxVolume || 150)),
    guildId
  );
}
