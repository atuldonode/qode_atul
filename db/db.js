import mongoose from "mongoose";
const URL = "mongodb://localhost:27017/atuldonode"

mongoose.connect(URL).then(() => console.log("DB connected"))