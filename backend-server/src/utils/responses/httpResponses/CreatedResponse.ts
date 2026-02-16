import { BaseResponse } from "../BaseResponse";
import { HTTP_STATUS_CODES } from "../../constants";

export class CreatedResponse<T> extends BaseResponse<T> {
  constructor(data: T, message: string = "Created successfully") {
    super(true, HTTP_STATUS_CODES.CREATED, message, data);
  }
}
