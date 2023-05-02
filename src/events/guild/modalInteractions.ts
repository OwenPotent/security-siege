import { Event } from "../../interfaces/Event";
import BotClient from "../../structures/Client";
import Logger from "../../structures/Logger";

export default {
    name: "modalInteraction",
    execute: async (client: BotClient) => {
        client.on("interactionCreate", async (interaction) => {
            if (!interaction.isModalSubmit()) return;

            const modal = client.modals.get(interaction.customId);

            if (!modal) {
                await interaction.reply({
                    content: "This modal is not registered!",
                    ephemeral: true
                });
                return;
            }

            try {
                await modal.execute(interaction);
            } catch (error) {
                Logger.error(error);
                await interaction.reply({
                    content: "There was an error while executing this modal!",
                    ephemeral: true
                });
            }
        });
    }
} as Event;