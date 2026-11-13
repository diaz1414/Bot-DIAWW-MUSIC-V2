import { TranslationSchema } from "../types";

const fr: TranslationSchema = {
  common: {
    footer: "DIAWW MUSIC • Audio Haute-Fidélité • Serenetia Lavalink v4",
    error_title: "Erreur",
    success_title: "Succès",
    info_title: "Information",
    warning_title: "Avertissement",
    no_voice_channel: "Vous devez être dans un salon vocal pour utiliser cette commande !",
    different_voice_channel: "Vous devez être dans le même salon vocal que le bot !",
    no_music_playing: "Aucune musique n'est en cours de lecture sur ce serveur.",
    permission_denied: "Vous n'avez pas la permission d'exécuter cette commande !",
    system_error: "Une erreur est survenue lors de l'exécution. Veuillez réessayer plus tard."
  },
  nowplaying: {
    header_normal: "🎵 EN COURS DE LECTURE",
    header_autoplay: "📻 EN LECTURE • RECOMMANDATION AUTOPLAY",
    artist: "Artiste",
    source: "Source",
    duration: "Durée",
    requester: "Demandé par",
    requester_radio: "Système Radio",
    volume: "Volume",
    loop_mode: "Mode Répétition",
    autoplay_status: "Lecture Auto",
    mode247_status: "Mode 24/7",
    next_track: "Suivant",
    next_empty: "Aucun (File d'attente vide)",
    live_stream: "🔴 EN DIRECT",
    status_active: "🟢 Actif",
    status_inactive: "🔴 Inactif",
    loop_off: "❌ Désactivé",
    loop_track: "🔂 Piste",
    loop_queue: "🔁 File"
  },
  buttons: {
    pause: "Pause",
    resume: "Reprendre",
    skip: "Passer",
    stop: "Arrêter",
    loop: "Boucle",
    autoplay: "Autoplay",
    vol_down: "Vol -10%",
    vol_up: "Vol +10%",
    queue: "File",
    mode247: "24/7"
  },
  play: {
    searching: "Recherche de pistes...",
    not_found: "Aucune piste trouvée pour : `{query}`.\nEssayez un lien direct ou des mots-clés plus précis.",
    starting_playback: "Lecture de : **[{title}]({uri})**\n👤 Artiste : **{author}** • 🌐 Source : **{source}**\n⏱️ Durée : `{duration}`",
    added_to_queue: "Ajouté à la file : **[{title}]({uri})**\n👤 Artiste : **{author}** • 🌐 Source : **{source}**\n⏱️ Durée : `{duration}`\n📍 Position dans la file : #{position}",
    playlist_added: "📁 **[{title}]({uri})**\n🔢 Nombre : **{count} pistes**\n⏱️ Durée totale : **{duration}**\n🌐 Source : **{source}**\n👤 Demandé par : <@{user}>",
    queue_position: "Position dans la file",
    tracks_count: "Nombre de pistes",
    total_duration: "Durée totale",
    requested_by: "Demandé par",
    usage_warning: "Veuillez fournir un titre ou un lien.\nExemple : `w!play Yung Lean Ginseng Strip` ou `w!p <lien>`"
  },
  stop: {
    title: "Lecture Arrêtée",
    description: "La file d'attente a été vidée et le bot s'est déconnecté du salon vocal.",
    button_stop: "Lecture arrêtée par <@{user}>. File vidée et bot déconnecté."
  },
  skip: {
    title: "Piste Passée",
    description: "Piste passée avec succès : **{title}**"
  },
  pause: {
    title: "Lecture en Pause",
    description: "Utilisez `/resume` ou le bouton ▶️ pour continuer.",
    already_paused: "Le lecteur est déjà en pause."
  },
  resume: {
    title: "Lecture Reprise",
    description: "La lecture de la musique a repris !",
    not_paused: "Le lecteur n'est pas en pause."
  },
  queue: {
    title: "📜 File d'attente • {guild}",
    now_playing: "🎶 **En cours :**\n[{title}]({uri}) - `{duration}` ({source})\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    empty_now_playing: "Aucune musique en cours de lecture.",
    tracks_in_queue: "📋 Pistes dans la file ({count} pistes | Total : {duration})",
    queue_empty: "*La file est vide. Tapez `/play` ou `w!play` pour ajouter des titres.*",
    and_more: "\n*...et {count} pistes de plus dans la file.*",
    autoplay_next_title: "📻 Prochaine Recommandation Autoplay",
    autoplay_next_desc: "✨ [{title}]({uri})\n👤 Artiste : **{author}** • Durée : `{duration}`\n*(Sélectionné automatiquement via Spotify/YouTube Mix Radio)*",
    autoplay_analyzing: "🔍 *Analyse du genre et préparation de la recommandation en arrière-plan...*",
    autoplay_off_desc: "*L'Autoplay est DÉSACTIVÉ. Activez-le avec `/autoplay` ou le bouton 📻.*"
  },
  autoplay: {
    title: "Autoplay Mis à Jour",
    enabled_desc: "L'Autoplay Intelligent est maintenant : **🟢 ACTIVÉ**\nLe bot sélectionnera des titres similaires sans répéter les morceaux déjà joués.",
    disabled_desc: "L'Autoplay Intelligent est maintenant : **🔴 DÉSACTIVÉ**\nLe bot s'arrêtera une fois la file d'attente terminée."
  },
  mode247: {
    title: "Mode 24/7 Mis à Jour",
    enabled_desc: "Le Mode 24/7 pour ce serveur est : **🟢 ACTIVÉ**\nLe bot restera en attente dans le salon vocal même après la fin de la file.",
    disabled_desc: "Le Mode 24/7 pour ce serveur est : **🔴 DÉSACTIVÉ**\nLe bot se déconnectera si la file reste vide pendant 60 secondes."
  },
  volume: {
    title: "Volume Mis à Jour",
    current: "Le volume actuel est de **{volume}%**.\nPour modifier : `w!vol <1-150>`",
    updated: "Le volume a été réglé sur : **{volume}%**",
    invalid: "Veuillez entrer une valeur comprise entre **1** et **{max}** !"
  },
  loop: {
    title: "Mode Boucle Mis à Jour",
    updated: "Le mode boucle est maintenant réglé sur : **{mode}**",
    off: "❌ Désactivé (Normal)",
    track: "🔂 Répéter la Piste",
    queue: "🔁 Répéter la File"
  },
  shuffle: {
    title: "File Mélangée",
    shuffled: "**{count}** pistes ont été mélangées dans la file d'attente.",
    not_enough: "Au moins 2 pistes sont requises pour mélanger."
  },
  sources: {
    title: "🌐 Plateformes Musicales Supportées (9+ Sources)",
    description: "DIAWW MUSIC est propulsé par **Serenetia Lavalink v4** et les plugins LavaSrc pour une qualité sonore sans perte :"
  },
  ping: {
    title: "🏓 Statistiques & Latence de DIAWW MUSIC",
    ws: "📡 Passerelle Discord (WS)",
    db: "💾 Base de Données SQLite",
    uptime: "⏱️ Temps de Fonctionnement",
    runtime: "⚡ Environnement d'Exécution",
    ram: "🧠 Utilisation RAM",
    players: "🎵 Lecteurs Actifs",
    nodes: "🔌 Nœuds Lavalink v4"
  },
  prefix: {
    title: "Préfixe Mis à Jour",
    current: "Le préfixe actuel est : `{prefix}`.\nPour changer : `{prefix}prefix <nouveau_prefixe>`",
    updated: "Le préfixe pour ce serveur est maintenant : `{prefix}`\nExemple : `{prefix}play Yung Lean`",
    empty: "Le préfixe ne peut pas être vide !",
    too_long: "La longueur maximale est de 10 caractères !"
  },
  language: {
    title: "🌐 Paramètres de Langue",
    current: "Langue actuelle du serveur : **{flag} {name} ({code})**",
    updated: "La langue du bot pour ce serveur a été changée pour : **{flag} {name} ({code})**",
    available: "Langues disponibles :\n{list}\n\nPour changer la langue, utilisez `/language <code_ou_nom>` ou `w!lang <code_ou_nom>`.",
    invalid: "Langue `{input}` non valide !\nLangues supportées : {supported}"
  },
  donate: {
    title: "☕ Soutenir & Faire un Don à DIAWW MUSIC",
    description: "Merci d'utiliser **DIAWW MUSIC** !\nVous pouvez nous aider à couvrir les coûts d'hébergement via Saweria :\n\n🔗 **Lien Saweria :** [{url}]({url})\n\nChaque don compte énormément pour nous ! ❤️",
    button_label: "Faire un don via Saweria"
  },
  support: {
    title: "📩 Envoyer un Signalement / Support au Développeur",
    description: "Votre message a été transmis directement dans les messages privés du développeur ! Merci pour votre aide.",
    success_sent: "Votre signalement a été envoyé avec succès au développeur du bot !",
    usage_warning: "Veuillez écrire votre message de signalement.\nExemple : `w!report Erreur de lecture audio`",
    empty_message: "Le message ne peut pas être vide !"
  },
  help: {
    title: "📖 Manuel d'Utilisation • DIAWW MUSIC",
    description: "**DIAWW MUSIC** est un Bot de Musique Discord Haute-Fidélité avec support de **9+ Plateformes**, recherche intelligente et algorithme Autoplay Spotify Radio.\n\n🔹 **Préfixe :** `{prefix}`\n🔹 **Langue :** `{lang_flag} {lang_name}` (`/language`)\n🔹 **Commandes Slash :** Tapez `/` pour voir les commandes.",
    music_commands: "🎵 Commandes Musicales Principales",
    queue_commands: "⚙️ Gestion de la File & Lecteur",
    general_commands: "🛠️ Commandes Générales & Serveur",
    buttons_info: "🔘 Boutons de Contrôle Interactifs (Now Playing Card)"
  },
  events: {
    queue_end_247_title: "File Terminée",
    queue_end_247_desc: "Toutes les pistes ont été jouées. Le bot reste dans le salon vocal car le **Mode 24/7 est Actif**.",
    queue_end_countdown_title: "File Terminée",
    queue_end_countdown_desc: "Plus aucune piste dans la file. Le bot se déconnectera dans **60 secondes** si aucun titre n'est ajouté."
  }
};

export default fr;
