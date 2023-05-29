import { Command } from "../../interfaces/Command";
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, EmbedBuilder } from "discord.js";
import BotClient from "../../structures/Client";
import mongoose from "mongoose";
import Utility from "../../structures/Utility";
import { UserModel } from "../../models/economy/UserModel";
import { emojis } from "../../config.json"

export default {
    data: new SlashCommandBuilder()
        .setName("beg")
        .setDescription("Beg for coins"),
    async execute(interaction: CommandInteraction): Promise<void> {
        const client = interaction.client as BotClient;

        const userDB = await UserModel.findOne({ userID: interaction.user.id });

        if (!userDB) {
            await interaction.reply({
                content: "You do not have an account!",
                ephemeral: true
            });

            return;
        }

        const lastBeg = userDB.lastBeg;

        if (lastBeg !== 0 && Date.now() - lastBeg < 300000) {
            const time = 300000 - (Date.now() - lastBeg);

            await interaction.reply({
                content: `You have already begged for coins! You can beg again in ${Utility.msToTime(time)}`,
                ephemeral: true
            });

            return;
        }

        const coins = Math.floor(Math.random() * 100) + 1;

        userDB.coins += coins;
        userDB.lastBeg = Date.now();

        await userDB.save();

        const embed = new EmbedBuilder()
            .setTitle("Beg")
            .setColor("Green")
            .setFooter({
                text: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp()
            .setDescription(`You begged and got ${coins.toLocaleString()} coins`);

        await interaction.reply({
            embeds: [embed]
        });
    }
} as Command;