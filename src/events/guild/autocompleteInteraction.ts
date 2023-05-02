import { Event } from "../../interfaces/Event";
import BotClient from "../../structures/Client";
import Logger from "../../structures/Logger";

export default {
    name: "autocompleteInteraction",
    execute: async (client: BotClient) => {
        client.on("interactionCreate", async (interaction) => {
            if (!interaction.isAutocomplete()) return;
        
            const autocomplete = client.autocomplete.get(interaction.commandName);
        
            if (!autocomplete) return;
        
            try {
                await autocomplete.execute(interaction, client);
            } catch (error) {
                Logger.error(error);
            }
        });
    }
} as Event;