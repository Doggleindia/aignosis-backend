import jwt from 'jsonwebtoken';
import { OtpModel } from '../model/otpModel.js';
import { UserModel } from '../model/userModel.js';
import { PubSub } from '@google-cloud/pubsub';
import dotenv from 'dotenv';
dotenv.config();

// GCP Pub/Sub Setup
const pubSubClient = new PubSub();
const topicName = process.env.GCP_TOPIC_NAME; // Set this in .env

export const sendOtp = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: 'Phone number is required.' });
  }

  try {
    // Check if OTP for the given phone number already exists
    const existingOtp = await OtpModel.findOne({ phoneNumber });
    if (existingOtp) {
      return res.status(400).json({ message: 'OTP already sent to this phone number.' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
    const messageData = {
      phoneNumber,
      otp,
    };

    // Publish OTP message to GCP Pub/Sub
    const dataBuffer = Buffer.from(JSON.stringify(messageData));
    await pubSubClient.topic(topicName).publishMessage({ data: dataBuffer });

    // Save OTP request in the database
    await OtpModel.create({
      phoneNumber,
      otp,
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
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    return res.status(400).json({ message: 'Phone number and OTP are required.' });
  }

  try {
    const record = await OtpModel.findOne({ phoneNumber });

    if (!record || record.otp !== otp) {
      return res.status(401).json({ message: 'Invalid OTP.' });
    }

    let user = await UserModel.findOne({ phoneNumber });

    if (!user) {
      user = await UserModel.create({ phoneNumber });
    }

    const token = jwt.sign({ phoneNumber, id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION || '1h',
    });

    await OtpModel.deleteOne({ phoneNumber });

    res.status(200).json({
      message: 'OTP verified successfully.',
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error verifying OTP.', error: error.message });
  }
};
