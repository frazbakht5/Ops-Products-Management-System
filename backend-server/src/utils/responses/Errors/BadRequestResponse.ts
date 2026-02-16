import { BaseResponse } from "../BaseResponse";

export class BadRequestResponse extends BaseResponse {
  constructor(message: string = "Bad request") {
    super(false, 400, message);
  }
}
