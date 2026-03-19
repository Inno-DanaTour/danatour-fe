import { api } from "../../../configs/api";
import { ApiResponse } from "../../../types/common";
import { ReportPagedResponse, ReportStatus, TourReportResponse } from "../types/report.types";

export const reportService = {
  getReports: async (status?: string, page: number = 0, size: number = 10): Promise<ReportPagedResponse> => {
    const params = new URLSearchParams();
    if (status && status !== "ALL") params.append("status", status);
    params.append("page", page.toString());
    params.append("size", size.toString());
    
    const response = await api.get<ApiResponse<ReportPagedResponse>>(`/admin/reports?${params.toString()}`);
    return response.data;
  },

  updateReportStatus: async (reportId: number, status: ReportStatus): Promise<TourReportResponse> => {
    const response = await api.put<ApiResponse<TourReportResponse>>(`/admin/reports/${reportId}/status?status=${status}`);
    return response.data;
  }
};
