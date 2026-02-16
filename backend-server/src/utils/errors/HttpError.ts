import { HTTP_STATUS_CODES } from "../constants";

export class HttpError extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string = "Bad request") {
    super(HTTP_STATUS_CODES.BAD_REQUEST, message);
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string = "Not found") {
    super(HTTP_STATUS_CODES.NOT_FOUND, message);
  }
}

export class ConflictError extends HttpError {
  constructor(message: string = "Conflict") {
    super(HTTP_STATUS_CODES.CONFLICT ?? 409, message);
  }
}

export class InternalServerError extends HttpError {
  constructor(message: string = "Internal server error") {
    super(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, message);
  }
}
