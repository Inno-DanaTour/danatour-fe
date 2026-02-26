import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
  location: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Travel Blogger",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    content:
      "DanaTour completely transformed how I experience Vietnam. The AI-powered recommendations led me to hidden gems I would never have found on my own. Absolutely magical!",
    rating: 5,
    location: "Singapore",
  },
  {
    id: "2",
    name: "Marcus Weber",
    role: "Photographer",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    content:
      "As a professional photographer, I need unique locations. DanaTour's curated paths took me to breathtaking spots at the perfect times. The Marble Mountains at dawn was unforgettable.",
    rating: 5,
    location: "Germany",
  },
  {
    id: "3",
    name: "Yuki Tanaka",
    role: "Digital Nomad",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    content:
      "I've used many travel apps, but nothing compares to DanaTour. The personalized itineraries feel like having a local friend show you around. The seafood tour was incredible!",
    rating: 5,
    location: "Japan",
  },
  {
    id: "4",
    name: "David Kim",
    role: "Adventure Seeker",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    content:
      "From Son Tra Peninsula hikes to midnight street food runs - DanaTour planned the perfect adventure. Their local guides are knowledgeable and passionate.",
    rating: 5,
    location: "USA",
  },
];

const TestimonialCard: React.FC<{
  testimonial: Testimonial;
  index: number;
}> = ({ testimonial, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="flex-shrink-0 w-[350px] md:w-[420px] p-8 rounded-[32px] bg-white border border-sky-100 hover:border-sky-300 transition-all group cursor-pointer shadow-lg"
    >
      {/* Quote Icon */}
      <div className="mb-6">
        <Quote className="w-10 h-10 text-sky-200" />
      </div>

      {/* Rating */}
      <div className="flex gap-1 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
        ))}
      </div>

      {/* Content */}
      <p className="text-slate-700 font-medium leading-relaxed mb-8 text-lg group-hover:text-slate-900 transition-colors">
        "{testimonial.content}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-4">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="w-14 h-14 rounded-full object-cover ring-2 ring-sky-400/20"
        />
        <div>
          <h4 className="font-bold text-slate-950">{testimonial.name}</h4>
          <p className="text-sm text-slate-600 font-medium">
            {testimonial.role} • {testimonial.location}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const Testimonials: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = React.useState(0);

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = 440;
      const newPosition =
        direction === "left"
          ? scrollPosition - scrollAmount
          : scrollPosition + scrollAmount;
      containerRef.current.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });
      setScrollPosition(newPosition);
    }
  };

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (evt: WheelEvent) => {
      if (container.contains(evt.target as Node)) {
        evt.preventDefault();
        container.scrollLeft += evt.deltaY;
        setScrollPosition(container.scrollLeft);
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <section className="bg-transparent py-24 md:py-32 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-sky-200/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-200/20 rounded-full blur-[150px] pointer-events-none" />

      {/* Animated Stars Background - Changed to subtle dots for light theme */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-sky-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="h-[2px] w-12 bg-gradient-to-r from-sky-400 to-emerald-400 rounded-full" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400 font-display font-bold uppercase tracking-[0.5em] text-[10px]">
                TESTIMONIALS
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-display font-black text-slate-950 tracking-tighter leading-none"
            >
              Stories from <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-400 to-emerald-400 italic">
                our travelers.
              </span>
            </motion.h2>
          </div>

          {/* Navigation Arrows */}
          <div className="flex gap-3">
            <button
              onClick={() => scroll("left")}
              className="w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center hover:bg-white hover:border-sky-300 transition-all cursor-pointer shadow-sm"
            >
              <ChevronLeft size={22} className="text-slate-400" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center hover:bg-white hover:border-sky-300 transition-all cursor-pointer shadow-sm"
            >
              <ChevronRight size={22} className="text-slate-400" />
            </button>
          </div>
        </div>

        {/* Testimonials Carousel */}
        <div
          ref={containerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-6 px-6"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {TESTIMONIALS.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { value: "10K+", label: "Happy Travelers" },
            { value: "4.9", label: "Average Rating" },
            { value: "500+", label: "Tours Completed" },
            { value: "50+", label: "Local Guides" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl md:text-5xl font-display font-black bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-gray-400 uppercase tracking-wider font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
