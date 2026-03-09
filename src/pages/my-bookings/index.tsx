import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  ArrowRight,
  XCircle,
  AlertCircle,
  Clock,
  Loader2,
} from "lucide-react";
import Header from "../../components/layout/Header";
import { bookingService, BookingResponse } from "../../services/bookingService";

const MyBookings: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await bookingService.getAllBookings();
      setBookings(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch bookings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async (id: number) => {
    if (
      window.confirm(
        "Are you sure you want to cancel this booking? Slot will be released.",
      )
    ) {
      setIsProcessing(id);
      try {
        await bookingService.cancelBooking(id);
        setBookings((prev) =>
          prev.map((b) =>
            b.id === id ? { ...b, status: "CANCELLED" } : b,
          ),
        );
        alert("Booking cancelled successfully!");
      } catch (err: any) {
        alert(err.message || "Failed to cancel booking. Please try again.");
      } finally {
        setIsProcessing(null);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-600";
      case "PENDING_PAYMENT":
        return "bg-blue-100 text-blue-600";
      case "CANCELLED":
        return "bg-red-100 text-red-600";
      case "COMPLETED":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header onBookClick={() => navigate("/tours")} />

      <main className="pt-24 md:pt-32 px-4 md:px-6 max-w-5xl mx-auto">
        <header className="mb-12">
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-2">
            My <span className="text-primary">Trip Bookings</span>
          </h1>
          <p className="text-gray-500 font-medium">
            Manage your reservations, view tickets, or handle cancellations.
          </p>
        </header>

        <div className="space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
              <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
              <p className="text-gray-500 font-bold">Loading your bookings...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-red-50 rounded-[3rem] border-2 border-dashed border-red-100">
               <AlertCircle size={48} className="mx-auto text-red-300 mb-4" />
               <h3 className="text-xl font-bold text-red-400">{error}</h3>
               <button onClick={fetchBookings} className="mt-6 btn-primary px-10 py-3">Try Again</button>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
              <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-400">
                No bookings yet
              </h3>
              <button
                onClick={() => navigate("/tours")}
                className="mt-6 btn-primary px-10 py-3"
              >
                Explore Tours
              </button>
            </div>
          ) : (
            bookings.map((booking, idx) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-[2rem] p-6 md:p-8 shadow-xl shadow-black/5 border border-gray-100 flex flex-col md:flex-row gap-8 items-center"
              >
                {/* Tour Image (Placeholder as Backend doesn't provide tour details yet) */}
                <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden shrink-0 bg-gray-100 flex items-center justify-center">
                  <Calendar className="w-12 h-12 text-gray-200" />
                </div>

                {/* Info */}
                <div className="flex-grow space-y-3 text-center md:text-left">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <span
                      className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(booking.status)}`}
                    >
                      {booking.status.replace("_", " ")}
                    </span>
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                      CODE: {booking.bookingCode}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900">
                    Tour Schedule #{booking.scheduleId}
                  </h3>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-500 text-sm">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={16} className="text-primary" />
                      <span>
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users size={16} className="text-primary" />
                      <span>{booking.adults} Adults, {booking.children} Children</span>
                    </div>
                  </div>
                </div>

                {/* Pricing & Actions */}
                <div className="shrink-0 flex flex-col items-center md:items-end gap-4 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8 w-full md:w-auto">
                  <div className="text-center md:text-right">
                    <span className="text-xs text-gray-400 font-bold uppercase block">
                      Total Price
                    </span>
                    <span className="text-2xl font-black text-cta">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(booking.finalAmount)}
                    </span>
                  </div>

                  <div className="flex gap-2 w-full">
                    {booking.status !== "CANCELLED" && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        disabled={isProcessing === booking.id}
                        className="flex-grow md:flex-grow-0 p-3 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 transition-all flex items-center justify-center gap-2 font-bold text-sm disabled:opacity-50"
                      >
                        {isProcessing === booking.id ? (
                          <Loader2 className="w-4.5 h-4.5 animate-spin" />
                        ) : (
                          <XCircle size={18} />
                        )}
                        {isProcessing === booking.id ? "Processing..." : "Cancel"}
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/tours`)}
                      className="flex-grow md:flex-grow-0 p-3 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 font-bold text-sm"
                    >
                      View Details
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Support Section */}
        <section className="mt-20 p-8 md:p-12 bg-blue-600 rounded-[3rem] text-white flex flex-col md:flex-row items-center gap-10">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-black">Need any help?</h2>
            <p className="text-blue-100 max-w-md">
              Our support team is available 24/7 to assist you with your travel
              plans and bookings.
            </p>
          </div>
          <div className="flex-grow"></div>
          <button className="bg-white text-blue-600 px-10 py-4 rounded-2xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all">
            Contact Support
          </button>
        </section>
      </main>
    </div>
  );
};

export default MyBookings;
