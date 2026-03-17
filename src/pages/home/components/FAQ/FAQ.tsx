import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, ArrowRight } from "lucide-react";
import { FAQS } from "../../constants/home.constants";


interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

const WavyLine = () => (
  <svg
    width="100%"
    height="12"
    viewBox="0 0 1200 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="opacity-20 mt-4"
  >
    <path
      d="M0 6C30 6 30 2 60 2C90 2 90 10 120 10C150 10 150 2 180 2C210 2 210 10 240 10C270 10 270 2 300 2C330 2 330 10 360 10C390 10 390 2 420 2C450 2 450 10 480 10C510 10 510 2 540 2C570 2 570 10 600 10C630 10 630 2 660 2C690 2 690 10 720 10C750 10 750 2 780 2C810 2 810 10 840 10C870 10 870 2 900 2C930 2 930 10 960 10C990 10 990 2 1020 2C1050 2 1050 10 1080 10C1110 10 1110 2 1140 2C1170 2 1170 10 1200 10"
      stroke="url(#wavyGradient)"
      strokeWidth="1"
      strokeLinecap="round"
    />
    <defs>
      <linearGradient id="wavyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#0ea5e9" />
        <stop offset="100%" stopColor="#10b981" />
      </linearGradient>
    </defs>
  </svg>
);

const FAQItem: React.FC<FAQItemProps> = ({
  question,
  answer,
  isOpen,
  onToggle,
}) => {
  return (
    <div className="py-6 border-b border-slate-200 last:border-0 cursor-pointer">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center text-left group transition-colors cursor-pointer"
      >
        <span
          className={`text-xl font-medium tracking-tight transition-colors ${
            isOpen
              ? "text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-emerald-600 font-bold"
              : "text-slate-800 font-bold group-hover:text-slate-950"
          }`}
        >
          {question}
        </span>
        <div
          className={`p-2 rounded-full transition-all duration-300 ${
            isOpen
              ? "rotate-180 bg-gradient-to-r from-sky-500/20 to-emerald-500/20 text-sky-400"
              : "text-slate-400 group-hover:text-slate-900"
          }`}
        >
          {isOpen ? <Minus size={20} /> : <Plus size={20} />}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="text-slate-700 font-medium mt-4 leading-relaxed text-lg max-w-2xl">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <WavyLine />
    </div>
  );
};

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-transparent py-24 md:py-32 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-sky-200/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-200/40 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          {/* Left Column - Heading */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-5xl md:text-6xl font-display font-black text-slate-950 leading-tight mb-8">
                Frequently asked <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-emerald-500">
                  questions
                </span>
              </h2>
              <p className="text-slate-600 font-medium text-xl leading-relaxed mb-10 max-w-md">
                Get in touch with our team or explore our frequently-asked
                questions below.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-sky-500/20 hover:shadow-sky-500/40 transition-all cursor-pointer inline-flex items-center gap-3 group"
              >
                Contact us
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowRight size={16} />
                </div>
              </motion.button>
            </motion.div>
          </div>

          {/* Right Column - Accordions */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {FAQS.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openIndex === index}
                  onToggle={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
