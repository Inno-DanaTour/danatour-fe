import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Plus,
  Trash2,
  MapPin,
  Clock,
  ChevronLeft,
  Mountain,
  Waves,
  Building2,
  Sparkles,
  GripVertical,
} from "lucide-react";
import { ZoneType, LocationData } from "../../types/types";
import { LOCATIONS } from "../../constants/constants";

interface RouteEditorProps {
  locations: LocationData[];
  onConfirm: (locations: LocationData[]) => void;
  onBack: () => void;
  aiExplanation: string;
  estimatedTime: string;
}

const ZONE_INFO: Record<
  ZoneType,
  { label: string; icon: React.ReactNode; color: string }
> = {
  [ZoneType.SEA]: {
    label: "Beach",
    icon: <Waves size={16} />,
    color: "#4FD1C5",
  },
  [ZoneType.CITY]: {
    label: "City",
    icon: <Building2 size={16} />,
    color: "#D946EF",
  },
  [ZoneType.MOUNTAIN]: {
    label: "Mountain",
    icon: <Mountain size={16} />,
    color: "#FFC857",
  },
};

const RouteEditor: React.FC<RouteEditorProps> = ({
  locations,
  onConfirm,
  onBack,
  aiExplanation,
  estimatedTime,
}) => {
  const [editedLocations, setEditedLocations] =
    useState<LocationData[]>(locations);
  const [showAddPanel, setShowAddPanel] = useState(false);

  // Get available locations (not already in route)
  const availableLocations = LOCATIONS.filter(
    (loc) => !editedLocations.find((el) => el.id === loc.id),
  );

  const handleRemove = (locationId: string) => {
    setEditedLocations((prev) => prev.filter((loc) => loc.id !== locationId));
  };

  const handleAdd = (location: LocationData) => {
    setEditedLocations((prev) => [...prev, location]);
    setShowAddPanel(false);
  };

  const handleConfirm = () => {
    onConfirm(editedLocations);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl"
      >
        {/* Glass Card Container */}
        <div className="relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
          {/* Aurora Glow Effect */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#4FD1C5]/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-[#D946EF]/30 rounded-full blur-3xl" />

          {/* Header */}
          <div className="relative z-10 p-6 md:p-8 pb-4 border-b border-white/10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="text-[#FFC857]" size={24} />
              <h2 className="text-2xl md:text-3xl font-bold text-white font-display">
                Customize Your Route
              </h2>
            </div>
            <p className="text-gray-400 text-sm text-center">
              Add or remove checkpoints to personalize your journey
            </p>

            {/* AI Summary */}
            <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-gray-300 text-sm">{aiExplanation}</p>
              <div className="flex items-center gap-4 mt-3 text-sm">
                <div className="flex items-center gap-1.5 text-[#4FD1C5]">
                  <MapPin size={14} />
                  <span>{editedLocations.length} checkpoints</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#FFC857]">
                  <Clock size={14} />
                  <span>{estimatedTime}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 p-6 md:p-8 max-h-[50vh] overflow-y-auto">
            {/* Location List */}
            <div className="space-y-3">
              <AnimatePresence>
                {editedLocations.map((location, index) => (
                  <motion.div
                    key={location.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="group flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all"
                  >
                    {/* Order number */}
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-semibold text-white">
                      {index + 1}
                    </div>

                    {/* Image */}
                    <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={location.image}
                        alt={location.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium truncate">
                        {location.name}
                      </h4>
                      <div
                        className="flex items-center gap-1 text-xs"
                        style={{ color: ZONE_INFO[location.zone].color }}
                      >
                        {ZONE_INFO[location.zone].icon}
                        <span>{ZONE_INFO[location.zone].label}</span>
                      </div>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => handleRemove(location.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all cursor-pointer"
                      title="Remove from route"
                    >
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              {editedLocations.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <MapPin size={32} className="mx-auto mb-2 opacity-50" />
                  <p>No checkpoints in route</p>
                  <p className="text-sm">Add some destinations below!</p>
                </div>
              )}
            </div>

            {/* Add button */}
            {availableLocations.length > 0 && (
              <button
                onClick={() => setShowAddPanel(!showAddPanel)}
                className={`w-full mt-4 p-3 rounded-xl border-2 border-dashed transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  showAddPanel
                    ? "border-[#4FD1C5] bg-[#4FD1C5]/10 text-[#4FD1C5]"
                    : "border-white/20 text-gray-400 hover:border-white/40 hover:text-white"
                }`}
              >
                <Plus size={20} />
                <span>{showAddPanel ? "Cancel" : "Add Checkpoint"}</span>
              </button>
            )}

            {/* Add Panel */}
            <AnimatePresence>
              {showAddPanel && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 space-y-2 overflow-hidden"
                >
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Available destinations:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[200px] overflow-y-auto">
                    {availableLocations.map((location) => (
                      <button
                        key={location.id}
                        onClick={() => handleAdd(location)}
                        className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#4FD1C5] hover:bg-white/10 transition-all cursor-pointer text-left"
                      >
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={location.image}
                            alt={location.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-white text-sm font-medium truncate">
                            {location.name}
                          </h5>
                          <div
                            className="flex items-center gap-1 text-xs"
                            style={{ color: ZONE_INFO[location.zone].color }}
                          >
                            {ZONE_INFO[location.zone].icon}
                            <span>{ZONE_INFO[location.zone].label}</span>
                          </div>
                        </div>
                        <Plus size={16} className="text-[#4FD1C5]" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
              onClick={handleConfirm}
              disabled={editedLocations.length === 0}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all cursor-pointer ${
                editedLocations.length > 0
                  ? "bg-gradient-to-r from-[#FFC857] to-[#F97316] text-black hover:brightness-110"
                  : "bg-white/10 text-gray-500 cursor-not-allowed"
              }`}
            >
              <Check size={18} />
              Confirm Route ({editedLocations.length})
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RouteEditor;
