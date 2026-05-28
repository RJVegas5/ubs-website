"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

const services = [
  { num: "01", name: "Commercial Janitorial", desc: "Complete facility cleaning around your schedule.", icon: "🏢" },
  { num: "02", name: "Building Maintenance", desc: "Interior & exterior upkeep at peak performance.", icon: "🔧" },
  { num: "03", name: "Pressure Washing", desc: "High-powered exterior cleaning for great curb appeal.", icon: "💧" },
  { num: "04", name: "Commercial Painting", desc: "Interior & exterior with premium materials.", icon: "🎨" },
  { num: "05", name: "Carpet & Floor Care", desc: "Deep extraction extending the life of your floors.", icon: "✨" },
  { num: "06", name: "Electrostatic Disinfection", desc: "Advanced 360° disinfection technology.", icon: "⚡" },
];

export default function ServicesTeaser() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #0D0F1E 0%, #070915 100%)" }}>
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `repeating-linear-gradient(45deg, #3B4FC8 0, #3B4FC8 1px, transparent 0, transparent 50%)`,
        backgroundSize: "24px 24px",
      }} />
      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} className="flex items-center gap-3 mb-4">
              <div className="w-6 h-px bg-[#F5C518]" />
              <span className="font-cond font-semibold text-xs tracking-[0.25em] uppercase text-[#F5C518]">What We Do</span>
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }}
              className="font-display text-[clamp(40px,5.5vw,72px)] leading-[0.92] text-white tracking-wide">
              FULL-SPECTRUM<br /><span className="text-[#F5C518]">FACILITY SERVICES</span>
            </motion.h2>
          </div>
          <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.3 }}>
            <Link href="/services" className="inline-flex items-center gap-3 font-cond font-bold text-sm tracking-widest uppercase border border-[#F5C518]/40 text-[#F5C518] px-6 py-3 hover:bg-[#F5C518] hover:text-[#0D0F1E] transition-all">
              View All 9 Services →
            </Link>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
          {services.map((svc, i) => (
            <motion.div key={svc.num} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              className="group relative p-7 overflow-hidden cursor-default transition-all duration-300"
              style={{ background: "rgba(255,255,255,0.02)" }}
              whileHover={{ background: "rgba(59,79,200,0.08)" }}>
              <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#F5C518] to-[#3B4FC8] group-hover:w-full transition-all duration-500" />
              <div className="absolute top-0 right-0 w-0 h-[1px] bg-[#F5C518]/30 group-hover:w-full transition-all duration-700" />
              <div className="absolute top-4 right-4 font-display text-[70px] leading-none text-white/[0.025] select-none">{svc.num}</div>
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 origin-left">{svc.icon}</div>
              <h3 className="font-cond font-bold text-base tracking-wider uppercase text-white mb-2 group-hover:text-[#F5C518] transition-colors">{svc.name}</h3>
              <p className="text-white/45 text-sm font-light leading-relaxed">{svc.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.6 }} className="text-center mt-10">
          <Link href="/services" className="inline-block font-cond font-bold text-sm tracking-widest uppercase bg-[#F5C518] text-[#0D0F1E] px-10 py-4 hover:bg-white transition-colors">
            See All 9 Services
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
