import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { BadRequestResponse } from "./responses";

type RequestProperty = "body" | "query" | "params";

export function validate(
  schema: Joi.ObjectSchema,
  property: RequestProperty = "body"
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map((d) => d.message);
      const response = new BadRequestResponse(
        `Validation failed: ${details.join(", ")}`
      );
      return res.status(response.statusCode).json(response);
    }

    if (property === "body") {
      req.body = value;
    }

    next();
  };
}
