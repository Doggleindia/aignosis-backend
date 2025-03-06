import express from 'express';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { TherapySessionModel } from '../model/TherapySessionModel.js';
import { DoctorModel } from '../model/DoctorModel.js'; // Ensure this model exists
import dotenv from 'dotenv';
import mongoose from 'mongoose'; 

dotenv.config();

const { EMAIL_USER, EMAIL_PASS, JWT_SECRET } = process.env;
const router = express.Router();

// Middleware to extract user data from the token
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token is required for authentication.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach decoded user data to the request object
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

// Endpoint to handle assessment purchase
router.post('/purchase', authenticateToken, async (req, res) => {
  const { therapyName, timing, doctorId } = req.body;

  if (!therapyName || !timing || !doctorId) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const { id: userId, email } = req.user;

  try {
    // Properly convert doctorId to ObjectId using 'new'
    const doctorObjectId = new mongoose.Types.ObjectId(doctorId);

    // Check if the timing is already booked for the doctor
    const existingSession = await TherapySessionModel.findOne({ doctorId: doctorObjectId, timing });
    if (existingSession) {
      return res.status(400).json({ message: 'This timing is already booked for the selected doctor.' });
    }

    // Book the session
    const session = await TherapySessionModel.create({
      userId,
      therapyName,
      doctorId: doctorObjectId,
      timing,
    });

    // Send confirmation email to the user (assuming you have a transporter setup)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: EMAIL_USER,
      to: email,
      subject: 'Therapy Session Confirmation',
      text: `Dear User,\n\nYour Assessment session has been successfully booked.\n\nAssessment Name: ${therapyName}\nTiming: ${timing}\n\nThank you for choosing our service!\n\nBest regards,\nAi.gnosis Team`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error sending email:', err.message);
        return res.status(500).json({ message: 'Error sending confirmation email.', error: err.message });
      }
      console.log('Email sent:', info.response);
    });

    res.status(201).json({
      message: 'Therapy session booked successfully.',
      session,
    });
  } catch (error) {
    console.error('Error booking session:', error.message);
    res.status(500).json({ message: 'Error booking session.', error: error.message });
  }
});

export default router;
