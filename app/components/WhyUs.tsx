"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const reasons = [
  { num: "01", title: "We Go Several Steps Further", body: "While competitors offer basic cleaning, UBS performs a full inspection to ensure nothing is ever overlooked — every visit, every time, without exception." },
  { num: "02", title: "Productivity-Focused Approach", body: "A cleaner environment means better organization, fewer distractions, and measurably higher employee performance. It's not cleaning — it's investing in your business." },
  { num: "03", title: "Protect Your Professional Image", body: "Your facility is your first impression to clients and staff. We make sure it's impeccable — because your reputation depends on every detail." },
  { num: "04", title: "Family Values, Business Standards", body: "As a family-owned company, we treat every client's property with the same care we'd give our own. That's not a marketing line — it's how we operate." },
];

const facilities = [
  "Medical Offices", "Corporate Offices", "Retail Stores", "Schools & Daycares",
  "Warehouses", "Government Buildings", "Restaurants", "Fitness Centers",
  "Property Management", "Churches", "Auto Dealerships", "Industrial Facilities",
];

export default function WhyUs() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="why" className="py-28 bg-[#F5F5F2] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div ref={ref} className="grid lg:grid-cols-2 gap-20 items-start">
          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-5"
            >
              <div className="w-6 h-px bg-[#3B4FC8]" />
              <span className="font-cond font-semibold text-xs tracking-[0.25em] uppercase text-[#3B4FC8]">Why Choose UBS</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-[clamp(44px,5vw,68px)] leading-[0.93] text-[#0D0F1E] tracking-wide mb-12"
            >
              THE STANDARD<br />OTHERS <span className="text-[#3B4FC8]">OVERLOOK</span>
            </motion.h2>

            <div className="space-y-8">
              {reasons.map((r, i) => (
                <motion.div
                  key={r.num}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex gap-5 group"
                >
                  <div className="font-display text-5xl text-[#3B4FC8]/20 leading-none flex-shrink-0 group-hover:text-[#3B4FC8]/40 transition-colors">
                    {r.num}
                  </div>
                  <div className="pt-1">
                    <div className="font-cond font-bold text-base tracking-wider uppercase text-[#0D0F1E] mb-2">{r.title}</div>
                    <div className="text-[#6A6A80] text-sm font-light leading-relaxed">{r.body}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: facilities + visual */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="bg-[#0D0F1E] p-8 relative overflow-hidden mb-6"
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#F5C518] to-transparent" />
              <div className="absolute bottom-0 right-0 font-display text-[120px] text-white/[0.03] leading-none select-none">CLEAN</div>

              <div className="font-cond font-semibold text-xs tracking-[0.25em] uppercase text-[#F5C518] mb-4">Facilities We Service</div>
              <div className="grid grid-cols-2 gap-2 relative z-10">
                {facilities.map((f, i) => (
                  <motion.div
                    key={f}
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-1 h-1 rounded-full bg-[#F5C518] flex-shrink-0" />
                    <span className="text-white/60 text-sm font-light">{f}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* CTA card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
              className="bg-[#3B4FC8] p-8 relative overflow-hidden"
            >
              <div className="absolute bottom-0 right-0 font-display text-[100px] text-white/[0.07] leading-none select-none">5★</div>
              <div className="font-display text-5xl text-[#F5C518] leading-none mb-2 relative z-10">5 STAR</div>
              <div className="font-cond font-bold text-white text-sm tracking-widest uppercase mb-4 relative z-10">Client Satisfaction Every Visit</div>
              <p className="text-white/60 text-sm font-light leading-relaxed mb-6 relative z-10">
                We don&apos;t just clean — we build relationships. Your satisfaction is our measure of success, and we don&apos;t stop until the job is done right.
              </p>
              <a href="/contact" className="relative z-10 inline-block font-cond font-bold text-xs tracking-widest uppercase bg-[#F5C518] text-[#0D0F1E] px-6 py-3 hover:bg-[#D4A800] transition-colors">
                Start Today
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
