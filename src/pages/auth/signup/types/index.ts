export interface RegisterRequest {
  email?: string;
  password?: string;
  confirmPassword?: string;
  fullName?: string;
  phone?: string;
}

export interface RegisterResponse {
  email: string;
  fullName: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
