import { Response } from "express";
import { HttpError } from "./errors";
import {
  BadRequestResponse,
  NotFoundResponse,
  InternalServerResponse,
} from "./responses";

export function handleError(
  res: Response,
  err: unknown,
  fallbackMessage: string
) {
  if (err instanceof HttpError) {
    const statusCode = err.statusCode;
    let response;
    switch (statusCode) {
      case 400:
        response = new BadRequestResponse(err.message);
        break;
      case 404:
        response = new NotFoundResponse(err.message);
        break;
      default:
        response = new InternalServerResponse(err.message);
    }
    return res.status(response.statusCode).json(response);
  }
  const response = new InternalServerResponse(fallbackMessage);
  return res.status(response.statusCode).json(response);
}
