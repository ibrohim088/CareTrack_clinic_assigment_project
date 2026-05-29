import crypto from "crypto";
import User from "../models/User.model.js";
import { hashPassword, comparePassword } from "../utils/bcrypt.util.js";
import { generateToken } from "../utils/jwt.util.js";
import { success, error } from "../utils/response.util.js";

export const register = async (req, res) => {
  try {
    const { fullName, email, password, phone, role } = req.body;
    if (await User.findOne({ email }))
      return error(res, "This email is already registered", 400);

    const user = await User.create({
      fullName, email, phone, role,
      password: await hashPassword(password),
    });
    const token = generateToken({ id: user._id, role: user.role });
    return success(res, { token, user: { id: user._id, fullName, email, role: user.role } },
      "Registered", 201);
  } catch (err) { error(res, err.message); }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await comparePassword(password, user.password)))
      return error(res, "Invalid email or password", 401);

    const token = generateToken({ id: user._id, role: user.role });
    return success(res, { token, user: { id: user._id, fullName: user.fullName, email, role: user.role } },
      "Logged in");
  } catch (err) { error(res, err.message); }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return error(res, "User not found", 404);

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 min
    await user.save();

    return success(res, { resetToken }, "Reset token generated");
  } catch (err) { error(res, err.message); }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return error(res, "Token invalid or expired", 400);

    user.password = await hashPassword(newPassword);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return success(res, null, "Password reset successful");
  } catch (err) { error(res, err.message); }
};

export const getMe = async (req, res) => success(res, req.user);
