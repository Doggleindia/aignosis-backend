import express from 'express';
import { createOffer, getOfferById, getAllOffers } from '../controller/offerController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to create a new offer
router.post('/create', verifyToken, createOffer);

// Route to get all offers
router.get('/',verifyToken, getAllOffers);

// Route to get a specific offer by ID
router.get('/:id',verifyToken, getOfferById);

export default router;
