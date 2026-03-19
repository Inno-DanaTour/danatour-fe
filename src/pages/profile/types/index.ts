export interface UserProfileResponse {
  id?: number;
  email: string;
  fullName: string;
  avatarUrl?: string;
  phone?: string | null;
  address?: string | null;
  bio?: string | null;
  dob?: string | null;
  gender?: string | null;
  lastLoginAt?: string | null;
  createdAt?: string;
}

export interface ChangePasswordRequest {
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface ProfileUpdateRequest {
  fullName: string;
  phone?: string | null;
  address?: string | null;
  bio?: string | null;
  avatar?: File | null;
}
