import { Command } from "../../interfaces/Command";
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, EmbedBuilder } from "discord.js";
import BotClient from "../../structures/Client";
import mongoose from "mongoose";
import { UserModel } from "../../models/economy/UserModel";
import Utility from "../../structures/Utility";
import { emojis } from "../../config.json"

export default {
    data: new SlashCommandBuilder()
        .setName("balance")
        .setDescription("Get your balance or someone else's balance")
        .addUserOption(option => option
            .setName("user")
            .setDescription("User to get balance for")
            .setRequired(false)),
    async execute(interaction: CommandInteraction): Promise<void> {
        const user = interaction.options.getUser("user") ?? interaction.user;

        const client = interaction.client as BotClient;

        const userDB = await UserModel.findOne({ userID: user.id });

        if (!userDB) {
            await interaction.reply({
                content: "That user doesn't have an account!",
                ephemeral: true
            });

            return;
        }

        const embed = new EmbedBuilder()
            .setTitle(`${user.tag}'s Balance`)
            .setColor("Blurple")
            .setFooter({
                text: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp()
            .addFields(
                {
                    name: "Coins",
                    value: `${userDB.coins.toLocaleString()} coins ${emojis.coin}`
                },
                {
                    name: "Bank",
                    value: `${userDB.bank.toLocaleString()} coins ${emojis.coin}`
                },
                {
                    name: "Total",
                    value: `${(userDB.coins + userDB.bank).toLocaleString()} coins ${emojis.coin}`
                }
            );

        await interaction.reply({
            embeds: [embed]
        });
    }
} as Command;