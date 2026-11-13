import {
  ButtonInteraction,
  ChatInputCommandInteraction,
  GuildMember,
  Interaction,
  TextChannel
} from "discord.js";
import { DiawwBotClient } from "../client";
import { getGuildLanguage, setGuild247, setGuildDefaultVolume } from "../database/schema";
import { t } from "../i18n";
import {
  buildNowPlayingComponents,
  buildNowPlayingEmbed,
  buildQueueEmbed,
  destroyAndCleanPlayer,
  prepareAutoplayNextTrack
} from "../modules/musicManager";
import { handleOwnerButton } from "../modules/ownerManager";
import { createErrorEmbed, createSuccessEmbed, createWarningEmbed } from "../utils/embeds";

export default async function onInteractionCreate(
  client: DiawwBotClient,
  interaction: Interaction
): Promise<void> {
  // 1. Handle Slash Command
  if (interaction.isChatInputCommand()) {
    const cmd = client.commands.get(interaction.commandName.toLowerCase());
    if (!cmd || !cmd.executeSlash) return;

    try {
      await cmd.executeSlash(interaction, client);
    } catch (err: any) {
      console.error(`[INTERACTION ERROR] Error pada command /${interaction.commandName}:`, err);
      const lang = getGuildLanguage(interaction.guildId || "");
      const errorEmbed = createErrorEmbed(
        t(lang, "common.error_title"),
        t(lang, "common.system_error")
      );

      if (interaction.deferred || interaction.replied) {
        await interaction.followUp({ embeds: [errorEmbed], ephemeral: true }).catch(() => {});
      } else {
        await interaction.reply({ embeds: [errorEmbed], ephemeral: true }).catch(() => {});
      }
    }
    return;
  }

  // 2. Handle Autocomplete
  if (interaction.isAutocomplete()) {
    const cmd = client.commands.get(interaction.commandName.toLowerCase());
    if (cmd && cmd.autocomplete) {
      try {
        await cmd.autocomplete(interaction, client);
      } catch (err) {
        console.error(`[AUTOCOMPLETE ERROR] Error pada /${interaction.commandName}:`, err);
      }
    }
    return;
  }

  // 3. Handle Interactive Button Controls
  if (interaction.isButton()) {
    if (interaction.customId.startsWith("owner_")) {
      await handleOwnerButton(client, interaction);
      return;
    }
    await handleButtonInteraction(client, interaction);
  }
}

/**
 * Handler Khusus Seluruh Tombol Kontrol Now Playing Multibahasa
 */
