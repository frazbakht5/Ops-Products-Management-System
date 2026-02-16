import { BaseResponse } from "../BaseResponse";
import { HTTP_STATUS_CODES } from "../../constants";

export class InternalServerResponse extends BaseResponse {
  constructor(message: string = "Internal server error") {
    super(false, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, message);
  }
}
