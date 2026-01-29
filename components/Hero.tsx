import React from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

interface HeroProps {
  onStart: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden z-20">
      {/* Cinematic Background Simulation */}
      <div className="absolute inset-0 bg-black">
        <img
          src="https://i.ibb.co/fTrQBb2/vivu-vietnam-5x-Fmn-s4dmg-unsplash.jpg"
          alt="Da Nang Aerial"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#004E89] mix-blend-multiply" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <span className="text-accent tracking-[0.3em] text-sm md:text-base font-bold uppercase mb-4 block">
            The Ascending Path
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-9xl text-white font-black tracking-tight mb-6 leading-none drop-shadow-2xl">
            DanaTour
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 font-light mb-10 max-w-2xl mx-auto">
            Awaken every sense. From the deep ocean to the neon city, rising to
            the misty peaks.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 rounded-full text-white font-semibold tracking-wide hover:bg-white/20 transition-all"
          >
            Start Journey
            <ArrowDown className="w-5 h-5 animate-bounce" />
            <div className="absolute inset-0 rounded-full ring-2 ring-white/50 animate-ping opacity-20" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
