import Joi from "joi";

export const createProductOwnerSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).required(),
  email: Joi.string().trim().email().required(),
  phone: Joi.string().trim().max(20).allow("", null).optional(),
});

export const updateProductOwnerSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255),
  email: Joi.string().trim().email(),
  phone: Joi.string().trim().max(20).allow("", null),
}).min(1);

export const productOwnerQuerySchema = Joi.object({
  name: Joi.string().trim().max(255),
  email: Joi.string().trim().max(255),
});
