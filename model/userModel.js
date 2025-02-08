import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
  },
  phoneNumberVerified: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

export const UserModel = mongoose.model('Userd', userSchema);
