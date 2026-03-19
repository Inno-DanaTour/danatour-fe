import { api } from "../../../../configs/api";
import { API_ENDPOINT } from "../constants/api";
import { ApiResponse } from "../../../../types/common";

export const verifyEmail = async (token: string): Promise<ApiResponse<any>> => {
  try {
    const res = await api.get<ApiResponse<any>>(
      `${API_ENDPOINT.VERIFY_EMAIL}?token=${token}`,
    );
    if (res.code && res.code !== 200) {
      throw new Error(`Error verifyEmail: ${res.message}`);
    }
    return res;
  } catch (error) {
    console.error("Failed to verify email", error);
    throw error;
  }
};

export const resendVerification = async (
  email: string,
): Promise<ApiResponse<any>> => {
  try {
    const res = await api.post<ApiResponse<any>>(
      `${API_ENDPOINT.RESEND_VERIFICATION}?email=${email}`,
      {},
    );
    if (res.code && res.code !== 200) {
      throw new Error(`Error resendVerification: ${res.message}`);
    }
    return res;
  } catch (error) {
    console.error("Failed to resend verification email", error);
    throw error;
  }
};
