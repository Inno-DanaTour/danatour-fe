import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutGrid, List, Loader2, ArrowUpDown } from "lucide-react";
import Header from "../../components/layout/Header";
import TourCard from "../../features/tours/TourCard";
import TourFilter from "../../features/tours/TourFilter";
import SearchBar from "../../components/common/SearchBar";
import Dropdown from "../../components/common/Dropdown";
import { tourService } from "./services/tourService";
import { ZoneType, Tour, TourListItem } from "../../types/types";
import { motion, AnimatePresence } from "framer-motion";

const SORT_OPTIONS = [
  { id: "id,desc", name: "Recommended" },
  { id: "adultPrice,asc", name: "Price: Low to High" },
  { id: "adultPrice,desc", name: "Price: High to Low" },
  { id: "viewCount,desc", name: "Most Popular" },
];

const Tours: React.FC = () => {
  const navigate = useNavigate();
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedZone, setSelectedZone] = useState<ZoneType | "ALL">("ALL");
  const [priceRange, setPriceRange] = useState(50000000);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>("id,desc");
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);

  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Find Your Perfect Journey | DanaTour";
  }, []);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);

        const filters: any = {
          keyword: searchQuery || undefined,
          zone: selectedZone !== "ALL" ? selectedZone : undefined,
          maxPrice: priceRange < 50000000 ? priceRange : undefined,
          sort: sortBy
        };

        // Duration mapping logic
        if (selectedDurations.length > 0) {
          const ranges = selectedDurations.map(d => {
            if (d === "1-3 Days") return { min: 1, max: 3 };
            if (d === "4-7 Days") return { min: 4, max: 7 };
            if (d === "> 7 Days") return { min: 8, max: 100 };
            return { min: 1, max: 100 };
          });

          // Use the absolute min and max of all selected ranges
          // Note: This still treats it as a single range [minOfAll, maxOfAll]
          // which might include unwanted middle ranges if discrete ones are picked.
          // But for single selection (which is the most common use case), it works perfectly.
          filters.minDuration = Math.min(...ranges.map(r => r.min));
          filters.maxDuration = Math.max(...ranges.map(r => r.max));
        }

        const data = await tourService.searchTours(1, 100, filters);

        const mappedTours: Tour[] = data.content.map(item => ({
          id: String(item.id),
          name: item.title,
          description: `Discover the beauty of ${item.placeName}.`,
          image: item.thumbnail || "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80",
          gallery: [],
          adultPrice: item.adultPrice,
          childrenPrice: 0,
          duration: `${item.durationDays}D / ${item.durationNights}N`,
          rating: item.averageRating || 0,
          reviewCount: item.reviewCount || 0,
          zone: item.placeName as any,
          highlights: [],
          itinerary: [],
          reviews: []
        }));
        setTours(mappedTours);
      } catch (err) {
        console.error("Failed to fetch tours:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [searchQuery, selectedZone, priceRange, sortBy, selectedDurations]);

  const filteredTours = tours; // Backend does filtering now

  return (
    <div className="min-h-screen bg-background text-gray-900">
      <Header onBookClick={() => navigate("/tours")} />

      <main className="relative pt-24 pb-16 px-4 md:px-6">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-primary/5 rounded-full blur-[60px] md:blur-[100px] pointer-events-none" />
        <div className="absolute top-1/4 left-0 -translate-x-1/2 w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-cta/5 rounded-full blur-[50px] md:blur-[80px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 mb-8 md:mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 w-full text-center md:text-left"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] md:text-xs font-black uppercase tracking-widest mb-3">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Live Your Adventure
              </div>
              <h1 className="text-3xl md:text-5xl font-black mb-4 leading-[1.1]">
                Find Your Perfect <br className="hidden md:block" />
                <span className="text-primary">Vietnamese</span> Journey
              </h1>
              <p className="text-gray-500 text-sm md:text-base max-w-lg mb-6">
                From the misty mountains of Sa Pa to the golden sands of Da
                Nang, discover the tour that speaks to your soul.
              </p>
              <div className="max-w-xl px-2 md:px-0">
                <SearchBar
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="hidden md:flex gap-1 bg-white/80 backdrop-blur-md p-1.5 rounded-2xl shadow-xl shadow-primary/5 border border-white relative"
            >
              <button
                onClick={() => setViewType("grid")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all relative z-10 font-bold text-sm cursor-pointer ${viewType === "grid"
                  ? "text-white"
                  : "text-gray-400 hover:text-primary"
                  }`}
              >
                <LayoutGrid size={18} />
                <span>Grid</span>
                {viewType === "grid" && (
                  <motion.div
                    layoutId="activeToggle"
                    className="absolute inset-0 bg-primary rounded-xl -z-10 shadow-lg shadow-primary/30"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>

              <button
                onClick={() => setViewType("list")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all relative z-10 font-bold text-sm cursor-pointer ${viewType === "list"
                  ? "text-white"
                  : "text-gray-400 hover:text-primary"
                  }`}
              >
                <List size={18} />
                <span>List</span>
                {viewType === "list" && (
                  <motion.div
                    layoutId="activeToggle"
                    className="absolute inset-0 bg-primary rounded-xl -z-10 shadow-lg shadow-primary/30"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <div className="md:hidden flex justify-between items-center mb-4 px-2">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="btn-secondary py-3 px-6 w-full flex justify-center gap-2"
            >
              {isFilterOpen ? "Close Filters" : "Filters & Sort"}
            </button>
          </div>

          {/* Sidebar Filter */}
          <aside
            className={`w-full md:w-1/4 ${isFilterOpen ? "block" : "hidden md:block"}`}
          >
            <TourFilter
              selectedZone={selectedZone}
              setSelectedZone={setSelectedZone}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              selectedDurations={selectedDurations}
              setSelectedDurations={setSelectedDurations}
            />
          </aside>

          {/* Tour Listing */}
          <div className="w-full md:w-3/4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 px-2 md:px-0">
              <p className="text-gray-600 font-medium text-xs md:text-sm">
                Showing{" "}
                <span className="text-primary font-bold">
                  {filteredTours.length}
                </span>{" "}
                tours
              </p>

              <div className="w-full md:w-64">
                <Dropdown
                  label="Sort by"
                  options={SORT_OPTIONS}
                  value={sortBy}
                  onChange={(val) => setSortBy(String(val))}
                  icon={<ArrowUpDown size={18} />}
                  placeholder="Recommended"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Fetching real journeys...</p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredTours.length > 0 ? (
                  <motion.div
                    key={viewType}
                    layout
                    className={
                      viewType === "grid"
                        ? "grid grid-cols-1 lg:grid-cols-2 gap-6"
                        : "space-y-6"
                    }
                  >
                    {filteredTours.map((tour) => (
                      <TourCard key={tour.id} tour={tour} viewType={viewType} />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white rounded-3xl p-12 md:p-20 text-center border-2 border-dashed border-gray-100"
                  >
                    <h3 className="text-xl md:text-2xl font-bold text-gray-400 mb-2">
                      No tours found
                    </h3>
                    <p className="text-gray-500 text-sm md:text-base">
                      Try adjusting your filters or search query
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Tours;
