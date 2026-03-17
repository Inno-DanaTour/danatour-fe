import { api } from "../../../configs/api";

export interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
  total?: number;
}

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

export const profileService = {
  getMyInfo: async (): Promise<any> => {
    const res = await api.get<ApiResponse<any>>("/users/myInfo");
    return res.data;
  },

  getProfile: async (): Promise<UserProfileResponse> => {
    const res =
      await api.get<ApiResponse<UserProfileResponse>>("/users/profile");
    return res.data;
  },

  updateProfile: async (
    data: ProfileUpdateRequest,
  ): Promise<UserProfileResponse> => {
    const formData = new FormData();
    formData.append("fullName", data.fullName);
    if (data.phone) formData.append("phone", data.phone);
    if (data.address) formData.append("address", data.address);
    if (data.bio) formData.append("bio", data.bio);
    if (data.avatar) formData.append("avatar", data.avatar);

    const res = await api.putMultipart<ApiResponse<UserProfileResponse>>(
      "/users/profile",
      formData,
    );
    return res.data;
  },

  changePassword: async (data: ChangePasswordRequest): Promise<any> => {
    const res = await api.post<ApiResponse<any>>("/users/password", data);
    return res.data;
  },
};
