import Joi from "joi";

export const prescriptionSchema = Joi.object({
  patient: Joi.string().required(),
  diagnosis: Joi.string().optional(),
  medicines: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      dosage: Joi.string().required(),
      frequency: Joi.string().required(),
      duration: Joi.string().optional(),
      notes: Joi.string().optional(),
    })
  ).min(1).required(),
  expiresAt: Joi.date().optional(),
});
