import { api } from "../configs/api";

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
  createdAt: string;
}

export const bookingService = {
  createBooking: (data: BookingRequest): Promise<BookingResponse> => {
    return api.post<BookingResponse>('/bookings', data);
  },

  cancelBooking: (id: number): Promise<BookingResponse> => {
    return api.put<BookingResponse>(`/bookings/${id}/cancel`);
  },

  getBooking: (id: number): Promise<BookingResponse> => {
    return api.get<BookingResponse>(`/bookings/${id}`);
  },

  getAllBookings: (): Promise<BookingResponse[]> => {
    return api.get<BookingResponse[]>('/bookings');
  },
};
