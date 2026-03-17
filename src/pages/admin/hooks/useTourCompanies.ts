import { useState, useEffect, useCallback } from "react";
import { adminProviderService } from "../services/adminProviderService";
import { TourCompanyResponse, PageResponse } from "../types/admin.types";

export const useTourCompanies = (initialPage = 0, initialStatus = "ALL") => {
  const [companiesData, setCompaniesData] =
    useState<PageResponse<TourCompanyResponse> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<string>(initialStatus);
  const [page, setPage] = useState(initialPage);

  const fetchCompanies = useCallback(async () => {
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
  }, [page, statusFilter]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleStatusFilterChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    setPage(0);
  };

  return {
    companiesData,
    isLoading,
    error,
    page,
    statusFilter,
    fetchCompanies,
    handlePageChange,
    handleStatusFilterChange,
  };
};
