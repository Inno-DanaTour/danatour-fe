import { api } from "../../../../configs/api";
import { ApiResponse } from "../../../../types/common";
import { ChangePasswordRequest } from "../../types";

export const changePassword = async (
  data: ChangePasswordRequest,
): Promise<ApiResponse<any>> => {
  try {
    const res = await api.post<ApiResponse<any>>(
      "/users/password", // Using direct path assuming API base is /api/v1
      data,
    );
    if (res.code && res.code !== 200) {
      throw new Error(res.message || "Failed to change password");
    }
    return res;
  } catch (error) {
    console.error("Failed to change password", error);
    throw error;
  }
};
