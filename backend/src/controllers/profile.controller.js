import User from "../models/User.model.js";
import Clinician from "../models/Clinicians.model.js";
import Patient from "../models/Patient.model.js";
import ClinicianSchedule from "../models/ClinicianSchedule.model.js";
import { success, error } from "../utils/response.util.js";

// GET /api/profile/me — O'z profili (role bo'yicha to'liq ma'lumot)
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (req.user.role === "clinician") {
      const clinician = await Clinician.findOne({ user: req.user._id });
      const schedules = clinician
        ? await ClinicianSchedule.find({ clinician: clinician._id }).sort({ date: 1 }).limit(30)
        : [];
      return success(res, { user, clinician, schedules });
    }

    if (req.user.role === "patient") {
      const patient = await Patient.findOne({ user: req.user._id });
      return success(res, { user, patient });
    }

    // admin
    return success(res, { user });
  } catch (err) {
    error(res, err.message);
  }
};

// PUT /api/profile/me — O'z profilini yangilash
export const updateMyProfile = async (req, res) => {
  try {
    const { fullName, phone, avatar, ...roleData } = req.body;

    // User asosiy ma'lumotlarini yangilaish
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { fullName, phone, avatar },
      { new: true }
    ).select("-password");

    if (req.user.role === "clinician") {
      const updated = await Clinician.findOneAndUpdate(
        { user: req.user._id },
        roleData,
        { new: true }
      );
      return success(res, { user: updatedUser, clinician: updated }, "Profile updated");
    }

    if (req.user.role === "patient") {
      const updated = await Patient.findOneAndUpdate(
        { user: req.user._id },
        roleData,
        { new: true }
      );
      return success(res, { user: updatedUser, patient: updated }, "Profile updated");
    }

    return success(res, { user: updatedUser }, "Profile updated");
  } catch (err) {
    error(res, err.message);
  }
};

// GET /api/profile/clinician/:id — Biror klinisist profili (hammaga ochiq)
export const getClinicianProfile = async (req, res) => {
  try {
    const clinician = await Clinician.findById(req.params.id)
      .populate("user", "-password");
    if (!clinician) return error(res, "Clinician not found", 404);

    const schedules = await ClinicianSchedule.find({ clinician: clinician._id })
      .sort({ date: 1 })
      .limit(60);

    return success(res, { clinician, schedules });
  } catch (err) {
    error(res, err.message);
  }
};

// GET /api/profile/patient/:id — Bemor profili (admin yoki klinisist)
export const getPatientProfile = async (req, res) => {
  try {
    if (!["admin", "clinician"].includes(req.user.role)) {
      return error(res, "Access denied", 403);
    }

    const patient = await Patient.findById(req.params.id)
      .populate("user", "-password");
    if (!patient) return error(res, "Patient not found", 404);

    return success(res, { patient });
  } catch (err) {
    error(res, err.message);
  }
};