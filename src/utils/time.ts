/**
 * DIAWW MUSIC - Time & Progress Bar Utilities
 */

/**
 * Format durasi milidetik menjadi format string HH:MM:SS atau MM:SS
 */
export function formatDuration(ms: number | undefined | null): string {
  if (!ms || isNaN(ms) || ms <= 0) return "00:00";
  // Deteksi live stream (durasi sangat besar atau tak terbatas)
  if (ms >= 864000000) return "🔴 LIVE STREAM";

  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor(ms / (1000 * 60 * 60));

  const pad = (n: number) => n.toString().padStart(2, "0");

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
}

/**
 * Membuat progress bar interaktif dengan indikator titik
 * Contoh output: 🔘▬▬▬▬▬▬▬▬▬▬ [01:23 / 03:45]
 */
export function createProgressBar(current: number, total: number, size: number = 14): string {
  if (!total || total <= 0 || isNaN(total) || total >= 864000000) {
    return `🔘▬▬▬▬▬▬▬▬▬▬ [🔴 LIVE STREAM]`;
  }

  const validCurrent = Math.max(0, Math.min(current, total));
  const progress = Math.round((size * validCurrent) / total);
  const emptyProgress = size - progress;

  const progressText = "▬".repeat(Math.max(0, progress - 1));
  const emptyProgressText = "▬".repeat(Math.max(0, emptyProgress));

  const bar = `${progressText}🔘${emptyProgressText}`;
  return `${bar} [${formatDuration(validCurrent)} / ${formatDuration(total)}]`;
}

/**
 * Mengubah string waktu (contoh: 1:30, 90s, 2m, 1h) menjadi milidetik
 */
export function parseTime(timeStr: string): number | null {
  if (!timeStr) return null;

  // Format detik langsung: 45, 45s
  if (/^\d+s?$/i.test(timeStr)) {
    return parseInt(timeStr, 10) * 1000;
  }

  // Format menit: 2m
  if (/^\d+m$/i.test(timeStr)) {
    return parseInt(timeStr, 10) * 60 * 1000;
  }

  // Format jam: 1h
  if (/^\d+h$/i.test(timeStr)) {
    return parseInt(timeStr, 10) * 60 * 60 * 1000;
  }

  // Format MM:SS atau HH:MM:SS
  const parts = timeStr.split(":").map((p) => parseInt(p, 10));
  if (parts.some(isNaN)) return null;

  if (parts.length === 2) {
    return (parts[0] * 60 + parts[1]) * 1000;
  } else if (parts.length === 3) {
    return (parts[0] * 3600 + parts[1] * 60 + parts[2]) * 1000;
  }

  return null;
}
