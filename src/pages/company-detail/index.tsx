import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Star,
  Users,
  CheckCircle,
  ArrowLeft,
  Heart,
  Search,
  Loader2,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import Header from "../../components/layout/Header";
import { TOURS } from "../../constants/constants";
import { Company } from "./types";
import { Tour } from "../tours/types";
import { companyService } from "./services/companyService";
import { getToken } from "../../configs/api";
import { useCompanyDetail } from "./hooks/useCompanyDetail";

// Mock Company Data removed

const CompanyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    company,
    isFollowed,
    activeTours,
    otherTours,
    isLoading,
    error,
    showLoginPrompt,
    setShowLoginPrompt,
    handleToggleFollow,
  } = useCompanyDetail(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {error || "Company not found"}
        </h2>
        <button onClick={() => navigate(-1)} className="btn-primary px-8">
          Go Back
        </button>
      </div>
    );
  }

  const renderTourCard = (tour: Tour, idx: number, isPriority: boolean = false) => (
    <motion.div
      key={tour.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.1 }}
      onClick={() => navigate(`/tours/${tour.id}`)}
      className={`group cursor-pointer bg-white rounded-[2rem] overflow-hidden border transition-all ${
        isPriority 
          ? "border-primary/20 shadow-xl shadow-primary/5 hover:shadow-2xl hover:shadow-primary/10 ring-1 ring-primary/5" 
          : "border-gray-100 shadow-lg hover:shadow-2xl"
      }`}
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={tour.image}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          alt={tour.name}
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest text-primary shadow-sm w-fit">
            {tour.zone}
          </div>
          {isPriority && isFollowed && (
            <div className="bg-primary px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-primary/20 border border-white/20 flex items-center gap-1.5 animate-pulse">
              <Heart size={10} fill="currentColor" />
              Followed
            </div>
          )}
        </div>
      </div>
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
            <Star size={14} fill="currentColor" />
            {tour.rating}
          </div>
          <span className="text-xs font-bold text-gray-400">
            {tour.duration}
          </span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
          {tour.name}
        </h3>
        <div className="flex items-center justify-between pt-2">
          <div>
            <span className="text-xs text-gray-400 block font-bold uppercase">
              From
            </span>
            <span className="text-xl font-black text-cta">
              {new Intl.NumberFormat("vi-VN").format(tour.adultPrice)} VNĐ
            </span>
          </div>
          <button className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            isPriority ? "bg-primary text-white" : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
          }`}>
            <ArrowLeft className="rotate-180" size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header onBookClick={() => navigate("/tours")} />

      <main className="pt-24 md:pt-32 px-4 md:px-6 max-w-7xl mx-auto pb-20">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-6 md:mb-8 font-medium px-2 md:px-0"
        >
          <ArrowLeft size={18} />
          Back
        </motion.button>

        {/* Login Prompt Notification */}
        <AnimatePresence>
          {showLoginPrompt && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl border border-primary/20 p-4 flex items-center gap-4 bg-gradient-to-r from-primary/5 to-transparent">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <AlertCircle size={24} />
                </div>
                <div className="flex-grow">
                  <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider">
                    Login Required
                  </h4>
                  <p className="text-xs text-gray-500 font-medium">
                    Please sign in to follow this agency and receive updates.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 bg-primary text-white text-xs font-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
                >
                  LOGIN
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Company Profile Header */}
        <section className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-12 shadow-xl shadow-black/5 border border-gray-100 mb-8 md:mb-12">
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center md:items-start text-center md:text-left">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-28 h-28 md:w-40 md:h-40 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl shrink-0 border-4 border-white"
            >
              <img
                src={
                  company.logoUrl ||
                  "https://images.unsplash.com/photo-1599305090748-35699709d435?w=500&auto=format&fit=crop&q=60"
                }
                alt={company.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
 
            <div className="flex-grow space-y-4 w-full">
              <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 justify-center md:justify-start">
                <h1 className="text-2xl md:text-5xl font-black text-gray-900 leading-tight">
                  {company.name}
                </h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <div className="flex items-center gap-1 bg-green-50 text-green-600 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0">
                    <CheckCircle size={14} />
                    Verified
                  </div>
                  {isFollowed && (
                    <div className="flex items-center gap-1 bg-primary/10 text-primary px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0">
                      <Heart size={14} fill="currentColor" />
                      Followed
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6 text-gray-600">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={18} className="text-primary" />
                  <span className="font-medium">{company.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Star size={18} fill="#FFC107" className="text-[#FFC107]" />
                  <span className="text-gray-900">{company.averageRating}</span>
                  <span className="text-gray-400">({company.totalTours} tours)</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Users size={18} className="text-primary" />
                  <span className="text-gray-900">1.2k</span>
                  <span className="text-gray-400">Followers</span>
                </div>
              </div>
 
              <p className="text-gray-500 text-base md:text-lg leading-relaxed max-w-3xl mx-auto md:mx-0">
                {company.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-center md:justify-start">
                <button
                  onClick={handleToggleFollow}
                  className={`flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-bold transition-all w-full sm:w-auto ${
                    isFollowed
                      ? "bg-gray-100 text-gray-600 border border-gray-200"
                      : "bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105 active:scale-95"
                  }`}
                >
                  <Heart size={20} fill={isFollowed ? "currentColor" : "none"} />
                  {isFollowed ? "Following" : "Follow Agency"}
                </button>
                <button className="px-8 py-3.5 rounded-2xl border-2 border-primary text-primary font-bold hover:bg-primary/5 transition-all w-full sm:w-auto">
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Company Tours */}
        <section className="space-y-8 mb-20">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">
              Journeys from {company.name} ({activeTours.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeTours.length > 0 ? (
              activeTours.map((tour, idx) => renderTourCard(tour, idx, true))
            ) : (
              <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                <p className="text-gray-500">No active tours from this agency yet.</p>
              </div>
            )}
          </div>
        </section>

        {/* Other Tours */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">
              Discover More Adventures
            </h2>
            <button 
              onClick={() => navigate("/tours")}
              className="text-primary font-bold text-sm flex items-center gap-1 hover:underline"
            >
              View All Tours <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-90 transition-opacity hover:opacity-100">
            {otherTours.map((tour, idx) => renderTourCard(tour, idx, false))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default CompanyDetail;
