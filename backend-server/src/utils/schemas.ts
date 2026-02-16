import Joi from "joi";

export const idParamSchema = Joi.object({
  id: Joi.string().uuid({ version: "uuidv4" }).required(),
});
