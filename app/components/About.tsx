"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const features = [
  { title: "Attention to Detail", body: "Nothing gets overlooked. Every corner, every surface, every visit." },
  { title: "Superior Products", body: "Commercial-grade solutions that deliver lasting, visible results." },
  { title: "Consistent Teams", body: "The same trusted faces every time. Reliability you can count on." },
  { title: "Custom Schedules", body: "Daily, weekly, or fully customized around your operations." },
  { title: "Zero Disruption", body: "We work around your schedule — nights, weekends, whenever suits you." },
  { title: "Full Accountability", body: "Direct line to ownership. Issues resolved same-day, guaranteed." },
];

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-28 bg-white relative overflow-hidden">
      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#F5C518]/5 rounded-bl-[120px]" />

      <div className="max-w-7xl mx-auto px-6">
        <div ref={ref} className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: visual */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Gold corner accent */}
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-[#F5C518] z-0" />

            {/* Main visual block */}
            <div className="relative z-10 bg-gradient-to-br from-[#1A2470] to-[#3B4FC8] aspect-[4/5] flex items-center justify-center overflow-hidden">
              {/* Grid pattern */}
              <div className="absolute inset-0"
                style={{
                  backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
                  backgroundSize: "40px 40px",
                }}
              />
              {/* Large UBS text */}
              <div className="font-display text-[160px] text-white/[0.06] select-none leading-none tracking-wider">UBS</div>

              {/* Floating stat card */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-8 left-8 right-8 bg-[#0D0F1E]/90 backdrop-blur-sm border border-[#F5C518]/20 p-5"
              >
                <div className="flex items-center gap-4">
                  <div className="font-display text-5xl text-[#F5C518] leading-none">20+</div>
                  <div>
                    <div className="font-cond font-bold text-white text-sm tracking-wider uppercase">Years of Excellence</div>
                    <div className="text-white/40 text-xs mt-1 font-light">Serving Las Vegas businesses since the beginning</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={inView ? { scale: 1, rotate: 0 } : {}}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              className="absolute -bottom-6 -right-6 w-28 h-28 bg-[#F5C518] rounded-full flex flex-col items-center justify-center text-center shadow-2xl shadow-[#F5C518]/30"
            >
              <div className="font-cond font-bold text-[#0D0F1E] text-xs leading-tight tracking-wide uppercase">NV Lic<br /><span className="text-sm">#91170</span></div>
            </motion.div>
          </motion.div>

          {/* Right: content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-6 h-px bg-[#3B4FC8]" />
              <span className="font-cond font-semibold text-xs tracking-[0.25em] uppercase text-[#3B4FC8]">About UBS</span>
            </div>

            <h2 className="font-display text-[clamp(44px,5vw,68px)] leading-[0.93] text-[#0D0F1E] tracking-wide mb-6">
              WE DON&apos;T<br />JUST CLEAN.<br /><span className="text-[#3B4FC8]">WE ELEVATE.</span>
            </h2>

            <p className="text-[#6A6A80] font-light text-base leading-relaxed mb-4">
              Ultimate Building Services, Inc. is a family-owned and operated janitorial and building maintenance company that truly understands the value of a clean working environment.
            </p>
            <p className="text-[#6A6A80] font-light text-base leading-relaxed mb-4">
              While many companies offer a basic standard cleaning service, UBS goes several steps further. We pride ourselves on attention to detail and take great care to ensure that nothing is overlooked.
            </p>
            <p className="text-[#6A6A80] font-light text-base leading-relaxed mb-10">
              A clean working environment leads to better organization, fewer distractions, and a higher level of productivity — for your team and your clients.
            </p>

            {/* Feature grid */}
            <div className="grid grid-cols-2 gap-3">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="border-l-[3px] border-[#3B4FC8] pl-3 py-1"
                >
                  <div className="font-cond font-bold text-xs tracking-wider uppercase text-[#0D0F1E] mb-1">{f.title}</div>
                  <div className="text-xs text-[#6A6A80] font-light leading-relaxed">{f.body}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
