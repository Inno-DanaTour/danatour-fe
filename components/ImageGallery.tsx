import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="space-y-4">
      {/* Featured Image */}
      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-lg group">
        <motion.img
          key={activeIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          src={images[activeIndex]}
          alt="Tour Gallery"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between px-4">
          <button
            onClick={() => setActiveIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
            className="p-2 bg-white/90 rounded-full text-gray-900 shadow-lg hover:bg-white transition-all transform hover:scale-110"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => setActiveIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
            className="p-2 bg-white/90 rounded-full text-gray-900 shadow-lg hover:bg-white transition-all transform hover:scale-110"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
              activeIndex === idx ? "border-primary opacity-100 scale-105" : "border-transparent opacity-60 hover:opacity-80"
            }`}
          >
            <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
