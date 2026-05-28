"use client";
import { motion } from "framer-motion";

const items = [
  { icon: "🛡️", label: "Licensed & Insured · NV Lic #91170" },
  { icon: "👨‍👩‍👧", label: "Family-Owned & Operated" },
  { icon: "⚡", label: "Electrostatic Disinfection" },
  { icon: "🏢", label: "Commercial Specialists" },
  { icon: "📅", label: "Flexible Scheduling" },
  { icon: "⭐", label: "5-Star Google Reviews" },
  { icon: "⏱️", label: "2-Hour Response Guarantee" },
  { icon: "✅", label: "100% Satisfaction Guaranteed" },
];

export default function TrustBar() {
  return (
    <div className="relative overflow-hidden py-4" style={{ background: "linear-gradient(90deg, #2A3A9E, #3B4FC8, #2A3A9E)", borderTop: "1px solid rgba(245,197,24,0.2)", borderBottom: "1px solid rgba(245,197,24,0.2)" }}>
      {/* Shimmer */}
      <motion.div animate={{ x: ["-100%", "200%"] }} transition={{ duration: 6, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
        className="absolute inset-y-0 w-24 opacity-20 pointer-events-none z-10"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)" }} />

      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        className="flex items-center gap-10 whitespace-nowrap"
        style={{ width: "max-content" }}>
        {[...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-base">{item.icon}</span>
            <span className="font-cond font-semibold text-sm tracking-widest uppercase text-white/90">{item.label}</span>
            <span className="text-[#F5C518]/30 ml-3">◆</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
