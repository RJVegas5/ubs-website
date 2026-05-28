"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const links = [
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
    { label: "Careers", href: "/careers" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#070915]/90 backdrop-blur-xl shadow-2xl shadow-black/50"
            : "bg-transparent"
        }`}
        style={{ borderBottom: scrolled ? "1px solid rgba(245,197,24,0.15)" : "none" }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between" style={{ height: scrolled ? "64px" : "80px", transition: "height 0.4s ease" }}>

          {/* Logo — transparent PNG, just render it */}
          <Link href="/" className="flex items-center group flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Ultimate Building Services Inc - Full Service Janitorial Las Vegas"
              width={220}
              height={88}
              className="object-contain group-hover:scale-105 transition-transform duration-300"
              style={{ height: scrolled ? "52px" : "64px", width: "auto", transition: "height 0.4s ease" }}
              priority
            />
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`font-cond font-semibold text-sm tracking-widest uppercase transition-all duration-200 relative pb-1 group ${
                    isActive(l.href) ? "text-[#F5C518]" : "text-white/70 hover:text-white"
                  }`}
                >
                  {l.label}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-[#F5C518] transition-all duration-300 ${isActive(l.href) ? "w-full" : "w-0 group-hover:w-full"}`} />
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-5">
            <a href="tel:7027952855" className="font-cond font-semibold text-[#F5C518] text-sm tracking-wider hover:text-white transition-colors">
              (702) 795-2855
            </a>
            {/* Glowing CTA button */}
            <Link href="/contact" className="relative font-cond font-bold text-xs tracking-widest uppercase bg-[#F5C518] text-[#0D0F1E] px-5 py-2.5 rounded-sm hover:bg-white transition-colors duration-200 group overflow-hidden">
              <span className="relative z-10">Get a Quote</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {/* Glow */}
              <div className="absolute -inset-1 bg-[#F5C518]/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            </Link>
          </div>

          <button className="md:hidden flex flex-col gap-1.5 p-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-[80px] left-0 right-0 z-40 bg-[#070915]/98 backdrop-blur-xl border-b border-[#F5C518]/20 py-6 px-6"
          >
            <Image src="/logo.png" alt="UBS" width={160} height={64} className="h-12 w-auto object-contain mb-5" />
            {links.map((l, i) => (
              <motion.div key={l.href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                <Link href={l.href} className={`block font-cond font-bold text-lg tracking-widest uppercase py-3 border-b border-white/5 transition-colors ${isActive(l.href) ? "text-[#F5C518]" : "text-white/80"}`}>
                  {l.label}
                </Link>
              </motion.div>
            ))}
            <a href="tel:7027952855" className="block font-display text-2xl text-[#F5C518] mt-5 mb-4">(702) 795-2855</a>
            <Link href="/contact" className="block text-center font-cond font-bold text-sm tracking-widest uppercase bg-[#F5C518] text-[#0D0F1E] py-3">Get a Quote</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
