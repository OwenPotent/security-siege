import { ModalSubmit } from "../../../interfaces/Interactions";
import { ModalSubmitInteraction } from "discord.js";

export default {
    id: "sample",
    execute: async (interaction: ModalSubmitInteraction) => {
        const favouriteColor = interaction.fields.getTextInputValue("favouriteColor");
        const hobbies = interaction.fields.getTextInputValue("hobbies");

        await interaction.reply({
            content: `Your favourite color is ${favouriteColor} and your hobbies are ${hobbies}`,
            ephemeral: true
        });
    }
} as ModalSubmit;