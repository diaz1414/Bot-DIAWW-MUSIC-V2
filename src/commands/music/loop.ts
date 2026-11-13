import {
  ChatInputCommandInteraction,
  GuildMember,
  Message,
  SlashCommandBuilder
} from "discord.js";
import { Command, DiawwBotClient } from "../../client";
import { getGuildLanguage } from "../../database/schema";
import { t } from "../../i18n";
import { createErrorEmbed, createSuccessEmbed } from "../../utils/embeds";

const slashData = new SlashCommandBuilder()
  .setName("loop")
  .setDescription("Set repeat mode for the current song or the whole queue")
  .addStringOption((opt) =>
    opt
      .setName("mode")
      .setDescription("Choose loop mode")
      .setRequired(false)
      .addChoices(
        { name: "❌ Off", value: "off" },
        { name: "🔂 Loop Track", value: "track" },
        { name: "🔁 Loop Queue", value: "queue" }
      )
  );

const loopCommand: Command = {
  name: "loop",
  description: "Change the playback repeat mode (off, track, queue)",
  aliases: ["repeat", "l"],
  category: "music",
  usage: "/loop [off/track/queue] or w!loop [off/track/queue]",
  slashData,

  executeSlash: async (interaction: ChatInputCommandInteraction, client: DiawwBotClient) => {
    const guildId = interaction.guildId!;
    const lang = getGuildLanguage(guildId);
    const member = interaction.member as GuildMember;
    const player = client.lavalink.getPlayer(guildId);

    if (!player) {
      return interaction.reply({
        embeds: [createErrorEmbed(t(lang, "common.error_title"), t(lang, "common.no_music_playing"))],
        ephemeral: true
      });
    }

    if (member?.voice?.channelId !== player.voiceChannelId) {
      return interaction.reply({
        embeds: [createErrorEmbed(t(lang, "common.error_title"), t(lang, "common.different_voice_channel"))],
        ephemeral: true
      });
    }

    let mode = interaction.options.getString("mode");

    if (!mode) {
      if (player.repeatMode === "off") mode = "track";
      else if (player.repeatMode === "track") mode = "queue";
      else mode = "off";
    }

    await player.setRepeatMode(mode as "off" | "track" | "queue");

    const modeLabels: Record<string, string> = {
      off: t(lang, "loop.off"),
      track: t(lang, "loop.track"),
      queue: t(lang, "loop.queue")
    };

    return interaction.reply({
      embeds: [
        createSuccessEmbed(
          t(lang, "loop.title"),
          t(lang, "loop.updated", { mode: modeLabels[mode] || mode })
        )
      ]
    });
  },

  executePrefix: async (message: Message, args: string[], client: DiawwBotClient) => {
    const guildId = message.guildId!;
    const lang = getGuildLanguage(guildId);
    const member = message.member as GuildMember;
    const player = client.lavalink.getPlayer(guildId);

    if (!player) {
      return message.reply({
        embeds: [createErrorEmbed(t(lang, "common.error_title"), t(lang, "common.no_music_playing"))]
      });
    }

    if (member?.voice?.channelId !== player.voiceChannelId) {
      return message.reply({
        embeds: [createErrorEmbed(t(lang, "common.error_title"), t(lang, "common.different_voice_channel"))]
      });
    }

    let mode = args[0]?.toLowerCase();

    if (!mode || !["off", "track", "queue"].includes(mode)) {
      if (player.repeatMode === "off") mode = "track";
      else if (player.repeatMode === "track") mode = "queue";
      else mode = "off";
    }

    await player.setRepeatMode(mode as "off" | "track" | "queue");

    const modeLabels: Record<string, string> = {
      off: t(lang, "loop.off"),
      track: t(lang, "loop.track"),
      queue: t(lang, "loop.queue")
    };

    return message.reply({
      embeds: [
        createSuccessEmbed(
          t(lang, "loop.title"),
          t(lang, "loop.updated", { mode: modeLabels[mode] || mode })
        )
      ]
    });
  }
};

export default loopCommand;
