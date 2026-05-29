import MedicalRecord from "../models/MedicalRecord.model.js";
import paginate from "../utils/paginate.util.js";
import { success, error } from "../utils/response.util.js";

export const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, patient, type } = req.query;
    const query = {};
    if (patient) query.patient = patient;
    if (type) query.type = type;
    const result = await paginate(MedicalRecord, query, page, limit, "patient clinician");
    return success(res, result);
  } catch (err) { error(res, err.message); }
};

export const getById = async (req, res) => {
  try {
    const rec = await MedicalRecord.findById(req.params.id).populate("patient clinician");
    if (!rec) return error(res, "Medical record not found", 404);
    return success(res, rec);
  } catch (err) { error(res, err.message); }
};

export const create = async (req, res) => {
  try {
    const fileUrl = req.file ? req.file.path : "";
    const rec = await MedicalRecord.create({ ...req.body, clinician: req.user._id, fileUrl });
    return success(res, rec, "Medical record created", 201);
  } catch (err) { error(res, err.message); }
};

export const remove = async (req, res) => {
  try {
    await MedicalRecord.findByIdAndDelete(req.params.id);
    return success(res, null, "Medical record deleted");
  } catch (err) { error(res, err.message); }
};