async function handleButtonInteraction(
  client: DiawwBotClient,
  interaction: ButtonInteraction
): Promise<void> {
  const customId = interaction.customId;
  if (!customId.startsWith("music_")) return;

  const guildId = interaction.guildId!;
  const lang = getGuildLanguage(guildId);
  const member = interaction.member as GuildMember;
  const player = client.lavalink.getPlayer(guildId);

  // Validasi keberadaan player
  if (!player) {
    await interaction.reply({
      embeds: [createErrorEmbed(t(lang, "common.error_title"), t(lang, "common.no_music_playing"))],
      ephemeral: true
    });
    return;
  }

  // Validasi voice channel
  if (!member?.voice?.channelId || member.voice.channelId !== player.voiceChannelId) {
    await interaction.reply({
      embeds: [
        createErrorEmbed(
          t(lang, "common.error_title"),
          t(lang, "common.different_voice_channel")
        )
      ],
      ephemeral: true
    });
    return;
  }

  switch (customId) {
    // Tombol: Jeda / Lanjut (Pause / Resume)
    case "music_toggle_pause": {
      if (player.paused) {
        await player.resume();
      } else {
        await player.pause();
      }

      // Update komponen tombol pada pesan Now Playing
      const newComponents = buildNowPlayingComponents(player);
      await interaction.update({ components: newComponents }).catch(() => {});
      break;
    }

    // Tombol: Lewati (Skip)
    case "music_skip": {
      if (!player.queue.current) {
        await interaction.reply({
          embeds: [createWarningEmbed(t(lang, "common.warning_title"), t(lang, "common.no_music_playing"))],
          ephemeral: true
        });
        return;
      }

      const skipped = player.queue.current.info.title;
      await player.skip();

      await interaction.reply({
        embeds: [
          createSuccessEmbed(
            t(lang, "skip.title"),
            t(lang, "skip.description", { title: skipped })
          )
        ],
        ephemeral: true
      });
      break;
    }

    // Tombol: Berhenti (Stop - Instan disconnect & hapus pesan kartu)
    case "music_stop": {
      await interaction.deferUpdate();
      await destroyAndCleanPlayer(player, client);

      const channel = interaction.channel as TextChannel;
      if (channel) {
        await channel.send({
          embeds: [
            createSuccessEmbed(
              t(lang, "stop.title"),
              t(lang, "stop.button_stop", { user: interaction.user.id })
            )
          ]
        }).catch(() => {});
      }
      break;
    }

    // Tombol: Toggle Loop Mode
    case "music_toggle_loop": {
      let nextMode: "off" | "track" | "queue" = "off";
      if (player.repeatMode === "off") nextMode = "track";
      else if (player.repeatMode === "track") nextMode = "queue";
      else nextMode = "off";

      await player.setRepeatMode(nextMode);

      const newComponents = buildNowPlayingComponents(player);
      await interaction.update({ components: newComponents }).catch(() => {});
      break;
    }

    // Tombol: Toggle Autoplay
    case "music_toggle_autoplay": {
      const currentStatus = player.get("autoplay") === true;
      const newStatus = !currentStatus;
      player.set("autoplay", newStatus);

      if (newStatus && player.queue.current) {
        prepareAutoplayNextTrack(player, client, player.queue.current).catch(() => {});
      }

      const newComponents = buildNowPlayingComponents(player);
      await interaction.update({ components: newComponents }).catch(() => {});
      break;
    }

    // Tombol: Toggle Mode 24/7
    case "music_toggle_247": {
      const current247 = player.get("mode_247") === true;
      const new247 = !current247;

      player.set("mode_247", new247);
      setGuild247(guildId, new247);

      if (new247) {
        const timer = player.get<NodeJS.Timeout>("disconnect_timeout");
        if (timer) {
          clearTimeout(timer);
          player.set("disconnect_timeout", null);
        }
      }

      const newComponents = buildNowPlayingComponents(player);
      await interaction.update({ components: newComponents }).catch(() => {});
      break;
    }

    // Tombol: Volume Turun 10%
    case "music_vol_down": {
      const newVol = Math.max(10, player.volume - 10);
      await player.setVolume(newVol);
      setGuildDefaultVolume(guildId, newVol);

      if (player.queue.current) {
        const newEmbed = buildNowPlayingEmbed(player, player.queue.current);
        const newComponents = buildNowPlayingComponents(player);
        await interaction.update({ embeds: [newEmbed], components: newComponents }).catch(() => {});
      } else {
        await interaction.reply({
          embeds: [createSuccessEmbed(t(lang, "volume.title"), t(lang, "volume.updated", { volume: newVol }))],
          ephemeral: true
        });
      }
      break;
    }

    // Tombol: Volume Naik 10%
    case "music_vol_up": {
      const newVol = Math.min(150, player.volume + 10);
      await player.setVolume(newVol);
      setGuildDefaultVolume(guildId, newVol);

      if (player.queue.current) {
        const newEmbed = buildNowPlayingEmbed(player, player.queue.current);
        const newComponents = buildNowPlayingComponents(player);
        await interaction.update({ embeds: [newEmbed], components: newComponents }).catch(() => {});
      } else {
        await interaction.reply({
          embeds: [createSuccessEmbed(t(lang, "volume.title"), t(lang, "volume.updated", { volume: newVol }))],
          ephemeral: true
        });
      }
      break;
    }

    // Tombol: Tampilkan Antrean
    case "music_show_queue": {
      const queueEmbed = buildQueueEmbed(player, interaction.guild?.name || "Server");
      await interaction.reply({ embeds: [queueEmbed], ephemeral: true });
      break;
    }

    default:
      break;
  }
}
