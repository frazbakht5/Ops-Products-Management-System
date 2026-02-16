import { BaseResponse } from "../BaseResponse";

export class InternalServerResponse extends BaseResponse {
  constructor(message: string = "Internal server error") {
    super(false, 500, message);
  }
}
