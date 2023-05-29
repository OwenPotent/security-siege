import { ModalSubmit } from "../../../interfaces/Interactions";
import { ModalSubmitInteraction } from "discord.js";
import { ShopModel } from "../../../models/economy/ShopModel";
import { EmbedBuilder } from "discord.js";
import { emojis } from "../../../config.json";

export default {
    id: "create-shop",
    async execute(interaction: ModalSubmitInteraction) {
        const name = interaction.fields.getTextInputValue("shop-name");
        const description = interaction.fields.getTextInputValue("shop-description");

        const shop = ShopModel.findOne({ _id: interaction.guild.id, name: name });

        if (shop) {
            const embed = new EmbedBuilder()
                .setTitle(`${emojis.error} Shop Exists!`)
                .setDescription(`A shop with the name "${name}" has already been added in this server.`)
                .setColor("Red")

            await interaction.reply({
                embeds: [embed]
            })

            return;
        }

        const shopModel = new ShopModel({
            _id: interaction.guild.id,
            name: name,
            description: description,
            items: []
        })

        await shopModel.save();
    }
} as ModalSubmit;