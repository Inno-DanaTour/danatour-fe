import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Chrome, MapPin, ArrowLeft } from "lucide-react";
import { useSignup } from "./hooks/useSignup";

const Signup = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const { handleSignup, loading, error, setError } = useSignup();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName || !phone || !confirmPassword) {
      setError("Please fill all fields");
      return;
    }
    try {
      await handleSignup({ fullName, email, phone, password, confirmPassword });
      setSuccessMsg(
        "Registration successful! Please check your email to verify.",
      );
    } catch (err) {
      // Error handled by hook
    }
  };

  // --- ANIMATION VARIANTS ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#004E89]">
      {/* 1. CINEMATIC VIDEO BACKGROUND */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/Cangdanang.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark overlay & Blur for focus */}
      <div className="absolute inset-0 bg-[#004E89]/40 backdrop-blur-sm z-0" />

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

      {/* 2. CENTERED CONTENT CONTAINER */}
      <main className="relative z-10 w-full h-full flex items-center justify-center p-4">
        {/* --- THE GLASS CARD --- */}
        <motion.div
          className="w-full max-w-[460px] p-8 rounded-[2.5rem] bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* --- BRAND ANCHOR (TOP LOGO) --- */}
          <motion.div
            variants={itemVariants}
            className="w-full flex flex-col items-center mb-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFC857] to-[#FFD980] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform mb-2">
              <MapPin className="w-6 h-6 text-black" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight font-display">
              Dana<span className="text-[#FFC857]">Tour</span>
            </span>
          </motion.div>

          {/* --- HEADINGS --- */}
          <motion.div variants={itemVariants} className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 tracking-tight drop-shadow-lg">
              Begin Journey
            </h1>
            <p className="text-white/60 text-xs font-medium tracking-wide uppercase">
              Join the adventure today
            </p>
          </motion.div>

          {/* --- ERROR MESSAGES --- */}
          {error && !successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-100 text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          {successMsg ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center py-6"
            >
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-6 text-green-400">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                Check Your Email
              </h2>
              <p className="text-white/80 text-sm mb-8">{successMsg}</p>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="w-full py-3 rounded-2xl font-bold uppercase tracking-wider text-[#002B49] bg-gradient-to-r from-[#FFC857] to-[#FCA311] shadow-[0_0_15px_rgba(255,200,87,0.2)] hover:scale-105 transition-transform text-sm"
              >
                Proceed to Login
              </button>
            </motion.div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              {/* FULL NAME INPUT */}
              <motion.div variants={itemVariants}>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:bg-white/15 focus:border-[#FFC857] transition-all duration-200 text-sm"
                />
              </motion.div>

              {/* EMAIL INPUT */}
              <motion.div variants={itemVariants}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:bg-white/15 focus:border-[#FFC857] transition-all duration-200 text-sm"
                />
              </motion.div>

              {/* PHONE INPUT */}
              <motion.div variants={itemVariants}>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone number"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:bg-white/15 focus:border-[#FFC857] transition-all duration-200 text-sm"
                />
              </motion.div>

              {/* PASSWORD INPUT */}
              <motion.div variants={itemVariants} className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 pr-10 text-white placeholder-white/40 focus:outline-none focus:bg-white/15 focus:border-[#FFC857] transition-all duration-200 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </motion.div>

              {/* CONFIRM PASSWORD INPUT */}
              <motion.div variants={itemVariants} className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 pr-10 text-white placeholder-white/40 focus:outline-none focus:bg-white/15 focus:border-[#FFC857] transition-all duration-200 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </motion.div>

              {/* ACTIONS */}
              <motion.div
                variants={itemVariants}
                className="flex items-center justify-center text-xs text-white/60"
              >
                <span className="mr-1">Already have an account?</span>
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-[#FFC857] hover:text-white transition-colors font-bold"
                >
                  Login
                </button>
              </motion.div>

              {/* MAGNETIC BUTTON */}
              <motion.div variants={itemVariants}>
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={
                    !loading
                      ? {
                          scale: 1.02,
                          boxShadow: "0 0 30px rgba(255, 200, 87, 0.4)",
                        }
                      : {}
                  }
                  whileTap={!loading ? { scale: 0.98 } : {}}
                  className={`w-full py-3 rounded-2xl font-bold uppercase tracking-wider text-[#002B49] bg-gradient-to-r from-[#FFC857] to-[#FCA311] shadow-[0_0_15px_rgba(255,200,87,0.2)] relative overflow-hidden text-sm ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  <span className="relative z-10">
                    {loading ? "Creating..." : "Create Account"}
                  </span>
                  {/* Shine Effect */}
                  {!loading && (
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] animate-[shine_3s_infinite]" />
                  )}
                </motion.button>
              </motion.div>

              {/* DIVIDER */}
              <motion.div
                variants={itemVariants}
                className="relative flex py-1 items-center"
              >
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink-0 mx-4 text-white/30 text-[10px] uppercase tracking-widest">
                  Or join with
                </span>
                <div className="flex-grow border-t border-white/10"></div>
              </motion.div>

              {/* SOCIAL BUTTONS */}
              <div className="space-y-2">
                {/* Google Button */}
                <motion.button
                  variants={itemVariants}
                  whileHover={{
                    y: -2,
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  }}
                  className="w-full py-2.5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center text-white/90 font-medium transition-all group text-sm"
                >
                  <Chrome className="mr-3 text-[#DB4437]" size={18} />
                  Continue with Google
                </motion.button>
              </div>
            </form>
          )}
        </motion.div>

        {/* FOOTER */}
        <div className="absolute bottom-6 text-center w-full z-10 text-[10px] text-white/30 uppercase tracking-[0.2em]">
          © 2026 DanaTour Network — Ocean Node
        </div>
      </main>

      {/* CSS Animation for shine effect */}
      <style>{`
        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          50%, 100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default Signup;
