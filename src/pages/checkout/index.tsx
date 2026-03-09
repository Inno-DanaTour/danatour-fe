import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Wallet,
  User,
  Mail,
  Phone,
  MapPin,
  ChevronLeft,
  ShieldCheck,
  Check,
  Lock,
  ArrowRight,
  PartyPopper,
  AlertCircle,
} from "lucide-react";
import { bookingService, BookingRequest } from "../../services/bookingService";
import { Loader2 } from "lucide-react";
import Header from "../../components/layout/Header";
import { Tour } from "../../types/types";

const Checkout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const tour = location.state?.tour as Tour;
  const adults = location.state?.adults || 1;
  const children = location.state?.children || 0;
  const scheduleId = location.state?.scheduleId;
  const [paymentMethod, setPaymentMethod] = useState<"card" | "wallet">("card");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [contactInfo, setContactInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    nationality: "",
  });

  if (!tour || !scheduleId) {
    navigate("/tours");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const bookingData: BookingRequest = {
        scheduleId,
        adults: adults,
        children: children,
        contactName: contactInfo.fullName,
        contactEmail: contactInfo.email,
        contactPhone: contactInfo.phone,
      };

      const response = await bookingService.createBooking(bookingData);

      // Show success notification
      setShowSuccess(true);

      // Delay navigation slightly to let the user see the success message
      setTimeout(() => {
        navigate("/booking/confirmation", {
          state: {
            tour,
            booking: response,
          },
        });
      }, 2000);
    } catch (err: any) {
      console.error("Booking failed:", err);
      setError(err.message || "Failed to create booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const bookingFee = 50000;
  const totalAmount =
    tour.adultPrice * adults + tour.childrenPrice * children + bookingFee;

  return (
    <div className="min-h-screen bg-background">
      {/* Success Notification Overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-primary/20 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", damping: 15, stiffness: 200 }}
              className="bg-white rounded-[3rem] p-10 md:p-16 max-w-sm w-full text-center shadow-2xl shadow-primary/20 border border-primary/10"
            >
              <div className="relative mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", bounce: 0.6 }}
                  className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-500/40"
                >
                  <Check size={48} className="text-white" />
                </motion.div>
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -top-4 -right-2 w-12 h-12 bg-cta rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <PartyPopper size={24} className="text-white" />
                </motion.div>
              </div>

              <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">
                Booking Success!
              </h2>
              <p className="text-gray-500 font-medium leading-relaxed">
                Your journey to{" "}
                <span className="text-primary font-bold">{tour?.name}</span> is
                confirmed. Preparing your tickets...
              </p>

              <div className="mt-8 flex justify-center">
                <div className="flex gap-1.5">
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                    className="w-2 h-2 bg-primary rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                    className="w-2 h-2 bg-primary rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                    className="w-2 h-2 bg-primary rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Header onBookClick={() => navigate("/tours")} />

      <main className="pt-24 md:pt-32 pb-20 px-4 md:px-6 max-w-6xl mx-auto">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-6 md:mb-8 font-medium text-sm md:text-base"
        >
          <ChevronLeft size={18} />
          Back to details
        </motion.button>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-3xl md:text-4xl font-black mb-8 md:mb-12 leading-tight"
        >
          Complete Your <span className="text-primary">Booking</span>
        </motion.h1>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3"
          >
            <AlertCircle size={20} />
            <p className="font-medium">{error}</p>
          </motion.div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col lg:flex-row gap-8 lg:gap-12"
        >
          {/* ... (existing Customer Info and Payment Method sections) */}
          <div className="w-full lg:w-3/5 space-y-8 md:space-y-12">
            {/* Customer Info */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h3 className="text-xl md:text-2xl font-bold flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <User size={20} />
                </div>
                Customer Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <label className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    required
                    value={contactInfo.fullName}
                    onChange={(e) =>
                      setContactInfo({
                        ...contactInfo,
                        fullName: e.target.value,
                      })
                    }
                    className="input py-3.5 md:py-4 px-4 md:px-6 text-sm md:text-base rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    required
                    value={contactInfo.email}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, email: e.target.value })
                    }
                    className="input py-3.5 md:py-4 px-4 md:px-6 text-sm md:text-base rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+84 ..."
                    required
                    value={contactInfo.phone}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, phone: e.target.value })
                    }
                    className="input py-3.5 md:py-4 px-4 md:px-6 text-sm md:text-base rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">
                    Nationality
                  </label>
                  <input
                    type="text"
                    placeholder="Vietnam"
                    value={contactInfo.nationality}
                    onChange={(e) =>
                      setContactInfo({
                        ...contactInfo,
                        nationality: e.target.value,
                      })
                    }
                    className="input py-3.5 md:py-4 px-4 md:px-6 text-sm md:text-base rounded-xl"
                  />
                </div>
              </div>
            </motion.section>

            {/* Payment Method */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              <h3 className="text-xl md:text-2xl font-bold flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <CreditCard size={20} />
                </div>
                Payment Method
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`p-5 md:p-6 rounded-2xl border-2 transition-all flex items-center gap-4 text-left group ${
                    paymentMethod === "card"
                      ? "border-primary bg-primary/5 shadow-lg shadow-primary/5"
                      : "border-gray-100 bg-white hover:border-gray-200"
                  }`}
                >
                  <div
                    className={`p-3 rounded-full transition-colors ${paymentMethod === "card" ? "bg-primary text-white" : "bg-gray-50 text-gray-400 group-hover:bg-gray-100"}`}
                  >
                    <CreditCard size={22} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm md:text-base">
                      Credit / Debit Card
                    </p>
                    <p className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wider font-bold">
                      Visa, Master, JCB
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("wallet")}
                  className={`p-5 md:p-6 rounded-2xl border-2 transition-all flex items-center gap-4 text-left group ${
                    paymentMethod === "wallet"
                      ? "border-primary bg-primary/5 shadow-lg shadow-primary/5"
                      : "border-gray-100 bg-white hover:border-gray-200"
                  }`}
                >
                  <div
                    className={`p-3 rounded-full transition-colors ${paymentMethod === "wallet" ? "bg-primary text-white" : "bg-gray-50 text-gray-400 group-hover:bg-gray-100"}`}
                  >
                    <Wallet size={22} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm md:text-base">
                      E-Wallet
                    </p>
                    <p className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wider font-bold">
                      MoMo, ZaloPay
                    </p>
                  </div>
                </button>
              </div>

              <AnimatePresence mode="wait">
                {paymentMethod === "card" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-6 md:p-8 bg-white rounded-3xl border border-gray-100 shadow-xl shadow-black/5 space-y-4 md:space-y-6 overflow-hidden"
                  >
                    <div className="space-y-2">
                      <label className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        className="input text-sm md:text-base"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM / YY"
                          className="input text-sm md:text-base"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">
                          CVC / CVV
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          className="input text-sm md:text-base"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full lg:w-2/5"
          >
            <div className="card space-y-6 md:space-y-8 sticky top-24 border border-gray-100 shadow-2xl shadow-black/5 p-6 md:p-8 rounded-[2rem]">
              <h3 className="text-xl md:text-2xl font-black border-b border-gray-50 pb-4 md:pb-6">
                Summary
              </h3>

              <div className="flex gap-4 md:gap-5">
                <div className="w-20 md:w-24 h-20 md:h-24 shrink-0 rounded-2xl overflow-hidden shadow-sm">
                  <img
                    src={tour.image}
                    className="w-full h-full object-cover"
                    alt={tour.name}
                  />
                </div>
                <div className="flex flex-col justify-center gap-1">
                  <div className="text-[10px] text-primary font-black uppercase tracking-widest">
                    {tour.zone}
                  </div>
                  <h4 className="font-bold text-gray-900 leading-tight text-sm md:text-base line-clamp-2">
                    {tour.name}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1 font-medium">
                    {tour.duration} • {adults + children} Guests
                  </p>
                  <p className="text-xs text-primary font-bold mt-1">
                    Date:{" "}
                    {tour.schedules?.find((s) => s.id === scheduleId)?.startDate
                      ? new Date(
                          tour.schedules.find((s) => s.id === scheduleId)!
                            .startDate,
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-50 text-sm">
                <div className="flex justify-between items-center text-gray-500">
                  <span className="font-medium">Adults (x{adults})</span>
                  <span className="font-black text-gray-900">
                    {new Intl.NumberFormat("vi-VN").format(
                      tour.adultPrice * adults,
                    )}{" "}
                    VNĐ
                  </span>
                </div>
                {children > 0 && (
                  <div className="flex justify-between items-center text-gray-500">
                    <span className="font-medium">Children (x{children})</span>
                    <span className="font-black text-gray-900">
                      {new Intl.NumberFormat("vi-VN").format(
                        tour.childrenPrice * children,
                      )}{" "}
                      VNĐ
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center text-gray-500">
                  <span className="font-medium">Booking fee</span>
                  <span className="font-black text-gray-900">
                    {new Intl.NumberFormat("vi-VN").format(bookingFee)} VNĐ
                  </span>
                </div>

                <div className="flex justify-between items-end pt-6 border-t border-primary/10">
                  <span className="text-base md:text-lg font-bold text-gray-900 uppercase tracking-widest">
                    Total
                  </span>
                  <div className="text-right">
                    <span className="text-2xl md:text-3xl font-black text-cta">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full py-4 md:py-5 text-lg md:text-xl shadow-2xl shadow-cta/20 rounded-2xl flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={24} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Safe Checkout"
                  )}
                </button>
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <ShieldCheck size={18} />
                  <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">
                    Secure 256-bit SSL encryption
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </form>
      </main>
    </div>
  );
};

export default Checkout;
