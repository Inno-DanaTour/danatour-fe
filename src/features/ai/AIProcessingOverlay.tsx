import React from "react";
import { motion } from "framer-motion";
import { Compass } from "lucide-react";

interface AIProcessingOverlayProps {
  isVisible: boolean;
}

const AIProcessingOverlay: React.FC<AIProcessingOverlayProps> = ({
  isVisible,
}) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Aurora gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#004E89] via-[#1A103C] to-[#064E3B] opacity-95" />

      {/* Animated aurora blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#4FD1C5]/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1.2, 1, 1.2],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#D946EF]/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 right-1/3 w-64 h-64 bg-[#FFC857]/20 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Animated compass */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 mb-8 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
        >
          <Compass size={48} className="text-[#FFC857]" />
        </motion.div>

        {/* Processing text */}
        <motion.h2
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-2xl md:text-3xl font-bold text-white mb-4 font-display"
        >
          Creating Your Journey
        </motion.h2>

        <p className="text-gray-300 text-lg mb-6">
          Our AI is crafting the perfect personalized route...
        </p>

        {/* Loading dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-3 h-3 rounded-full bg-[#FFC857]"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default AIProcessingOverlay;
