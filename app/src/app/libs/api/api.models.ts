export type ApiResponse<T> = {
  code: string;
  data: T;
  error: string;
  message?: string;
  success?: boolean;
};

export type ResponseId = {
  id: string;
};
