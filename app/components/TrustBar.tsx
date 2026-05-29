"use client";
import { motion } from "framer-motion";

// SVG icon components — no emoji, clean stroke style
const IconShield = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const IconHome = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const IconZap = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const IconBuilding = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="1"/>
    <path d="M3 9h18M9 21V9M15 21V9"/>
  </svg>
);
const IconCalendar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="17" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IconStar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const IconClock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9"/>
    <polyline points="12 7 12 12 15 15"/>
  </svg>
);
const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const items = [
  { Icon: IconShield,   label: "Licensed & Insured · NV Lic #91170" },
  { Icon: IconHome,     label: "Family-Owned & Operated" },
  { Icon: IconZap,      label: "Electrostatic Disinfection" },
  { Icon: IconBuilding, label: "Commercial Specialists" },
  { Icon: IconCalendar, label: "Flexible Scheduling" },
  { Icon: IconStar,     label: "5-Star Google Reviews" },
  { Icon: IconClock,    label: "2-Hour Response Guarantee" },
  { Icon: IconCheck,    label: "100% Satisfaction Guaranteed" },
];

export default function TrustBar() {
  return (
    <div
      className="relative overflow-hidden py-3.5"
      style={{
        background: "linear-gradient(90deg, #2A3A9E, #3B4FC8, #2A3A9E)",
        borderTop: "1px solid rgba(245,197,24,0.2)",
        borderBottom: "1px solid rgba(245,197,24,0.2)",
      }}
    >
      {/* Shimmer sweep */}
      <motion.div
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
        className="absolute inset-y-0 w-24 opacity-20 pointer-events-none z-10"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)" }}
      />

      {/* Infinite scrolling marquee */}
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
        className="flex items-center gap-10 whitespace-nowrap"
        style={{ width: "max-content" }}
      >
        {[...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <span className="text-white/90 flex-shrink-0"><item.Icon /></span>
            <span className="font-cond font-semibold text-sm tracking-widest uppercase text-white/90">
              {item.label}
            </span>
            <span className="text-[#F5C518]/40 ml-3">◆</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
