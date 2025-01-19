import express from 'express';
import { addProfile, getProfiles } from '../controller/profileController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Add a new profile (protected route)
router.post('/add', verifyToken, upload.single('profilePic'), addProfile);

// Get all profiles for the authenticated user (protected route)
router.get('/', verifyToken, getProfiles);

export default router;
