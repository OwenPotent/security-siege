import BotClient from "./structures/Client";
import { config } from "dotenv";
import Logger from "./structures/Logger";
import { ActivityType } from "discord.js";
import fs from "fs";
import path = require("path");
import { Event } from "./interfaces/Event";

config();

const client: BotClient = new BotClient();
client.start();

// Handle events (Will be moved to a separate file in the future)
const eventFolders: string[] = fs.readdirSync(path.join(__dirname, "events"));

for (const folder of eventFolders) {
    const eventFiles: string[] = fs.readdirSync(path.join(__dirname, "events", folder)).filter((file: string) => file.endsWith(".ts" || ".js"))

    for (const file of eventFiles) {
        const event: Event = require(path.join(__dirname, "events", folder, file)).default;

        try {
            event.execute(client);
        } catch (error) {
            Logger.error(error)
        }
    }
}

Logger.log(`Loaded ${eventFolders.length} events.`, "log")

process.on("unhandledRejection", (error) => {
    Logger.error(error);
});

process.on("uncaughtException", (error) => {
    Logger.error(error);
});