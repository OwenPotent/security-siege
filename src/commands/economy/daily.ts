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
        .setName("daily")
        .setDescription("Claim your daily coins"),
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

        const lastDaily = userDB.lastDaily;

        if (lastDaily !== 0 && Date.now() - lastDaily < 86400000) {
            const time = 86400000 - (Date.now() - lastDaily);

            await interaction.reply({
                content: `You have already claimed your daily coins! You can claim them again in ${Utility.msToTime(time)}`,
                ephemeral: true
            });

            return;
        }

        userDB.coins += 500;
        userDB.lastDaily = Date.now();

        await userDB.save();

        const embed = new EmbedBuilder()
            .setTitle("Daily Coins")
            .setColor("Green")
            .setFooter({
                text: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp()
            .setDescription(`You claimed your daily coins and got 500 coins ${emojis.coin}`);

        await interaction.reply({
            embeds: [embed]
        });
    }
} as Command;