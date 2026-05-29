"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Free Site Consultation",
    body: "We visit your facility, assess your needs, and identify exactly what it takes to keep your building at its best. No guesswork — a real walkthrough.",
    icon: "🏢",
    color: "#3B4FC8",
  },
  {
    number: "02",
    title: "Custom Proposal",
    body: "We build a detailed proposal tailored to your facility's size, type, and cleaning frequency — with transparent line-item pricing. No surprises.",
    icon: "📋",
    color: "#F5C518",
  },
  {
    number: "03",
    title: "You Approve, We Schedule",
    body: "Once you approve, we schedule your first service around your business hours — early morning, evening, or weekends. We work around you.",
    icon: "📅",
    color: "#10B981",
  },
  {
    number: "04",
    title: "Ongoing Excellence",
    body: "The same dedicated team shows up every visit. We track completion, welcome feedback, and continuously improve — building a relationship, not just a contract.",
    icon: "⭐",
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
      {/* Decorative grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 0%, rgba(59,79,200,0.08) 0%, transparent 60%)`,
        }}
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
            <span className="font-cond text-xs tracking-[0.3em] uppercase text-[#F5C518]">
              Simple Process
            </span>
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
              {/* Connector line (between steps) */}
              {i < steps.length - 1 && (
                <div
                  className="hidden lg:block absolute top-10 left-full w-full h-px z-0"
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
                {/* Step number */}
                <div
                  className="font-display text-5xl leading-none mb-3 transition-opacity group-hover:opacity-100"
                  style={{ color: step.color, opacity: 0.25 }}
                >
                  {step.number}
                </div>

                {/* Icon */}
                <div className="text-2xl mb-4">{step.icon}</div>

                {/* Title */}
                <h3
                  className="font-cond font-bold text-base tracking-wider uppercase text-white mb-3"
                >
                  {step.title}
                </h3>

                {/* Body */}
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
              className="font-cond font-bold text-sm tracking-widest uppercase bg-[#F5C518] text-[#0D0F1E] px-8 py-4 hover:bg-white transition-colors"
            >
              Book a Walkthrough
            </Link>
            <a
              href="tel:7027952855"
              className="font-cond font-bold text-sm tracking-widest uppercase text-white px-8 py-4 transition-colors"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              📞 Call Us First
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
