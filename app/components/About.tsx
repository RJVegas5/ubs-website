"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// ── Count-up animation — fires only when section enters viewport ─────────────
function CountStat({
  target, suffix = "", delay = 0, start = true,
}: { target: number; suffix?: string; delay?: number; start?: boolean }) {
  const [count, setCount] = useState(0);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    if (!start) return;
    let rafId = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { setCount(target); return; }
    const timer = setTimeout(() => {
      const duration = 1600;
      let t0: number | null = null;
      const step = (ts: number) => {
        if (t0 === null) t0 = ts;
        const p = Math.min((ts - t0) / duration, 1);
        const ease = 1 - (1 - p) ** 3;
        setCount(Math.round(ease * target));
        if (p < 1) rafId = requestAnimationFrame(step);
      };
      rafId = requestAnimationFrame(step);
    }, delay);
    return () => { clearTimeout(timer); cancelAnimationFrame(rafId); };
  }, [target, delay, start]);
  return <>{count}{suffix}</>;
}

// ── SVG Icons — consistent 24×24 viewBox, 1.5 stroke ───────────────────────
const IconDetail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden="true">
    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
  </svg>
);
const IconQuality = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden="true">
    <circle cx="12" cy="8" r="6"/>
    <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
  </svg>
);
const IconTeam = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
  </svg>
);
const IconCalendar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden="true">
    <rect x="3" y="4" width="18" height="17" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const IconPhone = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.7A2 2 0 012.18 1h3a2 2 0 012 1.72c.12.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L6.91 8.4a16 16 0 006.72 6.72l1.76-1.76a2 2 0 012.11-.45c.9.36 1.85.6 2.81.7A2 2 0 0122 16.92z"/>
  </svg>
);
const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden="true">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const StarSvg = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#F5C518" aria-hidden="true">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

// ── Data ────────────────────────────────────────────────────────────────────
const stats = [
  { label: "Years in Business",   target: 20,  suffix: "+" },
  { label: "Facilities Serviced", target: 500, suffix: "+" },
  { label: "Service Lines",       target: 9,   suffix: "" },
  { label: "Cities Covered",      target: 5,   suffix: "" },
  { label: "Licensed & Insured",  target: 100, suffix: "%" },
  { label: "Response Guarantee",  target: 2,   suffix: "hr" },
];

const values = [
  { title: "Attention to Detail", body: "Nothing gets overlooked. Every corner, surface, and fixture — inspected to our premium standard each visit.", Icon: IconDetail },
  { title: "Superior Products",   body: "Commercial-grade solutions and equipment that deliver lasting, visible results your clients will notice.",      Icon: IconQuality },
  { title: "Consistent Teams",    body: "Same trusted, background-checked professionals every visit. Reliability you and your staff can count on.",     Icon: IconTeam },
  { title: "Custom Schedules",    body: "Daily, weekly, or fully custom around your operations. We work nights, weekends — whatever suits you.",        Icon: IconCalendar },
  { title: "Zero Disruption",     body: "We operate around your schedule with minimal footprint. Your business keeps running at full speed.",           Icon: IconShield },
  { title: "Full Accountability", body: "Direct line to ownership. Every issue resolved same-day, guaranteed. No runaround, no excuses.",              Icon: IconPhone },
];

const credentials = [
  { label: "NV License #91170",          Icon: IconCheck },
  { label: "Licensed & Insured",         Icon: IconShield },
  { label: "Background Checked Staff",   Icon: IconTeam },
  { label: "OSHA Compliant Procedures",  Icon: IconCheck },
  { label: "Electrostatic Certified",    Icon: IconCheck },
  { label: "Family-Owned & Operated",    Icon: IconQuality },
];

const clients = [
  "Medical Offices", "Corporate Offices", "Retail Chains", "Schools & Daycares",
  "Warehouses", "Government Buildings", "Restaurants", "Fitness Centers",
  "Property Management", "Churches", "Auto Dealerships", "Industrial Facilities",
];

