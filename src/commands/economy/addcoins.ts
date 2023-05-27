import { Command } from "../../interfaces/Command";
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, EmbedBuilder } from "discord.js";
import BotClient from "../../structures/Client";
import mongoose from "mongoose";
import { UserModel } from "../../models/economy/UserModel";

export default {
    data: new SlashCommandBuilder()
        .setName("addcoins")
        .setDescription("Add coins to a user's balance")
        .addUserOption(option => option
            .setName("user")
            .setDescription("User to add coins to")
            .setRequired(true))
        .addIntegerOption(option => option
            .setName("amount")
            .setDescription("Amount of coins to add")
            .setRequired(true))
        .setDefaultMemberPermissions(0),
    async execute(interaction: CommandInteraction): Promise<void> {
        const user = interaction.options.getUser("user")!;
        const amount = interaction.options.get("amount")!.value as number;

        const client = interaction.client as BotClient;

        const userDB = await UserModel.findOne({ userID: user.id });

        if (!userDB) {
            await interaction.reply({
                content: "That user does not have an account!",
                ephemeral: true
            });

            return;
        }

        userDB.coins += amount;

        await userDB.save();

        const embed = new EmbedBuilder()
            .setTitle("Coins Added")
            .setColor("Green")
            .setFooter({
                text: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp()
            .setDescription(`${amount.toLocaleString()} coins have been added to ${user.tag}'s balance`);

        await interaction.reply({
            embeds: [embed]
        });
    }
} as Command;