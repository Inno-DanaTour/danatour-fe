import { useState, useEffect } from "react";
import { adminProviderService } from "../services/adminProviderService";
import { AdminProviderApplicationDetailResponse } from "../types";

interface UseTourCompanyDetailsProps {
  companyId: number;
  onStatusChanged: () => void;
}

export const useTourCompanyDetails = ({
  companyId,
  onStatusChanged,
}: UseTourCompanyDetailsProps) => {
  const [data, setData] =
    useState<AdminProviderApplicationDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Action State
  const [isProcessing, setIsProcessing] = useState(false);
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // Preview State
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "info" | "success" | "danger";
    onConfirm?: () => void;
    showConfirmButton?: boolean;
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  const showMessage = (
    title: string,
    message: string,
    type: "info" | "success" | "danger" = "info",
    onConfirm?: () => void,
    showConfirmButton: boolean = true,
  ) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      type,
      onConfirm,
      showConfirmButton,
    });
  };

  const closeMessage = () => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
  };

  useEffect(() => {
    fetchDetail();
  }, [companyId]);

  const fetchDetail = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result =
        await adminProviderService.getProviderApplicationDetail(companyId);
      setData(result);
    } catch (err: any) {
      setError(err.message || "Failed to load application details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    showMessage(
      "Confirm Approval",
      "Approve this company? They will be granted Tour Company permissions.",
      "info",
      async () => {
        setIsProcessing(true);
        try {
          await adminProviderService.approveApplication(companyId);
          showMessage(
            "Success",
            "Company Application Approved Successfully.",
            "success",
            () => {
              onStatusChanged();
            },
            false,
          );
        } catch (err: any) {
          showMessage(
            "Error",
            err.message || "Failed to approve application.",
            "danger",
          );
          setIsProcessing(false);
        }
      },
    );
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      showMessage("Warning", "Please provide a rejection reason.", "danger");
      return;
    }
    setIsProcessing(true);
    try {
      await adminProviderService.rejectApplication(companyId, rejectReason);
      showMessage(
        "Rejected",
        "Company Application Rejected.",
        "info",
        () => {
          onStatusChanged();
        },
        false,
      );
    } catch (err: any) {
      showMessage(
        "Error",
        err.message || "Failed to reject application.",
        "danger",
      );
      setIsProcessing(false);
    }
  };

  const toggleRejectMode = (mode: boolean) => {
    setRejectMode(mode);
    if (!mode) setRejectReason("");
  };

  return {
    data,
    isLoading,
    error,
    isProcessing,
    rejectMode,
    rejectReason,
    setRejectReason,
    previewUrl,
    setPreviewUrl,
    confirmModal,
    showMessage,
    closeMessage,
    handleApprove,
    handleReject,
    toggleRejectMode,
  };
};
