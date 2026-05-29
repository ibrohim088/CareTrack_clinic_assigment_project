import ClinicianSchedule from "../models/ClinicianSchedule.model.js";
import Clinician from "../models/Clinicians.model.js";
import { success, error } from "../utils/response.util.js";

// GET /api/schedules — Barcha jadvallar (admin ko'radi, yoki clinicianId bo'yicha filter)
export const getAll = async (req, res) => {
  try {
    const { clinicianId, month, year } = req.query;
    const query = {};

    if (clinicianId) query.clinician = clinicianId;

    if (month && year) {
      const pad = String(month).padStart(2, "0");
      query.date = { $regex: `^${year}-${pad}` };
    }

    const schedules = await ClinicianSchedule.find(query)
      .populate({
        path: "clinician",
        populate: { path: "user", select: "fullName email avatar" },
      })
      .sort({ date: 1 });

    return success(res, schedules);
  } catch (err) {
    error(res, err.message);
  }
};

// GET /api/schedules/my — O'z jadvali (clinician uchun)
export const getMy = async (req, res) => {
  try {
    const clinician = await Clinician.findOne({ user: req.user._id });
    if (!clinician) return error(res, "Clinician profile not found", 404);

    const { month, year } = req.query;
    const query = { clinician: clinician._id };

    if (month && year) {
      const pad = String(month).padStart(2, "0");
      query.date = { $regex: `^${year}-${pad}` };
    }

    const schedules = await ClinicianSchedule.find(query).sort({ date: 1 });
    return success(res, schedules);
  } catch (err) {
    error(res, err.message);
  }
};

// GET /api/schedules/:id — Bitta jadval
export const getById = async (req, res) => {
  try {
    const schedule = await ClinicianSchedule.findById(req.params.id).populate({
      path: "clinician",
      populate: { path: "user", select: "fullName email avatar" },
    });
    if (!schedule) return error(res, "Schedule not found", 404);
    return success(res, schedule);
  } catch (err) {
    error(res, err.message);
  }
};

// POST /api/schedules — Yangi jadval yaratish (clinician o'zi)
export const create = async (req, res) => {
  try {
    const { date, timeSlots, isAvailable, note } = req.body;

    // Clinician profilini topish
    const clinician = await Clinician.findOne({ user: req.user._id });
    if (!clinician) return error(res, "Clinician profile not found", 404);

    // Shu kunda jadval bor-yo'qligini tekshirish
    const existing = await ClinicianSchedule.findOne({
      clinician: clinician._id,
      date,
    });
    if (existing) return error(res, "Schedule already exists for this date. Use update instead.", 400);

    const schedule = await ClinicianSchedule.create({
      clinician: clinician._id,
      date,
      timeSlots: timeSlots || [],
      isAvailable: isAvailable ?? true,
      note: note || "",
    });

    return success(res, schedule, "Schedule created", 201);
  } catch (err) {
    error(res, err.message);
  }
};

// PUT /api/schedules/:id — Jadvalni yangilash (clinician o'zi yoki admin)
export const update = async (req, res) => {
  try {
    const schedule = await ClinicianSchedule.findById(req.params.id).populate("clinician");
    if (!schedule) return error(res, "Schedule not found", 404);

    // Faqat o'z jadvalini yoki admin yangilay oladi
    if (req.user.role !== "admin") {
      const clinician = await Clinician.findOne({ user: req.user._id });
      if (!clinician || schedule.clinician._id.toString() !== clinician._id.toString()) {
        return error(res, "Access denied: not your schedule", 403);
      }
    }

    const updated = await ClinicianSchedule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return success(res, updated, "Schedule updated");
  } catch (err) {
    error(res, err.message);
  }
};

// DELETE /api/schedules/:id — Jadvalni o'chirish (clinician o'zi yoki admin)
export const remove = async (req, res) => {
  try {
    const schedule = await ClinicianSchedule.findById(req.params.id).populate("clinician");
    if (!schedule) return error(res, "Schedule not found", 404);

    if (req.user.role !== "admin") {
      const clinician = await Clinician.findOne({ user: req.user._id });
      if (!clinician || schedule.clinician._id.toString() !== clinician._id.toString()) {
        return error(res, "Access denied: not your schedule", 403);
      }
    }

    await ClinicianSchedule.findByIdAndDelete(req.params.id);
    return success(res, null, "Schedule deleted");
  } catch (err) {
    error(res, err.message);
  }
};