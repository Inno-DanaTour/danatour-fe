import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Check, Star, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import Header from "../../components/layout/Header";
import ImageGallery from "../../features/tours/ImageGallery";
import ItineraryTimeline from "../../features/tours/ItineraryTimeline";
import BookingSidebar from "../../features/tours/BookingSidebar";
import ReviewCard from "../../components/ui/ReviewCard";
import { tourService } from "../../services/tourService";
import { Tour, ItineraryItem } from "../../types/types";

const TourDetail: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "itinerary" | "schedules" | "reviews"
  >("overview");

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await tourService.getTourDetail(id);

        // Parse itinerary string into ItineraryItem[]
        let mappedItinerary: ItineraryItem[] = [];
        if (data.itinerary) {
          const lines = data.itinerary.split('\n').filter(line => line.trim() !== "");
          if (lines.length > 0 && lines[0].toLowerCase().includes("day")) {
            // Simple parsing: Each line starting with "Day" is a new day
            let currentDay = 0;
            lines.forEach(line => {
              if (line.toLowerCase().startsWith("day")) {
                currentDay++;
                const parts = line.split(':');
                mappedItinerary.push({
                  day: currentDay,
                  title: parts[0].trim(),
                  description: parts.slice(1).join(':').trim() || "Activities for the day"
                });
              } else if (mappedItinerary.length > 0) {
                mappedItinerary[mappedItinerary.length - 1].description += " " + line.trim();
              }
            });
          } else {
            // Fallback: One big Day 1
            mappedItinerary = [{
              day: 1,
              title: "Full Journey",
              description: data.itinerary
            }];
          }
        }

        const mappedTour: Tour = {
          id: String(data.id),
          name: data.title,
          description: data.description,
          image: data.images[0]?.imageUrl || "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80",
          gallery: data.images.map(img => img.imageUrl),
          price: data.basePrice,
          duration: `${data.durationDays}D / ${data.durationNights}N`,
          rating: 4.8, // Mock if not in DTO
          reviewCount: 24, // Mock if not in DTO
          zone: data.place.name as any,
          highlights: ["Local Guide", "Transportation", "Entrance Fees", "Lunch included"],
          itinerary: mappedItinerary,
          reviews: [],
          schedules: data.schedules
        };
        setTour(mappedTour);
      } catch (err) {
        console.error("Failed to fetch tour detail:", err);
        navigate("/tours");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-gray-500 font-bold animate-pulse">Loading journey details...</p>
      </div>
    );
  }

  if (!tour) return null;

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header onBookClick={() => navigate("/tours")} />

      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-primary origin-left z-[60]"
        style={{ scaleX }}
      />

      <main className="pt-24 md:pt-32 px-4 md:px-6 max-w-7xl mx-auto">
        {/* Breadcrumbs / Back button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-6 md:mb-8 font-medium text-sm md:text-base"
        >
          <ArrowLeft size={18} />
          Back to list
        </motion.button>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 pb-10">
          {/* Main Content */}
          <div className="w-full lg:w-2/3 space-y-8 md:space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] md:text-sm font-bold uppercase tracking-wider">
                  {String(tour.zone)}
                </span>
                <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm md:text-base">
                  <Star size={18} fill="currentColor" />
                  <span>{tour.rating}</span>
                  <span className="text-gray-400 font-medium ml-1">
                    ({tour.reviewCount} reviews)
                  </span>
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
                {tour.name}
              </h1>
              <ImageGallery images={tour.gallery} />
            </motion.div>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="border-b border-gray-200 sticky top-20 bg-background/80 backdrop-blur-md z-30 pt-4"
            >
              <div className="flex gap-6 md:gap-10 overflow-x-auto no-scrollbar">
                {["overview", "itinerary", "schedules", "reviews"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`pb-4 text-base md:text-lg font-bold capitalize transition-all relative shrink-0 ${activeTab === tab
                      ? "text-primary"
                      : "text-gray-400 hover:text-gray-600"
                      }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTabDetails"
                        className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full"
                      />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Tab Panels */}
            <div className="min-h-[400px]">
              <AnimatePresence mode="wait">
                {activeTab === "overview" && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold mb-4">
                        Tour Overview
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-base md:text-lg whitespace-pre-line">
                        {tour.description}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-lg md:text-xl font-bold mb-4">
                        Highlights
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {tour.highlights.map((h, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm border border-gray-50"
                          >
                            <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                              <Check size={14} />
                            </div>
                            <span className="text-gray-700 font-medium text-sm md:text-base">
                              {h}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-12 border-t border-gray-100">
                      <h3 className="text-xl md:text-2xl font-bold mb-6">
                        About the Provider
                      </h3>
                      <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-black/5 flex flex-col md:flex-row gap-6 items-start md:items-center">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-lg">
                          <img
                            src="https://images.unsplash.com/photo-1599305090748-35699709d435?w=500&auto=format&fit=crop&q=60"
                            className="w-full h-full object-cover"
                            alt="Provider"
                          />
                        </div>
                        <div className="flex-grow space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-black text-xl text-gray-900">
                              Local Partner
                            </h4>
                            <CheckCircle size={16} className="text-green-500" />
                          </div>
                          <p className="text-gray-500 text-sm line-clamp-2">
                            Authentic local experiences across Vietnam. We show you the hidden gems.
                          </p>
                          <div className="flex items-center gap-4 pt-2">
                            <span className="flex items-center gap-1 text-yellow-500 font-bold text-xs">
                              <Star size={12} fill="currentColor" /> 5.0
                            </span>
                            <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                              Verified Provider
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "itinerary" && (
                  <motion.div
                    key="itinerary"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <h3 className="text-xl md:text-2xl font-bold mb-8">
                      What to Expect
                    </h3>
                    <ItineraryTimeline items={tour.itinerary} />
                  </motion.div>
                )}

                {activeTab === "schedules" && (
                  <motion.div
                    key="schedules"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl md:text-2xl font-bold">Upcoming Departures</h3>
                      <span className="text-gray-500 text-sm font-medium">All times in local timezone</span>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {tour.schedules && tour.schedules.length > 0 ? (
                        tour.schedules.map((s) => (
                          <div
                            key={s.id}
                            className="bg-white p-5 md:p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
                          >
                            <div className="flex items-center gap-6">
                              <div className="flex flex-col items-center justify-center bg-primary/5 text-primary rounded-2xl w-16 h-16 shrink-0">
                                <span className="text-[10px] uppercase font-black tracking-widest leading-none mb-1">
                                  {new Date(s.startDate).toLocaleDateString("en-US", { month: "short" })}
                                </span>
                                <span className="text-2xl font-black leading-none">
                                  {new Date(s.startDate).toLocaleDateString("en-US", { day: "numeric" })}
                                </span>
                              </div>

                              <div>
                                <div className="font-bold text-gray-900 text-lg">
                                  {new Date(s.startDate).toLocaleDateString("en-US", { weekday: 'long' })}
                                </div>
                                <div className="text-gray-500 text-sm flex items-center gap-2">
                                  <span>{new Date(s.startDate).toLocaleDateString("vi-VN")}</span>
                                  <span>→</span>
                                  <span>{new Date(s.endDate).toLocaleDateString("vi-VN")}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between md:justify-end gap-10">
                              <div className="text-right">
                                <div className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Availability</div>
                                <div className={`font-bold text-sm ${s.capacity > 5 ? 'text-green-500' : 'text-cta'}`}>
                                  {s.capacity} spots left
                                </div>
                              </div>

                              <div className="text-right">
                                <div className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Price per guest</div>
                                <div className="font-black text-xl text-primary">
                                  {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format(tour.price)}
                                </div>
                              </div>

                              <button className="btn-primary py-3 px-8 rounded-2xl shadow-lg shadow-primary/20 whitespace-nowrap hidden md:block">
                                Book This Date
                              </button>
                            </div>
                            <button className="btn-primary py-4 px-8 rounded-2xl md:hidden">
                              Select This Date
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
                          <p className="text-gray-400 font-medium">No upcoming departures found for this tour.</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {activeTab === "reviews" && (
                  <motion.div
                    key="reviews"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl md:text-2xl font-bold">
                        Traveler Reviews
                      </h3>
                    </div>
                    {tour.reviews.length > 0 ? (
                      <div className="space-y-4">
                        {tour.reviews.map((r) => (
                          <ReviewCard key={r.id} review={r} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16 md:py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                        <p className="text-gray-400 text-sm md:text-base">
                          No reviews yet. Be the first to share your experience!
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block w-full lg:w-1/3">
            <BookingSidebar tour={tour} />
          </div>
        </div>
      </main>

      {/* Mobile Sticky Booking Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 p-4 z-40 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.15)] flex items-center justify-between pb-safe">
        <div>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
            Price per guest
          </span>
          <span className="text-xl font-black text-cta">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(tour.price)}
          </span>
        </div>
        <button
          className="btn-primary py-3.5 px-10 text-base shadow-xl shadow-cta/20"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default TourDetail;
