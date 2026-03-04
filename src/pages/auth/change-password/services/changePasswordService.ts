import { api } from "../../../../configs/api";
import { API_ENDPOINT } from "../../login/constants/api"; // Let's check where the API constants are
import { ApiResponse } from "../../login/types";

// Note: Ensure the API endpoint exists in your constants, or use a hardcoded string if needed.
// According to UserController.java, the endpoint is POST /api/v1/users/password

export interface ChangePasswordRequest {
  password: string;
  confirmPassword: string;
}

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
