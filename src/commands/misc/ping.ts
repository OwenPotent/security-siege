import { Command } from '../../interfaces/Command';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction: CommandInteraction): Promise<void> {
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Pong!')
                    .setDescription(`Pong!`)
                    .setColor('Green')
                    .setFooter({
                        text: interaction.user.tag,
                        iconURL: interaction.user.displayAvatarURL()
                    })
                    .setTimestamp()
                    .addFields(
                        {
                            name: 'Latency',
                            value: `${Date.now() - interaction.createdTimestamp}ms`
                        },
                        {
                            name: 'API Latency',
                            value: `${Math.round(interaction.client.ws.ping)}ms`
                        }
                    )
                ],
            ephemeral: true
        });
    }
} as Command;