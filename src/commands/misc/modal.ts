import { Command } from '../../interfaces/Command';
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, ActionRowBuilder, ModalActionRowComponentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('modal')
        .setDescription('Replies with modal!'),
    async execute(interaction: CommandInteraction): Promise<void> {
        const modal = new ModalBuilder()
            .setCustomId("sample")
            .setTitle("Sample")

        const favouriteColorInput = new TextInputBuilder()
            .setCustomId("favouriteColor")
            .setLabel("Favourite Color")
            .setPlaceholder("Enter your favourite color")
            .setStyle(TextInputStyle.Short)

        const hobbiesInput = new TextInputBuilder()
            .setCustomId("hobbies")
            .setLabel("Hobbies")
            .setPlaceholder("Enter your hobbies")
            .setStyle(TextInputStyle.Paragraph)

        const firstActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(favouriteColorInput)
        const secondActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(hobbiesInput)

        modal.addComponents(firstActionRow, secondActionRow)

        await interaction.showModal(modal)
    }
} as Command;
