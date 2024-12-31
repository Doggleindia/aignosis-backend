import express from 'express';
import { sendOtp, verifyOtp } from '../controller/authController.js';

const router = express.Router();

// Send OTP Route
router.post('/login', sendOtp);

// Verify OTP Route
router.post('/verify', verifyOtp);

export default router;
