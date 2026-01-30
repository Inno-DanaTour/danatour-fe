import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZoneType } from "../types";
import { COLORS } from "../constants";

interface BackgroundProps {
  currentZone: ZoneType;
}

const Particle: React.FC<{ zone: ZoneType; index: number }> = ({
  zone,
  index,
}) => {
  const randomX = useMemo(() => Math.random() * 100, []);
  const randomDelay = useMemo(() => Math.random() * 5, []);
  const randomDuration = useMemo(() => 5 + Math.random() * 10, []);
  const size = useMemo(() => 2 + Math.random() * 4, []);

  // Sea: Bubbles rising
  if (zone === ZoneType.SEA) {
    return (
      <motion.div
        className="absolute rounded-full bg-white/20"
        style={{
          left: `${randomX}%`,
          width: size,
          height: size,
        }}
        initial={{ y: "110vh", opacity: 0 }}
        animate={{
          y: "-10vh",
          opacity: [0, 0.4, 0],
          x: [`${randomX}%`, `${randomX + (index % 2 === 0 ? 5 : -5)}%`],
        }}
        transition={{
          duration: randomDuration,
          repeat: Infinity,
          delay: randomDelay,
          ease: "linear",
        }}
      />
    );
  }

  // City: Horizontal lights / traffic
  if (zone === ZoneType.CITY) {
    return (
      <motion.div
        className="absolute rounded-full"
        style={{
          top: `${randomX}%`, // using X as Y here for random vertical placement
          height: size / 2,
          width: size * 10,
          background: index % 2 === 0 ? COLORS[ZoneType.CITY].accent : "#fff",
        }}
        initial={{ x: "-100vw", opacity: 0 }}
        animate={{
          x: "100vw",
          opacity: [0, 0.5, 0],
        }}
        transition={{
          duration: randomDuration * 0.5,
          repeat: Infinity,
          delay: randomDelay,
          ease: "linear",
        }}
      />
    );
  }

  // Mountain: Fireflies
  if (zone === ZoneType.MOUNTAIN) {
    return (
      <motion.div
        className="absolute rounded-full bg-[#FFC857]"
        style={{
          left: `${randomX}%`,
          top: `${Math.random() * 100}%`,
          width: size,
          height: size,
          boxShadow: "0 0 10px #FFC857",
        }}
        animate={{
          x: [0, 30, -30, 0],
          y: [0, -30, 30, 0],
          opacity: [0.2, 0.8, 0.2],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: randomDuration,
          repeat: Infinity,
          delay: randomDelay,
          ease: "easeInOut",
        }}
      />
    );
  }

  return null;
};

const Background: React.FC<BackgroundProps> = ({ currentZone }) => {
  // Generate a consistent set of particles
  const particles = useMemo(() => Array.from({ length: 20 }), []);

  return (
    <div
      className="fixed inset-0 z-0 transition-colors duration-[1500ms] ease-in-out pointer-events-none overflow-hidden"
      style={{ backgroundColor: COLORS[currentZone].bg }}
    >
      {/* Ambient Gradients - Enhanced Parallax */}
      <motion.div
        className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full opacity-30 blur-[100px]"
        animate={{
          backgroundColor:
            currentZone === ZoneType.SEA
              ? "#155E75"
              : currentZone === ZoneType.CITY
                ? "#4C1D95"
                : "#065F46",
          scale: [1, 1.1, 1],
          rotate: [0, 20, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "mirror" }}
      />

      <motion.div
        className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full opacity-20 blur-[120px]"
        animate={{
          backgroundColor:
            currentZone === ZoneType.SEA
              ? "#0EA5E9"
              : currentZone === ZoneType.CITY
                ? "#DB2777"
                : "#D97706",
          scale: [1, 1.2, 1],
          x: [0, -50, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, repeatType: "mirror" }}
      />

      {/* Dynamic Particles Layer */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          {currentZone === ZoneType.SEA && (
            <motion.div
              key="sea-particles"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              {particles.map((_, i) => (
                <Particle key={`sea-${i}`} zone={ZoneType.SEA} index={i} />
              ))}
            </motion.div>
          )}

          {currentZone === ZoneType.CITY && (
            <motion.div
              key="city-particles"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              {particles.map((_, i) => (
                <Particle key={`city-${i}`} zone={ZoneType.CITY} index={i} />
              ))}
            </motion.div>
          )}

          {currentZone === ZoneType.MOUNTAIN && (
            <motion.div
              key="mtn-particles"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              {particles.map((_, i) => (
                <Particle key={`mtn-${i}`} zone={ZoneType.MOUNTAIN} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Noise Overlay for texture */}
      <div
        className="absolute inset-0 opacity-[0.03] z-[1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};

export default Background;
