import {
  ChatInputCommandInteraction,
  Message,
  SlashCommandBuilder
} from "discord.js";
import { Command, DiawwBotClient } from "../../client";
import { getGuildLanguage, getGuildSettings } from "../../database/schema";
import { getLanguageMeta, t } from "../../i18n";
import { createBaseEmbed } from "../../utils/embeds";

const slashData = new SlashCommandBuilder()
  .setName("help")
  .setDescription("Display user manual and command guide for DIAWW MUSIC");

const helpCommand: Command = {
  name: "help",
  description: "User guide for slash commands and prefix commands",
  aliases: ["h", "commands", "menu"],
  category: "general",
  usage: "/help or w!help",
  slashData,

  executeSlash: async (interaction: ChatInputCommandInteraction, _client: DiawwBotClient) => {
    const guildId = interaction.guildId!;
    const lang = getGuildLanguage(guildId);
    const langMeta = getLanguageMeta(lang);
    const guildSettings = getGuildSettings(guildId);
    const p = guildSettings.prefix;

    const embed = createBaseEmbed(t(lang, "help.title"))
      .setDescription(
        t(lang, "help.description", {
          prefix: p,
          prefix_upper: p.toUpperCase(),
          lang_flag: langMeta.flag,
          lang_name: langMeta.name
        })
      )
      .addFields(
        {
          name: t(lang, "help.music_commands"),
          value:
            `• \`/play <query>\` | \`${p}play\` (\`${p}p\`) — Play URL / search songs.\n` +
            `• \`/stop\` | \`${p}stop\` (\`${p}dc\`, \`${p}leave\`) — Stop playback & disconnect instantly.\n` +
            `• \`/skip\` | \`${p}skip\` (\`${p}s\`) — Skip current track.\n` +
            `• \`/pause\` | \`${p}pause\` — Pause audio playback.\n` +
            `• \`/resume\` | \`${p}resume\` — Resume audio playback.\n` +
            `• \`/nowplaying\` | \`${p}np\` — Display now playing card.`
        },
        {
          name: t(lang, "help.queue_commands"),
          value:
            `• \`/queue\` | \`${p}queue\` (\`${p}q\`) — View queue & next autoplay preview.\n` +
            `• \`/autoplay\` | \`${p}autoplay\` (\`${p}ap\`) — Toggle Spotify Radio Mix autoplay.\n` +
            `• \`/mode247\` | \`${p}247\` — Toggle 24/7 standby mode in voice channel.\n` +
            `• \`/volume <1-150>\` | \`${p}vol <1-150>\` — Adjust playback volume.\n` +
            `• \`/loop [mode]\` | \`${p}loop\` — Loop track / queue / off.\n` +
            `• \`/shuffle\` | \`${p}shuffle\` (\`${p}sh\`) — Randomize queue order.\n` +
            `• \`/sources\` | \`${p}sources\` — List of 9+ supported audio sources.`
        },
        {
          name: t(lang, "help.general_commands"),
          value:
            `• \`/language [lang]\` | \`${p}lang [lang]\` — Change server bot language.\n` +
            `• \`/donate\` | \`${p}donate\` — Support & donate via Saweria.\n` +
            `• \`/support <message>\` | \`${p}report <message>\` — Send bug report / feedback directly to Owner.\n` +
            `• \`/ping\` | \`${p}ping\` — Check WebSocket, SQLite, RAM, & Lavalink latency.\n` +
            `• \`/prefix <new>\` | \`${p}prefix <new>\` — Change server prefix.\n` +
            `• \`/help\` | \`${p}help\` — Open this manual guide.`
        },
        {
          name: t(lang, "help.buttons_info"),
          value:
            "• `⏯️ Pause/Resume` • `⏭️ Skip` • `⏹️ Stop (Instant DC)`\n" +
            "• `🔁 Loop` • `📻 Autoplay Radio` • `🔉/🔊 Vol -/+10%` • `⏳ Mode 24/7`"
        }
      );

    return interaction.reply({ embeds: [embed] });
  },

  executePrefix: async (message: Message, _args: string[], _client: DiawwBotClient) => {
    const guildId = message.guildId!;
    const lang = getGuildLanguage(guildId);
    const langMeta = getLanguageMeta(lang);
    const guildSettings = getGuildSettings(guildId);
    const p = guildSettings.prefix;

    const embed = createBaseEmbed(t(lang, "help.title"))
      .setDescription(
        t(lang, "help.description", {
          prefix: p,
          prefix_upper: p.toUpperCase(),
          lang_flag: langMeta.flag,
          lang_name: langMeta.name
        })
      )
      .addFields(
        {
          name: t(lang, "help.music_commands"),
          value:
            `• \`/play <query>\` | \`${p}play\` (\`${p}p\`) — Play URL / search songs.\n` +
            `• \`/stop\` | \`${p}stop\` (\`${p}dc\`, \`${p}leave\`) — Stop playback & disconnect instantly.\n` +
            `• \`/skip\` | \`${p}skip\` (\`${p}s\`) — Skip current track.\n` +
            `• \`/pause\` | \`${p}pause\` — Pause audio playback.\n` +
            `• \`/resume\` | \`${p}resume\` — Resume audio playback.\n` +
            `• \`/nowplaying\` | \`${p}np\` — Display now playing card.`
        },
        {
          name: t(lang, "help.queue_commands"),
          value:
            `• \`/queue\` | \`${p}queue\` (\`${p}q\`) — View queue & next autoplay preview.\n` +
            `• \`/autoplay\` | \`${p}autoplay\` (\`${p}ap\`) — Toggle Spotify Radio Mix autoplay.\n` +
            `• \`/mode247\` | \`${p}247\` — Toggle 24/7 standby mode in voice channel.\n` +
            `• \`/volume <1-150>\` | \`${p}vol <1-150>\` — Adjust playback volume.\n` +
            `• \`/loop [mode]\` | \`${p}loop\` — Loop track / queue / off.\n` +
            `• \`/shuffle\` | \`${p}shuffle\` (\`${p}sh\`) — Randomize queue order.\n` +
            `• \`/sources\` | \`${p}sources\` — List of 9+ supported audio sources.`
        },
        {
          name: t(lang, "help.general_commands"),
          value:
            `• \`/language [lang]\` | \`${p}lang [lang]\` — Change server bot language.\n` +
            `• \`/donate\` | \`${p}donate\` — Support & donate via Saweria.\n` +
            `• \`/support <message>\` | \`${p}report <message>\` — Send bug report / feedback directly to Owner.\n` +
            `• \`/ping\` | \`${p}ping\` — Check WebSocket, SQLite, RAM, & Lavalink latency.\n` +
            `• \`/prefix <new>\` | \`${p}prefix <new>\` — Change server prefix.\n` +
            `• \`/help\` | \`${p}help\` — Open this manual guide.`
        },
        {
          name: t(lang, "help.buttons_info"),
          value:
            "• `⏯️ Pause/Resume` • `⏭️ Skip` • `⏹️ Stop (Instant DC)`\n" +
            "• `🔁 Loop` • `📻 Autoplay Radio` • `🔉/🔊 Vol -/+10%` • `⏳ Mode 24/7`"
        }
      );

    return message.reply({ embeds: [embed] });
  }
};

export default helpCommand;
