// routes/otpRoutes.js
import express from 'express';
import { sendOtp, verifyOtp } from '../controller/otpController.js';

const router = express.Router();

// Route to send OTP
router.post('/sendOtp', sendOtp);

// Route to verify OTP
router.post('/verifyOtp', verifyOtp);

export default router;
