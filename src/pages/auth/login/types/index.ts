export interface LoginRequest {
  identifier?: string;
  password?: string;
}

export interface IntrospectResponse {
  valid: boolean;
}

export interface AuthResponse {
  token: string;
  authenticated: boolean;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
