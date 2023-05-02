import { AutocompleteInteraction } from "discord.js";
import BotClient from "../../../structures/Client";
import { Autocomplete } from "../../../interfaces/Interactions";
import Utility from "../../../structures/Utility";

export default {
    name: "help",
    execute: async (interaction: AutocompleteInteraction, client: BotClient) => {
        const focusedValue = interaction.options.getFocused();

        const commandNames = await Utility.getAllCommandNames();

        const filtered = commandNames.filter((command) => command.startsWith(focusedValue));

        await interaction.respond(
            filtered.map((choice) => ({
                name: choice,
                value: choice
            }))
        )
    }
} as Autocomplete;