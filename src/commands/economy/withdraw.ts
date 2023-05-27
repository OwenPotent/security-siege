import { Command } from "../../interfaces/Command";
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, EmbedBuilder } from "discord.js";
import BotClient from "../../structures/Client";
import Utility from "../../structures/Utility";
import { UserModel } from "../../models/economy/UserModel";

export default {
    data: new SlashCommandBuilder()
        .setName("withdraw")
        .setDescription("Withdraw coins from your bank account")
        .addIntegerOption(option => option
            .setName("amount")
            .setDescription("Amount of coins to withdraw")
            .setRequired(true)),
    async execute(interaction: CommandInteraction): Promise<void> {
        const amount = interaction.options.get("amount")!.value as number;

        const client = interaction.client as BotClient;

        const userDB = await UserModel.findOne({ userID: interaction.user.id });

        if (!userDB) {
            await interaction.reply({
                content: "You do not have an account!",
                ephemeral: true
            });

            return;
        }

        if (amount < 1) {
            await interaction.reply({
                content: "You cannot withdraw less than 1 coin!",
                ephemeral: true
            });

            return;
        }

        if (amount > userDB.bank) {
            await interaction.reply({
                content: "You do not have enough coins in your bank to withdraw that amount!",
                ephemeral: true
            });

            return;
        }

        userDB.coins += amount;
        userDB.bank -= amount;

        await userDB.save();

        const embed = new EmbedBuilder()
            .setTitle("Coins Withdrawn")
            .setColor("Green")
            .setFooter({
                text: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp()
            .setDescription(`${amount.toLocaleString()} coins have been withdrawn from your bank account`);

        await interaction.reply({
            embeds: [embed]
        });
    }
} as Command;