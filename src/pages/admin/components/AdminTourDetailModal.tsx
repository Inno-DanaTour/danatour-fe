import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MapPin,
  Clock,
  Calendar,
  Users,
  Info,
  Star,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Palmtree,
  DollarSign,
} from "lucide-react";
import { useAdminTourDetail } from "../hooks/useAdminTourDetail";

interface AdminTourDetailModalProps {
  tourId: number | string | null;
  isOpen: boolean;
  onClose: () => void;
}

const AdminTourDetailModal: React.FC<AdminTourDetailModalProps> = ({
  tourId,
  isOpen,
  onClose,
}) => {
  const {
    tour,
    loading,
    error,
    activeTab,
    setActiveTab,
    parseItinerary,
    handleRetry,
  } = useAdminTourDetail(tourId, isOpen);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        />

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          className="bg-white rounded-[2.5rem] w-full max-w-6xl max-h-[90vh] overflow-hidden relative shadow-2xl flex flex-col border border-white/20"
        >
          {/* Header */}
          <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                <Palmtree size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  {loading
                    ? "Loading Tour Details..."
                    : tour?.title || "Tour Detail"}
                </h2>
                <p className="text-slate-500 font-bold text-sm flex items-center gap-2">
                  <Info size={14} className="text-primary" />
                  Management & Oversight Console
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded-2xl transition-all active:scale-90"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-slate-400 font-black text-xs uppercase tracking-widest animate-pulse">
                  Querying Ecosystem Data...
                </p>
              </div>
            ) : error ? (
              <div className="h-full flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-6">
                  <Star size={40} className="rotate-12" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">
                  Sync Error
                </h3>
                <p className="text-slate-500 font-bold mb-6 max-w-xs">
                  {error}
                </p>
                <button
                  onClick={handleRetry}
                  className="px-8 py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                >
                  Retry Core Sync
                </button>
              </div>
            ) : tour ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left Column: Visuals & Stats */}
                <div className="lg:col-span-12 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col justify-between group hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                        Category
                      </span>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                          <Info size={18} />
                        </div>
                        <span className="text-lg font-black text-slate-900">
                          {tour.category.name}
                        </span>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col justify-between group hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                        Market Node
                      </span>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                          <MapPin size={18} />
                        </div>
                        <span className="text-lg font-black text-slate-900">
                          {tour.place.name}
                        </span>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col justify-between group hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                        Duration Cycle
                      </span>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                          <Clock size={18} />
                        </div>
                        <span className="text-lg font-black text-slate-900">
                          {tour.durationDays}D / {tour.durationNights}N
                        </span>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col justify-between group hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 text-primary">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                        Adulte Rate
                      </span>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                          <DollarSign size={18} />
                        </div>
                        <span className="text-2xl font-black">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(tour.adultPrice)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex items-center bg-slate-100/50 p-1.5 rounded-2xl w-fit">
                    {(["overview", "itinerary", "schedules"] as const).map(
                      (tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                            activeTab === tab
                              ? "bg-white text-slate-900 shadow-xl shadow-slate-200/50"
                              : "text-slate-500 hover:text-slate-900"
                          }`}
                        >
                          {tab}
                        </button>
                      ),
                    )}
                  </div>

                  <AnimatePresence mode="wait">
                    {activeTab === "overview" && (
                      <motion.div
                        key="overview"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-12"
                      >
                        <div className="lg:col-span-7 space-y-8">
                          <div>
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                              Description Intel
                            </h4>
                            <p className="text-slate-600 leading-relaxed font-medium text-lg whitespace-pre-line bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100">
                              {tour.description}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            {tour.images.map((img, i) => (
                              <div
                                key={i}
                                className="aspect-[16/10] rounded-3xl overflow-hidden border-2 border-white shadow-xl group cursor-pointer relative"
                              >
                                <img
                                  src={img.imageUrl}
                                  alt=""
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                {img.isThumbnail && (
                                  <span className="absolute top-4 left-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                                    Primary
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="lg:col-span-5 space-y-6">
                          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-900/20">
                            <h4 className="flex items-center gap-3 text-lg font-black mb-6">
                              <Users size={20} className="text-primary" />
                              Provider Entity
                            </h4>
                            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                              <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center font-black text-primary text-2xl">
                                DT
                              </div>
                              <div>
                                <p className="font-black text-lg leading-tight">
                                  Entity Name ID: {tour.companyId}
                                </p>
                                <p className="text-white/50 text-xs font-bold mt-1">
                                  Status: Operational
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                              Ecosystem Metrics
                            </h4>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                <span className="text-sm font-bold text-slate-500">
                                  Quality Index
                                </span>
                                <div className="flex items-center gap-2 text-primary">
                                  <Star size={16} fill="currentColor" />
                                  <span className="font-black">
                                    {tour.averageRating || 0}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                <span className="text-sm font-bold text-slate-500">
                                  Signal Count
                                </span>
                                <span className="font-black text-slate-900">
                                  {tour.reviewCount || 0} Feedbacks
                                </span>
                              </div>
                              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                <span className="text-sm font-bold text-slate-500">
                                  System Status
                                </span>
                                <span
                                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                    tour.status === "ACTIVE"
                                      ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                      : tour.status === "PENDING"
                                        ? "bg-amber-50 text-amber-600 border-amber-100"
                                        : "bg-rose-50 text-rose-600 border-rose-100"
                                  }`}
                                >
                                  {tour.status}
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
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8 max-w-4xl"
                      >
                        <div className="relative pl-8 space-y-12 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-1 before:bg-slate-100 before:rounded-full">
                          {parseItinerary(tour.itinerary).map((step, i) => (
                            <div key={i} className="relative group">
                              <div className="absolute -left-[37px] top-1.5 w-6 h-6 rounded-full bg-white border-4 border-slate-100 group-hover:border-primary transition-colors z-10" />
                              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 group-hover:bg-white group-hover:shadow-xl group-hover:shadow-slate-200/50 transition-all duration-300">
                                <div className="flex items-center gap-4 mb-4">
                                  <span className="text-xs font-black bg-primary text-white px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-primary/20">
                                    Day {step.day}
                                  </span>
                                  <h5 className="text-xl font-black text-slate-900 tracking-tight">
                                    {step.title}
                                  </h5>
                                </div>
                                <p className="text-slate-600 font-medium leading-relaxed">
                                  {step.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {activeTab === "schedules" && (
                      <motion.div
                        key="schedules"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      >
                        {tour.schedules && tour.schedules.length > 0 ? (
                          tour.schedules.map((s) => (
                            <div
                              key={s.id}
                              className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-xl transition-all duration-300"
                            >
                              <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex flex-col items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform">
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                                    {new Date(s.startDate).toLocaleDateString(
                                      "en-US",
                                      { month: "short" },
                                    )}
                                  </span>
                                  <span className="text-2xl font-black text-slate-900 leading-none">
                                    {new Date(s.startDate).toLocaleDateString(
                                      "en-US",
                                      { day: "numeric" },
                                    )}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-black text-slate-900 text-lg tracking-tight">
                                    System Node Departure
                                  </p>
                                  <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-widest flex items-center gap-2">
                                    <Calendar size={12} />
                                    {new Date(
                                      s.startDate,
                                    ).toLocaleDateString()}{" "}
                                    → {new Date(s.endDate).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div
                                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border ${
                                    s.availableSlots > 5
                                      ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                      : "bg-rose-50 text-rose-600 border-rose-100"
                                  }`}
                                >
                                  {s.availableSlots} / {s.capacity} Slots Left
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-full py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center gap-4">
                            <Calendar size={48} className="text-slate-200" />
                            <p className="text-slate-400 font-black text-xs uppercase tracking-widest">
                              No Scheduled Nodes Found
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : null}
          </div>

          <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Signal Stable | v2.0.4-LTS
              </span>
            </div>
            <button
              onClick={onClose}
              className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] shadow-xl shadow-slate-900/20 active:scale-95 transition-all"
            >
              Acknowledge & Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AdminTourDetailModal;
