import { HttpError } from "./errors";
import {
  BadRequestResponse,
  NotFoundResponse,
  InternalServerResponse,
} from "./responses";
import { logger } from "../logger";
import { Request, Response, NextFunction } from "express";
export function handleError(
  res: Response,
  err: unknown,
  fallbackMessage: string,
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

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    logger.info(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        durationMs: duration,
        ip: req.ip,
      }),
    );
  });

  next();
}
