import { ButtonInteraction, AutocompleteInteraction, ModalSubmitInteraction, ContextMenuCommandInteraction } from "discord.js";
import BotClient from "../structures/Client";

export interface Button {
    id: string;
    execute(interaction: ButtonInteraction, client?: BotClient): Promise<void>;
}

export interface Autocomplete {
    name: string;
    execute(interaction: AutocompleteInteraction, client?: BotClient): Promise<void>;
}

export interface ModalSubmit {
    id: string;
    execute(interaction: ModalSubmitInteraction, client?: BotClient): Promise<void>;
}

export interface ContextMenuCommandData {
    name: string;
    type: 2 | 3;
}

export interface ContextMenuCommand {
    data: ContextMenuCommandData;
    execute(interaction: ContextMenuCommandInteraction, client?: BotClient): Promise<void>;
}