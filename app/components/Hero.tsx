"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const words = ["SPACES.", "OFFICES.", "FACILITIES.", "FUTURES."];

export default function Hero() {
  const [wordIndex, setWordIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((i) => (i + 1) % words.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const stats = [
    { num: "20+", label: "Years Experience" },
    { num: "500+", label: "Clients Served" },
    { num: "5", label: "Cities Covered" },
    { num: "100%", label: "Licensed & Insured" },
  ];

  return (
    <section ref={heroRef} className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#0D0F1E]">
      {/* Cursor glow */}
      <div
        className="cursor-glow hidden md:block"
        style={{ left: mousePos.x, top: mousePos.y }}
      />

      {/* Animated grid background */}
      <div className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(59,79,200,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(59,79,200,0.07) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #3B4FC8 0%, transparent 70%)" }}
      />

      {/* Gold accent line top */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-0 left-0 right-0 h-[3px] bg-[#F5C518] origin-left"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-8 h-px bg-[#F5C518]" />
              <span className="font-cond font-semibold text-xs tracking-[0.3em] uppercase text-[#F5C518]">
                Las Vegas&apos; Premier Commercial Cleaner
              </span>
            </motion.div>

            {/* Headline */}
            <div className="overflow-hidden mb-4">
              <motion.h1
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-[clamp(72px,10vw,120px)] leading-[0.88] text-white tracking-wide"
              >
                CLEAN
              </motion.h1>
            </div>

            {/* Animated word swap */}
            <div className="h-[clamp(72px,10vw,120px)] overflow-hidden mb-2 relative">
              <motion.div
                key={wordIndex}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-100%" }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-[clamp(72px,10vw,120px)] leading-[0.88] text-[#F5C518] tracking-wide absolute"
              >
                {words[wordIndex]}
              </motion.div>
            </div>

            <div className="overflow-hidden mb-8">
              <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-[clamp(72px,10vw,120px)] leading-[0.88] text-white tracking-wide"
              >
                STRONGER.
              </motion.div>
            </div>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
              className="text-white/55 font-light text-lg leading-relaxed max-w-md mb-10"
            >
              Ultimate Building Services, Inc. is a family-owned janitorial and building maintenance company that goes several steps further — every time, without exception.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.85 }}
              className="flex flex-wrap gap-4"
            >
              <a
                href="#contact"
                className="group relative font-cond font-bold text-sm tracking-widest uppercase bg-[#F5C518] text-[#0D0F1E] px-8 py-4 rounded-sm overflow-hidden transition-transform hover:-translate-y-0.5"
              >
                <span className="relative z-10">Request a Quote</span>
                <div className="absolute inset-0 bg-[#D4A800] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </a>
              <a
                href="#services"
                className="font-cond font-semibold text-sm tracking-widest uppercase border border-white/25 text-white/75 px-8 py-4 rounded-sm hover:border-[#F5C518] hover:text-[#F5C518] transition-all duration-200"
              >
                Our Services
              </a>
            </motion.div>
          </div>

          {/* Right visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="hidden md:block relative"
          >
            {/* Big decorative number */}
            <div className="absolute -top-8 -right-4 font-display text-[220px] leading-none text-white/[0.02] select-none pointer-events-none">
              UBS
            </div>

            {/* Central card */}
            <div className="relative bg-[#151729] border border-[#3B4FC8]/30 p-8 rounded-sm">
              {/* Gold top bar */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#F5C518] to-transparent" />

              <div className="grid grid-cols-2 gap-6">
                {stats.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="group"
                  >
                    <div className="font-display text-5xl text-[#F5C518] leading-none mb-1 group-hover:scale-105 transition-transform origin-left">
                      {s.num}
                    </div>
                    <div className="font-cond text-xs tracking-widest uppercase text-white/40">
                      {s.label}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="font-cond text-xs tracking-widest uppercase text-[#F5C518] mb-3">Licensed & Insured</div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#F5C518] flex items-center justify-content-center flex-shrink-0 flex items-center justify-center">
                    <span className="font-cond font-bold text-[#0D0F1E] text-xs">#91170</span>
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">NV Contractor License</div>
                    <div className="text-white/40 text-xs mt-0.5">Bid Limit: $45,000</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-2">
                {["Janitorial", "Maintenance", "Drywall", "Painting", "Pressure Washing", "Carpet Care"].map((s) => (
                  <div key={s} className="bg-[#3B4FC8]/10 border border-[#3B4FC8]/20 rounded-sm px-2 py-1.5 text-center">
                    <span className="font-cond text-[10px] tracking-wider uppercase text-white/50">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mobile stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="md:hidden mt-12 grid grid-cols-2 gap-4 border-t border-white/10 pt-8"
        >
          {stats.map((s) => (
            <div key={s.label}>
              <div className="font-display text-4xl text-[#F5C518]">{s.num}</div>
              <div className="font-cond text-xs tracking-widest uppercase text-white/40 mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-cond text-[10px] tracking-[0.3em] uppercase text-white/30">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-px h-8 bg-gradient-to-b from-[#F5C518]/50 to-transparent"
        />
      </motion.div>
    </section>
  );
}
