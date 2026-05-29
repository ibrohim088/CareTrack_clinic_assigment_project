import User from "../models/User.model.js";
import paginate from "../utils/paginate.util.js";
import { success, error } from "../utils/response.util.js";

export const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await paginate(User, {}, page, limit);
    return success(res, result);
  } catch (err) { error(res, err.message); }
};

export const getById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return error(res, "User not found", 404);
    return success(res, user);
  } catch (err) { error(res, err.message); }
};

export const update = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
    if (!user) return error(res, "User not found", 404);
    return success(res, user, "User updated");
  } catch (err) { error(res, err.message); }
};

export const remove = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    return success(res, null, "User deleted");
  } catch (err) { error(res, err.message); }
};
