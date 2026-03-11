import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import Header from "../../components/layout/Header";
import { TOURS } from "../../constants/constants";
import { Company, Tour } from "../../types/types";
import { companyService } from "./services/companyService";
import { getToken } from "../../configs/api";
import { AlertCircle } from "lucide-react";

// Mock Company Data removed

const CompanyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [company, setCompany] = useState<Company | null>(null);
  const [isFollowed, setIsFollowed] = useState(false);
  const [activeTours, setActiveTours] = useState<Tour[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    const fetchCompany = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await companyService.getCompanyById(id);
        setCompany(data);
        setIsFollowed(!!data.isFollowed);
        // Still mocking tours for now as backend doesn't have tours per company yet
        setActiveTours(TOURS.slice(0, 3));
      } catch (err: any) {
        setError(err.message || "Failed to load company details");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchCompany();
  }, [id]);

  const handleToggleFollow = async () => {
    if (!id) return;
    
    if (!getToken()) {
      setShowLoginPrompt(true);
      setTimeout(() => setShowLoginPrompt(false), 5000);
      return;
    }

    try {
      const response = await companyService.toggleFollow(id);
      setIsFollowed(response.is_following);
    } catch (err: any) {
      setError(err.message || "Failed to toggle follow status");
    }
  };

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
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || "Company not found"}</h2>
        <button onClick={() => navigate(-1)} className="btn-primary px-8">Go Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onBookClick={() => navigate("/tours")} />

      <main className="pt-24 md:pt-32 px-4 md:px-6 max-w-7xl mx-auto pb-20">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-8 font-medium"
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
                  <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider">Login Required</h4>
                  <p className="text-xs text-gray-500 font-medium">Please sign in to follow this agency and receive updates.</p>
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
        <section className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-black/5 border border-gray-100 mb-12">
          <div className="flex flex-col md:flex-row gap-10 items-start md:items-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden shadow-2xl shrink-0"
            >
              <img
                src={company.logoUrl || "https://images.unsplash.com/photo-1599305090748-35699709d435?w=500&auto=format&fit=crop&q=60"}
                alt={company.name}
                className="w-full h-full object-cover"
              />
            </motion.div>

            <div className="flex-grow space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <h1 className="text-3xl md:text-5xl font-black text-gray-900">
                  {company.name}
                </h1>
                <div className="flex items-center gap-1 bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  <CheckCircle size={14} />
                  Verified Provider
                </div>
              </div>

              <div className="flex flex-wrap gap-6 text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-primary" />
                  <span className="font-medium">{company.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star size={18} fill="#FFC107" className="text-[#FFC107]" />
                  <span className="font-bold text-gray-900">
                    {company.averageRating}
                  </span>
                  <span className="text-gray-400">({company.totalTours} tours)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-primary" />
                  <span className="font-bold text-gray-900">1.2k</span>
                  <span className="text-gray-400">Followers</span>
                </div>
              </div>

              <p className="text-gray-500 text-lg leading-relaxed max-w-3xl">
                {company.description}
              </p>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleToggleFollow}
                  className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-bold transition-all ${
                    isFollowed
                      ? "bg-gray-100 text-gray-600 border border-gray-200"
                      : "bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105 active:scale-95"
                  }`}
                >
                  <Heart
                    size={20}
                    fill={isFollowed ? "currentColor" : "none"}
                  />
                  {isFollowed ? "Following" : "Follow Agency"}
                </button>
                <button className="px-8 py-3 rounded-2xl border-2 border-primary text-primary font-bold hover:bg-primary/5 transition-all">
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Active Tours */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">
              Active Tours ({activeTours.length})
            </h2>
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search tours from this agency..."
                className="pl-12 pr-6 py-3 bg-white rounded-2xl border border-gray-100 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all w-80 text-sm"
              />
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeTours.map((tour, idx) => (
              <motion.div
                key={tour.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => navigate(`/tours/${tour.id}`)}
                className="group cursor-pointer bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-lg hover:shadow-2xl transition-all"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={tour.image}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={tour.name}
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest text-primary shadow-sm">
                    {tour.zone}
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
                        {new Intl.NumberFormat("vi-VN").format(tour.price)} VNĐ
                      </span>
                    </div>
                    <button className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                      <ArrowLeft className="rotate-180" size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default CompanyDetail;
