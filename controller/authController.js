import jwt from 'jsonwebtoken';
import { OtpModel } from '../model/otpModel.js';
import { UserModel } from '../model/userModel.js';
import { ProfileModel } from '../model/profileModel.js';
import axios from 'axios';


import dotenv from 'dotenv';
dotenv.config(); // Make sure this is at the top of your file to load environment variables

const twoFactorApiKey =  '50bd2fc8-c749-11ef-8b17-0200cd936042'; // Use the API key from your .env file

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

    const response = await axios.get(
      `https://2factor.in/API/V1/${twoFactorApiKey}/SMS/${phoneNumber}/AUTOGEN/OTP1`
    );

    if (response.data.Status === 'Success') {
      try {
        await OtpModel.create({
          phoneNumber,
          requestId: response.data.Details, // Save the request ID for verification
        });

        res.status(200).json({
          message: 'OTP sent successfully.',
          requestId: response.data.Details,
          status:true // Return requestId to client if needed
        });
      } catch (dbError) {
        console.error('Error saving OTP to database:', dbError);
        res.status(500).json({
          message: 'OTP sent but failed to save in database.',
          error: dbError.message,
        });
      }
    } else {
      res.status(500).json({
        message: 'Failed to send OTP.',
        error: response.data.Details,
      });
    }
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
    // Retrieve OTP record using phoneNumber
    const record = await OtpModel.findOne({ phoneNumber });

    if (!record || !record.requestId) {
      return res.status(404).json({ message: 'OTP request not found.' });
    }

    // Proceed with OTP verification with the 2Factor API
    const response = await axios.get(
      `https://2factor.in/API/V1/${twoFactorApiKey}/SMS/VERIFY/${record.requestId}/${otp}`
    );

    if (response.data.Status === 'Success') {
      let user = await UserModel.findOne({ phoneNumber });

      if (!user) {
        user = await UserModel.create({ phoneNumber });
      }

      const token = jwt.sign({ phoneNumber, id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION || '1h',
      });

      // Optionally delete OTP record after successful verification
      await OtpModel.deleteOne({ phoneNumber });

      res.status(200).json({
        message: 'OTP verified successfully.',
        token,
      });
    } else {
      res.status(401).json({ message: 'Invalid OTP.', error: response.data.Details });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error verifying OTP.', error: error.message });
  }
};
