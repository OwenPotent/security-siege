import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { config } from 'dotenv';
import { readdirSync } from 'fs';
import { join } from 'path';
import { Command } from '../interfaces/Command';
import Logger from './Logger';
import BotClient from './Client';
import { guildID, clientID } from '../config.json';

config();

export default class CommandHandler {
    public constructor(private client: BotClient) {}

    public async registerCommands(): Promise<void> {
        const commands = [];
        const commandFolders: string[] = readdirSync(join(__dirname, "..", "commands"));

        for (const folder of commandFolders) {
            const commandFiles: string[] = readdirSync(join(__dirname, "..", "commands", folder)).filter((file: string) => file.endsWith(".ts"));

            for (const file of commandFiles) {
                const command: Command = (await import(join(__dirname, "..", "commands", folder, file))).default;
                commands.push(command.data.toJSON());
                this.client.commands.set(command.data.name, command);
            }
        }

        Logger.log(`Loaded ${commands.length} commands.`, "log")

        const rest: REST = new REST().setToken(process.env.TOKEN as string);
        try {
            Logger.log("Started refreshing application (/) commands.", "log");

            // Global commands
            // await rest.put(
            //     Routes.applicationCommands(clientID),
            //     { body: commands }
            // );

            // Guild commands
            await rest.put(
                Routes.applicationGuildCommands(`${clientID}`, `${guildID}`),
                { body: commands }
            );



            Logger.log("Successfully reloaded application (/) commands.", "log");
        } catch (error) {
            console.error(error);
            Logger.error(error);
        }
    }
}