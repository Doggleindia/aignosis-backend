import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import {verifyJwt} from './controller/verifyJwt.js';
import otpRoutes from './routes/otpRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import testRoutes from './routes/testRoutes.js';
import s3Routes from './routes/s3Routes.js';
import assessmentRoutes from './routes/assessmentRoutes.js'; // New route
import offerRoutes from './routes/offerRoutes.js';
import careerRoutes from './routes/careerRoutes.js'
import cardservicesRoutes from './routes/cardServiceRoutes.js'
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
app.use('/api/profiles', profileRoutes);
app.use('/api/test', testRoutes);
app.use('/api/s3', s3Routes);
app.use('/api/assessment', assessmentRoutes); // New route
app.use('/api/offer', offerRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/service', cardservicesRoutes);

// Health Check Endpoint
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Health Check!' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
