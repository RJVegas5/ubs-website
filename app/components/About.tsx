"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";

const stats = [
  { num: "20+", label: "Years in Business" },
  { num: "500+", label: "Facilities Serviced" },
  { num: "9", label: "Service Lines" },
  { num: "5", label: "Cities Covered" },
  { num: "100%", label: "Licensed & Insured" },
  { num: "2hr", label: "Response Guarantee" },
];

const values = [
  { title: "Attention to Detail", body: "Nothing gets overlooked. Every corner, every surface, every visit — inspected to our premium standard.", icon: "🔍" },
  { title: "Superior Products", body: "Commercial-grade solutions and equipment that deliver lasting, visible results your clients will notice.", icon: "⭐" },
  { title: "Consistent Teams", body: "The same trusted, background-checked professionals every visit. Reliability you and your staff can count on.", icon: "👥" },
  { title: "Custom Schedules", body: "Daily, weekly, or fully customized around your operations. We work nights, weekends — whatever suits you.", icon: "📅" },
  { title: "Zero Disruption", body: "We operate around your schedule with minimal footprint. Your business keeps running at full speed.", icon: "🤫" },
  { title: "Full Accountability", body: "Direct line to ownership. Every issue resolved same-day, guaranteed. No runaround, no excuses.", icon: "✅" },
];

const clients = [
  "Medical Offices", "Corporate Offices", "Retail Chains", "Schools & Daycares",
  "Warehouses", "Government Buildings", "Restaurants", "Fitness Centers",
  "Property Management", "Churches", "Auto Dealerships", "Industrial Facilities",
];

