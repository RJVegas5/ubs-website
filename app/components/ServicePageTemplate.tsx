"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Nav from "./Nav";
import Footer from "./Footer";

interface FAQ { q: string; a: string; }
interface ServicePageProps {
  service: string;
  slug: string;
  headline: string;
  subheadline: string;
  description: string;
  icon: string;
  color: string;
  includes: string[];
  industries: string[];
  benefits: { title: string; body: string; icon: string }[];
  process: { step: string; title: string; body: string }[];
  faqs: FAQ[];
  metadata?: { title: string; description: string };
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  visible: (i = 0): any => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.6, ease: "easeOut" } }),
};

export default function ServicePageTemplate({
  service, slug, headline, subheadline, description, icon, color,
  includes, industries, benefits, process, faqs,
}: ServicePageProps) {
  return (
    <main style={{ background: "#070915" }}>
      <Nav />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[60vh] flex items-end pb-16 overflow-hidden pt-28">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 30% 50%, ${color}22 0%, transparent 60%)` }} />
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `linear-gradient(rgba(245,197,24,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(245,197,24,0.5) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
          <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, #F5C518, #D4A800, #F5C518)" }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-[#F5C518]" />
            <span className="font-cond text-xs tracking-[0.3em] uppercase text-[#F5C518]">{service}</span>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-10 items-end">
            <div>
              <motion.h1 initial="hidden" animate="visible" custom={1} variants={fadeUp}
                className="font-display text-[clamp(52px,8vw,100px)] leading-[0.88] text-white tracking-wide mb-5">
                {headline}<br /><span className="text-[#F5C518]">{subheadline}</span>
              </motion.h1>
              <motion.p initial="hidden" animate="visible" custom={2} variants={fadeUp}
                className="text-white/60 font-light text-lg leading-relaxed max-w-xl mb-8">
                {description}
              </motion.p>
              <motion.div initial="hidden" animate="visible" custom={3} variants={fadeUp} className="flex flex-wrap gap-4">
                <Link href="/contact"
                  className="font-cond font-bold text-sm tracking-widest uppercase bg-[#F5C518] text-[#0D0F1E] px-8 py-4 hover:bg-white transition-colors">
                  Request Free Estimate →
                </Link>
                <Link href="/book"
                  className="font-cond font-bold text-sm tracking-widest uppercase px-8 py-4 transition-colors"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.2)", color: "white" }}>
                  Book Service
                </Link>
              </motion.div>
            </div>

            {/* Icon + trust */}
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 0.7 }}
              className="hidden lg:flex flex-col items-center gap-6">
              <div className="text-[120px] leading-none">{icon}</div>
              <div className="grid grid-cols-3 gap-3 w-full">
                {["Licensed & Insured", "Free Estimates", "2-Hr Response"].map((t) => (
                  <div key={t} className="text-center p-3" style={{ background: "rgba(245,197,24,0.08)", border: "1px solid rgba(245,197,24,0.2)" }}>
                    <div className="font-cond text-xs tracking-wider uppercase text-[#F5C518]">{t}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── What's Included ──────────────────────────────────────────────── */}
      <section className="py-20 bg-[#0D0F1E]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="flex items-center gap-3 mb-4">
                <div className="w-6 h-px bg-[#F5C518]" />
                <span className="font-cond text-xs tracking-[0.25em] uppercase text-[#F5C518]">What&apos;s Included</span>
              </motion.div>
              <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp}
                className="font-display text-[clamp(36px,5vw,60px)] leading-[0.92] text-white tracking-wide mb-10">
                COMPLETE {service.toUpperCase()}<br /><span className="text-[#F5C518]">SERVICE</span>
              </motion.h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {includes.map((item, i) => (
                  <motion.div key={item} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.5} variants={fadeUp}
                    className="flex items-start gap-3 p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#F5C518] mt-1.5 flex-shrink-0" />
                    <span className="text-white/70 text-sm font-light">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Industries */}
            <div>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp}
                className="flex items-center gap-3 mb-4">
                <div className="w-6 h-px" style={{ background: color }} />
                <span className="font-cond text-xs tracking-[0.25em] uppercase" style={{ color }}>Industries We Serve</span>
              </motion.div>
              <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2} variants={fadeUp}
                className="font-display text-[clamp(32px,4vw,52px)] leading-[0.92] text-white tracking-wide mb-8">
                PERFECT FOR<br /><span style={{ color }}>YOUR BUSINESS</span>
              </motion.h2>
              <div className="grid grid-cols-2 gap-3">
                {industries.map((ind, i) => (
                  <motion.div key={ind} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.4} variants={fadeUp}
                    className="p-4 group cursor-default" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                    whileHover={{ borderColor: color + "66" }}>
                    <div className="font-cond font-bold text-sm tracking-wider uppercase text-white/80 group-hover:text-white transition-colors">{ind}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Benefits ─────────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: "linear-gradient(180deg, #070915 0%, #0D0F1E 100%)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#F5C518]" />
              <span className="font-cond text-xs tracking-[0.3em] uppercase text-[#F5C518]">Why Choose UBS</span>
              <div className="w-8 h-px bg-[#F5C518]" />
            </motion.div>
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp}
              className="font-display text-[clamp(36px,5vw,64px)] leading-[0.92] text-white tracking-wide">
              THE UBS DIFFERENCE
            </motion.h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map((b, i) => (
              <motion.div key={b.title} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.4} variants={fadeUp}
                className="p-7 group relative overflow-hidden transition-all duration-300"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                whileHover={{ background: `${color}08`, borderColor: color + "33" }}>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-500" style={{ background: color }} />
                <div className="text-4xl mb-4">{b.icon}</div>
                <div className="font-cond font-bold text-base tracking-wider uppercase text-white mb-2 group-hover:text-[#F5C518] transition-colors">{b.title}</div>
                <div className="text-white/50 text-sm font-light leading-relaxed">{b.body}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ──────────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#0D0F1E]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#3B4FC8]" />
              <span className="font-cond text-xs tracking-[0.3em] uppercase text-[#3B4FC8]">How It Works</span>
              <div className="w-8 h-px bg-[#3B4FC8]" />
            </motion.div>
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp}
              className="font-display text-[clamp(36px,5vw,64px)] leading-[0.92] text-white tracking-wide">
              OUR PROCESS
            </motion.h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((p, i) => (
              <motion.div key={p.step} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.5} variants={fadeUp}
                className="relative p-6 text-center"
                style={{ background: "rgba(59,79,200,0.06)", border: "1px solid rgba(59,79,200,0.2)" }}>
                <div className="font-display text-[64px] text-[#3B4FC8]/20 leading-none mb-2">{p.step}</div>
                <div className="font-cond font-bold text-base tracking-wider uppercase text-white mb-2">{p.title}</div>
                <div className="text-white/50 text-sm font-light leading-relaxed">{p.body}</div>
                {i < process.length - 1 && (
                  <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-6 h-px bg-[#3B4FC8]/40 z-10" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: "linear-gradient(180deg, #0D0F1E 0%, #070915 100%)" }}>
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#F5C518]" />
              <span className="font-cond text-xs tracking-[0.3em] uppercase text-[#F5C518]">FAQ</span>
              <div className="w-8 h-px bg-[#F5C518]" />
            </motion.div>
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp}
              className="font-display text-[clamp(36px,5vw,56px)] leading-[0.92] text-white tracking-wide">
              COMMON QUESTIONS
            </motion.h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FAQItem key={faq.q} faq={faq} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0D0F1E 0%, #1A2470 50%, #0D0F1E 100%)" }}>
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `linear-gradient(rgba(245,197,24,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(245,197,24,0.5) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="font-cond font-semibold text-xs tracking-[0.3em] uppercase text-[#F5C518] mb-5">Ready to Get Started?</motion.div>
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp}
            className="font-display text-[clamp(40px,6vw,72px)] leading-[0.92] text-white mb-5 tracking-wide">
            GET A FREE {service.toUpperCase()}<br /><span className="text-[#F5C518]">ESTIMATE TODAY</span>
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2} variants={fadeUp}
            className="text-white/50 font-light text-lg max-w-xl mx-auto mb-10">
            We respond within 2 business hours — guaranteed. No obligation, no pressure.
          </motion.p>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={3} variants={fadeUp}
            className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact"
              className="font-cond font-bold text-sm tracking-widest uppercase bg-[#F5C518] text-[#0D0F1E] px-10 py-4 hover:bg-white transition-colors">
              Request Free Estimate →
            </Link>
            <Link href="/book"
              className="font-cond font-bold text-sm tracking-widest uppercase px-10 py-4 transition-colors"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.2)", color: "white" }}>
              Book a Walkthrough
            </Link>
            <a href="tel:7027952855"
              className="font-cond font-semibold text-sm tracking-widest uppercase px-8 py-4 flex items-center gap-2"
              style={{ background: "rgba(245,197,24,0.08)", border: "1px solid rgba(245,197,24,0.25)", color: "#F5C518" }}>
              📞 (702) 795-2855
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function FAQItem({ faq, index }: { faq: FAQ; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} custom={index * 0.3}
      variants={fadeUp}>
      <button onClick={() => setOpen(!open)} className="w-full text-left p-5 flex items-center justify-between gap-4 transition-all duration-200"
        style={{ background: open ? "rgba(245,197,24,0.08)" : "rgba(255,255,255,0.03)", border: `1px solid ${open ? "rgba(245,197,24,0.3)" : "rgba(255,255,255,0.08)"}` }}>
        <span className="font-cond font-bold text-sm tracking-wider uppercase text-white/90">{faq.q}</span>
        <span className="text-[#F5C518] text-lg flex-shrink-0 transition-transform duration-300" style={{ transform: open ? "rotate(45deg)" : "none" }}>+</span>
      </button>
      {open && (
        <div className="p-5 text-white/60 text-sm font-light leading-relaxed"
          style={{ background: "rgba(255,255,255,0.02)", borderLeft: "1px solid rgba(245,197,24,0.2)", borderRight: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          {faq.a}
        </div>
      )}
    </motion.div>
  );
}
