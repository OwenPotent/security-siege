import { ButtonInteraction } from "discord.js";
import BotClient from "../../../structures/Client";
import Logger from "../../../structures/Logger";
import { Button } from "../../../interfaces/Interactions";

export default {
    id: "sample",
    execute: async (interaction: ButtonInteraction, client: BotClient) => {
        try {
            await interaction.reply({ content: "Sample button!", ephemeral: true });
        } catch (error) {
            Logger.error(error);
            await interaction.reply({ content: "There was an error while executing this button!", ephemeral: true });
        }
    }
} as Button;