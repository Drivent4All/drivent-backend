import Joi from "joi";

export const getActivitiesSchema = Joi.object({
  day: Joi.number().max(31).min(1).required(),
  month: Joi.number().max(12).min(1).required(),
  year: Joi.number().min(2022).required(),
});

