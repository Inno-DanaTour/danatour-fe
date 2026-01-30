import React from "react";
import { Tour } from "../types";
import { Users, Calendar, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BookingSidebarProps {
  tour: Tour;
}

const BookingSidebar: React.FC<BookingSidebarProps> = ({ tour }) => {
  const navigate = useNavigate();

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
              <select className="bg-transparent font-bold text-gray-900 border-none p-0 focus:ring-0 cursor-pointer">
                <option>Oct 24, 2024</option>
                <option>Oct 25, 2024</option>
                <option>Oct 26, 2024</option>
              </select>
            </div>

            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2 text-gray-600 font-medium">
                <Users size={18} />
                <span>Guests</span>
              </div>
              <div className="flex items-center gap-3">
                <button className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center font-bold hover:border-primary hover:text-primary transition-colors">
                  -
                </button>
                <span className="font-bold text-gray-900">2</span>
                <button className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center font-bold hover:border-primary hover:text-primary transition-colors">
                  +
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/tours")}
            className="btn-primary w-full py-4 text-lg shadow-lg shadow-cta/20"
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
