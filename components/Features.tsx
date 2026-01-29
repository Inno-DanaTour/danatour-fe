import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";
import { motion } from "framer-motion";

interface FeatureProps {
  title: string;
  description: string;
  animationUrl: string;
  index: number;
}

const FeatureItem: React.FC<FeatureProps> = ({
  title,
  description,
  animationUrl,
  index,
}) => {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    fetch(animationUrl)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) setAnimationData(data);
      })
      .catch((err) => console.error("Lottie load error:", err));
    return () => {
      isMounted = false;
    };
  }, [animationUrl]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      className="relative group p-8 rounded-[40px] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-primary/10 transition-all overflow-hidden"
    >
      <div className="h-48 mb-8 flex items-center justify-center">
        <div className="w-full h-full scale-125">
          {animationData ? (
            <Lottie animationData={animationData} loop={true} />
          ) : (
            <div className="w-full h-full bg-slate-50 animate-pulse rounded-2xl" />
          )}
        </div>
      </div>

      <div className="relative z-10">
        <h3 className="text-2xl font-display font-black text-slate-900 mb-4 tracking-tight">
          {title}
        </h3>
        <p className="text-slate-500 leading-relaxed font-medium">
          {description}
        </p>
      </div>

      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
    </motion.div>
  );
};

const Features: React.FC = () => {
  const features = [
    {
      title: "Expert Local Guides",
      description:
        "Our guides are born and raised in Da Nang, offering insights you won't find in any guidebook.",
      animationUrl:
        "https://lottie.host/8040b27b-0441-450f-9626-444465499998/1j20S9i9Yp.json",
    },
    {
      title: "Premium Comfort",
      description:
        "Travel in style with our fleet of modern, air-conditioned luxury vehicles equipped with amenities.",
      animationUrl:
        "https://lottie.host/b0c16999-563b-4ca0-9114-118671199999/2k30T8j8Zq.json",
    },
    {
      title: "Unique Experiences",
      description:
        "From secret caves to midnight street food, we curate tours that go beyond the ordinary.",
      animationUrl:
        "https://lottie.host/b1784651-789a-4c2d-98e3-0c451da7a250/gK7D9V79Xz.json",
    },
  ];

  return (
    <section className="py-24 md:py-32 bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-primary font-display font-bold uppercase tracking-[0.4em] text-xs mb-4 block"
          >
            Why Choose DanaTour
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-display font-black text-slate-900 tracking-tighter leading-tight"
          >
            Crafting the perfect <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-sea">
              adventure for you.
            </span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <FeatureItem
              key={feature.title}
              title={feature.title}
              description={feature.description}
              animationUrl={feature.animationUrl}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
