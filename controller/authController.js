import axios from 'axios';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { OtpModel } from '../model/otpModel.js';
import { UserModel } from '../model/userModel.js';

// 2Factor API Key
const twoFactorApiKey = '50bd2fc8-c749-11ef-8b17-0200cd936042'; // Replace with your 2Factor API Key

// Send OTP
export const sendOtp = async (req, res) => {
  const { phoneNumber } = req.body;
  console.log(process.env.KEY_ID, process.env.KEY_SECRET, 'key_id, key_secret');
  if (!phoneNumber) {
    return res.status(400).json({ message: 'Phone number is required.' });
  }

  try {
    // Send OTP using 2Factor API
    const response = await axios.get(
      `https://2factor.in/API/V1/${twoFactorApiKey}/SMS/${phoneNumber}/AUTOGEN/OTP1`
    );

    if (response.data.Status === 'Success') {
      // Optionally store request ID in DB for verification (if required)
      await OtpModel.create({
        phoneNumber,
        requestId: response.data.Details, // Save the request ID for verification
      });

      res.status(200).json({
        message: 'OTP sent successfully.',
        requestId: response.data.Details, // You can return this to the client if needed
      });
    } else {
      res.status(500).json({
        message: 'Failed to send OTP.',
        error: response.data.Details,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending OTP.', error: error.message });
  }
};


export const verifyOtp = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    return res.status(400).json({ message: 'Phone number and OTP are required.' });
  }

  try {
    // Retrieve request ID from the OTP database
    const record = await OtpModel.findOne({ phoneNumber });

    if (!record || !record.requestId) {
      return res.status(404).json({ message: 'OTP request not found.' });
    }

    // Verify OTP using 2Factor API
    const response = await axios.get(
      `https://2factor.in/API/V1/${twoFactorApiKey}/SMS/VERIFY/${record.requestId}/${otp}`
    );

    if (response.data.Status === 'Success') {
      // Check if the user already exists in the database
      let user = await UserModel.findOne({ phoneNumber });

      if (!user) {
        // If user does not exist, create a new entry
        user = await UserModel.create({ phoneNumber });
      }

      // Generate JWT token
      const token = jwt.sign({ phoneNumber, id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION || '1h', // Default expiration is 1 hour
      });

      // Optionally delete OTP record
      await OtpModel.deleteOne({ phoneNumber });

      res.status(200).json({
        message: 'OTP verified successfully.',
        token,
      });
    } else {
      res.status(401).json({
        message: 'Invalid OTP.',
        error: response.data.Details,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error verifying OTP.', error: error.message });
  }
};


export const checkJwtValidity = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from Bearer header

  if (!token) {
    return res.status(401).json({ message: 'Token is required.' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({
      message: 'Token is valid.',
      decoded,
    });
  } catch (error) {
    res.status(401).json({
      message: 'Invalid or expired token.',
      error: error.message,
    });
  }
};
