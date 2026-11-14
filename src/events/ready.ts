import { ActivityType, REST, Routes } from "discord.js";
import { DiawwBotClient } from "../client";
import { initDatabase } from "../database/schema";
import { initMusicManager } from "../modules/musicManager";
import { startSessionPersistence } from "../modules/sessionManager";
import { setBotAvatar } from "../utils/embeds";

export default async function onReady(client: DiawwBotClient): Promise<void> {
  console.log(`[CLIENT] Bot berhasil login sebagai ${client.user?.tag} (${client.user?.id})`);

  // 1. Simpan Avatar / Profil Picture (PP) bot Discord asli ke cache embed
  if (client.user) {
    const avatarUrl = client.user.displayAvatarURL({ size: 256 });
    setBotAvatar(avatarUrl);
    console.log(`[CLIENT] Avatar bot disetel dari profil Discord: ${avatarUrl}`);
  }

  // Listener jika avatar/PP bot diubah di Discord Developer Portal
  client.on("userUpdate", (oldUser, newUser) => {
    if (newUser.id === client.user?.id) {
      const updatedAvatar = newUser.displayAvatarURL({ size: 256 });
      setBotAvatar(updatedAvatar);
      console.log(`[CLIENT] Avatar bot otomatis diperbarui: ${updatedAvatar}`);
    }
  });

  // 2. Inisialisasi Database SQLite
  initDatabase();

  // 3. Inisialisasi Music Manager & Lavalink v4
  client.lavalink = initMusicManager(client);
  await client.lavalink.init({
    id: client.user!.id,
    username: client.user?.username || "DIAWW MUSIC"
  });

  // Mulai sistem pengaman auto-save posisi musik (Auto-Resume Shield)
  startSessionPersistence(client);

  // 4. Registrasi Slash Commands Global ke Discord API
  try {
    const rest = new REST({ version: "10" }).setToken(client.config.token);
    const slashCommandsData = client.commands
      .filter((cmd) => cmd.slashData)
      .map((cmd) => cmd.slashData.toJSON());

    console.log(`[SLASH COMMANDS] Mendaftarkan ${slashCommandsData.length} slash commands ke Discord REST API...`);

    const clientId = client.config.clientId || client.user!.id;
    await rest.put(Routes.applicationCommands(clientId), {
      body: slashCommandsData
    });

    console.log(`[SLASH COMMANDS] ✅ Sukses mendaftarkan ${slashCommandsData.length} slash commands secara global!`);
  } catch (err: any) {
    console.error("[SLASH COMMANDS] ❌ Gagal mendaftarkan slash commands:", err.message);
  }

  // 5. Rotasi Status Aktivitas Discord
  const statuses = client.config.bot.status || [
    { name: "w!help | DIAWW MUSIC", type: ActivityType.Listening },
    { name: "/play | High-Fidelity Audio", type: ActivityType.Listening },
    { name: "9+ Sumber Musik & Radio", type: ActivityType.Playing }
  ];

  let statusIndex = 0;
  const updatePresence = () => {
    if (!client.user) return;
    const current = statuses[statusIndex % statuses.length];
    client.user.setActivity(current.name, {
      type: current.type as any
    });
    statusIndex++;
  };

  updatePresence();
  setInterval(updatePresence, client.config.bot.statusInterval || 30000);

  // 6. Banner Konsol
  console.log("==================================================================");
  console.log("  ██████╗ ██╗ █████╗ ██╗    ██╗██╗    ██╗  ███╗   ███╗██╗   ██╗███████╗██╗ ██████╗ ");
  console.log("  ██╔══██╗██║██╔══██╗██║    ██║██║    ██║  ████╗ ████║██║   ██║██╔════╝██║██╔════╝ ");
  console.log("  ██║  ██║██║███████║██║ █╗ ██║██║ █╗ ██║  ██╔████╔██║██║   ██║███████╗██║██║     ");
  console.log("  ██║  ██║██║██╔══██║██║███╗██║██║███╗██║  ██║╚██╔╝██║██║   ██║╚════██║██║██║     ");
  console.log("  ██████╔╝██║██║  ██║╚███╔███╔╝╚███╔███╔╝  ██║ ╚═╝ ██║╚██████╔╝███████║██║╚██████╗");
  console.log("  ╚═════╝ ╚═╝╚═╝  ╚═╝ ╚══╝╚══╝  ╚══╝╚══╝   ╚═╝     ╚═╝ ╚═════╝ ╚══════╝╚═╝ ╚═════╝");
  console.log("                 DEDICATED HIGH-FIDELITY DISCORD MUSIC BOT                        ");
  console.log("==================================================================");
}