export default function About() {
  const ref = useRef(null);
  const statsRef = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const statsInView = useInView(statsRef, { once: true, margin: "-80px" });

  return (
    <div>
      {/* ── Hero About Section ── */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-bl-full opacity-20" style={{ background: "radial-gradient(circle, rgba(245,197,24,0.2) 0%, transparent 70%)" }} />

        <div ref={ref} className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left: New lobby image */}
            <motion.div initial={{ opacity: 0, x: -40 }} animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="relative">
              <div className="absolute -top-5 -left-5 w-20 h-20 bg-[#F5C518] z-0" />
              <div className="relative z-10 overflow-hidden" style={{ aspectRatio: "4/5" }}>
                <Image src="/about-lobby.png" alt="Premium Commercial Facility - Ultimate Building Services Las Vegas" fill className="object-cover object-center" quality={90} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(13,15,30,0.4) 0%, transparent 60%)" }} />
                {/* Floating stats */}
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-6 left-6 right-6 p-5"
                  style={{ background: "rgba(7,9,21,0.92)", backdropFilter: "blur(16px)", border: "1px solid rgba(245,197,24,0.2)" }}>
                  <div className="grid grid-cols-3 gap-4">
                    {[{ n: "20+", l: "Years" }, { n: "500+", l: "Clients" }, { n: "5★", l: "Rating" }].map(s => (
                      <div key={s.l} className="text-center">
                        <div className="font-display text-3xl text-[#F5C518] leading-none">{s.n}</div>
                        <div className="font-cond text-[10px] tracking-widest uppercase text-white/40 mt-0.5">{s.l}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* NV License badge */}
              <motion.div initial={{ scale: 0, rotate: -20 }} animate={inView ? { scale: 1, rotate: 0 } : {}}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full flex flex-col items-center justify-center text-center z-20"
                style={{ background: "linear-gradient(135deg, #F5C518, #D4A800)", boxShadow: "0 10px 50px rgba(245,197,24,0.5)" }}>
                <div className="font-cond font-bold text-[#0D0F1E] text-[8px] leading-tight tracking-wide uppercase">NV Lic<br /><span className="text-[13px] font-bold">#91170</span><br />Licensed &<br />Insured</div>
              </motion.div>
            </motion.div>

            {/* Right: Content */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.15 }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-px bg-[#3B4FC8]" />
                <span className="font-cond font-semibold text-xs tracking-[0.3em] uppercase text-[#3B4FC8]">About Ultimate Building Services</span>
              </div>
              <h2 className="font-display text-[clamp(44px,5.5vw,72px)] leading-[0.9] text-[#0D0F1E] tracking-wide mb-6">
                WE DON&apos;T<br />JUST CLEAN.<br /><span className="text-[#3B4FC8]">WE ELEVATE.</span>
              </h2>
              <p className="text-[#6A6A80] font-light text-base leading-relaxed mb-4">
                Ultimate Building Services, Inc. is a <strong className="text-[#0D0F1E]">family-owned and operated</strong> commercial janitorial and building maintenance company with over 20 years serving Las Vegas businesses.
              </p>
              <p className="text-[#6A6A80] font-light text-base leading-relaxed mb-4">
                While many companies offer a basic standard cleaning service, UBS goes several steps further. We pride ourselves on attention to detail — and take great care to ensure that nothing is overlooked, ever.
              </p>
              <p className="text-[#6A6A80] font-light text-base leading-relaxed mb-8">
                A clean working environment leads to better organization, fewer distractions, and a higher level of productivity — for your team and your clients. That&apos;s not cleaning. That&apos;s a business investment.
              </p>

              {/* Feature grid */}
              <div className="grid grid-cols-2 gap-3 mb-10">
                {values.map((v, i) => (
                  <motion.div key={v.title} initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.3 + i * 0.07 }}
                    className="group p-4 border-l-[3px] border-[#3B4FC8] pl-4 hover:bg-[#F5F5F2] transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm">{v.icon}</span>
                      <div className="font-cond font-bold text-xs tracking-wider uppercase text-[#0D0F1E]">{v.title}</div>
                    </div>
                    <div className="text-xs text-[#6A6A80] font-light leading-relaxed">{v.body}</div>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <Link href="/book" className="font-cond font-bold text-sm tracking-widest uppercase bg-[#F5C518] text-[#0D0F1E] px-7 py-3.5 hover:bg-[#D4A800] transition-colors">
                  Book a Service
                </Link>
                <Link href="/contact" className="font-cond font-semibold text-sm tracking-widest uppercase border border-[#3B4FC8]/30 text-[#3B4FC8] px-7 py-3.5 hover:bg-[#3B4FC8] hover:text-white transition-all">
                  Get a Quote
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats Banner ── */}
      <section ref={statsRef} className="py-16 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0D0F1E 0%, #1A2470 50%, #0D0F1E 100%)" }}>
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `linear-gradient(rgba(245,197,24,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(245,197,24,0.5) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {stats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.08 }} className="text-center group">
                <div className="font-display text-5xl text-[#F5C518] leading-none mb-2 group-hover:scale-110 transition-transform"
                  style={{ textShadow: "0 0 30px rgba(245,197,24,0.3)" }}>{s.num}</div>
                <div className="font-cond text-[10px] tracking-widest uppercase text-white/40">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Facilities We Service ── */}
      <section className="py-24 bg-[#F5F5F2] relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#3B4FC8]" />
              <span className="font-cond font-semibold text-xs tracking-[0.25em] uppercase text-[#3B4FC8]">Who We Serve</span>
              <div className="w-8 h-px bg-[#3B4FC8]" />
            </div>
            <h2 className="font-display text-[clamp(36px,5vw,60px)] leading-[0.92] text-[#0D0F1E] tracking-wide">
              TRUSTED BY EVERY<br /><span className="text-[#3B4FC8]">TYPE OF FACILITY</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {clients.map((c, i) => (
              <motion.div key={c} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                whileHover={{ y: -2 }}
                className="p-5 text-center group cursor-default transition-all duration-300"
                style={{ background: "white", border: "1px solid rgba(59,79,200,0.1)", borderRadius: "4px" }}>
                <div className="font-cond font-bold text-sm tracking-wider uppercase text-[#0D0F1E] group-hover:text-[#3B4FC8] transition-colors">{c}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
