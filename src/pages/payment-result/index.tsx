import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Loader2,
  ArrowRight,
  ShoppingBag,
  House,
} from "lucide-react";
import Header from "../../components/layout/Header";

const PaymentResult: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  
  const paymentStatus = searchParams.get("status");

  useEffect(() => {
    if (paymentStatus === "SUCCESS") {
      setStatus("success");
    } else if (paymentStatus === "FAILED") {
      setStatus("failed");
    } else {
      // In case of unknown status, we could check with backend here if needed
      setStatus("failed");
    }
  }, [paymentStatus]);

  return (
    <div className="min-h-screen bg-background pb-20 overflow-hidden">
      <Header onBookClick={() => navigate("/tours")} />

      <main className="pt-28 md:pt-36 px-4 md:px-6 max-w-3xl mx-auto text-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-[2.5rem] p-10 md:p-16 shadow-2xl shadow-black/5 border border-gray-50 flex flex-col items-center space-y-8"
        >
          {status === "loading" && (
            <div className="flex flex-col items-center gap-4">
              <Loader2 size={64} className="text-primary animate-spin" />
              <h1 className="text-2xl font-black text-gray-900">Processing Payment...</h1>
            </div>
          )}

          {status === "success" && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.6 }}
                className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-green-500/40"
              >
                <CheckCircle size={48} />
              </motion.div>
              <div className="space-y-2">
                <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
                  Payment Successful!
                </h1>
                <p className="text-gray-500 font-medium text-lg">
                  Thank you for your booking. Your adventure starts soon!
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full pt-4">
                <button
                  onClick={() => navigate("/my-bookings")}
                  className="btn-primary py-4 text-base flex items-center justify-center gap-2 group"
                >
                  <ShoppingBag size={20} />
                  My Bookings
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="btn-secondary py-4 text-base flex items-center justify-center gap-2"
                >
                  <House size={20} />
                  Back to Home
                </button>
              </div>
            </>
          )}

          {status === "failed" && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.6 }}
                className="w-24 h-24 bg-red-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-red-500/40"
              >
                <XCircle size={48} />
              </motion.div>
              <div className="space-y-2">
                <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
                  Payment Failed
                </h1>
                <p className="text-gray-500 font-medium text-lg">
                  Oops! Something went wrong with your transaction. 
                  Please try again or contact support.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full pt-4">
                <button
                  onClick={() => navigate("/tours")}
                  className="btn-primary py-4 text-base flex items-center justify-center gap-2"
                >
                  Try Again
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="btn-secondary py-4 text-base flex items-center justify-center gap-2"
                >
                  <House size={20} />
                  Back to Home
                </button>
              </div>
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default PaymentResult;
