import { BaseResponse } from "../BaseResponse";

export class UpdatedResponse<T> extends BaseResponse<T> {
  constructor(data: T, message: string = "Updated successfully") {
    super(true, 200, message, data);
  }
}
