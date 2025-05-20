import { OtpModel } from '../model/otpModel.js';
import { UserModel } from '../model/userModel.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import AWS from 'aws-sdk';

dotenv.config();

// Configure AWS SNS
const sns = new AWS.SNS({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "ap-south-1", // Update this to match your AWS region
});

// Send OTP via AWS SNS
export const sendOtp = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  try {
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to MongoDB (overwriting any existing OTP for this phoneNumber)
    await OtpModel.findOneAndUpdate(
      { phoneNumber },
      { otp, createdAt: new Date() },
      { upsert: true, new: true }
    );

    const params = {
      Message: `Your verification code is ${otp}. Please enter this code to verify your account. This code is valid for 10 minutes. Do not share it with anyone.`,
      PhoneNumber: phoneNumber,
      MessageAttributes: {
        "AWS.SNS.SMS.SenderID": {
          DataType: "String",
          StringValue: "AIGNOS",
        },
        "AWS.SNS.SMS.SMSType": {
          DataType: "String",
          StringValue: "Transactional",
        },
      },
    };

    // Send OTP via AWS SNS ( no dont send it, we're using firebase for that)
    // await sns.publish(params).promise();

    res.status(200).json({ message: "OTP sent successfully", status: true });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ error: "Failed to send OTP", details: error.message });
  }
};

// Verify OTP and generate JWT token
export const verifyOtp = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    return res.status(400).json({ message: 'Phone number and OTP are required.' });
  }

  try {
    // Find OTP record in database
    const record = await OtpModel.findOne({ phoneNumber });

    if (!record) {
      return res.status(401).json({ message: 'OTP session not found or expired.' });
    }

    // NOTE: dont validate otp since we're using jwt mechanism from here, but otp is being generated using firebase
    // // Validate OTP
    // if (record.otp !== otp) {
    //   return res.status(401).json({ message: 'Invalid OTP.' });
    // }

    // Check if user exists
    let user = await UserModel.findOne({ phoneNumber });
    if (!user) {
      user = await UserModel.create({
        phoneNumber,
        phoneNumberVerified: true, 
      });
    } else {
      user.phoneNumberVerified = true;
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, phoneNumber: user.phoneNumber },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION || '1h' }
    );

    // Delete OTP after successful verification
    await OtpModel.deleteOne({ phoneNumber });

    res.status(200).json({
      message: 'OTP verified successfully.',
      token,
      user,
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Error verifying OTP.', error: error.message });
  }
};
