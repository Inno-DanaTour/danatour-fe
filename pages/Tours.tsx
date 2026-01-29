import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, MapPin, Clock, Star, ArrowRight } from "lucide-react";
import Header from "../components/Header";

const Tours: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      <Header onBookClick={() => navigate("/explore#find-tour")} />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#FFC857] text-sm font-bold uppercase tracking-[0.3em] mb-4 block">
              Discover Da Nang
            </span>
            <h1 className="text-5xl md:text-7xl font-black mb-6 font-display">
              Find Your Perfect <span className="text-[#FFC857]">Tour</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-12">
              Explore our curated collection of tours from pristine beaches to
              ancient mountains
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-2 flex items-center gap-2 border border-white/10">
              <div className="flex-1 flex items-center gap-3 px-4">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tours, destinations..."
                  className="w-full bg-transparent border-none outline-none text-white placeholder-gray-400 py-3"
                />
              </div>
              <button className="px-8 py-3 bg-gradient-to-r from-[#FFC857] to-[#FFD980] text-black font-bold rounded-xl hover:shadow-lg hover:shadow-[#FFC857]/30 transition-all cursor-pointer">
                Search
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Coming Soon Content */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#FFC857] to-[#FFD980] flex items-center justify-center">
                <MapPin className="w-10 h-10 text-black" />
              </div>
              <h2 className="text-3xl font-bold mb-4 font-display">
                Tour Catalog Coming Soon
              </h2>
              <p className="text-gray-400 max-w-md mx-auto mb-8">
                We're crafting an amazing collection of tours for you. Check
                back soon or explore our personalized itinerary feature!
              </p>
              <button
                onClick={() => navigate("/explore")}
                className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 border border-white/20 rounded-full text-white font-semibold hover:bg-white/20 transition-all cursor-pointer"
              >
                Explore Da Nang
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Tours;
