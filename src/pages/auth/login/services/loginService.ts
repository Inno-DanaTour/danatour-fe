import { api } from "../../../../configs/api";
import { API_ENDPOINT } from "../constants/api";
import { LoginRequest, AuthResponse, ApiResponse } from "../types";

export const login = async (
  data: LoginRequest,
): Promise<ApiResponse<AuthResponse>> => {
  try {
    const res = await api.post<ApiResponse<AuthResponse>>(
      API_ENDPOINT.LOGIN,
      data,
    );
    if (res.code && res.code !== 200) {
      throw new Error(`Error login: ${res.message}`);
    }
    return res;
  } catch (error) {
    console.error("Failed to login", error);
    throw error;
  }
};

export const logout = async (token: string, refreshToken?: string): Promise<ApiResponse<any>> => {
  try {
    const res = await api.post<ApiResponse<any>>(API_ENDPOINT.LOGOUT, {
      token,
      refreshToken,
    });
    if (res.code && res.code !== 200) {
      throw new Error(`Error logout: ${res.message}`);
    }
    return res;
  } catch (error) {
    console.error("Failed to logout", error);
    throw error;
  }
};
export const refreshToken = async (
  token: string,
): Promise<ApiResponse<AuthResponse>> => {
  try {
    const res = await api.post<ApiResponse<AuthResponse>>(
      API_ENDPOINT.REFRESH_TOKEN,
      {
        token,
      },
    );
    if (res.code && res.code !== 200) {
      throw new Error(`Error refreshing token: ${res.message}`);
    }
    return res;
  } catch (error) {
    console.error("Failed to refresh token", error);
    throw error;
  }
};
