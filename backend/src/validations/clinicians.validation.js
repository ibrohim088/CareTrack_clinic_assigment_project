import Joi from "joi";

export const cliniciansSchema = Joi.object({
  specialization: Joi.string().required(),
  experience: Joi.number().min(0).optional(),
  education: Joi.string().optional(),
  licenseNumber: Joi.string().required(),
  workingDays: Joi.array().items(Joi.string().valid("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun")).optional(),
  workingHours: Joi.object({
    start: Joi.string(),
    end: Joi.string(),
  }).optional(),
  roomNumber: Joi.string().optional(),
});
