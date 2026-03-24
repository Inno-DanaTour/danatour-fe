import React from "react";
import { ZoneType } from "../../pages/home/types";

interface TourFilterProps {
  selectedZone: ZoneType | "ALL";
  setSelectedZone: (zone: ZoneType | "ALL") => void;
  priceRange: number;
  setPriceRange: (price: number) => void;
  selectedDurations: string[];
  setSelectedDurations: (durations: string[]) => void;
}

const TourFilter: React.FC<TourFilterProps> = ({
  selectedZone,
  setSelectedZone,
  priceRange,
  setPriceRange,
  selectedDurations,
  setSelectedDurations,
}) => {
  return (
    <div className="card space-y-8 sticky top-24">
      <div>
        <h4 className="text-lg font-bold mb-4">Zones</h4>
        <div className="space-y-2">
          {["ALL", ...Object.values(ZoneType)].map((zone) => (
            <label
              key={zone}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="radio"
                name="zone"
                value={zone}
                checked={selectedZone === zone}
                onChange={() => setSelectedZone(zone as any)}
                className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
              />
              <span
                className={`text-sm ${selectedZone === zone ? "text-primary font-bold" : "text-gray-600 group-hover:text-primary transition-colors"}`}
              >
                {zone === "ALL" ? "All Regions" : zone}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-lg font-bold mb-4">Max Price</h4>
        <div className="space-y-4">
          <input
            type="range"
            min="500000"
            max="50000000"
            step="500000"
            value={priceRange}
            onChange={(e) => setPriceRange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-sm font-bold text-cta">
            <span>500k VNĐ</span>
            <span>
              {new Intl.NumberFormat("vi-VN").format(priceRange)} VNĐ
            </span>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-bold mb-4">Duration</h4>
        <div className="space-y-2">
          {["1-3 Days", "4-7 Days", "> 7 Days"].map((duration) => (
            <label
              key={duration}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedDurations.includes(duration)}
                onChange={() => {
                  if (selectedDurations.includes(duration)) {
                    setSelectedDurations(selectedDurations.filter(d => d !== duration));
                  } else {
                    setSelectedDurations([...selectedDurations, duration]);
                  }
                }}
                className="w-4 h-4 rounded text-primary focus:ring-primary border-gray-300"
              />
              <span className={`text-sm ${selectedDurations.includes(duration) ? "text-primary font-bold" : "text-gray-600 group-hover:text-primary transition-colors"}`}>
                {duration}
              </span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={() => {
          setSelectedZone("ALL");
          setPriceRange(50000000);
          setSelectedDurations([]);
        }}
        className="w-full py-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors border-t border-gray-100 mt-4 pt-4"
      >
        Reset Filters
      </button>
    </div>
  );
};

export default TourFilter;
