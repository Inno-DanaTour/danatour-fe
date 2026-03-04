export interface VerifyEmailRequest {
  token: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
