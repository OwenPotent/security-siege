import { Schema, model } from "mongoose";

const ShopItemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

export const ShopItemModel = model("ShopItem", ShopItemSchema);