import mongoose from 'mongoose';

const TherapySessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  therapyName: { type: String, required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  timing: { type: String, required: true },
  booked: { type: Boolean, default: true },
});

export const TherapySessionModel = mongoose.model('TherapySession', TherapySessionSchema);
