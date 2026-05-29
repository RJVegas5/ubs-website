"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

// SVG industry icons — 24×24 viewBox, 1.5 stroke, no emoji
const IconCorporate = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="1"/>
    <path d="M3 9h18M9 21V9M15 21V9"/>
  </svg>
);
const IconMedical = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden="true">
    <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z"/>
    <line x1="12" y1="8" x2="12" y2="16"/>
    <line x1="8" y1="12" x2="16" y2="12"/>
  </svg>
);
const IconRetail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden="true">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
);
const IconRestaurant = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden="true">
    <path d="M3 2v7c0 1.1.9 2 2 2s2-.9 2-2V2M7 2v20M21 15V2a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>
  </svg>
);
const IconSchool = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden="true">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
);
const IconGym = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden="true">
    <path d="M18 8h1a4 4 0 010 8h-1M5 8H4a4 4 0 000 8h1M8 6v12M16 6v12"/>
    <line x1="8" y1="12" x2="16" y2="12"/>
  </svg>
);
const IconWarehouse = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden="true">
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);
const IconGovernment = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden="true">
    <line x1="3" y1="22" x2="21" y2="22"/>
    <line x1="6" y1="18" x2="6" y2="11"/>
    <line x1="10" y1="18" x2="10" y2="11"/>
    <line x1="14" y1="18" x2="14" y2="11"/>
    <line x1="18" y1="18" x2="18" y2="11"/>
    <polygon points="12 2 20 7 4 7"/>
  </svg>
);
const IconHotel = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden="true">
    <path d="M3 7v13M21 7v13M3 14h18"/>
    <path d="M3 7a4 4 0 014-4h10a4 4 0 014 4"/>
    <rect x="7" y="10" width="4" height="4" rx="0.5"/>
    <rect x="13" y="10" width="4" height="4" rx="0.5"/>
  </svg>
);
const IconProperty = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden="true">
    <circle cx="7.5" cy="15.5" r="5.5"/>
    <path d="M21 2l-9.6 9.6M15.5 7.5l3 3"/>
  </svg>
);
const IconAuto = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden="true">
    <path d="M5 17H3v-2l2-8h14l2 8v2h-2"/>
    <path d="M9 17h6"/>
    <circle cx="7.5" cy="18.5" r="1.5"/>
    <circle cx="16.5" cy="18.5" r="1.5"/>
    <path d="M5 9h14"/>
  </svg>
);
const IconConstruction = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden="true">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
    <line x1="4" y1="22" x2="4" y2="15"/>
  </svg>
);

const industries = [
  { name: "Corporate Offices",          desc: "Spotless workplaces that drive productivity and impress visitors.",                        Icon: IconCorporate,    badge: "Daily & Weekly" },
  { name: "Medical & Dental",           desc: "OSHA-compliant cleaning for patient safety and compliance.",                               Icon: IconMedical,      badge: "Hospital-Grade" },
  { name: "Retail Stores",              desc: "Pristine storefronts that convert browsers into buyers.",                                  Icon: IconRetail,       badge: "Before/After Hours" },
  { name: "Restaurants & Hospitality",  desc: "Health-code compliant cleaning for kitchens, dining, and common areas.",                  Icon: IconRestaurant,   badge: "Health Compliant" },
  { name: "Schools & Daycares",         desc: "Safe, non-toxic disinfection protecting children and staff.",                             Icon: IconSchool,       badge: "Child-Safe Products" },
  { name: "Gyms & Fitness Centers",     desc: "High-frequency cleaning for high-touch equipment and locker rooms.",                     Icon: IconGym,          badge: "Daily Service" },
  { name: "Warehouses & Industrial",    desc: "Large-scale floor care and facility maintenance for industrial spaces.",                  Icon: IconWarehouse,    badge: "Specialized Equipment" },
  { name: "Government Buildings",       desc: "Compliant, background-checked teams for public sector facilities.",                      Icon: IconGovernment,   badge: "Fully Vetted" },
  { name: "Hotels & Hospitality",       desc: "Guest-ready standards for lobbies, conference rooms, and common areas.",                 Icon: IconHotel,        badge: "Premium Standard" },
  { name: "Property Management",        desc: "Scalable cleaning contracts for multi-property portfolios.",                              Icon: IconProperty,     badge: "Portfolio Pricing" },
  { name: "Auto Dealerships",           desc: "Showroom-quality cleaning that makes every vehicle look its best.",                      Icon: IconAuto,         badge: "Showroom Ready" },
  { name: "Post-Construction",          desc: "Final clean, debris removal, and move-in prep after any renovation.",                    Icon: IconConstruction, badge: "3-Phase Process" },
];

export default function IndustriesGrid() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: "#0D0F1E" }}>
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, #F5C518 0, #F5C518 1px, transparent 0, transparent 80px), repeating-linear-gradient(90deg, #F5C518 0, #F5C518 1px, transparent 0, transparent 80px)`,
        }}
      />

      <div ref={ref} className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              className="flex items-center gap-3 mb-4"
            >
              <div className="w-6 h-px bg-[#F5C518]" />
              <span className="font-cond text-xs tracking-[0.25em] uppercase text-[#F5C518]">Industries We Serve</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="font-display text-[clamp(40px,5.5vw,72px)] leading-[0.92] text-white tracking-wide"
            >
              TRUSTED BY<br /><span className="text-[#F5C518]">EVERY INDUSTRY</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-white/50 font-light text-sm leading-relaxed max-w-sm"
          >
            From medical offices to warehouses, UBS has the experience, equipment, and certifications to handle any commercial facility in Las Vegas.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {industries.map((ind, i) => (
            <motion.div
              key={ind.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.1 + i * 0.04, duration: 0.4 }}
              className="group relative p-4 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C518]"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = "rgba(59,79,200,0.08)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(59,79,200,0.25)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
              }}
              tabIndex={0}
              role="listitem"
            >
              {/* Icon */}
              <div className="w-6 h-6 mb-3 text-[#F5C518]/70 group-hover:text-[#F5C518] transition-colors duration-200">
                <ind.Icon />
              </div>

              <div className="font-cond font-bold text-xs tracking-wider uppercase text-white mb-1.5">
                {ind.name}
              </div>
              <p className="text-white/40 text-xs font-light leading-relaxed mb-3">
                {ind.desc}
              </p>

              {/* Badge */}
              <div
                className="inline-block text-[10px] font-cond tracking-widest uppercase px-2 py-0.5"
                style={{ background: "rgba(245,197,24,0.1)", color: "#F5C518", border: "1px solid rgba(245,197,24,0.2)" }}
              >
                {ind.badge}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.65 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 p-6"
          style={{ background: "rgba(59,79,200,0.08)", border: "1px solid rgba(59,79,200,0.2)" }}
        >
          <div>
            <div className="font-cond font-bold text-sm tracking-wider uppercase text-white mb-1">Don&apos;t see your industry?</div>
            <div className="text-white/40 text-sm font-light">We&apos;ve likely cleaned it. Tell us about your facility.</div>
          </div>
          <Link
            href="/contact"
            className="shrink-0 font-cond font-bold text-xs tracking-widest uppercase bg-[#F5C518] text-[#0D0F1E] px-6 py-3 hover:bg-white transition-colors duration-200 cursor-pointer"
          >
            Get a Custom Quote
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
