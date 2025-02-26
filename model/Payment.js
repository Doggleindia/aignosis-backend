// import mongoose from 'mongoose';

// const paymentSchema = new mongoose.Schema({
//     razorpay_order_id: String,
//     razorpay_payment_id: String,
//     razorpay_signature: String,
//     amount: Number,
//     currency: String,
//     status: String,
//     user_id: String, 
// });

// export default mongoose.model('Payment', paymentSchema);

import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  validity: { type: Number, required: true },
  sessions: { type: Number, required: true },
  razorpay_payment_id: { type: String },
  order_id: { type: String, required: true },
  service_type: { type: String, enum: ["Test", "Therapy"], required: true },
  status: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
  created_at: { type: Date, default: Date.now }
});

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;

