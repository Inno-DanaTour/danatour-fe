import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Users,
  ArrowRight,
  XCircle,
  Clock,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Filter,
  Star,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import {
  bookingService,
  BookingHistoryResponse,
} from "../checkout/services/bookingService";
import { PagedResponse } from "../../types/common";

const TABS: Tab[] = [
  { label: "All", value: "" },
  { label: "Pending Payment", value: "PENDING_PAYMENT" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const MyBookings: React.FC = () => {
  const navigate = useNavigate();
  const {
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
    modalLanguage,
    setModalLanguage,
    statusModal,
    setStatusModal,
  } = useMyBookings();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-600 border-green-200";
      case "PENDING_PAYMENT":
        return "bg-amber-100 text-amber-600 border-amber-200";
      case "CANCELLED":
        return "bg-red-100 text-red-600 border-red-200";
      case "COMPLETED":
        return "bg-blue-100 text-blue-600 border-blue-200";
      case "REVIEWED":
        return "bg-purple-100 text-purple-600 border-purple-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    const tab = TABS.find((t) => t.value === status);
    return tab ? tab.label : status;
  };

  const handleRebook = async (tourId: number) => {
    navigate(`/tours/${tourId}`);
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-20 font-sans selection:bg-primary/20">
      <Header onBookClick={() => navigate("/tours")} />

      <main className="pt-24 md:pt-32 px-4 md:px-6 max-w-6xl mx-auto">
        <header className="mb-10 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4"
          >
            <Clock size={14} />
            <span>Discovery History</span>
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-4 tracking-tight leading-tight">
            My <span className="text-primary italic">Trips</span>
          </h1>
          <p className="text-gray-500 font-medium max-w-2xl text-lg">
            Manage your booked tours, view itineraries, and check your payment
            status.
          </p>
        </header>

        {/* Status Tabs */}
        <div className="mb-8 overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 min-w-max">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => handleTabChange(tab.value)}
                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                  activeTab === tab.value
                    ? "bg-primary text-white shadow-lg shadow-primary/30"
                    : "text-gray-500 hover:text-primary hover:bg-primary/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-black/5">
              <Loader2 className="w-16 h-16 animate-spin text-primary mb-6" />
              <p className="text-gray-400 font-black uppercase tracking-widest text-sm animate-pulse">
                Loading data...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-24 bg-red-50/50 rounded-[3rem] border-2 border-dashed border-red-100">
              <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={40} className="text-red-500" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">
                {error}
              </h3>
              <p className="text-gray-500 mb-8 font-medium">
                An error occurred while fetching your bookings.
              </p>
              <button
                onClick={() => fetchBookings()}
                className="btn-primary px-12 py-4 shadow-xl shadow-primary/20"
              >
                Try Again
              </button>
            </div>
          ) : !pagedData || pagedData.content.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-black/5">
              <div className="bg-neutral-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Filter size={40} className="text-neutral-400" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">
                No bookings yet
              </h3>
              <p className="text-gray-500 mb-8 font-medium">
                You haven't booked any trips in this category.
              </p>
              <button
                onClick={() => navigate("/tours")}
                className="btn-primary px-12 py-4 shadow-xl shadow-primary/20"
              >
                Explore Now
              </button>
            </div>
          ) : (
            <>
              <AnimatePresence mode="popLayout">
                {pagedData.content.map((booking, idx) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group bg-white rounded-[2.5rem] p-5 md:p-6 shadow-xl shadow-black/5 border border-gray-100 flex flex-col md:flex-row gap-6 md:gap-8 items-center hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500"
                  >
                    {/* Tour Image */}
                    <div className="w-full md:w-56 h-40 md:h-44 rounded-3xl overflow-hidden shrink-0 bg-neutral-100 relative shadow-inner">
                      {booking.thumbnail ? (
                        <img
                          src={booking.thumbnail}
                          alt={booking.tourTitle}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200">
                          <Calendar className="w-16 h-16 text-neutral-300" />
                        </div>
                      )}
                      {/* Price Tag Overlay */}
                      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-2xl shadow-lg border border-white/50">
                        <span className="text-primary font-black text-sm">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(booking.totalAmount)}
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-grow space-y-4 text-center md:text-left w-full">
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                        <span
                          className={`px-4 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${getStatusColor(booking.status)}`}
                        >
                          {getStatusLabel(booking.status)}
                        </span>
                        {booking.hasFeedback && (
                          <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border bg-purple-50 text-purple-600 border-purple-100 flex items-center gap-1.5">
                            <Star
                              size={12}
                              fill="currentColor"
                              className="text-purple-400"
                            />
                            Reviewed
                          </span>
                        )}
                        <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-[0.2em] bg-gray-50 px-3 py-1 rounded-full">
                          CODE: {booking.bookingCode}
                        </span>
                      </div>

                      <h3 className="text-xl md:text-2xl font-black text-gray-900 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                        {booking.tourTitle}
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-500">
                        <div className="flex items-center justify-center md:justify-start gap-2.5 bg-neutral-50 p-2.5 rounded-2xl border border-neutral-100">
                          <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm">
                            <Calendar size={16} className="text-primary" />
                          </div>
                          <div className="text-left">
                            <p className="text-[10px] uppercase font-black text-gray-400 leading-none mb-1">
                              Departure Date
                            </p>
                            <p className="font-bold text-gray-700 text-sm">
                              {booking.startDate
                                ? new Date(
                                    booking.startDate,
                                  ).toLocaleDateString("en-US", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })
                                : "To be determined"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-center md:justify-start gap-3 bg-neutral-50 p-2.5 rounded-2xl border border-neutral-100">
                          <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm">
                            <Clock size={16} className="text-primary" />
                          </div>
                          <div className="text-left">
                            <p className="text-[10px] uppercase font-black text-gray-400 leading-none mb-1">
                              Booking Date
                            </p>
                            <p className="font-bold text-gray-700 text-sm">
                              {new Date(booking.createdAt).toLocaleDateString(
                                "en-US",
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="shrink-0 flex flex-col gap-3 w-full md:w-auto md:min-w-[180px] md:border-l md:border-dashed md:border-gray-200 md:pl-8 pt-4 md:pt-0">
                      <button
                        onClick={() => handlePayNow(booking)}
                        disabled={
                          booking.status !== "PENDING_PAYMENT" ||
                          isProcessing === booking.id
                        }
                        className={`w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
                          booking.status === "PENDING_PAYMENT"
                            ? "bg-cta text-black shadow-lg shadow-cta/30 hover:shadow-cta/40 hover:-translate-y-0.5"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {isProcessing === booking.id ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          "Pay Now"
                        )}
                      </button>

                      {booking.status === "PENDING_PAYMENT" && (
                        <div className="flex justify-center">
                          <PaymentTimer
                            createdAt={booking.createdAt}
                            className="w-full justify-center"
                          />
                        </div>
                      )}

                      <div className="flex flex-col gap-3">
                        {booking.status === "CANCELLED" && (
                          <button
                            onClick={() => handleRebook(booking.tourId)}
                            disabled={isProcessing === booking.id}
                            className="w-full p-3.5 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100 transition-all flex items-center justify-center gap-2 font-black text-xs disabled:opacity-50"
                          >
                            {isProcessing === booking.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Users size={16} />
                            )}
                            Re-book
                          </button>
                        )}

                        <div className="flex gap-3">
                          {booking.status !== "CANCELLED" &&
                            booking.status !== "COMPLETED" && (
                              <button
                                onClick={() => handleOpenCancelModal(booking)}
                                disabled={isProcessing === booking.id}
                                className="flex-1 p-3.5 rounded-2xl border-2 border-red-50 text-red-400 hover:bg-red-50 hover:border-red-100 transition-all flex items-center justify-center gap-2 font-black text-xs disabled:opacity-50"
                              >
                                {isProcessing === booking.id ? (
                                  <Loader2 className="w-4.5 h-4.5 animate-spin" />
                                ) : (
                                  <XCircle size={16} />
                                )}
                                Cancel
                              </button>
                            )}
                          <button
                            onClick={() => handleOpenDetails(booking.id)}
                            className="flex-1 p-3.5 bg-neutral-100 text-neutral-600 rounded-2xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 font-black text-xs"
                          >
                            Details
                          </button>
                        </div>
                      </div>

                      {/* Rate & Review Button for Completed Tours */}
                      {booking.status === "COMPLETED" &&
                        !booking.hasFeedback && (
                          <button
                            onClick={() => handleOpenFeedback(booking)}
                            className="w-full mt-2 py-3 bg-primary text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
                          >
                            <Star size={14} fill="currentColor" />
                            Rate & Review
                          </button>
                        )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Pagination */}
              {pagedData.totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-4">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={pagedData.first}
                    className="w-12 h-12 rounded-2xl border border-gray-200 flex items-center justify-center hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-400 shadow-sm bg-white"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <div className="px-6 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <span className="text-gray-900 font-black tracking-widest text-lg">
                      {currentPage} / {pagedData.totalPages}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      setCurrentPage((p) =>
                        Math.min(pagedData.totalPages, p + 1),
                      )
                    }
                    disabled={pagedData.last}
                    className="w-12 h-12 rounded-2xl border border-gray-200 flex items-center justify-center hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-400 shadow-sm bg-white"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Support Banner */}
        <section className="mt-24 p-10 md:p-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3.5rem] text-white flex flex-col md:flex-row items-center gap-12 relative overflow-hidden shadow-2xl shadow-blue-500/20">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl -ml-24 -mb-24"></div>

          <div className="space-y-5 text-center md:text-left z-10">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
              Need any support for <br />
              your trips?
            </h2>
            <p className="text-blue-100 max-w-md text-lg font-medium">
              DanaTour's support team is always available 24/7 to help you with
              any questions regarding your bookings.
            </p>
          </div>
          <div className="flex-grow"></div>
          <div className="flex flex-col sm:flex-row gap-4 z-10 w-full md:w-auto">
            <button className="bg-white text-blue-600 px-10 py-4 rounded-2xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all w-full sm:w-auto">
              Support Center
            </button>
            <button className="bg-blue-500/30 backdrop-blur-md border border-white/20 text-white px-10 py-4 rounded-2xl font-black hover:bg-white/10 transition-all w-full sm:w-auto">
              Chat with Consultant
            </button>
          </div>
        </section>
      </main>

      {/* Feedback Modal */}
      <AnimatePresence>
        {showFeedbackModal && selectedBookingForFeedback && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFeedbackModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl border border-gray-100"
            >
              <div className="p-8 md:p-10">
                <AnimatePresence mode="wait">
                  {!feedbackSuccess ? (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <div className="flex justify-between items-start mb-8">
                        <div>
                          <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-tight mb-2">
                            Review Your{" "}
                            <span className="text-primary italic">Trip</span>
                          </h2>
                          <p className="text-gray-500 font-medium">
                            Sharing your experience helps the community!
                          </p>
                        </div>
                        <button
                          onClick={() => setShowFeedbackModal(false)}
                          className="p-2 hover:bg-gray-100 rounded-2xl transition-colors"
                        >
                          <XCircle size={24} className="text-gray-400" />
                        </button>
                      </div>

                      <div className="bg-neutral-50 p-6 rounded-3xl border border-neutral-100 mb-8 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm shrink-0">
                          <img
                            src={selectedBookingForFeedback.thumbnail}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h4 className="font-bold text-gray-800 text-lg line-clamp-1">
                          {selectedBookingForFeedback.tourTitle}
                        </h4>
                      </div>

                      <div className="space-y-8">
                        {/* Star Rating */}
                        <div className="text-center">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                            Your Rating
                          </p>
                          <div className="flex justify-center gap-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => setRating(star)}
                                className="transition-transform active:scale-90"
                              >
                                <Star
                                  size={42}
                                  className={`${rating >= star ? "text-amber-400" : "text-gray-200"} transition-colors duration-300`}
                                  fill={
                                    rating >= star ? "currentColor" : "none"
                                  }
                                  strokeWidth={rating >= star ? 1.5 : 2}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Comment */}
                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                            Your Comment
                          </label>
                          <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share what you liked or what could be improved..."
                            className="w-full h-32 p-5 bg-neutral-50 border border-neutral-200 rounded-3xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all resize-none font-medium outline-none"
                          />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                          <button
                            onClick={handleSubmitFeedback}
                            disabled={isSubmittingFeedback}
                            className="w-full py-5 bg-primary text-white rounded-3xl font-black text-lg shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                          >
                            {isSubmittingFeedback ? (
                              <Loader2 className="animate-spin" />
                            ) : (
                              <MessageSquare size={20} />
                            )}
                            Submit Review
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-12 text-center"
                    >
                      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <motion.div
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Star
                            size={48}
                            className="text-green-600"
                            fill="currentColor"
                          />
                        </motion.div>
                      </div>
                      <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">
                        Thank You!
                      </h2>
                      <p className="text-gray-500 font-medium mb-2">
                        Your feedback has been submitted successfully.
                      </p>
                      <p className="text-primary font-black uppercase tracking-widest text-[10px]">
                        Refreshing your history...
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Booking Details Modal */}
      <AnimatePresence>
        {showDetailModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetailModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden"
            >
              <div className="p-8 md:p-10 max-h-[90vh] overflow-y-auto scrollbar-hide">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-tight mb-2">
                      Booking{" "}
                      <span className="text-primary italic">Detail</span>
                    </h2>
                    <p className="text-gray-500 font-medium">
                      Information about your reserved experience
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-2xl transition-colors"
                  >
                    <XCircle size={24} className="text-gray-400" />
                  </button>
                </div>

                {isLoadingDetail ? (
                  <div className="py-20 flex flex-col items-center justify-center">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                      Fetching details...
                    </p>
                  </div>
                ) : selectedBookingForDetails ? (
                  <div className="space-y-8">
                    {/* Header Info */}
                    <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start bg-neutral-50 p-6 rounded-[2.5rem] border border-neutral-100">
                      <div className="w-24 h-24 rounded-3xl shrink-0 bg-white shadow-sm flex items-center justify-center text-primary">
                        <Calendar size={40} />
                      </div>
                      <div className="text-center sm:text-left space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-gray-400 text-[10px] font-black uppercase tracking-widest border border-gray-100">
                          Order ID: {selectedBookingForDetails.bookingCode}
                        </div>
                        <h3 className="text-xl font-black text-gray-900 leading-tight">
                          {selectedBookingForDetails.status.replace("_", " ")}
                        </h3>
                        <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-xs font-bold text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <Clock size={14} className="text-primary" />
                            {new Date(
                              selectedBookingForDetails.createdAt,
                            ).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Booking Items / Participants */}
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">
                        Travelers & Packages
                      </h4>
                      <div className="space-y-3">
                        {selectedBookingForDetails.items.map((item) => (
                          <div
                            key={item.id}
                            className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                <Users size={20} />
                              </div>
                              <div>
                                <p className="font-black text-gray-900">
                                  {item.adultQuantity} Adults,{" "}
                                  {item.childQuantity} Children
                                </p>
                                <p className="text-xs text-gray-500 font-medium">
                                  Full package experience
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-black text-primary">
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(item.totalPrice)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="bg-neutral-900 rounded-[2.5rem] p-8 text-white space-y-4 shadow-2xl shadow-neutral-900/20">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-neutral-400 font-bold uppercase tracking-widest">
                          Subtotal
                        </span>
                        <span className="font-black">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(selectedBookingForDetails.totalAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-neutral-400 font-bold uppercase tracking-widest">
                          Discount
                        </span>
                        <span className="font-black text-green-400">
                          -{" "}
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(selectedBookingForDetails.discountAmount)}
                        </span>
                      </div>
                      <div className="h-px bg-neutral-800 my-2" />
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-400 font-black uppercase tracking-widest text-xs">
                          Total Amount
                        </span>
                        <span className="text-3xl font-black text-cta">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(selectedBookingForDetails.finalAmount)}
                        </span>
                      </div>
                    </div>

                    {/* Action */}
                    <button
                      onClick={() => setShowDetailModal(false)}
                      className="w-full py-5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-[2rem] font-black transition-all"
                    >
                      Close Details
                    </button>
                  </div>
                ) : (
                  <div className="py-10 text-center text-gray-400">
                    No details available.
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cancel Confirmation Modal */}
      <AnimatePresence>
        {showCancelModal && selectedBookingForCancel && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCancelModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden"
            >
              <div className="p-8 md:p-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-tight mb-2">
                      {modalLanguage === "vi" ? (
                        <>
                          Hủy{" "}
                          <span className="text-red-500 italic">Đơn đặt</span>
                        </>
                      ) : (
                        <>
                          Cancel{" "}
                          <span className="text-red-500 italic">Booking</span>
                        </>
                      )}
                    </h2>
                    <p className="text-gray-500 font-medium text-sm">
                      {modalLanguage === "vi"
                        ? "Vui lòng xem kỹ chính sách hoàn tiền bên dưới."
                        : "Please review the cancellation policy below."}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => setShowCancelModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-2xl transition-colors"
                    >
                      <XCircle size={24} className="text-gray-400" />
                    </button>
                    {/* Language Toggle */}
                    <div className="flex bg-neutral-100 p-1 rounded-xl border border-neutral-200">
                      <button
                        onClick={() => setModalLanguage("vi")}
                        className={`px-3 py-1 text-[10px] font-black rounded-lg transition-all ${modalLanguage === "vi" ? "bg-white shadow-sm text-primary" : "text-neutral-400"}`}
                      >
                        VN
                      </button>
                      <button
                        onClick={() => setModalLanguage("en")}
                        className={`px-3 py-1 text-[10px] font-black rounded-lg transition-all ${modalLanguage === "en" ? "bg-white shadow-sm text-primary" : "text-neutral-400"}`}
                      >
                        EN
                      </button>
                    </div>
                  </div>
                </div>

                {/* Refund Policy Table */}
                <div className="bg-neutral-50 rounded-3xl p-6 border border-neutral-100 mb-6 space-y-4">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                    {modalLanguage === "vi"
                      ? "Chính sách hủy tour"
                      : "Cancellation Policy"}
                  </h4>
                  <div className="space-y-2">
                    {modalLanguage === "vi"
                      ? [
                          { days: "≥ 15 ngày", fee: "10%", refund: "90%" },
                          { days: "10 - 15 ngày", fee: "50%", refund: "50%" },
                          { days: "7 - 10 ngày", fee: "70%", refund: "30%" },
                          { days: "5 - 7 ngày", fee: "90%", refund: "10%" },
                          { days: "< 5 ngày", fee: "100%", refund: "0%" },
                        ].map((item, i) => (
                          <div
                            key={i}
                            className="flex justify-between items-center text-[11px] font-bold py-1 border-b border-neutral-100 last:border-0"
                          >
                            <span className="text-gray-500">{item.days}</span>
                            <div className="flex gap-4">
                              <span className="text-red-400">
                                Phí: {item.fee}
                              </span>
                              <span className="text-green-500">
                                Hoàn: {item.refund}
                              </span>
                            </div>
                          </div>
                        ))
                      : [
                          { days: "≥ 15 days", fee: "10%", refund: "90%" },
                          { days: "10 - 15 days", fee: "50%", refund: "50%" },
                          { days: "7 - 10 days", fee: "70%", refund: "30%" },
                          { days: "5 - 7 days", fee: "90%", refund: "10%" },
                          { days: "< 5 days", fee: "100%", refund: "0%" },
                        ].map((item, i) => (
                          <div
                            key={i}
                            className="flex justify-between items-center text-[11px] font-bold py-1 border-b border-neutral-100 last:border-0"
                          >
                            <span className="text-gray-500">{item.days}</span>
                            <div className="flex gap-4">
                              <span className="text-red-400">
                                Fee: {item.fee}
                              </span>
                              <span className="text-green-500">
                                Refund: {item.refund}
                              </span>
                            </div>
                          </div>
                        ))}
                  </div>
                </div>

                {/* Specific Refund Calculation */}
                {(() => {
                  const info = calculateRefundAmount(selectedBookingForCancel);
                  return (
                    <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10 mb-8">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                          {modalLanguage === "vi"
                            ? "Dự toán hoàn tiền"
                            : "Refund Projection"}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${info.daysRemaining >= 7 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                        >
                          {modalLanguage === "vi"
                            ? `Còn ${info.daysRemaining} ngày`
                            : `${info.daysRemaining} days left`}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600">
                            {modalLanguage === "vi"
                              ? "Tổng đã thanh toán"
                              : "Total Paid"}
                          </span>
                          <span className="font-bold text-gray-900">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(selectedBookingForCancel.finalAmount)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600">
                            {modalLanguage === "vi"
                              ? `Phí hủy tour (${info.fee}%)`
                              : `Cancellation Fee (${info.fee}%)`}
                          </span>
                          <span className="font-bold text-red-500">
                            -{" "}
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(info.feeAmount)}
                          </span>
                        </div>
                        <div className="h-px bg-primary/10 my-2" />
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-black text-gray-900 font-black uppercase tracking-widest text-xs">
                            {modalLanguage === "vi"
                              ? "Số tiền hoàn lại (Dự kiến)"
                              : "Estimated Refund Amount"}
                          </span>
                          <span className="text-2xl font-black text-primary">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(info.refund)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                <div className="flex gap-4">
                  <button
                    onClick={() => setShowCancelModal(false)}
                    className="flex-1 py-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-2xl font-black text-sm transition-all"
                  >
                    {modalLanguage === "vi" ? "Giữ lại tour" : "Keep Booking"}
                  </button>
                  <button
                    onClick={() =>
                      handleCancelBooking(selectedBookingForCancel.id)
                    }
                    disabled={isProcessing === selectedBookingForCancel.id}
                    className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-red-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    {isProcessing === selectedBookingForCancel.id ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : modalLanguage === "vi" ? (
                      "Xác nhận hủy"
                    ) : (
                      "Confirm Cancellation"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Status Modal (Success/Error) */}
      <AnimatePresence>
        {statusModal.isOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setStatusModal({ ...statusModal, isOpen: false })}
              className="absolute inset-0 bg-black/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden text-center p-10"
            >
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                  statusModal.type === "success"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {statusModal.type === "success" ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12 }}
                  >
                    <Star size={40} fill="currentColor" />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ rotate: -45, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                  >
                    <AlertCircle size={40} />
                  </motion.div>
                )}
              </div>

              <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">
                {statusModal.message}
              </h3>
              <p className="text-gray-500 font-medium mb-8">
                {statusModal.description}
              </p>

              <button
                onClick={() =>
                  setStatusModal({ ...statusModal, isOpen: false })
                }
                className={`w-full py-4 rounded-2xl font-black text-sm shadow-xl transition-all active:scale-95 ${
                  statusModal.type === "success"
                    ? "bg-primary text-white shadow-primary/20 hover:bg-primary-dark"
                    : "bg-gray-900 text-white shadow-black/20 hover:bg-black"
                }`}
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyBookings;
