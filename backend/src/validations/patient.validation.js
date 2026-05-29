import Joi from "joi";

export const patientSchema = Joi.object({
  dateOfBirth: Joi.date().optional(),
  gender: Joi.string().valid("male", "female", "other").optional(),
  bloodType: Joi.string().valid("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-").optional(),
  allergies: Joi.array().items(Joi.string()).optional(),
  address: Joi.string().optional(),
  emergencyContact: Joi.object({
    name: Joi.string(),
    phone: Joi.string(),
  }).optional(),
  insuranceNumber: Joi.string().optional(),
});
