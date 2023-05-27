import { Command } from "../../interfaces/Command";
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, EmbedBuilder } from "discord.js";
import BotClient from "../../structures/Client";
import mongoose from "mongoose";
import { UserModel } from "../../models/economy/UserModel";
import Utility from "../../structures/Utility";

export default {
    data: new SlashCommandBuilder()
        .setName("updateaccount")
        .setDescription("Update an account"),
    async execute(interaction: CommandInteraction): Promise<void> {
        Utility.updateUserDB(interaction);

        await interaction.reply({
            content: "You have successfully updated your account!",
            ephemeral: true
        });
    }
} as Command;