import React from "react";
import { Tour } from "../../types/types";
import { MapPin, Clock, Star } from "lucide-react";
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
        className={`p-6 ${isGrid ? "w-full" : "w-2/3"} flex flex-col justify-between`}
      >
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
              {tour.name}
            </h3>
            <div className="flex items-center gap-1 text-yellow-500 font-bold">
              <Star size={16} fill="currentColor" />
              <span>{tour.rating}</span>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {tour.description}
          </p>

          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>{tour.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={16} />
              <span>Da Nang</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div>
            <span className="text-xs text-gray-500 block uppercase font-semibold">
              From
            </span>
            <span className="text-2xl font-black text-primary">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(tour.price)}
            </span>
          </div>
          <button className="btn-primary py-2 px-6">View Detail</button>
        </div>
      </div>
    </motion.div>
  );
};

export default TourCard;
