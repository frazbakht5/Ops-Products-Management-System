import { BaseResponse } from "../BaseResponse";

export class CreatedResponse<T> extends BaseResponse<T> {
  constructor(data: T, message: string = "Created successfully") {
    super(true, 201, message, data);
  }
}
