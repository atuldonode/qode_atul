import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = Schema({
    firstName: String,
    lastName: String,
    city: String,
}, { timestamps: true });

export default model("User", userSchema);