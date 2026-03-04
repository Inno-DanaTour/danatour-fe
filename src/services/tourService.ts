import { api } from "../configs/api";
import {
    TourDetail,
    TourListItem,
    PagedResponse,
    CategoryResponse,
    PlaceResponse,
    ApiResponse
} from "../types/types";

export const tourService = {
    getTours: async (page: number = 1, size: number = 10, companyId?: number): Promise<PagedResponse<TourListItem>> => {
        let url = `/tours?page=${page - 1}&size=${size}`;
        if (companyId) {
            url += `&companyId=${companyId}`;
        }
        const response = await api.get<ApiResponse<PagedResponse<TourListItem>>>(url);
        return response.data;
    },

    getTourDetail: async (id: string | number): Promise<TourDetail> => {
        const response = await api.get<ApiResponse<TourDetail>>(`/tours/${id}`);
        return response.data;
    },

    createTour: async (formData: FormData): Promise<TourDetail> => {
        const response = await api.postMultipart<ApiResponse<TourDetail>>("/tours", formData);
        return response.data;
    },

    updateTour: async (id: string | number, formData: FormData): Promise<TourDetail> => {
        const response = await api.putMultipart<ApiResponse<TourDetail>>(`/tours/${id}`, formData);
        return response.data;
    },

    getCategories: async (): Promise<CategoryResponse[]> => {
        const response = await api.get<ApiResponse<CategoryResponse[]>>("/categories");
        return response.data;
    },

    getPlaces: async (): Promise<PlaceResponse[]> => {
        const response = await api.get<ApiResponse<PlaceResponse[]>>("/places");
        return response.data;
    }
};
