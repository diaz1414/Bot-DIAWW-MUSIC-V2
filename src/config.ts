import dotenv from "dotenv";
import path from "node:path";
import fs from "node:fs";

// Load environment variables from .env
dotenv.config();

// Load config.json
const configPath = path.resolve(process.cwd(), "config.json");
if (!fs.existsSync(configPath)) {
  throw new Error(`[CONFIG ERROR] config.json tidak ditemukan di ${configPath}`);
}

const rawConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));

export interface LavalinkNodeConfig {
  id: string;
  host: string;
  port: number;
  authorization: string;
  secure: boolean;
  retryAmount?: number;
  retryDelay?: number;
  requestTimeout?: number;
}

export interface BotConfig {
  name: string;
  defaultPrefix: string;
  status: Array<{ name: string; type: number }>;
  statusInterval: number;
}

export interface Config {
  bot: BotConfig;
  lavalink: {
    nodes: LavalinkNodeConfig[];
    defaultVolume: number;
    maxVolume: number;
    disconnectTimeout: number;
  };
  embedColors: {
    primary: string;
    success: string;
    warning: string;
    error: string;
    autoplay: string;
    queue: string;
  };
  owner: {
    id: string;
    saweriaUrl: string;
  };
  token: string;
  clientId: string;
}

export const config: Config = {
  bot: {
    name: rawConfig.bot?.name || "DIAWW MUSIC",
    defaultPrefix: process.env.DEFAULT_PREFIX || rawConfig.bot?.defaultPrefix || "w!",
    status: rawConfig.bot?.status || [{ name: "w!help | DIAWW MUSIC", type: 2 }],
    statusInterval: rawConfig.bot?.statusInterval || 30000
  },
  lavalink: {
    nodes: (rawConfig.lavalink?.nodes || []).map((node: LavalinkNodeConfig) => {
      if (node.id === "Private-Lavalink" && process.env.PRIVATE_LAVALINK_HOST) {
        return {
          ...node,
          host: process.env.PRIVATE_LAVALINK_HOST,
          port: process.env.PRIVATE_LAVALINK_PORT ? parseInt(process.env.PRIVATE_LAVALINK_PORT, 10) : node.port,
          authorization: process.env.PRIVATE_LAVALINK_PASSWORD || node.authorization,
          secure: process.env.PRIVATE_LAVALINK_SECURE === "true" ? true : node.secure
        };
      }
      return node;
    }),
    defaultVolume: rawConfig.lavalink?.defaultVolume || 80,
    maxVolume: rawConfig.lavalink?.maxVolume || 150,
    disconnectTimeout: rawConfig.lavalink?.disconnectTimeout || 60000
  },
  embedColors: {
    primary: rawConfig.embedColors?.primary || "#5865F2",
    success: rawConfig.embedColors?.success || "#57F287",
    warning: rawConfig.embedColors?.warning || "#FEE75C",
    error: rawConfig.embedColors?.error || "#ED4245",
    autoplay: rawConfig.embedColors?.autoplay || "#EB459E",
    queue: rawConfig.embedColors?.queue || "#9B59B6"
  },
  owner: {
    id: process.env.OWNER_ID || rawConfig.owner?.id || "1157912761184026764",
    saweriaUrl: process.env.SAWERIA_URL || rawConfig.owner?.saweriaUrl || "https://saweria.co/diaww"
  },
  token: process.env.DISCORD_TOKEN || "",
  clientId: process.env.CLIENT_ID || ""
};

export function validateConfig(): boolean {
  if (!config.token) {
    console.error("==================================================================");
    console.error("❌ [CONFIG ERROR] DISCORD_TOKEN tidak ditemukan di file .env!");
    console.error("Silakan salin .env.example menjadi .env dan isi token bot Discord.");
    console.error("==================================================================");
    return false;
  }
  return true;
}
