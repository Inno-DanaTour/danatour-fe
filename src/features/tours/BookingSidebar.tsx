import React, { useState } from "react";
import { Tour } from "../../pages/tours/types";
import { Users, User, Calendar, ShieldCheck, Minus, Plus } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { bookingService } from "../../pages/checkout/services/bookingService";
import { getToken } from "../../configs/api";
import ActiveBookingModal from "./ActiveBookingModal";

interface BookingSidebarProps {
  tour: Tour;
}

const BookingSidebar: React.FC<BookingSidebarProps> = ({ tour }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [adults, setAdults] = useState(
    parseInt(searchParams.get("adults") || "1", 10),
  );
  const [children, setChildren] = useState(
    parseInt(searchParams.get("children") || "0", 10),
  );
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(
    tour.schedules && tour.schedules.length > 0 ? tour.schedules[0].id : null,
  );
  const [isChecking, setIsChecking] = useState(false);
  const [showActiveBookingModal, setShowActiveBookingModal] = useState(false);

  const handleBookNow = async () => {
    if (!selectedScheduleId) {
      alert("Please select a date first.");
      return;
    }

    if (getToken()) {
      try {
        setIsChecking(true);
        const hasActive = await bookingService.checkActiveBooking(selectedScheduleId);
        if (hasActive) {
          setShowActiveBookingModal(true);
          return;
        }
      } catch (error) {
        console.error("Check active booking failed:", error);
      } finally {
        setIsChecking(false);
      }
    }

    navigate("/checkout", {
      state: {
        tour,
        adults,
        children,
        scheduleId: selectedScheduleId,
      },
    });
  };

  return (
    <>
      <div id="booking-sidebar" className="card space-y-6 sticky top-24 border-2 border-primary/10">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-xs text-gray-500 block uppercase font-bold tracking-wider">
              Starting from
            </span>
            <span className="text-3xl font-black text-cta">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(tour.adultPrice)}
            </span>
          </div>
          <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-bold">
            Best Price
          </div>
        </div>

        {/* Price breakdown */}
        <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400">
            Price Details
          </p>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">👤 Adult</span>
            <span className="font-black text-gray-900">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(tour.adultPrice)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">
              🧒 Children
            </span>
            <span className="font-black text-gray-900">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(tour.childrenPrice)}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-xl space-y-3">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2 text-gray-600 font-medium">
                <Calendar size={18} />
                <span>Date</span>
              </div>
              <select
                value={selectedScheduleId || ""}
                onChange={(e) => setSelectedScheduleId(Number(e.target.value))}
                className="bg-transparent font-bold text-gray-900 border-none p-0 focus:ring-0 cursor-pointer text-sm"
              >
                {tour.schedules && tour.schedules.length > 0 ? (
                  tour.schedules.map((s) => (
                    <option key={s.id} value={s.id}>
                      {new Date(s.startDate).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      ({s.availableSlots} / {s.capacity} left)
                    </option>
                  ))
                ) : (
                  <option value="">No dates available</option>
                )}
              </select>
            </div>

            <div className="space-y-4 pt-2 border-t border-gray-100">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2 text-gray-600 font-medium">
                  <User size={18} />
                  <span>Adults</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center font-bold hover:border-primary hover:text-primary transition-colors bg-white shadow-sm"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="font-bold text-gray-900 w-4 text-center">
                    {adults}
                  </span>
                  <button
                    onClick={() => setAdults(adults + 1)}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center font-bold hover:border-primary hover:text-primary transition-colors bg-white shadow-sm"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2 text-gray-600 font-medium">
                  <Users size={18} />
                  <span>Children</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setChildren(Math.max(0, children - 1))}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center font-bold hover:border-primary hover:text-primary transition-colors bg-white shadow-sm"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="font-bold text-gray-900 w-4 text-center">
                    {children}
                  </span>
                  <button
                    onClick={() => setChildren(children + 1)}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center font-bold hover:border-primary hover:text-primary transition-colors bg-white shadow-sm"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleBookNow}
            disabled={isChecking}
            className="btn-primary w-full py-4 text-lg shadow-lg shadow-cta/20 rounded-2xl flex items-center justify-center gap-2"
          >
            {isChecking ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Checking...
              </span>
            ) : (
              "Book Now"
            )}
          </button>
        </div>

        <p className="text-xs text-center text-gray-400">
          You won't be charged yet
        </p>

        <div className="pt-6 border-t border-gray-100 flex items-center gap-3 text-sm text-gray-600">
          <ShieldCheck className="text-green-500" size={20} />
          <span>Secure & Safe Booking Guarantee</span>
        </div>
      </div>

      <ActiveBookingModal
        isOpen={showActiveBookingModal}
        onClose={() => setShowActiveBookingModal(false)}
      />
    </>
  );
};

export default BookingSidebar;
