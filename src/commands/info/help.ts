import { Command } from '../../interfaces/Command';
import { SlashCommandBuilder } from '@discordjs/builders';
import { APIEmbedField, CommandInteraction, EmbedBuilder, } from 'discord.js';
import BotClient from '../../structures/Client';
import fs from 'fs';
import path from 'path';
import { botDeveloperID } from "../../config.json";

// Get slash commands
export default {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Replies with help!')
        .addStringOption(option => option
            .setName("command")
            .setDescription("Command to get help for")
            .setRequired(false)
            .setAutocomplete(true)),
    async execute(interaction: CommandInteraction): Promise<void> {
        const commandName = interaction.options.get("command")?.value as string | undefined;

        if (commandName) {
            const command = (interaction.client as BotClient).commands.get(commandName);

            if (!command) {
                await interaction.reply({
                    content: "That command does not exist!",
                    ephemeral: true
                });

                return;
            }

            const data = command.data.toJSON();

            const embed = new EmbedBuilder()
                .setTitle(`Help for ${data.name}`)
                .setColor("Blurple")
                .setFooter({
                    text: interaction.user.tag,
                    iconURL: interaction.user.displayAvatarURL()
                })
                .setTimestamp()
                .setDescription(data.description)
                .addFields(
                    {
                        name: "Usage",
                        value: `\`${data.name}${data.options ? " " + data.options.map(option => option.required ? `<${option.name}>` : `[${option.name}]`).join(" ") : ""}\``
                    },
                );

            if (data.options) {
                const fields: APIEmbedField[] = [];

                for (const option of data.options) {
                    fields.push({
                        name: option.name,
                        value: option.description
                    });
                }

                embed.addFields(fields);
            }

            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            });

            return;
        }

        const embed = new EmbedBuilder()
            .setTitle("Help")
            .setDescription("Here are all the commands!")
            .setColor("Blurple")
            .setFooter({
                text: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp();

        const categories = fs.readdirSync(path.join(__dirname, "..", "..", "commands"));

        for (const category of categories) {
            const commands = fs.readdirSync(path.join(__dirname, "..", "..", "commands", category));

            const fields: APIEmbedField[] = [];

            for (const command of commands) {
                const commandFile: Command = (await import(path.join(__dirname, "..", "..", "commands", category, command))).default;

                const data = commandFile.data.toJSON();

                // Skip if command is dev only
                if (category === "dev" && !botDeveloperID.includes(interaction.user.id)) continue;

                fields.push({
                    name: data.name,
                    value: data.description
                });
            }

            // Category first letter to uppercase
            embed.addFields(
                {
                    name: category.charAt(0).toUpperCase() + category.slice(1),
                    value: fields.map(field => `\`${field.name}\``).join(", ")
                }
            );
        }

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
} as Command;