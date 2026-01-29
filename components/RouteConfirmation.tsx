import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Edit2,
  Sparkles,
  Clock,
  Mountain,
  Waves,
  Building2,
  Footprints,
  Coffee,
  Palette,
  Camera,
  Utensils,
  ChevronLeft,
} from "lucide-react";
import { ZoneType } from "../types";
import { UserPreferences } from "../services/mockAIService";

interface RouteConfirmationProps {
  preferences: UserPreferences;
  onConfirm: (preferences: UserPreferences) => void;
  onBack: () => void;
  isFromChat?: boolean;
  chatMessage?: string;
}

const TRAVEL_STYLE_INFO: Record<
  string,
  { label: string; icon: React.ReactNode; color: string }
> = {
  adventure: {
    label: "Adventure",
    icon: <Footprints size={20} />,
    color: "#FFC857",
  },
  relaxation: {
    label: "Relaxation",
    icon: <Coffee size={20} />,
    color: "#4FD1C5",
  },
  culture: { label: "Culture", icon: <Palette size={20} />, color: "#D946EF" },
  photography: {
    label: "Photography",
    icon: <Camera size={20} />,
    color: "#F97316",
  },
  food: {
    label: "Food & Drink",
    icon: <Utensils size={20} />,
    color: "#22C55E",
  },
};

const ZONE_INFO: Record<
  ZoneType,
  { label: string; icon: React.ReactNode; color: string }
> = {
  [ZoneType.SEA]: {
    label: "Ocean & Beach",
    icon: <Waves size={20} />,
    color: "#4FD1C5",
  },
  [ZoneType.CITY]: {
    label: "Urban & City",
    icon: <Building2 size={20} />,
    color: "#D946EF",
  },
  [ZoneType.MOUNTAIN]: {
    label: "Mountains & Nature",
    icon: <Mountain size={20} />,
    color: "#FFC857",
  },
};

const DURATION_INFO: Record<string, { label: string; description: string }> = {
  "half-day": { label: "Half Day", description: "3 checkpoints • ~4-5 hours" },
  "full-day": { label: "Full Day", description: "6 checkpoints • ~8-10 hours" },
  "2-days": {
    label: "2 Days",
    description: "10 checkpoints • Full experience",
  },
};

const ALL_STYLES = [
  "adventure",
  "relaxation",
  "culture",
  "photography",
  "food",
] as const;
const ALL_ZONES = [ZoneType.SEA, ZoneType.CITY, ZoneType.MOUNTAIN];
const ALL_DURATIONS = ["half-day", "full-day", "2-days"] as const;

