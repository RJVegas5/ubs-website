"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Nav from "./components/Nav";
import TrustBar from "./components/TrustBar";
import Footer from "./components/Footer";

const words = ["SPACES.", "OFFICES.", "FACILITIES.", "FUTURES."];

const serviceSnippets = [
  { num: "01", name: "Commercial Janitorial", desc: "Complete facility cleaning scheduled around your operations.", icon: "🏢" },
  { num: "02", name: "Building Maintenance", desc: "Interior & exterior upkeep keeping your property peak.", icon: "🔧" },
  { num: "03", name: "Pressure Washing", desc: "High-powered exterior cleaning for a sharp first impression.", icon: "💧" },
  { num: "04", name: "Commercial Painting", desc: "Professional interior & exterior painting services.", icon: "🎨" },
  { num: "05", name: "Carpet & Floor Care", desc: "Deep extraction cleaning extending the life of your floors.", icon: "✨" },
  { num: "06", name: "Electrostatic Disinfection", desc: "Advanced 360° disinfection technology for every surface.", icon: "⚡" },
];

const stats = [
  { num: "20+", label: "Years Experience" },
  { num: "500+", label: "Clients Served" },
  { num: "5", label: "Cities Covered" },
  { num: "100%", label: "Licensed & Insured" },
];

