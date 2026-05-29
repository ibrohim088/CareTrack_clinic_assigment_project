import mongoose from "mongoose";

const timeSlotSchema = new mongoose.Schema({
  start: { type: String, required: true }, // "09:00"
  end:   { type: String, required: true }, // "10:00"
  isBooked: { type: Boolean, default: false },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment", default: null },
});

const clinicianScheduleSchema = new mongoose.Schema(
  {
    clinician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clinician",
      required: true,
    },
    date: { type: String, required: true }, // "2025-06-10" format
    timeSlots: [timeSlotSchema],
    isAvailable: { type: Boolean, default: true },
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

// Bir klinisist bir kunda faqat bitta jadval
clinicianScheduleSchema.index({ clinician: 1, date: 1 }, { unique: true });

export default mongoose.model("ClinicianSchedule", clinicianScheduleSchema);