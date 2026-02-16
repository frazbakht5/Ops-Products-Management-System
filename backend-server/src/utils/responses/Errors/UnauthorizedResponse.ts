import { BaseResponse } from "../BaseResponse";

export class UnauthorizedResponse extends BaseResponse {
  constructor(message: string = "Unauthorized") {
    super(false, 401, message);
  }
}
