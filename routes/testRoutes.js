import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { checkTestAccess } from '../middleware/testAccessMiddleware.js';

const router = express.Router();

// Route to handle test access
router.get('/test/fillup', verifyToken, checkTestAccess, (req, res) => {
  res.status(200).json({ message: 'Access granted to the test.' });
});

export default router;
