import Joi from "joi";

export const registerSchema = Joi.object({
  fullName: Joi.string().min(3).max(60).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().optional(),
  role: Joi.string().valid("admin", "clinician", "receptionist", "patient").optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
