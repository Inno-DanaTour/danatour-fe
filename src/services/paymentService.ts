import { api } from "../configs/api";

export const paymentService = {
  createPaymentUrl: async (bookingId: number): Promise<string> => {
    const response = await api.post<{ paymentUrl: string }>(
      `/payments/create-url?bookingId=${bookingId}`,
      {},
    );
    return response.paymentUrl;
  },

  getPaymentStatus: async (bookingId: number): Promise<string> => {
    const response = await api.get<{ status: string }>(
      `/payments/status/${bookingId}`,
    );
    return response.status;
  },
};
