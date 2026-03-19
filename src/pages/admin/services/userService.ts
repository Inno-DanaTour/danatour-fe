import { api } from "../../../configs/api";
import { ApiResponse } from "../../../types/common";
import { UserPagedResponse, UserResponse, UserUpdateRequest, UserAddRequest } from "../types/user.types";

export const userService = {
  getUsers: async (page: number = 0, size: number = 10, sortBy?: string): Promise<UserPagedResponse> => {
    let url = `/users?page=${page}&size=${size}`;
    if (sortBy) url += `&sortBy=${sortBy}`;
    
    const response = await api.get<ApiResponse<UserPagedResponse>>(url);
    return response.data;
  },

  getUserById: async (id: number): Promise<UserResponse> => {
    const response = await api.get<ApiResponse<UserResponse>>(`/users/${id}`);
    return response.data;
  },

  createUser: async (data: UserAddRequest): Promise<UserResponse> => {
    const response = await api.post<ApiResponse<UserResponse>>("/users", data);
    return response.data;
  },

  updateUser: async (id: number, data: UserUpdateRequest): Promise<UserResponse> => {
    const response = await api.put<ApiResponse<UserResponse>>(`/users/${id}/update`, data);
    return response.data;
  },

  deleteUser: async (id: number): Promise<void> => {
    await api.put<ApiResponse<any>>(`/users/${id}/delete`, {});
  }
};
