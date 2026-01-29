import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Intro from "../components/Intro";
import TourCarousel from "../components/TourCarousel";
import Features from "../components/Features";
import Stats from "../components/Stats";
import FAQ from "../components/FAQ";
import Articles from "../components/Articles";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleBookClick = () => {
    navigate("/explore#find-tour");
  };

  const handleStartExploring = () => {
    const landingSection = document.getElementById("landing-content");
    if (landingSection) {
      landingSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full bg-[#020617] text-white overflow-x-hidden">
      {/* Header */}
      <Header onBookClick={handleBookClick} />

      {/* Hero Section */}
      <Hero onStart={handleStartExploring} />

      {/* Main Content Area */}
      <main id="landing-content" className="relative">
        {/* Intro Section - Vertical Soul */}
        <Intro />

        {/* Features - Value Propositions with Lottie Animations */}
        <Features />

        {/* Stats - Trust & Numbers */}
        <Stats />

        {/* Signature Tours - Draggable Carousel */}
        <TourCarousel />

        {/* Articles - Bento Grid Lifestyle Section */}
        <Articles />

        {/* FAQ - Accordion with Wavy Design */}
        <FAQ />

        {/* Final CTA Section */}
        <section className="py-32 md:py-48 text-center relative overflow-hidden bg-[#020617]">
          {/* Background Decorative Glows */}
          <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sea/10 rounded-full blur-[120px] pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 max-w-4xl mx-auto px-6"
          >
            <span className="text-primary font-display font-bold uppercase tracking-[0.5em] text-xs mb-6 block">
              Start Your Adventure
            </span>
            <h3 className="text-6xl md:text-8xl font-display font-black tracking-tighter uppercase mb-10 leading-none">
              Ready to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-sea">
                explore?
              </span>
            </h3>
            <p className="text-slate-400 text-xl mb-14 max-w-2xl mx-auto leading-relaxed">
              Begin your journey through the heart of Central Vietnam. From
              pristine beaches to emerald peaks, your story starts here.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/explore")}
              className="group bg-gradient-to-r from-primary to-sea text-white px-16 py-8 rounded-full font-bold uppercase tracking-widest text-sm hover:shadow-2xl hover:shadow-primary/30 transition-all cursor-pointer flex items-center gap-4 mx-auto"
            >
              Start Discovery
              <ArrowRight
                className="group-hover:translate-x-2 transition-transform"
                size={24}
              />
            </motion.button>
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default Home;
