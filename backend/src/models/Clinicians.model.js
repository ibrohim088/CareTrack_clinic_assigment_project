import mongoose from "mongoose";

const cliniciansSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    specialization: { type: String, required: true },
    experience: { type: Number, default: 0 },
    education: { type: String },
    licenseNumber: { type: String, required: true, unique: true },
    workingDays: [{ type: String, enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] }],
    workingHours: {
      start: { type: String, default: "09:00" },
      end: { type: String, default: "18:00" },
    },
    roomNumber: { type: String },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Clinician", cliniciansSchema);