// ── Component ───────────────────────────────────────────────────────────────
export default function About() {
  const storyRef  = useRef(null);
  const statsRef  = useRef(null);
  const valuesRef = useRef(null);

  const storyInView  = useInView(storyRef,  { once: true, margin: "-80px" });
  const statsInView  = useInView(statsRef,  { once: true, margin: "-80px" });
  const valuesInView = useInView(valuesRef, { once: true, margin: "-80px" });

  return (
    <div>

      {/* ── Company Story ─────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 rounded-bl-full opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(245,197,24,0.2) 0%, transparent 70%)" }} />

        <div ref={storyRef} className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

            {/* Image column */}
            <motion.div
              initial={{ opacity: 0, x: -40 }} animate={storyInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
              className="relative"
            >
              {/* Gold accent corner */}
              <div className="absolute -top-3 -left-3 sm:-top-5 sm:-left-5 w-12 h-12 sm:w-20 sm:h-20 bg-[#F5C518] z-0" />

              {/* Main image */}
              <div className="relative z-10 overflow-hidden rounded-sm" style={{ aspectRatio: "4/5" }}>
                <Image
                  src="/about-lobby.png"
                  alt="Premium commercial facility maintained by Ultimate Building Services Las Vegas"
                  fill className="object-cover object-center" quality={90}
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(13,15,30,0.55) 0%, transparent 55%)" }} />

                {/* Floating stats card */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 p-4 sm:p-5"
                  style={{ background: "rgba(7,9,21,0.92)", backdropFilter: "blur(16px)", border: "1px solid rgba(245,197,24,0.2)" }}
                >
                  <div className="grid grid-cols-3 gap-3 sm:gap-4">
                    <div className="text-center">
                      <div className="font-display text-2xl sm:text-3xl text-[#F5C518] leading-none">20+</div>
                      <div className="font-cond text-[9px] sm:text-[10px] tracking-widest uppercase text-white/40 mt-0.5">Years</div>
                    </div>
                    <div className="text-center">
                      <div className="font-display text-2xl sm:text-3xl text-[#F5C518] leading-none">500+</div>
                      <div className="font-cond text-[9px] sm:text-[10px] tracking-widest uppercase text-white/40 mt-0.5">Clients</div>
                    </div>
                    <div className="text-center">
                      <div className="flex justify-center gap-0.5 mb-1">
                        {[...Array(5)].map((_, i) => <StarSvg key={i} size={10} />)}
                      </div>
                      <div className="font-cond text-[9px] sm:text-[10px] tracking-widest uppercase text-white/40">Rating</div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* NV License badge — scaled for mobile */}
              <motion.div
                initial={{ scale: 0, rotate: -20 }} animate={storyInView ? { scale: 1, rotate: 0 } : {}}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 w-20 h-20 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center text-center z-20"
                style={{ background: "linear-gradient(135deg, #F5C518, #D4A800)", boxShadow: "0 8px 40px rgba(245,197,24,0.45)" }}
              >
                <div className="font-cond font-bold text-[#0D0F1E] text-[7px] sm:text-[8px] leading-tight tracking-wide uppercase">
                  NV Lic<br /><span className="text-[10px] sm:text-[13px] font-bold">#91170</span><br />Licensed &<br />Insured
                </div>
              </motion.div>
            </motion.div>

            {/* Content column */}
            <motion.div
              initial={{ opacity: 0, x: 40 }} animate={storyInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.15 }}
            >
              <div className="flex items-center gap-3 mb-4 sm:mb-5">
                <div className="w-8 h-px bg-[#3B4FC8]" />
                <span className="font-cond font-semibold text-xs tracking-[0.3em] uppercase text-[#3B4FC8]">About Ultimate Building Services</span>
              </div>
              <h2 className="font-display text-[clamp(40px,5.5vw,72px)] leading-[0.9] text-[#0D0F1E] tracking-wide mb-5 sm:mb-6">
                WE DON&apos;T<br />JUST CLEAN.<br /><span className="text-[#3B4FC8]">WE ELEVATE.</span>
              </h2>
              <p className="text-[#6A6A80] font-light text-base leading-relaxed mb-3 sm:mb-4">
                Ultimate Building Services, Inc. is a <strong className="text-[#0D0F1E] font-semibold">family-owned and operated</strong> commercial janitorial and building maintenance company with over 20 years serving Las Vegas businesses.
              </p>
              <p className="text-[#6A6A80] font-light text-base leading-relaxed mb-3 sm:mb-4">
                While many companies offer basic cleaning, UBS goes several steps further. We take great care to ensure that nothing is overlooked — every corner, every visit, without exception.
              </p>
              <p className="text-[#6A6A80] font-light text-base leading-relaxed mb-7 sm:mb-9">
                A clean working environment leads to better organization, fewer distractions, and a higher level of productivity. That&apos;s not cleaning — that&apos;s a business investment.
              </p>

              {/* CTA buttons — stacked on mobile, side-by-side on sm+ */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                <Link
                  href="/book"
                  className="font-cond font-bold text-sm tracking-widest uppercase bg-[#F5C518] text-[#0D0F1E] px-7 py-3.5 hover:bg-[#D4A800] transition-colors duration-200 cursor-pointer text-center flex items-center justify-center min-h-[48px]"
                >
                  Book a Service
                </Link>
                <Link
                  href="/contact"
                  className="font-cond font-semibold text-sm tracking-widest uppercase border border-[#3B4FC8]/40 text-[#3B4FC8] px-7 py-3.5 hover:bg-[#3B4FC8] hover:text-white transition-all duration-200 cursor-pointer text-center flex items-center justify-center min-h-[48px]"
                >
                  Get a Quote
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats Banner — count-up fires on scroll-in ───────────────────── */}
      <section
        ref={statsRef}
        className="py-12 sm:py-16 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0D0F1E 0%, #1A2470 50%, #0D0F1E 100%)" }}
      >
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{
          backgroundImage: `linear-gradient(rgba(245,197,24,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(245,197,24,0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }} animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.08 }}
                className="text-center group"
              >
                <div
                  className="font-display text-4xl sm:text-5xl text-[#F5C518] leading-none mb-1 sm:mb-2 group-hover:scale-105 transition-transform duration-200"
                  style={{ textShadow: "0 0 30px rgba(245,197,24,0.3)" }}
                >
                  <CountStat target={s.target} suffix={s.suffix} delay={i * 80} start={statsInView} />
                </div>
                <div className="font-cond text-[10px] tracking-widest uppercase text-white/40">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Commitment (Trust & Authority) ───────────────────────────── */}
      <section className="py-16 sm:py-24 bg-[#070915] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse at 25% 60%, rgba(59,79,200,0.12) 0%, transparent 55%), radial-gradient(ellipse at 80% 10%, rgba(245,197,24,0.06) 0%, transparent 50%)",
        }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Promise copy */}
            <motion.div
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7 }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-6 h-px bg-[#F5C518]" />
                <span className="font-cond font-semibold text-xs tracking-[0.3em] uppercase text-[#F5C518]">Our Promise</span>
              </div>
              <h2 className="font-display text-[clamp(36px,5vw,64px)] leading-[0.92] text-white tracking-wide mb-6">
                MORE THAN A<br />CLEANING COMPANY.<br /><span className="text-[#F5C518]">YOUR PARTNER.</span>
              </h2>
              <p className="text-white/60 font-light text-base sm:text-lg leading-[1.7] mb-5">
                When you partner with UBS, you get more than a clean facility — you get a team that treats your property with the same respect they&apos;d give their own. We show up on time, every time, and we don&apos;t leave until the job is done right.
              </p>
              <p className="text-white/50 font-light text-base leading-[1.7]">
                As a family-owned business, our reputation is everything. Every contract is personal. Every client is a long-term relationship, not just a job number.
              </p>
            </motion.div>

            {/* Credentials grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="font-cond font-semibold text-xs tracking-[0.25em] uppercase text-[#F5C518] mb-5">
                Credentials &amp; Certifications
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-8 sm:mb-10">
                {credentials.map((c, i) => (
                  <motion.div
                    key={c.label}
                    initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.06 }}
                    className="flex items-center gap-3 px-4 py-3.5"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(245,197,24,0.12)" }}
                  >
                    <div className="w-4 h-4 text-[#F5C518] flex-shrink-0"><c.Icon /></div>
                    <span className="font-cond font-semibold text-xs sm:text-sm tracking-wider uppercase text-white/75">{c.label}</span>
                  </motion.div>
                ))}
              </div>

              {/* Phone CTA — 44px+ touch target */}
              <motion.a
                href="tel:7027952855"
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-4 group cursor-pointer w-fit"
                aria-label="Call UBS at (702) 795-2855"
              >
                <div className="w-12 h-12 rounded-full bg-[#F5C518] flex items-center justify-center flex-shrink-0 group-hover:bg-white transition-colors duration-200 group-hover:scale-105">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0D0F1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.7A2 2 0 012.18 1h3a2 2 0 012 1.72c.12.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L6.91 8.4a16 16 0 006.72 6.72l1.76-1.76a2 2 0 012.11-.45c.9.36 1.85.6 2.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                </div>
                <div>
                  <div className="font-cond font-bold text-white text-lg tracking-wide group-hover:text-[#F5C518] transition-colors duration-200">
                    (702) 795-2855
                  </div>
                  <div className="font-cond text-[10px] tracking-widest uppercase text-white/30">
                    Call Anytime · 2-Hr Response Guarantee
                  </div>
                </div>
              </motion.a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Core Values ─────────────────────────────────────────────────── */}
      <section ref={valuesRef} className="py-16 sm:py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={valuesInView ? { opacity: 1, y: 0 } : {}}
              className="flex items-center justify-center gap-3 mb-4"
            >
              <div className="w-8 h-px bg-[#3B4FC8]" />
              <span className="font-cond font-semibold text-xs tracking-[0.25em] uppercase text-[#3B4FC8]">How We Operate</span>
              <div className="w-8 h-px bg-[#3B4FC8]" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }} animate={valuesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="font-display text-[clamp(36px,5vw,60px)] leading-[0.92] text-[#0D0F1E] tracking-wide"
            >
              THE UBS <span className="text-[#3B4FC8]">DIFFERENCE</span>
            </motion.h2>
          </div>

          {/* 1 col mobile → 2 col sm → 3 col lg */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }} animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="group p-5 sm:p-6 border-l-[3px] border-[#3B4FC8] hover:bg-[#F5F5F2] transition-colors duration-200"
              >
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-5 h-5 mt-0.5 text-[#3B4FC8] flex-shrink-0"><v.Icon /></div>
                  <div className="font-cond font-bold text-sm tracking-wider uppercase text-[#0D0F1E]">{v.title}</div>
                </div>
                <div className="text-sm text-[#6A6A80] font-light leading-relaxed pl-8">{v.body}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Facilities We Service ────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-[#F5F5F2] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#3B4FC8]" />
              <span className="font-cond font-semibold text-xs tracking-[0.25em] uppercase text-[#3B4FC8]">Who We Serve</span>
              <div className="w-8 h-px bg-[#3B4FC8]" />
            </div>
            <h2 className="font-display text-[clamp(32px,5vw,56px)] leading-[0.92] text-[#0D0F1E] tracking-wide">
              TRUSTED BY EVERY<br /><span className="text-[#3B4FC8]">TYPE OF FACILITY</span>
            </h2>
          </div>

          {/* 2 col mobile → 3 col sm → 4 col lg */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
            {clients.map((c, i) => (
              <motion.div
                key={c}
                initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                className="p-4 sm:p-5 text-center group transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: "white", border: "1px solid rgba(59,79,200,0.1)" }}
              >
                <div className="font-cond font-bold text-xs sm:text-sm tracking-wider uppercase text-[#0D0F1E] group-hover:text-[#3B4FC8] transition-colors duration-200">
                  {c}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-10 sm:mt-12 p-5 sm:p-6"
            style={{ background: "rgba(59,79,200,0.06)", border: "1px solid rgba(59,79,200,0.15)" }}
          >
            <div>
              <div className="font-cond font-bold text-sm tracking-wider uppercase text-[#0D0F1E] mb-1">Don&apos;t see your facility type?</div>
              <div className="text-[#6A6A80] text-sm font-light">We&apos;ve likely cleaned it — tell us about your space.</div>
            </div>
            <Link
              href="/contact"
              className="shrink-0 font-cond font-bold text-xs tracking-widest uppercase bg-[#3B4FC8] text-white px-6 py-3 hover:bg-[#2A3A9E] transition-colors duration-200 cursor-pointer flex items-center min-h-[44px] whitespace-nowrap"
            >
              Get a Custom Quote
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
