import React, { useRef, useState, useEffect } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { LocationData, ZoneType } from "../types";
import { COLORS } from "../constants";
import { MapPin, ArrowRight, Star, Disc } from "lucide-react";
import LottieAnimation from "./LottieAnimation";

interface CheckpointProps {
  data: LocationData;
  index: number;
  onUnlock: (id: string) => void;
}

const Checkpoint: React.FC<CheckpointProps> = ({ data, index, onUnlock }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-20% 0px -30% 0px", once: false });
  const hasUnlocked = useRef(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Sound Effect
  const playUnlockSound = () => {
    const audio = new Audio(
      "https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3",
    ); // Success Chime
    audio.volume = 0.5;
    audio
      .play()
      .catch((e) =>
        console.log("Audio play failed (interaction required):", e),
      );
  };

  useEffect(() => {
    if (isInView && !hasUnlocked.current) {
      hasUnlocked.current = true;
      setIsUnlocked(true);
      onUnlock(data.id);
      playUnlockSound();
    }
  }, [isInView, data.id, onUnlock]);

  const isLeft = data.alignment === "left";
  const colors = COLORS[data.zone];

  // Parallax / Tilt effect variables
  const mouseX = useSpring(0, { stiffness: 50, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 50, damping: 20 });

  function handleMouseMove(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) {
    const { left, top, width, height } =
      event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - left) / width - 0.5;
    const y = (event.clientY - top) / height - 0.5;
    mouseX.set(x * 10); // Rotate X
    mouseY.set(y * 10); // Rotate Y
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <div
      ref={ref}
      className={`absolute w-full max-w-6xl mx-auto flex ${isLeft ? "justify-start" : "justify-end"} items-center px-4 md:px-12 pointer-events-none perspective-1000`}
      style={{ top: `${data.positionY}%`, left: 0, right: 0 }}
    >
      {/* Connector Line to path (Visual only) */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: isInView ? 1 : 0, opacity: isInView ? 1 : 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className={`hidden lg:block absolute top-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-${colors.accent}/50 to-transparent ${isLeft ? "right-1/2 mr-4 origin-right" : "left-1/2 ml-4 origin-left"}`}
      />

      <motion.div
        initial={{
          opacity: 0,
          rotateY: isLeft ? -90 : 90,
          x: isLeft ? -100 : 100,
        }}
        animate={
          isInView
            ? { opacity: 1, rotateY: 0, x: 0 }
            : { opacity: 0, rotateY: isLeft ? -45 : 45, x: isLeft ? -50 : 50 }
        }
        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        className="pointer-events-auto relative z-10 w-full md:w-[480px] perspective-1000"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Glass Card */}
        <motion.div
          style={{
            rotateX: mouseY,
            rotateY: mouseX,
            transformStyle: "preserve-3d",
          }}
          className="group relative overflow-hidden rounded-[2rem] bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-2xl hover:border-white/30 transition-all duration-300"
        >
          {/* Unlock Flash Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isUnlocked ? { opacity: [0, 0.4, 0] } : {}}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 bg-white z-50 pointer-events-none mix-blend-overlay"
          />

          {/* Image Header */}
          <div className="h-56 overflow-hidden relative">
            <motion.img
              src={data.image}
              alt={data.name}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.8 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />

            <div className="absolute top-4 right-4 z-20">
              {isUnlocked ? (
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                  {/* Using a checkmark lottie or icon */}
                  <LottieAnimation
                    src="https://assets2.lottiefiles.com/packages/lf20_s2lryxtd.json"
                    loop={false}
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full border-2 border-dashed border-white/30 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-white/30" />
                </div>
              )}
            </div>

            <div className="absolute bottom-4 left-6 right-6">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-2 py-0.5 mb-2 text-[10px] font-bold uppercase tracking-wider rounded text-black shadow-lg"
                style={{ backgroundColor: colors.accent }}
              >
                {data.zone} ZONE
              </motion.span>
              <h3 className="text-3xl font-black text-white font-display leading-none drop-shadow-lg">
                {data.name}
              </h3>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-6 relative bg-gradient-to-b from-transparent to-black/20">
            <p className="text-sm text-gray-200 mb-6 leading-relaxed font-light">
              {data.description}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {data.stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 rounded-xl p-3 border border-white/5 hover:bg-white/10 transition-colors"
                >
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">
                    {stat.label}
                  </p>
                  <p className="text-sm font-bold text-white tracking-wide">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Action Button */}
            <button className="w-full group/btn relative overflow-hidden flex items-center justify-between py-3 px-4 rounded-xl bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 transition-all border border-white/10">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 ease-in-out" />
              <span className="text-sm font-bold text-white tracking-wide">
                Start Adventure
              </span>
              <div className="bg-white/10 p-1.5 rounded-lg group-hover/btn:translate-x-1 transition-transform">
                <ArrowRight size={14} className="text-white" />
              </div>
            </button>
          </div>
        </motion.div>

        {/* Floating 3D-ish marker on the side */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 ${isLeft ? "-right-16 lg:-right-32" : "-left-16 lg:-left-32"} hidden md:flex flex-col items-center justify-center gap-2`}
        >
          <motion.div
            animate={
              isInView ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] } : {}
            }
            transition={{ repeat: Infinity, duration: 4 }}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)] backdrop-blur-md border-2 z-10`}
            style={{
              borderColor: isInView ? colors.accent : "rgba(255,255,255,0.1)",
              backgroundColor: isInView ? `${colors.accent}20` : "transparent",
            }}
          >
            {isUnlocked ? (
              <Star size={28} className="text-[#FFC857] fill-[#FFC857]" />
            ) : (
              <MapPin
                size={28}
                className={isInView ? "text-white" : "text-gray-600"}
                style={{ color: isInView ? colors.accent : undefined }}
              />
            )}
          </motion.div>
          {isInView && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-2 py-1 rounded-md bg-black/60 backdrop-blur text-[10px] font-mono text-white whitespace-nowrap border border-white/10"
            >
              CP-{index + 1}
            </motion.div>
          )}

          {/* Connector pulse */}
          {isInView && (
            <motion.div
              className="absolute inset-0 rounded-full border border-white/30"
              animate={{ scale: [1, 2], opacity: [0.5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Checkpoint;
