import { useState, useEffect } from "react";
import { adminProviderService } from "../services/adminProviderService";
import { TourCompanyResponse, PageResponse } from "../types";

export const useTourCompanyManagement = () => {
  const [companiesData, setCompaniesData] =
    useState<PageResponse<TourCompanyResponse> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [page, setPage] = useState(0);

  // Modal State
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    fetchCompanies();
  }, [page, statusFilter]);

  const fetchCompanies = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminProviderService.getProviderApplications(
        page,
        10,
        statusFilter,
      );
      setCompaniesData(data);
    } catch (err: any) {
      setError(err.message || "Failed to load tour companies.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleStatusFilterChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    setPage(0);
  };

  const handleOpenReview = (id: number) => {
    setSelectedCompanyId(id);
  };

  const handleCloseReview = () => {
    setSelectedCompanyId(null);
  };

  const handleStatusChanged = () => {
    setSelectedCompanyId(null);
    fetchCompanies();
  };

  return {
    companiesData,
    isLoading,
    error,
    statusFilter,
    page,
    selectedCompanyId,
    handlePageChange,
    handleStatusFilterChange,
    handleOpenReview,
    handleCloseReview,
    handleStatusChanged,
    fetchCompanies,
  };
};
