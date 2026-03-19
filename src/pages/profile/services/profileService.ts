import { api } from "../../../configs/api";
import { ApiResponse } from "../../../types/common";
import { UserProfileResponse, ChangePasswordRequest, ProfileUpdateRequest } from "../types";

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
