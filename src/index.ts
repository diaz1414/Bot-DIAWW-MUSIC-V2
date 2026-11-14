import { DiawwBotClient } from "./client";
import { validateConfig } from "./config";
import { getDatabase } from "./database/db";
import { saveAllActiveSessions, stopSessionPersistence } from "./modules/sessionManager";

// ==============================================================================
// 1. SISTEM ANTI-CRASH GLOBAL (Menjaga Bot Tetap Hidup 24/7 Tanpa Down)
// ==============================================================================

process.on("unhandledRejection", (reason: any, promise: Promise<any>) => {
  console.error("[ANTI-CRASH] ⚠️ Unhandled Promise Rejection terdeteksi:");
  console.error("Promise:", promise);
  console.error("Reason:", reason?.stack || reason);
});

process.on("uncaughtException", (error: Error, origin: string) => {
  console.error(`[ANTI-CRASH] 💥 Uncaught Exception (${origin}):`);
  console.error(error?.stack || error);
});

process.on("uncaughtExceptionMonitor", (error: Error, origin: string) => {
  console.error(`[ANTI-CRASH] 🔍 Uncaught Exception Monitor (${origin}):`);
  console.error(error?.stack || error);
});

// ==============================================================================
// 2. INISIALISASI & STARTUP BOT
// ==============================================================================

async function bootstrap(): Promise<void> {
  console.log("==================================================================");
  console.log("  DIAWW MUSIC - MEMULAI INISIALISASI SISTEM BOT...");
  console.log("==================================================================");

  // Validasi konfigurasi & token
  if (!validateConfig()) {
    console.error("[STARTUP ERROR] Konfigurasi tidak lengkap. Bot berhenti.");
    process.exit(1);
  }

  const client = new DiawwBotClient();

  // Penanganan Graceful Shutdown (Pterodactyl Stop / Ctrl+C)
  const shutdown = async (signal: string) => {
    console.log(`\n[SHUTDOWN] Menerima sinyal ${signal}. Menutup koneksi bot...`);
    try {
      // Simpan seluruh sesi musik aktif agar otomatis dilanjutkan di menit yang sama saat bot hidup lagi
      saveAllActiveSessions(client);
      stopSessionPersistence();

      if (client.lavalink) {
        client.lavalink.players.forEach((player) => {
          try {
            player.disconnect();
          } catch {}
        });
      }

      try {
        getDatabase().close();
      } catch {}

      client.destroy();
      console.log("[SHUTDOWN] Seluruh proses berhasil dihentikan dengan aman. Sampai jumpa!");
      process.exit(0);
    } catch (err) {
      console.error("[SHUTDOWN ERROR] Gagal menutup koneksi dengan rapi:", err);
      process.exit(1);
    }
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));

  try {
    await client.start();
  } catch (err: any) {
    console.error("[STARTUP ERROR] Gagal menjalankan bot:", err.message);
    process.exit(1);
  }
}

bootstrap();
