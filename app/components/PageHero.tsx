"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface PageHeroProps {
  tag: string;
  title: string;
  highlight: string;
  sub: string;
  breadcrumb?: { label: string; href: string };
  hideCta?: boolean;
  primaryCta?: { label: string; href?: string; phone?: boolean };
}

export default function PageHero({ tag, title, highlight, sub, breadcrumb, hideCta = false, primaryCta }: PageHeroProps) {
  return (
    <section className="relative pt-24 sm:pt-32 md:pt-36 pb-14 sm:pb-20 md:pb-24 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/header-bg.png"
          alt="Ultimate Building Services Las Vegas"
          fill className="object-cover object-center" priority
        />
        <div className="absolute inset-0 bg-[#0D0F1E]/55" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(13,15,30,0.80) 45%, rgba(13,15,30,0.25) 100%)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-24" style={{ background: "linear-gradient(to top, #0D0F1E, transparent)" }} />
        {/* Subtle blue glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 15% 60%, rgba(59,79,200,0.15) 0%, transparent 55%)" }} />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 z-[1] opacity-[0.04] pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(245,197,24,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(245,197,24,0.4) 1px, transparent 1px)`,
        backgroundSize: "80px 80px",
      }} />

      {/* Gold top bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] z-10" style={{ background: "linear-gradient(90deg, #F5C518, #D4A800, #F5C518)" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">

        {/* Breadcrumb — shown if provided */}
        {breadcrumb && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 mb-5 sm:mb-6"
          >
            <Link href={breadcrumb.href}
              className="font-cond text-[11px] tracking-widest uppercase text-white/35 hover:text-[#F5C518] transition-colors duration-200 cursor-pointer">
              {breadcrumb.label}
            </Link>
            <span className="text-white/20 text-xs">›</span>
            <span className="font-cond text-[11px] tracking-widest uppercase text-white/55">{tag}</span>
          </motion.div>
        )}

        {/* Eyebrow tag */}
        {!breadcrumb && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-4 sm:mb-5"
          >
            <div className="w-8 h-px bg-[#F5C518]" />
            <span className="font-cond font-semibold text-xs tracking-[0.3em] uppercase text-[#F5C518]">{tag}</span>
          </motion.div>
        )}

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-[clamp(44px,8vw,96px)] leading-[0.88] text-white tracking-wide mb-4 sm:mb-5 drop-shadow-2xl"
        >
          {title}<br /><span className="text-[#F5C518]">{highlight}</span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-white/70 font-light text-base sm:text-lg leading-relaxed max-w-xl sm:max-w-2xl"
        >
          {sub}
        </motion.p>

        {/* CTA buttons — hidden when hideCta=true (e.g. contact, careers pages) */}
        {!hideCta && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 mt-7 sm:mt-8"
          >
            <Link
              href={primaryCta?.href ?? "/contact"}
              className="font-cond font-bold text-sm tracking-widest uppercase bg-[#F5C518] text-[#0D0F1E] px-7 py-3.5 hover:bg-white transition-colors duration-200 cursor-pointer text-center flex items-center justify-center min-h-[48px] w-full sm:w-auto"
            >
              {primaryCta?.label ?? "Get a Free Quote"}
            </Link>
            <a
              href="tel:7027952855"
              className="font-cond font-semibold text-sm tracking-widest uppercase text-white px-7 py-3.5 transition-colors duration-200 flex items-center justify-center gap-2.5 cursor-pointer min-h-[48px] w-full sm:w-auto"
              style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.15)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.7A2 2 0 012.18 1h3a2 2 0 012 1.72c.12.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L6.91 8.4a16 16 0 006.72 6.72l1.76-1.76a2 2 0 012.11-.45c.9.36 1.85.6 2.81.7A2 2 0 0122 16.92z"/>
              </svg>
              (702) 795-2855
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}
