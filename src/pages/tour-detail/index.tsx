import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Star, ArrowLeft, CheckCircle, Loader2, Flag, X, Send, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import Header from "../../components/layout/Header";
import ImageGallery from "../../features/tours/ImageGallery";
import ItineraryTimeline from "../../features/tours/ItineraryTimeline";
import BookingSidebar from "../../features/tours/BookingSidebar";
import FeedbackList from "../../features/tours/FeedbackList";
import { getToken } from "../../configs/api";
import { useTourDetail } from "./hooks/useTourDetail";

const TourDetail: React.FC = () => {
    const {
        tour,
        loading,
        company,
        allCompanies,
        activeTab,
        setActiveTab,
        showReportModal,
        setShowReportModal,
        reportReason,
        setReportReason,
        reportNote,
        setReportNote,
        isReporting,
        toasts,
        scaleX,
        handleReportSubmit,
        navigate,
    } = useTourDetail();

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-gray-500 font-bold animate-pulse">
                    Loading journey details...
                </p>
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

            {/* Toast Notifications */}
            <div className="fixed top-24 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 80, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 80, scale: 0.9 }}
                            className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl pointer-events-auto border-2 text-sm font-bold backdrop-blur-md
                                ${toast.type === "success"
                                    ? "bg-white/90 border-green-100 text-green-700"
                                    : "bg-white/90 border-red-100 text-red-600"
                                }`}
                        >
                            {toast.type === "success" ? (
                                <CheckCircle2 size={22} className="text-green-500" />
                            ) : (
                                <XCircle size={22} className="text-red-500" />
                            )}
                            {toast.message}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

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
                                <span
                                    className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] md:text-sm font-bold uppercase tracking-wider">
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
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
                                <h1 className="text-3xl md:text-5xl font-black leading-tight flex-1">
                                    {tour.name}
                                </h1>
                                {getToken() && (
                                    <button
                                        onClick={() => setShowReportModal(true)}
                                        className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-all font-bold text-sm bg-gray-50 hover:bg-red-50 px-4 py-2 rounded-xl border border-gray-100 mt-2 md:mt-4 shrink-0"
                                    >
                                        <Flag size={16} />
                                        Report Tour
                                    </button>
                                )}
                            </div>
                            <ImageGallery images={tour.gallery} />
                        </motion.div>

                        {/* Provider Section - Prominent Position */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                        >
                            {company ? (
                                <div
                                    className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-black/5 flex flex-col md:flex-row gap-6 items-start md:items-center">
                                    <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-lg">
                                        <img
                                            src={
                                                company.logoUrl ||
                                                "https://images.unsplash.com/photo-1599305090748-35699709d435?w=500&auto=format&fit=crop&q=60"
                                            }
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
                                            <span
                                                className="flex items-center gap-1 text-yellow-500 font-bold text-xs bg-yellow-50 px-2 py-1 rounded-full">
                                                <Star size={12} fill="currentColor" />{" "}
                                                {company.averageRating}
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
                                <div
                                    className="h-32 flex items-center justify-center bg-gray-50 rounded-[2rem] border border-dashed animate-pulse">
                                    <p className="text-gray-400 font-medium">
                                        Loading provider info...
                                    </p>
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
                                {["overview", "itinerary", "schedules", "reviews"].map(
                                    (tab) => (
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
                                    ),
                                )}
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
                                                        <div
                                                            className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                                                            <Check size={14} />
                                                        </div>
                                                        <span
                                                            className="text-gray-700 font-medium text-sm md:text-base">
                                                            {h}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* All Companies Section - Horizontal Scroller */}
                                        {allCompanies.filter((c) => c.id !== company?.id).length >
                                            0 && (
                                                <div
                                                    className="pt-12 mt-8 border-t border-gray-100 bg-gray-50/50 -mx-6 px-6 py-12 rounded-[3rem]">
                                                    <div className="flex items-center justify-between mb-8 px-2">
                                                        <div className="space-y-1">
                                                            <h3 className="text-2xl md:text-3xl font-black text-gray-900">
                                                                Explore Our Partners
                                                            </h3>
                                                            <p className="text-gray-500 text-sm font-medium">
                                                                Discover more authentic local experiences from our
                                                                trusted providers.
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex-grow space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="font-black text-xl text-gray-900">
                                                                Local Partner
                                                            </h4>
                                                            <CheckCircle size={16} className="text-green-500" />
                                                        </div>
                                                        <p className="text-gray-500 text-sm line-clamp-2">
                                                            Authentic local experiences across Vietnam. We show
                                                            you the hidden gems.
                                                        </p>
                                                        <div className="flex items-center gap-4 pt-2">
                                                            <span className="flex items-center gap-1 text-yellow-500 font-bold text-xs">
                                                                <Star size={12} fill="currentColor" /> 5.0
                                                            </span>
                                                            <span
                                                                className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                                                                Verified Provider
                                                            </span>
                                                        </div>
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

                                {activeTab === "schedules" && (
                                    <motion.div
                                        key="schedules"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="space-y-6"
                                    >
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-xl md:text-2xl font-bold">
                                                Upcoming Departures
                                            </h3>
                                            <span className="text-gray-500 text-sm font-medium">
                                                All times in local timezone
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4">
                                            {tour.schedules && tour.schedules.length > 0 ? (
                                                tour.schedules.map((s) => (
                                                    <div
                                                        key={s.id}
                                                        className="bg-white p-5 md:p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
                                                    >
                                                        <div className="flex items-center gap-6">
                                                            <div
                                                                className="flex flex-col items-center justify-center bg-primary/5 text-primary rounded-2xl w-16 h-16 shrink-0">
                                                                <span className="text-[10px] uppercase font-black tracking-widest leading-none mb-1">
                                                                    {new Date(s.startDate).toLocaleDateString(
                                                                        "en-US",
                                                                        { month: "short" },
                                                                    )}
                                                                </span>
                                                                <span className="text-2xl font-black leading-none">
                                                                    {new Date(s.startDate).toLocaleDateString(
                                                                        "en-US",
                                                                        { day: "numeric" },
                                                                    )}
                                                                </span>
                                                            </div>

                                                            <div>
                                                                <div className="font-bold text-gray-900 text-lg">
                                                                    {new Date(s.startDate).toLocaleDateString(
                                                                        "en-US",
                                                                        { weekday: "long" },
                                                                    )}
                                                                </div>
                                                                <div
                                                                    className="text-gray-500 text-sm flex items-center gap-2">
                                                                    <span>
                                                                        {new Date(s.startDate).toLocaleDateString(
                                                                            "vi-VN",
                                                                        )}
                                                                    </span>
                                                                    <span>→</span>
                                                                    <span>
                                                                        {new Date(s.endDate).toLocaleDateString(
                                                                            "vi-VN",
                                                                        )}
            </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div
                                                            className="flex items-center justify-between md:justify-end gap-10">
                                                            <div className="text-right">
                                                                <div
                                                                    className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">
                                                                    Availability
                                                                </div>
                                                                <div
                                                                    className={`font-bold text-sm ${s.availableSlots > 5 ? "text-green-500" : "text-cta"}`}
                                                                >
                                                                    {s.availableSlots} / {s.capacity} spots left
                                                                </div>
                                                            </div>

                                                            <div className="text-right">
                                                                <div
                                                                    className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">
                                                                    Price per guest
            </div>
                                                                <div className="font-black text-xl text-primary">
                                                                    {new Intl.NumberFormat("vi-VN", {
                                                                        style: "currency",
                                                                        currency: "VND",
                                                                    }).format(tour.adultPrice)}
                                                                </div>
                                                            </div>

                                                             <button
                                                                onClick={() => {
                                                                    const el = document.getElementById("booking-sidebar");
                                                                    el?.scrollIntoView({ behavior: "smooth", block: "center" });
                                                                }}
                                                                className="btn-primary py-3 px-8 rounded-2xl shadow-lg shadow-primary/20 whitespace-nowrap hidden md:block">
                                                                Book This Date
                                                            </button>
                                                        </div>
                                                         <button
                                                            onClick={() => {
                                                                const el = document.getElementById("booking-sidebar");
                                                                el?.scrollIntoView({ behavior: "smooth", block: "center" });
                                                            }}
                                                            className="btn-primary py-4 px-8 rounded-2xl md:hidden"
                                                        >
                                                            Select This Date
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                <div
                                                    className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
                                                    <p className="text-gray-400 font-medium">
                                                        No upcoming departures found for this tour.
                                                    </p>
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
                                        <FeedbackList tourId={tour.id} />
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
            <div
                className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 p-4 z-40 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.15)] flex items-center justify-between pb-safe">
                <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                        Price per guest
                    </span>
                    <span className="text-xl font-black text-cta">
                        {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                        }).format(tour.adultPrice)}
                    </span>
                </div>
                <button
                    onClick={() => {
                        const sidebarElement = document.getElementById("booking-sidebar");
                        if (sidebarElement) {
                            sidebarElement.scrollIntoView({ behavior: "smooth", block: "center" });
                        }
                    }}
                    className="btn-primary py-3.5 px-10 text-base shadow-xl shadow-cta/20">
                    Book Now
                </button>
            </div>

            {/* Report Modal */}
            <AnimatePresence>
                {showReportModal && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowReportModal(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden relative shadow-2xl border border-gray-100"
                        >
                            <div className="bg-red-50 p-8 flex items-center gap-4">
                                <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-500">
                                    <AlertTriangle size={24} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900">Report This Tour</h3>
                                    <p className="text-red-600/70 text-sm font-bold">Help us keep DanaTour safe and authentic</p>
                                </div>
                                <button
                                    onClick={() => setShowReportModal(false)}
                                    className="ml-auto w-10 h-10 rounded-xl bg-white/50 text-gray-500 hover:text-red-500 flex items-center justify-center transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-8 space-y-6">
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
                                        Reason for Reporting
                                    </label>
                                    <select
                                        value={reportReason}
                                        onChange={(e) => setReportReason(e.target.value)}
                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-gray-700 focus:border-red-500 focus:outline-none transition-colors appearance-none"
                                    >
                                        <option value="">Select a reason...</option>
                                        <option value="Spam">Spam / Repeated Content</option>
                                        <option value="Invalid Price">Incorrect / Misleading Price</option>
                                        <option value="Scam">Scam / Fraudulent activity</option>
                                        <option value="Inappropriate Content">Inappropriate / Offensive Content</option>
                                        <option value="Other">Other Issues</option>
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">
                                        Additional Notes (Optional)
                                    </label>
                                    <textarea
                                        value={reportNote}
                                        onChange={(e) => setReportNote(e.target.value)}
                                        placeholder="Tell us more about the issue..."
                                        rows={4}
                                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-gray-700 focus:border-red-500 focus:outline-none transition-colors resize-none"
                                    />
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <button
                                        onClick={() => setShowReportModal(false)}
                                        className="flex-1 py-4 px-6 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleReportSubmit}
                                        disabled={!reportReason || isReporting}
                                        className="flex-1 py-4 px-6 bg-red-500 text-white rounded-2xl font-black shadow-xl shadow-red-500/20 hover:bg-red-600 transition-all disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-3"
                                    >
                                        {isReporting ? (
                                            <Loader2 size={20} className="animate-spin" />
                                        ) : (
                                            <Send size={20} />
                                        )}
                                        Submit Report
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TourDetail;
