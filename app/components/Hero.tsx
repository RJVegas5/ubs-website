"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const words = ["SPACES.", "OFFICES.", "FACILITIES.", "FUTURES."];

interface Particle { x: number; y: number; vx: number; vy: number; size: number; opacity: number; }

// Count-up animation — runs once on mount, respects prefers-reduced-motion
function CountStat({ target, suffix = "", delay = 0 }: { target: number; suffix?: string; delay?: number }) {
  const [count, setCount] = useState(0);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    let rafId = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { setCount(target); return; }
    const timer = setTimeout(() => {
      const duration = 1800;
      let t0: number | null = null;
      const step = (ts: number) => {
        if (t0 === null) t0 = ts;
        const p = Math.min((ts - t0) / duration, 1);
        const eased = 1 - (1 - p) ** 3;
        setCount(Math.round(eased * target));
        if (p < 1) rafId = requestAnimationFrame(step);
      };
      rafId = requestAnimationFrame(step);
    }, delay);
    return () => { clearTimeout(timer); cancelAnimationFrame(rafId); };
  }, [target, delay]);
  return <>{count}{suffix}</>;
}

const PhoneIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.7A2 2 0 012.18 1h3a2 2 0 012 1.72c.12.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L6.91 8.4a16 16 0 006.72 6.72l1.76-1.76a2 2 0 012.11-.45c.9.36 1.85.6 2.81.7A2 2 0 0122 16.92z"/>
  </svg>
);

