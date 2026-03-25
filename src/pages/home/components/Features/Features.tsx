import React from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { Sparkles, MapPin, Users, Headphones } from "lucide-react";
import { FeatureType } from "../../types/home.types";
import { FEATURES, travelAnimationData } from "../../constants/home.constants";

const FeatureCard: React.FC<{ feature: FeatureType }> = ({ feature }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: feature.delay }}
      whileHover={{ y: -10 }}
      className="relative group h-[450px] rounded-[32px] overflow-hidden cursor-pointer shadow-2xl"
    >
      {/* Background Image */}
      <img
        src={feature.image}
        alt={feature.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* Dark Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

      {/* Colored Glow Effect on Hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-t ${feature.gradient} opacity-0 group-hover:opacity-30 mix-blend-overlay transition-opacity duration-500`}
      />

      {/* Content */}
      <div className="absolute inset-0 p-8 flex flex-col justify-end">
        {/* Decorative Line */}
        <div
          className={`w-12 h-1 mb-6 bg-gradient-to-r ${feature.gradient} rounded-full origin-left transition-all duration-500 group-hover:w-24`}
        />

        <h3 className="text-3xl font-display font-bold text-white mb-4 leading-tight group-hover:translate-x-2 transition-transform duration-300">
          {feature.title}
        </h3>

        <p className="text-gray-300 font-medium leading-relaxed group-hover:text-white transition-colors duration-300 line-clamp-3">
          {feature.description}
        </p>

        {/* Explore Button (Appears on Hover) */}
        <div className="mt-6 flex items-center gap-2 text-white/0 group-hover:text-white transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100">
          <span className="text-xs font-bold uppercase tracking-widest">
            Discover
          </span>
          <div className="w-6 h-[1px] bg-white/50" />
        </div>
      </div>
    </motion.div>
  );
};

const Features: React.FC = () => {
  return (
    <section className="bg-transparent py-14 md:py-22 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-sky-200/20 to-emerald-200/20 rounded-full blur-[150px] pointer-events-none" />

      {/* Lottie Animation Background */}
      <div className="absolute top-20 right-20 w-64 h-64 opacity-20 pointer-events-none">
        <Lottie animationData={travelAnimationData} loop={true} />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-4 mb-6"
          >
            <div className="h-[2px] w-12 bg-gradient-to-r from-transparent to-sky-400 rounded-full" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400 font-display font-bold uppercase tracking-[0.5em] text-[10px]">
              WHY CHOOSE US
            </span>
            <div className="h-[2px] w-12 bg-gradient-to-r from-emerald-400 to-transparent rounded-full" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-black text-slate-950 tracking-tighter leading-none mb-6 "
          >
            Travel{" "}
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">
              reimagined.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-700 font-medium text-lg max-w-2xl mx-auto text-black"
          >
            Experience Da Nang like never before with our innovative approach to
            travel planning and local expertise.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
