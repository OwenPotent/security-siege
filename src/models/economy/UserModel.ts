import { model, Schema } from "mongoose";

const UserSchema = new Schema({
    userID: { type: String, required: true },
    coins: { type: Number, required: true },
    bank: { type: Number, required: true },
    inventory: { type: Array, required: true },
    lastDaily: { type: Number, required: true },
    lastBeg: { type: Number, required: true },
    lastWork: { type: Number, required: true },
    lastCrime: { type: Number, required: true },
    lastRob: { type: Number, required: true },
    lastGamble: { type: Number, required: true }
});

export const UserModel = model("users", UserSchema);