import React from "react";
import { ZoneType } from "../types";

interface TourFilterProps {
  selectedZone: ZoneType | "ALL";
  setSelectedZone: (zone: ZoneType | "ALL") => void;
  priceRange: number;
  setPriceRange: (price: number) => void;
}

const TourFilter: React.FC<TourFilterProps> = ({
  selectedZone,
  setSelectedZone,
  priceRange,
  setPriceRange,
}) => {
  return (
    <div className="card space-y-8 sticky top-24">
      <div>
        <h4 className="text-lg font-bold mb-4">Zones</h4>
        <div className="space-y-2">
          {["ALL", ...Object.values(ZoneType)].map((zone) => (
            <label key={zone} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="zone"
                value={zone}
                checked={selectedZone === zone}
                onChange={() => setSelectedZone(zone as any)}
                className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
              />
              <span className={`text-sm ${selectedZone === zone ? "text-primary font-bold" : "text-gray-600 group-hover:text-primary transition-colors"}`}>
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
            max="3000000"
            step="100000"
            value={priceRange}
            onChange={(e) => setPriceRange(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-sm font-bold text-cta">
            <span>500k VNĐ</span>
            <span>{new Intl.NumberFormat("vi-VN", { notation: "compact" }).format(priceRange)} VNĐ</span>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-bold mb-4">Duration</h4>
        <div className="space-y-2">
          {["Half Day", "Full Day", "Multi Day"].map((duration) => (
            <label key={duration} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 rounded text-primary focus:ring-primary border-gray-300"
              />
              <span className="text-sm text-gray-600 group-hover:text-primary transition-colors">
                {duration}
              </span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={() => {
          setSelectedZone("ALL");
          setPriceRange(3000000);
        }}
        className="w-full py-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors border-t border-gray-100 mt-4 pt-4"
      >
        Reset Filters
      </button>
    </div>
  );
};

export default TourFilter;
