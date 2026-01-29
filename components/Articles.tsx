import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface Article {
  id: string;
  title: string;
  category: string;
  image: string;
  gridClass: string;
  description: string;
  speed: number;
}

const ARTICLES: Article[] = [
  {
    id: "1",
    title: "The Silent Stones of Marble Mountains",
    category: "History",
    image:
      "https://images.unsplash.com/photo-1544918877-46431f39103e?q=80&w=800",
    gridClass: "md:col-span-4 md:row-span-3",
    description:
      "Centuries of spiritual history carved into the heart of Da Nang's most iconic peaks.",
    speed: 0.1,
  },
  {
    id: "2",
    title: "Midnight Street Food Guide",
    category: "Cuisine",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800",
    gridClass: "md:col-span-3 md:col-start-5 md:row-span-2",
    description:
      "Where the locals eat when the city lights reflect on Han River.",
    speed: 0.2,
  },
  {
    id: "3",
    title: "The Secret Beach of Son Tra",
    category: "Nature",
    image:
      "https://images.unsplash.com/photo-1559592442-7e182c8c6f31?q=80&w=800",
    gridClass: "md:col-span-3 md:row-span-3 md:col-start-2",
    description: "A hidden cove where the jungle meets the emerald sea.",
    speed: 0.15,
  },
  {
    id: "4",
    title: "Central Vietnam's Rainy Allure",
    category: "Travel",
    image:
      "https://images.unsplash.com/photo-1518173946687-a4c8a07a7e0e?q=80&w=800",
    gridClass: "md:col-span-2 md:col-start-6 md:row-span-2",
    description: "Finding beauty in the misty seasons of the coast.",
    speed: 0.25,
  },
  {
    id: "5",
    title: "Evolution of the Dragon Bridge",
    category: "Architecture",
    image:
      "https://images.unsplash.com/photo-1616386861226-f4d25725d2b6?q=80&w=800",
    gridClass: "md:col-span-3 md:col-start-4 md:row-span-2",
    description: "How a bridge became the living soul of a modern city.",
    speed: 0.12,
  },
];

const ArticleCard: React.FC<{ article: Article; index: number }> = ({
  article,
  index,
}) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, article.speed * 400]);
  const rotate = useTransform(
    scrollYProgress,
    [0, 1],
    [index % 2 === 0 ? -2 : 2, index % 2 === 0 ? 2 : -2],
  );

  return (
    <motion.div
      ref={containerRef}
      style={{ y, rotate }}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`relative group rounded-[40px] overflow-hidden bg-slate-900 border border-white/5 ${article.gridClass} min-h-[350px] shadow-2xl`}
    >
      <img
        src={article.image}
        alt={article.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

      <div className="absolute inset-0 p-10 flex flex-col justify-end">
        <div className="mb-6">
          <span className="px-4 py-1.5 rounded-full bg-primary/20 backdrop-blur-xl text-[10px] font-black uppercase tracking-[0.3em] text-primary border border-primary/20">
            {article.category}
          </span>
        </div>

        <h3 className="text-3xl font-display font-bold text-white mb-3 leading-tight tracking-tight group-hover:text-primary transition-colors">
          {article.title}
        </h3>

        <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-6 group-hover:text-slate-200 transition-colors">
          {article.description}
        </p>

        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-white/40 group-hover:text-primary transition-all">
          Explore Story{" "}
          <ArrowUpRight
            size={16}
            className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
          />
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none border border-white/10 rounded-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
};

const Articles: React.FC = () => {
  return (
    <section className="bg-[#020617] py-32 md:py-48 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sea/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-24 flex flex-col md:flex-row justify-between items-end gap-12">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="h-[2px] w-12 bg-primary rounded-full" />
              <span className="text-primary font-display font-bold uppercase tracking-[0.6em] text-[10px]">
                JOURNAL
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-6xl md:text-8xl font-display font-black text-white tracking-tighter leading-none"
            >
              Stories from <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-sea italic">
                the Vertical.
              </span>
            </motion.h2>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-5 rounded-full bg-white/5 border border-white/10 text-white font-bold text-[11px] uppercase tracking-[0.4em] hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-4 cursor-pointer"
          >
            Visit Journal <ArrowUpRight size={18} />
          </motion.button>
        </div>

        {/* Scattered Grid */}
        <div className="grid grid-cols-1 md:grid-cols-8 gap-x-8 gap-y-16 md:gap-y-32">
          {ARTICLES.map((article, index) => (
            <ArticleCard key={article.id} article={article} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Articles;
