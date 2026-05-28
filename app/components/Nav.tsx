"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Services", href: "#services" },
    { label: "About", href: "#about" },
    { label: "Why UBS", href: "#why" },
    { label: "Areas", href: "#areas" },
    { label: "Careers", href: "#careers" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-[#0D0F1E]/95 backdrop-blur-md shadow-2xl shadow-black/30" : "bg-transparent"
        }`}
        style={{ borderBottom: scrolled ? "1px solid rgba(245,197,24,0.15)" : "none" }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-[#F5C518] rounded-sm flex items-center justify-center font-cond font-bold text-[#0D0F1E] text-sm tracking-wider group-hover:scale-105 transition-transform">
              UBS
            </div>
            <div className="hidden sm:block">
              <div className="font-cond font-700 text-white text-sm tracking-widest uppercase leading-none">Ultimate Building</div>
              <div className="font-cond text-[#F5C518] text-xs tracking-[0.2em] uppercase leading-none mt-0.5">Services, Inc.</div>
            </div>
          </a>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="gold-underline font-cond font-semibold text-sm tracking-widest uppercase text-white/60 hover:text-white transition-colors duration-200">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-5">
            <a href="tel:7027952855" className="font-cond font-semibold text-[#F5C518] text-sm tracking-wider">
              (702) 795-2855
            </a>
            <a
              href="#contact"
              className="font-cond font-bold text-xs tracking-widest uppercase bg-[#F5C518] text-[#0D0F1E] px-5 py-2.5 rounded-sm hover:bg-[#D4A800] transition-colors duration-200"
            >
              Get a Quote
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed top-16 left-0 right-0 z-40 bg-[#0D0F1E]/98 backdrop-blur-md border-b border-[#F5C518]/20 py-6 px-6"
          >
            {links.map((l, i) => (
              <motion.a
                key={l.href}
                href={l.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="block font-cond font-700 text-lg tracking-widest uppercase text-white/80 hover:text-[#F5C518] py-3 border-b border-white/5 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </motion.a>
            ))}
            <a href="tel:7027952855" className="block font-display text-2xl text-[#F5C518] mt-4">(702) 795-2855</a>
            <a href="#contact" className="mt-4 block text-center font-cond font-bold text-sm tracking-widest uppercase bg-[#F5C518] text-[#0D0F1E] py-3 rounded-sm" onClick={() => setMenuOpen(false)}>Get a Quote</a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
