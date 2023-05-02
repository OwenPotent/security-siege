import { readdirSync } from "fs";
import { join } from "path";
import { Command } from "../interfaces/Command";
import BotClient from "./Client";

export default class Utility {
    private static client: BotClient;

    public static async getAllCommandNames(): Promise<string[]> {
        const commands: string[] = [];
        const commandFolders = readdirSync(join(__dirname, "..", "commands"));

        for (const folder of commandFolders) {
            const commandFiles = readdirSync(join(__dirname, "..", "commands", folder)).filter((file) => file.endsWith(".ts" || ".js"))

            for (const file of commandFiles) {
                const command: Command = (await import(join(__dirname, "..", "commands", folder, file))).default;

                if (!command.data) throw new Error("Command must contain a data property");

                commands.push(command.data.name);
            }
        }

        return commands;
    }

    public static getCommand(command: string): Command {
        const commandData = this.client.commands.get(command);

        if (!commandData) return undefined;

        return commandData;
    }
}