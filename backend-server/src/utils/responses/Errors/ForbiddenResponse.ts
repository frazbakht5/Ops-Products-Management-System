import { BaseResponse } from "../BaseResponse";
import { HTTP_STATUS_CODES } from "../../constants";

export class ForbiddenResponse extends BaseResponse {
  constructor(message: string = "Forbidden") {
    super(false, HTTP_STATUS_CODES.FORBIDDEN, message);
  }
}
