import { api } from "../../../configs/api";
import { ApiResponse, PagedResponse } from "../../../types/types";
import {
  BookingRequest,
  BookingResponse,
  CompanyBookingResponse,
  RebookInfoResponse,
} from "../types/checkout.types";
import { BookingHistoryResponse } from "../../my-bookings/types/my-bookings.types";



export const bookingService = {
  getRebookInfo: (id: number): Promise<RebookInfoResponse> => {
    return api.get<RebookInfoResponse>(`/bookings/${id}/rebook-info`);
  },

  createBooking: (data: BookingRequest): Promise<BookingResponse> => {
    return api.post<BookingResponse>("/bookings", data);
  },

  cancelBooking: (id: number): Promise<BookingResponse> => {
    return api.put<BookingResponse>(`/bookings/${id}/cancel`);
  },

  getBooking: (id: number): Promise<BookingResponse> => {
    return api.get<BookingResponse>(`/bookings/${id}`);
  },

  getAllBookings: (): Promise<BookingResponse[]> => {
    return api.get<BookingResponse[]>("/bookings");
  },

  getMyBookings: async (params: {
    status?: string;
    page?: number;
    size?: number;
    sort?: string;
  }): Promise<PagedResponse<BookingHistoryResponse>> => {
    const response = await api.get<
      ApiResponse<PagedResponse<BookingHistoryResponse>>
    >("/users/me/bookings", {
      params: {
        ...params,
        page: params.page ? params.page - 1 : 0,
        size: params.size || 10,
      },
    });
    return response.data;
  },

  getCompanyBookings: async (params: {
    tourName?: string;
    startDateFrom?: string;
    startDateTo?: string;
    status?: string;
    search?: string;
    page?: number;
    size?: number;
  }): Promise<PagedResponse<CompanyBookingResponse>> => {
    const response = await api.get<
      ApiResponse<PagedResponse<CompanyBookingResponse>>
    >("/tour-company/bookings", {
      params: { ...params, page: params.page || 1, size: params.size || 10 },
    });
    return response.data;
  },

  updateBookingStatus: (id: number, status: string): Promise<BookingResponse> => {
    return api.patch<BookingResponse>(`/tour-company/bookings/${id}/status`, null, {
      params: { status }
    });
  },

  submitFeedback: (bookingId: number, rating: number, comment: string): Promise<ApiResponse<any>> => {
    return api.post<ApiResponse<any>>(`/users/me/bookings/${bookingId}/feedbacks`, {
      rating,
      comment
    });
  },

  checkActiveBooking: (scheduleId: number): Promise<boolean> => {
    return api.get<boolean>(`/bookings/check-active/${scheduleId}`);
  }
};
