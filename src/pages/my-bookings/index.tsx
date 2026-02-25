import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  ArrowRight,
  XCircle,
  AlertCircle,
  Clock,
} from "lucide-react";
import Header from "../../components/layout/Header";
import { Booking, BookingStatus } from "../../types/types";

// Mock Data
const MOCK_BOOKINGS: Booking[] = [
  {
    id: "BK-8821",
    userId: "u1",
    tourId: "1",
    tourName: "Da Nang Coastal Adventure",
    tourImage:
      "https://excursionmania.com/cdn-cgi/image/quality=75,format=webp,w=auto,h=auto,fit=scale-down,trim=border/https://excursionmania.com/uploads/blog/gallery/4749/17654254351.jpg",
    scheduleId: "s1",
    guestCount: 2,
    totalPrice: 2450000,
    status: BookingStatus.CONFIRMED,
    createdAt: "2024-03-20T10:00:00Z",
    startDate: "2024-04-15T08:00:00Z",
  },
  {
    id: "BK-8822",
    userId: "u1",
    tourId: "2",
    tourName: "Marble Mountains & Hoi An Evening",
    tourImage:
      "https://vietnam.travel/sites/default/files/inline-images/marble%20mountain%20da%20nang-5.jpg",
    scheduleId: "s2",
    guestCount: 3,
    totalPrice: 4550000,
    status: BookingStatus.PENDING,
    createdAt: "2024-03-22T14:30:00Z",
    startDate: "2024-04-10T13:00:00Z",
  },
];

const MyBookings: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);

  const handleCancelBooking = (id: string, startDate: string) => {
    // BR-105: Check if > 24h before departure
    const start = new Date(startDate);
    const now = new Date();
    const diffHours = (start.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffHours < 24) {
      alert("Cannot cancel booking within 24 hours of departure.");
      return;
    }

    if (
      window.confirm(
        "Are you sure you want to cancel this booking? Slot will be released.",
      )
    ) {
      setBookings((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, status: BookingStatus.CANCELLED } : b,
        ),
      );
      // Revert slots mock
      console.log(`Reverting slots for booking ${id}`);
    }
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return "bg-green-100 text-green-600";
      case BookingStatus.PENDING:
        return "bg-blue-100 text-blue-600";
      case BookingStatus.CANCELLED:
        return "bg-red-100 text-red-600";
      case BookingStatus.COMPLETED:
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
          {bookings.map((booking, idx) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-[2rem] p-6 md:p-8 shadow-xl shadow-black/5 border border-gray-100 flex flex-col md:flex-row gap-8 items-center"
            >
              {/* Tour Image */}
              <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden shrink-0">
                <img
                  src={booking.tourImage}
                  className="w-full h-full object-cover"
                  alt={booking.tourName}
                />
              </div>

              {/* Info */}
              <div className="flex-grow space-y-3 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <span
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(booking.status)}`}
                  >
                    {booking.status}
                  </span>
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                    ID: {booking.id}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900">
                  {booking.tourName}
                </h3>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-500 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={16} className="text-primary" />
                    <span>
                      {new Date(booking.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={16} className="text-primary" />
                    <span>08:00 AM</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users size={16} className="text-primary" />
                    <span>{booking.guestCount} Guests</span>
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
                    }).format(booking.totalPrice)}
                  </span>
                </div>

                <div className="flex gap-2 w-full">
                  {booking.status !== BookingStatus.CANCELLED && (
                    <button
                      onClick={() =>
                        handleCancelBooking(booking.id, booking.startDate)
                      }
                      className="flex-grow md:flex-grow-0 p-3 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 transition-all flex items-center justify-center gap-2 font-bold text-sm"
                    >
                      <XCircle size={18} />
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={() => navigate(`/tours/${booking.tourId}`)}
                    className="flex-grow md:flex-grow-0 p-3 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 font-bold text-sm"
                  >
                    View Tour
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          {bookings.length === 0 && (
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
