import Prescription from "../models/Prescription.model.js";
import paginate from "../utils/paginate.util.js";
import { success, error } from "../utils/response.util.js";

export const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, patient } = req.query;
    const query = {};
    if (patient) query.patient = patient;
    const result = await paginate(Prescription, query, page, limit, "patient clinician diagnosis");
    return success(res, result);
  } catch (err) { error(res, err.message); }
};

export const getById = async (req, res) => {
  try {
    const presc = await Prescription.findById(req.params.id).populate("patient clinician");
    if (!presc) return error(res, "Prescription not found", 404);
    return success(res, presc);
  } catch (err) { error(res, err.message); }
};

export const create = async (req, res) => {
  try {
    const presc = await Prescription.create({ ...req.body, clinician: req.user._id });
    return success(res, presc, "Prescription created", 201);
  } catch (err) { error(res, err.message); }
};

export const remove = async (req, res) => {
  try {
    await Prescription.findByIdAndDelete(req.params.id);
    return success(res, null, "Prescription deleted");
  } catch (err) { error(res, err.message); }
};
