import { useState, useEffect, useCallback } from "react";
import { reportService } from "../services/reportService";
import { TourReportResponse, ReportStatus } from "../types/report.types";

export const useAdminReportManagement = () => {
  const [reports, setReports] = useState<TourReportResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "ALL">("ALL");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const data = await reportService.getReports(statusFilter === "ALL" ? undefined : statusFilter, currentPage, pageSize);
      setReports(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (err: any) {
      setError(err.message || "Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, currentPage]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleUpdateStatus = async (reportId: number, status: ReportStatus) => {
    try {
      await reportService.updateReportStatus(reportId, status);
      fetchReports();
    } catch (err: any) {
      alert(err.message || "Failed to update report status");
    }
  };

  const stats = {
    total: totalElements,
    pending: reports.filter(r => r.status === "PENDING").length, // This is only for current page, ideally should come from backend
    resolved: reports.filter(r => r.status === "RESOLVED").length,
  };

  return {
    reports,
    loading,
    error,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    handleUpdateStatus,
    stats,
    refresh: fetchReports
  };
};
