// server.js
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import otpRoutes from './routes/otpRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import { connectDB } from './config/db.js';
import testRoutes from './routes/testRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5500;

// Middleware
app.use(cors());
app.use(bodyParser.json());  // For parsing JSON data
app.use(bodyParser.urlencoded({ extended: true }));  // For parsing URL-encoded data

// Connect to MongoDB
connectDB();

// API routes
app.use('/api/otp', otpRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/profiles', profileRoutes);  // Exclude verification for '/api/profiles'
app.use('/api/test', testRoutes);

// Health Check Endpoint
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Health Check!' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
