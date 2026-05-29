import mongoose from "mongoose";

const diagnosisSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    clinician: { type: mongoose.Schema.Types.ObjectId, ref: "Clinician", required: true },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
    icdCode: { type: String },
    description: { type: String, required: true },
    severity: { type: String, enum: ["mild", "moderate", "severe"], default: "mild" },
    documents: [String],
  },
  { timestamps: true }
);

export default mongoose.model("Diagnosis", diagnosisSchema);
