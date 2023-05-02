import { Event } from "../../interfaces/Event";
import BotClient from "../../structures/Client";
import Logger from "../../structures/Logger";

export default {
    name: "buttonInteraction",
    execute: async (client: BotClient) => {
        client.on("interactionCreate", async (interaction) => {
            if (!interaction.isButton()) return;
        
            const button = client.buttons.get(interaction.customId);
        
            if (!button) return;
        
            try {
                await button.execute(interaction);
            } catch (error) {
                Logger.error(error);
                await interaction.reply({ content: "There was an error while executing this button!", ephemeral: true });
            }
        });
    }
} as Event;