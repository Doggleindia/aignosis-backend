// controllers/otpController.js
import nodemailer from 'nodemailer';
import { OtpModel } from '../model/otpModel.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

// Gmail credentials from .env
const { EMAIL_USER, EMAIL_PASS } = process.env;

// Send OTP function
export const sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // Check if OTP for the given email already exists
    const existingOtp = await OtpModel.findOne({ email });
    if (existingOtp) {
      return res.status(400).json({ message: 'OTP already sent to this email.' });
    }

    // Set up Nodemailer transporter with Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    // Define email options
    const mailOptions = {
      from: EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
    };

    // Send OTP email
    await transporter.sendMail(mailOptions);

    // Save OTP and email to the database
    await OtpModel.create({
      email,
      otp,
      requestId: otp, // Use OTP as the requestId (you can change this to a different identifier if needed)
    });

    res.status(200).json({
      message: 'OTP sent successfully.',
      status: true,
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Error sending OTP.', error: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required.' });
  }

  try {
    // Find the saved OTP session for this email
    const record = await OtpModel.findOne({ email });

    if (!record) {
      return res.status(401).json({ message: 'OTP session not found.' });
    }

    // Validate the OTP
    if (record.otp !== otp) {
      return res.status(401).json({ message: 'Invalid OTP.' });
    }

    // Generate a JWT token (for user authentication)
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION || '1h',
    });

    // Delete OTP session after successful verification
    await OtpModel.deleteOne({ email });

    res.status(200).json({
      message: 'OTP verified successfully.',
      token,
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Error verifying OTP.', error: error.message });
  }
};

