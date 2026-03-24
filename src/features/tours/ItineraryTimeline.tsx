import React from "react";
import { ItineraryItem } from "../../pages/home/types";
import { motion } from "framer-motion";

interface ItineraryTimelineProps {
  items: ItineraryItem[];
}

const ItineraryTimeline: React.FC<ItineraryTimelineProps> = ({ items }) => {
  return (
    <div className="space-y-8">
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="flex gap-6 items-start group"
        >
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shadow-md group-hover:scale-110 transition-transform">
              {item.day}
            </div>
            {index !== items.length - 1 && (
              <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
            )}
          </div>

          <div className="pb-8">
            <h4 className="text-xl font-bold text-gray-900 mb-2">
              {item.title}
            </h4>
            <p className="text-gray-600 leading-relaxed">{item.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ItineraryTimeline;
