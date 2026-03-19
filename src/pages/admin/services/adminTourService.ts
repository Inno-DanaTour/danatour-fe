import { api } from "../../../configs/api";
import { ApiResponse } from "../../../types/common";
import { TourDetail, TourListItem, TourStatusUpdateRequest } from "../../tours/types";
import { PageResponse } from "../types";

export const adminTourService = {
  getTours: async (page: number = 0, size: number = 10, status?: string): Promise<PageResponse<TourListItem>> => {
    let url = `/admin/tours?page=${page}&size=${size}`;
    if (status && status !== "ALL") {
      url += `&status=${status}`;
    }
    const response = await api.get<ApiResponse<PageResponse<TourListItem>>>(url);
    return response.data;
  },

  getTourDetail: async (id: number | string): Promise<TourDetail> => {
    // Note: Admin might need a specific detail endpoint, but using general one for now if it works
    const response = await api.get<ApiResponse<TourDetail>>(`/tours/${id}`);
    return response.data;
  },

  approveTour: async (id: number | string): Promise<TourDetail> => {
    const response = await api.put<ApiResponse<TourDetail>>(`/admin/tours/${id}/approve`);
    return response.data;
  },

  rejectTour: async (id: number | string, rejectReason: string): Promise<TourDetail> => {
    const response = await api.put<ApiResponse<TourDetail>>(`/admin/tours/${id}/reject`, { rejectReason });
    return response.data;
  }
};
