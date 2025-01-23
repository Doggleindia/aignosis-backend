import offerModel from '../model/offerModel.js';

// Create a new offer record
export const createOffer = async (req, res) => {
  try {
    const { name, phoneNumber } = req.body;

    // Create a new offer document
    const offer = new offerModel({
      name,
      phoneNumber,
    });

    // Save the offer to the database
    await offer.save();
    if (!res.headersSent) {
      res.status(201).json({ message: 'Offer created successfully', offer });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all offers
export const getAllOffers = async (req, res) => {
  try {
    const offers = await offerModel.find();
    res.status(200).json(offers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a specific offer by ID
export const getOfferById = async (req, res) => {
  try {
    const offer = await offerModel.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    res.status(200).json(offer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
