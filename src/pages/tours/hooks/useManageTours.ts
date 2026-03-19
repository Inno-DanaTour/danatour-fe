import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { tourService } from "../services/tourService";
import { companyService } from "../../company-detail/services/companyService";
import { TourListItem } from "../../../types/types";

export const useManageTours = () => {
  const navigate = useNavigate();
  const [tours, setTours] = useState<TourListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const [selectedTourId, setSelectedTourId] = useState<number | null>(null);
  const [selectedTourForUnlock, setSelectedTourForUnlock] =
    useState<TourListItem | null>(null);
  const [lockReason, setLockReason] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMyTours = async (companyId: number) => {
    try {
      setLoading(true);
      const response = await tourService.getTours(1, 50, companyId);
      setTours(response?.content || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch your tours");
      setTours([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (
    tourId: number,
    newStatus: "ACTIVE" | "LOCKED",
    reason?: string,
  ) => {
    try {
      setErrorMessage(null);
      await tourService.updateTourStatus(tourId, {
        status: newStatus,
        lockReason: reason || undefined,
      });
      setIsLockModalOpen(false);
      setIsUnlockModalOpen(false);
      setLockReason("");
      setSelectedTourForUnlock(null);

      // Re-fetch tours after status update
      const providerInfo = await companyService.getMyProviderInfo();
      if (providerInfo && providerInfo.companyId) {
        await fetchMyTours(providerInfo.companyId);
      }
    } catch (err: any) {
      setErrorMessage("Failed to update tour status.");
    }
  };

  const handleDeleteTour = async (id: number) => {
    try {
      setIsDeleting(true);
      setErrorMessage(null);
      await tourService.deleteTour(id);
      setIsDeleteModalOpen(false);
      setSelectedTourId(null);
      
      // Re-fetch tours
      const providerInfo = await companyService.getMyProviderInfo();
      if (providerInfo && providerInfo.companyId) {
        await fetchMyTours(providerInfo.companyId);
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || err.message || "Failed to delete tour.");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const checkAuthAndFetchTours = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        setLoading(true);
        const providerInfo = await companyService.getMyProviderInfo();
        if (providerInfo && providerInfo.companyId) {
          await fetchMyTours(providerInfo.companyId);
        } else {
          setError("You are not associated with any tour company");
          setLoading(false);
        }
      } catch (err: any) {
        console.error("Error fetching provider info:", err);
        setError(err.message || "Failed to load provider information.");
        setLoading(false);
      }
    };

    checkAuthAndFetchTours();
  }, [navigate]);

  return {
    tours,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    isLockModalOpen,
    setIsLockModalOpen,
    isUnlockModalOpen,
    setIsUnlockModalOpen,
    selectedTourId,
    setSelectedTourId,
    selectedTourForUnlock,
    setSelectedTourForUnlock,
    lockReason,
    setLockReason,
    errorMessage,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isDeleting,
    handleStatusUpdate,
    handleDeleteTour,
    fetchMyTours,
    navigate,
  };
};
