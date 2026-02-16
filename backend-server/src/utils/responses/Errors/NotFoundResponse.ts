import { BaseResponse } from "../BaseResponse";

export class NotFoundResponse extends BaseResponse {
  constructor(message: string = "Not found") {
    super(false, 404, message);
  }
}
