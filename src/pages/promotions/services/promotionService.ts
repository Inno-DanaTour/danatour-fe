import { api } from "../../../configs/api";
import { ApiResponse, PagedResponse } from "../../../types/common";
import { PromotionRequest, PromotionResponse, PromotionUsageResponse } from "../types/promotions.types";


export const promotionService = {
    getAdminPromotions: async (page: number = 1, size: number = 10): Promise<PagedResponse<PromotionResponse>> => {
        const response = await api.get<ApiResponse<PagedResponse<PromotionResponse>>>(
            `/admin/promotions?page=${page - 1}&size=${size}`
        );
        return response.data;
    },

    getCompanyPromotions: async (page: number = 1, size: number = 10): Promise<PagedResponse<PromotionResponse>> => {
        // Note: Reusing a generic search or list endpoint if available, 
        // but for creation we have specific roles.
        // backend implementation for listing might need to be refined if not exists.
        // For now, let's assume we can list them.
        const response = await api.get<ApiResponse<PagedResponse<PromotionResponse>>>(
            `/tour-company/promotions?page=${page - 1}&size=${size}`
        );
        return response.data;
    },

    createAdminPromotion: async (data: PromotionRequest): Promise<PromotionResponse> => {
        const response = await api.post<ApiResponse<PromotionResponse>>("/admin/promotions", data);
        return response.data;
    },

    createCompanyPromotion: async (data: PromotionRequest): Promise<PromotionResponse> => {
        const response = await api.post<ApiResponse<PromotionResponse>>("/tour-company/promotions", data);
        return response.data;
    },

    updateAdminPromotion: async (id: number | string, data: PromotionRequest): Promise<PromotionResponse> => {
        const response = await api.put<ApiResponse<PromotionResponse>>(`/admin/promotions/${id}`, data);
        return response.data;
    },

    updateCompanyPromotion: async (id: number | string, data: PromotionRequest): Promise<PromotionResponse> => {
        const response = await api.put<ApiResponse<PromotionResponse>>(`/tour-company/promotions/${id}`, data);
        return response.data;
    },

    togglePromotionStatus: async (id: number | string, isActive: boolean): Promise<void> => {
        await api.patch(`/promotions/${id}/status?active=${isActive}`, {});
    },

    getPromotionById: async (id: number | string): Promise<PromotionResponse> => {
        const response = await api.get<ApiResponse<PromotionResponse>>(`/promotions/${id}`);
        return response.data;
    },

    deleteAdminPromotion: async (id: number | string): Promise<string> => {
        const response = await api.delete<ApiResponse<string>>(`/admin/promotions/${id}`);
        return response.data;
    },

    deleteCompanyPromotion: async (id: number | string): Promise<string> => {
        const response = await api.delete<ApiResponse<string>>(`/tour-company/promotions/${id}`);
        return response.data;
    },

    validatePromoCode: async (code: string, tourId?: number): Promise<PromotionResponse> => {
        const url = `/promotions/validate?code=${code}${tourId ? `&tourId=${tourId}` : ""}`;
        const response = await api.get<ApiResponse<PromotionResponse>>(url);
        return response.data;
    },

    getPromotionUsage: async (id: number | string, isAdmin: boolean = false): Promise<PromotionUsageResponse[]> => {
        const prefix = isAdmin ? "/admin" : "/tour-company";
        const response = await api.get<ApiResponse<PromotionUsageResponse[]>>(
            `${prefix}/promotions/${id}/usage`
        );
        return response.data;
    }

};
