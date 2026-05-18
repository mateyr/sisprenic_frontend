export type ApiMessage = {
  code: string;
  message: string;
}

export type ApiResponse<T> = {
  data: T;
  messages?: ApiMessage[];
}