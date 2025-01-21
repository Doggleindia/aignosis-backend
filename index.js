import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import {verifyJwt} from './controller/verifyJwt.js';
import otpRoutes from './routes/otpRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import profileRoutes from './routes/profileRoutes.js'; // Profile routes
import testRoutes from './routes/testRoutes.js';
import s3Routes from './routes/s3Routes.js'; // S3 Routes
import { connectDB } from './config/db.js';

const app = express();
const PORT = process.env.PORT || 5500;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// API routes
app.use('/verifyJwt', verifyJwt);
app.use('/api/otp', otpRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/profiles', profileRoutes); // Profile routes
app.use('/api/test', testRoutes);
app.use('/api/s3', s3Routes); // S3 Routes

// Health Check Endpoint
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Health Check!' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
