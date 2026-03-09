import { api } from "../configs/api";
import { ApiResponse, PagedResponse } from "../types/types";

export interface BookingRequest {
  scheduleId: number;
  adults: number;
  children: number;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface BookingResponse {
  id: number;
  bookingCode: string;
  scheduleId: number;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  status: string;
  adults: number;
  children: number;
  startDate: string;
  createdAt: string;
}

export interface BookingHistoryResponse {
  id: number;
  bookingCode: string;
  tourTitle: string;
  thumbnail: string;
  startDate: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export interface CompanyBookingResponse {
  id: number;
  bookingCode: string;
  customerName: string;
  customerPhone: string;
  tourName: string;
  startDate: string;
  adults: number;
  children: number;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export interface RebookInfoResponse {
  tourId: number;
  adults: number;
  children: number;
}

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
};
