import { TranslationSchema } from "../types";

const ja: TranslationSchema = {
  common: {
    footer: "DIAWW MUSIC • ハイレゾ音質 • Serenetia Lavalink v4",
    error_title: "エラー",
    success_title: "成功",
    info_title: "情報",
    warning_title: "警告",
    no_voice_channel: "このコマンドを使用するにはボイスチャンネルに参加してください！",
    different_voice_channel: "ボットと同じボイスチャンネルに参加してください！",
    no_music_playing: "現在このサーバーでは音楽が再生されていません。",
    permission_denied: "このコマンドを実行する権限がありません！",
    system_error: "コマンドの実行中にエラーが発生しました。後でもう一度お試しください。"
  },
  nowplaying: {
    header_normal: "🎵 再生中 • NOW PLAYING",
    header_autoplay: "📻 再生中 • 自動再生おすすめ楽曲",
    artist: "アーティスト",
    source: "ソース",
    duration: "再生時間",
    requester: "リクエスト",
    requester_radio: "ラジオシステム",
    volume: "音量",
    loop_mode: "ループモード",
    autoplay_status: "スマート自動再生",
    mode247_status: "24/7モード",
    next_track: "次の楽曲",
    next_empty: "なし (キューは空です)",
    live_stream: "🔴 ライブ配信",
    status_active: "🟢 有効",
    status_inactive: "🔴 無効",
    loop_off: "❌ オフ",
    loop_track: "🔂 1曲ループ",
    loop_queue: "🔁 全体ループ"
  },
  buttons: {
    pause: "一時停止",
    resume: "再開",
    skip: "スキップ",
    stop: "停止",
    loop: "ループ",
    autoplay: "自動再生",
    vol_down: "音量 -10%",
    vol_up: "音量 +10%",
    queue: "キュー",
    mode247: "24/7"
  },
  play: {
    searching: "楽曲を検索中...",
    not_found: "`{query}` に対する楽曲が見つかりませんでした。\n直接リンクまたはより具体的なキーワードをお試しください。",
    starting_playback: "再生を開始: **[{title}]({uri})**\n👤 アーティスト: **{author}** • 🌐 ソース: **{source}**\n⏱️ 再生時間: `{duration}`",
    added_to_queue: "キューに追加: **[{title}]({uri})**\n👤 アーティスト: **{author}** • 🌐 ソース: **{source}**\n⏱️ 再生時間: `{duration}`\n📍 キュー位置: #{position}",
    playlist_added: "📁 **[{title}]({uri})**\n🔢 曲数: **{count} 曲**\n⏱️ 合計時間: **{duration}**\n🌐 ソース: **{source}**\n👤 リクエスト: <@{user}>",
    queue_position: "キューの位置",
    tracks_count: "曲数",
    total_duration: "合計時間",
    requested_by: "リクエスト者",
    usage_warning: "曲名またはリンクを入力してください。\n例: `w!play Yung Lean Ginseng Strip` または `w!p <link>`"
  },
  stop: {
    title: "再生を停止しました",
    description: "キューがクリアされ、ボットがボイスチャンネルから切断されました。",
    button_stop: "<@{user}> によって再生が停止されました。キューをクリアし切断しました。"
  },
  skip: {
    title: "スキップ完了",
    description: "スキップしました: **{title}**"
  },
  pause: {
    title: "一時停止しました",
    description: "再開するには `/resume` または ▶️ ボタンを押してください。",
    already_paused: "音楽プレーヤーはすでに一時停止中です。"
  },
  resume: {
    title: "再生を再開しました",
    description: "音楽の再生が再開されました！",
    not_paused: "音楽プレーヤーは一時停止されていません。"
  },
  queue: {
    title: "📜 再生キュー • {guild}",
    now_playing: "🎶 **再生中:**\n[{title}]({uri}) - `{duration}` ({source})\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    empty_now_playing: "現在再生中の楽曲はありません。",
    tracks_in_queue: "📋 キュー内の楽曲 ({count} 曲 | 合計: {duration})",
    queue_empty: "*キューは空です。`/play` または `w!play` で楽曲を追加してください。*",
    and_more: "\n*...他 {count} 曲がキューに入っています。*",
    autoplay_next_title: "📻 次の自動再生おすすめ楽曲",
    autoplay_next_desc: "✨ [{title}]({uri})\n👤 アーティスト: **{author}** • 再生時間: `{duration}`\n*(Spotify/YouTube Mix Radioにより自動選曲)*",
    autoplay_analyzing: "🔍 *ジャンルを解析し、バックグラウンドでおすすめ曲を準備中...*",
    autoplay_off_desc: "*自動再生は現在オフです。`/autoplay` または 📻 ボタンで有効化できます。*"
  },
  autoplay: {
    title: "自動再生設定の更新",
    enabled_desc: "スマート自動再生が **🟢 有効** になりました。\n同じ曲を繰り返さずにSpotify RadioやYouTube Mixから類似曲を自動選曲します。",
    disabled_desc: "スマート自動再生が **🔴 無効** になりました。\n現在のキューが終了すると再生を停止します。"
  },
  mode247: {
    title: "24/7モード設定の更新",
    enabled_desc: "このサーバーの24/7モードが **🟢 有効** になりました。\nキューが終了してもボットはボイスチャンネルに常駐します。",
    disabled_desc: "このサーバーの24/7モードが **🔴 無効** になりました。\nキューが空のまま60秒経過すると自動切断されます。"
  },
  volume: {
    title: "音量の更新",
    current: "現在の音量は **{volume}%** です。\n変更するには: `w!vol <1-150>`",
    updated: "音量を **{volume}%** に設定しました",
    invalid: "**1** から **{max}** までの有効な数値を入力してください！"
  },
  loop: {
    title: "ループモードの更新",
    updated: "ループモードを **{mode}** に設定しました",
    off: "❌ オフ (通常再生)",
    track: "🔂 現在の曲をリピート",
    queue: "🔁 キュー全体をリピート"
  },
  shuffle: {
    title: "キューをシャッフルしました",
    shuffled: "キュー内の **{count}** 曲をシャッフルしました。",
    not_enough: "シャッフルするにはキューに最低2曲必要です。"
  },
  sources: {
    title: "🌐 対応音楽プラットフォーム (9+ ソース)",
    description: "DIAWW MUSIC は **Serenetia Lavalink v4** と LavaSrc プラグインによるロスレス高音質オーディオに対応しています:"
  },
  ping: {
    title: "🏓 DIAWW MUSIC ステータスとレイテンシ",
    ws: "📡 Discord Gateway (WS)",
    db: "💾 SQLite データベース",
    uptime: "⏱️ 稼働時間",
    runtime: "⚡ 実行環境",
    ram: "🧠 メモリ使用量",
    players: "🎵 アクティブプレーヤー",
    nodes: "🔌 Lavalink v4 ノード"
  },
  prefix: {
    title: "プレフィックスの更新",
    current: "現在のプレフィックス: `{prefix}`\n変更するには: `{prefix}prefix <新しいプレフィックス>`",
    updated: "このサーバーのプレフィックスを `{prefix}` に変更しました。\n例: `{prefix}play Yung Lean`",
    empty: "プレフィックスを空にすることはできません！",
    too_long: "プレフィックスは10文字以内で指定してください！"
  },
  language: {
    title: "🌐 言語設定",
    current: "現在のサーバー言語: **{flag} {name} ({code})**",
    updated: "ボットの言語を **{flag} {name} ({code})** に変更しました！",
    available: "利用可能な言語:\n{list}\n\n言語を変更するには `/language <コードまたは名前>` または `w!lang <コードまたは名前>` を実行してください。",
    invalid: "無効な言語 `{input}` です！\n対応言語: {supported}"
  },
  help: {
    title: "📖 操作マニュアル • DIAWW MUSIC",
    description: "**DIAWW MUSIC** は、**9+の音楽プラットフォーム**に対応したハイレゾDiscord音楽ボットです。\n\n🔹 **サーバープレフィックス:** `{prefix}`\n🔹 **言語:** `{lang_flag} {lang_name}` (`/language`)\n🔹 **スラッシュコマンド:** `/` を入力してコマンドを選択できます。",
    music_commands: "🎵 音楽コマンド",
    queue_commands: "⚙️ キュー・プレーヤー設定",
    general_commands: "🛠️ 一般・サーバー設定",
    buttons_info: "🔘 インタラクティブ操作ボタン (Now Playing カード)"
  },
  events: {
    queue_end_247_title: "キューが終了しました",
    queue_end_247_desc: "すべての曲の再生が終了しました。**24/7モードが有効**なためボットは待機を続けます。",
    queue_end_countdown_title: "キューが終了しました",
    queue_end_countdown_desc: "キューに曲がありません。新しい曲が追加されない場合、**60秒後**に自動切断されます。"
  }
};

export default ja;
