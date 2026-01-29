import React, { useRef, useState, useEffect } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin, ArrowRight } from "lucide-react";

const TOUR_EXAMPLES = [
  {
    title: "The Spiritual Dawn",
    location: "Linh Ung & Son Tra",
    price: "$89",
    image:
      "https://images.unsplash.com/photo-1599708153386-629864227f2f?q=80&w=800",
    tags: ["Photography", "Spiritual"],
  },
  {
    title: "Midnight Dragon Pulse",
    location: "City Center & Bridges",
    price: "$120",
    image:
      "https://images.unsplash.com/photo-1616386861226-f4d25725d2b6?q=80&w=800",
    tags: ["Nightlife", "Cuisine"],
  },
  {
    title: "Marble Peak Ascension",
    location: "Marble Mountains",
    price: "$75",
    image:
      "https://images.unsplash.com/photo-1644315266453-62b10a905260?q=80&w=800",
    tags: ["History", "Hiking"],
  },
  {
    title: "Golden Sands Journey",
    location: "My Khe Beach",
    price: "$65",
    image:
      "https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=800",
    tags: ["Beach", "Relaxation"],
  },
];

const TourCarousel: React.FC = () => {
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
    <section className="py-24 md:py-40 bg-[#020617] text-white rounded-[80px] md:rounded-[120px] relative z-20 mt-[-80px] shadow-[0_-40px_80px_rgba(0,0,0,0.3)]">
      <div className="max-w-7xl mx-auto px-6 mb-24 flex flex-col md:flex-row justify-between items-end gap-10">
        <div>
          <span className="text-primary font-display font-bold uppercase tracking-[0.5em] text-[10px] mb-4 block">
            SIGNATURE JOURNEYS
          </span>
          <h2 className="text-6xl md:text-8xl font-display font-black tracking-tighter uppercase leading-none">
            Curated <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary/30 to-sea/30 italic">
              Paths.
            </span>
          </h2>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => handleManualScroll("prev")}
            className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center hover:bg-gradient-to-r hover:from-primary hover:to-sea hover:border-transparent transition-all active:scale-90 shadow-xl cursor-pointer"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => handleManualScroll("next")}
            className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center hover:bg-gradient-to-r hover:from-primary hover:to-sea hover:border-transparent transition-all active:scale-90 shadow-xl cursor-pointer"
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
          className="flex gap-10 w-max cursor-grab active:cursor-grabbing"
        >
          {TOUR_EXAMPLES.map((tour, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[320px] md:w-[450px] bg-white/[0.03] border border-white/10 rounded-[60px] p-8 transition-all hover:border-primary/30 hover:bg-white/[0.05] group flex flex-col h-[650px]"
            >
              <div className="relative aspect-[4/5] rounded-[44px] overflow-hidden mb-8 shadow-2xl">
                <img
                  src={tour.image}
                  draggable="false"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  alt={tour.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex-grow">
                <div className="flex gap-2 mb-4">
                  {tour.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[8px] font-black uppercase tracking-widest px-3 py-1.5 bg-gradient-to-r from-primary/20 to-sea/20 rounded-lg text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-[10px] bg-gradient-to-r from-primary to-sea bg-clip-text text-transparent uppercase font-black tracking-widest mb-2 flex items-center gap-2">
                  <MapPin size={12} className="text-sea" />
                  {tour.location}
                </p>
                <h4 className="text-4xl font-display font-bold mb-4 tracking-tight leading-none group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-sea transition-all">
                  {tour.title}
                </h4>
              </div>
              <div className="mt-auto pt-8 border-t border-white/10 flex items-center justify-between">
                <div className="text-3xl font-display font-black bg-gradient-to-r from-primary to-sea bg-clip-text text-transparent">
                  {tour.price}
                </div>
                <button className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-sea text-white flex items-center justify-center hover:from-primary/80 hover:to-sea/80 transition-all shadow-xl group-hover:translate-x-1 cursor-pointer">
                  <ArrowRight size={22} />
                </button>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TourCarousel;
