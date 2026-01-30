import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  Mountain,
  Building2,
  Waves,
  Clock,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Camera,
  Coffee,
  Palette,
  Footprints,
  Utensils,
  MessageCircle,
  ListChecks,
  Send,
  Bot,
} from "lucide-react";
import { ZoneType } from "../types";
import { UserPreferences } from "../services/mockAIService";

interface AIInputFormProps {
  onSubmit: (preferences: UserPreferences) => void;
  onChatSubmit?: (message: string) => void;
}

type TravelStyle = UserPreferences["travelStyle"];
type Duration = UserPreferences["duration"];
type InputMode = "form" | "chat";

// Travel style options
const TRAVEL_STYLES: {
  value: TravelStyle;
  label: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  {
    value: "adventure",
    label: "Adventure",
    icon: <Footprints size={28} />,
    color: "#FFC857",
  },
  {
    value: "relaxation",
    label: "Relaxation",
    icon: <Coffee size={28} />,
    color: "#4FD1C5",
  },
  {
    value: "culture",
    label: "Culture",
    icon: <Palette size={28} />,
    color: "#D946EF",
  },
  {
    value: "photography",
    label: "Photography",
    icon: <Camera size={28} />,
    color: "#F97316",
  },
  {
    value: "food",
    label: "Food & Drink",
    icon: <Utensils size={28} />,
    color: "#22C55E",
  },
];

// Zone options
const ZONE_OPTIONS: {
  value: ZoneType;
  label: string;
  icon: React.ReactNode;
  color: string;
  image: string;
}[] = [
  {
    value: ZoneType.SEA,
    label: "Ocean & Beach",
    icon: <Waves size={28} />,
    color: "#4FD1C5",
    image:
      "https://plus.unsplash.com/premium_photo-1661963966774-7d5b6ec90d70?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8T2NlYW4lMjBhbmQlMjBiZWFjaHxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    value: ZoneType.CITY,
    label: "Urban & City",
    icon: <Building2 size={28} />,
    color: "#D946EF",
    image:
      "https://plus.unsplash.com/premium_photo-1681530700755-e8079add58ef?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8VXJiYW4lMjBDaXR5fGVufDB8fDB8fHww",
  },
  {
    value: ZoneType.MOUNTAIN,
    label: "Mountains & Nature",
    icon: <Mountain size={28} />,
    color: "#FFC857",
    image:
      "https://images.unsplash.com/photo-1616006079139-ddf8eb8a8323?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fE1vdW50YWluJTIwbmF0dXJlfGVufDB8fDB8fHww",
  },
];

// Duration options
const DURATION_OPTIONS: {
  value: Duration;
  label: string;
  description: string;
}[] = [
  {
    value: "half-day",
    label: "Half Day",
    description: "3 checkpoints • ~4-5 hours",
  },
  {
    value: "full-day",
    label: "Full Day",
    description: "6 checkpoints • ~8-10 hours",
  },
  {
    value: "2-days",
    label: "2 Days",
    description: "10 checkpoints • Full experience",
  },
];

// Chat suggestions
const CHAT_SUGGESTIONS = [
  "I want to explore beaches and take beautiful photos for a full day",
  "Tôi muốn khám phá văn hóa và ẩm thực địa phương trong nửa ngày",
  "Looking for adventure activities in the mountains over 2 days",
  "Relaxing beach trip with some local food experiences",
];

