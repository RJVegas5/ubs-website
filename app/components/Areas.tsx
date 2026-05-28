"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const areas = [
  { city: "Las Vegas", zip: "89101 – 89199", desc: "Full coverage across all LV zip codes" },
  { city: "Henderson", zip: "89002 – 89074", desc: "Complete Henderson coverage" },
  { city: "Summerlin", zip: "89134 – 89145", desc: "All Summerlin communities" },
  { city: "North Las Vegas", zip: "89030 – 89087", desc: "North LV & surrounding area" },
  { city: "Boulder City", zip: "89005", desc: "Full Boulder City service" },
];

export default function Areas() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="areas" className="py-28 bg-[#0D0F1E] relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle, #3B4FC8 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-5"
          >
            <div className="w-6 h-px bg-[#F5C518]" />
            <span className="font-cond font-semibold text-xs tracking-[0.25em] uppercase text-[#F5C518]">Service Areas</span>
            <div className="w-6 h-px bg-[#F5C518]" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-[clamp(44px,6vw,80px)] leading-[0.92] text-white tracking-wide"
          >
            WE PROUDLY<br /><span className="text-[#F5C518]">SERVE NEVADA</span>
          </motion.h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-px bg-white/5">
          {areas.map((area, i) => (
            <motion.div
              key={area.city}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.08 }}
              className="group bg-[#0D0F1E] p-7 text-center hover:bg-[#151729] transition-colors duration-300 relative overflow-hidden"
            >
              <div className="absolute bottom-0 left-0 right-0 h-0 bg-[#3B4FC8] group-hover:h-[2px] transition-all duration-300" />
              <div className="font-display text-2xl text-white group-hover:text-[#F5C518] transition-colors duration-200 mb-2">{area.city}</div>
              <div className="font-cond text-xs tracking-widest uppercase text-[#F5C518]/60 mb-3">{area.zip}</div>
              <div className="text-white/35 text-xs font-light">{area.desc}</div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
          className="text-center text-white/30 text-sm font-light mt-8"
        >
          Not sure if we cover your area? <a href="tel:7027952855" className="text-[#F5C518] hover:underline">Call us at (702) 795-2855</a> — we&apos;ll let you know.
        </motion.p>
      </div>
    </section>
  );
}
