import Joi from "joi";

export const createProductSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).required(),
  sku: Joi.string().trim().min(1).max(100).required(),
  price: Joi.number().min(0).precision(2).required(),
  inventory: Joi.number().integer().min(0).default(0),
  status: Joi.string().valid("ACTIVE", "INACTIVE").default("ACTIVE"),
  ownerId: Joi.string().uuid({ version: "uuidv4" }).optional(),
});

export const updateProductSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255),
  sku: Joi.string().trim().min(1).max(100),
  price: Joi.number().min(0).precision(2),
  inventory: Joi.number().integer().min(0),
  status: Joi.string().valid("ACTIVE", "INACTIVE"),
  ownerId: Joi.string().uuid({ version: "uuidv4" }).allow(null),
}).min(1);

export const productQuerySchema = Joi.object({
  name: Joi.string().trim().max(255),
  sku: Joi.string().trim().max(100),
  status: Joi.string().valid("ACTIVE", "INACTIVE"),
});
