import Joi from "joi";

export const diagnosisSchema = Joi.object({
  patient: Joi.string().required(),
  appointment: Joi.string().optional(),
  icdCode: Joi.string().optional(),
  description: Joi.string().required(),
  severity: Joi.string().valid("mild", "moderate", "severe").optional(),
});
