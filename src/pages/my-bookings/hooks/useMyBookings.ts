import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { bookingService } from "../../checkout/services/bookingService";
import { paymentMethodService } from "../../checkout/services/paymentMethodService";
import { tourService } from "../../tours/services/tourService";
import { BookingHistoryResponse } from "../types/my-bookings.types";
import { PagedResponse } from "../../../types/common";
import { BookingResponse } from "../../checkout/types";
import { PaymentMethod } from "../../checkout/types";

export const useMyBookings = () => {
  const navigate = useNavigate();
  const [pagedData, setPagedData] =
    useState<PagedResponse<BookingHistoryResponse> | null>(null);
  const [activeTab, setActiveTab] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Feedback Modal State
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedBookingForFeedback, setSelectedBookingForFeedback] =
    useState<BookingHistoryResponse | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // Detail Modal State
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedBookingForDetails, setSelectedBookingForDetails] =
    useState<BookingResponse | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // Cancel Modal State
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBookingForCancel, setSelectedBookingForCancel] =
    useState<BookingHistoryResponse | null>(null);
  const [refundPaymentMethods, setRefundPaymentMethods] = useState<
    PaymentMethod[]
  >([]);
  const [selectedRefundPaymentMethodId, setSelectedRefundPaymentMethodId] =
    useState<number | null>(null);
  const [isLoadingRefundPaymentMethods, setIsLoadingRefundPaymentMethods] =
    useState(false);
  const [refundPaymentMethodsError, setRefundPaymentMethodsError] = useState<
    string | null
  >(null);
  const [modalLanguage, setModalLanguage] = useState<"vi" | "en">("vi");

  // Status Modal State (Success/Error feedback)
  const [statusModal, setStatusModal] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    message: string;
    description?: string;
  }>({
    isOpen: false,
    type: "success",
    message: "",
  });

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await bookingService.getMyBookings({
        status: activeTab || undefined,
        page: currentPage,
        size: 5,
        sort: "createdAt,desc",
      });
      setPagedData(response);
    } catch (err: any) {
      setError(err.message || "Failed to fetch bookings");
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, currentPage]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1);
  };

  const loadRefundPaymentMethods = useCallback(async () => {
    setIsLoadingRefundPaymentMethods(true);
    setRefundPaymentMethodsError(null);
    try {
      const methods = await paymentMethodService.getAll();
      setRefundPaymentMethods(methods);
      const defaultMethod = methods.find((method) => method.isDefault);
      setSelectedRefundPaymentMethodId(defaultMethod?.id ?? methods[0]?.id ?? null);
    } catch (err: any) {
      setRefundPaymentMethods([]);
      setSelectedRefundPaymentMethodId(null);
      setRefundPaymentMethodsError(
        err?.response?.data?.message ||
          err?.message ||
          "Không thể tải tài khoản nhận hoàn tiền.",
      );
    } finally {
      setIsLoadingRefundPaymentMethods(false);
    }
  }, []);

  const handleOpenCancelModal = async (booking: BookingHistoryResponse) => {
    setSelectedBookingForCancel(booking);
    setRefundPaymentMethodsError(null);

    if (booking.status === "CONFIRMED") {
      await loadRefundPaymentMethods();
    } else {
      setRefundPaymentMethods([]);
      setSelectedRefundPaymentMethodId(null);
    }

    setShowCancelModal(true);
  };

  const calculateRefundAmount = (booking: BookingHistoryResponse) => {
    if (!booking.startDate)
      return { refund: 0, fee: 100, feeAmount: booking.finalAmount };

    const start = new Date(booking.startDate);
    const now = new Date();
    const diffTime = start.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let feePercent = 100;
    if (diffDays >= 15) feePercent = 10;
    else if (diffDays >= 10) feePercent = 50;
    else if (diffDays >= 7) feePercent = 70;
    else if (diffDays >= 5) feePercent = 90;
    else feePercent = 100;

    const feeAmount = (booking.finalAmount * feePercent) / 100;
    const refundAmount = booking.finalAmount - feeAmount;

    return {
      refund: refundAmount,
      fee: feePercent,
      feeAmount: feeAmount,
      daysRemaining: diffDays,
    };
  };

  const handleCancelBooking = async (booking: BookingHistoryResponse) => {
    const id = booking.id;

    if (booking.status === "CONFIRMED" && !selectedRefundPaymentMethodId) {
      setStatusModal({
        isOpen: true,
        type: "error",
        message: "Thiếu tài khoản nhận hoàn tiền",
        description:
          "Vui lòng chọn tài khoản ngân hàng để nhận hoàn tiền trước khi hủy tour.",
      });
      return;
    }

    setIsProcessing(id);
    try {
      await bookingService.cancelBooking(
        id,
        booking.status === "CONFIRMED"
          ? { paymentMethodId: selectedRefundPaymentMethodId ?? undefined }
          : undefined,
      );
      fetchBookings();
      setShowCancelModal(false);
      setSelectedRefundPaymentMethodId(null);
      setRefundPaymentMethods([]);
      setStatusModal({
        isOpen: true,
        type: "success",
        message: "Hủy tour thành công!",
        description: "Yêu cầu hủy tour của bạn đã được hệ thống ghi nhận.",
      });
    } catch (err: any) {
      setStatusModal({
        isOpen: true,
        type: "error",
        message: "Không thể hủy tour",
        description:
          err.response?.data?.message ||
          err.message ||
          "Vui lòng thử lại sau hoặc liên hệ hỗ trợ.",
      });
    } finally {
      setIsProcessing(null);
    }
  };

  const handleOpenFeedback = (booking: BookingHistoryResponse) => {
    setSelectedBookingForFeedback(booking);
    setRating(5);
    setComment("");
    setShowFeedbackModal(true);
  };

  const handleSubmitFeedback = async () => {
    if (!selectedBookingForFeedback) return;

    setIsSubmittingFeedback(true);
    try {
      await bookingService.submitFeedback(
        selectedBookingForFeedback.id,
        rating,
        comment,
      );
      setFeedbackSuccess(true);
      setTimeout(() => {
        setShowFeedbackModal(false);
        setFeedbackSuccess(false);
        fetchBookings();
      }, 2000);
    } catch (err: any) {
      setStatusModal({
        isOpen: true,
        type: "error",
        message: "Không thể gửi đánh giá",
        description: err.response?.data?.message || "Vui lòng thử lại sau.",
      });
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleOpenDetails = async (id: number) => {
    setIsLoadingDetail(true);
    setShowDetailModal(true);
    setSelectedBookingForDetails(null);
    try {
      const detail = await bookingService.getBooking(id);
      setSelectedBookingForDetails(detail);
    } catch (err: any) {
      setStatusModal({
        isOpen: true,
        type: "error",
        message: "Lỗi tải thông tin",
        description: "Không thể lấy chi tiết đơn đặt chỗ. Vui lòng thử lại.",
      });
      setShowDetailModal(false);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handlePayNow = async (booking: BookingHistoryResponse) => {
    setIsProcessing(booking.id);
    try {
      // We need the full tour object for the checkout summary
      const tourDetail = await tourService.getTourDetail(booking.tourId);

      navigate("/checkout", {
        state: {
          tour: tourDetail,
          scheduleId: null, // Not needed for resume as we have bookingId
          adults: 0, // Not needed for resume
          children: 0, // Not needed for resume
          isResuming: true,
          existingBookingId: booking.id,
        },
      });
    } catch (err: any) {
      setStatusModal({
        isOpen: true,
        type: "error",
        message: "Lỗi chuẩn bị thanh toán",
        description: "Vui lòng thử lại sau.",
      });
    } finally {
      setIsProcessing(null);
    }
  };

  return {
    pagedData,
    activeTab,
    currentPage,
    isLoading,
    isProcessing,
    error,
    showFeedbackModal,
    selectedBookingForFeedback,
    rating,
    comment,
    isSubmittingFeedback,
    feedbackSuccess,
    setCurrentPage,
    setRating,
    setComment,
    setShowFeedbackModal,
    handleTabChange,
    handleCancelBooking,
    handleOpenFeedback,
    handleSubmitFeedback,
    handleOpenDetails,
    handlePayNow,
    setShowDetailModal,
    fetchBookings,
    showDetailModal,
    selectedBookingForDetails,
    isLoadingDetail,
    showCancelModal,
    setShowCancelModal,
    selectedBookingForCancel,
    handleOpenCancelModal,
    calculateRefundAmount,
    refundPaymentMethods,
    selectedRefundPaymentMethodId,
    setSelectedRefundPaymentMethodId,
    isLoadingRefundPaymentMethods,
    refundPaymentMethodsError,
    modalLanguage,
    setModalLanguage,
    statusModal,
    setStatusModal,
  };
};
