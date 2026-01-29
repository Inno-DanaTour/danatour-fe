import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { LocationData, ZoneType } from "../types";
import { COLORS } from "../constants";
import { MapPin, ArrowRight, Star } from "lucide-react";

interface CheckpointProps {
  data: LocationData;
  index: number;
  onUnlock: (id: string) => void;
}

const Checkpoint: React.FC<CheckpointProps> = ({ data, index, onUnlock }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-20% 0px -20% 0px", once: false });
  const hasUnlocked = useRef(false);

  if (isInView && !hasUnlocked.current) {
    hasUnlocked.current = true;
    onUnlock(data.id);
  }

  const isLeft = data.alignment === "left";
  const colors = COLORS[data.zone];

  return (
    <div
      ref={ref}
      className={`absolute w-full max-w-6xl mx-auto flex ${isLeft ? "justify-start" : "justify-end"} items-center px-4 md:px-12 pointer-events-none`}
      style={{ top: `${data.positionY}%`, left: 0, right: 0 }}
    >
      {/* Connector Line to path (Visual only) */}
      <div
        className={`hidden lg:block absolute top-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-${colors.accent}/50 to-transparent ${isLeft ? "right-1/2 mr-4" : "left-1/2 ml-4"}`}
      />

      <motion.div
        initial={{ opacity: 0, x: isLeft ? -50 : 50, scale: 0.9 }}
        animate={
          isInView
            ? { opacity: 1, x: 0, scale: 1 }
            : { opacity: 0.3, x: isLeft ? -20 : 20, scale: 0.95 }
        }
        transition={{ duration: 0.6, type: "spring" }}
        className="pointer-events-auto relative z-10 w-full md:w-[450px]"
      >
        {/* Glass Card */}
        <div className="group relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-2xl hover:border-white/30 transition-all duration-300">
          {/* Image Header */}
          <div className="h-48 overflow-hidden relative">
            <img
              src={data.image}
              alt={data.name}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

            <div className="absolute bottom-4 left-4">
              <span className="inline-block px-2 py-1 mb-2 text-[10px] font-bold uppercase tracking-wider rounded text-black bg-[#FFC857]">
                {data.zone} ZONE
              </span>
              <h3 className="text-2xl font-bold text-white font-display leading-none">
                {data.name}
              </h3>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-6">
            <p
              className="text-sm text-gray-300 mb-6 leading-relaxed border-l-2 pl-3"
              style={{ borderColor: colors.accent }}
            >
              {data.description}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {data.stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 rounded-lg p-2 border border-white/5"
                >
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                    {stat.label}
                  </p>
                  <p className="text-sm font-semibold text-white">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Action Button */}
            <button className="w-full group/btn flex items-center justify-between py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/5">
              <span className="text-sm font-medium text-white">
                Explore Details
              </span>
              <div className="bg-white/10 p-1.5 rounded-lg group-hover/btn:translate-x-1 transition-transform">
                <ArrowRight size={14} className="text-white" />
              </div>
            </button>
          </div>

          {/* Decor element */}
          <div
            className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20 blur-2xl"
            style={{ backgroundColor: colors.accent }}
          />
        </div>

        {/* Floating 3D-ish marker on the side */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 ${isLeft ? "-right-16 lg:-right-32" : "-left-16 lg:-left-32"} hidden md:flex flex-col items-center justify-center gap-2`}
        >
          <motion.div
            animate={
              isInView ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] } : {}
            }
            transition={{ repeat: Infinity, duration: 4 }}
            className="w-12 h-12 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)] backdrop-blur-sm border-2"
            style={{
              borderColor: colors.accent,
              backgroundColor: isInView ? colors.accent : "transparent",
            }}
          >
            <MapPin
              size={24}
              className={isInView ? "text-black" : colors.text}
            />
          </motion.div>
          {isInView && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-2 py-1 rounded bg-black/80 text-[10px] text-white whitespace-nowrap"
            >
              CHECKPOINT {index + 1}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Checkpoint;