const RouteConfirmation: React.FC<RouteConfirmationProps> = ({
  preferences,
  onConfirm,
  onBack,
  isFromChat = false,
  chatMessage,
}) => {
  const [editedPrefs, setEditedPrefs] = useState<UserPreferences>(preferences);
  const [isEditing, setIsEditing] = useState(false);

  const handleZoneToggle = (zone: ZoneType) => {
    setEditedPrefs((prev) => ({
      ...prev,
      preferredZones: prev.preferredZones.includes(zone)
        ? prev.preferredZones.filter((z) => z !== zone)
        : [...prev.preferredZones, zone],
    }));
  };

  const canConfirm = editedPrefs.preferredZones.length > 0;

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
                Review Your Preferences
              </h2>
            </div>
            <p className="text-gray-400 text-sm">
              {isFromChat
                ? "AI analyzed your message. Adjust if needed, then confirm."
                : "Review your selections before generating the route."}
            </p>
          </div>

          {/* Chat Message Preview (if from chat) */}
          {isFromChat && chatMessage && (
            <div className="relative z-10 px-6 md:px-8 pt-4">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                  Your message:
                </p>
                <p className="text-gray-300 text-sm italic">"{chatMessage}"</p>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="relative z-10 p-6 md:p-8 space-y-6">
            {/* AI Detected Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#4FD1C5] text-sm">
                <Sparkles size={16} />
                <span>AI Detected Preferences</span>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all cursor-pointer ${
                  isEditing
                    ? "bg-[#FFC857] text-black"
                    : "bg-white/10 text-gray-400 hover:text-white hover:bg-white/20"
                }`}
              >
                <Edit2 size={14} />
                {isEditing ? "Editing" : "Edit"}
              </button>
            </div>

            {/* Travel Style */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                Travel Style
              </h3>
              {isEditing ? (
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                  {ALL_STYLES.map((style) => {
                    const info = TRAVEL_STYLE_INFO[style];
                    const isSelected = editedPrefs.travelStyle === style;
                    return (
                      <button
                        key={style}
                        onClick={() =>
                          setEditedPrefs((p) => ({ ...p, travelStyle: style }))
                        }
                        className={`p-3 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-white/20 border-white/40"
                            : "bg-white/5 border-white/10 hover:bg-white/10"
                        }`}
                      >
                        <div
                          className="mb-1"
                          style={{ color: isSelected ? info.color : "#9CA3AF" }}
                        >
                          {info.icon}
                        </div>
                        <span className="text-xs text-white">{info.label}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div
                  className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10"
                  style={{
                    borderColor:
                      TRAVEL_STYLE_INFO[editedPrefs.travelStyle].color + "40",
                  }}
                >
                  <div
                    style={{
                      color: TRAVEL_STYLE_INFO[editedPrefs.travelStyle].color,
                    }}
                  >
                    {TRAVEL_STYLE_INFO[editedPrefs.travelStyle].icon}
                  </div>
                  <span className="text-white font-medium">
                    {TRAVEL_STYLE_INFO[editedPrefs.travelStyle].label}
                  </span>
                </div>
              )}
            </div>

            {/* Zones */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                Zones{" "}
                {isEditing && (
                  <span className="text-gray-500">(Select multiple)</span>
                )}
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {ALL_ZONES.map((zone) => {
                  const info = ZONE_INFO[zone];
                  const isSelected = editedPrefs.preferredZones.includes(zone);
                  return (
                    <button
                      key={zone}
                      onClick={() => isEditing && handleZoneToggle(zone)}
                      disabled={!isEditing}
                      className={`p-4 rounded-xl border transition-all ${
                        isEditing ? "cursor-pointer" : "cursor-default"
                      } ${
                        isSelected
                          ? "bg-white/15 border-white/30"
                          : "bg-white/5 border-white/10"
                      } ${isEditing && !isSelected ? "hover:bg-white/10 hover:border-white/20" : ""}`}
                    >
                      <div
                        className="mb-2"
                        style={{ color: isSelected ? info.color : "#6B7280" }}
                      >
                        {info.icon}
                      </div>
                      <span
                        className={`text-sm ${isSelected ? "text-white" : "text-gray-500"}`}
                      >
                        {info.label}
                      </span>
                      {isSelected && (
                        <div
                          className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-black text-xs"
                          style={{ backgroundColor: info.color }}
                        >
                          ✓
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              {editedPrefs.preferredZones.length === 0 && isEditing && (
                <p className="text-red-400 text-xs">
                  Please select at least one zone
                </p>
              )}
            </div>

            {/* Duration */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                Duration
              </h3>
              {isEditing ? (
                <div className="space-y-2">
                  {ALL_DURATIONS.map((dur) => {
                    const info = DURATION_INFO[dur];
                    const isSelected = editedPrefs.duration === dur;
                    return (
                      <button
                        key={dur}
                        onClick={() =>
                          setEditedPrefs((p) => ({ ...p, duration: dur }))
                        }
                        className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-white/20 border-[#FFC857]"
                            : "bg-white/5 border-white/10 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Clock
                            size={18}
                            className={
                              isSelected ? "text-[#FFC857]" : "text-gray-500"
                            }
                          />
                          <div className="text-left">
                            <div className="text-white text-sm font-medium">
                              {info.label}
                            </div>
                            <div className="text-gray-500 text-xs">
                              {info.description}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full border-2 ${
                            isSelected
                              ? "bg-[#FFC857] border-[#FFC857]"
                              : "border-white/30"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                  <Clock size={20} className="text-[#FFC857]" />
                  <div>
                    <div className="text-white font-medium">
                      {DURATION_INFO[editedPrefs.duration].label}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {DURATION_INFO[editedPrefs.duration].description}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="relative z-10 p-6 md:p-8 pt-4 border-t border-white/10 flex justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <ChevronLeft size={20} />
              Back
            </button>

            <button
              onClick={() => onConfirm(editedPrefs)}
              disabled={!canConfirm}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all cursor-pointer ${
                canConfirm
                  ? "bg-gradient-to-r from-[#FFC857] to-[#F97316] text-black hover:brightness-110"
                  : "bg-white/10 text-gray-500 cursor-not-allowed"
              }`}
            >
              <Check size={18} />
              Confirm & Generate Route
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RouteConfirmation;
