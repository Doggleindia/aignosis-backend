import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema(
  {
    phoneNumber: { type: String, required: true, unique: true },
    requestId: { type: String, required: true }, // Store 2Factor's request ID
    createdAt: { type: Date, default: Date.now, expires: 300 }, // Record expires in 5 minutes
  },
  { timestamps: true }
);

export const OtpModel = mongoose.model('Otp', otpSchema);
