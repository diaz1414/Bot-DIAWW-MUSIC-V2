import { TranslationSchema } from "../types";

const de: TranslationSchema = {
  common: {
    footer: "DIAWW MUSIC • High-Fidelity Audio • Serenetia Lavalink v4",
    error_title: "Fehler",
    success_title: "Erfolg",
    info_title: "Information",
    warning_title: "Warnung",
    no_voice_channel: "Du musst in einem Sprachkanal sein, um diesen Befehl zu nutzen!",
    different_voice_channel: "Du musst im selben Sprachkanal wie der Bot sein!",
    no_music_playing: "Auf diesem Server wird derzeit keine Musik abgespielt.",
    permission_denied: "Du hast keine Berechtigung, diesen Befehl auszuführen!",
    system_error: "Beim Ausführen des Befehls ist ein Fehler aufgetreten. Bitte versuche es später erneut."
  },
  nowplaying: {
    header_normal: "🎵 JETZT LÄUFT",
    header_autoplay: "📻 JETZT LÄUFT • AUTOPLAY-EMPFEHLUNG",
    artist: "Künstler",
    source: "Quelle",
    duration: "Dauer",
    requester: "Gewünscht von",
    requester_radio: "Radio-System",
    volume: "Lautstärke",
    loop_mode: "Wiederholungsmodus",
    autoplay_status: "Smart Autoplay",
    mode247_status: "24/7-Modus",
    next_track: "Als Nächstes",
    next_empty: "Keiner (Warteschlange ist leer)",
    live_stream: "🔴 LIVE-STREAM",
    status_active: "🟢 Aktiv",
    status_inactive: "🔴 Inaktiv",
    loop_off: "❌ Aus",
    loop_track: "🔂 Titel",
    loop_queue: "🔁 Warteschlange"
  },
  buttons: {
    pause: "Pause",
    resume: "Fortsetzen",
    skip: "Überspringen",
    stop: "Stopp",
    loop: "Wiederholen",
    autoplay: "Autoplay",
    vol_down: "Lautst. -10%",
    vol_up: "Lautst. +10%",
    queue: "Warteschlange",
    mode247: "24/7"
  },
  play: {
    searching: "Suche nach Titeln...",
    not_found: "Keine Titel gefunden für: `{query}`.\nVersuche es mit einem direkten Link oder genaueren Begriffen.",
    starting_playback: "Spiele jetzt: **[{title}]({uri})**\n👤 Künstler: **{author}** • 🌐 Quelle: **{source}**\n⏱️ Dauer: `{duration}`",
    added_to_queue: "Zur Warteschlange hinzugefügt: **[{title}]({uri})**\n👤 Künstler: **{author}** • 🌐 Quelle: **{source}**\n⏱️ Dauer: `{duration}`\n📍 Position: #{position}",
    playlist_added: "📁 **[{title}]({uri})**\n🔢 Anzahl: **{count} Titel**\n⏱️ Gesamtdauer: **{duration}**\n🌐 Quelle: **{source}**\n👤 Gewünscht von: <@{user}>",
    queue_position: "Warteschlangen-Position",
    tracks_count: "Anzahl Titel",
    total_duration: "Gesamtdauer",
    requested_by: "Gewünscht Von",
    usage_warning: "Bitte gib einen Titel oder Link an.\nBeispiel: `w!play Yung Lean Ginseng Strip` oder `w!p <link>`"
  },
  stop: {
    title: "Wiedergabe Gestoppt",
    description: "Die Warteschlange wurde geleert und der Bot hat den Sprachkanal verlassen.",
    button_stop: "Wiedergabe von <@{user}> gestoppt. Warteschlange geleert und Bot getrennt."
  },
  skip: {
    title: "Titel Übersprungen",
    description: "Erfolgreich übersprungen: **{title}**"
  },
  pause: {
    title: "Wiedergabe Pausiert",
    description: "Verwende `/resume` oder die ▶️-Taste zum Fortsetzen.",
    already_paused: "Der Musikplayer ist bereits pausiert."
  },
  resume: {
    title: "Wiedergabe Fortgesetzt",
    description: "Die Musik wird fortgesetzt!",
    not_paused: "Der Musikplayer ist nicht pausiert."
  },
  queue: {
    title: "📜 Warteschlange • {guild}",
    now_playing: "🎶 **Aktueller Titel:**\n[{title}]({uri}) - `{duration}` ({source})\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    empty_now_playing: "Derzeit wird keine Musik abgespielt.",
    tracks_in_queue: "📋 Titel in der Warteschlange ({count} Titel | Gesamt: {duration})",
    queue_empty: "*Die Warteschlange ist leer. Tippe `/play` oder `w!play`.*",
    and_more: "\n*...und {count} weitere Titel in der Warteschlange.*",
    autoplay_next_title: "📻 Nächste Autoplay-Empfehlung",
    autoplay_next_desc: "✨ [{title}]({uri})\n👤 Künstler: **{author}** • Dauer: `{duration}`\n*(Automatisch ausgewählt über Spotify/YouTube Mix Radio)*",
    autoplay_analyzing: "🔍 *Analysiere Genre und bereite Empfehlung im Hintergrund vor...*",
    autoplay_off_desc: "*Autoplay ist AUS. Aktiviere es mit `/autoplay` oder der 📻-Taste.*"
  },
  autoplay: {
    title: "Autoplay Aktualisiert",
    enabled_desc: "Smart Autoplay ist jetzt: **🟢 AKTIVIERT**\nDer Bot wählt automatisch passende Titel ohne Wiederholungen.",
    disabled_desc: "Smart Autoplay ist jetzt: **🔴 DEAKTIVIERT**\nDer Bot stoppt nach Ende der aktuellen Warteschlange."
  },
  mode247: {
    title: "24/7-Modus Aktualisiert",
    enabled_desc: "Der 24/7-Modus für diesen Server ist jetzt: **🟢 AKTIVIERT**\nDer Bot bleibt im Sprachkanal, auch wenn die Warteschlange endet.",
    disabled_desc: "Der 24/7-Modus für diesen Server ist jetzt: **🔴 DEAKTIVIERT**\nDer Bot trennt die Verbindung nach 60 Sekunden Inaktivität."
  },
  volume: {
    title: "Lautstärke Aktualisiert",
    current: "Aktuelle Lautstärke: **{volume}%**.\nZum Ändern: `w!vol <1-150>`",
    updated: "Lautstärke wurde eingestellt auf: **{volume}%**",
    invalid: "Bitte gib eine gültige Zahl zwischen **1** und **{max}** ein!"
  },
  loop: {
    title: "Wiederholungsmodus Aktualisiert",
    updated: "Wiederholungsmodus ist jetzt eingestellt auf: **{mode}**",
    off: "❌ Aus (Normal)",
    track: "🔂 Aktuellen Titel wiederholen",
    queue: "🔁 Gesamte Warteschlange wiederholen"
  },
  shuffle: {
    title: "Warteschlange Gemischt",
    shuffled: "**{count}** Titel wurden in der Warteschlange gemischt.",
    not_enough: "Mindestens 2 Titel werden zum Mischen benötigt."
  },
  sources: {
    title: "🌐 Unterstützte Musikplattformen (9+ Quellen)",
    description: "DIAWW MUSIC läuft auf **Serenetia Lavalink v4** mit LavaSrc-Plugins für verlustfreie Audioqualität:"
  },
  ping: {
    title: "🏓 DIAWW MUSIC Statistiken & Latenz",
    ws: "📡 Discord Gateway (WS)",
    db: "💾 SQLite-Datenbank",
    uptime: "⏱️ Betriebszeit",
    runtime: "⚡ Laufzeitumgebung",
    ram: "🧠 RAM-Auslastung",
    players: "🎵 Aktive Player",
    nodes: "🔌 Lavalink v4 Nodes"
  },
  prefix: {
    title: "Präfix Aktualisiert",
    current: "Aktueller Präfix: `{prefix}`.\nZum Ändern: `{prefix}prefix <neuer_präfix>`",
    updated: "Präfix für diesen Server ist jetzt: `{prefix}`\nBeispiel: `{prefix}play Yung Lean`",
    empty: "Präfix darf nicht leer sein!",
    too_long: "Maximale Länge des Präfixes ist 10 Zeichen!"
  },
  language: {
    title: "🌐 Spracheinstellungen",
    current: "Aktuelle Serversprache: **{flag} {name} ({code})**",
    updated: "Botsprache für diesen Server wurde geändert auf: **{flag} {name} ({code})**",
    available: "Verfügbare Sprachen:\n{list}\n\nZum Ändern: `/language <code_oder_name>` oder `w!lang <code_oder_name>`.",
    invalid: "Ungültige Sprache `{input}`!\nUnterstützte Sprachen: {supported}"
  },
  donate: {
    title: "☕ Unterstützen & Spenden für DIAWW MUSIC",
    description: "Vielen Dank, dass du **DIAWW MUSIC** nutzt!\nDu kannst unsere Server- und Hosting-Kosten über Saweria unterstützen:\n\n🔗 **Saweria-Link:** [{url}]({url})\n\nJeder Beitrag bedeutet uns sehr viel! ❤️",
    button_label: "Über Saweria spenden"
  },
  support: {
    title: "📩 Feedback / Support an den Entwickler senden",
    description: "Dein Bericht wurde direkt in das Postfach des Bot-Entwicklers weitergeleitet! Vielen Dank für deine Hilfe.",
    success_sent: "Dein Bericht wurde erfolgreich an den Entwickler übermittelt!",
    usage_warning: "Bitte gib deinen Bericht oder Vorschlag an.\nBeispiel: `w!report Fehler beim Abspielen eines Titels`",
    empty_message: "Die Nachricht darf nicht leer sein!"
  },
  help: {
    title: "📖 Benutzerhandbuch • DIAWW MUSIC",
    description: "**DIAWW MUSIC** ist ein High-Fidelity Discord-Musikbot mit Unterstützung für **9+ Plattformen**, mehrstufiger Suche und Spotify Radio Autoplay.\n\n🔹 **Server-Präfix:** `{prefix}`\n🔹 **Sprache:** `{lang_flag} {lang_name}` (`/language`)\n🔹 **Slash-Befehle:** Tippe `/` zur Befehlsauswahl.",
    music_commands: "🎵 Wichtige Musikbefehle",
    queue_commands: "⚙️ Warteschlange & Einstellungen",
    general_commands: "🛠️ Allgemeine & Server-Befehle",
    buttons_info: "🔘 Interaktive Steuertasten (Now Playing Card)"
  },
  playlist: {
    title: "Benutzer-Playlists",
    created: "Playlist **{name}** erfolgreich erstellt!",
    deleted: "Playlist **{name}** gelöscht.",
    not_found: "Playlist **{name}** wurde nicht gefunden.",
    already_exists: "Du hast bereits eine Playlist namens **{name}**!",
    limit_reached: "Du hast das Limit von **10 Playlists** erreicht.",
    track_added: "**[{title}]({uri})** zur Playlist **{name}** hinzugefügt!",
    track_limit_reached: "Die Playlist **{name}** hat das Limit von **50 Titeln** erreicht.",
    track_removed: "**{title}** aus Playlist **{name}** entfernt.",
    invalid_index: "Ungültige Titelnummer!",
    empty: "Die Playlist **{name}** ist leer.",
    list_title: "📂 Deine Playlists ({count}/10)",
    list_empty: "Du hast noch keine Playlists! Erstelle eine mit `/playlist create <Name>`.",
    view_title: "📂 Playlist: {name} ({count}/50 Titel)",
    playing: "**{count} Titel** aus Playlist **{name}** werden geladen und abgespielt!",
    no_tracks_to_play: "Playlist **{name}** kann nicht abgespielt werden, da sie leer ist.",
    name_invalid: "Der Playlist-Name muss zwischen 1 und 32 Zeichen lang sein."
  },
  events: {
    queue_end_247_title: "Warteschlange Beendet",
    queue_end_247_desc: "Alle Titel wurden abgespielt. Bot bleibt im Kanal, da **24/7-Modus Aktiv** ist.",
    queue_end_countdown_title: "Warteschlange Beendet",
    queue_end_countdown_desc: "Keine Titel mehr vorhanden. Bot trennt in **60 Sekunden**, wenn keine neuen Titel hinzukommen."
  }
};

export default de;
