"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

// SVG service icons — stroke style, 24×24
const IconJanitorial = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden="true">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const IconMaintenance = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden="true">
    <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
  </svg>
);
const IconPressure = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden="true">
    <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/>
  </svg>
);
const IconPainting = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden="true">
    <path d="M2 13.5V20a2 2 0 002 2h16a2 2 0 002-2v-6.5"/>
    <path d="M2 13.5L12 2l10 11.5"/>
    <path d="M12 2v20"/>
  </svg>
);
const IconFloor = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden="true">
    <polygon points="12 2 22 8.5 12 15 2 8.5"/>
    <polyline points="2 15 12 21.5 22 15"/>
    <polyline points="2 11.5 12 18 22 11.5"/>
  </svg>
);
const IconElectrostatic = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <polyline points="9 12 11 14 15 10"/>
  </svg>
);

const services = [
  { num: "01", name: "Commercial Janitorial",    desc: "Complete facility cleaning around your schedule.",              Icon: IconJanitorial,    href: "/services/commercial-janitorial" },
  { num: "02", name: "Building Maintenance",     desc: "Interior & exterior upkeep at peak performance.",              Icon: IconMaintenance,   href: "/services/building-maintenance" },
  { num: "03", name: "Pressure Washing",         desc: "High-powered exterior cleaning for great curb appeal.",        Icon: IconPressure,      href: "/services/pressure-washing" },
  { num: "04", name: "Commercial Painting",      desc: "Interior & exterior with premium materials.",                  Icon: IconPainting,      href: "/services" },
  { num: "05", name: "Carpet & Floor Care",      desc: "Deep extraction extending the life of your floors.",           Icon: IconFloor,         href: "/services/floor-care" },
  { num: "06", name: "Electrostatic Disinfection", desc: "Advanced 360° disinfection technology.",                    Icon: IconElectrostatic, href: "/services/electrostatic-disinfection" },
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
        {/* Header row */}
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
            <Link href="/services" className="inline-flex items-center gap-3 font-cond font-bold text-sm tracking-widest uppercase border border-[#F5C518]/40 text-[#F5C518] px-6 py-3 hover:bg-[#F5C518] hover:text-[#0D0F1E] transition-all duration-200 cursor-pointer">
              View All 9 Services →
            </Link>
          </motion.div>
        </div>

        {/* Service cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
          {services.map((svc, i) => (
            <motion.div
              key={svc.num}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              className="group relative p-7 overflow-hidden cursor-pointer transition-all duration-300"
              style={{ background: "rgba(255,255,255,0.02)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(59,79,200,0.08)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}
            >
              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#F5C518] to-[#3B4FC8] group-hover:w-full transition-all duration-500" />
              <div className="absolute top-0 right-0 w-0 h-[1px] bg-[#F5C518]/30 group-hover:w-full transition-all duration-700" />

              {/* Ghost number */}
              <div className="absolute top-4 right-4 font-display text-[70px] leading-none text-white/[0.025] select-none pointer-events-none">
                {svc.num}
              </div>

              {/* Icon */}
              <div className="w-9 h-9 mb-5 text-[#F5C518] group-hover:scale-110 transition-transform duration-300 origin-left">
                <svc.Icon />
              </div>

              {/* Content */}
              <h3 className="font-cond font-bold text-base tracking-wider uppercase text-white mb-2 group-hover:text-[#F5C518] transition-colors duration-200">
                {svc.name}
              </h3>
              <p className="text-white/45 text-sm font-light leading-relaxed mb-5">
                {svc.desc}
              </p>

              {/* Learn more link */}
              <Link
                href={svc.href}
                className="inline-flex items-center gap-1.5 font-cond text-[11px] tracking-widest uppercase text-[#F5C518]/50 group-hover:text-[#F5C518] transition-colors duration-200"
                onClick={e => e.stopPropagation()}
              >
                Learn More
                <span className="translate-x-0 group-hover:translate-x-1 transition-transform duration-200">→</span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.6 }} className="text-center mt-10">
          <Link href="/services" className="inline-block font-cond font-bold text-sm tracking-widest uppercase bg-[#F5C518] text-[#0D0F1E] px-10 py-4 hover:bg-white transition-colors duration-200 cursor-pointer">
            See All 9 Services
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
