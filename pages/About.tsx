import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, MapPin, Award, Heart, ArrowRight } from "lucide-react";
import Header from "../components/Header";

const STATS = [
  { icon: MapPin, value: "50+", label: "Destinations" },
  { icon: Users, value: "10K+", label: "Happy Travelers" },
  { icon: Award, value: "100+", label: "Tours" },
  { icon: Heart, value: "4.9", label: "Rating" },
];

const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      <Header onBookClick={() => navigate("/explore#find-tour")} />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FFC857] rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[128px]" />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#FFC857] text-sm font-bold uppercase tracking-[0.3em] mb-4 block">
              About Us
            </span>
            <h1 className="text-5xl md:text-7xl font-black mb-6 font-display">
              The <span className="text-[#FFC857]">Ascending</span> Path
            </h1>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto mb-12">
              We are a collective of storytellers and explorers with a deep love
              for Central Vietnam. Our journey began on the peaks of Son Tra,
              where we realized the world needed to see Da Nang from a vertical
              perspective—from the crushing sea to the silent stone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:border-[#FFC857]/30 transition-all"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-[#FFC857] to-[#FFD980] flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-black" />
                </div>
                <div className="text-3xl font-black text-white mb-1 font-display">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-12 md:p-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-black mb-6 font-display">
                  Our <span className="text-[#FFC857]">Mission</span>
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
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FFC857] to-[#FFD980] text-black font-bold rounded-full hover:shadow-lg hover:shadow-[#FFC857]/30 transition-all cursor-pointer"
                >
                  Start Exploring
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-3xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1559592442-7e182c8c6f31?q=80&w=800"
                    alt="Da Nang"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-gradient-to-br from-[#FFC857] to-[#FFD980] text-black p-6 rounded-2xl shadow-2xl">
                  <p className="text-xs font-bold uppercase tracking-widest mb-1">
                    Est.
                  </p>
                  <p className="text-3xl font-black font-display">2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
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
