import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { PaymentStatus } from "../types/payment-result.types";

export const usePaymentResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<PaymentStatus>("loading");
  
  const paymentStatus = searchParams.get("status");

  useEffect(() => {
    if (paymentStatus === "SUCCESS") {
      setStatus("success");
    } else if (paymentStatus === "FAILED") {
      setStatus("failed");
    } else if (paymentStatus === null && status === "loading") {
      // Chỉ set failed nếu là lần load đầu tiên và không có param
      setStatus("failed");
    }
  }, [paymentStatus, status]);

  const handleGoToMyBookings = () => navigate("/my-bookings");
  const handleGoHome = () => navigate("/");
  const handleTryAgain = () => navigate("/tours");

  return {
    status,
    handleGoToMyBookings,
    handleGoHome,
    handleTryAgain,
  };
};
