import { useState, useEffect, useMemo } from "react";
import { tourService } from "../../tours/services/tourService";
import { TourListItem, TourStatusUpdateRequest } from "../../tours/types";
import { PagedResponse } from "../../../types/common";

export const useAdminTourManagement = () => {
  const [toursData, setToursData] =
    useState<PagedResponse<TourListItem> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchTours();
  }, [page, statusFilter]);

  const fetchTours = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await tourService.getTours(page, 10);
      setToursData(data);
    } catch (err: any) {
      setError(err.message || "Failed to load tours.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (tourId: number, status: string) => {
    try {
      const request: TourStatusUpdateRequest = {
        status: status,
        lockReason: status === "LOCKED" ? "Administrative Lock" : undefined,
      };
      await tourService.updateTourStatus(tourId, request);
      fetchTours();
    } catch (err: any) {
      alert(err.message || "Failed to update tour status.");
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleStatusFilterChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    setPage(1);
  };

  const stats = useMemo(() => {
    if (!toursData) return null;
    return {
      total: toursData.totalElements,
      pending: toursData.content.filter((t) => t.status === "PENDING").length,
      active: toursData.content.filter((t) => t.status === "ACTIVE").length,
      locked: toursData.content.filter((t) => t.status === "LOCKED").length,
    };
  }, [toursData]);

  return {
    toursData,
    isLoading,
    error,
    statusFilter,
    searchQuery,
    setSearchQuery,
    page,
    stats,
    fetchTours,
    handleStatusUpdate,
    handlePageChange,
    handleStatusFilterChange,
  };
};
