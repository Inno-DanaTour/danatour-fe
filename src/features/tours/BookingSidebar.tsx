import React, { useState } from "react";
import { Tour } from "../../types/types";
import { Users, Calendar, ShieldCheck, Minus, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BookingSidebarProps {
  tour: Tour;
}

const BookingSidebar: React.FC<BookingSidebarProps> = ({ tour }) => {
  const navigate = useNavigate();
  const [guestCount, setGuestCount] = useState(2);
  const [date, setDate] = useState("2024-10-24");

  const handleBookNow = () => {
    navigate("/checkout", {
      state: {
        tour,
        guestCount,
        date,
      },
    });
  };

  return (
    <>
      <div className="card space-y-6 sticky top-24 border-2 border-primary/10">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-xs text-gray-500 block uppercase font-bold tracking-wider">
              Starting from
            </span>
            <span className="text-3xl font-black text-cta">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(tour.price)}
            </span>
          </div>
          <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-bold">
            Best Price
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
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-transparent font-bold text-gray-900 border-none p-0 focus:ring-0 cursor-pointer"
              >
                <option value="2024-10-24">Oct 24, 2024</option>
                <option value="2024-10-25">Oct 25, 2024</option>
                <option value="2024-10-26">Oct 26, 2024</option>
              </select>
            </div>

            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2 text-gray-600 font-medium">
                <Users size={18} />
                <span>Guests</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center font-bold hover:border-primary hover:text-primary transition-colors bg-white shadow-sm"
                >
                  <Minus size={14} />
                </button>
                <span className="font-bold text-gray-900 w-4 text-center">
                  {guestCount}
                </span>
                <button
                  onClick={() => setGuestCount(guestCount + 1)}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center font-bold hover:border-primary hover:text-primary transition-colors bg-white shadow-sm"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleBookNow}
            className="btn-primary w-full py-4 text-lg shadow-lg shadow-cta/20 rounded-2xl"
          >
            Book Now
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
    </>
  );
};

export default BookingSidebar;