export default function Home() {
  const [wordIndex, setWordIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const servicesRef = useRef(null);
  const aboutRef = useRef(null);
  const servicesInView = useInView(servicesRef, { once: true, margin: "-100px" });
  const aboutInView = useInView(aboutRef, { once: true, margin: "-100px" });

  useEffect(() => {
    const interval = setInterval(() => setWordIndex((i) => (i + 1) % words.length), 2400);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <main>
      <Nav />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#0D0F1E]">
        <div className="cursor-glow hidden md:block" style={{ left: mousePos.x, top: mousePos.y }} />
        <div className="absolute inset-0 z-0" style={{
          backgroundImage: `linear-gradient(rgba(59,79,200,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(59,79,200,0.07) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }} />
        <div className="absolute top-1/3 left-1/4 w-[700px] h-[700px] rounded-full opacity-15 pointer-events-none"
          style={{ background: "radial-gradient(circle, #3B4FC8 0%, transparent 70%)" }} />
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-0 left-0 right-0 h-[3px] bg-[#F5C518] origin-left" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-16 w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
                className="flex items-center gap-3 mb-6">
                <div className="w-8 h-px bg-[#F5C518]" />
                <span className="font-cond font-semibold text-xs tracking-[0.3em] uppercase text-[#F5C518]">Las Vegas&apos; Premier Commercial Cleaner</span>
              </motion.div>

              <div className="overflow-hidden mb-2">
                <motion.div initial={{ y: 100 }} animate={{ y: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="font-display text-[clamp(68px,9vw,112px)] leading-[0.88] text-white tracking-wide">CLEAN</motion.div>
              </div>

              <div className="h-[clamp(68px,9vw,112px)] overflow-hidden mb-2 relative">
                <motion.div key={wordIndex} initial={{ y: "100%" }} animate={{ y: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="font-display text-[clamp(68px,9vw,112px)] leading-[0.88] text-[#F5C518] tracking-wide absolute">
                  {words[wordIndex]}
                </motion.div>
              </div>

              <div className="overflow-hidden mb-8">
                <motion.div initial={{ y: 100 }} animate={{ y: 0 }} transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="font-display text-[clamp(68px,9vw,112px)] leading-[0.88] text-white tracking-wide">STRONGER.</motion.div>
              </div>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.7 }}
                className="text-white/55 font-light text-lg leading-relaxed max-w-md mb-10">
                Ultimate Building Services, Inc. is a family-owned janitorial and building maintenance company that goes several steps further — every time, without exception.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.85 }}
                className="flex flex-wrap gap-4">
                <Link href="/contact"
                  className="group relative font-cond font-bold text-sm tracking-widest uppercase bg-[#F5C518] text-[#0D0F1E] px-8 py-4 rounded-sm overflow-hidden transition-transform hover:-translate-y-0.5">
                  <span className="relative z-10">Request a Quote</span>
                  <div className="absolute inset-0 bg-[#D4A800] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Link>
                <Link href="/services"
                  className="font-cond font-semibold text-sm tracking-widest uppercase border border-white/25 text-white/75 px-8 py-4 rounded-sm hover:border-[#F5C518] hover:text-[#F5C518] transition-all duration-200">
                  Our Services
                </Link>
              </motion.div>
            </div>

            {/* Right card */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.4 }}
              className="hidden md:block relative">
              <div className="absolute -top-6 -right-2 font-display text-[180px] leading-none text-white/[0.02] select-none pointer-events-none">UBS</div>
              <div className="relative bg-[#151729] border border-[#3B4FC8]/30 p-8 rounded-sm">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#F5C518] to-transparent" />
                <div className="grid grid-cols-2 gap-6 mb-8">
                  {stats.map((s, i) => (
                    <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.1 }} className="group">
                      <div className="font-display text-5xl text-[#F5C518] leading-none mb-1 group-hover:scale-105 transition-transform origin-left">{s.num}</div>
                      <div className="font-cond text-xs tracking-widest uppercase text-white/40">{s.label}</div>
                    </motion.div>
                  ))}
                </div>
                <div className="border-t border-white/10 pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#F5C518] flex items-center justify-center flex-shrink-0">
                      <span className="font-cond font-bold text-[#0D0F1E] text-xs">#91170</span>
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">NV Contractor License</div>
                      <div className="text-white/40 text-xs mt-0.5">Bid Limit: $45,000 · Licensed & Insured</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {["Janitorial", "Maintenance", "Drywall", "Painting", "Pressure Wash", "Carpet Care"].map((s) => (
                      <div key={s} className="bg-[#3B4FC8]/10 border border-[#3B4FC8]/20 px-2 py-1.5 text-center">
                        <span className="font-cond text-[9px] tracking-wider uppercase text-white/50">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Mobile stats */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
            className="md:hidden mt-12 grid grid-cols-2 gap-4 border-t border-white/10 pt-8">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="font-display text-4xl text-[#F5C518]">{s.num}</div>
                <div className="font-cond text-xs tracking-widest uppercase text-white/40 mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="font-cond text-[10px] tracking-[0.3em] uppercase text-white/30">Scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-px h-8 bg-gradient-to-b from-[#F5C518]/50 to-transparent" />
        </motion.div>
      </section>

      <TrustBar />

      {/* ── ABOUT STRIP ── */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#F5C518]/5 rounded-bl-[120px]" />
        <div ref={aboutRef} className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={aboutInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="relative">
              <div className="absolute -top-4 -left-4 w-14 h-14 bg-[#F5C518] z-0" />
              <div className="relative z-10 bg-gradient-to-br from-[#1A2470] to-[#3B4FC8] aspect-video flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0" style={{
                  backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
                  backgroundSize: "40px 40px",
                }} />
                <div className="font-display text-[120px] text-white/[0.06] select-none leading-none">UBS</div>
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-6 left-6 right-6 bg-[#0D0F1E]/90 border border-[#F5C518]/20 p-4">
                  <div className="flex items-center gap-4">
                    <div className="font-display text-4xl text-[#F5C518] leading-none">20+</div>
                    <div>
                      <div className="font-cond font-bold text-white text-sm tracking-wider uppercase">Years of Excellence</div>
                      <div className="text-white/40 text-xs mt-0.5 font-light">Serving Las Vegas businesses</div>
                    </div>
                  </div>
                </motion.div>
              </div>
              <motion.div initial={{ scale: 0, rotate: -15 }} animate={aboutInView ? { scale: 1, rotate: 0 } : {}} transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                className="absolute -bottom-5 -right-5 w-24 h-24 bg-[#F5C518] rounded-full flex flex-col items-center justify-center text-center shadow-2xl shadow-[#F5C518]/30">
                <div className="font-cond font-bold text-[#0D0F1E] text-[10px] leading-tight tracking-wide uppercase">NV Lic<br /><span className="text-xs">#91170</span></div>
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} animate={aboutInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.15 }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-px bg-[#3B4FC8]" />
                <span className="font-cond font-semibold text-xs tracking-[0.25em] uppercase text-[#3B4FC8]">About UBS</span>
              </div>
              <h2 className="font-display text-[clamp(40px,5vw,64px)] leading-[0.93] text-[#0D0F1E] tracking-wide mb-5">
                WE DON&apos;T JUST<br />CLEAN.<br /><span className="text-[#3B4FC8]">WE ELEVATE.</span>
              </h2>
              <p className="text-[#6A6A80] font-light text-base leading-relaxed mb-4">
                Ultimate Building Services, Inc. is a family-owned and operated janitorial and building maintenance company that truly understands the value of a clean working environment.
              </p>
              <p className="text-[#6A6A80] font-light text-base leading-relaxed mb-4">
                While many companies offer a basic standard cleaning service, UBS goes several steps further. We pride ourselves on our attention to detail and take great care to ensure that nothing is overlooked.
              </p>
              <p className="text-[#6A6A80] font-light text-base leading-relaxed mb-8">
                We proudly serve property owners in Las Vegas, Henderson, Summerlin, North Las Vegas, and Boulder City, Nevada.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/about" className="font-cond font-bold text-sm tracking-widest uppercase bg-[#3B4FC8] text-white px-7 py-3.5 hover:bg-[#2A3A9E] transition-colors">
                  Why Choose UBS
                </Link>
                <Link href="/contact" className="font-cond font-semibold text-sm tracking-widest uppercase border border-[#3B4FC8]/30 text-[#3B4FC8] px-7 py-3.5 hover:bg-[#3B4FC8] hover:text-white transition-all">
                  Get a Quote
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── SERVICES TEASER ── */}
      <section className="py-24 bg-[#0D0F1E] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `repeating-linear-gradient(45deg, #3B4FC8 0, #3B4FC8 1px, transparent 0, transparent 50%)`,
          backgroundSize: "24px 24px",
        }} />
        <div ref={servicesRef} className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={servicesInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6 }}
                className="flex items-center gap-3 mb-4">
                <div className="w-6 h-px bg-[#F5C518]" />
                <span className="font-cond font-semibold text-xs tracking-[0.25em] uppercase text-[#F5C518]">What We Do</span>
              </motion.div>
              <motion.h2 initial={{ opacity: 0, y: 30 }} animate={servicesInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.1 }}
                className="font-display text-[clamp(40px,5.5vw,72px)] leading-[0.92] text-white tracking-wide">
                FULL-SPECTRUM<br /><span className="text-[#F5C518]">FACILITY SERVICES</span>
              </motion.h2>
            </div>
            <motion.div initial={{ opacity: 0 }} animate={servicesInView ? { opacity: 1 } : {}} transition={{ delay: 0.3 }}>
              <Link href="/services" className="inline-flex items-center gap-3 font-cond font-bold text-sm tracking-widest uppercase border border-[#F5C518]/40 text-[#F5C518] px-6 py-3 hover:bg-[#F5C518] hover:text-[#0D0F1E] transition-all">
                View All Services
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </Link>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
            {serviceSnippets.map((svc, i) => (
              <motion.div key={svc.num} initial={{ opacity: 0, y: 30 }} animate={servicesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                className="group bg-[#0D0F1E] p-7 relative overflow-hidden hover:bg-[#151729] transition-colors duration-300">
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#F5C518] group-hover:w-full transition-all duration-500" />
                <div className="absolute top-4 right-4 font-display text-[70px] leading-none text-white/[0.025] select-none">{svc.num}</div>
                <div className="text-3xl mb-4">{svc.icon}</div>
                <h3 className="font-cond font-bold text-base tracking-wider uppercase text-white mb-2">{svc.name}</h3>
                <p className="text-white/45 text-sm font-light leading-relaxed">{svc.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} animate={servicesInView ? { opacity: 1 } : {}} transition={{ delay: 0.6 }}
            className="text-center mt-10">
            <Link href="/services" className="inline-block font-cond font-bold text-sm tracking-widest uppercase bg-[#F5C518] text-[#0D0F1E] px-10 py-4 hover:bg-[#D4A800] transition-colors">
              See All 9 Services
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── AREAS ── */}
      <section className="py-16 bg-[#3B4FC8]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="flex-shrink-0">
              <div className="font-cond font-semibold text-xs tracking-[0.28em] uppercase text-[#F5C518] mb-1">Proudly Serving</div>
              <div className="font-display text-3xl text-white">5 Cities</div>
            </div>
            <div className="flex flex-wrap gap-0">
              {["Las Vegas", "Henderson", "Summerlin", "North Las Vegas", "Boulder City"].map((city, i, arr) => (
                <div key={city} className="flex items-center">
                  <span className="font-display text-[clamp(22px,3vw,32px)] text-white/80 hover:text-[#F5C518] transition-colors cursor-default px-4 py-2">{city}</span>
                  {i < arr.length - 1 && <span className="text-white/20 text-sm">◆</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA STRIP ── */}
      <section className="py-24 bg-[#F5F5F2]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <div className="font-cond font-semibold text-xs tracking-[0.25em] uppercase text-[#3B4FC8] mb-4">Contact Us Today</div>
            <h2 className="font-display text-[clamp(36px,5vw,64px)] leading-[0.93] text-[#0D0F1E] mb-4 tracking-wide">
              ESTABLISH A CLEANING ROUTINE<br /><span className="text-[#3B4FC8]">THAT BEST SERVES YOUR NEEDS</span>
            </h2>
            <p className="text-[#6A6A80] font-light text-lg max-w-xl mx-auto mb-10">
              Questions, comments, or requests? Feel free to reach out — we&apos;d love to hear from you and build a plan around your schedule and budget.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact" className="font-cond font-bold text-sm tracking-widest uppercase bg-[#F5C518] text-[#0D0F1E] px-10 py-4 hover:bg-[#D4A800] transition-colors">
                Get a Free Quote
              </Link>
              <a href="tel:7027952855" className="font-cond font-bold text-sm tracking-widest uppercase bg-[#0D0F1E] text-white px-10 py-4 hover:bg-[#1A2470] transition-colors">
                Call (702) 795-2855
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
