import express from 'express';
import { sendOtp, verifyOtp } from '../controller/authController.js';
import { verifyJwt } from '../controller/verifyjwt.js';

const router = express.Router();

// Send OTP Route
router.post('/login', sendOtp);

// Verify OTP Route
router.post('/verify', verifyOtp);

router.post('/', verifyJwt);




export default router;
