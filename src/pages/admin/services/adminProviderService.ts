import { api } from "../../../configs/api";
import {
  ApiResponse,
  PageResponse,
  TourCompanyResponse,
  AdminProviderApplicationDetailResponse,
} from "../types/admin.types";


export const adminProviderService = {
  getProviderApplications: async (
    page: number = 0,
    size: number = 10,
    status?: string,
  ): Promise<PageResponse<TourCompanyResponse>> => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("size", size.toString());
    if (status && status !== "ALL") {
      params.append("status", status);
    }
    const res = await api.get<ApiResponse<PageResponse<TourCompanyResponse>>>(
      `/admin/provider-applications?${params.toString()}`,
    );
    return res.data;
  },

  getProviderApplicationDetail: async (
    id: number,
  ): Promise<AdminProviderApplicationDetailResponse> => {
    const res = await api.get<
      ApiResponse<AdminProviderApplicationDetailResponse>
    >(`/admin/provider-applications/${id}`);
    return res.data;
  },

  approveApplication: async (id: number): Promise<void> => {
    await api.post<ApiResponse<void>>(`/admin/tour-company/${id}/approve`, {});
  },

  rejectApplication: async (id: number, reason: string): Promise<void> => {
    await api.post<ApiResponse<void>>(`/admin/tour-company/${id}/reject`, {
      reason,
    });
  },

  updateCompanyStatus: async (id: number, status: string): Promise<void> => {
    await api.post<ApiResponse<void>>(`/admin/tour-company/${id}/status`, {
      status,
    });
  },
};
