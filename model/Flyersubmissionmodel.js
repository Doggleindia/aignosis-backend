import mongoose from "mongoose";

const formSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
}, { timestamps: true });

export default mongoose.model("Flyers", formSchema);
