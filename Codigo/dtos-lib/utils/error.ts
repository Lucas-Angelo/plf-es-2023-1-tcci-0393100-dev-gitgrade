export interface ErrorResponseDTO<TErrorFields extends string = string> {
  message: string;
  error?: {
    [key in TErrorFields]?: {
      message: string;
      value?: any;
    };
  }
  stack?: string;
}
