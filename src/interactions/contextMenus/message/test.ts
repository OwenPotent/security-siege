import { ContextMenuCommand } from "../../../interfaces/Interactions";
import { ContextMenuCommandInteraction } from "discord.js";

export default {
    data: {
        name: "test",
        type: 3
    },
    execute: async (interaction: ContextMenuCommandInteraction) => {
        await interaction.reply({
            content: "Sample context menu command",
            ephemeral: true
        });
    }
} as ContextMenuCommand;