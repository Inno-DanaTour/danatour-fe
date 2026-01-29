import React from "react";
import { motion, useTransform, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import { Waves, Sun, Compass, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Intro: React.FC = () => {
  const navigate = useNavigate();
  const introRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: introRef,
    offset: ["start start", "end end"],
  });
  const goToExplore = () => {
    navigate("/explore");
  };
  const marqueeX1 = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const marqueeX2 = useTransform(scrollYProgress, [0, 1], ["-20%", "5%"]);
  const pathLength = useSpring(scrollYProgress, { stiffness: 30, damping: 15 });

  return (
    <section
      ref={introRef}
      className="relative min-h-[120vh] flex flex-col items-center justify-center py-32 overflow-hidden bg-gradient-to-b from-[#004E89] via-white to-white"
    >
      {/* Map Layer Background */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.06]">
        <svg
          viewBox="0 0 1400 1000"
          className="w-full h-full fill-none stroke-sky-600 stroke-[1.5]"
        >
          <path d="M400,100 C450,150 500,130 550,200 C600,270 580,350 650,450 C720,550 700,650 600,750 C500,850 550,950 500,980" />
          <path d="M300,300 Q450,250 500,150 L580,100 Q700,50 800,200 Q900,350 850,550 Q800,750 820,900" />
          <motion.path
            d="M150,300 Q600,400 700,850"
            stroke="url(#pathGradient)"
            strokeWidth="4"
            strokeDasharray="12,18"
            style={{ pathLength }}
          />
          <defs>
            <linearGradient
              id="pathGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
          <circle cx="700" cy="850" r="14" fill="#10b981" />
        </svg>
      </div>

      {/* Typography Marquee Background */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full pointer-events-none z-0 overflow-hidden opacity-[0.03]">
        <div className="flex flex-col gap-4">
          <motion.span
            style={{ x: marqueeX1 }}
            className="text-[15vw] font-display font-black whitespace-nowrap leading-none uppercase tracking-tighter text-sky-900"
          >
            VIETNAM CENTRAL COAST VIETNAM CENTRAL COAST
          </motion.span>
          <motion.span
            style={{ x: marqueeX2 }}
            className="text-[15vw] font-display font-black whitespace-nowrap leading-none uppercase tracking-tighter text-emerald-900"
          >
            EXPLORE THE VERTICAL SOUL EXPLORE THE VERTICAL SOUL
          </motion.span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="relative w-full max-w-7xl mx-auto px-6 grid grid-cols-12 gap-8 lg:gap-16 items-center z-10">
        {/* Main Visual Column */}
        <div className="col-span-12 lg:col-span-6 relative order-2 lg:order-1">
          {/* Overlapping Marquee */}
          <div className="absolute -top-10 -left-10 lg:-left-20 w-[140%] pointer-events-none z-50">
            <div className="-rotate-1 transform origin-left">
              <motion.div style={{ x: marqueeX1 }} className="flex gap-4">
                <h2 className="text-[2.5vw] md:text-[2vw] font-display font-black leading-none uppercase whitespace-nowrap tracking-tighter text-sky-900 bg-white/70 backdrop-blur-sm py-1 px-4 rounded-lg">
                  DA NANG DISCOVERY — DA NANG DISCOVERY — DA NANG DISCOVERY — DA
                  NANG DISCOVERY — DA NANG DISCOVERY
                </h2>
              </motion.div>
              <motion.div style={{ x: marqueeX2 }} className="flex gap-4 mt-1">
                <h2 className="text-[2.5vw] md:text-[2vw] font-display font-black leading-none uppercase whitespace-nowrap tracking-tighter text-emerald-700 bg-white/50 backdrop-blur-sm py-1 px-4 rounded-lg">
                  WITH DANATOUR — WITH DANATOUR — WITH DANATOUR — WITH DANATOUR
                  — WITH DANATOUR — WITH DANATOUR
                </h2>
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
            className="relative"
          >
            <div className="rounded-[40px] md:rounded-[80px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(14,165,233,0.3)] relative z-10 border-[12px] border-white ring-1 ring-sky-100">
              <img
                src="https://images.unsplash.com/photo-1559592442-7e182c8c6f31?q=80&w=1200"
                className="w-full aspect-[4/5] object-cover hover:scale-105 transition-transform duration-[4s] ease-out"
                alt="Da Nang Discovery"
              />
            </div>

            {/* Geometric Accents - Blue/Green */}
            <motion.div
              initial={{ x: -60, rotate: -45 }}
              whileInView={{ x: -20, rotate: -30 }}
              className="absolute top-1/3 -left-12 w-64 h-32 bg-gradient-to-r from-sky-500 to-sky-400 z-0 shadow-lg rounded-2xl"
              style={{ clipPath: "polygon(0% 0%, 100% 50%, 0% 100%)" }}
            />
            <motion.div
              initial={{ x: 60, rotate: 20 }}
              whileInView={{ x: 20, rotate: 8 }}
              className="absolute bottom-1/4 -right-12 w-80 h-40 bg-gradient-to-r from-emerald-400 to-emerald-500 z-0 opacity-90 shadow-lg rounded-2xl"
              style={{ clipPath: "polygon(100% 0%, 0% 50%, 100% 100%)" }}
            />

            {/* Floating Caption */}
            <div className="absolute -bottom-8 -right-8 bg-gradient-to-br from-sky-600 to-emerald-600 text-white p-6 rounded-3xl z-20 shadow-2xl hidden md:block">
              <p className="text-[8px] font-black uppercase tracking-[0.4em] mb-1 text-sky-100">
                The Ascending Path
              </p>
              <p className="font-display font-bold text-xl leading-none">
                DANATOUR
              </p>
            </div>
          </motion.div>
        </div>

        {/* Side Content Column */}
        <div className="col-span-12 lg:col-span-6 flex flex-col justify-center order-1 lg:order-2">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:pl-10"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[2px] w-12 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
                BEYOND TOURISM
              </span>
            </div>

            <h2 className="text-5xl md:text-7xl font-display font-black leading-[0.9] mb-10 tracking-tighter uppercase">
              A new lens on the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-cyan-500 to-emerald-500">
                Central Coast.
              </span>
            </h2>

            <p className="text-base text-slate-500 leading-relaxed font-medium mb-12 max-w-lg">
              We are a collective of storytellers and explorers with a deep love
              for Central Vietnam. Our journey began on the peaks of Son Tra,
              where we realized the world needed to see Da Nang from a vertical
              perspective—from the crushing sea to the silent stone.
            </p>

            {/* Feature Icons */}
            <div className="flex gap-6 mb-12 flex-wrap">
              <div className="flex items-center gap-3 bg-sky-50 px-4 py-3 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-sky-500 flex items-center justify-center text-white shadow-lg">
                  <Waves size={20} />
                </div>
                <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
                  Ocean
                </span>
              </div>
              <div className="flex items-center gap-3 bg-emerald-50 px-4 py-3 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center text-white shadow-lg">
                  <Sun size={20} />
                </div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  Nature
                </span>
              </div>
              <div className="flex items-center gap-3 bg-cyan-50 px-4 py-3 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-500 flex items-center justify-center text-white shadow-lg">
                  <Compass size={20} />
                </div>
                <span className="text-xs font-bold text-cyan-700 uppercase tracking-wider">
                  Explore
                </span>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <button
                onClick={goToExplore}
                className="group bg-gradient-to-r from-sky-500 to-emerald-500 text-white px-12 py-6 rounded-full font-bold uppercase tracking-widest text-[11px] hover:from-sky-600 hover:to-emerald-600 transition-all flex items-center gap-6 shadow-[0_25px_50px_-12px_rgba(14,165,233,0.4)] active:scale-95 cursor-pointer"
              >
                Start Discovery
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <ArrowRight size={20} />
                </motion.div>
              </button>

              <div className="hidden lg:block">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">
                  Est. 2024
                </p>
                <p className="text-[10px] font-black uppercase text-slate-700 tracking-widest">
                  DA NANG, VN
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Intro;