export default function Hero() {
  const [wordIndex, setWordIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const animRef = useRef<number>(0);
  const { scrollY } = useScroll();
  const imgY = useTransform(scrollY, [0, 600], [0, 120]);
  const textY = useTransform(scrollY, [0, 600], [0, -60]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    const interval = setInterval(() => setWordIndex(i => (i + 1) % words.length), 2600);
    return () => clearInterval(interval);
  }, []);

  // Particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const pts: Particle[] = Array.from({ length: 60 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4 - 0.15,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 197, 24, ${p.opacity})`;
        ctx.fill();
      });
      pts.forEach((p, i) => {
        if (i % 8 === 0) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 30, p.y - p.vy * 30);
          ctx.strokeStyle = `rgba(245, 197, 24, ${p.opacity * 0.3})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
      animRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize); };
  }, []);

  const stats = [
    { label: "Years Experience", target: 20, suffix: "+" },
    { label: "Clients Served",   target: 500, suffix: "+" },
    { label: "Cities Covered",   target: 5,   suffix: "" },
    { label: "Licensed & Insured", target: 100, suffix: "%" },
  ];

  return (
    <section ref={heroRef} className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#070915]">
      {/* Parallax background */}
      <motion.div className="absolute inset-0 z-0 scale-110" style={{ y: imgY }}>
        <Image src="/header-bg.png" alt="Ultimate Building Services Las Vegas" fill className="object-cover object-center" priority quality={95} />
        <div className="absolute inset-0 bg-[#070915]/50" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(105deg, rgba(7,9,21,0.92) 38%, rgba(7,9,21,0.3) 100%)" }} />
        <motion.div
          animate={{ opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 20% 50%, rgba(59,79,200,0.25) 0%, transparent 60%)" }}
        />
        <motion.div
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear", repeatDelay: 4 }}
          className="absolute inset-y-0 w-32 opacity-10"
          style={{ background: "linear-gradient(90deg, transparent, rgba(245,197,24,0.6), transparent)" }}
        />
      </motion.div>

      <canvas ref={canvasRef} className="absolute inset-0 z-[1] pointer-events-none opacity-60" />

      <div className="absolute inset-0 z-[2] opacity-[0.04]" style={{
        backgroundImage: `linear-gradient(rgba(245,197,24,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(245,197,24,0.6) 1px, transparent 1px)`,
        backgroundSize: "80px 80px",
      }} />

      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
        className="absolute top-0 left-0 right-0 h-[3px] z-10 origin-left"
        style={{ background: "linear-gradient(90deg, #F5C518, #D4A800, #F5C518)" }} />

      <div className="absolute bottom-0 left-0 right-0 h-32 z-[2]"
        style={{ background: "linear-gradient(to top, rgba(59,79,200,0.08), transparent)" }} />

      <motion.div style={{ y: textY, opacity }} className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-16 w-full">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-3 mb-7">
            <motion.div animate={{ width: ["0px", "36px"] }} transition={{ duration: 0.8, delay: 0.5 }} className="h-px bg-[#F5C518]" />
            <span className="font-cond font-semibold text-xs tracking-[0.35em] uppercase text-[#F5C518]">Las Vegas&apos; Premier Commercial Cleaner</span>
          </motion.div>

          {/* Animated headline */}
          <div className="overflow-hidden mb-1">
            <motion.div initial={{ y: 120 }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
              className="font-display text-[clamp(72px,10vw,120px)] leading-[0.85] text-white tracking-wide" style={{ textShadow: "0 0 80px rgba(59,79,200,0.3)" }}>
              CLEAN
            </motion.div>
          </div>

          <div className="relative overflow-hidden mb-1" style={{ height: "clamp(72px,10vw,120px)" }}>
            <AnimatePresence mode="wait">
              <motion.div key={wordIndex}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
                className="absolute font-display text-[clamp(72px,10vw,120px)] leading-[0.85] text-[#F5C518] tracking-wide"
                style={{ textShadow: "0 0 60px rgba(245,197,24,0.4)" }}>
                {words[wordIndex]}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="overflow-hidden mb-8">
            <motion.div initial={{ y: 120 }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
              className="font-display text-[clamp(72px,10vw,120px)] leading-[0.85] text-white tracking-wide" style={{ textShadow: "0 0 80px rgba(59,79,200,0.3)" }}>
              STRONGER.
            </motion.div>
          </div>

          <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }}
            className="text-white/70 font-light text-lg leading-relaxed max-w-lg mb-10">
            Ultimate Building Services, Inc. is a family-owned janitorial and building maintenance company serving Las Vegas businesses — going several steps further, every time.
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-wrap gap-4 mb-14">
            <Link href="/contact"
              className="group relative font-cond font-bold text-sm tracking-widest uppercase overflow-hidden rounded-sm"
              style={{ padding: "1px" }}>
              <div className="absolute inset-0 bg-gradient-to-r from-[#F5C518] via-[#fff8dc] to-[#D4A800] rounded-sm" />
              <div className="relative bg-[#F5C518] group-hover:bg-transparent text-[#0D0F1E] group-hover:text-white px-8 py-4 rounded-sm transition-all duration-300 flex items-center gap-2">
                <span>Request a Free Quote</span>
                <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>→</motion.span>
              </div>
              <div className="absolute -inset-2 bg-[#F5C518]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            </Link>

            <Link href="/services"
              className="group font-cond font-semibold text-sm tracking-widest uppercase px-8 py-4 rounded-sm transition-all duration-300"
              style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.15)" }}>
              <span className="text-white/80 group-hover:text-white transition-colors">Our Services</span>
            </Link>

            <a href="tel:7027952855"
              className="group font-cond font-semibold text-sm tracking-widest uppercase px-8 py-4 rounded-sm transition-all duration-300 flex items-center gap-2.5 cursor-pointer"
              style={{ background: "rgba(245,197,24,0.08)", backdropFilter: "blur(12px)", border: "1px solid rgba(245,197,24,0.25)" }}>
              <span className="text-[#F5C518]"><PhoneIcon /></span>
              <span className="text-[#F5C518]">(702) 795-2855</span>
            </a>
          </motion.div>

          {/* Count-up stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8"
            style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            {stats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 + i * 0.1 }}
                className="group">
                <div className="font-display text-4xl md:text-5xl text-[#F5C518] leading-none mb-1 group-hover:scale-110 transition-transform origin-left"
                  style={{ textShadow: "0 0 30px rgba(245,197,24,0.3)" }}>
                  <CountStat target={s.target} suffix={s.suffix} delay={1200 + i * 100} />
                </div>
                <div className="font-cond text-[10px] tracking-widest uppercase text-white/40">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* NV License badge */}
      <motion.div initial={{ opacity: 0, scale: 0.5, rotate: -20 }} animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ delay: 1.4, type: "spring", stiffness: 180 }}
        className="absolute bottom-12 right-10 z-10 hidden md:flex w-24 h-24 rounded-full flex-col items-center justify-center text-center"
        style={{ background: "linear-gradient(135deg, #F5C518, #D4A800)", boxShadow: "0 0 40px rgba(245,197,24,0.4), 0 8px 32px rgba(0,0,0,0.4)" }}>
        <div className="font-cond font-bold text-[#0D0F1E] text-[8px] tracking-wide uppercase leading-tight">NV Lic<br /><span className="text-[11px]">#91170</span><br />Licensed &<br />Insured</div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <span className="font-cond text-[9px] tracking-[0.35em] uppercase text-white/25">Scroll</span>
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}
          className="w-px h-10 bg-gradient-to-b from-[#F5C518]/60 to-transparent" />
      </motion.div>
    </section>
  );
}
