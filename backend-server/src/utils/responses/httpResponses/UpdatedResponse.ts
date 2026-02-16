import { BaseResponse } from "../BaseResponse";
import { HTTP_STATUS_CODES } from "../../constants";

export class UpdatedResponse<T> extends BaseResponse<T> {
  constructor(data: T, message: string = "Updated successfully") {
    super(true, HTTP_STATUS_CODES.OK, message, data);
  }
}
