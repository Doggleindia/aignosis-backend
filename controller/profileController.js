  import { ProfileModel } from '../model/profileModel.js';
  import { UserModel } from '../model/userModel.js'; // Import the user model
  import cloudinary from '../config/cloudinary.js';

  // Add a new profile
  export const addProfile = async (req, res) => {
    const { name, username, dob, age, email , gender } = req.body;
    const userId = req.user?.id;

    if (!req.file) {
      return res.status(400).json({ message: 'Profile picture is required.' });
    }

    try {
      if (!userId) {
        return res.status(400).json({ message: 'User ID not found in token.' });
      }

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
              userId,
              name,
              username,
              dob,
              age,
              email,
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
      const profiles = await ProfileModel.find({ userId }).populate('userId', 'name email'); // Populate user fields
      res.status(200).json({ profiles });
    } catch (error) {
      console.error('Error fetching profiles:', error);
      res.status(500).json({ message: 'Error fetching profiles.', error: error.message });
    }
  };

  // Update a profile
  export const updateProfile = async (req, res) => {
    const { id } = req.params; // Profile ID from the URL
    const { name, username, dob, age, gender, email } = req.body; // Fields to update
    const userId = req.user?.id; // Get userId from the authenticated user's token

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    try {
        const updatedProfile = await ProfileModel.findByIdAndUpdate(
            id,
            { 
                userId,  // Include userId in the update
                name, 
                username, 
                dob, 
                age, 
                gender,
                email 
            },
            { new: true } // Return the updated document
        );

        if (!updatedProfile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.status(200).json({ message: 'Profile updated successfully', profile: updatedProfile });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
  };


  // Delete a profile
  export const deleteProfile = async (req, res) => {
    const { id } = req.params; // Get profile ID from params

    try {
      const profile = await ProfileModel.findByIdAndDelete(id);

      if (!profile) {
        return res.status(404).json({ message: 'Profile not found.' });
      }

      res.status(200).json({ message: 'Profile deleted successfully.' });
    } catch (error) {
      console.error('Error deleting profile:', error);
      res.status(500).json({ message: 'Error deleting profile.', error: error.message });
    }
  };
