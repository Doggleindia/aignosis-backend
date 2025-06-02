import { ProfileModel } from '../model/profile.js';
import { UserModel } from '../model/userModel.js'; // Import the user model
import cloudinary from '../config/cloudinary.js';

  // Add a new profile
  export const addProfile = async (req, res) => {
    const { name, username, dob, age, email , gender } = req.body;
    const userId = req.user?.id;

    try {
      if (!userId) {
        return res.status(400).json({ message: 'User ID not found in token.' });
      }

      // Validate required fields one at a time
      if (!name || name.toString().trim() === '') {
        return res.status(400).json({ message: 'Name is required.' });
      }

      if (!username || username.toString().trim() === '') {
        return res.status(400).json({ message: 'Username is required.' });
      }

      if (!dob || dob.toString().trim() === '') {
        return res.status(400).json({ message: 'Date of birth is required.' });
      }

      if (!age || age.toString().trim() === '') {
        return res.status(400).json({ message: 'Age is required.' });
      }

      if (!email || email.toString().trim() === '') {
        return res.status(400).json({ message: 'Email is required.' });
      }

      if (!gender || gender.toString().trim() === '') {
        return res.status(400).json({ message: 'Gender is required.' });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Please provide a valid email address.' });
      }

      // Validate age is a positive number
      if (isNaN(age) || age <= 0) {
        return res.status(400).json({ message: 'Age must be a positive number.' });
      }

      // Validate date of birth
      const dobDate = new Date(dob);
      if (isNaN(dobDate.getTime())) {
        return res.status(400).json({ message: 'Please provide a valid date of birth.' });
      }

      // Check if date of birth is not in the future
      if (dobDate > new Date()) {
        return res.status(400).json({ message: 'Date of birth cannot be in the future.' });
      }

      const profileCount = await ProfileModel.countDocuments({ userId });
      if (profileCount >= 5) {
        return res.status(400).json({ message: 'Maximum of 5 profiles allowed.' });
      }

      // If profile picture is provided, upload to Cloudinary
      if (req.file) {
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
              
              // Handle MongoDB duplicate key error
              if (err.code === 11000) {
                if (err.keyPattern && err.keyPattern.username) {
                  return res.status(400).json({ message: 'Username already exists. Please choose a different username.' });
                }
                if (err.keyPattern && err.keyPattern.email) {
                  return res.status(400).json({ message: 'Email already exists. Please use a different email.' });
                }
                return res.status(400).json({ message: 'Duplicate entry found. Please check your data.' });
              }
              
              res.status(500).json({ message: 'Error creating profile.', error: err.message });
            }
          }
        ).end(req.file.buffer);
      } else {
        // Create profile without profile picture
        try {
          const profile = await ProfileModel.create({
            userId,
            name,
            username,
            dob,
            age,
            email,
            gender,
            // profilePicUrl will be undefined/null
          });

          res.status(201).json({ message: 'Profile created successfully.', profile });
        } catch (err) {
          console.error('Error creating profile:', err);
          
          // Handle MongoDB duplicate key error
          if (err.code === 11000) {
            if (err.keyPattern && err.keyPattern.username) {
              return res.status(400).json({ message: 'Username already exists. Please choose a different username.' });
            }
            if (err.keyPattern && err.keyPattern.email) {
              return res.status(400).json({ message: 'Email already exists. Please use a different email.' });
            }
            return res.status(400).json({ message: 'Duplicate entry found. Please check your data.' });
          }
          
          res.status(500).json({ message: 'Error creating profile.', error: err.message });
        }
      }
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
        // Validate required fields one at a time
        if (!name || name.toString().trim() === '') {
            return res.status(400).json({ message: 'Name is required.' });
        }

        if (!username || username.toString().trim() === '') {
            return res.status(400).json({ message: 'Username is required.' });
        }

        if (!dob || dob.toString().trim() === '') {
            return res.status(400).json({ message: 'Date of birth is required.' });
        }

        if (!age || age.toString().trim() === '') {
            return res.status(400).json({ message: 'Age is required.' });
        }

        if (!email || email.toString().trim() === '') {
            return res.status(400).json({ message: 'Email is required.' });
        }

        if (!gender || gender.toString().trim() === '') {
            return res.status(400).json({ message: 'Gender is required.' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Please provide a valid email address.' });
        }

        // Validate age is a positive number
        if (isNaN(age) || age <= 0) {
            return res.status(400).json({ message: 'Age must be a positive number.' });
        }

        // Validate date of birth
        const dobDate = new Date(dob);
        if (isNaN(dobDate.getTime())) {
            return res.status(400).json({ message: 'Please provide a valid date of birth.' });
        }

        // Check if date of birth is not in the future
        if (dobDate > new Date()) {
            return res.status(400).json({ message: 'Date of birth cannot be in the future.' });
        }

        // Prepare update data
        const updateData = {
            name,
            username,
            dob,
            age,
            gender,
            email
        };

        // If profile picture is provided, upload to Cloudinary first
        if (req.file) {
            cloudinary.uploader.upload_stream(
                { folder: 'profiles' },
                async (error, result) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error);
                        return res.status(500).json({ message: 'Error uploading to Cloudinary.', error: error.message });
                    }

                    try {
                        // Add the new profile picture URL to update data
                        updateData.profilePicUrl = result.secure_url;

                        const updatedProfile = await ProfileModel.findByIdAndUpdate(
                            id,
                            updateData,
                            { new: true } // Return the updated document
                        );

                        if (!updatedProfile) {
                            return res.status(404).json({ message: 'Profile not found' });
                        }

                        res.status(200).json({ message: 'Profile updated successfully', profile: updatedProfile });
                    } catch (err) {
                        console.error('Error updating profile:', err);
                        
                        // Handle MongoDB duplicate key error
                        if (err.code === 11000) {
                            if (err.keyPattern && err.keyPattern.username) {
                                return res.status(400).json({ message: 'Username already exists. Please choose a different username.' });
                            }
                            if (err.keyPattern && err.keyPattern.email) {
                                return res.status(400).json({ message: 'Email already exists. Please use a different email.' });
                            }
                            return res.status(400).json({ message: 'Duplicate entry found. Please check your data.' });
                        }
                        
                        res.status(500).json({ message: 'Error updating profile', error: err.message });
                    }
                }
            ).end(req.file.buffer);
        } else {
            // Update profile without changing profile picture
            const updatedProfile = await ProfileModel.findByIdAndUpdate(
                id,
                updateData,
                { new: true } // Return the updated document
            );

            if (!updatedProfile) {
                return res.status(404).json({ message: 'Profile not found' });
            }
            
            res.status(200).json({ message: 'Profile updated successfully', profile: updatedProfile });
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        
        // Handle MongoDB duplicate key error
        if (error.code === 11000) {
            if (error.keyPattern && error.keyPattern.username) {
                return res.status(400).json({ message: 'Username already exists. Please choose a different username.' });
            }
            if (error.keyPattern && error.keyPattern.email) {
                return res.status(400).json({ message: 'Email already exists. Please use a different email.' });
            }
            return res.status(400).json({ message: 'Duplicate entry found. Please check your data.' });
        }
        
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
