export type ReportStatus = "PENDING" | "RESOLVED" | "DISMISSED";

export interface ReporterInfo {
  username: string;
  fullName: string | null;
  avatarUrl: string | null;
}

export interface TourInfo {
  id: number;
  title: string;
  tourCode: string;
}

export interface TourReportResponse {
  id: number;
  reporter: ReporterInfo;
  tour: TourInfo;
  reason: string;
  status: ReportStatus;
  createdAt: string;
}

export interface ReportPagedResponse {
  content: TourReportResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
