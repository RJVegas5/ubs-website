"use client";
import { motion } from "framer-motion";

interface PageHeroProps {
  tag: string;
  title: string;
  highlight: string;
  sub: string;
}

export default function PageHero({ tag, title, highlight, sub }: PageHeroProps) {
  return (
    <section className="relative pt-32 pb-20 bg-[#0D0F1E] overflow-hidden">
      <div className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(59,79,200,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(59,79,200,0.07) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#F5C518]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #3B4FC8 0%, transparent 70%)" }}
      />
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-5">
          <div className="w-8 h-px bg-[#F5C518]" />
          <span className="font-cond font-semibold text-xs tracking-[0.3em] uppercase text-[#F5C518]">{tag}</span>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-[clamp(56px,8vw,100px)] leading-[0.9] text-white tracking-wide mb-6">
          {title}<br /><span className="text-[#F5C518]">{highlight}</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="text-white/50 font-light text-lg leading-relaxed max-w-2xl">
          {sub}
        </motion.p>
      </div>
    </section>
  );
}
