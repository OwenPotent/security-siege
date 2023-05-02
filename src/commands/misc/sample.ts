import { Command } from '../../interfaces/Command';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, ButtonBuilder, ButtonStyle } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('sample')
        .setDescription('Replies with sample!'),
    async execute(interaction: CommandInteraction): Promise<void> {
        await interaction.reply({
            content: "Sample!",
            components: [
                {
                    type: 1,
                    components: [
                        new ButtonBuilder()
                            .setCustomId("sample")
                            .setLabel("Sample")
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji("👍")
                            .toJSON()
                    ]
                },
            ],
            ephemeral: true
        });


    }
} as Command;