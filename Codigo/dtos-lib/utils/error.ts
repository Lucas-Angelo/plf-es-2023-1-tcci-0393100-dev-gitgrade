export interface ErrorResponseDTO<TErrorFields extends string = string> {
  message: string;
  details?: Record<TErrorFields, { message: string; value: any } | undefined>;
  stack?: string;
}
