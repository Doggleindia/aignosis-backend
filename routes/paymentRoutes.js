import express from 'express';
import { authenticateJWT } from '../middleware/authMiddleware.js';
import { createOrder, verifyPayment } from '../controller/paymentController.js';

const router = express.Router();

// Secure Routes
router.post('/create-order', authenticateJWT, createOrder);
router.post('/verify-payment', authenticateJWT, verifyPayment);

export default router;