const AIInputForm: React.FC<AIInputFormProps> = ({
  onSubmit,
  onChatSubmit,
}) => {
  // Mode state
  const [inputMode, setInputMode] = useState<InputMode>("form");

  // Form mode state
  const [currentStep, setCurrentStep] = useState(0);
  const [travelStyle, setTravelStyle] = useState<TravelStyle | null>(null);
  const [selectedZones, setSelectedZones] = useState<ZoneType[]>([]);
  const [duration, setDuration] = useState<Duration | null>(null);

  // Chat mode state
  const [chatInput, setChatInput] = useState("");

  const totalSteps = 3;

  const handleZoneToggle = (zone: ZoneType) => {
    setSelectedZones((prev) =>
      prev.includes(zone) ? prev.filter((z) => z !== zone) : [...prev, zone],
    );
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return travelStyle !== null;
      case 1:
        return selectedZones.length > 0;
      case 2:
        return duration !== null;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleFormSubmit = () => {
    if (travelStyle && selectedZones.length > 0 && duration) {
      onSubmit({
        travelStyle,
        preferredZones: selectedZones,
        duration,
      });
    }
  };

  const handleChatSubmit = () => {
    if (!chatInput.trim()) return;

    if (onChatSubmit) {
      onChatSubmit(chatInput);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setChatInput(suggestion);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        {/* Glass Card Container */}
        <div className="relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
          {/* Aurora Glow Effect */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#4FD1C5]/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-[#D946EF]/30 rounded-full blur-3xl" />

          {/* Header */}
          <div className="relative z-10 p-6 md:p-8 pb-4 text-center border-b border-white/10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="text-[#FFC857]" size={24} />
              <h2 className="text-2xl md:text-3xl font-bold text-white font-display">
                Personalize Your Journey
              </h2>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Choose how you want to tell us about your preferences
            </p>

            {/* Mode Selector */}
            <div className="flex items-center justify-center gap-2 p-1 bg-white/5 rounded-xl max-w-sm mx-auto">
              <button
                onClick={() => setInputMode("form")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium transition-all cursor-pointer ${
                  inputMode === "form"
                    ? "bg-[#FFC857] text-black"
                    : "text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <ListChecks size={18} />
                <span className="text-sm">Form</span>
              </button>
              <button
                onClick={() => setInputMode("chat")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-medium transition-all cursor-pointer ${
                  inputMode === "chat"
                    ? "bg-gradient-to-r from-[#4FD1C5] to-[#D946EF] text-black"
                    : "text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <MessageCircle size={18} />
                <span className="text-sm">Chat AI</span>
              </button>
            </div>

            {/* Progress Indicator (Form mode only) */}
            {inputMode === "form" && (
              <div className="flex items-center justify-center gap-2 mt-6">
                {[0, 1, 2].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                        step <= currentStep
                          ? "bg-[#FFC857] text-black"
                          : "bg-white/10 text-gray-400"
                      }`}
                    >
                      {step + 1}
                    </div>
                    {step < 2 && (
                      <div
                        className={`w-12 h-0.5 transition-all duration-300 ${
                          step < currentStep ? "bg-[#FFC857]" : "bg-white/10"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Content Area */}
          <div className="relative z-10 p-6 md:p-8 min-h-[320px]">
            <AnimatePresence mode="wait">
              {/* Chat Mode */}
              {inputMode === "chat" && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* AI Avatar and Description */}
                  <div className="flex items-start gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4FD1C5] to-[#D946EF] flex items-center justify-center flex-shrink-0">
                      <Bot size={20} className="text-white" />
                    </div>
                    <div className="bg-white/10 rounded-2xl rounded-tl-none p-4 flex-1">
                      <p className="text-gray-300 text-sm">
                        Xin chào! 👋 Tell me about your ideal trip in Da Nang.
                        What kind of experience are you looking for? Feel free
                        to write in English or Vietnamese!
                      </p>
                    </div>
                  </div>

                  {/* Chat Input */}
                  <div className="relative">
                    <textarea
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Describe your ideal Da Nang trip..."
                      className="w-full h-32 p-4 pr-14 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 resize-none focus:outline-none focus:border-[#4FD1C5] transition-colors"
                    />
                    <button
                      onClick={handleChatSubmit}
                      disabled={!chatInput.trim()}
                      className={`absolute bottom-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                        chatInput.trim()
                          ? "bg-gradient-to-r from-[#4FD1C5] to-[#D946EF] text-white hover:scale-105"
                          : "bg-white/10 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <Send size={18} />
                    </button>
                  </div>

                  {/* Suggestions */}
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Try these suggestions:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {CHAT_SUGGESTIONS.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer truncate max-w-[200px]"
                          title={suggestion}
                        >
                          {suggestion.length > 40
                            ? suggestion.slice(0, 40) + "..."
                            : suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Form Mode - Step 1: Travel Style */}
              {inputMode === "form" && currentStep === 0 && (
                <motion.div
                  key="step1"
                  custom={1}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Compass className="text-[#FFC857]" size={20} />
                    What's your travel style?
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {TRAVEL_STYLES.map((style) => (
                      <button
                        key={style.value}
                        onClick={() => setTravelStyle(style.value)}
                        className={`group relative p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                          travelStyle === style.value
                            ? "bg-white/20 border-white/40 scale-[1.02]"
                            : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                        }`}
                      >
                        <div
                          className={`mb-2 transition-colors ${
                            travelStyle === style.value
                              ? ""
                              : "text-gray-400 group-hover:text-white"
                          }`}
                          style={{
                            color:
                              travelStyle === style.value
                                ? style.color
                                : undefined,
                          }}
                        >
                          {style.icon}
                        </div>
                        <span className="text-sm font-medium text-white">
                          {style.label}
                        </span>
                        {travelStyle === style.value && (
                          <motion.div
                            layoutId="activeStyle"
                            className="absolute inset-0 rounded-xl border-2"
                            style={{ borderColor: style.color }}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Form Mode - Step 2: Preferred Zones */}
              {inputMode === "form" && currentStep === 1 && (
                <motion.div
                  key="step2"
                  custom={1}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Mountain className="text-[#FFC857]" size={20} />
                    Which zones interest you?
                    <span className="text-sm font-normal text-gray-400">
                      (Select multiple)
                    </span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {ZONE_OPTIONS.map((zone) => (
                      <button
                        key={zone.value}
                        onClick={() => handleZoneToggle(zone.value)}
                        className={`group relative overflow-hidden rounded-xl border transition-all duration-300 cursor-pointer ${
                          selectedZones.includes(zone.value)
                            ? "border-white/40 scale-[1.02]"
                            : "border-white/10 hover:border-white/20"
                        }`}
                      >
                        {/* Background Image */}
                        <div className="absolute inset-0">
                          <img
                            src={zone.image}
                            alt={zone.label}
                            className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        </div>

                        {/* Content */}
                        <div className="relative z-10 p-4 text-left">
                          <div className="mb-2" style={{ color: zone.color }}>
                            {zone.icon}
                          </div>
                          <span className="text-sm font-medium text-white">
                            {zone.label}
                          </span>
                        </div>

                        {/* Selection Indicator */}
                        {selectedZones.includes(zone.value) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-black"
                            style={{ backgroundColor: zone.color }}
                          >
                            ✓
                          </motion.div>
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Form Mode - Step 3: Duration */}
              {inputMode === "form" && currentStep === 2 && (
                <motion.div
                  key="step3"
                  custom={1}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Clock className="text-[#FFC857]" size={20} />
                    How long is your trip?
                  </h3>
                  <div className="space-y-3">
                    {DURATION_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setDuration(option.value)}
                        className={`w-full group flex items-center justify-between p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                          duration === option.value
                            ? "bg-white/20 border-[#FFC857]"
                            : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                        }`}
                      >
                        <div className="text-left">
                          <div className="font-semibold text-white">
                            {option.label}
                          </div>
                          <div className="text-sm text-gray-400">
                            {option.description}
                          </div>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border-2 transition-all ${
                            duration === option.value
                              ? "bg-[#FFC857] border-[#FFC857]"
                              : "border-white/30"
                          }`}
                        >
                          {duration === option.value && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-full h-full flex items-center justify-center text-black text-xs"
                            >
                              ✓
                            </motion.div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer / Navigation (Form mode only) */}
          {inputMode === "form" && (
            <div className="relative z-10 p-6 md:p-8 pt-4 border-t border-white/10 flex justify-between">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                  currentStep === 0
                    ? "opacity-0 pointer-events-none"
                    : "text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <ChevronLeft size={20} />
                Back
              </button>

              {currentStep < totalSteps - 1 ? (
                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className={`flex items-center gap-2 px-6 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
                    canProceed()
                      ? "bg-[#FFC857] text-black hover:brightness-110"
                      : "bg-white/10 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Next
                  <ChevronRight size={20} />
                </button>
              ) : (
                <button
                  onClick={handleFormSubmit}
                  disabled={!canProceed()}
                  className={`flex items-center gap-2 px-6 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
                    canProceed()
                      ? "bg-gradient-to-r from-[#FFC857] to-[#F97316] text-black hover:brightness-110"
                      : "bg-white/10 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <Sparkles size={18} />
                  Generate My Route
                </button>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AIInputForm;
