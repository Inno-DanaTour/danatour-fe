import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Users, MapPin, Award, Heart, ArrowRight } from "lucide-react";
import Header from "../components/Header";
import LottieAnimation from "../components/LottieAnimation";

// Original colors for UI elements, brighter colors for backgrounds only
const COLORS = {
  gold: "#FFC857",      // Original gold for text/UI
  emerald: "#10B981",   // Original emerald for text/UI
  cyan: "#3B82F6",      // Original cyan for text/UI
};

// Brighter colors for background elements only
const BG_COLORS = {
  gold: "#FFD700",      // Brighter gold for backgrounds
  emerald: "#00FF88",   // Vibrant emerald for backgrounds
  cyan: "#00D4FF",      // Electric cyan for backgrounds
};

const STATS = [
  {
    icon: MapPin,
    value: 10,
    suffix: "+",
    label: "Destinations",
    lottieUrl: "https://lottie.host/d8d0aa2c-3f5f-4c0a-b0a5-e3c8f8e8c8e8/qKqKqKqKqK.json" // Map marker animation
  },
  {
    icon: Users,
    value: 100,
    suffix: "%",
    label: "Local Experts",
    lottieUrl: "https://lottie.host/embed/a7ff6e3d-3f5f-4c0a-b0a5-e3c8f8e8c8e8/qKqKqKqKqK.json" // People animation
  },
  {
    icon: Award,
    value: 30,
    suffix: "+",
    label: "Curated Tours",
    lottieUrl: "https://lottie.host/embed/b8d0aa2c-3f5f-4c0a-b0a5-e3c8f8e8c8e8/qKqKqKqKqK.json" // Award animation
  },
  {
    icon: Heart,
    value: 4.9,
    suffix: "/5",
    label: "Satisfaction",
    lottieUrl: "https://lottie.host/embed/c9d0aa2c-3f5f-4c0a-b0a5-e3c8f8e8c8e8/qKqKqKqKqK.json" // Heart animation
  },
];

const Counter = ({ value, suffix }: { value: number; suffix: string }) => {
  const [count, setCount] = React.useState(0);

  return (
    <motion.span
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      onViewportEnter={() => {
        let start = 0;
        const end = value;
        const timer = setInterval(() => {
          start += end / 20;
          if (start >= end) {
            setCount(end);
            clearInterval(timer);
          } else {
            setCount(start);
          }
        }, 50);
      }}
    >
      {Number.isInteger(value) ? Math.floor(count) : count.toFixed(1)}{suffix}
    </motion.span>
  );
};

