import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useNavigate } from "react-router-dom";
import { COLORS } from "../constants";
import { ZoneType, LocationData } from "../types";
import Background from "../components/Background";
import Passport from "../components/Passport";
import Checkpoint from "../components/Checkpoint";
import Header from "../components/Header";
import BookTourModal from "../components/BookTourModal";
import AIInputForm from "../components/AIInputForm";
import AIProcessingOverlay from "../components/AIProcessingOverlay";
import RouteEditor from "../components/RouteEditor";
import {
  UserPreferences,
  AIRecommendation,
  getPersonalizedRoute,
  parsePreferencesFromChat,
} from "../services/mockAIService";
import { Sparkles, RotateCcw, MapPin, Clock } from "lucide-react";

// Flow states: form -> processing -> editing -> route
type FlowState = "form" | "processing" | "editing" | "route";

const DaNangExplore: React.FC = () => {
  const navigate = useNavigate();

  // Flow State
  const [flowState, setFlowState] = useState<FlowState>("form");

  // AI Results State
  const [personalizedLocations, setPersonalizedLocations] = useState<
    LocationData[]
  >([]);
  const [aiExplanation, setAiExplanation] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");

  // Original State
  const [currentZone, setCurrentZone] = useState<ZoneType>(ZoneType.SEA);
  const [collectedStamps, setCollectedStamps] = useState<string[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedTourId, setSelectedTourId] = useState<string | undefined>(
    undefined,
  );

  const containerRef = useRef<HTMLDivElement>(null);

  // Only use target ref when the container is rendered (in route state)
  const { scrollYProgress } = useScroll(
    flowState === "route"
      ? {
          target: containerRef,
          offset: ["start start", "end end"],
        }
      : {},
  );

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

  // AI Form submission handler -> goes to processing
  const handleAIFormSubmit = async (preferences: UserPreferences) => {
    setFlowState("processing");

    try {
      const recommendation = await getPersonalizedRoute(preferences);
      setPersonalizedLocations(recommendation.locations);
      setAiExplanation(recommendation.explanation);
      setEstimatedTime(recommendation.estimatedTime);
      setFlowState("editing"); // Go to editing step
    } catch (error) {
      console.error("Error getting personalized route:", error);
      setFlowState("form");
    }
  };

  // AI Chat submission handler -> parses and goes to processing
  const handleChatSubmit = async (message: string) => {
    setFlowState("processing");

    try {
      const prefs = await parsePreferencesFromChat(message);
      const recommendation = await getPersonalizedRoute(prefs);
      setPersonalizedLocations(recommendation.locations);
      setAiExplanation(recommendation.explanation);
      setEstimatedTime(recommendation.estimatedTime);
      setFlowState("editing"); // Go to editing step
    } catch (error) {
      console.error("Error getting personalized route:", error);
      setFlowState("form");
    }
  };

  // Route editor confirm -> go to route view
  const handleEditorConfirm = (editedLocations: LocationData[]) => {
    setPersonalizedLocations(editedLocations);
    setFlowState("route");
  };

  // Back from editor to form
  const handleBackToForm = () => {
    setFlowState("form");
    setPersonalizedLocations([]);
    setAiExplanation("");
    setEstimatedTime("");
  };

  // Reset to form
  const handleRestart = () => {
    setFlowState("form");
    setPersonalizedLocations([]);
    setAiExplanation("");
    setEstimatedTime("");
    setCollectedStamps([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Calculate dynamic scroll height based on number of locations
  const scrollHeight = useMemo(() => {
    const baseHeight = 60; // vh per location
    return `${Math.max(personalizedLocations.length * baseHeight, 300)}vh`;
  }, [personalizedLocations.length]);

  // Recalculate positions for personalized locations
  const adjustedLocations = useMemo(() => {
    const total = personalizedLocations.length;
    if (total === 0) return [];

    return personalizedLocations.map((loc, index) => ({
      ...loc,
      positionY: 8 + (index * 84) / Math.max(total - 1, 1),
    }));
  }, [personalizedLocations]);

  // Show AI Input Form
  if (flowState === "form") {
    return (
      <div className="relative w-full min-h-screen text-white overflow-hidden">
        <Header onBookClick={() => handleBookTour()} />
        <Background currentZone={ZoneType.SEA} />
        <AIInputForm
          onSubmit={handleAIFormSubmit}
          onChatSubmit={handleChatSubmit}
        />
      </div>
    );
  }

  // Show Processing
  if (flowState === "processing") {
    return (
      <div className="relative w-full min-h-screen text-white overflow-hidden">
        <Header onBookClick={() => handleBookTour()} />
        <Background currentZone={ZoneType.SEA} />
        <AIProcessingOverlay isVisible={true} />
      </div>
    );
  }

  // Show Route Editor (add/remove checkpoints)
  if (flowState === "editing") {
    return (
      <div className="relative w-full min-h-screen text-white overflow-hidden">
        <Header onBookClick={() => handleBookTour()} />
        <Background currentZone={ZoneType.SEA} />
        <RouteEditor
          locations={personalizedLocations}
          onConfirm={handleEditorConfirm}
          onBack={handleBackToForm}
          aiExplanation={aiExplanation}
          estimatedTime={estimatedTime}
        />
      </div>
    );
  }

  return (
    <div className="relative w-full text-white overflow-hidden">
      {/* Header Navigation */}
      <Header onBookClick={() => handleBookTour()} />

      {/* Dynamic Background Layer */}
      <Background currentZone={currentZone} />

      {/* Floating UI */}
      <Passport
        collectedStamps={collectedStamps}
        totalLocations={personalizedLocations.length}
        isMuted={isMuted}
        toggleAudio={() => setIsMuted(!isMuted)}
      />

      {/* Personalized Hero Section */}
      <div className="relative z-20 h-screen flex flex-col items-center justify-center text-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-4xl"
        >
          {/* AI Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-gradient-to-r from-[#FFC857]/20 to-[#F97316]/20 border border-[#FFC857]/30"
          >
            <Sparkles size={16} className="text-[#FFC857]" />
            <span className="text-sm font-medium text-[#FFC857]">
              Personalized for You
            </span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-display text-white">
            Your <span className="text-accent">Custom</span> Journey
          </h1>

          {/* AI Explanation */}
          <p className="text-lg md:text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
            {aiExplanation}
          </p>

          {/* Stats Row */}
          <div className="flex items-center justify-center gap-6 mb-8 text-gray-400">
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-[#4FD1C5]" />
              <span>{personalizedLocations.length} checkpoints</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-[#D946EF]" />
              <span>{estimatedTime}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-gray-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
            >
              <RotateCcw size={16} />
              Customize Again
            </button>
          </div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, delay: 1 }}
            className="text-gray-400 mt-8"
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
        style={{ height: scrollHeight }}
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

        {/* Checkpoints Layer - Using personalized locations */}
        <div className="absolute inset-0 w-full h-full">
          {adjustedLocations.map((loc, index) => (
            <Checkpoint
              key={loc.id}
              data={loc}
              index={index}
              onUnlock={handleUnlock}
            />
          ))}
        </div>

        {/* Zone Labels (Decorative) - Dynamic based on selected zones */}
        {adjustedLocations.some((loc) => loc.zone === ZoneType.SEA) && (
          <div className="absolute top-[8%] right-8 text-right opacity-30 font-display font-bold text-6xl tracking-widest hidden lg:block text-[#004E89]">
            OCEAN
          </div>
        )}
        {adjustedLocations.some((loc) => loc.zone === ZoneType.CITY) && (
          <div className="absolute top-[40%] left-8 text-left opacity-30 font-display font-bold text-6xl tracking-widest hidden lg:block text-[#4C1D95]">
            CITY
          </div>
        )}
        {adjustedLocations.some((loc) => loc.zone === ZoneType.MOUNTAIN) && (
          <div className="absolute top-[75%] right-8 text-right opacity-30 font-display font-bold text-6xl tracking-widest hidden lg:block text-[#064E3B]">
            PEAKS
          </div>
        )}
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
          You've collected {collectedStamps.length} of{" "}
          {personalizedLocations.length} experiences.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button
            onClick={() => handleBookTour()}
            className="px-8 py-3 bg-gradient-to-r from-primary to-sea text-white font-bold rounded-full hover:shadow-lg hover:shadow-primary/30 transition-all cursor-pointer"
          >
            Book This Itinerary
          </button>
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-gray-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
          >
            <RotateCcw size={16} />
            Try Different Preferences
          </button>
        </div>
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
