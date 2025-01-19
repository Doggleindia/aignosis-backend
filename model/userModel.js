import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
  },
  phoneNumber: {
    type: String, // Remove the unique: true constraint
    default: null, // Set a default value to avoid null issues
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

export const UserModel = mongoose.model('User', userSchema);
