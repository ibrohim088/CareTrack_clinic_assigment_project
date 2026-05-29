import Clinicians from "../models/Clinicians.model.js";
import paginate from "../utils/paginate.util.js";
import { success, error } from "../utils/response.util.js";

export const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, specialization } = req.query;
    const query = {};
    if (specialization) query.specialization = new RegExp(specialization, "i");
    const result = await paginate(Clinicians, query, page, limit, "user");
    return success(res, result);
  } catch (err) { error(res, err.message); }
};

export const getById = async (req, res) => {
  try {
    const doc = await Clinicians.findById(req.params.id).populate("user", "-password");
    if (!doc) return error(res, "Clinicians not found", 404);
    return success(res, doc);
  } catch (err) { error(res, err.message); }
};

export const create = async (req, res) => {
  try {
    const doc = await Clinicians.create({ ...req.body, user: req.user._id });
    return success(res, doc, "Clinicians created", 201);
  } catch (err) { error(res, err.message); }
};

export const update = async (req, res) => {
  try {
    const doc = await Clinicians.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doc) return error(res, "Clinicians not found", 404);
    return success(res, doc, "Clinicians updated");
  } catch (err) { error(res, err.message); }
};

export const remove = async (req, res) => {
  try {
    await Clinicians.findByIdAndDelete(req.params.id);
    return success(res, null, "Clinicians deleted");
  } catch (err) { error(res, err.message); }
};
