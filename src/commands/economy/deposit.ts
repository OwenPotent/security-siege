import { Command } from "../../interfaces/Command";
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, EmbedBuilder } from "discord.js";
import BotClient from "../../structures/Client";
import Utility from "../../structures/Utility";
import { UserModel } from "../../models/economy/UserModel";
import { emojis } from "../../config.json"

export default {
    data: new SlashCommandBuilder()
        .setName("deposit")
        .setDescription("Deposit coins to your bank account or someone else's bank account")
        .addIntegerOption(option => option
            .setName("amount")
            .setDescription("Amount of coins to deposit")
            .setRequired(true))
        .addUserOption(option => option
            .setName("user")
            .setDescription("User to deposit coins to")
            .setRequired(false)),
    async execute(interaction: CommandInteraction): Promise<void> {
        const amount = interaction.options.get("amount")!.value as number;
        const user = interaction.options.getUser("user") ?? interaction.user;

        const client = interaction.client as BotClient;

        const userDB = await UserModel.findOne({ userID: user.id });

        if (!userDB) {
            await interaction.reply({
                content: "That user does not have an account!",
                ephemeral: true
            });

            return;
        }

        if (amount < 1) {
            await interaction.reply({
                content: "You cannot deposit less than 1 coin!",
                ephemeral: true
            });

            return;
        }

        if (amount > userDB.coins) {
            await interaction.reply({
                content: "You do not have enough coins to deposit that amount!",
                ephemeral: true
            });

            return;
        }

        userDB.coins -= amount;
        userDB.bank += amount;

        await userDB.save();

        const embed = new EmbedBuilder()
            .setTitle("Coins Deposited")
            .setColor("Green")
            .setFooter({
                text: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp()
            .setDescription(`${amount.toLocaleString()} coins ${emojis.coin} have been deposited to ${user.tag}'s bank account`);

        await interaction.reply({
            embeds: [embed]
        });
    }
} as Command;