import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Article } from "../../types/home.types";
import { ARTICLES } from "../../constants/home.constants";

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
      className={`relative group rounded-[40px] bg-slate-900 border group-hover:scale-120 border-white/5 ${article.gridClass} min-h-[350px] shadow-2xl cursor-pointer hover:z-50`}
    >
      <img
        src={article.image}
        alt={article.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-100 opacity-70 rounded-[40px]"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity rounded-[40px]" />

      <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end">
        <div className="mb-6">
          <span className="px-4 py-1.5 rounded-full bg-sky-500/20 backdrop-blur-xl text-[10px] font-black uppercase tracking-[0.3em] text-sky-400 border border-sky-500/20">
            {article.category}
          </span>
        </div>

        <h3 className="text-3xl font-display font-bold text-white mb-3 leading-tight tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-sky-400 group-hover:to-emerald-400 transition-colors">
          {article.title}
        </h3>

        <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-6 group-hover:text-slate-200 transition-colors">
          {article.description}
        </p>

        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-white/40 group-hover:text-sky-400 transition-all">
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
    <section className="bg-transparent py-16 md:py-24 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-sky-200/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-200/20 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-24 flex flex-col md:flex-row justify-between items-center md:items-end gap-12 text-center md:text-left">
          <div className="max-w-2xl flex flex-col items-center md:items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="h-[2px] w-12 bg-gradient-to-r from-sky-400 to-emerald-400 rounded-full" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400 font-display font-bold uppercase tracking-[0.6em] text-[10px]">
                JOURNAL
              </span>
              <div className="h-[2px] w-12 bg-gradient-to-r from-sky-400 to-emerald-400 rounded-full md:hidden" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-8xl font-display font-black text-slate-900 tracking-tighter leading-none"
            >
              Stories from <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-400 to-emerald-400 italic">
                the Vertical.
              </span>
            </motion.h2>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-5 rounded-full bg-white border border-slate-200 text-slate-900 font-bold text-[11px] uppercase tracking-[0.4em] hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-4 cursor-pointer shadow-lg"
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
