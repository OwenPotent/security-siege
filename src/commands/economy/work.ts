import { Command } from "../../interfaces/Command";
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, EmbedBuilder } from "discord.js";
import BotClient from "../../structures/Client";
import mongoose from "mongoose";
import { UserModel } from "../../models/economy/UserModel";
import Utility from "../../structures/Utility";

export default {
    data: new SlashCommandBuilder()
        .setName("work")
        .setDescription("Work for coins"),
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

        const cooldown = 1.8e+6;
        const lastWork = userDB.lastWork;

        if (lastWork !== null && cooldown - (Date.now() - lastWork) > 0) {
            await interaction.reply({
                content: `You have already worked recently! Please wait ${Utility.msToTime(cooldown - (Date.now() - lastWork))} before working again.`,
                ephemeral: true
            });

            return;
        }

        const amount = Utility.getRandomInt(100, 500);

        userDB.coins += amount;
        userDB.lastWork = Date.now();

        await userDB.save();

        const embed = new EmbedBuilder()
            .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setDescription(`You worked for ${Utility.formatNumber(amount)} coins!`)
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });
    }
} as Command;