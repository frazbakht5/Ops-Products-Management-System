import { BaseResponse } from "../BaseResponse";

export class ForbiddenResponse extends BaseResponse {
  constructor(message: string = "Forbidden") {
    super(false, 403, message);
  }
}
