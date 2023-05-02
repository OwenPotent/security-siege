import { Command } from '../../interfaces/Command';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, EmbedBuilder } from 'discord.js';
import { botDeveloperID } from "../../config.json";

export default {
    data: new SlashCommandBuilder()
        .setName("eval")
        .setDescription("Eval code")
        .addStringOption(option => option.setName("code").setDescription("Code to eval").setRequired(true))
        .addBooleanOption(option => option.setName("async").setDescription("Whether to eval the code asyncronously").setRequired(false))
        .setDMPermission(false)
        .setDefaultMemberPermissions(0),
    async execute(interaction: CommandInteraction): Promise<void> {
        const code = interaction.options.get("code", true).value as string;
        const async = interaction.options.get("async", false)?.value as boolean ?? false;

        if (!botDeveloperID.includes(interaction.user.id)) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription("**You are not a bot developer!**")
                        .setColor("Red")
                        .setFooter({
                            text: interaction.user.tag,
                            iconURL: interaction.user.displayAvatarURL()
                        })
                        .setTimestamp()
                ],
                ephemeral: true
            });
            return;
        }

        try {
            const result = eval(async ? `(async () => { ${code} })()` : code);
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Eval")
                        .setDescription(`\`\`\`js\n${result}\`\`\``)
                        .setColor("Green")
                        .setFooter({
                            text: interaction.user.tag,
                            iconURL: interaction.user.displayAvatarURL()
                        })
                        .setTimestamp()
                ],
                ephemeral: true
            });
        } catch (error) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Error")
                        .setDescription(`\`\`\`js\n${error}\`\`\``)
                        .setColor("Red")
                        .setFooter({
                            text: interaction.user.tag,
                            iconURL: interaction.user.displayAvatarURL()
                        })
                        .setTimestamp()
                ],
                ephemeral: true
            });
        }
    }
} as unknown as Command