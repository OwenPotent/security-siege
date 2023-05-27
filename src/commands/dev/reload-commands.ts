import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { readdirSync } from 'fs';
import { join } from 'path';
import { Command } from '../../interfaces/Command';
import Logger from '../../structures/Logger';
import BotClient from '../../structures/Client';
import { guildID, clientID, botDeveloperID } from '../../config.json';
import { CommandInteraction, EmbedBuilder } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

export default {
    data: new SlashCommandBuilder()
        .setName("reload-commands")
        .setDescription("Reload all commands")
        .setDMPermission(false)
        .setDefaultMemberPermissions(0),
    async execute(interaction: CommandInteraction, client?: BotClient): Promise<void> {

        if (!botDeveloperID.includes(interaction.user.id)) {
            await interaction.reply({
                content: "You are not a bot developer!"
            });

            return;
        }

        const rest: REST = new REST().setToken(process.env.TOKEN as string);
        try {
            Logger.log("Started refreshing application (/) commands.", "log");

            const commands = [];
            const commandFolders: string[] = readdirSync(join(__dirname, "..", "..", "commands"));

            for (const folder of commandFolders) {
                const commandFiles: string[] = readdirSync(join(__dirname, "..", "..", "commands", folder)).filter((file: string) => file.endsWith(".ts"));

                for (const file of commandFiles) {
                    const command: Command = (await import(join(__dirname, "..", "..", "commands", folder, file))).default;
                    commands.push(command.data.toJSON());
                    client.commands.set(command.data.name, command);
                }
            }

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

        await interaction.reply({
            content: "Reloaded commands!",
            ephemeral: true
        });
    }
} as Command;