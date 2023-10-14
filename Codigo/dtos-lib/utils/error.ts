export interface ErrorResponseDTO<TErrorFields extends string = string> {
  message: string;
  error?: Record<TErrorFields, { message: string; value: any } | undefined>;
  stack?: string;
}
