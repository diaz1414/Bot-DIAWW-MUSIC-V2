import { TranslationSchema } from "../types";

const en: TranslationSchema = {
  common: {
    footer: "DIAWW MUSIC • High-Fidelity Audio • Serenetia Lavalink v4",
    error_title: "Error",
    success_title: "Success",
    info_title: "Information",
    warning_title: "Warning",
    no_voice_channel: "You must be in a Voice Channel to use this command!",
    different_voice_channel: "You must be in the same Voice Channel as the bot!",
    no_music_playing: "No music is currently playing in this server.",
    permission_denied: "You do not have permission to execute this command!",
    system_error: "An error occurred while executing this command. Please try again later."
  },
  nowplaying: {
    header_normal: "🎵 NOW PLAYING",
    header_autoplay: "📻 NOW PLAYING • AUTOPLAY RECOMMENDATION",
    artist: "Artist",
    source: "Source",
    duration: "Duration",
    requester: "Requested By",
    requester_radio: "Radio System",
    volume: "Volume",
    loop_mode: "Loop Mode",
    autoplay_status: "Smart Autoplay",
    mode247_status: "24/7 Mode",
    next_track: "Up Next",
    next_empty: "None (Queue is empty)",
    live_stream: "🔴 LIVE STREAM",
    status_active: "🟢 Active",
    status_inactive: "🔴 Inactive",
    loop_off: "❌ Off",
    loop_track: "🔂 Track",
    loop_queue: "🔁 Queue"
  },
  buttons: {
    pause: "Pause",
    resume: "Resume",
    skip: "Skip",
    stop: "Stop",
    loop: "Loop",
    autoplay: "Autoplay",
    vol_down: "Vol -10%",
    vol_up: "Vol +10%",
    queue: "Queue",
    mode247: "24/7"
  },
  play: {
    searching: "Searching for tracks...",
    not_found: "No tracks found for: `{query}`.\nTry using a direct link or more specific keywords.",
    starting_playback: "Started playing: **[{title}]({uri})**\n👤 Artist: **{author}** • 🌐 Source: **{source}**\n⏱️ Duration: `{duration}`",
    added_to_queue: "Added to queue: **[{title}]({uri})**\n👤 Artist: **{author}** • 🌐 Source: **{source}**\n⏱️ Duration: `{duration}`\n📍 Queue Position: #{position}",
    playlist_added: "📁 **[{title}]({uri})**\n🔢 Count: **{count} tracks**\n⏱️ Total Duration: **{duration}**\n🌐 Source: **{source}**\n👤 Requested by: <@{user}>",
    queue_position: "Queue Position",
    tracks_count: "Tracks Count",
    total_duration: "Total Duration",
    requested_by: "Requested By",
    usage_warning: "Please provide a song title or link.\nExample: `w!play Yung Lean Ginseng Strip` or `w!p <link>`"
  },
  stop: {
    title: "Playback Stopped",
    description: "The queue has been cleared and the bot has disconnected from the voice channel.",
    button_stop: "Playback stopped by <@{user}>. Queue cleared and bot disconnected."
  },
  skip: {
    title: "Track Skipped",
    description: "Successfully skipped: **{title}**"
  },
  pause: {
    title: "Playback Paused",
    description: "Use `/resume` or the ▶️ button to continue playing.",
    already_paused: "The music player is already paused."
  },
  resume: {
    title: "Playback Resumed",
    description: "The music has resumed playing!",
    not_paused: "The music player is not paused."
  },
  queue: {
    title: "📜 Music Queue • {guild}",
    now_playing: "🎶 **Now Playing:**\n[{title}]({uri}) - `{duration}` ({source})\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    empty_now_playing: "No music is currently playing.",
    tracks_in_queue: "📋 Tracks in Queue ({count} tracks | Total: {duration})",
    queue_empty: "*Queue is empty. Type `/play` or `w!play` to add tracks.*",
    and_more: "\n*...and {count} more tracks in queue.*",
    autoplay_next_title: "📻 Next Autoplay Recommendation",
    autoplay_next_desc: "✨ [{title}]({uri})\n👤 Artist: **{author}** • Duration: `{duration}`\n*(Automatically selected via Spotify/YouTube Mix Radio)*",
    autoplay_analyzing: "🔍 *Analyzing genre and preparing recommendation in background...*",
    autoplay_off_desc: "*Autoplay is currently OFF. Enable with `/autoplay` or click the 📻 button.*"
  },
  autoplay: {
    title: "Autoplay Updated",
    enabled_desc: "Smart Autoplay is now: **🟢 ENABLED**\nThe bot will automatically select similar songs from Spotify Radio & YouTube Mix without repeating played songs.",
    disabled_desc: "Smart Autoplay is now: **🔴 DISABLED**\nThe bot will stop after the current queue finishes playing."
  },
  mode247: {
    title: "24/7 Mode Updated",
    enabled_desc: "24/7 Mode for this server is now: **🟢 ENABLED**\nThe bot will stay standby in the voice channel even after the queue ends.",
    disabled_desc: "24/7 Mode for this server is now: **🔴 DISABLED**\nThe bot will automatically disconnect if the queue remains empty for 60 seconds."
  },
  volume: {
    title: "Volume Updated",
    current: "Current volume level is **{volume}%**.\nTo change it, type: `w!vol <1-150>`",
    updated: "Volume level has been set to: **{volume}%**",
    invalid: "Please provide a valid volume number between **1** and **{max}**!"
  },
  loop: {
    title: "Loop Mode Updated",
    updated: "Loop mode is now set to: **{mode}**",
    off: "❌ Off (Normal)",
    track: "🔂 Loop Current Track",
    queue: "🔁 Loop Entire Queue"
  },
  shuffle: {
    title: "Queue Shuffled",
    shuffled: "Successfully shuffled **{count}** tracks in the queue.",
    not_enough: "At least 2 tracks are required in the queue to shuffle."
  },
  sources: {
    title: "🌐 Supported Music Platforms (9+ Sources)",
    description: "DIAWW MUSIC is powered by **Serenetia Lavalink v4** with LavaSrc plugins for lossless audio fidelity and unlimited platform flexibility:"
  },
  ping: {
    title: "🏓 DIAWW MUSIC Statistics & Latency",
    ws: "📡 Discord Gateway (WS)",
    db: "💾 Database SQLite",
    uptime: "⏱️ Bot Uptime",
    runtime: "⚡ Runtime Environment",
    ram: "🧠 RAM Usage",
    players: "🎵 Active Players",
    nodes: "🔌 Lavalink v4 Nodes"
  },
  prefix: {
    title: "Prefix Updated",
    current: "Current prefix is: `{prefix}`.\nTo change it, type: `{prefix}prefix <new_prefix>`",
    updated: "Command prefix for this server is now: `{prefix}`\nExample: `{prefix}play Yung Lean`",
    empty: "Prefix cannot be empty!",
    too_long: "Prefix maximum length is 10 characters!"
  },
  language: {
    title: "🌐 Language Settings",
    current: "Current server language: **{flag} {name} ({code})**",
    updated: "Server language has been successfully set to: **{flag} {name} ({code})**",
    available: "Available languages:\n{list}\n\nTo change language, use `/language <code_or_name>` or `w!lang <code_or_name>`.",
    invalid: "Invalid language `{input}`!\nSupported languages: {supported}"
  },
  help: {
    title: "📖 User Manual • DIAWW MUSIC",
    description: "**DIAWW MUSIC** is a Dedicated High-Fidelity Discord Music Bot with support for **9+ Music Platforms**, multi-tier smart search, and Spotify Radio Autoplay algorithm.\n\n🔹 **Server Prefix:** `{prefix}` *(Case-insensitive: `{prefix}play`, `{prefix_upper}play`)*\n🔹 **Language:** `{lang_flag} {lang_name}` (`/language`)\n🔹 **Slash Commands:** Type `/` to select interactive Discord commands.",
    music_commands: "🎵 Core Music Commands",
    queue_commands: "⚙️ Queue & Player Settings",
    general_commands: "🛠️ General & Server Commands",
    buttons_info: "🔘 Interactive Control Buttons (Now Playing Card)"
  },
  events: {
    queue_end_247_title: "Queue Finished",
    queue_end_247_desc: "All tracks have finished playing. Bot remains on standby in voice channel because **24/7 Mode is Active**.",
    queue_end_countdown_title: "Queue Finished",
    queue_end_countdown_desc: "No more tracks in queue. Bot will automatically disconnect in **60 seconds** if no new tracks are queued."
  }
};

export default en;
