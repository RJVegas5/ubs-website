"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function Careers() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const positions = [
    { title: "Janitor / Custodian", pay: "$11.25+/hr", details: "Mon–Sat · 36+ hrs/week · Reliable transportation required" },
    { title: "Maintenance Technician", pay: "Based on Experience", details: "Mon–Sat · 36+ hrs/week · Skills assessment required" },
    { title: "Commercial Painter", pay: "Based on Experience", details: "Mon–Sat · Project-based · Portfolio preferred" },
    { title: "Handyman", pay: "Based on Experience", details: "Mon–Sat · 36+ hrs/week · Multi-trade preferred" },
  ];

  return (
    <section id="careers" className="py-28 bg-[#F5F5F2] relative">
      <div className="max-w-7xl mx-auto px-6">
        <div ref={ref} className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              className="flex items-center gap-3 mb-5"
            >
              <div className="w-6 h-px bg-[#3B4FC8]" />
              <span className="font-cond font-semibold text-xs tracking-[0.25em] uppercase text-[#3B4FC8]">Join Our Team</span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="font-display text-[clamp(44px,5vw,68px)] leading-[0.93] text-[#0D0F1E] mb-6"
            >
              COME WORK<br /><span className="text-[#3B4FC8]">WITH US</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="text-[#6A6A80] font-light leading-relaxed mb-10"
            >
              Join a family-owned company that values hard work, reliability, and integrity. We offer competitive pay, consistent hours, and a team that genuinely supports each other.
            </motion.p>

            <div className="space-y-4">
              {positions.map((pos, i) => (
                <motion.div
                  key={pos.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.25 + i * 0.1 }}
                  className="bg-white border border-[#E0E0EC] p-5 hover:border-[#3B4FC8]/40 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-cond font-bold text-base tracking-wider uppercase text-[#0D0F1E] group-hover:text-[#3B4FC8] transition-colors">{pos.title}</div>
                      <div className="text-[#6A6A80] text-xs font-light mt-1">{pos.details}</div>
                    </div>
                    <div className="font-cond font-bold text-sm text-[#F5C518] bg-[#F5C518]/10 px-3 py-1 whitespace-nowrap flex-shrink-0">{pos.pay}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.a
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.7 }}
              href="#apply"
              className="mt-8 inline-block font-cond font-bold text-sm tracking-widest uppercase bg-[#3B4FC8] text-white px-8 py-4 hover:bg-[#2A3A9E] transition-colors"
            >
              Apply Now
            </motion.a>
          </div>

          {/* Apply form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            id="apply"
            className="bg-[#0D0F1E] p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#F5C518]" />
            <h3 className="font-display text-3xl text-white mb-6">SUBMIT APPLICATION</h3>
            <div className="space-y-4">
              {[
                { label: "Full Name", type: "text", placeholder: "Your full name" },
                { label: "Email", type: "email", placeholder: "your@email.com" },
                { label: "Phone", type: "tel", placeholder: "(702) 000-0000" },
              ].map((field) => (
                <div key={field.label}>
                  <label className="font-cond text-xs tracking-widest uppercase text-white/50 mb-1 block">{field.label}</label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-[#F5C518]/50 placeholder:text-white/20 transition-colors"
                  />
                </div>
              ))}
              <div>
                <label className="font-cond text-xs tracking-widest uppercase text-white/50 mb-1 block">Position Applying For</label>
                <select className="w-full bg-white/5 border border-white/10 text-white/70 text-sm px-4 py-3 focus:outline-none focus:border-[#F5C518]/50 transition-colors">
                  <option value="" className="bg-[#0D0F1E]">Select a position</option>
                  <option className="bg-[#0D0F1E]">Janitor / Custodian</option>
                  <option className="bg-[#0D0F1E]">Maintenance Technician</option>
                  <option className="bg-[#0D0F1E]">Commercial Painter</option>
                  <option className="bg-[#0D0F1E]">Handyman</option>
                </select>
              </div>
              <div>
                <label className="font-cond text-xs tracking-widest uppercase text-white/50 mb-1 block">Available Start Date</label>
                <input type="date" className="w-full bg-white/5 border border-white/10 text-white/70 text-sm px-4 py-3 focus:outline-none focus:border-[#F5C518]/50 transition-colors" />
              </div>
              <div>
                <label className="font-cond text-xs tracking-widest uppercase text-white/50 mb-1 block">Reliable Transportation?</label>
                <div className="flex gap-4">
                  {["Yes", "No"].map((v) => (
                    <label key={v} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="transport" value={v} className="accent-[#F5C518]" />
                      <span className="text-white/60 text-sm">{v}</span>
                    </label>
                  ))}
                </div>
              </div>
              <button className="w-full font-cond font-bold text-sm tracking-widest uppercase bg-[#F5C518] text-[#0D0F1E] py-4 hover:bg-[#D4A800] transition-colors mt-2">
                Submit Application
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
