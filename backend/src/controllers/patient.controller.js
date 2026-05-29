import Patient from "../models/Patient.model.js";
import Diagnosis from "../models/Diagnosis.model.js";
import Prescription from "../models/Prescription.model.js";
import MedicalRecord from "../models/MedicalRecord.model.js";
import Appointment from "../models/Appointment.model.js";
import paginate from "../utils/paginate.util.js";
import { success, error } from "../utils/response.util.js";

export const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await paginate(Patient, {}, page, limit, "user");
    return success(res, result);
  } catch (err) { error(res, err.message); }
};

export const getById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate("user", "-password");
    if (!patient) return error(res, "Patient not found", 404);
    return success(res, patient);
  } catch (err) { error(res, err.message); }
};

export const create = async (req, res) => {
  try {
    const patient = await Patient.create({ ...req.body, user: req.user._id });
    return success(res, patient, "Patient created", 201);
  } catch (err) { error(res, err.message); }
};

export const update = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!patient) return error(res, "Patient not found", 404);
    return success(res, patient, "Patient updated");
  } catch (err) { error(res, err.message); }
};

export const remove = async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    return success(res, null, "Patient deleted");
  } catch (err) { error(res, err.message); }
};

export const getPatientProfile = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate("user", "-password");

    if (!patient) return error(res, "Patient not found", 404);

    const diagnoses = await Diagnosis.find({ patient: patient._id })
      .populate("clinician", "specialization licenseNumber")
      .sort({ createdAt: -1 });

    const prescriptions = await Prescription.find({ patient: patient._id })
      .populate("clinician", "specialization")
      .sort({ issuedAt: -1 });

    const medicalRecords = await MedicalRecord.find({ patient: patient._id })
      .populate("clinician", "specialization")
      .sort({ recordDate: -1 });

    const appointments = await Appointment.find({ patient: patient._id })
      .populate("clinician", "specialization")
      .sort({ date: -1 });

    return success(res, { patient, diagnoses, prescriptions, medicalRecords, appointments });
  } catch (err) {
    console.error(err);
    error(res, err.message);
  }
};
