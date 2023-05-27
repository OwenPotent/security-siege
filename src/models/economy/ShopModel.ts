import { Schema, model } from "mongoose";

const ShopSchema = new Schema({
    item: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
});

export const ShopModel = model("shop", ShopSchema);