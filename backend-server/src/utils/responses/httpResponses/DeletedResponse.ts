import { BaseResponse } from "../BaseResponse";
import { HTTP_STATUS_CODES } from "../../constants";

export class DeletedResponse extends BaseResponse {
  constructor(message: string = "Deleted successfully") {
    super(true, HTTP_STATUS_CODES.OK, message);
  }
}
