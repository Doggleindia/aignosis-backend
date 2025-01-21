import mongoose from 'mongoose';

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  availableTimings: [String], // Array of available timing slots
});

export const DoctorModel = mongoose.model('Doctor', DoctorSchema);
