import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    clinician: { type: mongoose.Schema.Types.ObjectId, ref: "Clinician", required: true },
    type: { type: String, enum: ["lab", "xray", "mri", "ultrasound", "other"], required: true },
    title: { type: String, required: true },
    description: { type: String },
    fileUrl: { type: String },
    recordDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("MedicalRecord", medicalRecordSchema);
