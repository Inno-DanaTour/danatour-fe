import { api } from "../../../configs/api";
import {
    TourDetail,
    TourListItem,
    PagedResponse,
    CategoryResponse,
    PlaceResponse,
    ApiResponse
} from "../../../types/types";

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
    },

    searchTours: async (
        page: number = 1,
        size: number = 10,
        filters?: {
            keyword?: string;
            minPrice?: number;
            maxPrice?: number;
            zone?: string;
            categoryId?: number;
            minDuration?: number;
            maxDuration?: number;
            sort?: string;
        }
    ): Promise<PagedResponse<import("../../../types/types").TourSummaryResponse>> => {
        let url = `/tours/search?page=${page - 1}&size=${size}`;
        if (filters?.keyword) url += `&keyword=${encodeURIComponent(filters.keyword)}`;
        if (filters?.minPrice) url += `&minPrice=${filters.minPrice}`;
        if (filters?.maxPrice) url += `&maxPrice=${filters.maxPrice}`;
        if (filters?.zone) url += `&zone=${encodeURIComponent(filters.zone)}`;
        if (filters?.categoryId) url += `&categoryId=${filters.categoryId}`;
        if (filters?.minDuration !== undefined) url += `&minDuration=${filters.minDuration}`;
        if (filters?.maxDuration !== undefined) url += `&maxDuration=${filters.maxDuration}`;
        if (filters?.sort) url += `&sort=${filters.sort}`;

        const response = await api.get<ApiResponse<PagedResponse<import("../../../types/types").TourSummaryResponse>>>(url);
        return response.data;
    },

    updateTourStatus: async (
        id: number | string,
        data: import("../../../types/types").TourStatusUpdateRequest
    ): Promise<TourDetail> => {
        const response = await api.patch<ApiResponse<TourDetail>>(`/tours/${id}/status`, data);
        return response.data;
    },

    getTourFeedbacks: async (tourId: number | string, params?: import("../../../types/types").FeedbackParams): Promise<PagedResponse<import("../../../types/types").FeedbackResponse>> => {
        let url = `/tours/${tourId}/feedbacks?page=${(params?.page || 1) - 1}&size=${params?.size || 10}`;
        if (params?.rating) url += `&rating=${params.rating}`;
        if (params?.sort) url += `&sort=${params.sort}`;

        const response = await api.get<ApiResponse<PagedResponse<import("../../../types/types").FeedbackResponse>>>(url);
        return response.data;
    },

    deleteFeedback: async (feedbackId: number): Promise<void> => {
        await api.delete(`/feedbacks/${feedbackId}`);
    }
};
