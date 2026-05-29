"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

const industries = [
  {
    name: "Corporate Offices",
    desc: "Spotless workplaces that drive productivity and impress visitors.",
    icon: "🏢",
    count: "Daily & Weekly",
  },
  {
    name: "Medical & Dental",
    desc: "OSHA-compliant cleaning for patient safety and compliance.",
    icon: "🏥",
    count: "Hospital-Grade",
  },
  {
    name: "Retail Stores",
    desc: "Pristine storefronts that convert browsers into buyers.",
    icon: "🛍️",
    count: "Before/After Hours",
  },
  {
    name: "Restaurants & Hospitality",
    desc: "Health-code compliant cleaning for kitchens, dining, and common areas.",
    icon: "🍽️",
    count: "Health Compliant",
  },
  {
    name: "Schools & Daycares",
    desc: "Safe, non-toxic disinfection protecting children and staff.",
    icon: "🏫",
    count: "Child-Safe Products",
  },
  {
    name: "Gyms & Fitness Centers",
    desc: "High-frequency cleaning for high-touch equipment and locker rooms.",
    icon: "💪",
    count: "Daily Service",
  },
  {
    name: "Warehouses & Industrial",
    desc: "Large-scale floor care and facility maintenance for industrial spaces.",
    icon: "🏭",
    count: "Specialized Equipment",
  },
  {
    name: "Government Buildings",
    desc: "Compliant, background-checked teams for public sector facilities.",
    icon: "🏛️",
    count: "Fully Vetted",
  },
  {
    name: "Hotels & Hospitality",
    desc: "Guest-ready standards for lobbies, conference rooms, and common areas.",
    icon: "🏨",
    count: "Premium Standard",
  },
  {
    name: "Property Management",
    desc: "Scalable cleaning contracts for multi-property portfolios.",
    icon: "🏘️",
    count: "Portfolio Pricing",
  },
  {
    name: "Auto Dealerships",
    desc: "Showroom-quality cleaning that makes every vehicle look its best.",
    icon: "🚗",
    count: "Showroom Ready",
  },
  {
    name: "Post-Construction",
    desc: "Final clean, debris removal, and move-in prep after any renovation.",
    icon: "🏗️",
    count: "3-Phase Process",
  },
];

export default function IndustriesGrid() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{ background: "#0D0F1E" }}
    >
      {/* Background element */}
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
              <span className="font-cond text-xs tracking-[0.25em] uppercase text-[#F5C518]">
                Industries We Serve
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="font-display text-[clamp(40px,5.5vw,72px)] leading-[0.92] text-white tracking-wide"
            >
              TRUSTED BY<br />
              <span className="text-[#F5C518]">EVERY INDUSTRY</span>
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
              className="group relative p-4 cursor-default transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(59,79,200,0.08)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(59,79,200,0.25)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
              }}
            >
              <div className="text-2xl mb-3">{ind.icon}</div>
              <div className="font-cond font-bold text-xs tracking-wider uppercase text-white mb-1.5">
                {ind.name}
              </div>
              <p className="text-white/40 text-xs font-light leading-relaxed mb-3">
                {ind.desc}
              </p>
              <div
                className="inline-block text-[10px] font-cond tracking-widest uppercase px-2 py-0.5"
                style={{
                  background: "rgba(245,197,24,0.1)",
                  color: "#F5C518",
                  border: "1px solid rgba(245,197,24,0.2)",
                }}
              >
                {ind.count}
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
          style={{
            background: "rgba(59,79,200,0.08)",
            border: "1px solid rgba(59,79,200,0.2)",
          }}
        >
          <div>
            <div className="font-cond font-bold text-sm tracking-wider uppercase text-white mb-1">
              Don&apos;t see your industry?
            </div>
            <div className="text-white/40 text-sm font-light">
              We&apos;ve likely cleaned it. Tell us about your facility.
            </div>
          </div>
          <Link
            href="/contact"
            className="shrink-0 font-cond font-bold text-xs tracking-widest uppercase bg-[#F5C518] text-[#0D0F1E] px-6 py-3 hover:bg-white transition-colors"
          >
            Get a Custom Quote
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
