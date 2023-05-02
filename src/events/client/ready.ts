import { Event } from "../../interfaces/Event";
import BotClient from "../../structures/Client";
import Logger from "../../structures/Logger";
import { ActivityType } from "discord.js";


export default {
    name: "ready",
    execute: async (client: BotClient) => {
        client.on("ready", () => {
            Logger.log(`${client.user?.tag} is online!`, "log");
        
                client.user?.setPresence({
                    activities: [
                        {
                            name: "with discord.js",
                            type: ActivityType.Playing
                        }
                    ]
                });
        });
    }
} as Event;