"use client";
import { motion } from "framer-motion";
import Image from "next/image";

interface PageHeroProps {
  tag: string;
  title: string;
  highlight: string;
  sub: string;
}

export default function PageHero({ tag, title, highlight, sub }: PageHeroProps) {
  return (
    <section className="relative pt-36 pb-24 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image src="/header-bg.png" alt="Ultimate Building Services Las Vegas" fill className="object-cover object-center" priority />
        <div className="absolute inset-0 bg-[#0D0F1E]/75" />
        <div className="absolute inset-0" style={{background:"linear-gradient(to right, rgba(13,15,30,0.9) 50%, rgba(13,15,30,0.5) 100%)"}} />
        <div className="absolute bottom-0 left-0 right-0 h-24" style={{background:"linear-gradient(to top, #0D0F1E, transparent)"}} />
      </div>

      {/* Grid */}
      <div className="absolute inset-0 z-[1] opacity-[0.04]" style={{
        backgroundImage: `linear-gradient(rgba(245,197,24,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(245,197,24,0.4) 1px, transparent 1px)`,
        backgroundSize: "80px 80px",
      }} />

      <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#F5C518] z-10" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-5">
          <div className="w-8 h-px bg-[#F5C518]" />
          <span className="font-cond font-semibold text-xs tracking-[0.3em] uppercase text-[#F5C518]">{tag}</span>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-[clamp(52px,8vw,96px)] leading-[0.9] text-white tracking-wide mb-5 drop-shadow-2xl">
          {title}<br /><span className="text-[#F5C518]">{highlight}</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="text-white/70 font-light text-lg leading-relaxed max-w-2xl">
          {sub}
        </motion.p>
      </div>
    </section>
  );
}
