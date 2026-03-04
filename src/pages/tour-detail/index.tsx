import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Check, Star, ArrowLeft, CheckCircle } from "lucide-react";
import Header from "../../components/layout/Header";
import ImageGallery from "../../features/tours/ImageGallery";
import ItineraryTimeline from "../../features/tours/ItineraryTimeline";
import BookingSidebar from "../../features/tours/BookingSidebar";
import ReviewCard from "../../components/ui/ReviewCard";
import { TOURS } from "../../constants/constants";
import { companyService } from "../company-detail/services/companyService";
import { Company, Tour } from "../../types/types";

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
  const [company, setCompany] = useState<Company | null>(null);
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [activeTab, setActiveTab] = useState<
    "overview" | "itinerary" | "reviews"
  >("overview");

  useEffect(() => {
    const foundTour = TOURS.find((t) => t.id === id);
    if (foundTour) {
      setTour(foundTour);
      // Fetch dynamic company info using the tour's real provider ID
      companyService.getCompanyById(foundTour.companyId)
        .then(setCompany)
        .catch(console.error);
      
      // Fetch all companies to display at the bottom
      companyService.getAllCompanies()
        .then(setAllCompanies)
        .catch(console.error);
    } else {
      navigate("/tours");
    }
  }, [id, navigate]);

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
                  {tour.zone}
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

            {/* Provider Section - Prominent Position */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              {company ? (
                <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-black/5 flex flex-col md:flex-row gap-6 items-start md:items-center">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-lg">
                    <img
                      src={company.logoUrl || "https://images.unsplash.com/photo-1599305090748-35699709d435?w=500&auto=format&fit=crop&q=60"}
                      className="w-full h-full object-cover"
                      alt={company.name}
                    />
                  </div>
                  <div className="flex-grow space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-xl text-gray-900">
                        {company.name}
                      </h4>
                      <CheckCircle size={16} className="text-green-500" />
                    </div>
                    <p className="text-gray-500 text-sm line-clamp-2 font-medium">
                      {company.description}
                    </p>
                    <div className="flex items-center gap-4 pt-2">
                      <span className="flex items-center gap-1 text-yellow-500 font-bold text-xs bg-yellow-50 px-2 py-1 rounded-full">
                        <Star size={12} fill="currentColor" /> {company.averageRating}
                      </span>
                      <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                        {company.totalTours} Tours Active
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/companies/${company.id}`)}
                    className="w-full md:w-auto px-6 py-3 bg-primary/10 text-primary rounded-xl font-bold text-sm hover:bg-primary hover:text-white transition-all whitespace-nowrap"
                  >
                    View Profile
                  </button>
                </div>
              ) : (
                <div className="h-32 flex items-center justify-center bg-gray-50 rounded-[2rem] border border-dashed animate-pulse">
                  <p className="text-gray-400 font-medium">Loading provider info...</p>
                </div>
              )}
            </motion.div>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="border-b border-gray-200 sticky top-20 bg-background/80 backdrop-blur-md z-30 pt-4"
            >
              <div className="flex gap-6 md:gap-10 overflow-x-auto no-scrollbar">
                {["overview", "itinerary", "reviews"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`pb-4 text-base md:text-lg font-bold capitalize transition-all relative shrink-0 ${
                      activeTab === tab
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
                      <p className="text-gray-600 leading-relaxed text-base md:text-lg">
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


                    {/* All Companies Section - Horizontal Scroller */}
                    {allCompanies.filter(c => c.id !== company?.id).length > 0 && (
                      <div className="pt-12 mt-8 border-t border-gray-100 bg-gray-50/50 -mx-6 px-6 py-12 rounded-[3rem]">
                        <div className="flex items-center justify-between mb-8 px-2">
                          <div className="space-y-1">
                            <h3 className="text-2xl md:text-3xl font-black text-gray-900">
                              Explore Our Partners
                            </h3>
                            <p className="text-gray-500 text-sm font-medium">
                              Discover more authentic local experiences from our trusted providers.
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-6 overflow-x-auto pb-8 no-scrollbar touch-pan-x">
                          {allCompanies
                            .filter(c => c.id !== company?.id)
                            .map((c) => (
                              <motion.div
                                key={c.id}
                                whileHover={{ y: -8, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate(`/companies/${c.id}`)}
                                className="min-w-[220px] md:min-w-[260px] bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all cursor-pointer text-center space-y-4 shrink-0 group"
                              >
                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl overflow-hidden mx-auto shadow-md group-hover:shadow-xl transition-all duration-500">
                                  <img
                                    src={c.logoUrl || "https://images.unsplash.com/photo-1599305090748-35699709d435?w=500&auto=format&fit=crop&q=60"}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    alt={c.name}
                                  />
                                </div>
                                <div className="space-y-1">
                                  <h5 className="font-black text-base md:text-lg text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                                    {c.name}
                                  </h5>
                                  <div className="flex items-center justify-center gap-1.5 text-yellow-500 font-black text-xs">
                                    <Star size={14} fill="currentColor" /> {c.averageRating}
                                  </div>
                                </div>
                                <div className="pt-2">
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-primary/60 transition-colors">
                                    {c.totalTours} Tours Active
                                  </span>
                                </div>
                              </motion.div>
                            ))}
                        </div>
                      </div>
                    )}
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
                      <button className="btn-secondary text-xs md:text-sm py-2 px-6">
                        Write a Review
                      </button>
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
          onClick={() =>
            navigate("/checkout", {
              state: {
                tour,
                guestCount: 1,
                date: new Date().toISOString().split("T")[0],
              },
            })
          }
          className="btn-primary py-3.5 px-10 text-base shadow-xl shadow-cta/20"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default TourDetail;
