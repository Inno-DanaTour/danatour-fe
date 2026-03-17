import { api } from "../../../configs/api";
import {
  PaymentMethod,
  PaymentMethodRequest,
  VietQRBank,
} from "../types/checkout.types";


export const paymentMethodService = {
  getAll: async (): Promise<PaymentMethod[]> => {
    return await api.get<PaymentMethod[]>("/payment-methods");
  },

  add: async (data: PaymentMethodRequest): Promise<PaymentMethod> => {
    return await api.post<PaymentMethod>("/payment-methods", data);
  },

  update: async (id: number, data: PaymentMethodRequest): Promise<PaymentMethod> => {
    return await api.put<PaymentMethod>(`/payment-methods/${id}`, data);
  },

  delete: async (id: number): Promise<string> => {
    return await api.delete<string>(`/payment-methods/${id}`);
  },

  setAsDefault: async (id: number): Promise<PaymentMethod> => {
    return await api.put<PaymentMethod>(`/payment-methods/${id}/default`);
  },

  getForBooking: async (bookingId: number): Promise<PaymentMethod> => {
    return await api.get<PaymentMethod>(`/payment-methods/booking/${bookingId}`);
  },

  getVietQRBanks: async (): Promise<VietQRBank[]> => {
    const response = await fetch("https://api.vietqr.io/v2/banks");
    const result = await response.json();
    return result.data;
  },
};
