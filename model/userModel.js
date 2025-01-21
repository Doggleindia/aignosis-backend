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

const UserModel = mongoose.model('users', userSchema);
export { UserModel };
