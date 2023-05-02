import { Event } from "../../interfaces/Event";
import BotClient from "../../structures/Client";
import Logger from "../../structures/Logger";

export default {
    name: "contextInteraction",
    execute: async (client: BotClient) => {
        client.on("interactionCreate", async (interaction) => {
            if (!interaction.isContextMenuCommand()) return;

            if (interaction.isUserContextMenuCommand()) {
                const userCommand = client.contextMenu.get(
                    "USER " + interaction.commandName
                );

                if (!userCommand) return;

                try {
                    await userCommand.execute(interaction, client);
                } catch (error) {
                    Logger.error(error);
                    await interaction.reply({
                        content: "An error occurred while executing this command!",
                        ephemeral: true
                    });
                    return
                }
            }

            else if (interaction.isMessageContextMenuCommand()) {
                const messageCommand = client.contextMenu.get(
                    "MESSAGE " + interaction.commandName
                );

                if (!messageCommand) return;

                try {
                    await messageCommand.execute(interaction, client);
                } catch (error) {
                    Logger.error(error);
                    await interaction.reply({
                        content: "An error occurred while executing this command!",
                        ephemeral: true
                    });
                    return
                }
            }

            else {
                return Logger.error("Unknown context menu type");
            }
        });
    }
} as Event;