const About: React.FC = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      <Header onBookClick={() => navigate("/explore#find-tour")} />

      {/* Hero Section with Lottie */}
      <section className="pt-24 pb-0 px-6 relative overflow-hidden">
        {/* Enhanced floating blobs with brighter colors */}
        <div className="absolute inset-0 opacity-70">
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              x: [0, 30, 0],
              y: [0, -30, 0],
              rotate: [0, 90, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full blur-[140px]"
            style={{ background: `radial-gradient(circle, ${BG_COLORS.gold}, transparent)` }}
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              x: [0, -40, 0],
              y: [0, 40, 0],
              rotate: [0, -90, 0]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full blur-[140px]"
            style={{ background: `radial-gradient(circle, ${BG_COLORS.cyan}, transparent)` }}
          />
          <motion.div
            animate={{
              scale: [1, 1.4, 1],
              x: [0, 50, 0],
              y: [0, 50, 0],
              rotate: [0, 180, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[140px]"
            style={{ background: `radial-gradient(circle, ${BG_COLORS.emerald}, transparent)` }}
          />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Animated dots */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#FFC857]" />
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
            </div>

            <span className="text-[#FFC857] text-sm font-bold uppercase tracking-[0.3em] mb-4 block"
            >
              About Us
            </span>

            <h1 className="text-5xl md:text-7xl font-black mb-6 font-display">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFC857] via-[#10B981] to-[#3B82F6]">Ascending</span> Path
            </h1>

            <p className="text-gray-300 text-lg max-w-3xl mx-auto mb-12 leading-relaxed">
              We are a collective of storytellers and explorers with a deep love
              for Central Vietnam. Our journey began on the peaks of Son Tra,
              where we realized the world needed to see Da Nang from a vertical
              perspective—from the crushing sea to the silent stone.
            </p>

            {/* Lottie Travel Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
              className="w-80 h-60 md:w-96 md:h-96 lg:w-[420px] lg:h-[420px] mx-auto"
            >
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <LottieAnimation
                  src="https://assets10.lottiefiles.com/packages/lf20_jhu1lqdz.json"
                  style={{
                    filter: "drop-shadow(0 0 50px rgba(16,185,129,0.6))",
                  }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section with Enhanced Animations */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{
                  y: -10,
                  scale: 1.05,
                  transition: { duration: 0.3 }
                }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:border-white/30 transition-all cursor-pointer group relative overflow-hidden"
                style={{
                  boxShadow: `0 0 0 0 ${index % 3 === 0 ? COLORS.gold : index % 3 === 1 ? COLORS.emerald : COLORS.cyan}`,
                }}
              >
                {/* Glow effect on hover */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl"
                  style={{
                    background: `radial-gradient(circle at center, ${index % 3 === 0 ? COLORS.gold : index % 3 === 1 ? COLORS.emerald : COLORS.cyan}, transparent)`
                  }}
                />

                {/* Lottie Icon Animation */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="w-16 h-16 mx-auto mb-4 relative z-10"
                >
                  <LottieAnimation
                    src={
                      index === 0 ? "https://assets2.lottiefiles.com/packages/lf20_puciaact.json" :
                        index === 1 ? "https://assets9.lottiefiles.com/packages/lf20_myejiggj.json" :
                          index === 2 ? "https://assets4.lottiefiles.com/packages/lf20_touohxv0.json" :
                            "https://assets1.lottiefiles.com/packages/lf20_lk80fpsm.json"
                    }
                  />
                </motion.div>

                <div className="text-3xl font-black text-white mb-1 font-display relative z-10">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-gray-300 relative z-10">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values Section with Lottie */}
      <section className="py-20 px-6 bg-white/5 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 opacity-50">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px]"
            style={{ background: BG_COLORS.emerald }} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black mb-4 font-display">Our <span className="text-[#3B82F6]">Values</span></h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Foundational principles that guide every journey we curate.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Authenticity",
                desc: "Real experiences avoiding tourist traps.",
                color: COLORS.gold,
                icon: "🤝",
                lottieUrl: "https://assets5.lottiefiles.com/packages/lf20_wd1udlcz.json"
              },
              {
                title: "Sustainability",
                desc: "Preserving beauty for future generations.",
                color: COLORS.emerald,
                icon: "🌱",
                lottieUrl: "https://assets3.lottiefiles.com/packages/lf20_uu0x8lqv.json"
              },
              {
                title: "Connection",
                desc: "Bridging cultures through shared stories.",
                color: COLORS.cyan,
                icon: "🌏",
                lottieUrl: "https://assets7.lottiefiles.com/packages/lf20_khzniaya.json"
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: i * 0.2,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{
                  y: -10,
                  scale: 1.03,
                  boxShadow: `0 20px 60px -15px ${item.color}40`
                }}
                className="p-8 rounded-3xl bg-slate-800/70 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all cursor-pointer group relative overflow-hidden"
                style={{ borderTop: `4px solid ${item.color}` }}
              >
                {/* Glow effect */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle at top, ${item.color}, transparent)` }}
                />

                {/* Lottie Animation */}
                <motion.div
                  className="w-20 h-20 mb-4"
                >
                  <LottieAnimation src={item.lottieUrl} />
                </motion.div>

                <div className="h-2 w-16 rounded-full mb-6 relative z-10"
                  style={{
                    background: item.color,
                    boxShadow: `0 0 20px ${item.color}`
                  }}
                />
                <h3 className="text-2xl font-bold mb-3 relative z-10">{item.title}</h3>
                <p className="text-gray-300 leading-relaxed relative z-10">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="relative py-20 px-6">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-[#10B981]/5 to-slate-900" />

        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="
        group relative aspect-video overflow-hidden rounded-3xl
        border border-white/10 shadow-2xl
      "
          >
            {/* Video iframe */}
            <iframe
              className="w-full h-full object-cover"
              src="https://www.youtube.com/embed/FIMDuhCC6Hw"
              title="Da Nang Tourism"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />

            {/* Video overlay glow */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                boxShadow: `inset 0 0 100px ${COLORS.emerald}20`,
              }}
            />
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-12 md:p-16 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] opacity-60"
              style={{ background: BG_COLORS.gold }} />

            <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl font-black mb-6 font-display">
                  Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#3B82F6]">Mission</span>
                </h2>
                <p className="text-gray-300 leading-relaxed mb-6">
                  DanaTour is more than a travel platform—it's a gateway to
                  discovering the soul of Central Vietnam. We believe every
                  journey should tell a story, from the golden sands of My Khe
                  to the misty peaks of Ba Na Hills.
                </p>
                <p className="text-gray-400 leading-relaxed mb-8">
                  Our team of local experts curates unique experiences that go
                  beyond typical tourism, connecting travelers with the
                  authentic heart of Da Nang and its surrounding wonders.
                </p>
                <button
                  onClick={() => navigate("/explore")}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FFC857] via-[#10B981] to-[#3B82F6] text-white font-bold rounded-full hover:shadow-lg hover:shadow-[#10B981]/30 transition-all cursor-pointer"
                >
                  Start Exploring
                  <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="aspect-square rounded-3xl overflow-hidden">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                    src="https://media.loveitopcdn.com/40838/kcfinder/upload/images/tong-hop-nhung-hinh-anh-dep-ve-da-nang-48.jpg"
                    alt="Da Nang"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="absolute -bottom-6 -left-6 bg-gradient-to-br from-[#FFC857] via-[#10B981] to-[#3B82F6] text-white p-6 rounded-2xl shadow-2xl">
                  <p className="text-xs font-bold uppercase tracking-widest mb-1">
                    Est.
                  </p>
                  <p className="text-3xl font-black font-display">2024</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 text-center relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 opacity-60">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px]"
            style={{ background: `radial-gradient(circle, ${BG_COLORS.cyan}, ${BG_COLORS.emerald})` }} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto relative z-10"
        >
          <h3 className="text-3xl font-bold mb-4 font-display">
            Ready to explore Da Nang?
          </h3>
          <p className="text-gray-400 mb-8">
            Begin your personalized journey through the heart of Central Vietnam
          </p>
          <button
            onClick={() => navigate("/explore")}
            className="px-10 py-4 bg-white/10 border border-white/20 rounded-full text-white font-semibold hover:bg-white/20 transition-all cursor-pointer"
          >
            View Our Tours
          </button>
        </motion.div>
      </section>
    </div>
  );
};

export default About;
