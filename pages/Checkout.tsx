import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Wallet,
  User,
  Mail,
  Phone,
  MapPin,
  ChevronLeft,
  ShieldCheck,
} from "lucide-react";
import Header from "../components/Header";
import { Tour } from "../types";

const Checkout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const tour = location.state?.tour as Tour;
  const [paymentMethod, setPaymentMethod] = useState<"card" | "wallet">("card");

  if (!tour) {
    navigate("/tours");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/booking/confirmation", { state: { tour } });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onBookClick={() => {}} />

      <main className="pt-24 md:pt-32 pb-20 px-4 md:px-6 max-w-6xl mx-auto">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-6 md:mb-8 font-medium text-sm md:text-base"
        >
          <ChevronLeft size={18} />
          Back to details
        </motion.button>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-3xl md:text-4xl font-black mb-8 md:mb-12 leading-tight"
        >
          Complete Your <span className="text-primary">Booking</span>
        </motion.h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col lg:flex-row gap-8 lg:gap-12"
        >
          {/* Form Content */}
          <div className="w-full lg:w-3/5 space-y-8 md:space-y-12">
            {/* Customer Info */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h3 className="text-xl md:text-2xl font-bold flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <User size={20} />
                </div>
                Customer Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <label className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    required
                    className="input py-3.5 md:py-4 px-4 md:px-6 text-sm md:text-base rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    required
                    className="input py-3.5 md:py-4 px-4 md:px-6 text-sm md:text-base rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+84 ..."
                    required
                    className="input py-3.5 md:py-4 px-4 md:px-6 text-sm md:text-base rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">
                    Nationality
                  </label>
                  <input
                    type="text"
                    placeholder="Vietnam"
                    className="input py-3.5 md:py-4 px-4 md:px-6 text-sm md:text-base rounded-xl"
                  />
                </div>
              </div>
            </motion.section>

            {/* Payment Method */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              <h3 className="text-xl md:text-2xl font-bold flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <CreditCard size={20} />
                </div>
                Payment Method
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`p-5 md:p-6 rounded-2xl border-2 transition-all flex items-center gap-4 text-left group ${
                    paymentMethod === "card"
                      ? "border-primary bg-primary/5 shadow-lg shadow-primary/5"
                      : "border-gray-100 bg-white hover:border-gray-200"
                  }`}
                >
                  <div
                    className={`p-3 rounded-full transition-colors ${paymentMethod === "card" ? "bg-primary text-white" : "bg-gray-50 text-gray-400 group-hover:bg-gray-100"}`}
                  >
                    <CreditCard size={22} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm md:text-base">
                      Credit / Debit Card
                    </p>
                    <p className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wider font-bold">
                      Visa, Master, JCB
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("wallet")}
                  className={`p-5 md:p-6 rounded-2xl border-2 transition-all flex items-center gap-4 text-left group ${
                    paymentMethod === "wallet"
                      ? "border-primary bg-primary/5 shadow-lg shadow-primary/5"
                      : "border-gray-100 bg-white hover:border-gray-200"
                  }`}
                >
                  <div
                    className={`p-3 rounded-full transition-colors ${paymentMethod === "wallet" ? "bg-primary text-white" : "bg-gray-50 text-gray-400 group-hover:bg-gray-100"}`}
                  >
                    <Wallet size={22} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm md:text-base">
                      E-Wallet
                    </p>
                    <p className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wider font-bold">
                      MoMo, ZaloPay
                    </p>
                  </div>
                </button>
              </div>

              <AnimatePresence mode="wait">
                {paymentMethod === "card" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-6 md:p-8 bg-white rounded-3xl border border-gray-100 shadow-xl shadow-black/5 space-y-4 md:space-y-6 overflow-hidden"
                  >
                    <div className="space-y-2">
                      <label className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        className="input text-sm md:text-base"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM / YY"
                          className="input text-sm md:text-base"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-wider ml-1">
                          CVC / CVV
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          className="input text-sm md:text-base"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full lg:w-2/5"
          >
            <div className="card space-y-6 md:space-y-8 sticky top-24 border border-gray-100 shadow-2xl shadow-black/5 p-6 md:p-8 rounded-[2rem]">
              <h3 className="text-xl md:text-2xl font-black border-b border-gray-50 pb-4 md:pb-6">
                Summary
              </h3>

              <div className="flex gap-4 md:gap-5">
                <div className="w-20 md:w-24 h-20 md:h-24 shrink-0 rounded-2xl overflow-hidden shadow-sm">
                  <img
                    src={tour.image}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center gap-1">
                  <div className="text-[10px] text-primary font-black uppercase tracking-widest">
                    {tour.zone}
                  </div>
                  <h4 className="font-bold text-gray-900 leading-tight text-sm md:text-base line-clamp-2">
                    {tour.name}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1 font-medium">
                    {tour.duration}
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-50">
                <div className="flex justify-between items-center text-gray-500 text-sm md:text-base">
                  <span className="font-medium">Booking fee</span>
                  <span className="font-black text-gray-900">50.000 VNĐ</span>
                </div>
                <div className="flex justify-between items-center text-gray-500 text-sm md:text-base">
                  <span className="font-medium">Tour base price</span>
                  <span className="font-black text-gray-900">
                    {new Intl.NumberFormat("vi-VN").format(tour.price)} VNĐ
                  </span>
                </div>

                <div className="flex justify-between items-end pt-6 border-t border-primary/10">
                  <span className="text-base md:text-lg font-bold text-gray-900 uppercase tracking-widest">
                    Total
                  </span>
                  <div className="text-right">
                    <span className="text-2xl md:text-3xl font-black text-cta">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(tour.price + 50000)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <button
                  type="submit"
                  className="btn-primary w-full py-4 md:py-5 text-lg md:text-xl shadow-2xl shadow-cta/20 rounded-2xl"
                >
                  Safe Checkout
                </button>
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <ShieldCheck size={18} />
                  <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">
                    Secure 256-bit SSL encryption
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </form>
      </main>
    </div>
  );
};

export default Checkout;
