import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, MapPin, ArrowLeft } from "lucide-react";
import { useChangePassword } from "./hooks/useChangePassword";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { handleChangePassword, loading, error } = useChangePassword();

  // Frontend validation
  const [validationError, setValidationError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!password || !confirmPassword) {
      setValidationError("Please fill in both fields");
      return;
    }

    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }

    try {
      await handleChangePassword({ password, confirmPassword });
      // on success, redirect is handled by the hook
    } catch (err: any) {
      // on error, it's handled by the hook
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
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#004E89]">
      {/* CINEMATIC VIDEO BACKGROUND */}
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

      {/* Dark overlay & Blur */}
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
          Home
        </span>
      </motion.button>

      {/* CENTERED CONTENT */}
      <main className="relative z-10 w-full h-full flex items-center justify-center p-4">
        <motion.div
          className="w-full max-w-[480px] p-8 md:p-12 rounded-[2.5rem] bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* BRAND ANCHOR */}
          <motion.div
            variants={itemVariants}
            className="w-full flex flex-col items-center mb-4"
          >
            <div className="w-20 h-20">
              <img
                src="/logo.png"
                alt="DanaTour Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xl font-bold text-white tracking-tight font-display">
              Dana<span className="text-[#FFC857]">Tour</span>
            </span>
          </motion.div>

          {/* HEADINGS */}
          <motion.div variants={itemVariants} className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 tracking-tight drop-shadow-lg">
              Set Your Password
            </h1>
            <p className="text-white/60 text-xs font-medium tracking-wide uppercase">
              Secure your Google-linked account
            </p>
          </motion.div>

          {/* ERROR MESSAGES */}
          {(error || validationError) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-100 text-sm text-center"
            >
              {validationError || error}
            </motion.div>
          )}

          {/* FORM */}
          <form onSubmit={onSubmit} className="space-y-4">
            {/* PASSWORD INPUT */}
            <motion.div variants={itemVariants} className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New Password"
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
                placeholder="Confirm New Password"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 pr-10 text-white placeholder-white/40 focus:outline-none focus:bg-white/15 focus:border-[#FFC857] transition-all duration-200 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </motion.div>

            {/* SUBMIT BUTTON */}
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
                className={`w-full py-3 mt-4 rounded-2xl font-bold uppercase tracking-wider text-[#002B49] bg-gradient-to-r from-[#FFC857] to-[#FCA311] shadow-[0_0_15px_rgba(255,200,87,0.2)] relative overflow-hidden text-sm ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                <span className="relative z-10">
                  {loading ? "Updating..." : "Update Password"}
                </span>
                {!loading && (
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] animate-[shine_3s_infinite]" />
                )}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>

        {/* FOOTER */}
        <div className="absolute bottom-6 text-center w-full z-10 text-[10px] text-white/30 uppercase tracking-[0.2em]">
          © 2026 DanaTour Network
        </div>
      </main>

      {/* CSS Animation */}
      <style>{`
                @keyframes shine {
                    0% { transform: translateX(-100%); }
                    50%, 100% { transform: translateX(100%); }
                }
            `}</style>
    </div>
  );
};

export default ChangePassword;
