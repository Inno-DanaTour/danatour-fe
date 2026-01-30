import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Download,
  Calendar,
  Ticket,
  ArrowRight,
  Share2,
  PartyPopper,
} from "lucide-react";
import Header from "../components/Header";
import { motion } from "framer-motion";
import { Tour } from "../types";

const Confirmation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const tour = location.state?.tour as Tour;

  const bookingRef =
    "DT-" + Math.random().toString(36).substring(2, 9).toUpperCase();

  return (
    <div className="min-h-screen bg-background pb-20 overflow-hidden">
      <Header onBookClick={() => navigate("/tours")} />

      <main className="pt-28 md:pt-36 px-4 md:px-6 max-w-3xl mx-auto text-center relative">
        {/* Decorative Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="space-y-8 md:space-y-12"
        >
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="w-20 md:w-28 h-20 md:h-28 bg-green-500 text-white rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-green-500/30"
            >
              <CheckCircle size={48} className="md:size-[64px]" />
            </motion.div>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-3 tracking-tight">
              Booking Confirmed!
            </h1>
            <div className="flex items-center justify-center gap-2 text-gray-500 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-100 shadow-sm">
              <PartyPopper size={18} className="text-cta" />
              <p className="text-sm md:text-lg font-medium">
                Get ready for an unforgettable journey in Da Nang.
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-2xl shadow-black/5 border border-gray-50 text-left space-y-8 md:space-y-10"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-[10px] md:text-xs text-gray-400 uppercase font-black tracking-[0.2em]">
                  Booking Reference
                </span>
                <p className="text-xl md:text-3xl font-black text-primary mt-1">
                  {bookingRef}
                </p>
              </div>
              <div className="flex gap-3">
                <button className="w-10 md:w-12 h-10 md:h-12 flex items-center justify-center text-gray-400 hover:text-primary transition-all hover:bg-primary/5 rounded-2xl border border-gray-100">
                  <Share2 size={20} />
                </button>
                <button className="w-10 md:w-12 h-10 md:h-12 flex items-center justify-center text-gray-400 hover:text-primary transition-all hover:bg-primary/5 rounded-2xl border border-gray-100">
                  <Download size={20} />
                </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 p-5 md:p-6 bg-gray-50/50 rounded-3xl border border-gray-100/50">
              <div className="w-full md:w-32 h-40 md:h-32 rounded-2xl overflow-hidden shadow-lg shadow-black/10">
                <img
                  src={
                    tour?.image ||
                    "https://images.unsplash.com/photo-1583417319070-4a69db38a482"
                  }
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-center space-y-3">
                <div className="text-[10px] text-primary font-black uppercase tracking-widest">
                  {tour?.zone || "Sea"}
                </div>
                <h3 className="text-xl md:text-2xl font-black text-gray-900 leading-tight">
                  {tour?.name || "Coastal Adventure"}
                </h3>
                <div className="flex flex-wrap gap-4 text-xs md:text-sm font-bold text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-primary" />
                    <span>Oct 24, 2024</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ticket size={16} className="text-primary" />
                    <span>2 Tickets</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <button
                className="btn-primary w-full py-4.5 md:py-5 text-base md:text-lg flex items-center gap-3 justify-center shadow-xl shadow-cta/20"
                onClick={() => window.print()}
              >
                <Download size={20} />
                Download Ticket
              </button>
              <button
                className="btn-secondary w-full py-4.5 md:py-5 text-base md:text-lg flex items-center gap-3 justify-center shadow-xl shadow-black/5"
                onClick={() => navigate("/")}
              >
                Return Home
                <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="pt-6 text-gray-400 text-xs md:text-sm"
          >
            <p>A confirmation email has been sent to your email address.</p>
            <p className="mt-3 font-medium text-gray-500">
              Need help? Contact us at{" "}
              <strong className="text-primary">support@danatour.com</strong>
            </p>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Confirmation;
