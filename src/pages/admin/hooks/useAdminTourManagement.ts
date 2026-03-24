import { useState, useEffect, useMemo } from "react";
import { adminTourService } from "../services/adminTourService";
import { TourListItem } from "../../tours/types";
import { PageResponse } from "../types";

export const useAdminTourManagement = () => {
  const [toursData, setToursData] =
    useState<PageResponse<TourListItem> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0); // Backend uses 0-based page

  // Rejection Modal State
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedTourId, setSelectedTourId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTours();
  }, [page, statusFilter]);

  const fetchTours = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminTourService.getTours(page, 10, statusFilter);
      setToursData(data);
    } catch (err: any) {
      setError(err.message || "Failed to load tours.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (tourId: number, status: string) => {
    if (status === "REJECTED") {
      setSelectedTourId(tourId);
      setIsRejectModalOpen(true);
      return;
    }

    try {
      if (status === "ACTIVE") {
        await adminTourService.approveTour(tourId);
      }
      // If there's a LOCK operation needed, it should be added to adminTourService
      fetchTours();
    } catch (err: any) {
      alert(err.message || "Failed to update tour status.");
    }
  };

  const handleConfirmReject = async () => {
    if (!selectedTourId || !rejectionReason.trim()) return;

    setIsSubmitting(true);
    try {
      await adminTourService.rejectTour(selectedTourId, rejectionReason);
      setIsRejectModalOpen(false);
      setRejectionReason("");
      setSelectedTourId(null);
      fetchTours();
    } catch (err: any) {
      alert(err.message || "Failed to reject tour.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage - 1); // Component uses 1-based but hook handles conversion if needed
  };

  const handleStatusFilterChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    setPage(0);
  };

  const stats = useMemo(() => {
    if (!toursData) return null;
    return {
      total: toursData.totalElements,
      pending: toursData.content.filter((t) => t.status === "PENDING").length,
      active: toursData.content.filter((t) => t.status === "ACTIVE").length,
      locked: toursData.content.filter((t) => t.status === "LOCKED").length,
      rejected: toursData.content.filter((t) => t.status === "REJECTED").length,
    };
  }, [toursData]);

  return {
    toursData,
    isLoading,
    error,
    statusFilter,
    searchQuery,
    setSearchQuery,
    page: page + 1, // Expose 1-based page for UI
    stats,
    fetchTours,
    handleStatusUpdate,
    handlePageChange,
    handleStatusFilterChange,
    isRejectModalOpen,
    setIsRejectModalOpen,
    rejectionReason,
    setRejectionReason,
    handleConfirmReject,
    isSubmitting,
  };
};
