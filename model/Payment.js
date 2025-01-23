import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    razorpay_order_id: String,
    razorpay_payment_id: String,
    razorpay_signature: String,
    amount: Number,
    currency: String,
    status: String,
    user_id: String, // Added field to store user ID
});

export default mongoose.model('Payment', paymentSchema);
