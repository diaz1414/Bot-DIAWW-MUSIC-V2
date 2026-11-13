import {
  ChatInputCommandInteraction,
  Message,
  SlashCommandBuilder
} from "discord.js";
import { Command, DiawwBotClient } from "../../client";
import { getDatabase } from "../../database/db";
import { getGuildLanguage } from "../../database/schema";
import { t } from "../../i18n";
import { createBaseEmbed } from "../../utils/embeds";
import { formatDuration } from "../../utils/time";

const slashData = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Check WebSocket latency, Lavalink Nodes, SQLite Database, and system stats");

const pingCommand: Command = {
  name: "ping",
  description: "Check bot latency, node status, memory RAM, and database response time",
  aliases: ["latency"],
  category: "general",
  usage: "/ping or w!ping",
  slashData,

  executeSlash: async (interaction: ChatInputCommandInteraction, client: DiawwBotClient) => {
    const guildId = interaction.guildId!;
    const lang = getGuildLanguage(guildId);
    const wsPing = client.ws.ping;

    const startDb = performance.now();
    try {
      getDatabase().get("SELECT 1");
    } catch {}
    const dbPing = (performance.now() - startDb).toFixed(2);

    const nodes = client.lavalink.nodeManager.nodes;
    let nodeStatusList = "";
    nodes.forEach((node) => {
      const isConnected = node.connected;
      const stats = node.stats;
      const ping = stats ? `${stats.cpu ? (stats.cpu.lavalinkLoad * 100).toFixed(1) : 0}% CPU` : "Online";
      nodeStatusList += `• **${node.id}**: ${isConnected ? "🟢 Online" : "🔴 Offline"} (${ping})\n`;
    });

    if (!nodeStatusList) {
      nodeStatusList = "• *No active nodes*";
    }

    const memory = process.memoryUsage();
    const ramRss = (memory.rss / 1024 / 1024).toFixed(1);
    const ramHeap = (memory.heapUsed / 1024 / 1024).toFixed(1);
    const uptime = formatDuration(process.uptime() * 1000);

    const isBun = typeof (process.versions as any).bun !== "undefined";
    const runtimeName = isBun ? `Bun v${(process.versions as any).bun}` : `Node.js ${process.version}`;

    const embed = createBaseEmbed(t(lang, "ping.title"))
      .addFields(
        { name: t(lang, "ping.ws"), value: `\`${wsPing} ms\``, inline: true },
        { name: t(lang, "ping.db"), value: `\`${dbPing} ms\``, inline: true },
        { name: t(lang, "ping.uptime"), value: `\`${uptime}\``, inline: true },
        { name: t(lang, "ping.runtime"), value: `\`${runtimeName}\``, inline: true },
        { name: t(lang, "ping.ram"), value: `\`${ramHeap} MB (Heap) / ${ramRss} MB (RSS)\``, inline: true },
        { name: t(lang, "ping.players"), value: `\`${client.lavalink.players.size} Guild\``, inline: true },
        { name: t(lang, "ping.nodes"), value: nodeStatusList, inline: false }
      );

    return interaction.reply({ embeds: [embed] });
  },

  executePrefix: async (message: Message, _args: string[], client: DiawwBotClient) => {
    const guildId = message.guildId!;
    const lang = getGuildLanguage(guildId);
    const wsPing = client.ws.ping;

    const startDb = performance.now();
    try {
      getDatabase().get("SELECT 1");
    } catch {}
    const dbPing = (performance.now() - startDb).toFixed(2);

    const nodes = client.lavalink.nodeManager.nodes;
    let nodeStatusList = "";
    nodes.forEach((node) => {
      const isConnected = node.connected;
      const stats = node.stats;
      const ping = stats ? `${stats.cpu ? (stats.cpu.lavalinkLoad * 100).toFixed(1) : 0}% CPU` : "Online";
      nodeStatusList += `• **${node.id}**: ${isConnected ? "🟢 Online" : "🔴 Offline"} (${ping})\n`;
    });

    if (!nodeStatusList) {
      nodeStatusList = "• *No active nodes*";
    }

    const memory = process.memoryUsage();
    const ramRss = (memory.rss / 1024 / 1024).toFixed(1);
    const ramHeap = (memory.heapUsed / 1024 / 1024).toFixed(1);
    const uptime = formatDuration(process.uptime() * 1000);

    const isBun = typeof (process.versions as any).bun !== "undefined";
    const runtimeName = isBun ? `Bun v${(process.versions as any).bun}` : `Node.js ${process.version}`;

    const embed = createBaseEmbed(t(lang, "ping.title"))
      .addFields(
        { name: t(lang, "ping.ws"), value: `\`${wsPing} ms\``, inline: true },
        { name: t(lang, "ping.db"), value: `\`${dbPing} ms\``, inline: true },
        { name: t(lang, "ping.uptime"), value: `\`${uptime}\``, inline: true },
        { name: t(lang, "ping.runtime"), value: `\`${runtimeName}\``, inline: true },
        { name: t(lang, "ping.ram"), value: `\`${ramHeap} MB (Heap) / ${ramRss} MB (RSS)\``, inline: true },
        { name: t(lang, "ping.players"), value: `\`${client.lavalink.players.size} Guild\``, inline: true },
        { name: t(lang, "ping.nodes"), value: nodeStatusList, inline: false }
      );

    return message.reply({ embeds: [embed] });
  }
};

export default pingCommand;
