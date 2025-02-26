import Razorpay from "razorpay";
import crypto from "crypto";
import Payment from "../model/Payment.js";
import CardService from "../model/CardService.js";
import dotenv from "dotenv";

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.RZP_TEST,
});

// 📌 Create Razorpay Order
export const createOrder = async (req, res) => {
    try {
      const { user_id, service_type, amount, sessions, validity } = req.body;
  console.log(sessions,validity)
      if (!user_id || !service_type || !amount || !sessions || !validity) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
      }
  
      const options = {
        amount: amount * 100,
        currency: "INR",
        receipt: `order_rcpt_${user_id}`,
        payment_capture: 1,
      };
  
      const order = await razorpay.orders.create(options);
  
      const payment = new Payment({
        user_id,
        amount,
        order_id: order.id,
        service_type,
        sessions, // ✅ Save session count
        validity, // ✅ Save validity period
        status: "pending",
      });
  
      await payment.save();
      res.status(201).json({ success: true, order, payment });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  

export const verifyPayment = async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  
      // Get the payment record from DB
      const payment = await Payment.findOne({ order_id: razorpay_order_id });
  
      if (!payment) {
        return res.status(404).json({ success: false, message: "Payment not found" });
      }
  
      // Verify signature
      const hmac = crypto.createHmac("sha256", process.env.RZP_TEST);
      hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
      const generated_signature = hmac.digest("hex");
      console.log("Payment data:", payment);

      if (generated_signature !== razorpay_signature) {
        payment.status = "failed";
        await payment.save();
        return res.status(400).json({ success: false, message: "Payment verification failed" });
      }
  
      // Update payment status to success
      payment.status = "success";
      payment.razorpay_payment_id = razorpay_payment_id;
      await payment.save();
  
      // 🛠 FIX: Check if `validity_period` and `total_sessions` exist in Payment
      if (!payment.validity || !payment.sessions) {
        return res.status(400).json({ success: false, message: "Missing validity or session count in payment data" });
      }
  
      // Add the purchased service to the CardService collection
      const newService = new CardService({
        user_id: payment.user_id,
        service_type: payment.service_type,
        validity_period: payment.validity, // ✅ Fixed: Now using stored `validity`
        total_sessions: payment.sessions, // ✅ Fixed: Now using stored `sessions`
      });
  
      await newService.save();
  
      res.status(200).json({ success: true, message: "Payment successful and service activated", data: newService });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
