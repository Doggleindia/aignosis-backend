import express from 'express';
import { createCareer, getCareers, getCareerById, updateCareer, deleteCareer } from '../controller/careerController.js';
import upload from '../middleware/uploadMiddleware.js'; // Import the upload middleware
import { authenticateJWT } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to create a new career record with resume upload
router.post('/create',authenticateJWT, upload.single('fileURL'), createCareer);

// Route to get all career records
router.get('/getallcarrer',authenticateJWT, getCareers);

// Route to get a specific career record by ID
router.get('/getbyID/:id',authenticateJWT, getCareerById);

// Route to update a career record by ID
router.put('/updatebyID/:id',authenticateJWT, upload.single('fileURL'), updateCareer);

// Route to delete a career record by ID
router.delete('/deletebyID/:id',authenticateJWT, deleteCareer);

export default router;
