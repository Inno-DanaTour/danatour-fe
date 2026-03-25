import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { MapPin, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const TOUR_EXAMPLES = [
  {
    title: "The Spiritual Dawn",
    location: "Linh Ung & Son Tra",
    price: "1.200.000đ",
    image: "https://i.ibb.co/Mx6vW69p/chualinhung.png",
    tags: ["Photography", "Spiritual"],
  },
  {
    title: "Midnight Dragon Pulse",
    location: "City Center & Bridges",
    price: "1.500.000đ",
    image: "https://i.ibb.co/DDMKRFTp/background.jpg",
    tags: ["Nightlife", "Cuisine"],
  },
  {
    title: "Marble Peak Ascension",
    location: "Marble Mountains",
    price: "1.550.000đ",
    image:
      "https://images.unsplash.com/photo-1762908293943-0b1b5900296e?q=80&w=1630&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    tags: ["History", "Hiking"],
  },
  {
    title: "Golden Sands Journey",
    location: "My Khe Beach",
    price: "2.900.000đ",
    image:
      "https://images.unsplash.com/photo-1723142282970-1fd415eec1ad?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    tags: ["Beach", "Relaxation"],
  },
];

const SignatureJourneys: React.FC = () => {
  const carouselWrapperRef = useRef<HTMLDivElement>(null);
  const [constraints, setConstraints] = useState({ left: 0, right: 0 });

  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });

  useEffect(() => {
    const updateConstraints = () => {
      if (carouselWrapperRef.current) {
        const fullWidth = carouselWrapperRef.current.scrollWidth;
        const visibleWidth = carouselWrapperRef.current.offsetWidth;
        setConstraints({
          left: Math.min(0, -(fullWidth - visibleWidth)),
          right: 0,
        });
      }
    };
    window.addEventListener("resize", updateConstraints);
    const timer = setTimeout(updateConstraints, 500);
    return () => {
      window.removeEventListener("resize", updateConstraints);
      clearTimeout(timer);
    };
  }, []);

  const handleManualScroll = (direction: "next" | "prev") => {
    const step = 400;
    const currentX = x.get();
    let newX = direction === "next" ? currentX - step : currentX + step;
    newX = Math.max(constraints.left, Math.min(0, newX));
    x.set(newX);
  };

  return (
    <section className="py-40 relative z-20">
      <div className="max-w-7xl mx-auto px-6  flex flex-col md:flex-row justify-between items-end gap-10">
        <div>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400 font-display font-bold uppercase tracking-[0.5em] text-[10px]">
            SIGNATURE JOURNEYS
          </span>
          <h2 className="text-6xl md:text-8xl font-display font-black tracking-tighter uppercase leading-none text-slate-900">
            Curated <br />
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">
              Paths.
            </span>
          </h2>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => handleManualScroll("prev")}
            className="w-16 h-16 rounded-full border border-slate-200 flex items-center justify-center hover:bg-gradient-to-r hover:from-sky-500 hover:to-emerald-500 hover:border-transparent hover:text-white transition-all active:scale-90 shadow-lg cursor-pointer text-slate-400"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => handleManualScroll("next")}
            className="w-16 h-16 rounded-full border border-slate-200 flex items-center justify-center hover:bg-gradient-to-r hover:from-sky-500 hover:to-emerald-500 hover:border-transparent hover:text-white transition-all active:scale-90 shadow-lg cursor-pointer text-slate-400"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div
        className="relative px-6 md:px-[calc((100vw-1280px)/2+24px)] overflow-hidden"
        ref={carouselWrapperRef}
      >
        <motion.div
          drag="x"
          dragConstraints={constraints}
          style={{ x: springX }}
          className="flex gap-8 w-max cursor-grab active:cursor-grabbing"
        >
          {TOUR_EXAMPLES.map((tour, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="relative flex-shrink-0 w-[320px] md:w-[400px] h-[600px] rounded-[40px] overflow-hidden group shadow-2xl cursor-pointer"
            >
              {/* Full Background Image */}
              <img
                src={tour.image}
                draggable="false"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt={tour.title}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

              {/* Content Layer */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                {/* Top Tags */}
                <div className="absolute top-8 left-8 flex gap-2">
                  {tour.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Location */}
                <p className="text-[10px] bg-gradient-to-r from-sky-300 to-emerald-300 bg-clip-text text-transparent uppercase font-black tracking-widest mb-3 flex items-center gap-2">
                  <MapPin size={14} className="text-emerald-400" />
                  {tour.location}
                </p>

                {/* Title */}
                <h4 className="text-4xl font-display font-black mb-4 tracking-tighter leading-none text-white group-hover:scale-[1.02] transition-transform origin-left">
                  {tour.title}
                </h4>

                {/* Bottom Row: Price & Action */}
                <div className="pt-6 border-t border-white/20 flex items-center justify-between">
                  <div className="text-2xl font-display font-bold text-white">
                    {tour.price}
                  </div>

                  <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-emerald-300 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                    Book Now <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SignatureJourneys;
