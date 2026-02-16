import { BaseResponse } from "../BaseResponse";
import { HTTP_STATUS_CODES } from "../../constants";

export class BadRequestResponse extends BaseResponse {
  constructor(message: string = "Bad request") {
    super(false, HTTP_STATUS_CODES.BAD_REQUEST, message);
  }
}
