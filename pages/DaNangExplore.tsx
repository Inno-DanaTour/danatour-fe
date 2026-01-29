import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { LOCATIONS, COLORS } from "../constants";
import { ZoneType } from "../types";
import Background from "../components/Background";
import Passport from "../components/Passport";
import Checkpoint from "../components/Checkpoint";
import Header from "../components/Header";
import BookTourModal from "../components/BookTourModal";

const DaNangExplore: React.FC = () => {
  const navigate = useNavigate();
  const [currentZone, setCurrentZone] = useState<ZoneType>(ZoneType.SEA);
  const [collectedStamps, setCollectedStamps] = useState<string[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedTourId, setSelectedTourId] = useState<string | undefined>(
    undefined,
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth progress for the path drawing
  const pathProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Map progress to Zone
  useTransform(scrollYProgress, (value) => {
    if (value < 0.32) return ZoneType.SEA;
    if (value < 0.6) return ZoneType.CITY;
    return ZoneType.MOUNTAIN;
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      let nextZone = ZoneType.SEA;
      if (latest > 0.32) nextZone = ZoneType.CITY;
      if (latest > 0.6) nextZone = ZoneType.MOUNTAIN;

      if (nextZone !== currentZone) {
        setCurrentZone(nextZone);
      }
    });
    return () => unsubscribe();
  }, [currentZone, scrollYProgress]);

  // Handle hash navigation for #find-tour
  useEffect(() => {
    if (window.location.hash === "#find-tour") {
      setTimeout(() => {
        const element = document.getElementById("find-tour");
        element?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, []);

  const handleUnlock = (id: string) => {
    if (!collectedStamps.includes(id)) {
      setCollectedStamps((prev) => [...prev, id]);
    }
  };

  const handleBookTour = (tourId?: string) => {
    setSelectedTourId(tourId);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="relative w-full text-white overflow-hidden">
      {/* Header Navigation */}
      <Header onBookClick={() => handleBookTour()} />

      {/* Dynamic Background Layer */}
      <Background currentZone={currentZone} />

      {/* Floating UI */}
      <Passport
        collectedStamps={collectedStamps}
        totalLocations={LOCATIONS.length}
        isMuted={isMuted}
        toggleAudio={() => setIsMuted(!isMuted)}
      />

      {/* Hero Section for Explore Page */}
      <div className="relative z-20 h-screen flex flex-col items-center justify-center text-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-4xl"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-display text-white">
            Da Nang <span className="text-accent">Explore</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Scroll through the journey and collect stamps at each checkpoint
          </p>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-gray-400"
          >
            ↓ Scroll to explore ↓
          </motion.div>
        </motion.div>
      </div>

      {/* Scrollytelling Container */}
      <div
        id="detail"
        ref={containerRef}
        className="relative z-10 w-full"
        style={{ height: "600vh" }}
      >
        {/* The SVG Path */}
        <div
          id="roadmap-start"
          className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
        >
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="w-full h-full opacity-60"
          >
            {/* Gradient Definition */}
            <defs>
              <linearGradient
                id="pathGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor={COLORS.SEA.accent} />
                <stop offset="45%" stopColor={COLORS.CITY.accent} />
                <stop offset="100%" stopColor={COLORS.MOUNTAIN.accent} />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* The Base Path - A winding S-curve down the page */}
            <motion.path
              d="M 50 0 C 80 10, 80 20, 50 25 C 20 30, 20 40, 50 45 C 80 50, 80 60, 50 65 C 20 70, 20 85, 50 100"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="0.5"
            />

            {/* The Active Path (fills up as you scroll) */}
            <motion.path
              d="M 50 0 C 80 10, 80 20, 50 25 C 20 30, 20 40, 50 45 C 80 50, 80 60, 50 65 C 20 70, 20 85, 50 100"
              fill="none"
              stroke="url(#pathGradient)"
              strokeWidth="1"
              strokeLinecap="round"
              filter="url(#glow)"
              style={{ pathLength: pathProgress }}
            />
          </svg>
        </div>

        {/* Checkpoints Layer */}
        <div className="absolute inset-0 w-full h-full">
          {LOCATIONS.map((loc, index) => (
            <Checkpoint
              key={loc.id}
              data={loc}
              index={index}
              onUnlock={handleUnlock}
            />
          ))}
        </div>

        {/* Zone Labels (Decorative) */}
        <div className="absolute top-[8%] right-8 text-right opacity-30 font-display font-bold text-6xl tracking-widest hidden lg:block text-[#004E89]">
          OCEAN
        </div>
        <div className="absolute top-[40%] left-8 text-left opacity-30 font-display font-bold text-6xl tracking-widest hidden lg:block text-[#4C1D95]">
          CITY
        </div>
        <div className="absolute top-[75%] right-8 text-right opacity-30 font-display font-bold text-6xl tracking-widest hidden lg:block text-[#064E3B]">
          PEAKS
        </div>
      </div>

      {/* Footer / Call to Action at the bottom */}
      <footer
        id="find-tour"
        className="relative z-20 py-20 bg-black/80 text-center"
      >
        <h2 className="text-4xl font-bold mb-6 font-display text-accent">
          Journey Complete
        </h2>
        <p className="text-gray-400 mb-8">
          You've collected {collectedStamps.length} of {LOCATIONS.length}{" "}
          experiences.
        </p>
        <button
          onClick={() => handleBookTour()}
          className="px-8 py-3 bg-gradient-to-r from-primary to-sea text-white font-bold rounded-full hover:shadow-lg hover:shadow-primary/30 transition-all cursor-pointer"
        >
          Book This Itinerary
        </button>
      </footer>

      {/* Book Tour Modal */}
      <BookTourModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        preselectedTourId={selectedTourId}
      />
    </div>
  );
};

export default DaNangExplore;
