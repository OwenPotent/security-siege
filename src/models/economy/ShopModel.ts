import { Schema, model } from "mongoose";

const ShopSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    items: {
        type: Array,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

export const ShopModel = model("Shop", ShopSchema);