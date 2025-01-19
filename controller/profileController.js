import { ProfileModel } from '../model/ProfileModel.js';
import cloudinary from '../config/cloudinary.js';

// Add a new profile
export const addProfile = async (req, res) => {
  const { name, username, dob, age, gender } = req.body;
  const userId = req.user?.id;  // Extract the user ID from the token

  
  if (!req.file) {
    return res.status(400).json({ message: 'Profile picture is required.' });
  }

  try {
    const profileCount = await ProfileModel.countDocuments({ userId });
    if (profileCount >= 5) {
      return res.status(400).json({ message: 'Maximum of 5 profiles allowed.' });
    }

    cloudinary.uploader.upload_stream(
      { folder: 'profiles' },
      async (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ message: 'Error uploading to Cloudinary.', error: error.message });
        }

        try {
          const profile = await ProfileModel.create({
            userId,  // Store the user ID as ObjectId reference
            name,
            username,
            dob,
            age,
            gender,
            profilePicUrl: result.secure_url,
          });

          res.status(201).json({ message: 'Profile created successfully.', profile });
        } catch (err) {
          console.error('Error creating profile:', err);
          res.status(500).json({ message: 'Error creating profile.', error: err.message });
        }
      }
    ).end(req.file.buffer);
  } catch (error) {
    console.error('Error adding profile:', error);
    res.status(500).json({ message: 'Error adding profile.', error: error.message });
  }
};


// Fetch profiles for a user
export const getProfiles = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required.' });
  }

  try {
    const profiles = await ProfileModel.find({ userId }).populate('userId');  // Populate user details
    res.status(200).json({ profiles });
  } catch (error) {
    console.error('Error fetching profiles:', error);
    res.status(500).json({ message: 'Error fetching profiles.', error: error.message });
  }
};

