import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

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
      stroke="white"
      strokeWidth="1"
      strokeLinecap="round"
    />
  </svg>
);

const FAQItem: React.FC<FAQItemProps> = ({
  question,
  answer,
  isOpen,
  onToggle,
}) => {
  return (
    <div className="py-6 border-b border-white/5 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center text-left group transition-colors"
      >
        <span
          className={`text-xl font-medium tracking-tight ${isOpen ? "text-primary" : "text-white/90 group-hover:text-white"}`}
        >
          {question}
        </span>
        <div
          className={`p-2 rounded-full transition-transform duration-300 ${isOpen ? "rotate-180 bg-primary/10 text-primary" : "text-white/40 group-hover:text-white"}`}
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
            <p className="text-gray-400 mt-4 leading-relaxed text-lg max-w-2xl">
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

  const faqs = [
    {
      question: "What's the best time to visit Da Nang?",
      answer:
        "The best time is usually from February to May. The weather is warm and dry, perfect for beach activities and exploring the mountains without heavy rain.",
    },
    {
      question: "Are your tours suitable for families with children?",
      answer:
        "Absolutely! We offer many family-friendly options like the Ba Na Hills tour and Monkey Mountain exploration. We also provide child seats and specialized guides.",
    },
    {
      question: "Do you offer private, customized itineraries?",
      answer:
        "Yes, we specialize in tailor-made experiences. Whether you want a private romantic sunset dinner or a rugged mountain trek, our experts can design it just for you.",
    },
    {
      question: "What's your cancellation policy?",
      answer:
        "We offer a flexible cancellation policy. Most tours can be cancelled up to 48 hours in advance for a full refund. Specific details are provided at the time of booking.",
    },
    {
      question: "Is travel insurance included in the price?",
      answer:
        "While we provide basic coverage during the tour itself, we highly recommend that all travelers maintain their own comprehensive international travel insurance.",
    },
  ];

  return (
    <section className="bg-[#020617] py-24 md:py-32 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          {/* Left Column - Heading */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-5xl md:text-6xl font-display font-black text-white leading-tight mb-8">
                Frequently asked <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-sea">
                  questions
                </span>
              </h2>
              <p className="text-gray-400 text-xl leading-relaxed mb-10 max-w-md">
                Get in touch with our team or explore our frequently-asked
                questions below.
              </p>
              <button className="px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all cursor-pointer inline-flex items-center gap-2 group">
                Contact us
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowRight size={16} />
                </div>
              </button>
            </motion.div>
          </div>

          {/* Right Column - Accordions */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {faqs.map((faq, index) => (
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

// Internal ArrowRight to avoid extra imports if not needed, but Header uses it
const ArrowRight = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14"></path>
    <path d="M12 5l7 7-7 7"></path>
  </svg>
);

export default FAQ;
