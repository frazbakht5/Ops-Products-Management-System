import Joi from "joi";

export const createProductSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).required(),
  sku: Joi.string().trim().min(1).max(100).required(),
  price: Joi.number().min(0).precision(2).required(),
  inventory: Joi.number().integer().min(0).default(0),
  status: Joi.string().valid("ACTIVE", "INACTIVE").default("ACTIVE"),
  ownerId: Joi.string().uuid({ version: "uuidv4" }).required(),
});

export const updateProductSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255),
  sku: Joi.string().trim().min(1).max(100),
  price: Joi.number().min(0).precision(2),
  inventory: Joi.number().integer().min(0),
  status: Joi.string().valid("ACTIVE", "INACTIVE"),
  ownerId: Joi.string().uuid({ version: "uuidv4" }),
}).min(1);

export const productQuerySchema = Joi.object({
  name: Joi.string().trim().max(255),
  sku: Joi.string().trim().max(100),
  ownerName: Joi.string().trim().max(255),
  status: Joi.string().valid("ACTIVE", "INACTIVE"),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string().valid("name", "sku", "price", "inventory", "status").default("name"),
  sortOrder: Joi.string().valid("asc", "desc").default("asc"),
});
