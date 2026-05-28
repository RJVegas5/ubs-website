"use client";
import { motion } from "framer-motion";

const items = [
  { icon: "🛡️", label: "Licensed & Insured" },
  { icon: "👨‍👩‍👧", label: "Family-Owned & Operated" },
  { icon: "⚡", label: "Electrostatic Disinfection" },
  { icon: "🏢", label: "Commercial Specialists" },
  { icon: "📅", label: "Flexible Scheduling" },
  { icon: "⭐", label: "5-Star Service" },
];

export default function TrustBar() {
  return (
    <div className="bg-[#3B4FC8] py-4 overflow-hidden">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        className="flex items-center gap-12 whitespace-nowrap"
        style={{ width: "max-content" }}
      >
        {[...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-base">{item.icon}</span>
            <span className="font-cond font-semibold text-sm tracking-widest uppercase text-white/90">
              {item.label}
            </span>
            <span className="text-[#F5C518]/40 ml-4 text-xs">◆</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
