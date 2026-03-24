import { api } from "../../../../configs/api";
import { API_ENDPOINT } from "../constants/api";
import { ApiResponse } from "../../../../types/common";
import { RegisterRequest, RegisterResponse } from "../../types";

export const register = async (
  data: RegisterRequest,
): Promise<ApiResponse<RegisterResponse>> => {
  try {
    const res = await api.post<ApiResponse<RegisterResponse>>(
      API_ENDPOINT.REGISTER,
      data,
    );
    if (res.code && res.code !== 200 && res.code !== 201) {
      throw new Error(`Error register: ${res.message}`);
    }
    return res;
  } catch (error) {
    console.error("Failed to register", error);
    throw error;
  }
};
