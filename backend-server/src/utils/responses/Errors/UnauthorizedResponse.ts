import { BaseResponse } from "../BaseResponse";
import { HTTP_STATUS_CODES } from "../../constants";

export class UnauthorizedResponse extends BaseResponse {
  constructor(message: string = "Unauthorized") {
    super(false, HTTP_STATUS_CODES.UNAUTHORIZED, message);
  }
}
