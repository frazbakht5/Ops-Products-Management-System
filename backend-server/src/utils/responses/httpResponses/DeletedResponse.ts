import { BaseResponse } from "../BaseResponse";

export class DeletedResponse extends BaseResponse {
  constructor(message: string = "Deleted successfully") {
    super(true, 200, message);
  }
}
