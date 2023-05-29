import { Command } from "../../interfaces/Command";
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, EmbedBuilder, ActionRowBuilder, ModalBuilder, ModalActionRowComponentBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import BotClient from "../../structures/Client";
import mongoose from "mongoose";
import { ShopModel } from "../../models/economy/ShopModel";
import Utility from "../../structures/Utility";
import { emojis } from "../../config.json"

export default {
    data: new SlashCommandBuilder()
        .setName("create-shop")
        .setDescription("Create a shop"),
    async execute(interaction: CommandInteraction): Promise<void> {
        const client = interaction.client as BotClient;

        const shopModal = new ModalBuilder()
            .setCustomId("create-shop")
            .setTitle("Create your shop!")

        const shopName = new TextInputBuilder()
            .setCustomId("shop-name")
            .setStyle(TextInputStyle.Short)
            .setLabel("What would you like to name your shop?")

        const shopDescription = new TextInputBuilder()
            .setCustomId("shop-description")
            .setStyle(TextInputStyle.Paragraph)
            .setLabel("Tell us about your shop!")
            
        const name = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(shopName);
        const description = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(shopDescription);

        shopModal.addComponents(name, description)

        await interaction.showModal(shopModal);
    }
} as Command;