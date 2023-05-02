import { readdirSync } from 'fs';
import { join } from 'path';
import Logger from './Logger';
import BotClient from './Client';
import { Button, Autocomplete, ModalSubmit, ContextMenuCommand } from "../interfaces/Interactions";

export default class InteractionHandler {
    public client: BotClient;

    public constructor(client: BotClient) {
        this.client = client;
    }

    public async registerInteractions(): Promise<void> {
        const buttonFolders: string[] = readdirSync(join(__dirname, "..", "interactions", "buttons"));
        const modalFolders: string[] = readdirSync(join(__dirname, "..", "interactions", "modals"));
        const autocompleteFolders: string[] = readdirSync(join(__dirname, "..", "interactions", "autocompletes"));
        const contextMenuFolders: string[] = readdirSync(join(__dirname, "..", "interactions", "contextMenus"));

        for (const folder of buttonFolders) {
            const buttonFiles: string[] = readdirSync(join(__dirname, "..", "interactions", "buttons", folder)).filter((file: string) => file.endsWith(".ts" || ".js"));

            for (const file of buttonFiles) {
                const button: Button = require(join(__dirname, "..", "interactions", "buttons", folder, file)).default;

                try {
                    this.client.buttons.set(button.id, button);
                } catch (error) {
                    Logger.error(error);
                }
            }
        }

        Logger.log(`${this.client.buttons.size} buttons have been loaded`, "log");

        for (const folder of modalFolders) {
            const modalFiles: string[] = readdirSync(join(__dirname, "..", "interactions", "modals", folder)).filter((file: string) => file.endsWith(".ts" || ".js"));

            for (const file of modalFiles) {
                const modal: ModalSubmit = require(join(__dirname, "..", "interactions", "modals", folder, file)).default;

                try {
                    this.client.modals.set(modal.id, modal);
                } catch (error) {
                    Logger.error(error);
                }
            }
        }

        Logger.log(`${this.client.modals.size} modals have been loaded`, "log");

        for (const folder of autocompleteFolders) {
            const autocompleteFiles: string[] = readdirSync(join(__dirname, "..", "interactions", "autocompletes", folder)).filter((file: string) => file.endsWith(".ts" || ".js"));

            for (const file of autocompleteFiles) {
                const autocomplete: Autocomplete = require(join(__dirname, "..", "interactions", "autocompletes", folder, file)).default

                try {
                    this.client.autocomplete.set(autocomplete.name, autocomplete);
                } catch (error) {
                    Logger.error(error);
                }
            }
        }

        Logger.log(`${this.client.autocomplete.size} autocompletes have been loaded`, "log");

        for (const folder of contextMenuFolders) {
            const contextMenuFiles: string[] = readdirSync(join(__dirname, "..", "interactions", "contextMenus", folder)).filter((file: string) => file.endsWith(".ts" || ".js"));

            for (const file of contextMenuFiles) {
                const contextMenu: ContextMenuCommand = require(join(__dirname, "..", "interactions", "contextMenus", folder, file)).default

                const keyName = `${folder.toUpperCase()} ${contextMenu.data.name}`
                try {
                    this.client.contextMenu.set(keyName, contextMenu);
                } catch (error) {
                    Logger.error(error);
                }
            }
        }

        Logger.log(`${this.client.contextMenu.size} context menu commands have been loaded`, "log");
    }
}