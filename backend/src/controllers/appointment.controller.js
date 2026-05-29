import Appointment from "../models/Appointment.model.js";
import Patient from "../models/Patient.model.js";
import paginate from "../utils/paginate.util.js";
import { success, error } from "../utils/response.util.js";

export const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, clinician } = req.query;
    const query = {};
    if (status) query.status = status;
    if (clinician) query.clinician = clinician;
    const result = await paginate(Appointment, query, page, limit, "patient clinician");
    return success(res, result);
  } catch (err) { error(res, err.message); }
};

export const getById = async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id).populate("patient clinician");
    if (!appt) return error(res, "Appointment not found", 404);
    return success(res, appt);
  } catch (err) { error(res, err.message); }
};

export const create = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) return error(res, "Patient profile not found", 404);

    const conflict = await Appointment.findOne({
      clinician: req.body.clinician,
      date: req.body.date,
      timeSlot: req.body.timeSlot,
      status: { $in: ["pending", "confirmed"] },
    });
    if (conflict) return error(res, "This time is busy.", 400);

    const appt = await Appointment.create({ ...req.body, patient: patient._id });
    return success(res, appt, "Appointment created", 201);
  } catch (err) { error(res, err.message); }
};

export const updateStatus = async (req, res) => {
  try {
    const appt = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!appt) return error(res, "Appointment not found", 404);
    return success(res, appt, "Status updated");
  } catch (err) { error(res, err.message); }
};

export const remove = async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    return success(res, null, "Appointment deleted");
  } catch (err) { error(res, err.message); }
};
