import Razorpay from 'razorpay';
import Payment from '../model/Payment.js';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const razorpay = new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.RZP_TEST,
});

console.log('Razorpay Key ID:', process.env.KEY_ID);  // Debugging the key_id
console.log('Razorpay Key Secret:', process.env.RZP_TEST);  // Debugging the key_secret



// Create Order
export const createOrder = async (req, res) => {
    const { amount } = req.body;
    const options = {
        amount: amount * 100, // Convert to smallest currency unit
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
    };
    try {
        const order = await razorpay.orders.create(options);
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create order' });
    }
};

// Verify Payment
export const verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest('hex');

    if (expectedSignature === razorpay_signature) {
        const payment = new Payment({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            amount: req.body.amount,
            currency: req.body.currency,
            status: "success",
        });

        await payment.save();
        res.status(200).json({ message: 'Payment verified successfully' });
    } else {
        res.status(400).json({ error: 'Invalid signature' });
    }
};
