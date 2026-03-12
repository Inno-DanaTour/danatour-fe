import { api } from "../configs/api";

export interface PaymentMethod {
  id: number;
  userId: number;
  provider: string;
  maskedNumber: string;
  bankBin?: string;
  bankShortName?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
  isDefault: boolean;
  status: string;
}

export interface PaymentMethodRequest {
  provider: string;
  cardNumber?: string;
  bankBin?: string;
  bankShortName?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
}

export interface VietQRBank {
  id: number;
  name: string;
  code: string;
  bin: string;
  shortName: string;
  logo: string;
  transferSupported: number;
  lookupSupported: number;
}

export const paymentMethodService = {
  getAll: async (): Promise<PaymentMethod[]> => {
    return await api.get<PaymentMethod[]>("/payment-methods");
  },

  add: async (data: PaymentMethodRequest): Promise<PaymentMethod> => {
    return await api.post<PaymentMethod>("/payment-methods", data);
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
