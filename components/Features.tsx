import React from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { Sparkles, MapPin, Users, Headphones } from "lucide-react";

// Lottie animation data for a simple travel/explore animation
const travelAnimationData = {
  v: "5.5.7",
  fr: 30,
  ip: 0,
  op: 60,
  w: 200,
  h: 200,
  nm: "travel",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "plane",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: {
          a: 1,
          k: [
            { t: 0, s: [-10], h: 0, o: { x: 0.5, y: 0 }, i: { x: 0.5, y: 1 } },
            { t: 30, s: [10], h: 0, o: { x: 0.5, y: 0 }, i: { x: 0.5, y: 1 } },
            { t: 60, s: [-10] },
          ],
        },
        p: {
          a: 1,
          k: [
            {
              t: 0,
              s: [80, 120, 0],
              h: 0,
              o: { x: 0.5, y: 0 },
              i: { x: 0.5, y: 1 },
            },
            {
              t: 30,
              s: [120, 80, 0],
              h: 0,
              o: { x: 0.5, y: 0 },
              i: { x: 0.5, y: 1 },
            },
            { t: 60, s: [80, 120, 0] },
          ],
        },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "sr",
              sy: 1,
              d: 1,
              pt: { a: 0, k: 3 },
              p: { a: 0, k: [0, 0] },
              r: { a: 0, k: 0 },
              ir: { a: 0, k: 10 },
              is: { a: 0, k: 0 },
              or: { a: 0, k: 25 },
              os: { a: 0, k: 0 },
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.04, 0.65, 0.91, 1] },
              o: { a: 0, k: 100 },
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
            },
          ],
        },
      ],
    },
  ],
};

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  delay: number;
}

const FEATURES: Feature[] = [
  {
    icon: <Sparkles size={28} />,
    title: "AI-Powered Personalization",
    description:
      "Our intelligent system learns your preferences and crafts unique itineraries tailored just for you.",
    gradient: "from-violet-500 to-purple-500",
    delay: 0,
  },
  {
    icon: <MapPin size={28} />,
    title: "Local Expert Guides",
    description:
      "Connect with passionate locals who know every hidden gem and secret spot in Da Nang.",
    gradient: "from-sky-500 to-cyan-500",
    delay: 0.1,
  },
  {
    icon: <Users size={28} />,
    title: "Curated Experiences",
    description:
      "From sunrise mountain hikes to midnight street food tours, we design unforgettable moments.",
    gradient: "from-emerald-500 to-teal-500",
    delay: 0.2,
  },
  {
    icon: <Headphones size={28} />,
    title: "24/7 Travel Support",
    description:
      "Our dedicated team is always available to assist you throughout your journey in Vietnam.",
    gradient: "from-amber-500 to-orange-500",
    delay: 0.3,
  },
];

const FeatureCard: React.FC<{ feature: Feature }> = ({ feature }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: feature.delay }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="relative group p-8 rounded-[32px] bg-white/[0.02] backdrop-blur-sm border border-white/5 hover:border-white/20 transition-all cursor-pointer overflow-hidden"
    >
      {/* Gradient Glow on Hover */}
      <div
        className={`absolute -inset-1 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500`}
      />

      {/* Icon */}
      <div
        className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-6 shadow-lg`}
      >
        {feature.icon}
      </div>

      {/* Content */}
      <h3 className="relative text-2xl font-display font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-sky-400 group-hover:to-emerald-400 transition-all">
        {feature.title}
      </h3>
      <p className="relative text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
        {feature.description}
      </p>

      {/* Corner Accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-[60px] opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
};

const Features: React.FC = () => {
  return (
    <section className="bg-[#020617] py-24 md:py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-sky-500/5 to-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />

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
            className="text-5xl md:text-7xl font-display font-black text-white tracking-tighter leading-none mb-6"
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
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            Experience Da Nang like never before with our innovative approach to
            travel planning and local expertise.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURES.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-bold uppercase tracking-wider text-sm shadow-[0_20px_50px_-12px_rgba(14,165,233,0.4)] hover:shadow-[0_25px_60px_-12px_rgba(14,165,233,0.5)] transition-all cursor-pointer"
          >
            <Sparkles size={18} />
            Start Your Journey
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
