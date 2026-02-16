export interface BaseApiResponse<T = undefined> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
}
