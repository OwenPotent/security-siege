import { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder, CommandInteraction } from "discord.js";
import BotClient from "../structures/Client";

export interface Command {
    data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> | SlashCommandSubcommandBuilder | SlashCommandSubcommandGroupBuilder;
    execute(interaction: CommandInteraction, client?: BotClient): Promise<void>;
}