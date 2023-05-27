import { Command } from "../../interfaces/Command";
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, EmbedBuilder } from "discord.js";
import BotClient from "../../structures/Client";
import Utility from "../../structures/Utility";

export default {
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Get information about the bot"),
    async execute(interaction: CommandInteraction): Promise<void> {
        const client = interaction.client as BotClient;

        const embed = new EmbedBuilder()
            .setAuthor({
                name: client.user!.username,
                iconURL: client.user!.displayAvatarURL()
            })
            .setThumbnail(client.user!.displayAvatarURL())
            
    }
} as Command;