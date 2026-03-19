import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { bookingService } from "../services/bookingService";
import { paymentService } from "../services/paymentService";
import { paymentMethodService } from "../services/paymentMethodService";
import { promotionService } from "../../promotions/services/promotionService";
import { Tour } from "../../../types/types";
import { PromotionResponse } from "../../promotions/types/promotions.types";

import { BookingRequest, BookingResponse } from "../types/checkout.types";

export const useCheckout = (
  tour: Tour | null,
  scheduleId: number | null,
  adults: number,
  children: number,
  isResuming: boolean = false,
  existingBookingId: number | null = null,
) => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<
    "card" | "wallet" | "vietqr"
  >("card");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bankInfo, setBankInfo] = useState<any>(null);
  const [bookingResponse, setBookingResponse] = useState<BookingResponse | null>(
    null,
  );
  const [showVietQR, setShowVietQR] = useState(false);

  const [contactInfo, setContactInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    nationality: "",
  });

  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<PromotionResponse | null>(
    null,
  );
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);

  const handleApplyPromo = async () => {
    if (!promoCode.trim() || !tour) return;
    setIsApplyingPromo(true);
    setPromoError(null);
    try {
      const promo = await promotionService.validatePromoCode(
        promoCode,
        Number(tour.id),
      );
      setAppliedPromo(promo);
      setPromoCode("");
    } catch (err: any) {
      setPromoError(err.message || "Invalid promo code");
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoError(null);
  };

  const calculateDiscount = useCallback(() => {
    if (!appliedPromo || !tour) return 0;
    const subtotal = tour.adultPrice * adults + tour.childrenPrice * children;
    if (appliedPromo.discountType === "PERCENTAGE") {
      const discount = (subtotal * appliedPromo.discountValue) / 100;
      return appliedPromo.maxDiscountAmount
        ? Math.min(discount, appliedPromo.maxDiscountAmount)
        : discount;
    } else {
      return appliedPromo.discountValue;
    }
  }, [appliedPromo, tour, adults, children]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isResuming && (!tour || !scheduleId)) return;

    setIsSubmitting(true);
    setError(null);

    try {
      let responseId = existingBookingId;

      if (!isResuming) {
        if (!tour || !scheduleId) throw new Error("Missing tour or schedule info");
        const bookingData: BookingRequest = {
          scheduleId,
          adults: adults,
          children: children,
          contactName: contactInfo.fullName,
          contactEmail: contactInfo.email,
          contactPhone: contactInfo.phone,
          promoCode: appliedPromo?.code,
        };

        const response = await bookingService.createBooking(bookingData);
        setBookingResponse(response);
        responseId = response.id;
      }

      if (!responseId) throw new Error("No booking ID available");

      if (paymentMethod === "vietqr") {
        try {
          const info = await paymentMethodService.getForBooking(responseId);
          setBankInfo(info);
          setShowVietQR(true);
        } catch (err: any) {
          console.error("Failed to fetch bank info:", err);
          setError(
            "Booking found, but failed to fetch payment info. Please contact support.",
          );
        }
      } else {
        const paymentUrl = await paymentService.createPaymentUrl(responseId);
        window.location.href = paymentUrl;
      }
    } catch (err: any) {
      console.error("Booking failed:", err);
      setError(err.message || "Failed to process booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    paymentMethod,
    setPaymentMethod,
    isSubmitting,
    showSuccess,
    setShowSuccess,
    error,
    setError,
    bankInfo,
    showVietQR,
    setShowVietQR,
    bookingResponse,
    contactInfo,
    setContactInfo,
    promoCode,
    setPromoCode,
    appliedPromo,
    isApplyingPromo,
    promoError,
    handleApplyPromo,
    removePromo,
    calculateDiscount,
    handleSubmit,
  };
};
