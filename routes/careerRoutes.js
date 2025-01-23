import express from 'express';
import { createCareer, getCareers, getCareerById, updateCareer, deleteCareer } from '../controller/careerController.js';
import upload from '../middleware/uploadMiddleware.js'; // Import the upload middleware
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to create a new career record with resume upload
router.post('/create',verifyToken, upload.single('fileURL'), createCareer);

// Route to get all career records
router.get('/getallcarrer',verifyToken, getCareers);

// Route to get a specific career record by ID
router.get('/getbyID/:id',verifyToken, getCareerById);

// Route to update a career record by ID
router.put('/updatebyID/:id',verifyToken, upload.single('fileURL'), updateCareer);

// Route to delete a career record by ID
router.delete('/deletebyID/:id',verifyToken, deleteCareer);

export default router;
