import nodemailer from 'nodemailer';
import { OtpModel } from '../model/otpModel.js';
import { UserModel } from '../model/userModel.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Gmail credentials from .env
const { EMAIL_USER, EMAIL_PASS } = process.env;

export const sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

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
      requestId: otp, // Use OTP as the requestId
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

    // Check if the user already exists in the UserModel
    let user = await UserModel.findOne({ email });
    if (!user) {
      // If user doesn't exist, create a new user
      user = await UserModel.create({
        email,
        emailVerified: true, // Set the emailVerified flag to true after OTP verification
      });
    }

    // Generate a JWT token (for user authentication)
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION || '1h',
    });

    // Delete OTP session after successful verification
    await OtpModel.deleteOne({ email });

    res.status(200).json({
      message: 'OTP verified successfully.',
      token,
      user: user,  // Return the user data
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Error verifying OTP.', error: error.message });
  }
};
