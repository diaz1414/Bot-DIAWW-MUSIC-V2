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

export interface UserPlaylist {
  id: number;
  user_id: string;
  name: string;
  created_at: string;
  track_count?: number;
}

export interface PlaylistTrack {
  id: number;
  playlist_id: number;
  title: string;
  uri: string;
  author: string;
  duration: number;
  source: string;
  added_at: string;
}

export const MAX_USER_PLAYLISTS = 10;
export const MAX_TRACKS_PER_PLAYLIST = 50;

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

    CREATE TABLE IF NOT EXISTS user_playlists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, name)
    );
    CREATE INDEX IF NOT EXISTS idx_user_playlists_user ON user_playlists(user_id);

    CREATE TABLE IF NOT EXISTS playlist_tracks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      playlist_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      uri TEXT NOT NULL,
      author TEXT DEFAULT 'Unknown',
      duration INTEGER DEFAULT 0,
      source TEXT DEFAULT 'unknown',
      added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(playlist_id) REFERENCES user_playlists(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS idx_playlist_tracks_playlist ON playlist_tracks(playlist_id);
  `);

  // Migrasi aman jika database sudah dibuat sebelumnya tanpa kolom language
  try {
    db.run("ALTER TABLE guild_settings ADD COLUMN language TEXT DEFAULT 'en';");
  } catch {
    // Abaikan jika kolom sudah ada
  }

  console.log("[DATABASE] Skema database guild_settings & user_playlists berhasil diinisialisasi.");
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

// ==============================================================================
// USER CUSTOM PLAYLIST FUNCTIONS (100% Free - Max 10 Playlist @ 50 Lagu)
// ==============================================================================

/**
 * Mengambil semua playlist milik pengguna beserta jumlah lagunya
 */
export function getUserPlaylists(userId: string): Array<UserPlaylist & { track_count: number }> {
  const db = getDatabase();
  return db.all<UserPlaylist & { track_count: number }>(
    `SELECT p.*, COUNT(t.id) as track_count
     FROM user_playlists p
     LEFT JOIN playlist_tracks t ON p.id = t.playlist_id
     WHERE p.user_id = ?
     GROUP BY p.id
     ORDER BY p.name ASC`,
    userId
  );
}

/**
 * Mengambil satu playlist milik user berdasarkan nama
 */
export function getUserPlaylist(userId: string, name: string): UserPlaylist | undefined {
  const db = getDatabase();
  return db.get<UserPlaylist>(
    "SELECT * FROM user_playlists WHERE user_id = ? AND LOWER(name) = LOWER(?)",
    userId,
    name.trim()
  );
}

/**
 * Membuat playlist baru untuk user
 */
export function createUserPlaylist(
  userId: string,
  name: string
): { success: boolean; error?: string; playlist?: UserPlaylist } {
  const db = getDatabase();
  const cleanName = name.trim();

  if (cleanName.length < 1 || cleanName.length > 32) {
    return { success: false, error: "name_length" };
  }

  const countRow = db.get<{ count: number }>("SELECT COUNT(*) as count FROM user_playlists WHERE user_id = ?", userId);
  if (countRow && countRow.count >= MAX_USER_PLAYLISTS) {
    return { success: false, error: "limit_reached" };
  }

  const existing = getUserPlaylist(userId, cleanName);
  if (existing) {
    return { success: false, error: "already_exists" };
  }

  try {
    const res = db.run("INSERT INTO user_playlists (user_id, name) VALUES (?, ?)", userId, cleanName);
    const newId = Number(res?.lastInsertRowid || 0);
    return {
      success: true,
      playlist: {
        id: newId,
        user_id: userId,
        name: cleanName,
        created_at: new Date().toISOString()
      }
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Menghapus seluruh playlist beserta lagunya
 */
export function deleteUserPlaylist(userId: string, name: string): boolean {
  const db = getDatabase();
  const playlist = getUserPlaylist(userId, name);
  if (!playlist) return false;

  db.run("DELETE FROM playlist_tracks WHERE playlist_id = ?", playlist.id);
  db.run("DELETE FROM user_playlists WHERE id = ?", playlist.id);
  return true;
}

/**
 * Mengambil seluruh track lagu di dalam suatu playlist
 */
export function getPlaylistTracks(playlistId: number): PlaylistTrack[] {
  const db = getDatabase();
  return db.all<PlaylistTrack>(
    "SELECT * FROM playlist_tracks WHERE playlist_id = ? ORDER BY id ASC",
    playlistId
  );
}

/**
 * Menambahkan lagu ke dalam playlist
 */
export function addTrackToPlaylist(
  playlistId: number,
  track: { title: string; uri: string; author?: string; duration?: number; source?: string }
): { success: boolean; error?: string } {
  const db = getDatabase();

  const countRow = db.get<{ count: number }>("SELECT COUNT(*) as count FROM playlist_tracks WHERE playlist_id = ?", playlistId);
  if (countRow && countRow.count >= MAX_TRACKS_PER_PLAYLIST) {
    return { success: false, error: "track_limit_reached" };
  }

  try {
    db.run(
      "INSERT INTO playlist_tracks (playlist_id, title, uri, author, duration, source) VALUES (?, ?, ?, ?, ?, ?)",
      playlistId,
      track.title || "Unknown Title",
      track.uri || "https://discord.com",
      track.author || "Unknown Artist",
      track.duration || 0,
      track.source || "unknown"
    );
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Menghapus lagu dari playlist berdasarkan indeks 1-based (urutan nomor 1, 2, ...)
 */
export function removeTrackFromPlaylist(
  playlistId: number,
  trackIndex1Based: number
): { success: boolean; removedTrack?: PlaylistTrack } {
  const db = getDatabase();
  const tracks = getPlaylistTracks(playlistId);

  if (trackIndex1Based < 1 || trackIndex1Based > tracks.length) {
    return { success: false };
  }

  const target = tracks[trackIndex1Based - 1];
  db.run("DELETE FROM playlist_tracks WHERE id = ?", target.id);
  return { success: true, removedTrack: target };
}
