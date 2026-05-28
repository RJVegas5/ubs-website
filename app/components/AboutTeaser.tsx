"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";

const features = [
  { title: "Attention to Detail", body: "Nothing overlooked. We inspect what others skip." },
  { title: "Superior Products", body: "Commercial-grade solutions for lasting results." },
  { title: "Consistent Teams", body: "Same trusted faces every visit." },
  { title: "Custom Schedules", body: "Tailored around your operations." },
];

export default function AboutTeaser() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-28 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 rounded-bl-full opacity-30" style={{ background: "radial-gradient(circle, rgba(245,197,24,0.15) 0%, transparent 70%)" }} />
      <div ref={ref} className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="relative">
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-[#F5C518] z-0" />
            <div className="relative z-10 overflow-hidden" style={{ aspectRatio: "4/3" }}>
              <Image src="/about-cleaning.png" alt="UBS Professional Commercial Cleaning Las Vegas" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#0D0F1E]/30 to-transparent" />
            </div>
            <motion.div initial={{ scale: 0, rotate: -15 }} animate={inView ? { scale: 1, rotate: 0 } : {}} transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              className="absolute -bottom-5 -right-5 w-24 h-24 rounded-full flex flex-col items-center justify-center text-center z-20"
              style={{ background: "linear-gradient(135deg, #F5C518, #D4A800)", boxShadow: "0 8px 40px rgba(245,197,24,0.4)" }}>
              <div className="font-cond font-bold text-[#0D0F1E] text-[9px] leading-tight tracking-wide uppercase">NV Lic<br /><span className="text-[11px]">#91170</span></div>
            </motion.div>
            {/* Animated floating stat */}
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-6 left-6 right-14 p-4 z-10"
              style={{ background: "rgba(13,15,30,0.9)", backdropFilter: "blur(12px)", border: "1px solid rgba(245,197,24,0.2)" }}>
              <div className="flex items-center gap-3">
                <div className="font-display text-4xl text-[#F5C518] leading-none">20+</div>
                <div>
                  <div className="font-cond font-bold text-white text-sm tracking-wider uppercase">Years of Excellence</div>
                  <div className="text-white/40 text-xs font-light">Serving Las Vegas businesses</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.15 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-6 h-px bg-[#3B4FC8]" />
              <span className="font-cond font-semibold text-xs tracking-[0.25em] uppercase text-[#3B4FC8]">About UBS</span>
            </div>
            <h2 className="font-display text-[clamp(40px,5vw,64px)] leading-[0.93] text-[#0D0F1E] tracking-wide mb-5">
              WE DON&apos;T JUST<br />CLEAN.<br /><span className="text-[#3B4FC8]">WE ELEVATE.</span>
            </h2>
            <p className="text-[#6A6A80] font-light text-base leading-relaxed mb-4">
              Ultimate Building Services, Inc. is a family-owned and operated janitorial and building maintenance company. While many offer basic cleaning, UBS goes several steps further — no detail is too small.
            </p>
            <p className="text-[#6A6A80] font-light text-base leading-relaxed mb-8">
              A clean working environment leads to better organization, fewer distractions, and a higher level of productivity. That&apos;s not just cleaning — that&apos;s investing in your business.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-10">
              {features.map((f, i) => (
                <motion.div key={f.title} initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3 + i * 0.08 }}
                  className="border-l-[3px] border-[#3B4FC8] pl-3 py-1">
                  <div className="font-cond font-bold text-xs tracking-wider uppercase text-[#0D0F1E] mb-1">{f.title}</div>
                  <div className="text-xs text-[#6A6A80] font-light">{f.body}</div>
                </motion.div>
              ))}
            </div>
            <div className="flex gap-4">
              <Link href="/about" className="font-cond font-bold text-sm tracking-widest uppercase bg-[#3B4FC8] text-white px-7 py-3.5 hover:bg-[#2A3A9E] transition-colors">Why Choose UBS</Link>
              <Link href="/contact" className="font-cond font-semibold text-sm tracking-widest uppercase border border-[#3B4FC8]/30 text-[#3B4FC8] px-7 py-3.5 hover:bg-[#3B4FC8] hover:text-white transition-all">Get a Quote</Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
