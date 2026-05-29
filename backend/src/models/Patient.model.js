import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ["male", "female", "other"] },
    bloodType: { type: String, enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] },
    allergies: [String],
    address: { type: String },
    emergencyContact: {
      name: { type: String },
      phone: { type: String },
    },
    insuranceNumber: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Patient", patientSchema);
