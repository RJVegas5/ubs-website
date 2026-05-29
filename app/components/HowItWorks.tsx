"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

// SVG icons — consistent 24×24 viewBox, 1.5 stroke weight
const IconConsultation = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden="true">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);
const IconProposal = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden="true">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <line x1="10" y1="9" x2="8" y2="9"/>
  </svg>
);
const IconSchedule = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden="true">
    <rect x="3" y="4" width="18" height="17" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
    <polyline points="9 16 11 18 15 14"/>
  </svg>
);
const IconExcellence = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full" aria-hidden="true">
    <polyline points="23 4 23 10 17 10"/>
    <polyline points="1 20 1 14 7 14"/>
    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
  </svg>
);
const IconPhone = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.7A2 2 0 012.18 1h3a2 2 0 012 1.72c.12.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L6.91 8.4a16 16 0 006.72 6.72l1.76-1.76a2 2 0 012.11-.45c.9.36 1.85.6 2.81.7A2 2 0 0122 16.92z"/>
  </svg>
);

const steps = [
  {
    number: "01",
    title: "Free Site Consultation",
    body: "We visit your facility, assess your needs, and identify exactly what it takes to keep your building at its best. No guesswork — a real walkthrough.",
    Icon: IconConsultation,
    color: "#3B4FC8",
  },
  {
    number: "02",
    title: "Custom Proposal",
    body: "We build a detailed proposal tailored to your facility's size, type, and cleaning frequency — with transparent line-item pricing. No surprises.",
    Icon: IconProposal,
    color: "#F5C518",
  },
  {
    number: "03",
    title: "You Approve, We Schedule",
    body: "Once you approve, we schedule your first service around your business hours — early morning, evening, or weekends. We work around you.",
    Icon: IconSchedule,
    color: "#10B981",
  },
  {
    number: "04",
    title: "Ongoing Excellence",
    body: "The same dedicated team shows up every visit. We track completion, welcome feedback, and continuously improve — building a relationship, not just a contract.",
    Icon: IconExcellence,
    color: "#FB923C",
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #070915 0%, #0D0F1E 100%)" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: `radial-gradient(circle at 50% 0%, rgba(59,79,200,0.08) 0%, transparent 60%)` }}
      />

      <div ref={ref} className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="w-8 h-px bg-[#F5C518]" />
            <span className="font-cond text-xs tracking-[0.3em] uppercase text-[#F5C518]">Simple Process</span>
            <div className="w-8 h-px bg-[#F5C518]" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="font-display text-[clamp(40px,5.5vw,72px)] leading-[0.92] text-white tracking-wide mb-4"
          >
            HOW IT <span className="text-[#F5C518]">WORKS</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-white/50 font-light text-lg max-w-xl mx-auto"
          >
            From first call to long-term partnership — we make it effortless.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.1, duration: 0.5 }}
              className="relative group"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div
                  className="hidden lg:block absolute top-10 left-full z-0 h-px"
                  style={{
                    background: `linear-gradient(90deg, ${step.color}40, transparent)`,
                    width: "calc(100% - 2rem)",
                    transform: "translateX(1rem)",
                  }}
                />
              )}

              <div
                className="relative z-10 p-6 h-full transition-all duration-300 group-hover:-translate-y-1"
                style={{
                  background: "#0D0F1E",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderTop: `2px solid ${step.color}`,
                }}
              >
                {/* Ghost step number */}
                <div
                  className="font-display text-5xl leading-none mb-3 transition-opacity duration-300 group-hover:opacity-60"
                  style={{ color: step.color, opacity: 0.2 }}
                >
                  {step.number}
                </div>

                {/* Icon */}
                <div
                  className="w-8 h-8 mb-4 transition-all duration-200 group-hover:scale-110 origin-left"
                  style={{ color: step.color }}
                >
                  <step.Icon />
                </div>

                <h3 className="font-cond font-bold text-base tracking-wider uppercase text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-white/50 text-sm font-light leading-relaxed">
                  {step.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-14"
        >
          <p className="text-white/40 text-sm font-light mb-5">
            Ready to start? The first step is free — no obligation.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/book"
              className="font-cond font-bold text-sm tracking-widest uppercase bg-[#F5C518] text-[#0D0F1E] px-8 py-4 hover:bg-white transition-colors duration-200 cursor-pointer"
            >
              Book a Walkthrough
            </Link>
            <a
              href="tel:7027952855"
              className="font-cond font-bold text-sm tracking-widest uppercase text-white px-8 py-4 transition-colors duration-200 flex items-center gap-2.5 cursor-pointer"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)" }}
            >
              <IconPhone />
              Call Us First
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
