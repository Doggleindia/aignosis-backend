import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import { connectDB } from './config/db.js';


// Load environment variables
dotenv.config();
//console.log('Razorpay Key Secret:', process.env.RZP_TEST);
// console.log("all env url",process.env);  
const app = express();
const PORT = process.env.PORT || 5500;

// Middleware
app.use(cors()); // Enable CORS globally
app.use(bodyParser.json());
// Middleware to capture raw body for Razorpay Webhook
app.use(bodyParser.raw({ type: 'application/json' }));

app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Routes
app.use('/verifyJwt', authRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/profiles', profileRoutes);

// Health Check Endpoint
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Health Check!' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
