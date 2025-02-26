import mongoose from "mongoose";

const cardServiceSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  service_type: { type: String, enum: ["Test", "Therapy"], required: true },
  status: { type: String, enum: ["Purchased", "Expired"], default: "Purchased" },
  purchased_on: { type: Date, default: Date.now },
  validity_period: { type: Number, required: true }, // in days
  sessions_used: { type: Number, default: 0 },
  total_sessions: { type: Number, required: true },
});

const CardService = mongoose.model("CardService", cardServiceSchema);
export default CardService;
