import express from 'express';
import { addProfile, getProfiles } from '../controller/profileController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/add', verifyToken, upload.single('profilePic'), addProfile);
router.get('/', verifyToken, getProfiles);

export default router;
