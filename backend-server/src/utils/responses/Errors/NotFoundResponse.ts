import { BaseResponse } from "../BaseResponse";
import { HTTP_STATUS_CODES } from "../../constants";

export class NotFoundResponse extends BaseResponse {
  constructor(message: string = "Not found") {
    super(false, HTTP_STATUS_CODES.NOT_FOUND, message);
  }
}
