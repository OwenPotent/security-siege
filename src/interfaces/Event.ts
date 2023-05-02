import BotClient from "../structures/Client";

export interface Event {
    name: string;
    execute: (client: BotClient) => Promise<void>;
}