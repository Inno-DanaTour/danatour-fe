import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { useVerify } from "./hooks/useVerify";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { verifyEmail, resendVerification, loading, error, successMsg } =
    useVerify();
  const [emailForResend, setEmailForResend] = useState("");
  const [hasAttempted, setHasAttempted] = useState(false);

  useEffect(() => {
    if (token && !hasAttempted) {
      setHasAttempted(true);
      verifyEmail(token).catch(() => {});
    }
  }, [token, verifyEmail, hasAttempted]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailForResend) return;
    try {
      await resendVerification(emailForResend);
    } catch (err) {
      // Handled by hook
    }
  };

  // --- ANIMATION VARIANTS ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#004E89]">
      <div className="absolute inset-0 bg-[#004E89]/40 backdrop-blur-md z-0" />

      {/* BACK BUTTON */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="absolute top-6 left-6 z-20 flex items-center gap-3 text-white/70 hover:text-white transition-colors group cursor-pointer"
        onClick={() => navigate("/")}
      >
        <div className="p-2.5 rounded-full bg-white/10 border border-white/10 group-hover:bg-white/20 group-hover:border-white/30 transition-all backdrop-blur-md">
          <ArrowLeft size={18} />
        </div>
        <span className="text-xs font-bold tracking-[0.2em] uppercase hidden md:block">
          Back to Home
        </span>
      </motion.button>

      {/* CENTERED CONTENT */}
      <main className="relative z-10 w-full h-full flex items-center justify-center p-4">
        <motion.div
          className="w-full max-w-[420px] p-8 md:p-12 rounded-[2.5rem] bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* BRAND */}
          <motion.div
            variants={itemVariants}
            className="w-full flex flex-col items-center mb-6"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFC857] to-[#FFD980] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform mb-4">
              <MapPin className="w-7 h-7 text-black" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight font-display">
              Dana<span className="text-[#FFC857]">Tour</span>
            </span>
          </motion.div>

          {/* STATUS ICONS & MESSAGE */}
          <motion.div variants={itemVariants} className="mb-6">
            {!hasAttempted || loading ? (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-[#FFC857]/30 border-t-[#FFC857] rounded-full animate-spin mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">
                  Verifying Email...
                </h2>
                <p className="text-white/60 text-sm">
                  Please wait while we confirm your address.
                </p>
              </div>
            ) : successMsg ? (
              <div className="flex flex-col items-center">
                <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Success!</h2>
                <p className="text-green-100/90 text-sm mb-6">{successMsg}</p>
                <button
                  onClick={() => navigate("/login")}
                  className="w-full py-3 rounded-2xl font-bold uppercase tracking-wider text-[#002B49] bg-[#FFC857] shadow-lg hover:bg-white transition-colors text-sm"
                >
                  Proceed to Login
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <XCircle className="w-16 h-16 text-red-400 mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">
                  Verification Failed
                </h2>
                <p className="text-red-100/90 text-sm mb-6">
                  {error || "Invalid or expired token."}
                </p>

                <form onSubmit={handleResend} className="w-full space-y-3">
                  <p className="text-white/80 text-xs mb-2">
                    Need a new link? Enter your email:
                  </p>
                  <input
                    type="email"
                    value={emailForResend}
                    onChange={(e) => setEmailForResend(e.target.value)}
                    placeholder="Email address"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:bg-white/15 focus:border-white/40 transition-all text-sm"
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 rounded-2xl font-bold uppercase tracking-wider text-white border border-white/20 bg-white/5 hover:bg-white/10 transition-colors text-sm ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    Resend Verification Email
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default VerifyEmail;
