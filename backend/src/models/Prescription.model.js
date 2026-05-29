import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    clinician: { type: mongoose.Schema.Types.ObjectId, ref: "Clinician", required: true },
    diagnosis: { type: mongoose.Schema.Types.ObjectId, ref: "Diagnosis" },
    medicines: [
      {
        name: { type: String, required: true },
        dosage: { type: String, required: true },
        frequency: { type: String, required: true },
        duration: { type: String },
        notes: { type: String },
      },
    ],
    issuedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Prescription", prescriptionSchema);
