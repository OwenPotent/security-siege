import { Client, Collection, IntentsBitField } from "discord.js";
import { Command } from "../interfaces/Command";
import { config } from "dotenv";
import Logger from "./Logger";
import CommandHandler from "./CommandHandler";
import mongoose from "mongoose";
import { mongo_URI } from "../config.json";
import { Button, Autocomplete, ModalSubmit, ContextMenuCommand } from "../interfaces/Interactions";
import InteractionHandler from "./InteractionHandler";

config();

export default class BotClient extends Client {
    public commands: Collection<string, Command> = new Collection();
    public buttons: Collection<string, Button> = new Collection();
    public modals: Collection<string, ModalSubmit> = new Collection();
    public autocomplete: Collection<string, Autocomplete> = new Collection();
    public contextMenu: Collection<string, ContextMenuCommand> = new Collection();
    public commandHandler: CommandHandler = new CommandHandler(this);
    public interactionHandler: InteractionHandler = new InteractionHandler(this);

    public constructor() {
        super({
            intents: [
                IntentsBitField.Flags.Guilds,
                IntentsBitField.Flags.GuildMessages,
                IntentsBitField.Flags.GuildMessageReactions,
                IntentsBitField.Flags.DirectMessages,
                IntentsBitField.Flags.GuildMembers
            ]
        });
    }

    public async start(): Promise<void> {
        try {
            await this.login(process.env.TOKEN as string);
            await this.commandHandler.registerCommands();
            await this.interactionHandler.registerInteractions();
            await mongoose.connect(mongo_URI)
            Logger.log("Connected to MongoDB", "log");
        } catch (error) {
            Logger.error(error);
        }
    }
}