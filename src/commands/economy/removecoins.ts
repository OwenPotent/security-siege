import { Command } from "../../interfaces/Command";
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, EmbedBuilder } from "discord.js";
import BotClient from "../../structures/Client";
import mongoose from "mongoose";
import { UserModel } from "../../models/economy/UserModel";

export default {
    data: new SlashCommandBuilder()
        .setName("removecoins")
        .setDescription("Remove coins from a user")
        .addUserOption(option => option.setName("user").setDescription("The user to remove coins from").setRequired(true))
        .addIntegerOption(option => option.setName("amount").setDescription("The amount of coins to remove").setRequired(true))
        .setDefaultMemberPermissions(0),
    async execute(interaction: CommandInteraction): Promise<void> {
        const user = interaction.options.getUser("user")!;
        const amount = interaction.options.get("amount")!.value as number;

        const userDB = await UserModel.findOne({ userID: user.id });

        if (!userDB) {
            await interaction.reply({
                content: "That user does not have an account!",
                ephemeral: true
            });

            return;
        }

        userDB.coins -= amount;

        await userDB.save();

        const embed = new EmbedBuilder()
            .setTitle("Coins Removed")
            .setColor("Red")
            .setFooter({
                text: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp()
            .setDescription(`${amount.toLocaleString()} coins have been removed from ${user.tag}'s balance`);

        await interaction.reply({
            embeds: [embed]
        });
    }
} as Command;