import dayjs from "dayjs";
import Joi from "joi";

export const createActivitesSchema = Joi.object({
  day: Joi.number().max(31).min(1),
  month: Joi.number().max(12).min(1),
  year: Joi.number().min(2022),
});
