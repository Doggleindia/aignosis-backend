import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    phoneNumber: { type: String, required: true, unique: true }, // Unique phone number
    createdAt: { type: Date, default: Date.now }, // Timestamp of user creation
  },
  { timestamps: true }
);

export const UserModel = mongoose.model('User', userSchema);
