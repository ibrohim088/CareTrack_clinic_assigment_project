import Joi from "joi";

export const appointmentSchema = Joi.object({
  clinician: Joi.string().required(),
  date: Joi.date().greater("now").required(),
  timeSlot: Joi.string().required(),
  reason: Joi.string().optional(),
  notes: Joi.string().optional(),
});
