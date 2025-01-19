import Razorpay from 'razorpay';
import Payment from '../model/Payment.js';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const razorpay = new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.RZP_TEST,
});

//console.log('Razorpay Key ID:', process.env.KEY_ID);  // Debugging the key_id
//console.log('Razorpay Key Secret:', process.env.RZP_TEST);  // Debugging the key_secret



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
      .createHmac('sha256', process.env.RZP_TEST)
      .update(body.toString())
      .digest('hex');
  
    if (expectedSignature === razorpay_signature) {
      try {
        const payment = new Payment({
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          amount: req.body.amount,
          currency: req.body.currency,
          status: "success",
        });
  
        await payment.save();
  
        const userId = req.user.id; // Assume the user ID is available from JWT
        const user = await UserModel.findById(userId);
  
        if (user) {
          // Set test access count to 0 after successful payment
          user.testCount = 0;
          await user.save();
        }
  
        res.status(200).json({
          message: 'Payment verified successfully. Access to the test granted.',
        });
      } catch (error) {
        res.status(500).json({ error: 'Error saving payment or updating user.', details: error.message });
      }
    } else {
      res.status(400).json({ error: 'Invalid signature' });
    }
  };