import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema(
  {
    // Reference to the User model
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Userd',  // Name of the user collection/model
      required: true,
    },
    name: { type: String, required: true },
    username: { type: String, required: true },
    dob: { type: Date, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true },

    gender: { type: String, required: true },
    profilePicUrl: { type: String, required: false }, // Made optional
  },
  { timestamps: true }
);

const ProfileModel = mongoose.model('Profile', ProfileSchema);
export { ProfileModel };

//to add
