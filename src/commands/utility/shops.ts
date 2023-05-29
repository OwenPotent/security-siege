import { Command } from "../../interfaces/Command";
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, EmbedBuilder } from "discord.js";
import BotClient from "../../structures/Client";
import mongoose from "mongoose";
import { ShopModel } from "../../models/economy/ShopModel";
import Utility from "../../structures/Utility";
import { emojis } from "../../config.json"

export default {
    data: new SlashCommandBuilder()
        .setName("shops")
        .setDescription("View the shops"),
    async execute(interaction: CommandInteraction): Promise<void> {
        const client = interaction.client as BotClient;

        const shops = await ShopModel.find();

        const embed = new EmbedBuilder()
            .setTitle("Shops")
            .setColor("Aqua")
            .setFooter({
                text: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp();

        if (shops.length === 0) {
            embed.setDescription("There are no shops yet in this server!");

            await interaction.reply({
                embeds: [embed]
            });

            return;
        }

        for (const shop of shops) {
            const items = shop.items.map(item => `${item.name} - ${item.price.toLocaleString()} coins`);

            embed.addFields([
                {
                    name: shop.name,
                    value: items.join("\n")
                }
            ])
        }

        await interaction.reply({
            embeds: [embed]
        });
    }
} as Command;