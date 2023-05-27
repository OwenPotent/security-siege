import { readdirSync } from "fs";
import { join } from "path";
import { Command } from "../interfaces/Command";
import BotClient from "./Client";
import { CommandInteraction, GuildMemberRoleManager } from "discord.js";
import ms from "ms";
import { UserModel } from "../models/economy/UserModel";

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

    public static getMemberRoleIDs(interaction: CommandInteraction): string[] {
        if (!interaction.member.roles) return [];

        if (interaction.member.roles instanceof GuildMemberRoleManager) {

            return interaction.member.roles.cache.map(role => role.id);
        }

        return [];
    }

    public static msToTime(msS: number): string {
        return ms(msS, { long: true });
    }

    public static getRandomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    public static formatNumber(number: number): string {
        return number.toLocaleString();
    }

    // This function updates the user's data in the database and checks if there are properties missing the database of the user
    public static async updateUserDB(interaction: CommandInteraction): Promise<void> {
        const userDB = await UserModel.findOne({ userID: interaction.user.id });

        if (!userDB) {
            const newUser = new UserModel({
                userID: interaction.user.id,
                coins: 0,
                bank: 0,
                inventory: [],
                lastDaily: 0,
                lastBeg: 0,
                lastWork: 0,
                lastCrime: 0,
                lastRob: 0,
                lastGamble: 0
            });

            await newUser.save();
        } else {
            const properties = [
                "coins",
                "bank",
                "inventory",
                "lastDaily",
                "lastBeg",
                "lastWork",
                "lastCrime",
                "lastRob",
                "lastGamble"
            ];

            for (const property of properties) {
                if (!userDB[property]) {
                    userDB[property] = 0;
                }
            }

            await userDB.save();
        }
    }
}