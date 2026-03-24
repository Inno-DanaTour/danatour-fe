import { api } from "../configs/api";
import { ApiResponse } from "../types/types";

export interface RefundRequest {
  id: number;
  bookingId: number;
  userId: number;
  amount: number;
  reason: string;
  bankBin: string;
  bankShortName: string;
  bankAccountNumber: string;
  bankAccountName: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface RefundDetailResponse extends RefundRequest {
  vietQrUrl: string;
  vietQrString: string;
}

export const refundService = {
  requestRefund: async (bookingId: number, paymentMethodId: number, reason?: string) => {
    const params = new URLSearchParams();
    params.append("bookingId", String(bookingId));
    params.append("paymentMethodId", String(paymentMethodId));
    if (reason && reason.trim()) {
      params.append("reason", reason.trim());
    }

    const response = await api.post<ApiResponse<RefundRequest>>(`/refunds/request?${params.toString()}`, null);
    return response.data;
  },

  getMyRefunds: async (): Promise<RefundRequest[]> => {
    const response = await api.get<ApiResponse<RefundRequest[]>>("/refunds/my");
    return response.data;
  },

  getPendingRefunds: async (): Promise<RefundRequest[]> => {
    const response = await api.get<ApiResponse<RefundRequest[]>>("/refunds/pending");
    return response.data;
  },

  getRefundDetails: async (id: number): Promise<RefundDetailResponse> => {
    const response = await api.get<ApiResponse<RefundDetailResponse>>(`/refunds/${id}`);
    return response.data;
  },

  completeRefund: async (id: number): Promise<RefundRequest> => {
    const response = await api.post<ApiResponse<RefundRequest>>(`/refunds/${id}/complete`, null);
    return response.data;
  },
};
