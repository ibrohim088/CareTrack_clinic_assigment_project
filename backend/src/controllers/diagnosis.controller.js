import Diagnosis from "../models/Diagnosis.model.js";
import paginate from "../utils/paginate.util.js";
import { success, error } from "../utils/response.util.js";

export const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, patient } = req.query;
    const query = {};
    if (patient) query.patient = patient;
    const result = await paginate(Diagnosis, query, page, limit, "patient clinician appointment");
    return success(res, result);
  } catch (err) { error(res, err.message); }
};

export const getById = async (req, res) => {
  try {
    const diag = await Diagnosis.findById(req.params.id).populate("patient clinician");
    if (!diag) return error(res, "Diagnosis not found", 404);
    return success(res, diag);
  } catch (err) { error(res, err.message); }
};

export const create = async (req, res) => {
  try {
    const files = req.files ? req.files.map((f) => f.path) : [];
    const diag = await Diagnosis.create({ ...req.body, clinician: req.user._id, documents: files });
    return success(res, diag, "Diagnosis created", 201);
  } catch (err) { error(res, err.message); }
};

export const update = async (req, res) => {
  try {
    const diag = await Diagnosis.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!diag) return error(res, "Diagnosis not found", 404);
    return success(res, diag, "Diagnosis updated");
  } catch (err) { error(res, err.message); }
};

export const remove = async (req, res) => {
  try {
    await Diagnosis.findByIdAndDelete(req.params.id);
    return success(res, null, "Diagnosis deleted");
  } catch (err) { error(res, err.message); }
};
