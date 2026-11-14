export type SupportedLanguage = "en" | "id" | "es" | "ja" | "pt" | "ru" | "fr" | "de";

export interface TranslationSchema {
  common: {
    footer: string;
    error_title: string;
    success_title: string;
    info_title: string;
    warning_title: string;
    no_voice_channel: string;
    different_voice_channel: string;
    no_music_playing: string;
    permission_denied: string;
    system_error: string;
  };
  nowplaying: {
    header_normal: string;
    header_autoplay: string;
    artist: string;
    source: string;
    duration: string;
    requester: string;
    requester_radio: string;
    volume: string;
    loop_mode: string;
    autoplay_status: string;
    mode247_status: string;
    next_track: string;
    next_empty: string;
    live_stream: string;
    status_active: string;
    status_inactive: string;
    loop_off: string;
    loop_track: string;
    loop_queue: string;
  };
  buttons: {
    pause: string;
    resume: string;
    skip: string;
    stop: string;
    loop: string;
    autoplay: string;
    vol_down: string;
    vol_up: string;
    queue: string;
    mode247: string;
  };
  play: {
    searching: string;
    not_found: string;
    starting_playback: string;
    added_to_queue: string;
    playlist_added: string;
    queue_position: string;
    tracks_count: string;
    total_duration: string;
    requested_by: string;
    usage_warning: string;
  };
  stop: {
    title: string;
    description: string;
    button_stop: string;
  };
  skip: {
    title: string;
    description: string;
  };
  pause: {
    title: string;
    description: string;
    already_paused: string;
  };
  resume: {
    title: string;
    description: string;
    not_paused: string;
  };
  queue: {
    title: string;
    now_playing: string;
    empty_now_playing: string;
    tracks_in_queue: string;
    queue_empty: string;
    and_more: string;
    autoplay_next_title: string;
    autoplay_next_desc: string;
    autoplay_analyzing: string;
    autoplay_off_desc: string;
  };
  autoplay: {
    title: string;
    enabled_desc: string;
    disabled_desc: string;
  };
  mode247: {
    title: string;
    enabled_desc: string;
    disabled_desc: string;
  };
  volume: {
    title: string;
    current: string;
    updated: string;
    invalid: string;
  };
  loop: {
    title: string;
    updated: string;
    off: string;
    track: string;
    queue: string;
  };
  shuffle: {
    title: string;
    shuffled: string;
    not_enough: string;
  };
  sources: {
    title: string;
    description: string;
  };
  ping: {
    title: string;
    ws: string;
    db: string;
    uptime: string;
    runtime: string;
    ram: string;
    players: string;
    nodes: string;
  };
  prefix: {
    title: string;
    current: string;
    updated: string;
    empty: string;
    too_long: string;
  };
  language: {
    title: string;
    current: string;
    updated: string;
    available: string;
    invalid: string;
  };
  donate: {
    title: string;
    description: string;
    button_label: string;
  };
  support: {
    title: string;
    description: string;
    success_sent: string;
    usage_warning: string;
    empty_message: string;
  };
  help: {
    title: string;
    description: string;
    music_commands: string;
    queue_commands: string;
    general_commands: string;
    buttons_info: string;
  };
  playlist: {
    title: string;
    created: string;
    deleted: string;
    not_found: string;
    already_exists: string;
    limit_reached: string;
    track_added: string;
    track_limit_reached: string;
    track_removed: string;
    invalid_index: string;
    empty: string;
    list_title: string;
    list_empty: string;
    view_title: string;
    playing: string;
    no_tracks_to_play: string;
    name_invalid: string;
  };
  events: {
    queue_end_247_title: string;
    queue_end_247_desc: string;
    queue_end_countdown_title: string;
    queue_end_countdown_desc: string;
  };
}
