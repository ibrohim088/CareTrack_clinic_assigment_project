import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String },
    role: { type: String, enum: ["admin", "clinician", "receptionist", "patient"], default: "patient" },
    avatar: { type: String, default: "" },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
