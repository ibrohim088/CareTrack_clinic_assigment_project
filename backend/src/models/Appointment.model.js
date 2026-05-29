import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    clinician: { type: mongoose.Schema.Types.ObjectId, ref: "Clinician", required: true },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    reason: { type: String },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);
