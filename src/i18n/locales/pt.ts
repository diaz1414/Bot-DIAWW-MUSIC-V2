import { TranslationSchema } from "../types";

const pt: TranslationSchema = {
  common: {
    footer: "DIAWW MUSIC • Áudio de Alta Fidelidade • Serenetia Lavalink v4",
    error_title: "Erro",
    success_title: "Sucesso",
    info_title: "Informação",
    warning_title: "Aviso",
    no_voice_channel: "Você precisa estar em um canal de voz para usar este comando!",
    different_voice_channel: "Você precisa estar no mesmo canal de voz que o bot!",
    no_music_playing: "Nenhuma música está tocando neste servidor no momento.",
    permission_denied: "Você não tem permissão para executar este comando!",
    system_error: "Ocorreu um erro ao executar este comando. Tente novamente mais tarde."
  },
  nowplaying: {
    header_normal: "🎵 TOCANDO AGORA",
    header_autoplay: "📻 TOCANDO • RECOMENDAÇÃO AUTOPLAY",
    artist: "Artista",
    source: "Fonte",
    duration: "Duração",
    requester: "Pedido por",
    requester_radio: "Sistema de Rádio",
    volume: "Volume",
    loop_mode: "Modo Repetição",
    autoplay_status: "Autoplay Inteligente",
    mode247_status: "Modo 24/7",
    next_track: "Próxima",
    next_empty: "Nenhuma (Fila vazia)",
    live_stream: "🔴 AO VIVO",
    status_active: "🟢 Ativo",
    status_inactive: "🔴 Inativo",
    loop_off: "❌ Desligado",
    loop_track: "🔂 Música",
    loop_queue: "🔁 Fila"
  },
  buttons: {
    pause: "Pausar",
    resume: "Retomar",
    skip: "Pular",
    stop: "Parar",
    loop: "Repetir",
    autoplay: "Autoplay",
    vol_down: "Vol -10%",
    vol_up: "Vol +10%",
    queue: "Fila",
    mode247: "24/7"
  },
  play: {
    searching: "Buscando músicas...",
    not_found: "Nenhuma música encontrada para: `{query}`.\nTente usar um link direto ou palavras-chave mais específicas.",
    starting_playback: "Iniciando reprodução: **[{title}]({uri})**\n👤 Artista: **{author}** • 🌐 Fonte: **{source}**\n⏱️ Duração: `{duration}`",
    added_to_queue: "Adicionado à fila: **[{title}]({uri})**\n👤 Artista: **{author}** • 🌐 Fonte: **{source}**\n⏱️ Duração: `{duration}`\n📍 Posição na fila: #{position}",
    playlist_added: "📁 **[{title}]({uri})**\n🔢 Quantidade: **{count} músicas**\n⏱️ Duração total: **{duration}**\n🌐 Fonte: **{source}**\n👤 Pedido por: <@{user}>",
    queue_position: "Posição na Fila",
    tracks_count: "Total de Músicas",
    total_duration: "Duração Total",
    requested_by: "Pedido Por",
    usage_warning: "Por favor, informe o título da música ou um link.\nExemplo: `w!play Yung Lean Ginseng Strip` ou `w!p <link>`"
  },
  stop: {
    title: "Reprodução Interrompida",
    description: "A fila foi limpa e o bot desconectou do canal de voz.",
    button_stop: "Reprodução parada por <@{user}>. Fila limpa e bot desconectado."
  },
  skip: {
    title: "Música Pulada",
    description: "Pulou com sucesso: **{title}**"
  },
  pause: {
    title: "Música Pausada",
    description: "Use `/resume` ou o botão ▶️ para continuar a reprodução.",
    already_paused: "O player de música já está pausado."
  },
  resume: {
    title: "Música Retomada",
    description: "A reprodução da música foi retomada!",
    not_paused: "O player de música não está pausado."
  },
  queue: {
    title: "📜 Fila de Músicas • {guild}",
    now_playing: "🎶 **Tocando Agora:**\n[{title}]({uri}) - `{duration}` ({source})\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    empty_now_playing: "Nenhuma música tocando no momento.",
    tracks_in_queue: "📋 Músicas na Fila ({count} músicas | Total: {duration})",
    queue_empty: "*Fila vazia. Digite `/play` ou `w!play` para adicionar músicas.*",
    and_more: "\n*...e mais {count} músicas na fila.*",
    autoplay_next_title: "📻 Próxima Recomendação do Autoplay",
    autoplay_next_desc: "✨ [{title}]({uri})\n👤 Artista: **{author}** • Duração: `{duration}`\n*(Selecionada automaticamente via Spotify/YouTube Mix Radio)*",
    autoplay_analyzing: "🔍 *Analisando gênero e preparando recomendação em segundo plano...*",
    autoplay_off_desc: "*O Autoplay está DESATIVADO. Ative com `/autoplay` ou clique no botão 📻.*"
  },
  autoplay: {
    title: "Autoplay Atualizado",
    enabled_desc: "O Autoplay Inteligente agora está: **🟢 ATIVADO**\nO bot escolherá automaticamente músicas semelhantes sem repetir faixas já tocadas.",
    disabled_desc: "O Autoplay Inteligente agora está: **🔴 DESATIVADO**\nO bot irá parar após a fila atual terminar."
  },
  mode247: {
    title: "Modo 24/7 Atualizado",
    enabled_desc: "O Modo 24/7 para este servidor agora está: **🟢 ATIVADO**\nO bot permanecerá no canal de voz mesmo após a fila terminar.",
    disabled_desc: "O Modo 24/7 para este servidor agora está: **🔴 DESATIVADO**\nO bot desconectará automaticamente se a fila ficar vazia por 60 segundos."
  },
  volume: {
    title: "Volume Atualizado",
    current: "O nível de volume atual é **{volume}%**.\nPara alterar, digite: `w!vol <1-150>`",
    updated: "O volume foi ajustado para: **{volume}%**",
    invalid: "Por favor, informe um número de volume válido entre **1** e **{max}**!"
  },
  loop: {
    title: "Modo de Repetição Atualizado",
    updated: "O modo de repetição agora está em: **{mode}**",
    off: "❌ Desligado (Normal)",
    track: "🔂 Repetir Música Atual",
    queue: "🔁 Repetir Fila Inteira"
  },
  shuffle: {
    title: "Fila Embaralhada",
    shuffled: "**{count}** músicas foram embaralhadas na fila.",
    not_enough: "São necessárias pelo menos 2 músicas na fila para embaralhar."
  },
  sources: {
    title: "🌐 Plataformas de Música Suportadas (9+ Fontes)",
    description: "O DIAWW MUSIC utiliza **Serenetia Lavalink v4** e plugins LavaSrc para áudio de alta fidelidade sem perdas:"
  },
  ping: {
    title: "🏓 Estatísticas e Latência do DIAWW MUSIC",
    ws: "📡 Discord Gateway (WS)",
    db: "💾 Banco de Dados SQLite",
    uptime: "⏱️ Tempo Online",
    runtime: "⚡ Ambiente de Execução",
    ram: "🧠 Uso de Memória RAM",
    players: "🎵 Players Ativos",
    nodes: "🔌 Nós Lavalink v4"
  },
  prefix: {
    title: "Prefixo Atualizado",
    current: "O prefixo atual é: `{prefix}`.\nPara alterar, digite: `{prefix}prefix <novo_prefixo>`",
    updated: "O prefixo para este servidor agora é: `{prefix}`\nExemplo: `{prefix}play Yung Lean`",
    empty: "O prefixo não pode estar vazio!",
    too_long: "O tamanho máximo do prefixo é de 10 caracteres!"
  },
  language: {
    title: "🌐 Configuração de Idioma",
    current: "Idioma atual do servidor: **{flag} {name} ({code})**",
    updated: "O idioma do bot foi alterado com sucesso para: **{flag} {name} ({code})**",
    available: "Idiomas disponíveis:\n{list}\n\nPara alterar o idioma, use `/language <código_ou_nome>` ou `w!lang <código_ou_nome>`.",
    invalid: "Idioma `{input}` inválido!\nIdiomas suportados: {supported}"
  },
  donate: {
    title: "☕ Apoie e Doe para o DIAWW MUSIC",
    description: "Obrigado por usar o **DIAWW MUSIC**!\nVocê pode apoiar nossos custos de servidor e hospedagem via Saweria:\n\n🔗 **Link Saweria:** [{url}]({url})\n\nCada contribuição significa muito para nós! ❤️",
    button_label: "Doar via Saweria"
  },
  support: {
    title: "📩 Enviar Relatório / Suporte ao Dono",
    description: "Seu relatório foi encaminhado diretamente para a mensagem privada do desenvolvedor! Obrigado por ajudar a melhorar o bot.",
    success_sent: "Seu relatório foi enviado com sucesso ao desenvolvedor do bot!",
    usage_warning: "Por favor, digite seu relatório ou sugestão.\nExemplo: `w!report Erro ao tocar música`",
    empty_message: "A mensagem do relatório não pode estar vazia!"
  },
  help: {
    title: "📖 Manual do Usuário • DIAWW MUSIC",
    description: "**DIAWW MUSIC** é um Bot de Música para Discord de Alta Fidelidade com suporte a **9+ Plataformas**, busca inteligente em camadas e algoritmo Autoplay Spotify Radio.\n\n🔹 **Prefixo do Servidor:** `{prefix}`\n🔹 **Idioma:** `{lang_flag} {lang_name}` (`/language`)\n🔹 **Comandos Slash:** Digite `/` para ver o menu interativo.",
    music_commands: "🎵 Comandos Principais de Música",
    queue_commands: "⚙️ Configurações de Fila e Player",
    general_commands: "🛠️ Comandos Gerais e Servidor",
    buttons_info: "🔘 Botões Interativos de Controle (Now Playing Card)"
  },
  playlist: {
    title: "Playlist Personalizada",
    created: "Playlist **{name}** criada com sucesso!",
    deleted: "Playlist **{name}** excluída com sucesso.",
    not_found: "Playlist **{name}** não foi encontrada.",
    already_exists: "Você já possui uma playlist chamada **{name}**!",
    limit_reached: "Você atingiu o limite de **10 playlists**.",
    track_added: "**[{title}]({uri})** adicionado à playlist **{name}**!",
    track_limit_reached: "A playlist **{name}** atingiu o limite de **50 músicas**.",
    track_removed: "**{title}** removido da playlist **{name}**.",
    invalid_index: "Número de música inválido!",
    empty: "A playlist **{name}** está vazia.",
    list_title: "📂 Suas Playlists ({count}/10)",
    list_empty: "Você ainda não tem playlists! Crie uma com `/playlist create <nome>`.",
    view_title: "📂 Playlist: {name} ({count}/50 Músicas)",
    playing: "Carregando e reproduzindo **{count} músicas** da playlist **{name}**!",
    no_tracks_to_play: "Não é possível reproduzir a playlist **{name}** pois ela está vazia.",
    name_invalid: "O nome da playlist deve ter entre 1 e 32 caracteres."
  },
  events: {
    queue_end_247_title: "Fila Concluída",
    queue_end_247_desc: "Todas as músicas terminaram. O bot continuará em espera porque o **Modo 24/7 está Ativo**.",
    queue_end_countdown_title: "Fila Concluída",
    queue_end_countdown_desc: "Não há mais músicas na fila. O bot desconectará em **60 segundos** se nenhuma música for adicionada."
  }
};

export default pt;
