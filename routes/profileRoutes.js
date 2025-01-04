import express from 'express';
import { authenticateJWT } from '../middleware/authMiddleware.js';
import { getProfiles, createProfile } from '../controller/profileController.js';

const router = express.Router();

// Secure Routes
router.get('/', authenticateJWT, getProfiles);
router.post('/', authenticateJWT, createProfile);

export default router;
