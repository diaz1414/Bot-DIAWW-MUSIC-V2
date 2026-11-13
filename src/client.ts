import {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
  ChatInputCommandInteraction,
  Message,
  AutocompleteInteraction,
  SlashCommandBuilder
} from "discord.js";
import { LavalinkManager } from "lavalink-client";
import { config } from "./config";
import fs from "node:fs";
import path from "node:path";

export interface Command {
  name: string;
  description: string;
  aliases?: string[];
  category: "music" | "general";
  usage?: string;
  slashData?: SlashCommandBuilder | any;
  executeSlash?: (interaction: ChatInputCommandInteraction, client: DiawwBotClient) => Promise<any>;
  executePrefix?: (message: Message, args: string[], client: DiawwBotClient) => Promise<any>;
  autocomplete?: (interaction: AutocompleteInteraction, client: DiawwBotClient) => Promise<any>;
}

export class DiawwBotClient extends Client {
  public commands: Collection<string, Command> = new Collection();
  public aliases: Collection<string, string> = new Collection();
  public lavalink!: LavalinkManager;
  public config = config;

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
      ],
      partials: [
        Partials.Channel,
        Partials.Message,
        Partials.GuildMember
      ]
    });
  }

  /**
   * Memuat seluruh command dari src/commands/music dan src/commands/general
   */
  public async loadCommands(): Promise<void> {
    const commandsDir = path.resolve(__dirname, "commands");
    if (!fs.existsSync(commandsDir)) return;

    const categories = fs.readdirSync(commandsDir);

    for (const category of categories) {
      const categoryPath = path.join(commandsDir, category);
      if (!fs.statSync(categoryPath).isDirectory()) continue;

      const commandFiles = fs.readdirSync(categoryPath).filter(
        (file) => file.endsWith(".ts") || file.endsWith(".js")
      );

      for (const file of commandFiles) {
        const filePath = path.join(categoryPath, file);
        try {
          const commandModule = require(filePath);
          const command: Command = commandModule.default || commandModule;

          if (command && command.name) {
            this.commands.set(command.name.toLowerCase(), command);

            if (command.aliases && Array.isArray(command.aliases)) {
              for (const alias of command.aliases) {
                this.aliases.set(alias.toLowerCase(), command.name.toLowerCase());
              }
            }
          }
        } catch (err) {
          console.error(`[COMMANDS] Gagal memuat command di ${filePath}:`, err);
        }
      }
    }

    console.log(`[COMMANDS] Berhasil memuat ${this.commands.size} commands dan ${this.aliases.size} aliases.`);
  }

  /**
   * Memuat seluruh file events dari src/events
   */
  public async loadEvents(): Promise<void> {
    const eventsDir = path.resolve(__dirname, "events");
    if (!fs.existsSync(eventsDir)) return;

    const eventFiles = fs.readdirSync(eventsDir).filter(
      (file) => file.endsWith(".ts") || file.endsWith(".js")
    );

    for (const file of eventFiles) {
      const filePath = path.join(eventsDir, file);
      try {
        const eventModule = require(filePath);
        const eventHandler = eventModule.default || eventModule;
        const eventName = path.parse(file).name;

        if (typeof eventHandler === "function") {
          if (eventName === "ready") {
            this.once("ready", (...args) => eventHandler(this, ...args));
          } else {
            this.on(eventName, (...args) => eventHandler(this, ...args));
          }
        }
      } catch (err) {
        console.error(`[EVENTS] Gagal memuat event di ${filePath}:`, err);
      }
    }

    console.log(`[EVENTS] Berhasil memuat event listeners.`);
  }

  /**
   * Menjalankan bot dan login ke Discord Gateway
   */
  public async start(): Promise<void> {
    await this.loadCommands();
    await this.loadEvents();
    await this.login(this.config.token);
  }
}
