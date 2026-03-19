import React from "react";
import { Tour } from "../../pages/tours/types";
import { MapPin, Clock, Star, LayoutGrid } from "lucide-react";
import { motion } from "framer-motion";

interface TourCardProps {
  tour: Tour;
  viewType: "grid" | "list";
}

const TourCard: React.FC<TourCardProps> = ({ tour, viewType }) => {
  const isGrid = viewType === "grid";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card ${isGrid ? "flex flex-col" : "flex flex-row gap-6"} cursor-pointer overflow-hidden p-0`}
      onClick={() => (window.location.href = `/tours/${tour.id}`)}
    >
      <div
        className={`${isGrid ? "w-full h-48" : "w-1/3 h-64"} overflow-hidden relative`}
      >
        <img
          src={tour.image}
          alt={tour.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm">
          {tour.zone}
        </div>
      </div>

      <div
        className={`p-5 ${isGrid ? "w-full" : "w-2/3"} flex flex-col justify-between`}
      >
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors leading-tight">
              {tour.name}
            </h3>
            <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
              <Star size={14} fill="currentColor" />
              <span>{tour.rating > 0 ? tour.rating.toFixed(1) : "0.0"}</span>
              <span className="text-gray-400 font-normal text-xs ml-0.5">
                ({tour.reviewCount})
              </span>
            </div>
          </div>

          <p className="text-gray-500 text-xs mb-3 line-clamp-2 leading-relaxed">
            {tour.description}
          </p>

          <div className="flex flex-wrap gap-3 text-xs text-gray-400 mb-3">
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{tour.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={14} />
              <span>{tour.zone}</span>
            </div>
            {tour.capacity !== undefined && (
              <div className="flex items-center gap-1 text-primary font-bold">
                <LayoutGrid size={14} />
                <span>
                  {tour.availableSlots}/{tour.capacity} left
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div>
            <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">
              From
            </span>
            <span className="text-xl font-black text-primary">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(tour.adultPrice)}
            </span>
          </div>
          <button className="btn-primary py-1.5 px-5 text-xs">Details</button>
        </div>
      </div>
    </motion.div>
  );
};

export default TourCard;
