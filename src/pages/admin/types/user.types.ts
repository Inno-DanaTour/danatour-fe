import { PagedResponse, ApiResponse } from "../../../types/common";

export interface UserProfile {
  fullName: string;
  bio?: string;
  avatarUrl?: string;
  phone?: string;
  dob?: string;
  gender?: string;
  ward?: string;
  district?: string;
  city?: string;
  province?: string;
  country?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  status: string;
  referralCode?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  profile: UserProfile;
  lastLoginAt?: string;
  lastLoginIp?: string;
  createdAt: string;
  deletedAt?: string;
}

export interface UserUpdateRequest {
  password?: string;
  profile: Partial<UserProfile>;
}

export interface UserAddRequest {
  username: string;
  email: string;
  password: string;
  profile?: Partial<UserProfile>;
}

export type UserPagedResponse = PagedResponse<UserResponse>;
export type UserApiResponse = ApiResponse<UserResponse>;
