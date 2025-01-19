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
  emailVerified: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

export const UserModel = mongoose.model('User', userSchema);
