import { ProfileModel } from '../model/profileModel.js';

export const getProfiles = async (req, res) => {
  try {
    const profiles = await ProfileModel.find({ userId: req.user.id });
    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving profiles.', error: error.message });
  }
};

export const createProfile = async (req, res) => {
  const { name, dob } = req.body;

  if (!name || !dob) {
    return res.status(400).json({ message: 'Name and DOB are required.' });
  }

  try {
    const existingProfiles = await ProfileModel.find({ userId: req.user.id });
    if (existingProfiles.length >= 5) {
      return res.status(400).json({ message: 'Cannot create more than 5 profiles.' });
    }

    const profile = await ProfileModel.create({ userId: req.user.id, name, dob });
    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error creating profile.', error: error.message });
  }
};
