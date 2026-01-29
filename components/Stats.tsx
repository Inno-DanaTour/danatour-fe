import React from "react";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

interface StatProps {
  label: string;
  value: number;
  suffix?: string;
  index: number;
}

const Counter = ({
  value,
  duration = 2,
}: {
  value: number;
  duration?: number;
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const totalSteps = 60;
      const increment = end / totalSteps;
      const delay = (duration * 1000) / totalSteps;

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, delay);

      return () => clearInterval(timer);
    }
  }, [isInView, value, duration]);

  return <span ref={ref}>{count}</span>;
};

const StatItem: React.FC<StatProps> = ({
  label,
  value,
  suffix = "+",
  index,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="text-center p-8 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-sm"
    >
      <div className="text-5xl md:text-6xl font-black font-display text-white mb-2">
        <Counter value={value} />
        <span className="text-primary">{suffix}</span>
      </div>
      <div className="text-gray-400 font-bold uppercase tracking-widest text-sm">
        {label}
      </div>
    </motion.div>
  );
};

const Stats: React.FC = () => {
  const stats = [
    { label: "Happy Travelers", value: 1200 },
    { label: "Tour Locations", value: 45 },
    { label: "Expert Guides", value: 18 },
    { label: "Years Experience", value: 5, suffix: "+" },
  ];

  return (
    <section className="bg-slate-950 py-24 border-y border-white/5 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.05] pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-primary rounded-full blur-[100px]" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-sea rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
          {stats.map((stat, index) => (
            <StatItem key={stat.label} {...stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
