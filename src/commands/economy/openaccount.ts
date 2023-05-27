import { Command } from "../../interfaces/Command";
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, EmbedBuilder } from "discord.js";
import BotClient from "../../structures/Client";
import mongoose from "mongoose";
import { UserModel } from "../../models/economy/UserModel";

export default {
    data: new SlashCommandBuilder()
        .setName("openaccount")
        .setDescription("Open an account"),
    async execute(interaction: CommandInteraction): Promise<void> {
        const client = interaction.client as BotClient;

        const userDB = await UserModel.findOne({ userID: interaction.user.id });

        if (userDB) {
            await interaction.reply({
                content: "You already have an account!",
                ephemeral: true
            });

            return;
        }

        const newUser = new UserModel({
            userID: interaction.user.id,
            coins: 0,
            bank: 0,
            lastDaily: 0,
            lastBeg: 0,
            lastWork: 0,
            lastCrime: 0,
            lastRob: 0,
        });

        await newUser.save();

        await interaction.reply({
            content: "You have successfully opened an account!",
            ephemeral: true
        });
    }
} as Command;