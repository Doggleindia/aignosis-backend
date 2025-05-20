// models/otpModel.js
import mongoose from 'mongoose';

const OtpSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: false,
  },
  requestId: {
    type: String, // This will store the OTP or another identifier
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // OTP expires in 5 minutes
  },
});

export const OtpModel = mongoose.model('Otp', OtpSchema);
