import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { createOrder, verifyPayment } from '../controller/paymentController.js';

const router = express.Router();

// Secure Routes
router.post('/create-order', verifyToken, createOrder);
router.post('/verify-payment', verifyToken, verifyPayment);

export default router;
