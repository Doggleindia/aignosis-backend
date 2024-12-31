import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    razorpay_order_id: String,
    razorpay_payment_id: String,
    razorpay_signature: String,
    amount: Number,
    currency: String,
    status: String,
});

// Exporting the model using ES module export
export default mongoose.model('Payment', paymentSchema);
