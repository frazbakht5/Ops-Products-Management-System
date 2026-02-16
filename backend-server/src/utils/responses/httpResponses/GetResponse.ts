import { BaseResponse } from "../BaseResponse";

export class GetResponse<T> extends BaseResponse<T> {
  constructor(data: T, message: string = "Retrieved successfully") {
    super(true, 200, message, data);
  }
}
