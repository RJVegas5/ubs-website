"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const services = [
  {
    num: "01",
    name: "Commercial Janitorial",
    desc: "Complete office and facility cleaning — restrooms, common areas, floors, and every surface. Scheduled around your operations with zero disruption.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    num: "02",
    name: "Building Maintenance",
    desc: "Comprehensive interior and exterior upkeep. From minor repairs to full facility management — keeping your property at peak performance.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      </svg>
    ),
  },
  {
    num: "03",
    name: "Drywall Services",
    desc: "Installation, repair, and flawless finishing for commercial interiors of any scale. NV Licensed contractor — quality guaranteed.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/>
      </svg>
    ),
  },
  {
    num: "04",
    name: "Commercial Painting",
    desc: "Interior and exterior painting with professional prep, premium materials, and a lasting finish. Transforming workspaces across Las Vegas.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M2 20h.01M7 20v-4"/><path d="M12 20V10"/><path d="M17 20V4"/>
      </svg>
    ),
  },
  {
    num: "05",
    name: "Pressure Washing",
    desc: "High-powered exterior cleaning for concrete, facades, parking lots, and entryways. First impressions start at the front door.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/>
      </svg>
    ),
  },
  {
    num: "06",
    name: "Window Cleaning",
    desc: "Streak-free interior and exterior window cleaning for offices, retail, and commercial buildings. Crystal clear, every time.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <rect x="2" y="2" width="20" height="20" rx="2"/><line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/>
      </svg>
    ),
  },
  {
    num: "07",
    name: "Carpet & Floor Care",
    desc: "Deep extraction carpet cleaning, hard floor polishing, and upholstery care. Restoring appearance and extending the life of your flooring.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <rect x="2" y="8" width="20" height="12" rx="2"/><path d="M6 8V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"/>
      </svg>
    ),
  },
  {
    num: "08",
    name: "Electrostatic Disinfection",
    desc: "Advanced disinfection technology that wraps surfaces 360°. Superior pathogen elimination for offices, medical facilities, and schools.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
  {
    num: "09",
    name: "Exterior Maintenance",
    desc: "Grounds upkeep, parking lot maintenance, exterior surface care — keeping the outside of your property as sharp as the inside.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
  },
];

export default function Services() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" className="py-28 bg-[#0D0F1E] relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, #3B4FC8 0, #3B4FC8 1px, transparent 0, transparent 50%)`,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div ref={ref} className="grid md:grid-cols-2 gap-8 items-end mb-16">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-4"
            >
              <div className="w-6 h-px bg-[#F5C518]" />
              <span className="font-cond font-semibold text-xs tracking-[0.25em] uppercase text-[#F5C518]">What We Do</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-[clamp(48px,6vw,80px)] leading-[0.92] text-white tracking-wide"
            >
              FULL-SPECTRUM<br /><span className="text-[#F5C518]">FACILITY</span><br />SERVICES
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-white/50 font-light text-base leading-relaxed"
          >
            High-quality and experienced commercial services — whether your building requires standard cleaning, electrostatic disinfection, maintenance, or any of our other specialties. We handle it all.
          </motion.p>
        </div>

        {/* Services grid */}
        <div className="grid md:grid-cols-3 gap-px bg-white/5">
          {services.map((svc, i) => (
            <motion.div
              key={svc.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              className="group relative bg-[#0D0F1E] p-8 overflow-hidden cursor-default hover:bg-[#151729] transition-colors duration-300"
            >
              {/* Hover border bottom */}
              <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#F5C518] group-hover:w-full transition-all duration-500" />

              {/* Ghost number */}
              <div className="absolute top-4 right-4 font-display text-[80px] leading-none text-white/[0.025] select-none">{svc.num}</div>

              {/* Icon */}
              <div className="w-11 h-11 bg-[#F5C518]/10 border border-[#F5C518]/20 flex items-center justify-center text-[#F5C518] mb-5 group-hover:bg-[#F5C518]/15 transition-colors">
                {svc.icon}
              </div>

              <h3 className="font-cond font-bold text-lg tracking-wider uppercase text-white mb-3">{svc.name}</h3>
              <p className="text-white/45 text-sm font-light leading-relaxed">{svc.desc}</p>

              <a href="#contact" className="group/link inline-flex items-center gap-2 font-cond font-semibold text-xs tracking-widest uppercase text-[#F5C518] mt-5 hover:gap-3 transition-all duration-200">
                Get a Quote
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
