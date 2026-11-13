import { TranslationSchema } from "../types";

const es: TranslationSchema = {
  common: {
    footer: "DIAWW MUSIC • Audio de Alta Fidelidad • Serenetia Lavalink v4",
    error_title: "Error",
    success_title: "Éxito",
    info_title: "Información",
    warning_title: "Advertencia",
    no_voice_channel: "¡Debes estar en un canal de voz para usar este comando!",
    different_voice_channel: "¡Debes estar en el mismo canal de voz que el bot!",
    no_music_playing: "No hay música reproduciéndose actualmente en este servidor.",
    permission_denied: "¡No tienes permiso para ejecutar este comando!",
    system_error: "Ocurrió un error al ejecutar este comando. Por favor, inténtalo de nuevo más tarde."
  },
  nowplaying: {
    header_normal: "🎵 REPRODUCIENDO AHORA",
    header_autoplay: "📻 REPRODUCIENDO • RECOMENDACIÓN AUTOPLAY",
    artist: "Artista",
    source: "Fuente",
    duration: "Duración",
    requester: "Solicitado por",
    requester_radio: "Sistema de Radio",
    volume: "Volumen",
    loop_mode: "Modo de Bucle",
    autoplay_status: "Autoplay Inteligente",
    mode247_status: "Modo 24/7",
    next_track: "Siguiente",
    next_empty: "Ninguno (Cola vacía)",
    live_stream: "🔴 EN VIVO",
    status_active: "🟢 Activo",
    status_inactive: "🔴 Inactivo",
    loop_off: "❌ Desactivado",
    loop_track: "🔂 Canción",
    loop_queue: "🔁 Cola"
  },
  buttons: {
    pause: "Pausar",
    resume: "Reanudar",
    skip: "Saltar",
    stop: "Detener",
    loop: "Bucle",
    autoplay: "Autoplay",
    vol_down: "Vol -10%",
    vol_up: "Vol +10%",
    queue: "Cola",
    mode247: "24/7"
  },
  play: {
    searching: "Buscando pistas...",
    not_found: "No se encontraron pistas para: `{query}`.\nPrueba con un enlace directo o términos más específicos.",
    starting_playback: "Reproduciendo: **[{title}]({uri})**\n👤 Artista: **{author}** • 🌐 Fuente: **{source}**\n⏱️ Duración: `{duration}`",
    added_to_queue: "Añadido a la cola: **[{title}]({uri})**\n👤 Artista: **{author}** • 🌐 Fuente: **{source}**\n⏱️ Duración: `{duration}`\n📍 Posición en cola: #{position}",
    playlist_added: "📁 **[{title}]({uri})**\n🔢 Cantidad: **{count} canciones**\n⏱️ Duración total: **{duration}**\n🌐 Fuente: **{source}**\n👤 Solicitado por: <@{user}>",
    queue_position: "Posición en Cola",
    tracks_count: "Cantidad de Canciones",
    total_duration: "Duración Total",
    requested_by: "Solicitado Por",
    usage_warning: "Por favor proporciona el título de una canción o un enlace.\nEjemplo: `w!play Yung Lean Ginseng Strip` o `w!p <link>`"
  },
  stop: {
    title: "Reproducción Detenida",
    description: "Se ha vaciado la cola y el bot se ha desconectado del canal de voz.",
    button_stop: "Reproducción detenida por <@{user}>. Cola vaciada y bot desconectado."
  },
  skip: {
    title: "Canción Saltada",
    description: "Se saltó con éxito: **{title}**"
  },
  pause: {
    title: "Reproducción Pausada",
    description: "Usa `/resume` o el botón ▶️ para continuar la reproducción.",
    already_paused: "El reproductor de música ya está pausado."
  },
  resume: {
    title: "Reproducción Reanudada",
    description: "¡La música se ha reanudado!",
    not_paused: "El reproductor de música no está pausado."
  },
  queue: {
    title: "📜 Cola de Música • {guild}",
    now_playing: "🎶 **Sonando Ahora:**\n[{title}]({uri}) - `{duration}` ({source})\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    empty_now_playing: "No hay música sonando en este momento.",
    tracks_in_queue: "📋 Canciones en Cola ({count} canciones | Total: {duration})",
    queue_empty: "*La cola está vacía. Escribe `/play` o `w!play` para añadir canciones.*",
    and_more: "\n*...y {count} canciones más en la cola.*",
    autoplay_next_title: "📻 Siguiente Recomendación de Autoplay",
    autoplay_next_desc: "✨ [{title}]({uri})\n👤 Artista: **{author}** • Duración: `{duration}`\n*(Seleccionada automáticamente vía Spotify/YouTube Mix Radio)*",
    autoplay_analyzing: "🔍 *Analizando género y preparando recomendación en segundo plano...*",
    autoplay_off_desc: "*Autoplay está actualmente DESACTIVADO. Actívalo con `/autoplay` o con el botón 📻.*"
  },
  autoplay: {
    title: "Autoplay Actualizado",
    enabled_desc: "Autoplay Inteligente ahora está: **🟢 ACTIVADO**\nEl bot seleccionará automáticamente canciones similares sin repetir las ya reproducidas.",
    disabled_desc: "Autoplay Inteligente ahora está: **🔴 DESACTIVADO**\nEl bot se detendrá tras terminar la cola actual."
  },
  mode247: {
    title: "Modo 24/7 Actualizado",
    enabled_desc: "El Modo 24/7 para este servidor ahora está: **🟢 ACTIVADO**\nEl bot permanecerá en espera en el canal de voz incluso si la cola finaliza.",
    disabled_desc: "El Modo 24/7 para este servidor ahora está: **🔴 DESACTIVADO**\nEl bot se desconectará automáticamente si la cola permanece vacía por 60 segundos."
  },
  volume: {
    title: "Volumen Actualizado",
    current: "El nivel de volumen actual es **{volume}%**.\nPara cambiarlo escribe: `w!vol <1-150>`",
    updated: "El volumen ha sido configurado en: **{volume}%**",
    invalid: "¡Por favor introduce un número de volumen válido entre **1** y **{max}**!"
  },
  loop: {
    title: "Modo Bucle Actualizado",
    updated: "El modo bucle ahora está configurado en: **{mode}**",
    off: "❌ Desactivado (Normal)",
    track: "🔂 Repetir Canción Actual",
    queue: "🔁 Repetir Toda la Cola"
  },
  shuffle: {
    title: "Cola Mezclada",
    shuffled: "Se han mezclado **{count}** canciones en la cola.",
    not_enough: "Se requieren al menos 2 canciones en la cola para mezclar."
  },
  sources: {
    title: "🌐 Plataformas de Música Compatibles (9+ Fuentes)",
    description: "DIAWW MUSIC funciona con **Serenetia Lavalink v4** y plugins LavaSrc para audio de alta fidelidad sin pérdidas:"
  },
  ping: {
    title: "🏓 Estadísticas y Latencia de DIAWW MUSIC",
    ws: "📡 Discord Gateway (WS)",
    db: "💾 Base de Datos SQLite",
    uptime: "⏱️ Tiempo Activo",
    runtime: "⚡ Entorno de Ejecución",
    ram: "🧠 Uso de RAM",
    players: "🎵 Reproductores Activos",
    nodes: "🔌 Nodos Lavalink v4"
  },
  prefix: {
    title: "Prefijo Actualizado",
    current: "El prefijo actual es: `{prefix}`.\nPara cambiarlo escribe: `{prefix}prefix <nuevo_prefijo>`",
    updated: "El prefijo para este servidor ahora es: `{prefix}`\nEjemplo: `{prefix}play Yung Lean`",
    empty: "¡El prefijo no puede estar vacío!",
    too_long: "¡La longitud máxima del prefijo es de 10 caracteres!"
  },
  language: {
    title: "🌐 Configuración de Idioma",
    current: "Idioma actual del servidor: **{flag} {name} ({code})**",
    updated: "El idioma del bot para este servidor se ha cambiado a: **{flag} {name} ({code})**",
    available: "Idiomas disponibles:\n{list}\n\nPara cambiar el idioma usa `/language <código_o_nombre>` o `w!lang <código_o_nombre>`.",
    invalid: "¡Idioma `{input}` no válido!\nIdiomas compatibles: {supported}"
  },
  donate: {
    title: "☕ Apoya y Dona a DIAWW MUSIC",
    description: "¡Gracias por usar **DIAWW MUSIC**!\nPuedes apoyar los costes de hosting y servidor a través de Saweria:\n\n🔗 **Enlace de Saweria:** [{url}]({url})\n\n¡Cada contribución significa mucho para nosotros! ❤️",
    button_label: "Donar vía Saweria"
  },
  support: {
    title: "📩 Enviar Reporte / Soporte al Dueño",
    description: "Tu reporte ha sido enviado directamente al mensaje privado del desarrollador. ¡Gracias por ayudarnos a mejorar!",
    success_sent: "¡Tu reporte ha sido enviado con éxito al desarrollador del bot!",
    usage_warning: "Por favor escribe tu reporte o sugerencia.\nEjemplo: `w!report Error al reproducir canción`",
    empty_message: "¡El mensaje del reporte no puede estar vacío!"
  },
  help: {
    title: "📖 Manual de Usuario • DIAWW MUSIC",
    description: "**DIAWW MUSIC** es un Bot de Música para Discord de Alta Fidelidad compatible con **9+ Plataformas**, búsqueda inteligente por niveles y algoritmo Autoplay Spotify Radio.\n\n🔹 **Prefijo del Servidor:** `{prefix}`\n🔹 **Idioma:** `{lang_flag} {lang_name}` (`/language`)\n🔹 **Comandos Slash:** Escribe `/` para ver el menú interactivo de Discord.",
    music_commands: "🎵 Comandos Principales de Música",
    queue_commands: "⚙️ Configuración de Cola y Reproductor",
    general_commands: "🛠️ Comandos Generales y Servidor",
    buttons_info: "🔘 Botones de Control Interactivo (Tarjeta Now Playing)"
  },
  events: {
    queue_end_247_title: "Cola Finalizada",
    queue_end_247_desc: "Todas las canciones han terminado. El bot permanece en espera porque el **Modo 24/7 está Activo**.",
    queue_end_countdown_title: "Cola Finalizada",
    queue_end_countdown_desc: "No hay más canciones en la cola. El bot se desconectará en **60 segundos** si no se añade nueva música."
  }
};

export default es;
